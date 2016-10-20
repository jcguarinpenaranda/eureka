"use strict";
var GameServer = (function () {
    function GameServer(params) {
        var _this = this;
        this.clients = [];
        this.io = params.io;
        this.io.sockets.on('connection', function (socket) {
            _this.onNewConnection(socket);
            socket.on('disconnect', function () {
                _this.onDisconnection(socket);
            });
        });
    }
    GameServer.prototype.onNewConnection = function (socket) {
        console.log("connected " + socket.id);
        this.clients.push(socket);
        this.broadcastPresence(socket);
    };
    GameServer.prototype.onDisconnection = function (socket) {
        console.log("disconnected " + socket.id);
    };
    GameServer.prototype.broadcastPresence = function (socket) {
        socket.broadcast.emit('presence', socket.id);
    };
    GameServer.prototype.emmitConnectedClients = function (socket) {
    };
    GameServer.prototype.emitMe = function (socket) {
    };
    return GameServer;
}());
exports.GameServer = GameServer;
