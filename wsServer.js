"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("http");
var socket_io_1 = require("socket.io");
var httpServer = (0, http_1.createServer)();
var io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "https://business-communicator.vercel.app/",
    },
});
var clients = [];
io.on("connection", function (socket) {
    socket.on("getUserId", function (userData) {
        var userId = userData.userId;
        var foundClient = clients.find(function (client) { return client.userId === userId; });
        if (foundClient) {
            foundClient.ioId = socket.id;
        }
        else {
            clients.push({
                ioId: socket.id,
                userId: userId,
            });
        }
    });
    socket.on("sendingMessage", function (message) {
        var toUserId = message.toUserId, content = message.content, fromUserId = message.fromUserId, messageId = message.messageId, fromUserPublicId = message.fromUserPublicId;
        var foundClient = clients.find(function (client) { return client.userId === toUserId; });
        io.to(foundClient.ioId).emit("receivingMessage", {
            toUserPublicId: fromUserPublicId,
            id: messageId,
            toUserId: fromUserId,
            content: content,
        });
    });
});
httpServer.listen(3001);
