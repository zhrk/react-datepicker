import { useState } from 'react';
import {
  format,
  addDays,
  setYear,
  isValid,
  getYear,
  setMonth,
  subYears,
  getMonth,
  addYears,
  setHours,
  addMonths,
  subMonths,
  endOfYear,
  setMinutes,
  endOfMonth,
  startOfWeek,
  endOfDecade,
  startOfYear,
  startOfMonth,
  startOfDecade,
  eachDayOfInterval,
  eachYearOfInterval,
  eachMonthOfInterval,
  getHours as getHour,
  getMinutes as getMinute,
} from 'date-fns';

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

const getHours = (date: Date) => {
  const hours = [];

  for (let i = 0; i < 24; i += 1) {
    hours.push(setHours(date, i));
  }

  return hours;
};

const getMinutes = (date: Date) => {
  const minutes = [];

  for (let i = 0; i < 60; i += 1) {
    minutes.push(setMinutes(date, i));
  }

  return minutes;
};

const getDateWithNewMonth = (date: Date) => setMonth(date, getMonth(date));
const getDateWithNewYear = (date: Date) => setYear(date, getYear(date));
const getDateWithNewHour = (date: Date) => setHours(date, getHour(date));
const getDateWithNewMinute = (date: Date) => setMinutes(date, getMinute(date));

interface Config {
  date?: Date;
}

const useDatePicker = (config: Config = {}) => {
  const [value, setValue] = useState('');
  const [date, setDate] = useState(config.date || new Date());
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
  const hours = getHours(date);
  const minutes = getMinutes(date);

  const handleDayClick = (newDate: Date) => {
    setValue(format(newDate, 'dd MMMM, yyyy, HH:mm'));
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

  const handleHourClick = (newDate: Date) => {
    const dateWithNewHour = getDateWithNewHour(newDate);

    setDate(dateWithNewHour);
    setValue(format(dateWithNewHour, 'dd MMMM, yyyy, HH:mm'));
  };

  const handleMinuteClick = (newDate: Date) => {
    const dateWithNewMinute = getDateWithNewMinute(newDate);

    setDate(dateWithNewMinute);
    setValue(format(dateWithNewMinute, 'dd MMMM, yyyy, HH:mm'));
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

  return {
    date,
    value,
    pickerType,
    prevMonth,
    nextMonth,
    prevYear,
    nextYear,
    prevDecade,
    nextDecade,
    setDayPicker,
    setMonthPicker,
    setYearPicker,
    days,
    months,
    years,
    hours,
    minutes,
    handleDayClick,
    handleMonthClick,
    handleYearClick,
    handleHourClick,
    handleMinuteClick,
    handlePrevClick,
    handleNextClick,
    handleChange,
  };
};

export default useDatePicker;
