import { IWorkingDay } from '@professionals/interfaces/working-day.interface';

export interface IConfiguration {
  scheduleTimeInit: string;
  scheduleTimeEnd: string;
  slotDuration: number;
  timeSlotUnavailableInit?: string;
  timeSlotUnavailableEnd?: string;
  workingDays: IWorkingDay[];
}
