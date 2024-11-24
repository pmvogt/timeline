'use client';
import React, { useState, useRef, useEffect } from 'react';
import { TimelineData, Task, TimelineProps } from '@/types/timeline';

export const Timeline: React.FC<TimelineProps> = ({ data, separationDate }) => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  // Helper function to round pixel values consistently
  const roundPixels = (value: number) => Math.round(value * 1000) / 1000;

  // Update monthsToPixels to use rounded values
  const monthsToPixels = (months: number) => {
    return roundPixels(months * 60);
  };

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (timelineRef.current) {
        timelineRef.current.scrollLeft += e.deltaY;
        e.preventDefault();
      }
    };

    const timeline = timelineRef.current;
    if (timeline) {
      timeline.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (timeline) {
        timeline.removeEventListener('wheel', handleWheel);
      }
    };
  }, []);

  // Calculate total months from now until separation
  const today = new Date(2024, 10, 23); // November 23, 2024
  const totalMonths = Math.ceil((separationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 30.44));
  const maxMonth = Math.max(60, totalMonths + 3); // Ensure we show at least 60 months and add padding

  const getMonthLabel = (monthsAgo: number) => {
    const date = new Date(separationDate);
    date.setMonth(date.getMonth() - monthsAgo);
    if (date.getMonth() === 0) {
      return date.getFullYear().toString();
    }
    return date.toLocaleString('default', { month: 'short' });
  };

  // Calculate positions with rounded values
  const monthsSinceSeparation = roundPixels(
    (separationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 30.44)
  );

  return (
    <div className="w-full overflow-hidden">
      <div
        ref={timelineRef}
        className="relative overflow-x-auto whitespace-nowrap"
        style={{
          width: '100%',
          height: `${data.tracks.length * 60 + 50}px`,
        }}
      >
        {/* Container for the entire timeline */}
        <div className="relative" style={{ width: `${monthsToPixels(maxMonth)}px` }}>
          {/* Month grid lines */}
          {Array.from({ length: maxMonth + 1 }, (_, i) => (
            <div
              key={`grid-${i}`}
              className="absolute top-0 bottom-0 border-l border-gray-200"
              style={{ left: `${roundPixels(monthsToPixels(i))}px` }}
            />
          ))}

          {/* Months indicator */}
          <div className="sticky top-0 z-10 bg-white border-b border-gray-200 h-8">
            {Array.from({ length: maxMonth + 1 }, (_, i) => (
              <span
                key={i}
                className={`absolute inline-block w-[60px] text-center text-xs ${
                  getMonthLabel(maxMonth - i).length === 4 ? 'font-bold' : 'font-normal'
                }`}
                style={{
                  left: `${roundPixels(monthsToPixels(i))}px`,
                  transform: 'translateX(-50%)',
                }}
              >
                {getMonthLabel(maxMonth - i)}
              </span>
            ))}
          </div>

          {/* Tracks and Tasks */}
          {data.tracks.map((track, index) => (
            <div key={track} className="relative h-[60px] border-t border-gray-200">
              <span className="absolute left-0 top-0 z-10 bg-white pr-2 text-sm font-semibold">{track}</span>
              {data.tasks
                .filter((task) => task.track === track)
                .map((task) => (
                  <div
                    key={task.id}
                    className={`absolute top-[10px] h-[40px] rounded ${
                      task.link ? 'bg-blue-500' : 'bg-gray-300'
                    } cursor-pointer transition-all hover:opacity-80`}
                    style={{
                      left: `${roundPixels(monthsToPixels(maxMonth - task.startMonth))}px`,
                      width: `${roundPixels(monthsToPixels(task.endMonth - task.startMonth))}px`,
                    }}
                    onClick={() => setSelectedTask(task)}
                  >
                    <span className="block overflow-hidden text-ellipsis whitespace-nowrap px-2 text-xs text-white">
                      {task.title}
                    </span>
                  </div>
                ))}
            </div>
          ))}

          {/* Current day indicator */}
          <div
            className="absolute top-0 bottom-0 w-[2px] bg-red-500 z-20"
            style={{ left: `${roundPixels(monthsToPixels(maxMonth - monthsSinceSeparation))}px` }}
          >
            <div className="absolute top-0 -translate-x-1/2 bg-red-500 text-white text-xs px-1 py-0.5 rounded whitespace-nowrap">
              Current Day
            </div>
          </div>

          {/* Separation date indicator */}
          <div
            className="absolute top-0 bottom-0 w-[2px] bg-yellow-400 z-20"
            style={{ left: `${roundPixels(monthsToPixels(maxMonth))}px` }}
          >
            <div className="absolute top-0 -translate-x-1/2 bg-yellow-400 text-xs px-1 py-0.5 rounded whitespace-nowrap">
              Separation Date
            </div>
          </div>
        </div>
      </div>

      {/* Task Details */}
      {selectedTask && (
        <div className="mt-4 rounded border border-gray-200 p-4">
          <h3 className="text-lg font-semibold">{selectedTask.title}</h3>
          <p>Track: {selectedTask.track}</p>
          <p>
            Months before separation: {selectedTask.startMonth} - {selectedTask.endMonth}
          </p>
          {selectedTask.link && (
            <a
              href={selectedTask.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Learn More
            </a>
          )}
        </div>
      )}
    </div>
  );
};
