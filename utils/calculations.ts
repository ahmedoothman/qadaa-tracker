import moment from 'moment-hijri';

// Type definitions
export interface CalculationResult {
  total: number;
  years: number;
  months: number;
  days: number;
  originalDays: number;
  excludedDays: number;
}

export interface RamadanData {
  year: number; // Hijri year
  gregorianYear: number; // Gregorian year when Ramadan started
  startDate: string; // Gregorian date of Ramadan start
  endDate: string; // Gregorian date of Ramadan end
  totalDays: number;
  completedDays: number;
}

export interface ValidationResult {
  isValid: boolean;
  error: string | null;
}

/**
 * Calculate the number of days between two dates, optionally excluding menstrual days
 */
export const calculateDaysBetween = (
  start: string,
  end: string,
  menstrualDays: number = 0
): CalculationResult => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Calculate menstrual days to exclude
  const months = Math.floor(diffDays / 30);
  const totalMenstrualDays = menstrualDays * months;
  const adjustedDays = Math.max(0, diffDays - totalMenstrualDays);

  // Break down into years, months, days
  const years = Math.floor(adjustedDays / 365);
  const remainingDays = adjustedDays % 365;
  const remainingMonths = Math.floor(remainingDays / 30);
  const days = remainingDays % 30;

  return {
    total: adjustedDays,
    years,
    months: remainingMonths,
    days,
    originalDays: diffDays,
    excludedDays: totalMenstrualDays,
  };
};

/**
 * Calculate Ramadan periods between two dates using Hijri calendar
 */
export const calculateRamadans = (
  startDate: string,
  endDate: string
): RamadanData[] => {
  const start = moment(startDate);
  const end = moment(endDate);
  const ramadans: RamadanData[] = [];

  // Convert start date to Hijri to get the starting Hijri year
  const startHijriYear = start.iYear();

  // Convert end date to Hijri to get the ending Hijri year
  const endHijriYear = end.iYear();

  // Iterate through each Hijri year in the range
  for (let hijriYear = startHijriYear; hijriYear <= endHijriYear; hijriYear++) {
    // Ramadan is the 9th month in Hijri calendar
    // Create a date for 1st of Ramadan in this Hijri year
    const ramadanStart = moment().iYear(hijriYear).iMonth(8).iDate(1); // iMonth is 0-indexed, so 8 = Ramadan (9th month)

    // Ramadan can be 29 or 30 days - we'll use 30 as default
    // Users can adjust completed days if needed
    const ramadanEnd = moment(ramadanStart).add(29, 'days');

    // Check if this Ramadan falls within the user's date range
    if (
      ramadanEnd.isSameOrAfter(start, 'day') &&
      ramadanStart.isSameOrBefore(end, 'day')
    ) {
      // Convert to JavaScript Date and format to ensure Latin numerals
      const startDateObj = ramadanStart.toDate();
      const endDateObj = ramadanEnd.toDate();

      ramadans.push({
        year: hijriYear,
        gregorianYear: ramadanStart.year(),
        startDate: startDateObj.toISOString().split('T')[0],
        endDate: endDateObj.toISOString().split('T')[0],
        totalDays: 30, // Ramadan is 29 or 30 days
        completedDays: 0,
      });
    }
  }

  return ramadans;
};

/**
 * Format a number of days into a human-readable string
 */
export const formatDaysToString = (days: number): string => {
  const years = Math.floor(days / 365);
  const remainingAfterYears = days % 365;
  const months = Math.floor(remainingAfterYears / 30);
  const remainingDays = remainingAfterYears % 30;

  const parts: string[] = [];
  if (years > 0) parts.push(`${years} year${years > 1 ? 's' : ''}`);
  if (months > 0) parts.push(`${months} month${months > 1 ? 's' : ''}`);
  if (remainingDays > 0 || parts.length === 0) {
    parts.push(`${remainingDays} day${remainingDays !== 1 ? 's' : ''}`);
  }

  return parts.join(', ');
};

/**
 * Calculate progress percentage
 */
export const calculatePercentage = (
  completed: number,
  total: number
): number => {
  if (total <= 0) return 0;
  return Math.min(100, Math.round((completed / total) * 100));
};

/**
 * Validate date range
 */
export const validateDateRange = (
  start: string,
  end: string
): ValidationResult => {
  if (!start || !end) {
    return { isValid: false, error: 'Both start and end dates are required' };
  }

  const startDate = new Date(start);
  const endDate = new Date(end);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return { isValid: false, error: 'Invalid date format' };
  }

  if (startDate > endDate) {
    return { isValid: false, error: 'Start date must be before end date' };
  }

  if (endDate > new Date()) {
    return { isValid: false, error: 'End date cannot be in the future' };
  }

  return { isValid: true, error: null };
};
