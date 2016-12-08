const timer = setInterval(() => null, 1000);
process.on('SIGHUP', () => {
    console.log('SIGHUP');
    clearInterval(timer);
    process.exit(0);
});
process.on('exit', () => {
    console.log('exiting');
});