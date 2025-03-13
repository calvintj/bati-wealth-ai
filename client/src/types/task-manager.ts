export interface Task {
  id?: string;
  description: string;
  invitee: string;
  due_date: string;
}

export interface TaskResponse extends Task {
  id: string;
}
