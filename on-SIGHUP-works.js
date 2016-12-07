setTimeout(() => null, 1000000);
process.on('SIGHUP', () => {
    console.log('SIGHUP'); // This prints just fine
});