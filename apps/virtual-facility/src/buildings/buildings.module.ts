import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { TypeOrmModule } from '@nestjs/typeorm'
import { WORKFLOWS_SERVICE } from '../constants'
import { BuildingsController } from './buildings.controller'
import { BuildingsService } from './buildings.service'
import { Building } from './entities/building.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([Building]),
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
  controllers: [BuildingsController],
  providers: [BuildingsService],
})
export class BuildingsModule {}
