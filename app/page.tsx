'use client';

import React, { useState } from 'react';
import { Timeline } from '@/components/timeline/timeline';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const timelineData = {
  tracks: ['Mindset', 'Admin', 'Health', 'Job', 'Misc'],
  tasks: [
    {
      id: '1',
      title: 'Take ownership of your transition',
      track: 'Mindset',
      startMonth: 60,
      endMonth: 58,
    },
    {
      id: '2',
      title: 'Create login.gov account',
      track: 'Admin',
      startMonth: 59,
      endMonth: 57,
      link: 'https://login.gov',
    },
    {
      id: '3',
      title: 'Schedule medical appointments',
      track: 'Health',
      startMonth: 58,
      endMonth: 54,
    },
    {
      id: '4',
      title: 'Learn basics of resume creation',
      track: 'Job',
      startMonth: 56,
      endMonth: 52,
      link: 'https://www.resume.com/resume-help',
    },
    {
      id: '5',
      title: 'Plan your final PCS',
      track: 'Misc',
      startMonth: 54,
      endMonth: 50,
    },
    {
      id: '6',
      title: 'Determine GI Bill eligibility',
      track: 'Admin',
      startMonth: 48,
      endMonth: 46,
    },
    {
      id: '7',
      title: 'Create LinkedIn profile',
      track: 'Job',
      startMonth: 45,
      endMonth: 43,
      link: 'https://www.linkedin.com',
    },
    {
      id: '8',
      title: 'Schedule informational interviews',
      track: 'Job',
      startMonth: 40,
      endMonth: 20,
    },
    {
      id: '9',
      title: 'Prepare for VA disability claim',
      track: 'Health',
      startMonth: 36,
      endMonth: 30,
    },
    {
      id: '10',
      title: 'Attend TAP class',
      track: 'Admin',
      startMonth: 24,
      endMonth: 22,
    },
  ],
};

export default function Home() {
  const [separationDate, setSeparationDate] = useState<Date>(() => {
    const date = new Date();
    date.setMonth(date.getMonth() + 60);
    return date;
  });
  const [inputDate, setInputDate] = useState<string>(() => {
    const date = new Date();
    date.setMonth(date.getMonth() + 60);
    return date.toISOString().split('T')[0];
  });

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputDate(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newDate = new Date(inputDate);
    if (!isNaN(newDate.getTime())) {
      setSeparationDate(newDate);
    } else {
      alert('Please enter a valid date');
    }
  };

  return (
    <main className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">Military Transition Timeline</h1>
      <form onSubmit={handleSubmit} className="mb-4 flex items-end gap-4">
        <div>
          <Label htmlFor="separation-date">Separation Date</Label>
          <Input type="date" id="separation-date" value={inputDate} onChange={handleDateChange} required />
        </div>
        <Button type="submit">Update Timeline</Button>
      </form>
      <Timeline data={timelineData} separationDate={separationDate} />
    </main>
  );
}
