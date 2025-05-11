import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { HealthModule } from '../health/health.module'
import { InboxModule } from '../inbox/inbox.module'
import { Workflow } from './entities/workflow.entity'
import { WorkflowsInboxProcessor } from './workflows-inbox.processor'
import { WorkflowsController } from './workflows.controller'
import { WorkflowsService } from './workflows.service'

@Module({
  imports: [TypeOrmModule.forFeature([Workflow]), HealthModule, InboxModule],
  controllers: [WorkflowsController],
  providers: [WorkflowsService, WorkflowsInboxProcessor],
})
export class WorkflowsModule {}
