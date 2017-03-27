const fs = require('fs');
const render = require('../../index').render;

// assuming the content you want to render is being served to this url.
const url = 'http://127.0.0.1:8080/'; 
const sizeX = 500;
const sizeY = 500;

return render(url, sizeX, sizeY).then((data) => {
	// the render function captures the content of multiple canvas elements in a page, 
	// we are grabbing the first one.
	const dataUri = data[0]; 
	const base64Data = dataUri.split(',')[1];
	const buffer = Buffer.from(base64Data, 'base64');

	return new Promise((resolve, reject) => {
		fs.writeFile(`./image.png`, new Buffer(buffer, 'base64'), (err, response) => {
			if (err) {
				console.log(err);
				reject(err);
			} else {
				resolve();
			}
		});
	});
});
