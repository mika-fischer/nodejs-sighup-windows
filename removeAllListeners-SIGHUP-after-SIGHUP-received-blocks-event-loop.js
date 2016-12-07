setTimeout(() => null, 1000000);
process.on('SIGHUP', () => {
    console.log('SIGHUP');
    process.removeAllListeners('SIGHUP');
    console.log('Removed SIGHUP handler'); // This never prints...
});
