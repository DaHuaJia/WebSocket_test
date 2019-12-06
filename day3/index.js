var express = require("express")
var app = express()
var server = require("http").createServer(app)
var io = require("socket.io")(server)

// socket.io 
io.on("connection", function(socket){
	
	// 监听客户端的login 事件
	socket.on("login", function(data){
		// 给当前连接设置用户名
		socket.username = data;
		console.log(socket.username+" 登录成功");
		// 给当前用户返回状态码
		socket.emit("msg", {code: 200});
	});
	
	// 监听客户端 mySend 事件
	socket.on("mySend", function(data){
		// 给所有客户端发送msg 推送
		io.emit("msg", {code: 0, user: socket.username, msg: data});
	});
	
});

// 静态文件中间件, 对于静态文件的路由过滤，不进行代理
app.use(express.static(__dirname+"/static"));

// 匹配根目录
app.get("/", function(req, res){
	res.send("Hello World.");
});

// 匹配任意目录
app.get("*", function(req, res){
	// 发送文件
	res.sendFile(__dirname+"/chat.html");
});

server.listen(1234, function(err){
	console.log("服务启动成功。");
});