export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  createdAt: string
}

export interface Subtask {
  id: string
  title: string
  completed: boolean
  createdAt: string
  updatedAt: string
}

export interface CustomField {
  id: string
  name: string
  type: "text" | "select" | "date" | "number"
  options?: string[]
  value: string
}

export interface ActivityLogEntry {
  id: string
  action: string
  details: string
  userId: string
  userName: string
  timestamp: string
}

export interface Task {
  id: string
  title: string
  description: string
  status: "todo" | "progress" | "done"
  priority: "low" | "medium" | "high"
  assignees: string[]
  comments: number
  files: number
  createdAt: string
  updatedAt: string
  dueDate?: string
  subtasks: Subtask[]
  customFields: CustomField[]
  activityLog: ActivityLogEntry[]
  createdBy: string
}

export interface Filter {
  priority: string
  search: string
  dueDate: string
  assignee: string
}

export interface TasksState {
  tasks: Task[]
  filter: Filter
  customFieldTemplates: CustomField[]
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
}

export interface NotificationState {
  notifications: Notification[]
}

export interface Notification {
  id: string
  type: "due_soon" | "overdue" | "task_assigned" | "task_completed"
  title: string
  message: string
  taskId?: string
  read: boolean
  createdAt: string
}
