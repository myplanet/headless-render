'use strict';
var fs = require('fs');
var casper = require('casper').create();
var system = require('system');

console.error = function () {
    system.stderr.write(Array.prototype.join.call(arguments, ' ') + '\n');
};

var url = casper.cli.args[0];
var sizeX = casper.cli.args[1];
var sizeY = casper.cli.args[2];
var clientScripts = casper.cli.args[3];

render(casper, url, sizeX, sizeY, clientScripts);

/**
* addBind polyfills the bind function
*/
function addBind() {
    // from this issue: https://github.com/ariya/phantomjs/issues/10522
    if (!Function.prototype.bind) {
        Function.prototype.bind = function(oThis) {
            if (typeof this !== 'function') {
                // closest thing possible to the ECMAScript 5
                // internal IsCallable function
                throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
            }

            var aArgs   = Array.prototype.slice.call(arguments, 1),
                fToBind = this,
                fNOP    = function() {},
                fBound  = function() {
                return fToBind.apply(this instanceof fNOP
                    ? this
                    : oThis,
                    aArgs.concat(Array.prototype.slice.call(arguments)));
            };

        if (this.prototype) {
            // Function.prototype doesn't have a prototype property
            fNOP.prototype = this.prototype; 
        }
        fBound.prototype = new fNOP();

        return fBound;
        };
    }
}


function render(casper, url, sizeX, sizeY, clientScripts) {
    var imageData;
    casper.options.viewportSize = {
        'width':sizeX,
        'height':sizeY
    };

    if (clientScripts) {
        clientScripts = clientScripts.split(',');
        for (var i = 0; i < clientScripts.length; i++) {
            casper.options.clientScripts.push(clientScripts[i]);
        }
    }

    casper.on('page.initialized', function() {
        this.evaluate(addBind);
    });

    casper.on('error', function(message) {
        console.error('error: ' + message);
    });

    casper.on('remote.message', function(message) {
        console.error('remote message caught: ' + message);
    });

    casper.start(url, function() {
        // scripts to be executed once the page is loaded.
    });

    casper.then(function() {
        imageData = this.evaluate(function() {
            var canvasAll = document.querySelectorAll('canvas');

            return Array.prototype.map.call(canvasAll, function(canvas) {
                return canvas.toDataURL('image/png', 0.7);
            });
        });
    });

    casper.run(function () {
        console.log(JSON.stringify(imageData)); // for it to be available in stdout.
        casper.exit();
    });
}
