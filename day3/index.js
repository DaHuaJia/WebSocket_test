var express = require("express")
var app = express()
var server = require("http").createServer(app)
var io = require("socket.io")(server)

// socket.io 
io.on("connection", function(socket){
	// 向客户端发送一个消息
	socket.emit("msg", "dasfs");
	
	// 向所有客户端发送消息
	setInterval(function(){
		io.emit("broadcast", "hello world. "+(new Date()));
	}, 1000);
	
	socket.on("reply", function(){
		
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