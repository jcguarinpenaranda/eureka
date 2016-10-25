# Eureka

Eureka is a simple 2d or 3d multiplayer game server written in Typescript and NodeJS.

Working with Eureka is simple, you just have to run this server on your machine or in the cloud, and develop your own videogame or experience connecting to it.

## Getting started

To get started, you need to create a folder and then cd into it.

```bash
mkdir project && cd project
```

Then, create an index.html file, a file app.js and grab a copy of socket.io. Write your html file like this:

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <title>Colaborative Drawing App</title>
        <meta charset="UTF-8">
        
        <!-- socket.io -->
        <script src="https://cdn.socket.io/socket.io-1.4.5.js"></script>

        <!-- our app's main file -->
        <script src="app.js"></script>
    </head>
    <body>
    ...
    </body>
</html>
``` 

Now, inside app.js, write the following:

```js
var socketio = io();

// Then connect the client to the game server 
// in this case it was on localhost:5000, 
// but if you deployed the game server to the cloud
// then write the corresponding url
socketio.connect('http://localhost:5000')

// now we can work!
```

On the next section (Server events) we are going to show you how you can work with Eureka game server to make your 2d or 3d videogame experiences.

**NOTE**: For interacting with Eureka you are free to use the technology you prefer. This means you can pack your app.js file with Browserify, Webpack, or even transpile it from ES2015 or Typescript.

## Server events

Eureka has a set of predefined events to communicate with your application. The following is the list of events received and emitted by the server and their description.

### When you connect or somebody else connects to the server: 

#### > presence
This is an event broadcasted to all the clients connected to the game server. It contains the id of a newly connected client.

Receiving this event: 

```js
var otherPlayers = []
var me;

socket.on('presence', function(playerId){
  var newPlayer = playerId; //abcdefg (a string identifier for the player)

  // push it to your list of other players
  otherPlayers.push(playerId);
})
```

#### > me

This is an event emitted to each new client to let them know which is their playerId. The difference between *presence* and *me* is that *presence* gives you and id of a newly connected player different from you, and *me* gives you your own id.

Receiving this event: 

```js
var otherPlayers = []
var me;

// socket.on('presence' ).....

socket.on('me', function(playerId){
  me = playerId;
})
```

#### > connected_clients
This is an event emmited to each new client to let them know which are the other active players that were already connected to the game server.

Receiving this event: 

```js
var otherPlayers = []
var me;

// socket.on('presence' ).....
// socket.on('me')....

socket.on('connected_clients', function(otherPlayersIds){
  
  // we merge both arrays, otherPlayers and otherPlayersIds
  // now we know all the other players that were connected 
  // to this game server before we entered the game
  var otherPlayers = otherPlayers.concat(otherPlayersIds);

})
```


### During the game interaction
During the game interaction you can send a lot of messages. Common games would have events for letting the other players know when a user has moved, or jumped, eaten something, etc.

With Eureka, you will only receive one event: the userEvent.

#### > userEvent
This event has the information of the action performed by other client. It also let us tell all the other clients something new about us.

Before showing an example of how to receive this event, lets see an example on how to publish this event. Let's say that in our game we want to walk. So we would do:

```js 
var otherPlayers = []
var me;

// socket.on('presence' ).....
// socket.on('me')....
// socket.on('connected_clients')....


// now we are telling all the other clients that we are walking
socket.emit('userEvent', {
  eventName: 'walking',
  x: 123,
  y: 456
})

```

Now, let's see how we would receive this event to know when other players are walking:

```js 
var otherPlayers = []
var me;

// socket.on('presence' ).....
// socket.on('me')....
// socket.on('connected_clients')....

socket.on('userEvent', function(userEvent){
  
  // let's receive a walking event
  if(userEvent.eventName == 'walking'){

    // please note that userEvent comes with the playerId 
    // of the player who emitted this event.
    // Now we are able to walk
    walk(userEvent.playerId, userEvent.x, userEvent.y);
  }
})

walk(playerId, x, y){
  console.log('look! i am walking!', playerId, x, y);
}
```


### When somebody disconnects from the server:


#### > disconnected 