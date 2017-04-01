const spawn = require('child_process').spawn;

function rendererInit(url, sizeX, sizeY, clientScripts) {
    return new Promise((resolve, reject) => {
        const output = [];
        const startTime = Date.now();
        const args = [__dirname + '/renderer.js', url, sizeX, sizeY];
        if (clientScripts !== undefined) {
            args.push(clientScripts);
        }

        const start = spawn('casperjs', args);

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
            let imageData = JSON.parse(output.join(''));
            let bufferData = imageData.map((data) => {
                let base64Data = data.split(',')[1];
                let buffer = Buffer.from(base64Data, 'base64');
                return new Buffer(buffer, 'base64')
            });

            resolve(bufferData);
        });
    });
}

module.exports = rendererInit;