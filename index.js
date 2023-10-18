const axios = require('axios');

const token = 'YGORfAsKAHcmeFNxwpzoj-MZaJd3Ysjj-r6g7KpH5mxfZwhA4B7TXsU803O18lmE';

const getSong = async (songId) => {
    const response = await axios.get(`http://api.genius.com/songs/${songId}`, {
    headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    return response.data
}

const getLyrics = async(songId) => {
    const song = await getSong(songId)
    return song.response.song.id
}

// Usage with .then
getLyrics('417149').then((id) => {
    console.log(id);
});

async function getGeniusSongLyrics(songId, output = 'tibble', url = null, accessToken = token) {
    output = ['tibble', 'text'].includes(output) ? output : 'tibble';
  
    if (url === null) {
      const geniusSong = await getSong(getLyrics, token);
      url = geniusSong.url;
    }
  
    try {
        const response = await axios.get(url);
    } catch(e) {
        console.log(e)
    }
    
    const html = await response.text();
  
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const paragraphs = Array.from(doc.querySelectorAll('p')).map(node => node.textContent);
  
    const removeBrackets = str => str.replace(/\[.*?\]/g, '');
    const removeNewlines = str => str.replace(/\n/g, ' ');
  
    if (output === 'text') {
      return removeNewlines(removeBrackets(paragraphs[0]));
    } else {
      const lyricsArray = paragraphs[0].split('\n').map(line => removeBrackets(line)).filter(line => line !== '');
      const lyricsTibble = lyricsArray.map(line => ({ Lyrics: line }));
  
      return lyricsTibble;
    }
  }

getGeniusSongLyrics(songId='417149')
    .then(result => {
        console.log(result);
    })
        .catch(error => {
    console.error('Error:', error.message);
    });


