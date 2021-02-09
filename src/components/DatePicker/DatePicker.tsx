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
} from 'date-fns';
import styles from './styles.module.scss';

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

  return [prevMonthDays, monthDays, nextMonthDays].flat();
};

const DatePicker = () => {
  const [date, setDate] = useState(new Date());

  const prevMonth = () => setDate(subMonths(date, 1));
  const nextMonth = () => setDate(addMonths(date, 1));

  const days = getDays(date);

  return (
    <div className={styles.container}>
      <div className={styles.buttons}>
        <button type="button" onClick={prevMonth}>
          prev
        </button>
        <button type="button" onClick={nextMonth}>
          next
        </button>
      </div>
      <div className={styles.picker}>
        {days.map((day) => (
          <div key={String(day)} style={{ opacity: isSameMonth(day, date) ? 1 : 0.2 }}>
            {format(day, 'dd')}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DatePicker;
