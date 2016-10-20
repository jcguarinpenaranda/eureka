import * as socket from 'socket.io';
import * as express from 'express';
import {GameServer} from './lib/GameServer';

class Main {
    
    app:any;
    server:any;
    io:any;
    gameServer:GameServer;

    constructor(){
        this.createServer();
        this.createIOServer();
        this.gameServer = new GameServer({
            io:this.io
        });
    }

    createServer(){
        this.app = express();
        //this.app.use(express.static('public'));
        this.server = this.app.listen(this.getPort(), ()=>{
            console.log('server started on port: '+this.getPort());
        })
    }

    createIOServer(){
        this.io = socket(this.server);
    }

    getPort():number{
        return process.env.PORT || 5000;
    }

}

new Main();