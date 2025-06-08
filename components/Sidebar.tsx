"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Home,
  MessageSquare,
  CheckSquare,
  Users,
  Settings,
  Smartphone,
  Globe,
  Palette,
  Layout,
  ChevronLeft,
  Plus,
} from "lucide-react"

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const menuItems = [
    { icon: Home, label: "Home", active: false },
    { icon: MessageSquare, label: "Messages", active: false },
    { icon: CheckSquare, label: "Tasks", active: true },
    { icon: Users, label: "Members", active: false },
    { icon: Settings, label: "Settings", active: false },
  ]

  const projects = [
    { icon: Smartphone, label: "Mobile App", active: true, color: "bg-blue-500" },
    { icon: Globe, label: "Website Redesign", active: false, color: "bg-orange-500" },
    { icon: Palette, label: "Design System", active: false, color: "bg-purple-500" },
    { icon: Layout, label: "Wireframes", active: false, color: "bg-green-500" },
  ]

  return (
    <div className={`bg-white border-r border-gray-200 transition-all duration-300 ${isCollapsed ? "w-16" : "w-64"}`}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-sm"></div>
            </div>
            {!isCollapsed && <span className="font-semibold text-gray-900">Project M.</span>}
          </div>
          <Button variant="ghost" size="sm" onClick={() => setIsCollapsed(!isCollapsed)} className="p-1 h-6 w-6">
            <ChevronLeft className={`w-4 h-4 transition-transform ${isCollapsed ? "rotate-180" : ""}`} />
          </Button>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item, index) => (
            <Button
              key={index}
              variant={item.active ? "secondary" : "ghost"}
              className={`w-full justify-start gap-3 ${
                item.active ? "bg-purple-50 text-purple-700" : "text-gray-600"
              } ${isCollapsed ? "px-2" : "px-3"}`}
            >
              <item.icon className="w-5 h-5" />
              {!isCollapsed && <span>{item.label}</span>}
            </Button>
          ))}
        </nav>

        {!isCollapsed && (
          <>
            <div className="mt-8 mb-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">MY PROJECTS</h3>
                <Button variant="ghost" size="sm" className="p-1 h-6 w-6">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-2">
                {projects.map((project, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className={`w-full justify-start gap-3 ${
                      project.active ? "bg-purple-50 text-purple-700" : "text-gray-600"
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full ${project.color}`}></div>
                    <span>{project.label}</span>
                  </Button>
                ))}
              </div>
            </div>

            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Thoughts Time</h4>
              <p className="text-sm text-gray-600 mb-3">
                We don't have any notice for you, till then you can share your thoughts with your peers.
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Write a message
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Sidebar
