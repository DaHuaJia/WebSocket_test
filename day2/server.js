// 多终端 通过websocket通信
// 引入websocket server模块
var WebSocketServer = require("websocket").server
var http = require("http")

// http服务器
var server = http.createServer();
// 监听端口
server.listen(1234, function(){
	console.log("服务器建立连接");
});

// 保存所有加入的连接
var clients = [];

// 创建websocket服务器
var wsServer = new WebSocketServer({httpServer: server});

// websocket服务器
wsServer.on("request", function(webSocketRequest){
	// 当前连接
	var connection = webSocketRequest.accept(null, "accepted-origin");
	console.log("有一个连接加入");
	// 将该连接保存到数组中
	clients.push(connection);
	
	// 接收到客户端发送数据时触发
	connection.on("message", function(msg){
		if(msg.type == "utf8"){
			// 将消息发送给所有用户
			clients.forEach(function(item){
				item.sendUTF(msg.utf8Data);
			});
		}
	});
	
	// 断开连接时触发
	connection.on("close", function(reasonCode, description){
		console.log("有一个连接断开");
		var index = clients.indexOf(connection);
		clients.splice(index, 1);
	});
	
});
