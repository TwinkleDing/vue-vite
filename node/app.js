const Koa = require( 'koa' );

const bodyParser = require( 'koa-bodyparser' );

const controller = require( './controller' );

const cors = require( 'koa2-cors' );
const app = new Koa();
app.use( cors() );

// log request URL:
app.use( async ( ctx, next ) => {
    console.log( `Process ${ctx.request.method} ${ctx.request.url}...` );
    await next();
} );

// parse request body:
app.use( bodyParser() );

// add controllers:
app.use( controller() );

app.listen( 3333 );
console.log( 'app started at port 3333...' );


const WebSocket = require( 'ws' );

// 引用Server类:
const WebSocketServer = WebSocket.Server;

// 实例化:
const wss = new WebSocketServer( {
    port: 3001
} );
wss.on( 'connection', function ( ws ) {
    console.log( `[SERVER] connection()` );
    ws.on( 'message', function ( message ) {
        wss.clients.forEach( function each( client ) {
            client.send( `${message}` );
        } );
    } )
} );