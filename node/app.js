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
// 参加游戏玩家列表
let userList = [];
wss.on("connection", function (ws) {
	ws.on("message", function (message) {
		const msg = JSON.parse(message.toString());
		console.log(msg.status);
		if (msg.status === "StartGame") {
			let arr = fs.readFileSync("question.txt").toString().split("\n");
			let question = arr[Math.floor(Math.random() * arr.length)];
			msg.question = question;
		}
		if (msg.status === "User") {
			if (!userList.includes(msg.user)) {
				userList.push(msg.user);
			}
		}
		if (msg.status === "Onunload") {
			let index = "";
			userList.forEach((item, ind) => {
				if (item.user === msg.user) {
					index = ind;
				}
			});
			userList.splice(index, 1);
		}
		if (msg.status === "NextUser") {
			let index = Math.floor(Math.random() * userList.length);
			msg.user = userList[index];
		}
		message = JSON.stringify(msg);
		wss.clients.forEach(function each(client) {
			client.send(`${message}`);
		});
	});
});
