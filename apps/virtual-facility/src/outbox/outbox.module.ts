import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { TypeOrmModule } from '@nestjs/typeorm'
import { WORKFLOWS_SERVICE } from '../constants'
import { Outbox } from './entities/outbox.entity'
import { OutboxEntitySubscriber } from './outbox.entity-subscriber'
import { OutboxProcessor } from './outbox.processor'
import { OutboxService } from './outbox.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([Outbox]),
    ClientsModule.register([
      {
        name: WORKFLOWS_SERVICE,
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL as string],
          queue: 'workflows-service',
        },
      },
    ]),
  ],
  providers: [OutboxService, OutboxProcessor, OutboxEntitySubscriber],
})
export class OutboxModule {}
