import { CreateWorkflowDto, UpdateWorkflowDto } from '@app/workflows'
import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common'
import { Ctx, EventPattern, Payload, type RmqContext } from '@nestjs/microservices'
import { InjectRepository } from '@nestjs/typeorm'
import type { Channel, Message } from 'amqplib'
import { Repository } from 'typeorm'
import { Inbox } from '../inbox/entities/inbox.entity'
import { WorkflowsService } from './workflows.service'

@Controller('workflows')
export class WorkflowsController {
  constructor(
    private readonly workflowsService: WorkflowsService,
    @InjectRepository(Inbox)
    private readonly inboxRepository: Repository<Inbox>
  ) {}

  @EventPattern('workflows.create')
  async create(@Payload() createWorkflowDto: CreateWorkflowDto, @Ctx() context: RmqContext) {
    const message = context.getMessage() as Message
    const inboxMessage = await this.inboxRepository.findOne({
      where: {
        messageId: message.properties.messageId,
      },
    })

    if (!inboxMessage) {
      await this.inboxRepository.save({
        messageId: message.properties.messageId,
        pattern: context.getPattern(),
        status: 'pending',
        payload: createWorkflowDto,
      })
    }

    const channel = context.getChannelRef() as Channel
    channel.ack(message)
  }

  @Get()
  findAll() {
    return this.workflowsService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.workflowsService.findOne(+id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWorkflowDto: UpdateWorkflowDto) {
    return this.workflowsService.update(+id, updateWorkflowDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workflowsService.remove(+id)
  }
}
