import * as socket from 'socket.io';

export interface GameServerParams {
    io:any,
    maxAllowed?:number
}

export interface GameServerEventParams {
    eventName:string,
    playerId?:string
}

export class GameServer{
    private maxAllowed:number;
    private io:any;
    private clients:Array<any> = [];

    constructor(params:GameServerParams){
        this.io = params.io;
        this.maxAllowed = params.maxAllowed || 30;

        this.io.sockets.on('connection', (socket:any)=>{
            this.onNewConnection(socket);
            
            // se asignan los eventos del juego
            this.onGameEvents(socket);
            
            // evento por defecto para la desconexión
            socket.on('disconnect', ()=>{
                this.onDisconnection(socket);
            })
        })

    }

    onGameEvents(socket:any):void{
        // función básica para que se mueva el jugador
        socket.on('userEvent', function(data:GameServerEventParams){
            data.playerId = socket.id;

            socket.broadcast.emit(data.eventName,data);
            //socket.broadcast.emit('userEvent',data);
        })
    }

    onNewConnection(socket:any):void{
        // se respeta la cantidad de usuarios máximos permitidos
        if( (this.clients.length + 1) > this.maxAllowed) {
            return;
        }

        console.log("connected "+socket.id);
        
        // se agrega el socket a la lista de clientes actuales
        this.clients.push(socket);

        // se emite que llegó alguien nuevo
        this.broadcastPresence(socket);

        // otros eventos por defecto
        this.emitMe(socket);
        this.emmitConnectedClients(socket);
    }

    onDisconnection(socket:any){
        console.log("disconnected "+socket.id);
        
        // se emite a todos los otros que alguien se desconectó
        socket.broadcast.emit('disconnected',socket.id);
        
        // se quita el cliente que se desconectó
        this.clients = this.clients.filter(function(actual){
            return actual.id !== socket.id;
        })
    }

    broadcastPresence(socket:any){
        socket.broadcast.emit('presence', socket.id);
    }

    emmitConnectedClients(socket:any){
        let others = this.clients.filter(function(actual){
            return actual.id !== socket.id;
        })
    
        others = others.map(function(client){
            return client.id;
        });
    
        socket.emit('connected_clients',others);
    }

    emitMe(socket:any){
        socket.emit('me', socket.id);
    }
 
}