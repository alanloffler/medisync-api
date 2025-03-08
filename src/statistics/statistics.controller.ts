import { Controller, Get, Param } from '@nestjs/common';
import type { IResponse } from '@common/interfaces/response.interface';
import { StatisticsService } from './statistics.service';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('countApposByProfessional')
  countApposByProfessional(): Promise<IResponse<number>> {
    return this.statisticsService.countApposByProfessional();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.statisticsService.findOne(+id);
  }
}
