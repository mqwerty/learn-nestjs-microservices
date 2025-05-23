import { CreateWorkflowDto } from '@app/workflows'
import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { InjectRepository } from '@nestjs/typeorm'
import { lastValueFrom } from 'rxjs'
import { DataSource, Repository } from 'typeorm'
import { WORKFLOWS_SERVICE } from '../constants'
import { Outbox } from '../outbox/entities/outbox.entity'
import { CreateBuildingDto } from './dto/create-building.dto'
import { UpdateBuildingDto } from './dto/update-building.dto'
import { Building } from './entities/building.entity'

@Injectable()
export class BuildingsService {
  private readonly logger = new Logger(BuildingsService.name)

  constructor(
    @InjectRepository(Building)
    private readonly buildingsRepository: Repository<Building>,
    @Inject(WORKFLOWS_SERVICE)
    private readonly workflowsService: ClientProxy,
    private readonly dataSource: DataSource
  ) {}

  async findAll(): Promise<Building[]> {
    return this.buildingsRepository.find()
  }

  async findOne(id: number): Promise<Building> {
    const building = await this.buildingsRepository.findOne({ where: { id } })
    if (!building) {
      throw new NotFoundException(`Building #${id} does not exist`)
    }
    return building
  }

  async create(createBuildingDto: CreateBuildingDto): Promise<Building> {
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    const buildingsRepository = queryRunner.manager.getRepository(Building)
    const outboxRepository = queryRunner.manager.getRepository(Outbox)

    try {
      const building = buildingsRepository.create({ ...createBuildingDto })
      const newBuildingEntity = await buildingsRepository.save(building)

      await outboxRepository.save({
        type: 'workflows.create',
        payload: {
          name: 'My workflow',
          buildingId: building.id,
        },
        target: WORKFLOWS_SERVICE.description,
      })

      await queryRunner.commitTransaction()

      this.logger.debug(`Created building ${JSON.stringify(newBuildingEntity)}`)
      return newBuildingEntity
    } catch (error) {
      await queryRunner.rollbackTransaction()
      throw error
    } finally {
      await queryRunner.release()
    }
  }

  async update(id: number, updateBuildingDto: UpdateBuildingDto): Promise<Building> {
    const building = await this.buildingsRepository.preload({
      id: +id,
      ...updateBuildingDto,
    })

    if (!building) {
      throw new NotFoundException(`Building #${id} does not exist`)
    }
    return this.buildingsRepository.save(building)
  }

  async remove(id: number): Promise<Building> {
    const building = await this.findOne(id)
    return this.buildingsRepository.remove(building)
  }

  async createWorkflow(buildingId: number) {
    const newWorkflow = await lastValueFrom(
      this.workflowsService.send('workflows.create', {
        name: 'My Workflow',
        buildingId,
      } as CreateWorkflowDto)
    )
    this.logger.debug(`Created workflow ${JSON.stringify(newWorkflow)}`)
    return newWorkflow
  }
}
