import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { Task, TasksState, Subtask, CustomField, ActivityLogEntry } from "../types"
import { socketService } from "../socket"

// Load initial state from localStorage
const loadState = (): TasksState => {
  if (typeof window !== "undefined") {
    try {
      const serializedState = localStorage.getItem("tasksState")
      if (serializedState) {
        return JSON.parse(serializedState)
      }
    } catch (err) {
      console.error("Error loading state from localStorage:", err)
    }
  }

  return {
    tasks: [
      {
        id: "1",
        title: "Brainstorming",
        description: "Brainstorming brings team members' diverse experience into play.",
        status: "todo",
        priority: "low",
        assignees: ["User 1", "User 2", "User 3"],
        comments: 12,
        files: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        subtasks: [],
        customFields: [],
        activityLog: [],
        createdBy: "demo-user",
      },
      {
        id: "2",
        title: "Research",
        description: "User research helps you to create an optimal product for users.",
        status: "todo",
        priority: "high",
        assignees: ["User 1", "User 2"],
        comments: 10,
        files: 3,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        subtasks: [
          {
            id: "s1",
            title: "User interviews",
            completed: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: "s2",
            title: "Competitor analysis",
            completed: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
        customFields: [
          {
            id: "cf1",
            name: "Department",
            type: "select",
            options: ["Design", "Development", "Marketing"],
            value: "Design",
          },
        ],
        activityLog: [
          {
            id: "al1",
            action: "created",
            details: "Task created",
            userId: "demo-user",
            userName: "Demo User",
            timestamp: new Date().toISOString(),
          },
        ],
        createdBy: "demo-user",
      },
    ],
    filter: {
      priority: "all",
      search: "",
      dueDate: "all",
      assignee: "all",
    },
    customFieldTemplates: [
      { id: "cft1", name: "Department", type: "select", options: ["Design", "Development", "Marketing"], value: "" },
      { id: "cft2", name: "Estimated Hours", type: "number", value: "" },
      { id: "cft3", name: "Client", type: "text", value: "" },
    ],
  }
}

// Save state to localStorage
const saveState = (state: TasksState) => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("tasksState", JSON.stringify(state))
    } catch (err) {
      console.error("Error saving state to localStorage:", err)
    }
  }
}

const addActivityLog = (task: Task, action: string, details: string, userId: string, userName: string): Task => {
  const logEntry: ActivityLogEntry = {
    id: Date.now().toString(),
    action,
    details,
    userId,
    userName,
    timestamp: new Date().toISOString(),
  }

  return {
    ...task,
    activityLog: [logEntry, ...task.activityLog],
    updatedAt: new Date().toISOString(),
  }
}

