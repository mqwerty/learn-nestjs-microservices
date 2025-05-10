import { Module } from '@nestjs/common'
import { NotificationsServiceController } from './notifications-service.controller'

@Module({
  imports: [],
  controllers: [NotificationsServiceController],
  providers: [],
})
export class NotificationsServiceModule {}
