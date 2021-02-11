import { format, isSameMonth, startOfDecade, endOfDecade, isSameDay } from 'date-fns';
import styles from './styles.module.scss';
import useDatePicker from '../../hooks/useDatePicker';

// 10

const YEAR_BEFORE_DECADE = 0;
const YEAR_AFTER_DECADE = 11;

const DatePicker = () => {
  const {
    date,
    days,
    value,
    years,
    hours,
    months,
    minutes,
    pickerType,
    handleChange,
    setYearPicker,
    setMonthPicker,
    handleDayClick,
    handlePrevClick,
    handleYearClick,
    handleHourClick,
    handleNextClick,
    handleMonthClick,
    handleMinuteClick,
  } = useDatePicker();

  return (
    <div className={styles.test}>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        className={styles.input}
        placeholder="Select Date"
      />
      <div className={styles.container}>
        <div className={styles.datePicker}>
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
                    {`${format(startOfDecade(date), 'yyyy')} - ${format(
                      endOfDecade(date),
                      'yyyy'
                    )}`}
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
                  style={{
                    opacity: isSameMonth(day, date) ? 1 : 0.2,
                    outline: isSameDay(day, new Date(value)) ? '4px solid red' : undefined,
                  }}
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
        {value && (
          <div className={styles.timePicker}>
            <div>
              {hours.map((hour) => (
                <button type="button" onClick={() => handleHourClick(hour)}>
                  {format(hour, 'HH')}
                </button>
              ))}
            </div>
            <div>
              {minutes.map((minute) => (
                <button type="button" onClick={() => handleMinuteClick(minute)}>
                  {format(minute, 'mm')}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DatePicker;
