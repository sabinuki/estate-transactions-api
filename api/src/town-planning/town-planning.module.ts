import { Module } from '@nestjs/common';
import { TownPlanningController } from './controllers';
import { TownPlanningUseCase } from './use-cases';
import { TownPlanningInfrastructure } from './infrastructures';
import { INTERFACES } from './town-planning.constants';

@Module({
  controllers: [TownPlanningController],
  providers: [
    TownPlanningUseCase,
    {
      provide: INTERFACES.I_USE_CASE,
      useClass: TownPlanningUseCase,
    },
    {
      provide: INTERFACES.I_REPOSITORY,
      useClass: TownPlanningInfrastructure,
    },
  ],
  exports: [],
})
export class TownPlanningModule {}