const initialState = loadState()

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask: (
      state,
      action: PayloadAction<Omit<Task, "id" | "createdAt" | "updatedAt" | "subtasks" | "customFields" | "activityLog">>,
    ) => {
      const newTask: Task = {
        ...action.payload,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        subtasks: [],
        customFields: [],
        activityLog: [
          {
            id: Date.now().toString(),
            action: "created",
            details: "Task created",
            userId: action.payload.createdBy,
            userName: "Current User",
            timestamp: new Date().toISOString(),
          },
        ],
      }
      state.tasks.push(newTask)
      socketService.emitTaskCreate(newTask)
      saveState(state)
    },

    updateTask: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<Task>; userId: string; userName: string }>,
    ) => {
      const { id, updates, userId, userName } = action.payload
      const taskIndex = state.tasks.findIndex((task) => task.id === id)
      if (taskIndex !== -1) {
        const oldTask = state.tasks[taskIndex]
        const updatedTask = { ...oldTask, ...updates, updatedAt: new Date().toISOString() }

        // Add activity log for the update
        const changes = Object.keys(updates).filter((key) => key !== "updatedAt")
        if (changes.length > 0) {
          updatedTask.activityLog = [
            {
              id: Date.now().toString(),
              action: "updated",
              details: `Updated: ${changes.join(", ")}`,
              userId,
              userName,
              timestamp: new Date().toISOString(),
            },
            ...updatedTask.activityLog,
          ]
        }

        state.tasks[taskIndex] = updatedTask
        socketService.emitTaskUpdate(updatedTask)
        saveState(state)
      }
    },

    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload)
      socketService.emitTaskDelete(action.payload)
      saveState(state)
    },

    moveTask: (
      state,
      action: PayloadAction<{ taskId: string; newStatus: string; userId: string; userName: string }>,
    ) => {
      const { taskId, newStatus, userId, userName } = action.payload
      const taskIndex = state.tasks.findIndex((task) => task.id === taskId)
      if (taskIndex !== -1) {
        const task = state.tasks[taskIndex]
        const updatedTask = addActivityLog(
          { ...task, status: newStatus as Task["status"] },
          "moved",
          `Moved to ${newStatus}`,
          userId,
          userName,
        )
        state.tasks[taskIndex] = updatedTask
        socketService.emitTaskUpdate(updatedTask)
        saveState(state)
      }
    },

    addSubtask: (state, action: PayloadAction<{ taskId: string; title: string; userId: string; userName: string }>) => {
      const { taskId, title, userId, userName } = action.payload
      const taskIndex = state.tasks.findIndex((task) => task.id === taskId)
      if (taskIndex !== -1) {
        const task = state.tasks[taskIndex]
        const newSubtask: Subtask = {
          id: Date.now().toString(),
          title,
          completed: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        const updatedTask = addActivityLog(
          { ...task, subtasks: [...task.subtasks, newSubtask] },
          "subtask_added",
          `Added subtask: ${title}`,
          userId,
          userName,
        )

        state.tasks[taskIndex] = updatedTask
        socketService.emitTaskUpdate(updatedTask)
        saveState(state)
      }
    },

    toggleSubtask: (
      state,
      action: PayloadAction<{ taskId: string; subtaskId: string; userId: string; userName: string }>,
    ) => {
      const { taskId, subtaskId, userId, userName } = action.payload
      const taskIndex = state.tasks.findIndex((task) => task.id === taskId)
      if (taskIndex !== -1) {
        const task = state.tasks[taskIndex]
        const subtaskIndex = task.subtasks.findIndex((st) => st.id === subtaskId)
        if (subtaskIndex !== -1) {
          const updatedSubtasks = [...task.subtasks]
          updatedSubtasks[subtaskIndex] = {
            ...updatedSubtasks[subtaskIndex],
            completed: !updatedSubtasks[subtaskIndex].completed,
            updatedAt: new Date().toISOString(),
          }

          const updatedTask = addActivityLog(
            { ...task, subtasks: updatedSubtasks },
            "subtask_updated",
            `${updatedSubtasks[subtaskIndex].completed ? "Completed" : "Reopened"} subtask: ${updatedSubtasks[subtaskIndex].title}`,
            userId,
            userName,
          )

          state.tasks[taskIndex] = updatedTask
          socketService.emitTaskUpdate(updatedTask)
          saveState(state)
        }
      }
    },

    updateCustomField: (
      state,
      action: PayloadAction<{ taskId: string; fieldId: string; value: string; userId: string; userName: string }>,
    ) => {
      const { taskId, fieldId, value, userId, userName } = action.payload
      const taskIndex = state.tasks.findIndex((task) => task.id === taskId)
      if (taskIndex !== -1) {
        const task = state.tasks[taskIndex]
        const fieldIndex = task.customFields.findIndex((cf) => cf.id === fieldId)
        if (fieldIndex !== -1) {
          const updatedFields = [...task.customFields]
          updatedFields[fieldIndex] = { ...updatedFields[fieldIndex], value }

          const updatedTask = addActivityLog(
            { ...task, customFields: updatedFields },
            "field_updated",
            `Updated ${updatedFields[fieldIndex].name}: ${value}`,
            userId,
            userName,
          )

          state.tasks[taskIndex] = updatedTask
          socketService.emitTaskUpdate(updatedTask)
          saveState(state)
        }
      }
    },

    addCustomFieldToTask: (
      state,
      action: PayloadAction<{ taskId: string; field: CustomField; userId: string; userName: string }>,
    ) => {
      const { taskId, field, userId, userName } = action.payload
      const taskIndex = state.tasks.findIndex((task) => task.id === taskId)
      if (taskIndex !== -1) {
        const task = state.tasks[taskIndex]
        const updatedTask = addActivityLog(
          { ...task, customFields: [...task.customFields, { ...field, id: Date.now().toString() }] },
          "field_added",
          `Added custom field: ${field.name}`,
          userId,
          userName,
        )

        state.tasks[taskIndex] = updatedTask
        socketService.emitTaskUpdate(updatedTask)
        saveState(state)
      }
    },

    setFilter: (
      state,
      action: PayloadAction<{ priority: string; search: string; dueDate: string; assignee: string }>,
    ) => {
      state.filter = action.payload
      saveState(state)
    },

    addCustomFieldTemplate: (state, action: PayloadAction<Omit<CustomField, "id">>) => {
      const newTemplate: CustomField = {
        ...action.payload,
        id: Date.now().toString(),
      }
      state.customFieldTemplates.push(newTemplate)
      saveState(state)
    },

    // Real-time sync actions
    syncTaskUpdate: (state, action: PayloadAction<Task>) => {
      const taskIndex = state.tasks.findIndex((task) => task.id === action.payload.id)
      if (taskIndex !== -1) {
        state.tasks[taskIndex] = action.payload
        saveState(state)
      }
    },

    syncTaskCreate: (state, action: PayloadAction<Task>) => {
      const exists = state.tasks.find((task) => task.id === action.payload.id)
      if (!exists) {
        state.tasks.push(action.payload)
        saveState(state)
      }
    },

    syncTaskDelete: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload)
      saveState(state)
    },
  },
})

export const {
  addTask,
  updateTask,
  deleteTask,
  moveTask,
  addSubtask,
  toggleSubtask,
  updateCustomField,
  addCustomFieldToTask,
  setFilter,
  addCustomFieldTemplate,
  syncTaskUpdate,
  syncTaskCreate,
  syncTaskDelete,
} = tasksSlice.actions
export default tasksSlice.reducer
