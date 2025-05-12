import { TracingModule } from '@app/tracing'
import { Module } from '@nestjs/common'
import { AlarmsClassifierServiceController } from './alarms-classifier-service.controller'

@Module({
  imports: [TracingModule],
  controllers: [AlarmsClassifierServiceController],
  providers: [],
})
export class AlarmsClassifierServiceModule {}
