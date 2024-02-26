import { createServer } from "http";
import { Server, Socket } from "socket.io";

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

const activeUsers = new Map<
  string,
  {
    callRooms: {
      roomId: string;
      ioId: string;
    }[];
    conectedInstance: string[];
  }
>();

const callingClients = new Map<
  string,
  {
    ioId: string;
    roomId: string;
    isConnected: boolean;
    candidates: RTCIceCandidate[];
    localDescription?: RTCSessionDescription;
    toUserId?: string;
  }
>();

const callRooms = new Map<
  string,
  {
    userId: string;
    ioId: string;
  }[]
>();

const logicForMessages = (socket: Socket<any>) => {
  socket.on("sendingMessage", (message: { fromUserId: string; toUserId: string; content: string; messageId: string; fromUserPublicId: string }) => {
    const { toUserId, content, fromUserId, messageId, fromUserPublicId } = message;
    const foundClient = activeUsers.get(toUserId);

    foundClient?.conectedInstance.forEach((ioId) => {
      io.to(ioId).emit("receivingMessage", {
        toUserPublicId: fromUserPublicId,
        id: messageId,
        toUserId: fromUserId,
        content: content,
      });
    });
  });
};

const logicForCalling = (socket: Socket<any>) => {
  socket.on(
    "setLocalDescription",
    async (data: { localDescription: RTCSessionDescription; toUserId: string; fromUserId: string; ioId: string; roomId: string }) => {
      const { localDescription, toUserId, fromUserId, ioId, roomId } = data;
      const callingClientTo = callingClients.get(toUserId);
      const callingClientFrom = callingClients.get(fromUserId);

      if (callingClientTo === undefined) {
        if (callingClientFrom) {
          callingClients.set(fromUserId, {
            ioId: ioId,
            candidates: callingClientFrom.candidates,
            isConnected: false,
            localDescription: localDescription,
            toUserId: toUserId,
            roomId: roomId,
          });
        } else {
          callingClients.set(fromUserId, {
            ioId: ioId,
            candidates: [],
            isConnected: false,
            localDescription: localDescription,
            toUserId: toUserId,
            roomId: roomId,
          });
        }
      } else if (callingClientTo.localDescription) {
        if (callingClientTo.localDescription.type === "offer" && localDescription.type === "offer") {
          io.to(ioId).emit("setRemoteDescription", {
            remoteDescription: callingClientTo.localDescription,
            fromUserId: fromUserId,
          });
        } else if (localDescription.type === "answer") {
          io.to(callingClientTo.ioId).emit("setRemoteDescription", {
            remoteDescription: localDescription,
            fromUserId: fromUserId,
          });

          if (callingClientFrom && callingClientTo) {
            const candidatesFrom = [...callingClientFrom.candidates];

            callingClientFrom.candidates.forEach((candidate, index) => {
              io.to(callingClientTo.ioId).emit("setCandidate", {
                candidate: candidate,
              });

              candidatesFrom.splice(0, 1);
            });

            callingClientFrom.candidates = candidatesFrom;

            callingClients.set(fromUserId, callingClientFrom);

            const candidatesTo = [...callingClientTo.candidates];

            callingClientTo.candidates.forEach((candidate) => {
              io.to(callingClientFrom.ioId).emit("setCandidate", {
                candidate: candidate,
              });

              candidatesTo.splice(0, 1);
            });

            callingClientTo.candidates = candidatesTo;

            callingClients.set(toUserId, callingClientTo);
          }
        }
      }
    }
  );

  socket.on("newCandidate", (data: { ioId: string; candidate: RTCIceCandidate; toUserId: string; fromUserId: string; roomId: string }) => {
    const { ioId, fromUserId, toUserId, candidate, roomId } = data;
    const callingClientFrom = callingClients.get(fromUserId);

    if (candidate) {
      if (callingClientFrom === undefined) {
        callingClients.set(fromUserId, {
          ioId: ioId,
          candidates: [candidate],
          localDescription: undefined,
          isConnected: false,
          toUserId: toUserId,
          roomId: roomId,
        });
      } else {
        callingClients.set(fromUserId, {
          ioId: ioId,
          candidates: [candidate, ...callingClientFrom.candidates],
          localDescription: callingClientFrom.localDescription,
          isConnected: false,
          toUserId: toUserId,
          roomId: roomId,
        });
      }
    } else {
      const callingClientTo = callingClients.get(toUserId);

      if (callingClientFrom && callingClientTo) {
        const candidates = [...callingClientFrom.candidates];

        callingClientFrom.candidates.forEach((candidate) => {
          io.to(callingClientTo.ioId).emit("setCandidate", {
            candidate: candidate,
          });

          candidates.splice(0, 1);
        });

        callingClientFrom.candidates = candidates;
        callingClients.set(fromUserId, {
          ...callingClientFrom,
          isConnected: true,
        });

        if (callingClientTo && callingClientTo.isConnected) {
          callingClients.delete(fromUserId);
          callingClients.delete(toUserId);
        }
      }
    }
  });
};

