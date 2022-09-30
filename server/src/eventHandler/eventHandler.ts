import { Server, Socket } from 'socket.io'
import User from "../entities/User";
import Message from "../entities/Message";
import Notification from "../entities/Notification";

class EventHandler {
  private io: Server;
  constructor(io: Server) {
    this.io = io
    this.createConnection();
  }

  private createConnection() {
    this.io.on("connection", (socket: Socket) => {
     console.log("Socket connected successfully!")
      this.joinRoom(socket)
      this.disconnect(socket)
    })
  }


  private joinRoom(socket: Socket) {
    socket.on("setup", (currUser: User) => {
      socket.join(currUser.id.toString())
      socket.emit("connected")
    })

    socket.on("send notification", (notification: Notification) => {
      if (notification) {
        socket.in(notification.receiver_id.toString()).emit("notification received", notification)
      }
    })

    socket.on("join chat", (conversationId: number) => {
      socket.join(conversationId.toString())
    })
    this.messageTransmission(socket)
  }

  private messageTransmission(socket: Socket) {
    socket.on("typing", (room: number) => socket.in(room.toString()).emit("typing"))
    socket.on("stop typing", (room: number) => socket.in(room.toString()).emit("stop typing"))

    socket.on("new message", (newMessageReceived: Message) => {
      if (newMessageReceived.conversation.sender_id == newMessageReceived.sender_id) {
        socket.in(newMessageReceived.conversation.receiver_id.toString()).emit("message received", newMessageReceived)
      }
      if (newMessageReceived.conversation.receiver_id == newMessageReceived.sender_id) {
        socket.in(newMessageReceived.conversation.sender_id.toString()).emit("message received", newMessageReceived)
      }
    })
  }

  private disconnect(socket: Socket) {
    socket.on("delete", (currUser: User) => {
      console.log("User left the room", currUser.user_name)
      socket.leave(currUser.id.toString())
      socket.disconnect()
    })
  }
}

export default EventHandler;
