import { useState } from 'react';
import {
  format,
  endOfMonth,
  startOfWeek,
  startOfMonth,
  eachDayOfInterval,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  startOfYear,
  endOfYear,
  eachMonthOfInterval,
  setMonth,
  getMonth,
} from 'date-fns';
import styles from './styles.module.scss';

// 3

const getDays = (date: Date) => {
  const GRID_DAYS_AMOUNT = 42;

  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const monthDays = eachDayOfInterval({ start: addDays(monthStart, 1), end: monthEnd });

  const monthStartWeekDay = startOfWeek(monthStart, { weekStartsOn: 1 });

  const prevMonthDays = eachDayOfInterval({ start: monthStartWeekDay, end: monthStart });

  const nextMonthDays = eachDayOfInterval({
    start: addDays(monthEnd, 1),
    end: addDays(monthEnd, GRID_DAYS_AMOUNT - (prevMonthDays.length + monthDays.length)),
  });

  const days = [prevMonthDays, monthDays, nextMonthDays].flat();

  return days;
};

const getMonths = (date: Date) => {
  const yearStart = startOfYear(date);
  const yearEnd = endOfYear(date);

  const months = eachMonthOfInterval({ start: yearStart, end: yearEnd });

  return months;
};

const getDateWithNewMonth = (date: Date) => setMonth(date, getMonth(date));

const DatePicker = () => {
  const [date, setDate] = useState(new Date());

  const [pickerType, setPickerType] = useState<'day' | 'month' | 'year'>('day');

  const prevMonth = () => setDate(subMonths(date, 1));
  const nextMonth = () => setDate(addMonths(date, 1));

  const setDayPicker = () => setPickerType('day');
  const setMonthPicker = () => setPickerType('month');
  const setYearPicker = () => setPickerType('year');

  const days = getDays(date);
  const months = getMonths(date);

  const handleMonthClick = (newDate: Date) => {
    setDate(getDateWithNewMonth(newDate));
    setDayPicker();
  };

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <button type="button" onClick={prevMonth}>
          {'<'}
        </button>
        <div className={styles.monthYear}>
          <button type="button" onClick={setMonthPicker}>
            {format(date, 'MMMM')}
          </button>{' '}
          <button type="button" onClick={setYearPicker}>
            {format(date, 'yyyy')}
          </button>
        </div>
        <button type="button" onClick={nextMonth}>
          {'>'}
        </button>
      </div>
      {pickerType === 'day' && (
        <div className={styles.dayPicker}>
          {days.map((day) => (
            <button
              type="button"
              key={String(day)}
              style={{ opacity: isSameMonth(day, date) ? 1 : 0.2 }}
            >
              {format(day, 'dd')}
            </button>
          ))}
        </div>
      )}
      {pickerType === 'month' && (
        <div className={styles.monthPicker}>
          {months.map((month) => (
            <button type="button" key={String(month)} onClick={() => handleMonthClick(month)}>
              {format(month, 'MMMM')}
            </button>
          ))}
        </div>
      )}
      {pickerType === 'year' && 'year'}
    </div>
  );
};

export default DatePicker;
