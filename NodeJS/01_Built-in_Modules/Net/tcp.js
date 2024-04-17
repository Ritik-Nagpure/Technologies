// Node.js net module is used to create both servers and clients. This module provides an asynchronous network wrapper and it can be imported using the following syntax.

// use telnet <ip address> <port name> 
import net from 'net';

const server = net.createServer(
    socket => {
        socket.write(" Hello ");
        socket.on('data', data => {
            console.log(data.toString());
        })
    }
)

server.listen(8080);