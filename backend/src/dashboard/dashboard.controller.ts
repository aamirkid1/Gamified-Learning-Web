import {
  Controller,
  Get,
  Param,
} from '@nestjs/common';

import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(
    private dashboardService: DashboardService,
  ) {}

  @Get('stats/:teacherId')
  getStats(
    @Param('teacherId')
    teacherId: string,
  ) {
    return this.dashboardService.getStats(
      Number(teacherId),
    );
  }
}