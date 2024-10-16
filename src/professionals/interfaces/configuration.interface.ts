import type { IWorkingDay } from '@professionals/interfaces/working-day.interface';

export interface IConfiguration {
  scheduleTimeInit: string;
  scheduleTimeEnd: string;
  slotDuration: number;
  unavailableTimeSlot: IUnavailableTimeSlot;
  workingDays: IWorkingDay[];
}

interface IUnavailableTimeSlot {
  timeSlotUnavailableInit: string | null;
  timeSlotUnavailableEnd: string | null;
}
