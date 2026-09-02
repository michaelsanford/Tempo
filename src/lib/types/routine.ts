import type { Time } from './time';

/** 0 = Sunday */
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface RoutineEvent {
	id: string;
	label: string;
	leaveBy: Time;
	activeDays: Weekday[];
	enabled: boolean;
	createdAt: string;
}
