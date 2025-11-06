import React, { useState } from 'react';

export const Calendar = ({ selected, onSelect, className = '' }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
  const days = [];
  
  // Add empty cells for days before the first of the month
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(<div key={`empty-${i}`} className="p-2"></div>);
  }
  
  // Add the days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const isSelected = selected && date.toDateString() === selected.toDateString();
    
    days.push(
      <button
        key={day}
        type="button"
        onClick={() => onSelect && onSelect(date)}
        className={`p-2 rounded-lg hover:bg-blue-100 transition-colors ${
          isSelected ? 'bg-blue-600 text-white hover:bg-blue-700' : ''
        }`}
      >
        {day}
      </button>
    );
  }

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  return (
    <div className={`bg-white border border-gray-300 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
          className="p-1 hover:bg-gray-100 rounded"
        >
          ←
        </button>
        <div className="font-semibold">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </div>
        <button
          type="button"
          onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
          className="p-1 hover:bg-gray-100 rounded"
        >
          →
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-sm">
        <div className="font-semibold p-2">Su</div>
        <div className="font-semibold p-2">Mo</div>
        <div className="font-semibold p-2">Tu</div>
        <div className="font-semibold p-2">We</div>
        <div className="font-semibold p-2">Th</div>
        <div className="font-semibold p-2">Fr</div>
        <div className="font-semibold p-2">Sa</div>
        {days}
      </div>
    </div>
  );
};
