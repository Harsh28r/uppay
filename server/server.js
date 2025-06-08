const express = require("express")
const http = require("http")
const socketIo = require("socket.io")
const cors = require("cors")

const app = express()
const server = http.createServer(app)

// Environment configuration
const PORT = process.env.PORT || 3001
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000"

// Configure CORS for Socket.IO
const io = socketIo(server, {
  cors: {
    origin: [CLIENT_URL, "http://localhost:3000", "https://your-app-domain.vercel.app"],
    methods: ["GET", "POST"],
    credentials: true,
  },
})

app.use(
  cors({
    origin: [CLIENT_URL, "http://localhost:3000", "https://your-app-domain.vercel.app"],
    credentials: true,
  }),
)
app.use(express.json())

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    port: PORT,
    connectedUsers: connectedUsers.size,
    timestamp: new Date().toISOString(),
  })
})

// Store connected users
const connectedUsers = new Map()

io.on("connection", (socket) => {
  console.log("User connected:", socket.id)

  // Store user information
  const userId = socket.handshake.query.userId
  if (userId) {
    connectedUsers.set(socket.id, userId)
    console.log(`User ${userId} connected with socket ${socket.id}`)

    // Notify about connection count
    io.emit("user_count", connectedUsers.size)
  }

  // Handle task updates
  socket.on("task_updated", (task) => {
    console.log("Task updated:", task.id)
    // Broadcast to all other clients
    socket.broadcast.emit("task_updated", task)
  })

  // Handle task creation
  socket.on("task_created", (task) => {
    console.log("Task created:", task.id)
    // Broadcast to all other clients
    socket.broadcast.emit("task_created", task)
  })

  // Handle task deletion
  socket.on("task_deleted", (taskId) => {
    console.log("Task deleted:", taskId)
    // Broadcast to all other clients
    socket.broadcast.emit("task_deleted", taskId)
  })

  // Handle user disconnect
  socket.on("disconnect", () => {
    const userId = connectedUsers.get(socket.id)
    if (userId) {
      console.log(`User ${userId} disconnected`)
      connectedUsers.delete(socket.id)

      // Notify about connection count
      io.emit("user_count", connectedUsers.size)
    }
    console.log("User disconnected:", socket.id)
  })
})

server.listen(PORT, () => {
  console.log(`🚀 Socket.IO server running on port ${PORT}`)
  console.log(`📡 Accepting connections from: ${CLIENT_URL}`)
  console.log("⏳ Waiting for client connections...")
})

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully")
  server.close(() => {
    console.log("Server closed")
    process.exit(0)
  })
})

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully")
  server.close(() => {
    console.log("Server closed")
    process.exit(0)
  })
})
