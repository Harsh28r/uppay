"use client"

import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import type { RootState } from "@/lib/store"
import { moveTask, syncTaskUpdate, syncTaskCreate, syncTaskDelete } from "@/lib/slices/tasksSlice"
import { logoutUser } from "@/lib/slices/authSlice"
import { socketService } from "@/lib/socket"
import Sidebar from "./Sidebar"
import Header from "./Header"
import TaskCard from "./TaskCard"
import AddTaskModal from "./AddTaskModal"
import FilterModal from "./FilterModal"
import NotificationBanner from "./NotificationBanner"
import { Button } from "@/components/ui/button"
import { Plus, Filter, Calendar, Share, Users, LogOut } from "lucide-react"

const Dashboard = () => {
  const dispatch = useDispatch()
  const { tasks, filter } = useSelector((state: RootState) => state.tasks)
  const { user } = useSelector((state: RootState) => state.auth)
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [selectedColumn, setSelectedColumn] = useState<string>("")

  // Set up real-time listeners
  useEffect(() => {
    if (user) {
      socketService.onTaskUpdate((task) => {
        dispatch(syncTaskUpdate(task))
      })

      socketService.onTaskCreate((task) => {
        dispatch(syncTaskCreate(task))
      })

      socketService.onTaskDelete((taskId) => {
        dispatch(syncTaskDelete(taskId))
      })

      return () => {
        socketService.offAllListeners()
      }
    }
  }, [user, dispatch])

  const columns = [
    { id: "todo", title: "To Do", color: "blue" },
    { id: "progress", title: "On Progress", color: "orange" },
    { id: "done", title: "Done", color: "green" },
  ]

  const filteredTasks = tasks.filter((task) => {
    if (filter.priority && filter.priority !== "all" && task.priority !== filter.priority) {
      return false
    }
    if (filter.search && !task.title.toLowerCase().includes(filter.search.toLowerCase())) {
      return false
    }
    if (filter.dueDate && filter.dueDate !== "all") {
      const now = new Date()
      const taskDueDate = task.dueDate ? new Date(task.dueDate) : null

      switch (filter.dueDate) {
        case "overdue":
          if (!taskDueDate || taskDueDate >= now) return false
          break
        case "today":
          if (!taskDueDate || taskDueDate.toDateString() !== now.toDateString()) return false
          break
        case "week":
          const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
          if (!taskDueDate || taskDueDate > weekFromNow) return false
          break
      }
    }
    if (filter.assignee && filter.assignee !== "all" && !task.assignees.includes(filter.assignee)) {
      return false
    }
    return true
  })

  const getTasksByColumn = (columnId: string) => {
    return filteredTasks.filter((task) => task.status === columnId)
  }

  const onDragEnd = (result: any) => {
    if (!result.destination || !user) return

    const { source, destination, draggableId } = result

    if (source.droppableId !== destination.droppableId) {
      dispatch(
        moveTask({
          taskId: draggableId,
          newStatus: destination.droppableId,
          userId: user.id,
          userName: user.name,
        }),
      )
    }
  }

  const handleAddTask = (columnId: string) => {
    setSelectedColumn(columnId)
    setIsAddTaskOpen(true)
  }

  const handleLogout = () => {
    dispatch(logoutUser())
  }

  const getColumnColor = (color: string) => {
    switch (color) {
      case "blue":
        return "border-t-blue-500"
      case "orange":
        return "border-t-orange-500"
      case "green":
        return "border-t-green-500"
      default:
        return "border-t-gray-500"
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header />

        <main className="flex-1 p-6">
          <NotificationBanner />

          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <h1 className="text-3xl font-bold text-gray-900">Mobile App</h1>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button variant="outline" className="text-purple-600 border-purple-200">
                  <Users className="w-4 h-4 mr-2" />
                  Invite
                </Button>
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full border-2 border-white"
                    ></div>
                  ))}
                  <div className="w-8 h-8 bg-gray-200 rounded-full border-2 border-white flex items-center justify-center text-xs font-medium">
                    +2
                  </div>
                </div>
                <Button variant="outline" onClick={handleLogout} className="text-red-600">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => setIsFilterOpen(true)} className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filter
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Today
              </Button>
              <div className="ml-auto flex items-center gap-2">
                <Button variant="outline" className="flex items-center gap-2">
                  <Share className="w-4 h-4" />
                  Share
                </Button>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <div className="w-4 h-4 bg-white rounded grid grid-cols-2 gap-0.5">
                    <div className="bg-purple-600 rounded-sm"></div>
                    <div className="bg-purple-600 rounded-sm"></div>
                    <div className="bg-purple-600 rounded-sm"></div>
                    <div className="bg-purple-600 rounded-sm"></div>
                  </div>
                </Button>
              </div>
            </div>
          </div>

          <DragDropContext onDragEnd={onDragEnd}>
            <div className="grid grid-cols-3 gap-6">
              {columns.map((column) => (
                <div key={column.id} className="bg-white rounded-lg shadow-sm">
                  <div className={`h-1 ${getColumnColor(column.color)} rounded-t-lg`}></div>

                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            column.color === "blue"
                              ? "bg-blue-500"
                              : column.color === "orange"
                                ? "bg-orange-500"
                                : "bg-green-500"
                          }`}
                        ></div>
                        <h3 className="font-semibold text-gray-900">{column.title}</h3>
                        <span className="bg-gray-100 text-gray-600 text-sm px-2 py-1 rounded">
                          {getTasksByColumn(column.id).length}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleAddTask(column.id)}
                        className="w-6 h-6 p-0 text-gray-400 hover:text-gray-600"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>

                    <Droppable droppableId={column.id}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`space-y-3 min-h-[200px] ${
                            snapshot.isDraggingOver ? "bg-gray-50 rounded-lg" : ""
                          }`}
                        >
                          {getTasksByColumn(column.id).map((task, index) => (
                            <Draggable key={task.id} draggableId={task.id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`${snapshot.isDragging ? "rotate-2 shadow-lg" : ""}`}
                                >
                                  <TaskCard task={task} />
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                </div>
              ))}
            </div>
          </DragDropContext>
        </main>
      </div>

      <AddTaskModal isOpen={isAddTaskOpen} onClose={() => setIsAddTaskOpen(false)} columnId={selectedColumn} />

      <FilterModal isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />
    </div>
  )
}

export default Dashboard
