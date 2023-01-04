const WebSocket = require("ws");
const fs = require("fs");

// 引用Server类:
const WebSocketServer = WebSocket.Server;

// 实例化:
const wss = new WebSocketServer({
	port: 678,
});
console.log("app started at port 678...");

// 参加游戏玩家列表
let userList = [];
wss.on("connection", function (ws) {
	ws.on("message", function (message) {
		const msg = JSON.parse(message.toString());
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
		wss.clients.forEach(function each(client) {
			if (msg.status === "User") {
				let userMsg = JSON.parse(JSON.stringify(msg));
				console.log(userList)
				userList.forEach((item) => {
					userMsg.user = item;
					client.send(`${JSON.stringify(userMsg)}`);
				});
			} else {
				client.send(`${JSON.stringify(msg)}`);
			}
		});
	});
});

