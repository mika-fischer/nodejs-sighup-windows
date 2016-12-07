setTimeout(() => null, 1000000);
process.once('SIGHUP', () => {
    console.log('SIGHUP'); // This never prints...
});