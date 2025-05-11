import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { WorkflowsServiceModule } from './workflows-service.module'

async function bootstrap() {
  const app = await NestFactory.create(WorkflowsServiceModule)
  app.useGlobalPipes(new ValidationPipe())
  app.connectMicroservice<MicroserviceOptions>(
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL as string],
        queue: 'workflows-service',
        noAck: false,
      },
    },
    { inheritAppConfig: true }
  )
  await app.startAllMicroservices()
  await app.listen(3001)
}

void bootstrap()
