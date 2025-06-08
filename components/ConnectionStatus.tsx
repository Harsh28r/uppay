"use client"

import { useState, useEffect } from "react"
import { socketService } from "@/lib/socket"
import { Badge } from "@/components/ui/badge"
import { Wifi, WifiOff, Users } from "lucide-react"

const ConnectionStatus = () => {
  const [isConnected, setIsConnected] = useState(false)
  const [userCount, setUserCount] = useState(0)

  useEffect(() => {
    const checkConnection = () => {
      setIsConnected(socketService.isConnected())
    }

    // Check connection status every 5 seconds
    const interval = setInterval(checkConnection, 5000)

    // Initial check
    checkConnection()

    // Listen for user count updates
    socketService.onUserCount((count) => {
      setUserCount(count)
    })

    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <div className="flex items-center gap-2">
      <Badge variant={isConnected ? "default" : "destructive"} className="flex items-center gap-1">
        {isConnected ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
        {isConnected ? "Connected" : "Offline"}
      </Badge>

      {isConnected && userCount > 0 && (
        <Badge variant="secondary" className="flex items-center gap-1">
          <Users className="w-3 h-3" />
          {userCount} online
        </Badge>
      )}
    </div>
  )
}

export default ConnectionStatus
