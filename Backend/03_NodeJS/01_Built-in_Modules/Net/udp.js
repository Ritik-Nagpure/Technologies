// use  echo "ff" | nc -w1 - 192.168.0.104 8081  to communicate with udp server

import dgram from "dgram";

const socket = dgram.createSocket('udp4');

socket.on('message', (msg, rinfo) => {
    console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
});

socket.bind(8081);