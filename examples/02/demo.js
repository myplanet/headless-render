const fs = require('fs');
const datauri = require('../../index').datauri;
const render = require('../../index').render;
const Promise = require('bluebird');

const sizeX = 500;
const sizeY = 500;
const clientScripts = '';
const concurrency = 10;
const amount = 64;

// the given html file is converted into datauri and served as a url to Casper.js
// using the Bluebird promises library and renders the same url given amount of times.
// `concurrency` controls how many concurrent renders you would like to have.
// executing this script would render the p5.js code inside index.html 64 times by doing 10 renders at a time.
// the code inside index.html randomizes it's parameters every time it's called

datauri('./index.html').then((url) => {

	Promise.map(createArrOfSize(amount), (item, index) => {

		return render(url, sizeX, sizeY, clientScripts).then((data) => {
			// the render function captures the content of all the canvas elements and returns an array, 
			// we are grabbing the first one.
			return new Promise((resolve, reject) => {
				fs.writeFile(`./image-${index}.png`, data[0], (err, response) => {
					if (err) {
						console.log(err);
						reject(err);
					} else {
						resolve();
					}
				});
			});
		});
	}, { concurrency: concurrency === undefined ? 0 : concurrency }).then(() => {
		console.log('image rendering completed');
	});
});

function createArrOfSize(size) {
	const arr = [];
	for (let i = 0; i<size; i++) {
		arr.push(i);
	}
	return arr;
}

// imagemagick command to create a grid of images:
/*
montage *.png -background "#dcdcdc"  -geometry 120x120 montage.jpg
*/