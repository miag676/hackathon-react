/* eslint-disable react/prop-types */
import React from "react";

const TimetableComponent = ({ timetable }) => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const hours = Array.from({ length: 10 }, (_, i) => 8 + i); // Hours from 8 to 17

  return (
    <table>
      <thead>
        <tr>
          <th>Time/Day</th>
          {days.map((day) => (
            <th key={day}>{day}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {hours.map((hour) => (
          <tr key={hour}>
            <td>{`${hour}:00`}</td>
            {days.map((day) => (
              <td key={day + hour}>
                {/* Check and render the course names for this day and hour */}
                {timetable && timetable[day] && timetable[day][hour]
                  ? timetable[day][hour].join(", ")
                  : ""}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TimetableComponent;
