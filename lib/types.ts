export interface User {
  _id?: string;
  clerkId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  subscription: 'free' | 'paid';
  stripeCustomerId?: string;
  subscriptionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChecklistTask {
  task: string;
  renewal: string;
  completed: boolean;
  dueDate?: Date;
}

export interface Checklist {
  _id?: string;
  userId: string;
  city: string;
  businessType: string;
  tasks: ChecklistTask[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ChecklistTemplate {
  _id?: string;
  city: string;
  businessType: string;
  tasks: Omit<ChecklistTask, 'completed' | 'dueDate'>[];
}

export interface Reminder {
  _id?: string;
  userId: string;
  checklistId: string;
  taskName: string;
  city: string;
  dueDate: Date;
  sent: boolean;
  createdAt: Date;
}