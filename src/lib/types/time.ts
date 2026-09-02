export interface Time {
	/** 0-23 */
	hour: number;
	/** 0-59 */
	minute: number;
}

export type TimePrecision = 'hour' | 'halfHour' | 'quarterHour' | 'fiveMinute' | 'minute';
