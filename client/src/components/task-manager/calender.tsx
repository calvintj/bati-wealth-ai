import { useState } from "react";
import { format, addMonths, subMonths } from "date-fns";
import { id } from "date-fns/locale/id";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

const Calendar = ({ setSelectedDate, selectedDate }: { setSelectedDate: (date: Date) => void, selectedDate: Date }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const today = new Date();
  // const todayStyle = { color: 'red' };

  const daysShort = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

  const endOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  );

  // Move this into a useEffect or useMemo if needed
  const daysInMonth = Array.from(
    { length: endOfMonth.getDate() },
    (_, i) =>
      new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i + 1)
  );

  // Utility to check if two dates are the same day
  const isSameDay = (d1: Date, d2: Date) =>
    d1?.getFullYear() === d2?.getFullYear() &&
    d1?.getMonth() === d2?.getMonth() &&
    d1?.getDate() === d2?.getDate();

  return (
    <div className="text-white rounded-lg w-full bg-[#1D283A] p-4 h-full">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-bold">
          {format(currentMonth, "MMMM yyyy", { locale: id })}
        </h2>
        <div className="flex items-center gap-2">
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

      {/* All dates in the month */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {daysInMonth.map((date) => {
          const isSelected = isSameDay(date, selectedDate);
          const isToday = isSameDay(date, today);
          return (
            <div
              key={date.toISOString()}
              className={`cursor-pointer p-2 rounded-full 
                ${isSelected ? "bg-blue-900 text-blue-400" : ""}
                ${isToday && !isSelected ? "text-blue-400" : ""}
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
