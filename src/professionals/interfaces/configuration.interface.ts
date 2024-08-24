export interface IConfiguration {
  scheduleTimeInit: string;
  scheduleTimeEnd: string;
  slotDuration: number;
  timeSlotUnavailableInit?: string;
  timeSlotUnavailableEnd?: string;
  workingDays: IWorkingDay[];
}

export interface IWorkingDay {
  day: number;
  value: boolean;
}