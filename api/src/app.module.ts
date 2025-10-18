import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TownPlanningModule } from './town-planning';

@Module({
  imports: [TownPlanningModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
