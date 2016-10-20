import * as socket from 'socket.io';

export interface GameServerParams{
    io:any
}

export class GameServer{
    private maxAllowed:number;
    private io:any;
    private clients:Array<any> = [];

    constructor(params:GameServerParams){
        this.io = params.io;

        this.io.sockets.on('connection', (socket:any)=>{
            this.onNewConnection(socket);

            socket.on('disconnect', ()=>{
                this.onDisconnection(socket);
            })
        })

    }

    onNewConnection(socket:any):void{
        console.log("connected "+socket.id);
        
        // se agrega el socket a la lista de clientes actuales
        this.clients.push(socket);

        // se emite que llegó alguien nuevo
        this.broadcastPresence(socket);
    }

    onDisconnection(socket:any){
        console.log("disconnected "+socket.id);
    }

    broadcastPresence(socket:any){
        socket.broadcast.emit('presence', socket.id);
    }

    emmitConnectedClients(socket:any){

    }

    emitMe(socket:any){

    }
 
}