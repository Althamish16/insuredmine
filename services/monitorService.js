import os from 'os-utils'


const THRESHOLD = 0.7; // 70% threshold

//this done because I only have laptop not seperate node server
export function monitorCPU() {
    os.cpuUsage(function(v) {
        console.log('CPU Usage:', v);
        if (v > THRESHOLD) {
            console.log('CPU usage is above threshold. Restarting server...');
            restartServer();
        }
    });
}

function restartServer() {

    // if want we can do catchy cleanup loggic.
    console.log('Restarting Node.js process...');
    process.exit(); // This restarts the Node.js process on your laptop
}
