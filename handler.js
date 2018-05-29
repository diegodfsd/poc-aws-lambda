'use strict';

const request = require('./request-service')

/**
 * Creates a error response
 * @param {string} message - error message
 * @param {number} statusCode - http status code
 */
const failure = (message, statusCode) => ({
  statusCode: statusCode || 501,
  headers: { 'Content-Type': 'text/plain' },
  body: message
})

/**
 * Creates a success response
 * @param {string} body 
 */
const success = (body) => {
  return { 
    statusCode: 200, 
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  }
}

/**
 * Get a client token
 */
const authenticate = async () => {
  const clientId = process.env.CLIENT_ID
  const clientSecret = process.env.CLIENT_SECRET
  const options = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(`${clientId}:${clientSecret}`).toString('base64')) },
    form: { grant_type: 'client_credentials' }
  }

  const resp = await request.post(options)
  return resp.body.access_token
}

/**
 * Searches tracks, albums or playlists
 * @param {object} event - contains all information about request
 * @param {object} context - contains information about runner environment
 * @param {object} callback - callback function 
 */
module.exports.search = async (event, context, callback) => {
  const qs = event.queryStringParameters || {}

  const token = await authenticate()
  const options = {
    url: `https://api.spotify.com/v1/search?q=${qs.q}&type=track,playlist,album&limit=10&offset=0`,
    headers: { 'Authorization': `Bearer ${token}` }
  }

  try {
    const body = await request.get(options)
    callback(null, success(body))
  } catch (reason) {
    console.log(reason)
    callback(failure('Something went wrong'))
  }
}

/**
 * Get user's account data
 * @param {object} event - contains all information about request
 * @param {object} context - contains information about runner environment
 * @param {object} callback - callback function 
 */
module.exports.account = async (event, context, callback) => {
  // const users = ['12148069626', 'jmperezperez', 'smedjan'];
  const id = event.pathParameters.id

  if (!id) {
    callback(null, createHttpError('Incorrect id', 400));
    return;
  }

  const token = await authenticate()
  const options = {
    url: `https://api.spotify.com/v1/users/${id}`,
    headers: { 'Authorization': `Bearer ${token}` }
  }

  try {
    const body = await request.get(options)
    callback(null, success(body))
  } catch (reason) {
    console.log(reason)
    callback(failure('Something went wrong'))
  }
}
