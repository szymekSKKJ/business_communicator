"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("http");
var socket_io_1 = require("socket.io");
var httpServer = (0, http_1.createServer)();
var io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "*",
    },
});
var activeUsers = new Map();
var callingClients = new Map();
var callRooms = new Map();
var logicForMessages = function (socket) {
    socket.on("sendingMessage", function (message) {
        var toUserId = message.toUserId, content = message.content, fromUserId = message.fromUserId, messageId = message.messageId, fromUserPublicId = message.fromUserPublicId;
        var foundClient = activeUsers.get(toUserId);
        foundClient === null || foundClient === void 0 ? void 0 : foundClient.conectedInstance.forEach(function (ioId) {
            io.to(ioId).emit("receivingMessage", {
                toUserPublicId: fromUserPublicId,
                id: messageId,
                toUserId: fromUserId,
                content: content,
            });
        });
    });
};
var logicForCalling = function (socket) {
    socket.on("setLocalDescription", function (data) { return __awaiter(void 0, void 0, void 0, function () {
        var localDescription, toUserId, fromUserId, ioId, roomId, callingClientTo, callingClientFrom, candidatesFrom_1, candidatesTo_1;
        return __generator(this, function (_a) {
            localDescription = data.localDescription, toUserId = data.toUserId, fromUserId = data.fromUserId, ioId = data.ioId, roomId = data.roomId;
            callingClientTo = callingClients.get(toUserId);
            callingClientFrom = callingClients.get(fromUserId);
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
                }
                else {
                    callingClients.set(fromUserId, {
                        ioId: ioId,
                        candidates: [],
                        isConnected: false,
                        localDescription: localDescription,
                        toUserId: toUserId,
                        roomId: roomId,
                    });
                }
            }
            else if (callingClientTo.localDescription) {
                if (callingClientTo.localDescription.type === "offer" && localDescription.type === "offer") {
                    io.to(ioId).emit("setRemoteDescription", {
                        remoteDescription: callingClientTo.localDescription,
                        fromUserId: fromUserId,
                    });
                }
                else if (localDescription.type === "answer") {
                    io.to(callingClientTo.ioId).emit("setRemoteDescription", {
                        remoteDescription: localDescription,
                        fromUserId: fromUserId,
                    });
                    if (callingClientFrom && callingClientTo) {
                        candidatesFrom_1 = __spreadArray([], callingClientFrom.candidates, true);
                        callingClientFrom.candidates.forEach(function (candidate, index) {
                            io.to(callingClientTo.ioId).emit("setCandidate", {
                                candidate: candidate,
                            });
                            candidatesFrom_1.splice(0, 1);
                        });
                        callingClientFrom.candidates = candidatesFrom_1;
                        callingClients.set(fromUserId, callingClientFrom);
                        candidatesTo_1 = __spreadArray([], callingClientTo.candidates, true);
                        callingClientTo.candidates.forEach(function (candidate) {
                            io.to(callingClientFrom.ioId).emit("setCandidate", {
                                candidate: candidate,
                            });
                            candidatesTo_1.splice(0, 1);
                        });
                        callingClientTo.candidates = candidatesTo_1;
                        callingClients.set(toUserId, callingClientTo);
                    }
                }
            }
            return [2 /*return*/];
        });
    }); });
    socket.on("newCandidate", function (data) {
        var ioId = data.ioId, fromUserId = data.fromUserId, toUserId = data.toUserId, candidate = data.candidate, roomId = data.roomId;
        var callingClientFrom = callingClients.get(fromUserId);
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
            }
            else {
                callingClients.set(fromUserId, {
                    ioId: ioId,
                    candidates: __spreadArray([candidate], callingClientFrom.candidates, true),
                    localDescription: callingClientFrom.localDescription,
                    isConnected: false,
                    toUserId: toUserId,
                    roomId: roomId,
                });
            }
        }
        else {
            var callingClientTo_1 = callingClients.get(toUserId);
            if (callingClientFrom && callingClientTo_1) {
                var candidates_1 = __spreadArray([], callingClientFrom.candidates, true);
                callingClientFrom.candidates.forEach(function (candidate) {
                    io.to(callingClientTo_1.ioId).emit("setCandidate", {
                        candidate: candidate,
                    });
                    candidates_1.splice(0, 1);
                });
                callingClientFrom.candidates = candidates_1;
                callingClients.set(fromUserId, __assign(__assign({}, callingClientFrom), { isConnected: true }));
                if (callingClientTo_1 && callingClientTo_1.isConnected) {
                    callingClients.delete(fromUserId);
                    callingClients.delete(toUserId);
                }
            }
        }
    });
};
var addToActive = function (socket) {
    socket.on("addUserToActive", function (data) {
        var userId = data.userId;
        var isAlreadyConnected = activeUsers.get(userId);
        if (isAlreadyConnected) {
            activeUsers.set(userId, {
                callRooms: [],
                conectedInstance: __spreadArray(__spreadArray([], isAlreadyConnected.conectedInstance, true), [socket.id], false),
            });
        }
        else {
            activeUsers.set(userId, {
                callRooms: [],
                conectedInstance: [socket.id],
            });
        }
    });
    socket.on("disconnect", function () {
        var foundDisconnectedUser = Array.from(activeUsers, function (_a) {
            var userId = _a[0], value = _a[1];
            return (__assign({ userId: userId }, value));
        }).find(function (data) {
            return data.conectedInstance.includes(socket.id);
        });
        if (foundDisconnectedUser) {
            var isThisSocketConnectedToCallRoom = foundDisconnectedUser.callRooms.find(function (data) { return data.ioId === socket.id; });
            if (isThisSocketConnectedToCallRoom) {
                var foundCallRoom = isThisSocketConnectedToCallRoom;
                var foundRoomBefore = callRooms.get(foundCallRoom.roomId);
                var userIndexInCallRoom = foundRoomBefore.findIndex(function (data) { return data.userId === foundDisconnectedUser.userId; });
                foundRoomBefore.splice(userIndexInCallRoom, 1);
                callRooms.set(foundCallRoom.roomId, foundRoomBefore);
                var foundRoomAfter = callRooms.get(foundCallRoom.roomId);
                foundRoomAfter.forEach(function (data) {
                    io.to(data.ioId).emit("userDisconectedFromRoom", { userId: foundDisconnectedUser.userId });
                });
                if (foundRoomAfter.length === 0) {
                    callRooms.delete(foundCallRoom.roomId);
                }
            }
            if (foundDisconnectedUser.conectedInstance.length === 1) {
                activeUsers.delete(foundDisconnectedUser.userId);
            }
            else {
                var indexOfInstanceToRemove = foundDisconnectedUser.conectedInstance.findIndex(function (ioId) { return ioId === socket.id; });
                foundDisconnectedUser.conectedInstance.splice(indexOfInstanceToRemove, 1);
                activeUsers.set(foundDisconnectedUser.userId, {
                    callRooms: [],
                    conectedInstance: foundDisconnectedUser.conectedInstance,
                });
            }
        }
        else {
            console.log("trying delete:", activeUsers);
        }
    });
};
var initializeCall = function (socket) {
    socket.on("callTo", function (data) {
        var userId = data.userId, callingToUserId = data.callingToUserId, roomId = data.roomId;
        var doesThisRoomExists = callRooms.get(roomId);
        if (doesThisRoomExists === undefined) {
            callRooms.set(roomId, []);
        }
        var callingToActiveUser = activeUsers.get(callingToUserId);
        if (callingToActiveUser) {
            callingToActiveUser.conectedInstance.forEach(function (ioId) {
                io.to(ioId).emit("calling", {
                    fromUserId: userId,
                    roomId: roomId,
                });
            });
        }
    });
    socket.on("joinToRoom", function (data) {
        var userId = data.userId, roomId = data.roomId;
        var usersInRoomBefore = callRooms.get(roomId);
        if (usersInRoomBefore !== undefined) {
            var isThisUserAlreadyInRoom = usersInRoomBefore.findIndex(function (data) { return data.userId === userId; });
            if (isThisUserAlreadyInRoom !== -1) {
                var indexOfThisUser = isThisUserAlreadyInRoom;
                usersInRoomBefore.splice(indexOfThisUser, 1);
            }
            callRooms.set(roomId, __spreadArray(__spreadArray([], usersInRoomBefore, true), [
                {
                    userId: userId,
                    ioId: socket.id,
                },
            ], false));
            var usersInRoomAfter = callRooms.get(roomId);
            usersInRoomAfter.forEach(function (data) {
                io.to(data.ioId).emit("userJoined", {
                    userId: userId,
                });
            });
            usersInRoomBefore.forEach(function (data) {
                io.to(socket.id).emit("userJoined", {
                    userId: data.userId,
                });
            });
            var activeUser = activeUsers.get(userId);
            if (activeUser) {
                activeUsers.set(userId, __assign(__assign({}, activeUser), { callRooms: __spreadArray(__spreadArray([], activeUser.callRooms, true), [
                        {
                            ioId: socket.id,
                            roomId: roomId,
                        },
                    ], false) }));
            }
        }
        else {
            // #SKKJ to znaczy, że coś się zjebało z połączeniem i trzeba ponowić (refresh u clienta czy coś)
        }
    });
    socket.on("refuseCall", function (data) {
        var toUserId = data.toUserId, fromUserId = data.fromUserId;
        var callingToActiveUser = activeUsers.get(toUserId);
        if (callingToActiveUser) {
            callingToActiveUser.conectedInstance.forEach(function (ioId) {
                io.to(ioId).emit("callRefused", { userId: fromUserId });
            });
        }
    });
};
require("events").EventEmitter.defaultMaxListeners = 100;
io.on("connection", function (socket) {
    addToActive(socket);
    logicForMessages(socket);
    initializeCall(socket);
    logicForCalling(socket);
});
httpServer.listen(3001);
