export interface Task {
  id: string;
  title: string;
  track: string;
  startMonth: number;
  endMonth: number;
  link?: string;
}

export interface TimelineData {
  tracks: string[];
  tasks: Task[];
}

export interface TimelineProps {
  data: TimelineData;
  separationDate: Date;
}
