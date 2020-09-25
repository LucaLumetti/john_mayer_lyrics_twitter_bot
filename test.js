const genius = require('../genius-lyrics-api/index.js')
const Twit = require('twit')

const API_KEY = 'XNefn0Nryk8W4hFCGvfn69vpY6Thx9EMUwg9EN2izgRj-2WfuKApAbXMTNXen4Q3'
const options = {
  apiKey: API_KEY,
  id: 488,
  per_page: 50,
  page: 1,
  optimizeQuery: true
};

let T = new Twit({
  consumer_key: '9TW6mzULAKQyahYA4ioGjTuwQ',
  consumer_secret: 'UhO3oF6SGMifIqduNZChtyjKbDdDwZoaXqgS1KJ4fScS0Gftw4',
  access_token: '1309435820177330176-dBmABNo13cTHQN5YhtYHbQGUWfkkJD',
  access_token_secret:  'zT6R6atcVHvRDbVnNaxl9flDU3xZy7YPFSaX9cPz3i8Z5',
  timeout_ms: 60*1000,  // optional HTTP request timeout to apply to all requests.
  strictSSL: true,     // optional - requires SSL certificates to be valid.
})

async function getSongs(){
  let songs = []
  let r = {next: 1}
  //genius.getLyrics(options).then((lyrics) => console.log(lyrics));
  while(r.next){
    r = await genius.getSongsByArtist(488, 50, r.next, API_KEY)
    songs = songs.concat(r.songs)
  }
  return songs.filter(s => s.primary_artist.id === 488)
}

function post_lyrics(){
  getSongs().then(async (songs) => {
    let random = Math.floor(songs.length*Math.random())
    let song = songs[random]
    let lyrics = (await genius._extractLyrics(song.url, true)).split('\n').filter(l => l !== '')

    let n_verses = Math.floor(4*Math.random())+1
    random = Math.floor((lyrics.length-n_verses)*Math.random())

    let tweet = ''
    for(let i = 0; i < n_verses; i++)
      tweet += `${lyrics[random+i]}\n`

    T.post('statuses/update', { status: tweet }, function(err, data, response) {})
  })
}

post_lyrics()
setInterval(post_lyrics, 1000*60*60)
