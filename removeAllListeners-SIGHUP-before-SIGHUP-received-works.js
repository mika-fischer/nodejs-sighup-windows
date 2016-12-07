setTimeout(() => null, 1000000);
process.on('SIGHUP', () => console.log('SIGHUP'));
setTimeout(() => {
    process.removeAllListeners('SIGHUP');
    console.log('Removed SIGHUP handler'); // This prints just fine...
}, 1000);