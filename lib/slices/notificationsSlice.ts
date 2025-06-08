import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { NotificationState, Notification } from "../types"

const initialState: NotificationState = {
  notifications: [],
}

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Omit<Notification, "id" | "createdAt">>) => {
      const notification: Notification = {
        ...action.payload,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      }
      state.notifications.unshift(notification)
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find((n) => n.id === action.payload)
      if (notification) {
        notification.read = true
      }
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter((n) => n.id !== action.payload)
    },
    clearAllNotifications: (state) => {
      state.notifications = []
    },
  },
})

export const { addNotification, markAsRead, removeNotification, clearAllNotifications } = notificationsSlice.actions
export default notificationsSlice.reducer
