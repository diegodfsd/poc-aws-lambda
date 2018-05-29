'use strict';

const request = require('./request-service');
const util = require('./util')

/**
 * Get a client token
 */
const authenticate = () => {
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  const options = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(`${clientId}:${clientSecret}`).toString('base64')) },
    form: { grant_type: 'client_credentials' }
  }

  return request.post(options)
    .then(resp => resp.body.access_token);
}

/**
 * Searches tracks, albums or playlists
 * @param {object} event - contains all information about request
 * @param {object} context - contains information about runner environment
 * @param {object} callback - callback function 
 */
module.exports.search = (event, context, callback) => {
  const qs = event.queryStringParameters || {};

  authenticate().then(token => {
    const options = {
      url: `https://api.spotify.com/v1/search?q=${qs.q}&type=track,playlist,album&limit=10&offset=0`,
      headers: { 'Authorization': `Bearer ${token}` }
    }

    request.get(options)
      .then(body => {
        console.log(body)
        return callback(null, body)
      })
      .catch(reason => callback(reason))
  })
}

/**
 * Get user's profile data
 * @param {object} event - contains all information about request
 * @param {object} context - contains information about runner environment
 * @param {object} callback - callback function 
 */
module.exports.me = (event, context, callback) => {
  const users = ['12148069626', 'jmperezperez', 'smedjan'];
  let id = users[util.rand(0, users.length - 1)]

  if (event.queryStringParameters)
    id = event.queryStringParameters.id

  authenticate().then(token => {
    const options = {
      url: `https://api.spotify.com/v1/users/${id}`,
      headers: { 'Authorization': `Bearer ${token}` }
    }

    request.get(options)
      .then(body => callback(null, body))
      .catch(reason => callback(reason))
  })
};
