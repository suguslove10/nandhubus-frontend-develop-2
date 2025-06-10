import React, { useState, useEffect, useRef } from 'react';
import { isSameDay, addDays, isAfter, isBefore } from 'date-fns';
import { usePathname } from 'next/navigation';

interface ClockTimePickerProps {
  selectedTime: Date | null;
  onChange: (date: Date) => void;
  onClose: () => void;
  startDate?: Date | null;
  numberOfDays?: number;
  isEndDatePicker?: boolean;
  isPackage: boolean;
  style?: React.CSSProperties;
}

const ClockTimePicker: React.FC<ClockTimePickerProps> = ({ 
  selectedTime, 
  onChange, 
  onClose, 
  startDate,
  numberOfDays = 0,
  isEndDatePicker = false,
  isPackage = false,
  
  style
}) => {
  const initialTime = selectedTime || new Date();
  const [hours, setHours] = useState(initialTime.getHours());
  const [minutes, setMinutes] = useState(initialTime.getMinutes());
  const [period, setPeriod] = useState(hours >= 12 ? 'PM' : 'AM');
  const [activeSelect, setActiveSelect] = useState<'hours' | 'minutes'>('hours');
  const pickerRef = useRef<HTMLDivElement>(null);

  const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;

 
  
const getMaxEndTime = () => {
  if (!isEndDatePicker || !startDate) return null;
  
  const exactEndTime = new Date(startDate);
  exactEndTime.setDate(startDate.getDate() + numberOfDays);
  return exactEndTime;
};
  const maxEndTime = getMaxEndTime();
  // Calculate min/max allowed times based on start date and number of days
  const getTimeRestrictions = () => {
    if (!isEndDatePicker || !startDate) return { minHour: 0, maxHour: 23 };

    const isSameDayTrip = numberOfDays <= 1;
    const startHour = startDate.getHours();
    const startMinute = startDate.getMinutes();

    if (isSameDayTrip) {
      // For same-day trips, end time must be after start time
      return { 
        minHour: startHour,
        minMinute: startMinute,
        maxHour: 23
      };
    } else {
      // For multi-day trips, end time must be on the last day at 10 PM
      return {
        minHour: 0,
        maxHour: 22, // 10 PM
        maxMinute: 0
      };
    }
  };

  const { minHour, maxHour, minMinute, maxMinute } = getTimeRestrictions();


  // Only apply package-specific time restrictions if it's a package
  const isTimeDisabled = (hour: number, minute: number = 0) => {
    if (!isEndDatePicker || !startDate) return false;
  
    // Convert to 24-hour format based on current period
    const hour24 = period === 'PM' && hour < 12 ? hour + 12 :
                  period === 'AM' && hour === 12 ? 0 : hour;
  
    // Create test time
    const testTime = selectedTime ? new Date(selectedTime) : new Date();
    testTime.setHours(hour24, minute, 0, 0);
    
    // Check if we're selecting the same day
    const isSameSelectedDay = selectedTime && startDate && isSameDay(selectedTime, startDate);
    
    // If it's the same day, we need to ensure end time is after start time
    if (isSameSelectedDay) {
      // If hours are less than start time hours, disable
      if (hour24 < startDate.getHours()) {
        return true;
      }
      
      // If same hour, check minutes
      if (hour24 === startDate.getHours() && minute <= startDate.getMinutes()) {
        return true;
      }
    }
  
    if (isPackage) {
      // Package-specific logic
      const exactEndTime = new Date(startDate);
      exactEndTime.setDate(startDate.getDate() + numberOfDays);
      
      if (numberOfDays <= 0) {
        // Same day - must be after start time
        return isBefore(testTime, startDate);
      } else {
        // Multi-day - must be before or equal to exact end time (same time X days later)
        return isAfter(testTime, exactEndTime);
      }
    } else {
      // Non-package logic - just disable times before start time
      return isBefore(testTime, startDate);
    }
  };

  
  useEffect(() => {
    if (selectedTime && isEndDatePicker && startDate) {
      let newHours = selectedTime.getHours();
      let newMinutes = selectedTime.getMinutes();
      
      // Check if this is the same day as the start date
      const isSameSelectedDay = isSameDay(selectedTime, startDate);
      
      // If same day and start time is PM, force end time to PM
      if (isSameSelectedDay && startDate.getHours() >= 12) {
        setPeriod('PM');
        
        // If the current selected hour is in AM format, convert to PM
        if (newHours < 12) {
          // Default to an hour after start time
          newHours = startDate.getHours() + 1;
          if (newHours > 23) newHours = 23;
        }
      }
      
      if (isPackage) {
        // Package-specific adjustments
        if (numberOfDays <= 1) {
          // Same day - must be after start time
          if (isSameDay(startDate, selectedTime)) {
            if (isBefore(selectedTime, startDate)) {
              // Auto-adjust to 60 minutes after start time
              newHours = startDate.getHours();
              newMinutes = startDate.getMinutes() + 60;
              if (newMinutes >= 60) {
                newMinutes = 0;
                newHours++;
              }
            }
          }
        } else {
          // Multi-day - must be between start time on first day and 10 PM on last day
          const lastDay = addDays(startDate, numberOfDays - 1);
          
          if (isSameDay(selectedTime, startDate)) {
            // On start day - must be after start time
            if (isBefore(selectedTime, startDate)) {
              newHours = startDate.getHours();
              newMinutes = startDate.getMinutes();
            }
          } else if (isSameDay(selectedTime, lastDay)) {
            // On last day - must be before 10 PM
            if (selectedTime.getHours() > 22 || 
                (selectedTime.getHours() === 22 && selectedTime.getMinutes() > 0)) {
              newHours = 22; // 10 PM
              newMinutes = 0;
            }
          }
        }
      } else {
        // Non-package - just ensure time is after start time
        if (isBefore(selectedTime, startDate)) {
          newHours = startDate.getHours();
          newMinutes = startDate.getMinutes() + 60;
          if (newMinutes >= 60) {
            newMinutes = 0;
            newHours++;
          }
        }
      }
      
      setHours(newHours);
      setMinutes(newMinutes);
      setPeriod(newHours >= 12 ? 'PM' : 'AM');
    }
  }, [selectedTime, isEndDatePicker, startDate, numberOfDays, isPackage]);

  const renderClockFace = () => {
    const clockSize = 160;
    const numberRadius = 60;
    const center = clockSize / 2;
    const numberSize = 24;

    if (activeSelect === 'hours') {
      return (
        <div className="relative" style={{ width: `${clockSize}px`, height: `${clockSize}px` }}>
          <div className="absolute inset-0 rounded-full border border-gray-200"></div>
          <div className="absolute w-1 h-1 rounded-full bg-[#01374e]"
            style={{ top: `${center - 0.5}px`, left: `${center - 0.5}px` }}></div>
          
          {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((hour) => {
            const angle = (hour - 3) * 30 * (Math.PI / 180);
            const left = numberRadius * Math.cos(angle) + center;
            const top = numberRadius * Math.sin(angle) + center;
            const isSelected = hour === displayHours;
            const disabled = isTimeDisabled(hour);
            
            return (
              <div
                key={hour}
                className={`absolute flex items-center justify-center rounded-full text-xs transition-all
                  ${isSelected ? 'bg-[#01374e] text-white' : 
                    disabled ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-blue-50 cursor-pointer'}`}
                style={{ 
                  width: `${numberSize}px`,
                  height: `${numberSize}px`,
                  left: `${left - numberSize/2}px`,
                  top: `${top - numberSize/2}px`,
                  lineHeight: `${numberSize}px`,
                  transform: isSelected ? 'scale(1.1)' : 'scale(1)'
                }}
                onClick={() => !disabled && handleHourClick(hour)}
              >
                {hour}
              </div>
            );
          })}
          
          <div 
            className="absolute w-1 bg-[#01374e] origin-bottom rounded-t-full"
            style={{ 
              height: `${numberRadius - 10}px`,
              transform: `rotate(${displayHours * 30}deg)`,
              transformOrigin: 'bottom center',
              bottom: '50%',
              left: `calc(50% - 0.5px)`
            }}
          />
        </div>
      );
    } else {
      return (
        <div className="relative" style={{ width: `${clockSize}px`, height: `${clockSize}px` }}>
          <div  
          style={{borderColor:"#a0a0a0"}}
          className="absolute inset-0 rounded-full border "></div>
          <div className="absolute w-1 h-1 rounded-full bg-[#0f7bab] "
            style={{ top: `${center - 0.5}px`, left: `${center - 0.5}px`  }}></div>
          
          {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map((minute) => {
            const angle = (minute / 5 - 3) * 30 * (Math.PI / 180);
            const left = numberRadius * Math.cos(angle) + center;
            const top = numberRadius * Math.sin(angle) + center;
            const isSelected = minute === minutes;
            const disabled = isTimeDisabled(hours, minute);
            
            return (
              <div
                key={minute}
                className={`absolute flex items-center justify-center rounded-full text-xs transition-all
                  ${isSelected ? 'bg-[#0f7bab] text-white' : 
                    disabled ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-blue-50 cursor-pointer'}`}
                style={{ 
                  width: `${numberSize}px`,
                
                  height: `${numberSize}px`,
                  left: `${left - numberSize/2}px`,
                  top: `${top - numberSize/2}px`,
                  lineHeight: `${numberSize}px`,
                  transform: isSelected ? 'scale(1.1)' : 'scale(1)'
                }}
                onClick={() => !disabled && handleMinuteClick(minute)}
              >
                {minute.toString().padStart(2, '0')}
              </div>
            );
          })}
          
          <div 
            className="absolute w-1 bg-[#0f7bab] origin-bottom rounded-t-full"
            style={{ 
              height: `${numberRadius - 10}px`,
              transform: `rotate(${minutes * 6}deg)`,
              transformOrigin: 'bottom center',
              bottom: '50%',
              left: `calc(50% - 0.5px)`
            }}
          />
        </div>
      );
    }
  };

 


  const handleHourClick = (hour: number) => {
    const newHour = hour === 12 
      ? (period === 'AM' ? 0 : 12) 
      : (period === 'PM' ? hour + 12 : hour);
    
    setHours(newHour);
  };

  const handleMinuteClick = (minute: number) => {
    setMinutes(minute);
  };

  const handlePeriodChange = (newPeriod: 'AM' | 'PM') => {
    // If we're on the end date picker with same day and trying to switch to AM when start time is PM,
    // don't allow this change
    if (isEndDatePicker && startDate && selectedTime && 
        isSameDay(selectedTime, startDate) && startDate.getHours() >= 12 && newPeriod === 'AM') {
      return; // Don't allow changing to AM
    }
    
    // Convert current hours to 24-hour format
    const current24Hour = period === 'PM' && hours < 12 ? hours + 12 : 
                         period === 'AM' && hours === 12 ? 0 : hours;
  
    // Calculate new hours in 24-hour format after period change
    let new24Hour = current24Hour;
    if (newPeriod === 'AM' && period === 'PM') {
      new24Hour = current24Hour - 12;
    } else if (newPeriod === 'PM' && period === 'AM') {
      new24Hour = current24Hour + 12;
    }
  
    // Ensure the time stays within valid range
    if (isEndDatePicker && startDate) {
      const start24Hour = startDate.getHours();
      
      // Check if we're on the same day as the start date
      const isSameSelectedDay = selectedTime && isSameDay(selectedTime, startDate);
      
      // If we're on the same day and the new period would make the time earlier than
      // or equal to the start time, adjust the time
      if (isSameSelectedDay) {
        if (new24Hour < start24Hour || 
          (new24Hour === start24Hour && minutes <= startDate.getMinutes())) {
          new24Hour = start24Hour;
          let newMinutes = startDate.getMinutes() + 60;
          if (newMinutes >= 60) {
            newMinutes -= 60;
            new24Hour += 1;
          }
          setMinutes(newMinutes);
        }
      }
      
      if (isPackage) {
        // Package-specific logic
        if (numberOfDays <= 1) {
          // For same-day trips, ensure time is after start time
          if (new24Hour < start24Hour || 
              (new24Hour === start24Hour && minutes <= startDate.getMinutes())) {
            new24Hour = start24Hour;
            let newMinutes = startDate.getMinutes() + 60;
            if (newMinutes >= 60) {
              newMinutes -= 60;
              new24Hour += 1;
            }
            setMinutes(newMinutes);
          }
        } else {
          // For multi-day trips, ensure time is valid for the selected day
          const selectedDay = selectedTime ? selectedTime : new Date();
          const lastDay = addDays(startDate, numberOfDays - 1);
          
          if (isSameDay(selectedDay, startDate)) {
            // On start day - must be after start time
            if (new24Hour < start24Hour || 
                (new24Hour === start24Hour && minutes <= startDate.getMinutes())) {
              new24Hour = start24Hour;
              let newMinutes = startDate.getMinutes() + 60;
              if (newMinutes >= 60) {
                newMinutes -= 60;
                new24Hour += 1;
              }
              setMinutes(newMinutes);
            }
          } else if (isSameDay(selectedDay, lastDay)) {
            // On last day - must be before 10 PM
            if (new24Hour > 22 || (new24Hour === 22 && minutes > 0)) {
              new24Hour = 22; // 10 PM
              setMinutes(0);
            }
          }
        }
      } else {
        // Non-package - just ensure time is after start time
        if (new24Hour < start24Hour || 
            (new24Hour === start24Hour && minutes <= startDate.getMinutes())) {
          new24Hour = start24Hour;
          let newMinutes = startDate.getMinutes() + 60;
          if (newMinutes >= 60) {
            newMinutes -= 60;
            new24Hour += 1;
          }
          setMinutes(newMinutes);
        }
      }
    }
  
    // Convert back to 12-hour format for display
    let new12Hour;
    if (newPeriod === 'AM') {
      new12Hour = new24Hour === 0 ? 12 : new24Hour > 12 ? new24Hour - 12 : new24Hour;
    } else {
      new12Hour = new24Hour === 12 ? 12 : new24Hour > 12 ? new24Hour - 12 : new24Hour;
    }
  
    setHours(new24Hour >= 12 ? new24Hour === 12 ? 12 : new24Hour - 12 : new24Hour === 0 ? 12 : new24Hour);
    setPeriod(newPeriod);
  };
  const handleConfirm = () => {
    const hourIn24 = period === 'PM' && hours < 12 
      ? hours + 12 
      : period === 'AM' && hours === 12 
        ? 0 
        : hours;
    
    const newDate = selectedTime ? new Date(selectedTime) : new Date();
    newDate.setHours(hourIn24);
    newDate.setMinutes(minutes);
    newDate.setSeconds(0);
    
    onChange(newDate);
    onClose();
  };

  return (
    <div 
      ref={pickerRef}
      className="bg-white p-4 rounded-lg shadow-lg border border-gray-200 w-[220px] absolute z-50 timePass"
      style={{
        right: '6vw',
        
        ...style
      }}
    >
      <div className="flex justify-center items-center mb-4">
        <span 
          className={`cursor-pointer px-2 py-1 rounded text-lg font-medium ${
            activeSelect === 'hours' ? 'bg-blue-50 text-[#01374e]' : 'text-gray-700'
          }`}
          onClick={() => setActiveSelect('hours')}
        >
          {displayHours.toString().padStart(2, '0')}
        </span>
        <span className="mx-1 text-gray-500 text-lg">:</span>
        <span 
          className={`cursor-pointer px-2 py-1 rounded text-lg font-medium ${
            activeSelect === 'minutes' ? 'bg-blue-50 text-[#01374e]' : 'text-gray-700'
          }`}
          onClick={() => setActiveSelect('minutes')}
        >
          {minutes.toString().padStart(2, '0')}
        </span>
        <div className="ml-3 flex space-x-1">
          {/* Check if AM should be disabled */}
          {isEndDatePicker && startDate && selectedTime && 
           isSameDay(selectedTime, startDate) && startDate.getHours() >= 12 ? (
            <button
              className="px-3 py-1 text-sm rounded transition-colors bg-gray-100 text-gray-300 cursor-not-allowed"
              disabled
            >
              AM
            </button>
          ) : (
            <button
              className={`px-3 py-1 text-sm rounded transition-colors ${
                period === 'AM' ? 'bg-[#01374e] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => handlePeriodChange('AM')}
            >
              AM
            </button>
          )}
          <button
            className={`px-3 py-1 text-sm rounded transition-colors ${
              period === 'PM' ? 'bg-[#01374e] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => handlePeriodChange('PM')}
          >
            PM
          </button>
        </div>
      </div>
      
      <div className="flex justify-center mb-4">
        {renderClockFace()}
      </div>
      
      <div className="flex justify-between">
        <button 
          className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded text-sm transition-colors"
          onClick={onClose}
        >
          Cancel
        </button>
        <button 
          className="px-4 py-2 bg-[#01374e] text-white rounded hover:bg-[#01374e] text-sm transition-colors"
          onClick={handleConfirm}
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default ClockTimePicker;