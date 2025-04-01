import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import type { IResponse } from '@common/interfaces/response.interface';
import type { IStats } from '@statistics/interfaces/statistics.interface';
import { ERole } from '@common/enums/role.enum';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { Roles } from '@auth/decorators/roles.decorator';
import { RolesGuard } from '@auth/guards/roles.guard';
import { StatisticsService } from '@statistics/statistics.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles([ERole.Super, ERole.Admin])
@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('countApposByProfessional')
  countApposByProfessional(@Query('id') id: string): Promise<IResponse<IStats>> {
    return this.statisticsService.countApposByProfessional(id);
  }
}
