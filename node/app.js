const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const controller = require("./controller");
const cors = require("koa2-cors");
const fs = require("fs");
const app = new Koa();
app.use(cors());

// log request URL:
app.use(async (ctx, next) => {
	console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
	await next();
});

// parse request body:
app.use(bodyParser());

// add controllers:
app.use(controller());

app.listen(3333);
console.log("app started at port 3333...");

const WebSocket = require("ws");

// 引用Server类:
const WebSocketServer = WebSocket.Server;

// 实例化:
const wss = new WebSocketServer({
	port: 3001,
});
wss.on("connection", function (ws) {
	ws.on("message", function (message) {
		const msg = JSON.parse(message.toString());
		console.log(msg.status);
		if (msg.status === "StartGame") {
            let arr = fs.readFileSync("question.txt").toString().split("\n");
            let question = arr[Math.floor(Math.random() * arr.length)]
            console.log(question)
            msg.question = question;
        }
        message = JSON.stringify(msg);
		wss.clients.forEach(function each(client) {
			client.send(`${message}`);
		});
	});
});
