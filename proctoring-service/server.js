import { createServer } from "http";
import { Server as SocketIO } from "socket.io";
import app from "./app.js";
import connectDB from "./src/config/db.js";
import { env } from "./src/config/env.js";
import initializeProctoringSocket from "./src/sockets/proctoring.socket.js";

const server = createServer(app);
const io = new SocketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

initializeProctoringSocket(io);

const startServer = async () => {
  try {
    await connectDB();

    server.listen(env.port, () => {
      console.log(`Proctoring Service running on ${env.port}`);
    });
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

startServer();
