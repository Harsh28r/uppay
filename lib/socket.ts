"use client"

import { io, type Socket } from "socket.io-client"

class SocketService {
  private socket: Socket | null = null
  private readonly serverUrl: string

  constructor() {
    // Use environment variable or fallback to localhost
    this.serverUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001"
  }

  connect(userId: string) {
    if (typeof window !== "undefined") {
      console.log(`🔌 Connecting to Socket.IO server at: ${this.serverUrl}`)

      this.socket = io(this.serverUrl, {
        query: { userId },
        transports: ["websocket", "polling"], // Fallback for production
        timeout: 20000,
        forceNew: true,
      })

      this.socket.on("connect", () => {
        console.log("✅ Connected to server")
      })

      this.socket.on("disconnect", (reason) => {
        console.log("❌ Disconnected from server:", reason)
      })

      this.socket.on("connect_error", (error) => {
        console.error("🚫 Connection error:", error)
      })

      this.socket.on("user_count", (count) => {
        console.log(`👥 Connected users: ${count}`)
      })
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
      console.log("🔌 Socket disconnected")
    }
  }

  emitTaskUpdate(task: any) {
    if (this.socket?.connected) {
      this.socket.emit("task_updated", task)
    }
  }

  emitTaskCreate(task: any) {
    if (this.socket?.connected) {
      this.socket.emit("task_created", task)
    }
  }

  emitTaskDelete(taskId: string) {
    if (this.socket?.connected) {
      this.socket.emit("task_deleted", taskId)
    }
  }

  onTaskUpdate(callback: (task: any) => void) {
    if (this.socket) {
      this.socket.on("task_updated", callback)
    }
  }

  onTaskCreate(callback: (task: any) => void) {
    if (this.socket) {
      this.socket.on("task_created", callback)
    }
  }

  onTaskDelete(callback: (taskId: string) => void) {
    if (this.socket) {
      this.socket.on("task_deleted", callback)
    }
  }

  onUserCount(callback: (count: number) => void) {
    if (this.socket) {
      this.socket.on("user_count", callback)
    }
  }

  offAllListeners() {
    if (this.socket) {
      this.socket.off("task_updated")
      this.socket.off("task_created")
      this.socket.off("task_deleted")
      this.socket.off("user_count")
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false
  }
}

export const socketService = new SocketService()
