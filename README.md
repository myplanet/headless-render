# Headless Render

Capture the content of the canvas elements in a given url and return an array of base64 data to be rendered into a file. Can be used for rendering the canvas drawings that created using front-end libraries (like [chart.js](http://www.chartjs.org/), [p5.js](https://p5js.org/), etc.) on the backend.

Promise based. Uses Phantom.js and Casper.js for headless rendering and datauri for converting the given html to datauri format.

## Examples

### Simple Example

```javascript
const fs = require('fs');
const render = require('headless-render').render;

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
```

### More Advanced Example

```javascript
const fs = require('fs');
const datauri = require('headless-render').datauri;
const render = require('headless-render').render;
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
            const dataUri = data[0];
            const base64Data = dataUri.split(',')[1];
            const buffer = Buffer.from(base64Data, 'base64');

            return new Promise((resolve, reject) => {
                fs.writeFile(`./image-${index}.png`, new Buffer(buffer, 'base64'), (err, response) => {
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
```

![](https://github.com/hibernationTheory/headless-render/blob/master/examples/02/montage.jpg)
**Image inspired by this [sketch](https://www.openprocessing.org/sketch/415113)**
