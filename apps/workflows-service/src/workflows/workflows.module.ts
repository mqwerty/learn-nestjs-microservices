import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { HealthModule } from '../health/health.module'
import { Workflow } from './entities/workflow.entity'
import { WorkflowsController } from './workflows.controller'
import { WorkflowsService } from './workflows.service'

@Module({
  imports: [TypeOrmModule.forFeature([Workflow]), HealthModule],
  controllers: [WorkflowsController],
  providers: [WorkflowsService],
})
export class WorkflowsModule {}
