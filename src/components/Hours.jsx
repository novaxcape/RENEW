import React from 'react';

const Hours = () => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  return (
    <div className="step-content">
      <div className="card-title">Operating Hours</div>
      <p className="card-subtitle">Set your opening and closing hours of each day of the week.</p>
      
      {days.map((day) => (
        <div key={day} className="day-row">
          <span className="day-name">{day}</span>
          <div className="day-controls">
            <input type="checkbox" /> 
            <span className="open-label">Open</span>
            <select className="time-select">
              <option>10 AM</option>
              <option>9 AM</option>
              <option>8 AM</option>
            </select>
            <span className="to-label">to</span>
            <select className="time-select">
              <option>4 PM</option>
              <option>5 PM</option>
              <option>6 PM</option>
            </select>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Hours;