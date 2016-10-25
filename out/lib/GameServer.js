"use strict";
var GameServer = (function () {
    function GameServer(params) {
        var _this = this;
        this.clients = [];
        this.io = params.io;
        this.maxAllowed = params.maxAllowed || 30;
        this.io.sockets.on('connection', function (socket) {
            _this.onNewConnection(socket);
            _this.onGameEvents(socket);
            socket.on('heartbeat', function () {
                socket.emit('heartbeat', {});
            });
            socket.on('disconnect', function () {
                _this.onDisconnection(socket);
            });
        });
    }
    GameServer.prototype.onGameEvents = function (socket) {
        socket.on('userEvent', function (data) {
            data.playerId = socket.id;
            if (data.eventName) {
                socket.broadcast.emit(data.eventName, data);
            }
            else {
                socket.emit('error', { code: 1, message: "You must send eventName" });
            }
        });
    };
    GameServer.prototype.onNewConnection = function (socket) {
        if ((this.clients.length + 1) > this.maxAllowed) {
            return;
        }
        console.log("connected " + socket.id);
        this.clients.push(socket);
        this.broadcastPresence(socket);
        this.emitMe(socket);
        this.emmitConnectedClients(socket);
    };
    GameServer.prototype.onDisconnection = function (socket) {
        console.log("disconnected " + socket.id);
        socket.broadcast.emit('disconnected', socket.id);
        this.clients = this.clients.filter(function (actual) {
            return actual.id !== socket.id;
        });
    };
    GameServer.prototype.broadcastPresence = function (socket) {
        socket.broadcast.emit('presence', socket.id);
    };
    GameServer.prototype.emmitConnectedClients = function (socket) {
        var others = this.clients.filter(function (actual) {
            return actual.id !== socket.id;
        });
        others = others.map(function (client) {
            return client.id;
        });
        socket.emit('connected_clients', others);
    };
    GameServer.prototype.emitMe = function (socket) {
        socket.emit('me', socket.id);
    };
    return GameServer;
}());
exports.GameServer = GameServer;
