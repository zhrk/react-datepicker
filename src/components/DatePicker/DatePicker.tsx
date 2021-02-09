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
  startOfDecade,
  endOfDecade,
  eachYearOfInterval,
  subYears,
  addYears,
  setYear,
  getYear,
  isValid,
} from 'date-fns';
import styles from './styles.module.scss';

// 3

const YEAR_BEFORE_DECADE = 0;
const YEAR_AFTER_DECADE = 11;

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

const getYears = (date: Date) => {
  const decadeStart = startOfDecade(date);
  const decadeEnd = endOfDecade(date);

  const years = eachYearOfInterval({
    start: subYears(decadeStart, 1),
    end: addYears(decadeEnd, 1),
  });

  return years;
};

const getDateWithNewMonth = (date: Date) => setMonth(date, getMonth(date));
const getDateWithNewYear = (date: Date) => setYear(date, getYear(date));

const DatePicker = () => {
  const [date, setDate] = useState(new Date());
  const [value, setValue] = useState('');

  const [pickerType, setPickerType] = useState<'day' | 'month' | 'year'>('day');

  const prevMonth = () => setDate(subMonths(date, 1));
  const nextMonth = () => setDate(addMonths(date, 1));

  const prevYear = () => setDate(subYears(date, 1));
  const nextYear = () => setDate(addYears(date, 1));

  const prevDecade = () => setDate(subYears(date, 10));
  const nextDecade = () => setDate(addYears(date, 10));

  const setDayPicker = () => setPickerType('day');
  const setMonthPicker = () => setPickerType('month');
  const setYearPicker = () => setPickerType('year');

  const days = getDays(date);
  const months = getMonths(date);
  const years = getYears(date);

  const handleDayClick = (newDate: Date) => {
    setValue(format(newDate, 'dd MMMM, yyyy'));
    setDate(newDate);
  };

  const handleMonthClick = (newDate: Date) => {
    setDate(getDateWithNewMonth(newDate));
    setDayPicker();
  };

  const handleYearClick = (newDate: Date) => {
    setDate(getDateWithNewYear(newDate));
    setMonthPicker();
  };

  const handlePrevClick = () => {
    if (pickerType === 'day') return prevMonth();
    if (pickerType === 'month') return prevYear();
    if (pickerType === 'year') return prevDecade();

    return undefined;
  };

  const handleNextClick = () => {
    if (pickerType === 'day') return nextMonth();
    if (pickerType === 'month') return nextYear();
    if (pickerType === 'year') return nextDecade();

    return undefined;
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.currentTarget.value;
    const parsedDate = new Date(newValue);

    if (isValid(parsedDate)) setDate(parsedDate);

    setValue(newValue);
  };

  return (
    <div className={styles.container}>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        className={styles.input}
        placeholder="Select Date"
      />
      <div className={styles.top}>
        <button type="button" onClick={handlePrevClick}>
          {'<'}
        </button>
        <div className={styles.title}>
          {pickerType === 'day' && (
            <>
              <button type="button" onClick={setMonthPicker}>
                {format(date, 'MMMM')}
              </button>{' '}
              <button type="button" onClick={setYearPicker}>
                {format(date, 'yyyy')}
              </button>
            </>
          )}
          {pickerType === 'month' && (
            <>
              <button type="button" onClick={setMonthPicker}>
                {format(date, 'yyyy')}
              </button>
            </>
          )}
          {pickerType === 'year' && (
            <>
              <button type="button" onClick={setMonthPicker}>
                {`${format(startOfDecade(date), 'yyyy')} - ${format(endOfDecade(date), 'yyyy')}`}
              </button>
            </>
          )}
        </div>
        <button type="button" onClick={handleNextClick}>
          {'>'}
        </button>
      </div>
      {pickerType === 'day' && (
        <div className={styles.dayPicker}>
          {days.map((day) => (
            <button
              type="button"
              key={String(day)}
              onClick={() => handleDayClick(day)}
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
      {pickerType === 'year' && (
        <div className={styles.yearPicker}>
          {years.map((year, index) => (
            <button
              type="button"
              key={String(year)}
              onClick={() => handleYearClick(year)}
              style={{
                opacity: index === YEAR_BEFORE_DECADE || index === YEAR_AFTER_DECADE ? 0.2 : 1,
              }}
            >
              {format(year, 'yyyy')}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DatePicker;
