var WebSocketServer = require('websocket').server;
var http = require('http');

// 创建http服务器，响应http请求
var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end("HelloWorld. ");
});

// 监听端口
server.listen(1234, function() {
    console.log((new Date()) + ' Server is listening on port 1234');
});

// 创建 websokcet服务器
wsServer = new WebSocketServer({
	// 直接借用http的服务器
    httpServer: server
});

// 建立连接
wsServer.on('request', function(request) {

	// 当前的连接
    var connection = request.accept(null, request.origin);
    console.log((new Date()) + ' 连接建立');
	
	// 定时给客户端推数据
	setInterval(function(){
		connection.sendUTF((new Date())+"我是服务器。");
	}, 1000);
	
	//监听当前连接，发送消息时触发该方法
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);
            connection.sendUTF(message.utf8Data);
        }
        else if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
            connection.sendBytes(message.binaryData);
        }
    });
	
	// 监听当前连接，关闭连接是触发事件
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' 客户端 ' + connection.remoteAddress + ' 连接断开.');
    });
	
});