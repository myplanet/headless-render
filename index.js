const datauri = require('datauri').promise;
const rendererInit = require('./rendererInit');

module.exports = {
    datauri: datauri,
    render: rendererInit,
};
