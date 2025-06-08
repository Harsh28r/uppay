"use client"

import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/lib/store"
import { setFilter } from "@/lib/slices/tasksSlice"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface FilterModalProps {
  isOpen: boolean
  onClose: () => void
}

const FilterModal = ({ isOpen, onClose }: FilterModalProps) => {
  const dispatch = useDispatch()
  const { filter } = useSelector((state: RootState) => state.tasks)

  const handlePriorityChange = (priority: string) => {
    dispatch(setFilter({ ...filter, priority }))
  }

  const handleSearchChange = (search: string) => {
    dispatch(setFilter({ ...filter, search }))
  }

  const handleDueDateChange = (dueDate: string) => {
    dispatch(setFilter({ ...filter, dueDate }))
  }

  const handleAssigneeChange = (assignee: string) => {
    dispatch(setFilter({ ...filter, assignee }))
  }

  const clearFilters = () => {
    dispatch(setFilter({ priority: "all", search: "", dueDate: "all", assignee: "all" }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Filter Tasks</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="search">Search Tasks</Label>
            <Input
              id="search"
              value={filter.search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search by task title..."
            />
          </div>

          <div>
            <Label htmlFor="priority">Filter by Priority</Label>
            <Select value={filter.priority} onValueChange={handlePriorityChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="dueDate">Filter by Due Date</Label>
            <Select value={filter.dueDate} onValueChange={handleDueDateChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Dates</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="today">Due Today</SelectItem>
                <SelectItem value="week">Due This Week</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="assignee">Filter by Assignee</Label>
            <Select value={filter.assignee} onValueChange={handleAssigneeChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Assignees</SelectItem>
                <SelectItem value="User 1">User 1</SelectItem>
                <SelectItem value="User 2">User 2</SelectItem>
                <SelectItem value="User 3">User 3</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
            <Button type="button" onClick={onClose} className="bg-purple-600 hover:bg-purple-700">
              Apply Filters
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default FilterModal
