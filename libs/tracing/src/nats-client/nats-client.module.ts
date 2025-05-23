import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { NATS_BROKER } from './constants'
import { NatsClientProxy } from './nats-client.proxy'

@Module({
  imports: [
    ClientsModule.register([
      {
        name: NATS_BROKER,
        transport: Transport.NATS,
        options: {
          servers: process.env.NATS_URL,
        },
      },
    ]),
  ],
  providers: [NatsClientProxy],
  exports: [NatsClientProxy],
})
export class NatsClientModule {}
