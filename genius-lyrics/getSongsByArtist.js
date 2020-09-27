const axios = require('axios')
const config = require('../config')
const url = 'http://api.genius.com/artists/:id/songs?per_page=:per_page&page=:page'

async function getSongsByArtists (id, per_page, page){
  const headers = {
    Authorization: 'Bearer ' + config.genius_api_key
  }

  let u = url.replace(':id', id)
    .replace(':per_page', per_page)
    .replace(':page', page)

  let resp = await axios.get(u, {headers})
  return {
    songs: resp.data.response.songs,
    next_page: resp.data.response.next_page
  }
}

module.exports = getSongsByArtists
