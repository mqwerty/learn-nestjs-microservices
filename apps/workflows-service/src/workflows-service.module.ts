import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'
import { TypeOrmModule } from '@nestjs/typeorm'
import { HealthModule } from './health/health.module'
import { InboxModule } from './inbox/inbox.module'
import { WorkflowsModule } from './workflows/workflows.module'

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      autoLoadEntities: true,
      synchronize: true,
    }),
    WorkflowsModule,
    HealthModule,
    InboxModule,
  ],
  controllers: [],
  providers: [],
})
export class WorkflowsServiceModule {}
