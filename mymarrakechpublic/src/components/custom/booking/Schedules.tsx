import { Clock } from 'lucide-react';
import React from 'react';

type ScheduleType = {
  days: string;
  start_time: string;
  end_time: string;
};

type SchedulesProps = {
  schedulesProp: string | ScheduleType[] | undefined; // Explicitly allow undefined
};

const Schedules = ({ schedulesProp }: SchedulesProps) => {

  // Handle undefined or empty string, fallback to an empty array
  const schedules = React.useMemo(() => {
    if (!schedulesProp) {
      return []; // Return empty array if schedulesProp is undefined or null
    }

    // If it's already an array, use it directly
    if (Array.isArray(schedulesProp)) {
      return schedulesProp;
    }

    // If it's a string, attempt to parse it as JSON
    try {
      return JSON.parse(schedulesProp); // Attempt to parse
    } catch (error) {
      console.error('Invalid schedule data:', error);
      return []; // Fallback to empty array if JSON parsing fails
    }
  }, [schedulesProp]); // Recalculate if schedulesProp changes

  return (
    <div>
      {schedules?.map((schedule: ScheduleType, index: number) => (
        <div key={index} className="flex items-center gap-2">
          <Clock size={18} className="text-[#0a8a8a]" />
          <span>
            {schedule.days}: {schedule.start_time} - {schedule.end_time}
          </span>
        </div>
      ))}
    </div>
  );
};

export default Schedules;
