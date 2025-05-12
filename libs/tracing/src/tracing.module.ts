import { Module } from '@nestjs/common'
import { NatsClientModule } from './nats-client/nats-client.module'
import { TracingLogger } from './tracing.logger'
import { TracingService } from './tracing.service'

@Module({
  providers: [TracingService, TracingLogger],
  exports: [TracingService, TracingLogger],
  imports: [NatsClientModule],
})
export class TracingModule {}
