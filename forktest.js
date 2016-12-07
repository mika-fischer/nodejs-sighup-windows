const cluster = require('cluster');

// The more workers, the likelier a hang
const numWorkers = 40;

function log(...args) {
    const date = new Date().toISOString();
    const id = cluster.isMaster ? 'master' : `worker-${cluster.worker.id}`;
    console.log(`${date} [${id}]`, ...args);
}

let sighupReceived = false;
process.on('SIGHUP', () => sighupReceived = true);

// Trying to unregister the SIGHUP handler in beforeExit can also hang
process.on('beforeExit', () => {
    log('In beforeExit handler');
    // If SIGHUP was received before, removeAllListeners hangs...
    if (!sighupReceived) {
        process.removeAllListeners('SIGHUP');
        log('Removed SIGHUP handlers'); // This line is sometimes not printed...
    }
});

process.on('exit', () => {
    // If SIGHUP is received after this point in time, nodejs will hang
    // and there's nothing we can do to prevent it, except always killing
    // ourselves...
    log('In exit handler');
    if (sighupReceived) {
        log('Received SIGHUP in the past, would hang, therefore terminating forcefully');
        process.kill(process.pid);
    }
    log('exiting'); // If the beforeExit handler is disabled, this process sometimes
                    // hangs after printing this... 
});

if (cluster.isMaster) {
    const terminateWorkers = (message) => {
        log(`Received ${message}, terminating...`);
        cluster.disconnect();
    };
    process.on('SIGHUP', () => terminateWorkers('SIGHUP'));
    cluster.on('message', (worker, message) => terminateWorkers(`${message} from worker-${worker.id}`));
    cluster.on('exit', (worker, code, signal) => log(`worker-${worker.id} exited with code ${code} and signal ${signal}`));
    for (let i=0; i<numWorkers; ++i) {
        cluster.fork();
    }
} else {
    const interval = setInterval(() => null, 1000000);
    // Forward SIGHUP to parent
    process.on('SIGHUP', () => process.send('SIGHUP'));
    process.on('disconnect', () => clearInterval(interval));
}
