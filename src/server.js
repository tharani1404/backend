// server.js

// Catch any uncaught errors
process.on('uncaughtException', err => {
  console.error('❌ Uncaught Exception:', err);
});

process.on('unhandledRejection', reason => {
  console.error('❌ Unhandled Rejection:', reason);
});

// Imports
import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import userRoutes from "./routes/users.route.js";
import chatRoutes from "./routes/chat.route.js";
import productRoutes from "./routes/products.route.js";
import askyournetaRoutes from "./routes/askyourneta.route.js";
import newsRoutes from "./routes/news.route.js";
import cors from 'cors';
import { Server } from "socket.io";
import http from "http";

dotenv.config();
const app = express();
app.use(cors());

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Config
const PORT = process.env.PORT || 5000;

// Routes
app.use("/api", userRoutes);
app.use("/api", chatRoutes);
app.use("/api", productRoutes);
app.use("/api", askyournetaRoutes);
app.use("/api", newsRoutes);

// Socket.io setup
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("joinRoom", (conversationId) => {
        socket.join(conversationId);
    });

    socket.on("sendMessage", async (data) => {
        const { conversation_id } = data;
        io.to(conversation_id).emit("newMessage", data);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

// Start server
server.listen(PORT, () => {
    connectDB();
    console.log(`🚀 Server started at http://localhost:${PORT}`);
});