const addToActive = (socket: Socket<any>) => {
  socket.on("addUserToActive", (data: { userId: string }) => {
    const { userId } = data;

    const isAlreadyConnected = activeUsers.get(userId);

    if (isAlreadyConnected) {
      activeUsers.set(userId, {
        callRooms: [],
        conectedInstance: [...isAlreadyConnected.conectedInstance, socket.id],
      });
    } else {
      activeUsers.set(userId, {
        callRooms: [],
        conectedInstance: [socket.id],
      });
    }
  });

  socket.on("disconnect", () => {
    const foundDisconnectedUser = Array.from(activeUsers, ([userId, value]) => ({ userId, ...value })).find((data) =>
      data.conectedInstance.includes(socket.id)
    );

    if (foundDisconnectedUser) {
      const isThisSocketConnectedToCallRoom = foundDisconnectedUser.callRooms.find((data) => data.ioId === socket.id);

      if (isThisSocketConnectedToCallRoom) {
        const foundCallRoom = isThisSocketConnectedToCallRoom;

        const foundRoomBefore = callRooms.get(foundCallRoom.roomId)!;
        const userIndexInCallRoom = foundRoomBefore.findIndex((data) => data.userId === foundDisconnectedUser.userId);

        foundRoomBefore.splice(userIndexInCallRoom, 1);

        callRooms.set(foundCallRoom.roomId, foundRoomBefore);

        const foundRoomAfter = callRooms.get(foundCallRoom.roomId)!;

        foundRoomAfter.forEach((data) => {
          io.to(data.ioId).emit("userDisconectedFromRoom", { userId: foundDisconnectedUser.userId });
        });

        if (foundRoomAfter.length === 0) {
          callRooms.delete(foundCallRoom.roomId);
        }
      }

      if (foundDisconnectedUser.conectedInstance.length === 1) {
        activeUsers.delete(foundDisconnectedUser.userId);
      } else {
        const indexOfInstanceToRemove = foundDisconnectedUser.conectedInstance.findIndex((ioId) => ioId === socket.id);
        foundDisconnectedUser.conectedInstance.splice(indexOfInstanceToRemove, 1);

        activeUsers.set(foundDisconnectedUser.userId, {
          callRooms: [],
          conectedInstance: foundDisconnectedUser.conectedInstance,
        });
      }
    } else {
      console.log("trying delete:", activeUsers);
    }
  });
};

const initializeCall = (socket: Socket<any>) => {
  socket.on("callTo", (data: { userId: string; callingToUserId: string; roomId: string }) => {
    const { userId, callingToUserId, roomId } = data;

    const doesThisRoomExists = callRooms.get(roomId);

    if (doesThisRoomExists === undefined) {
      callRooms.set(roomId, []);
    }

    const callingToActiveUser = activeUsers.get(callingToUserId);

    if (callingToActiveUser) {
      callingToActiveUser.conectedInstance.forEach((ioId) => {
        io.to(ioId).emit("calling", {
          fromUserId: userId,
          roomId: roomId,
        });
      });
    }
  });

  socket.on("joinToRoom", (data: { userId: string; roomId: string }) => {
    const { userId, roomId } = data;

    const usersInRoomBefore = callRooms.get(roomId);

    if (usersInRoomBefore !== undefined) {
      const isThisUserAlreadyInRoom = usersInRoomBefore.findIndex((data) => data.userId === userId);

      if (isThisUserAlreadyInRoom !== -1) {
        const indexOfThisUser = isThisUserAlreadyInRoom;
        usersInRoomBefore.splice(indexOfThisUser, 1);
      }

      callRooms.set(roomId, [
        ...usersInRoomBefore,
        {
          userId: userId,
          ioId: socket.id,
        },
      ]);

      const usersInRoomAfter = callRooms.get(roomId)!;

      usersInRoomAfter.forEach((data) => {
        io.to(data.ioId).emit("userJoined", {
          userId: userId,
        });
      });

      usersInRoomBefore.forEach((data) => {
        io.to(socket.id).emit("userJoined", {
          userId: data.userId,
        });
      });

      const activeUser = activeUsers.get(userId);

      if (activeUser) {
        activeUsers.set(userId, {
          ...activeUser,
          callRooms: [
            ...activeUser.callRooms,
            {
              ioId: socket.id,
              roomId: roomId,
            },
          ],
        });
      }
    } else {
      // #SKKJ to znaczy, że coś się zjebało z połączeniem i trzeba ponowić (refresh u clienta czy coś)
    }
  });

  socket.on("refuseCall", (data: { fromUserId: string; toUserId: string }) => {
    const { toUserId, fromUserId } = data;

    const callingToActiveUser = activeUsers.get(toUserId);

    if (callingToActiveUser) {
      callingToActiveUser.conectedInstance.forEach((ioId) => {
        io.to(ioId).emit("callRefused", { userId: fromUserId });
      });
    }
  });
};

require("events").EventEmitter.defaultMaxListeners = 100;

io.on("connection", (socket) => {
  addToActive(socket);
  logicForMessages(socket);
  initializeCall(socket);
  logicForCalling(socket);
});

httpServer.listen(3001);
