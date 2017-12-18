const DiscordRPC = require('discord-rpc');
const LastFmNode = require('lastfm').LastFmNode;

const ClientId = '392089378773794837'; // you can substitute for your own, of course
const LastFmName = 'thejsa';

const rpc = new DiscordRPC.Client({ transport: 'ipc' });
const lastfm = new LastFmNode({
  api_key: 'your_lastfm_api_key',
  secret: 'your_lastfm_api_secret'
});

var trackStream = lastfm.stream(LastFmName);
trackStream.on('nowPlaying', (track) => {
  console.log('Now playing: ' + track.name + ' by ' + track.artist['#text']);
  setActivity(track);
});

trackStream.on('error', (error) => {
  console.log('Error: '  + error.message);
});

const startTimestamp = new Date();

async function setActivity(track) {
  if (!rpc) return;

  rpc.setActivity({
    details: track.name,
    state: track.artist['#text'],
    largeImageKey: 'lastfm',
    largeImageText: 'https://www.last.fm/user/' + LastFmName,
    instance: false
  });
}

rpc.on('ready', () => {
  trackStream.start();
});

rpc.login(ClientId).catch(console.error);
