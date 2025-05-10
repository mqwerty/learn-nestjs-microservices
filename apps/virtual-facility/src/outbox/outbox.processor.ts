import { Inject, Injectable, Logger } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { Cron, CronExpression } from '@nestjs/schedule'
import { InjectRepository } from '@nestjs/typeorm'
import { lastValueFrom } from 'rxjs'
import { Repository } from 'typeorm'
import { WORKFLOWS_SERVICE } from '../constants'
import { Outbox } from './entities/outbox.entity'
import { OutboxService } from './outbox.service'

@Injectable()
export class OutboxProcessor {
  private readonly logger = new Logger(OutboxProcessor.name)

  constructor(
    private readonly outboxService: OutboxService,
    @Inject(WORKFLOWS_SERVICE)
    private readonly workflowsService: ClientProxy,
    @InjectRepository(Outbox)
    private readonly outboxRepository: Repository<Outbox>
  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async processOutboxMessages() {
    const messages = await this.outboxService.getUnprocessedMessages({
      target: WORKFLOWS_SERVICE.description as string,
      take: 100,
    })

    this.logger.debug(`Processing outbox messages ${JSON.stringify(messages)}`)

    await Promise.all(
      messages.map(async message => {
        await this.dispatchWorkflowEvent(message)
        await this.outboxRepository.delete(message.id)
      })
    )
  }

  async dispatchWorkflowEvent(outbox: Outbox) {
    await lastValueFrom(this.workflowsService.emit(outbox.type, outbox.payload))
  }
}
