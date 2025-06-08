"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { deleteTask, addSubtask, toggleSubtask, updateCustomField, addCustomFieldToTask } from "@/lib/slices/tasksSlice"
import type { RootState } from "@/lib/store"
import type { Task } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  MoreHorizontal,
  MessageSquare,
  Paperclip,
  Edit,
  Trash2,
  Plus,
  Calendar,
  Clock,
  AlertTriangle,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface TaskCardProps {
  task: Task
}

const TaskCard = ({ task }: TaskCardProps) => {
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.auth)
  const { customFieldTemplates } = useSelector((state: RootState) => state.tasks)
  const [isExpanded, setIsExpanded] = useState(false)
  const [newSubtask, setNewSubtask] = useState("")
  const [showActivityLog, setShowActivityLog] = useState(false)

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700"
      case "medium":
        return "bg-yellow-100 text-yellow-700"
      case "low":
        return "bg-green-100 text-green-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getDueDateStatus = () => {
    if (!task.dueDate) return null

    const now = new Date()
    const dueDate = new Date(task.dueDate)
    const diffTime = dueDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) {
      return { status: "overdue", text: `${Math.abs(diffDays)} days overdue`, color: "text-red-600" }
    } else if (diffDays === 0) {
      return { status: "today", text: "Due today", color: "text-orange-600" }
    } else if (diffDays === 1) {
      return { status: "tomorrow", text: "Due tomorrow", color: "text-yellow-600" }
    } else if (diffDays <= 7) {
      return { status: "soon", text: `Due in ${diffDays} days`, color: "text-blue-600" }
    }
    return null
  }

  const handleDelete = () => {
    dispatch(deleteTask(task.id))
  }

  const handleAddSubtask = () => {
    if (newSubtask.trim() && user) {
      dispatch(
        addSubtask({
          taskId: task.id,
          title: newSubtask.trim(),
          userId: user.id,
          userName: user.name,
        }),
      )
      setNewSubtask("")
    }
  }

  const handleToggleSubtask = (subtaskId: string) => {
    if (user) {
      dispatch(
        toggleSubtask({
          taskId: task.id,
          subtaskId,
          userId: user.id,
          userName: user.name,
        }),
      )
    }
  }

  const handleCustomFieldUpdate = (fieldId: string, value: string) => {
    if (user) {
      dispatch(
        updateCustomField({
          taskId: task.id,
          fieldId,
          value,
          userId: user.id,
          userName: user.name,
        }),
      )
    }
  }

  const handleAddCustomField = (templateId: string) => {
    const template = customFieldTemplates.find((t) => t.id === templateId)
    if (template && user) {
      dispatch(
        addCustomFieldToTask({
          taskId: task.id,
          field: { ...template, value: "" },
          userId: user.id,
          userName: user.name,
        }),
      )
    }
  }

  const dueDateStatus = getDueDateStatus()
  const completedSubtasks = task.subtasks.filter((st) => st.completed).length

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </Badge>
            {dueDateStatus && (
              <div className={`flex items-center gap-1 text-xs ${dueDateStatus.color}`}>
                {dueDateStatus.status === "overdue" ? (
                  <AlertTriangle className="w-3 h-3" />
                ) : (
                  <Clock className="w-3 h-3" />
                )}
                <span>{dueDateStatus.text}</span>
              </div>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="p-1 h-6 w-6">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsExpanded(true)}>
                <Edit className="w-4 h-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowActivityLog(true)}>
                <MessageSquare className="w-4 h-4 mr-2" />
                Activity Log
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <h4 className="font-semibold text-gray-900 mb-2">{task.title}</h4>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{task.description}</p>

        {task.dueDate && (
          <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
            <Calendar className="w-4 h-4" />
            <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
          </div>
        )}

        {task.subtasks.length > 0 && (
          <div className="mb-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full transition-all"
                  style={{ width: `${(completedSubtasks / task.subtasks.length) * 100}%` }}
                ></div>
              </div>
              <span className="text-xs whitespace-nowrap">
                {completedSubtasks}/{task.subtasks.length}
              </span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex -space-x-2">
            {task.assignees.map((assignee, index) => (
              <div
                key={index}
                className="w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full border-2 border-white"
                title={assignee}
              ></div>
            ))}
          </div>

          <div className="flex items-center gap-3 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <MessageSquare className="w-4 h-4" />
              <span>{task.comments}</span>
            </div>
            <div className="flex items-center gap-1">
              <Paperclip className="w-4 h-4" />
              <span>{task.files}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Task Details Modal */}
      <Dialog open={isExpanded} onOpenChange={setIsExpanded}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{task.title}</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div>
              <h4 className="font-medium mb-2">Description</h4>
              <p className="text-gray-600">{task.description}</p>
            </div>

            {/* Custom Fields */}
            {task.customFields.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Custom Fields</h4>
                <div className="space-y-2">
                  {task.customFields.map((field) => (
                    <div key={field.id} className="flex items-center gap-2">
                      <label className="text-sm font-medium w-24">{field.name}:</label>
                      {field.type === "select" ? (
                        <Select value={field.value} onValueChange={(value) => handleCustomFieldUpdate(field.id, value)}>
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {field.options?.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          type={field.type}
                          value={field.value}
                          onChange={(e) => handleCustomFieldUpdate(field.id, e.target.value)}
                          className="w-40"
                        />
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-2">
                  <Select onValueChange={handleAddCustomField}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Add custom field..." />
                    </SelectTrigger>
                    <SelectContent>
                      {customFieldTemplates
                        .filter((template) => !task.customFields.find((cf) => cf.name === template.name))
                        .map((template) => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Subtasks */}
            <div>
              <h4 className="font-medium mb-2">Subtasks</h4>
              <div className="space-y-2">
                {task.subtasks.map((subtask) => (
                  <div key={subtask.id} className="flex items-center gap-2">
                    <Checkbox checked={subtask.completed} onCheckedChange={() => handleToggleSubtask(subtask.id)} />
                    <span className={`text-sm ${subtask.completed ? "line-through text-gray-500" : ""}`}>
                      {subtask.title}
                    </span>
                  </div>
                ))}

                <div className="flex items-center gap-2 mt-3">
                  <Input
                    placeholder="Add subtask..."
                    value={newSubtask}
                    onChange={(e) => setNewSubtask(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleAddSubtask()}
                    className="flex-1"
                  />
                  <Button size="sm" onClick={handleAddSubtask}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Activity Log Modal */}
      <Dialog open={showActivityLog} onOpenChange={setShowActivityLog}>
        <DialogContent className="max-w-lg max-h-[60vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Activity Log</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            {task.activityLog.map((entry) => (
              <div key={entry.id} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{entry.details}</p>
                  <p className="text-xs text-gray-500">
                    by {entry.userName} • {new Date(entry.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default TaskCard
