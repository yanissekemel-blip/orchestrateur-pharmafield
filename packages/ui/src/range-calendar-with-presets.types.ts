export type StrictDateRange = {
  from: Date;
  to: Date;
};

export type RangeCalendarPreset = {
  id: string;
  label: string;
  getRange: (today: Date) => StrictDateRange;
  disabled?: boolean;
};
