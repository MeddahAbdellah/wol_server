var dgram = require("dgram");
var net  = require('net');
const { exec } = require("child_process");


const SerialPort = require('serialport');
const port = new SerialPort('COM7', {
    baudRate: 115200,
  });

// Read data that is available but keep the stream in "paused mode"
port.on('readable', function () {
    const data =port.read().toString().split(',');
    console.log("Data: ", data);
    if(data[0] === "1") {
        turnOnPc(data[1].replace(/\r?\n|\r/g, ""));
    }

    if(data[0] === "0") {
        shutdownPc(data[1].replace(/\r?\n|\r/g, ""))
    }

  });

function turnOnPc(remoteMac) {
    exec(`sudo etherwake -i ${remoteMac}`, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });
}
  
function shutdownPc(remoteMac) {
    socket = dgram.createSocket(net.isIPv6('255.255.255.255') ? 'udp6' : 'udp4');
    socket.once('listening', function() {
        socket.setBroadcast(true);
    });
    socket.send(remoteMac, 0, remoteMac.length, 9, '255.255.255.255');
}