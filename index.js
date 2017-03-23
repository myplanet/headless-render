const spawn = require('child_process').spawn;

function rendererInit(url, sizeX, sizeY) {
    return new Promise((resolve, reject) => {
        const output = [];
        const startTime = Date.now();

        const start = spawn('casperjs',
            [__dirname + '/renderer.js', url, sizeX, sizeY]
        );

        start.stdout.on('data', data => {
            output.push(data);
        });

        start.stderr.on('data', data => {
            console.log(`stderr: ${data}`);
        });

        start.on('close', code => {
            const endTime = Date.now();
            const duration = new Date(endTime - startTime).getSeconds();
            console.log(`Finished rendering in ${duration} seconds`);
            const imageData = JSON.parse(output.join(''));
            resolve(imageData);
        });
    });
}

module.exports = rendererInit;