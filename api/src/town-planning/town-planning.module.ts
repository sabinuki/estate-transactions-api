import { Module } from '@nestjs/common';
import { TownPlanningController } from './town-planning.controller';

@Module({
  controllers: [TownPlanningController],
  providers: [],
  exports: [],
})
export class TownPlanningModule {}
