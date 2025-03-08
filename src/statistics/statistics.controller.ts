import { Controller, Get, Param, Query } from '@nestjs/common';
import type { IResponse } from '@common/interfaces/response.interface';
import type { IStats } from '@statistics/interfaces/statistics.interface';
import { StatisticsService } from '@statistics/statistics.service';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('countApposByProfessional')
  countApposByProfessional(@Query('id') id: string): Promise<IResponse<IStats>> {
    return this.statisticsService.countApposByProfessional(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.statisticsService.findOne(+id);
  }
}
