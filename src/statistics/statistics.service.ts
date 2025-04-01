import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import type { I18nTranslations } from '@i18n/i18n.generated';
import type { IResponse } from '@common/interfaces/response.interface';
import type { IStats } from '@statistics/interfaces/statistics.interface';
import { Appointment } from '@appointments/schema/appointment.schema';
import { EStatus } from '@common/enums/status.enum';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectModel('Appointment') private readonly appointmentModel: Model<Appointment>,
    private readonly i18nService: I18nService<I18nTranslations>,
  ) {}

  async countApposByProfessional(id: string): Promise<IResponse<IStats>> {
    const isValidId: boolean = isValidObjectId(id);
    if (!isValidId) throw new HttpException(this.i18nService.t('exception.common.invalidId'), HttpStatus.BAD_REQUEST);

    const total: number = await this.appointmentModel.countDocuments({ professional: id });
    const attended: number = await this.appointmentModel.countDocuments({ professional: id, status: EStatus.ATTENDED });
    const notAttended: number = await this.appointmentModel.countDocuments({ professional: id, status: EStatus.NOT_ATTENDED });
    const notStatus: number = await this.appointmentModel.countDocuments({ professional: id, status: EStatus.NOT_STATUS });

    const currentDate: Date = new Date();
    const currentDateString: string = currentDate.toISOString().split('T')[0];
    const currentHour: string = currentDate.getHours().toString();
    const waiting: number = await this.appointmentModel.countDocuments({
      professional: id,
      status: EStatus.NOT_STATUS,
      $or: [{ day: { $gt: currentDateString } }, { day: currentDateString, hour: { $gt: currentHour } }],
    });

    if (!total) throw new HttpException(this.i18nService.t('exception.statistics.processingError'), HttpStatus.BAD_REQUEST);

    const data: IStats = {
      total,
      attended,
      notAttended,
      notStatus: notStatus - waiting,
      waiting,
    };

    return {
      data,
      message: this.i18nService.t('response.statistics.obtained'),
      statusCode: HttpStatus.OK,
    };
  }
}
