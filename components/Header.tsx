"use client"

import { Search, Calendar, HelpCircle, Bell } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import ConnectionStatus from "./ConnectionStatus"

const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input placeholder="Search for anything..." className="pl-10 border-gray-200" />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <ConnectionStatus />

          <Button variant="ghost" size="sm">
            <Calendar className="w-5 h-5 text-gray-500" />
          </Button>
          <Button variant="ghost" size="sm">
            <HelpCircle className="w-5 h-5 text-gray-500" />
          </Button>
          <Button variant="ghost" size="sm">
            <Bell className="w-5 h-5 text-gray-500" />
          </Button>

          <div className="flex items-center gap-3 ml-4">
            <div className="text-right">
              <div className="font-medium text-gray-900">Palak Jain</div>
              <div className="text-sm text-gray-500">Rajathan, India</div>
            </div>
            <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
