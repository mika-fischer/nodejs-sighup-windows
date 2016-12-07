const timer = setTimer(() => null, 1000);
process.on('SIGHUP', () => {
    console.log('SIGHUP');
    clearTimer(timer);
});
process.on('exit', () => {
    console.log('exiting');
});