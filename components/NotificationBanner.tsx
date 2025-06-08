"use client"

import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/lib/store"
import { addNotification, markAsRead, removeNotification } from "@/lib/slices/notificationsSlice"
import { Button } from "@/components/ui/button"
import { X, Clock, AlertTriangle, CheckCircle, UserPlus } from "lucide-react"

const NotificationBanner = () => {
  const dispatch = useDispatch()
  const { notifications } = useSelector((state: RootState) => state.notifications)
  const { tasks } = useSelector((state: RootState) => state.tasks)

  // Check for due dates and create notifications
  useEffect(() => {
    const checkDueDates = () => {
      const now = new Date()
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)

      tasks.forEach((task) => {
        if (task.dueDate) {
          const dueDate = new Date(task.dueDate)
          const existingNotification = notifications.find(
            (n) => n.taskId === task.id && (n.type === "due_soon" || n.type === "overdue"),
          )

          if (!existingNotification) {
            if (dueDate < now) {
              dispatch(
                addNotification({
                  type: "overdue",
                  title: "Task Overdue",
                  message: `"${task.title}" is overdue`,
                  taskId: task.id,
                  read: false,
                }),
              )
            } else if (dueDate < tomorrow) {
              dispatch(
                addNotification({
                  type: "due_soon",
                  title: "Task Due Soon",
                  message: `"${task.title}" is due within 24 hours`,
                  taskId: task.id,
                  read: false,
                }),
              )
            }
          }
        }
      })
    }

    checkDueDates()
    const interval = setInterval(checkDueDates, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [tasks, notifications, dispatch])

  const unreadNotifications = notifications.filter((n) => !n.read)

  const getIcon = (type: string) => {
    switch (type) {
      case "due_soon":
        return <Clock className="w-4 h-4" />
      case "overdue":
        return <AlertTriangle className="w-4 h-4" />
      case "task_completed":
        return <CheckCircle className="w-4 h-4" />
      case "task_assigned":
        return <UserPlus className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const getColor = (type: string) => {
    switch (type) {
      case "due_soon":
        return "bg-yellow-50 border-yellow-200 text-yellow-800"
      case "overdue":
        return "bg-red-50 border-red-200 text-red-800"
      case "task_completed":
        return "bg-green-50 border-green-200 text-green-800"
      case "task_assigned":
        return "bg-blue-50 border-blue-200 text-blue-800"
      default:
        return "bg-gray-50 border-gray-200 text-gray-800"
    }
  }

  if (unreadNotifications.length === 0) return null

  return (
    <div className="space-y-2 mb-4">
      {unreadNotifications.slice(0, 3).map((notification) => (
        <div
          key={notification.id}
          className={`flex items-center justify-between p-3 rounded-lg border ${getColor(notification.type)}`}
        >
          <div className="flex items-center gap-3">
            {getIcon(notification.type)}
            <div>
              <p className="font-medium text-sm">{notification.title}</p>
              <p className="text-xs opacity-75">{notification.message}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" onClick={() => dispatch(markAsRead(notification.id))} className="text-xs">
              Mark Read
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => dispatch(removeNotification(notification.id))}
              className="p-1 h-6 w-6"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>
      ))}
      {unreadNotifications.length > 3 && (
        <p className="text-sm text-gray-500 text-center">+{unreadNotifications.length - 3} more notifications</p>
      )}
    </div>
  )
}

export default NotificationBanner
