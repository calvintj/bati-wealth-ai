import { useState, useMemo } from "react";
import { format, addMonths, subMonths, startOfMonth, getDay } from "date-fns";
import { id } from "date-fns/locale/id";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

const Calendar = ({
  setSelectedDate,
  selectedDate,
}: {
  setSelectedDate: (date: Date) => void;
  selectedDate: Date;
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const today = new Date();
  // const todayStyle = { color: 'red' };

  const daysShort = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

  const calendarDays = useMemo(() => {
    // Get the first day of the month
    const firstDayOfMonth = startOfMonth(currentMonth);
    // Get what day of the week the first day falls on (0 = Sunday, 1 = Monday, etc.)
    const startDay = getDay(firstDayOfMonth);

    // Get the last day of the month
    const endOfMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      0
    );
    const daysInCurrentMonth = endOfMonth.getDate();

    // Get days from previous month to fill the first week
    const prevMonthDays = [];
    for (let i = 0; i < startDay; i++) {
      const day = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        -i
      );
      prevMonthDays.unshift(day);
    }

    // Current month days
    const currentMonthDays = Array.from(
      { length: daysInCurrentMonth },
      (_, i) =>
        new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i + 1)
    );

    // Next month days to fill the last week if needed
    const nextMonthDays = [];
    const totalDaysDisplayed =
      Math.ceil((startDay + daysInCurrentMonth) / 7) * 7;
    const nextMonthDaysNeeded =
      totalDaysDisplayed - (prevMonthDays.length + currentMonthDays.length);

    for (let i = 1; i <= nextMonthDaysNeeded; i++) {
      const day = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + 1,
        i
      );
      nextMonthDays.push(day);
    }

    return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
  }, [currentMonth]);

  // Utility to check if two dates are the same day
  const isSameDay = (d1: Date, d2: Date) =>
    d1?.getFullYear() === d2?.getFullYear() &&
    d1?.getMonth() === d2?.getMonth() &&
    d1?.getDate() === d2?.getDate();

  // Check if a date is in the current month
  const isCurrentMonth = (date: Date) =>
    date.getMonth() === currentMonth.getMonth();

  return (
    <div className="text-black dark:text-white rounded-lg w-full bg-white dark:bg-[#1D283A] p-4 h-full border-1 border-gray-300 dark:border-none">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-bold">
          {format(currentMonth, "MMMM yyyy", { locale: id })}
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const today = new Date();
              setCurrentMonth(today);
              setSelectedDate(today);
            }}
            className="cursor-pointer text-sm mr-2 bg-blue-800 px-2 py-1 rounded text-white"
          >
            Today
          </button>
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="cursor-pointer text-2xl"
          >
            <MdKeyboardArrowLeft />
          </button>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="cursor-pointer text-2xl"
          >
            <MdKeyboardArrowRight />
          </button>
        </div>
      </div>

      {/* Days of the week */}
      <div className="grid grid-cols-7 mb-2 gap-1 text-center text-gray-400">
        {daysShort.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* All dates in the calendar */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {calendarDays.map((date) => {
          const isSelected = isSameDay(date, selectedDate);
          const isToday = isSameDay(date, today);
          const isOtherMonth = !isCurrentMonth(date);

          return (
            <div
              key={date.toISOString()}
              className={`cursor-pointer p-2 rounded-full 
                ${isSelected ? "bg-blue-900 text-blue-400" : ""}
                ${isToday && !isSelected ? "text-blue-400" : ""}
                ${isOtherMonth ? "text-gray-600" : ""}
              `}
              onClick={() => setSelectedDate(date)}
            >
              {format(date, "d")}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
