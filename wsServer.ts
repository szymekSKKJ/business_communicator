import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: "https://business-communicator.vercel.app/",
  },
});

const clients: { ioId: string; userId: string | null }[] = [];

io.on("connection", (socket) => {
  socket.on("getUserId", (userData: { ioId: string; userId: string }) => {
    const { userId } = userData;

    const foundClient = clients.find((client) => client.userId === userId);

    if (foundClient) {
      foundClient.ioId = socket.id;
    } else {
      clients.push({
        ioId: socket.id,
        userId: userId,
      });
    }
  });

  socket.on("sendingMessage", (message: { fromUserId: string; toUserId: string; content: string; messageId: string; fromUserPublicId: string }) => {
    const { toUserId, content, fromUserId, messageId, fromUserPublicId } = message;

    const foundClient = clients.find((client) => client.userId === toUserId);

    io.to(foundClient!.ioId).emit("receivingMessage", {
      toUserPublicId: fromUserPublicId,
      id: messageId,
      toUserId: fromUserId,
      content: content,
    });
  });
});

httpServer.listen(3001);
