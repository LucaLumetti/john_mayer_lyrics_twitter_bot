const genius = require('./genius-lyrics')
const Twit = require('twit')
const config = require('./config')

const ARTIST_ID = 488 //John Mayer ID for Genius, TODO: retrive id from name

let T = new Twit({
  consumer_key: config.twitter_consumer_key,
  consumer_secret: config.twitter_consumer_secret,
  access_token: config.twitter_access_token,
  access_token_secret: config.twitter_access_token_secret,
  timeout_ms: 60*1000,
  strictSSL: true,
})

/* Genius provides at max 50 songs per request, this function is used to get
 * every song by using multiple requests
 */
async function getSongs(){
  let songs = []
  let r = {next: 1}
  while(r.next){
    r = await genius.getSongsByArtist(ARTIST_ID, 50, r.next)
    songs = songs.concat(r.songs)
  }
  return songs.filter(s => s.primary_artist.id === ARTIST_ID)
}

/* This is the function called every hour to select
 * and post the random lyrics
 */
async function post_lyrics(){
  let songs = await getSongs()
  // pick a random song
  let random = Math.floor(songs.length*Math.random())
  let song = songs[random]

  let lyrics = null
  while(!lyrics)
    lyrics = (await genius.getLyricsBySong(song.url))

  lyrics = lyrics.split('\n').filter(l => l !== '')

  /* select how many verses to post, uniformely from 1 to 4
   * and selected where to start at picking the verses
   */
  let n_verses = Math.floor(4*Math.random())+1
  random = Math.floor((lyrics.length-n_verses)*Math.random())

  // Join them in a single tweet
  let tweet = lyrics.slice(random, random+n_verses).join('\n')

  T.post('statuses/update', { status: tweet }, function(err, data, response) {})
}

post_lyrics()
setInterval(post_lyrics, 1000*60*60)
