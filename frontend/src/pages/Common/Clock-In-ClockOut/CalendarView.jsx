import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const CalendarView = ({ calendarEvents, onDateSelect, selectedDate }) => {
const [date, setDate] = useState(new Date());
  const [view, setView] = useState("month");
const selectedDateText = moment(selectedDate).format("DD");

  const handleSelectSlot = (slotInfo) => {
    alert(`Selected: ${moment(slotInfo.start).format("DD MMM YYYY")}`);
  };

  const handleSelectEvent = (event) => {
    alert(`Event: ${event.title}`);
  };

  const handleNavigate = (newDate) => {
    setDate(newDate);
  };

  const handleViewChange = (newView) => {
    setView(newView);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-5">
     <h3 className="text-lg font-semibold mb-4 text-center">
  Task Calendar
</h3>
    <div className="text-xl font-bold text-gray-900 mb-3 text-center">
  Today Date :{selectedDateText}
</div>
      <div style={{ height: 650 }}>
<Calendar
  localizer={localizer}
  events={calendarEvents}
  startAccessor="start"
  endAccessor="end"
 date={date}
  view="month"
  onNavigate={handleNavigate}
  selectable
  onSelectSlot={(slotInfo) => onDateSelect(slotInfo.start)}
  popup
  views={["month"]}
  dayMaxEventRows={1}
/>
      </div>
    </div>
  );
};

export default CalendarView; 