export type TaskStatus = 'pending' | 'in-progress' | 'completed';

export interface Task {
    title: string;
    description: string;
    createdAt: Date;
    status: TaskStatus;
}

