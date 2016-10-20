"use strict";
var socket = require('socket.io');
var express = require('express');
var GameServer_1 = require('./lib/GameServer');
var Main = (function () {
    function Main() {
        this.createServer();
        this.createIOServer();
        this.gameServer = new GameServer_1.GameServer({
            io: this.io
        });
    }
    Main.prototype.createServer = function () {
        var _this = this;
        this.app = express();
        this.app.use(express.static('public'));
        this.server = this.app.listen(this.getPort(), function () {
            console.log('server started on port: ' + _this.getPort());
        });
    };
    Main.prototype.createIOServer = function () {
        this.io = socket(this.server);
    };
    Main.prototype.getPort = function () {
        return process.env.PORT || 5000;
    };
    return Main;
}());
new Main();
