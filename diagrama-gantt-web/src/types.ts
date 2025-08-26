export type Priority = 'low' | 'medium' | 'high';
export type Status = 'planning' | 'not-started' | 'in-progress' | 'completed' | 'delayed';

export interface Project {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  budget: number;
  priority: Priority;
  status: Status;
  progress: number;
}

export interface Task {
  id: number;
  projectId: number;
  name: string;
  description: string;
  duration: number;
  startDate: string;
  endDate: string;
  priority: Priority;
  status: Status;
  assignedTo: string;
  progress: number;
  dependencies: number[];
  type: 'task' | 'group' | 'milestone';
  parentId?: number | null;
  cost: number;
  effort: number;
  expanded: boolean;
}

export interface Resource {
  id: number;
  name: string;
  email: string;
  role: string;
  cost: number;
  availability: number;
  skills: string[];
}