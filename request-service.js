'use strcit';

const request = require('request');

const doRequest = async (method, config) => {
    if (!config.url) throw new Error('url is required.');

    return (new Promise((resolve, reject) => {
        const options = Object.assign({
            json: true
        }, config);

        request[method](options, (error, response, body) => {
            if (error) return reject(error);
            return resolve(response);
        })
    }))
}

module.exports.get = doRequest.bind(null, 'get');
module.exports.post = doRequest.bind(null, 'post');