import React, { useState, useEffect } from 'react';
import './Console.css';

// Paste your temporary token here for testing
const SPOTIFY_TOKEN = 'BQCYLDRCV_Em6l21Gtcfj5neiNtfBWdXdkTgP9t8RZQqpPVPqWKXthptxTDtEr0ys_jjRGo8lIIFmVc_plUjesXHrUeQVQ7QbUWPAig205dHZEP6yeGSGjaYnguK0EB1GelCvtfa9j6sPuEVc4_mkFhOanGNNtJmPOgpSqGP9TOWMRgSoavRrdKOhKTF_cdMstoMA9XFtY8txl9ZQVMZGT6r04r-R6OJfd0kIksjTkbF7_EkO7Tw2e2K0RvhE_Yqf8-ho4qBZffcPmMFwOkzPN7nywygvoOfJvgjLIePLyLgnwKALXkKW-eznC8yyxZ-BFUpnV5hiA';

function App() {
  const [player, setPlayer] = useState(undefined);
  const [is_paused, setPaused] = useState(false);
  const [is_active, setActive] = useState(false);
  const [current_track, setTrack] = useState('NO TAPE LOADED');
  const [display_text, setDisplayText] = useState('SYSTEM READY    ');

  useEffect(() => {
    // 1. Load the Spotify Web Playback SDK
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: 'Web Console Deck A',
        getOAuthToken: cb => { cb(SPOTIFY_TOKEN); },
        volume: 0.5
      });

      setPlayer(player);

      player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
        setDisplayText('DECK ONLINE     ');
        // NOTE: You must manually select "Web Console Deck A" in your 
        // desktop/mobile Spotify app to transfer playback here!
      });

      player.addListener('player_state_changed', (state) => {
        if (!state) return;
        setTrack(state.track_window.current_track.name.toUpperCase());
        setPaused(state.paused);
        // Truncate/Pad track name to exactly 16 characters for the 90s screen vibe
        const formattedTrack = state.track_window.current_track.name
            .toUpperCase()
            .padEnd(16, ' ')
            .substring(0, 16);
        setDisplayText(formattedTrack);
      });

      player.connect();
    };
  }, []);

  // 2. The Numpad Keyboard Listener (from our previous plan)
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (!player) return;
      
      switch (event.code) {
        case 'Numpad7':
          event.preventDefault();
          player.togglePlay();
          setDisplayText(is_paused ? 'PLAYING...      ' : 'PAUSED          ');
          break;
        case 'Numpad8':
          event.preventDefault();
          player.nextTrack();
          break;
        case 'Numpad4':
          event.preventDefault();
          player.previousTrack();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [player, is_paused]);

  return (
    <div className="console-chassis">
      <div className="lcd-screen">
        <span className="lcd-text">{display_text}</span>
      </div>

      <div className="button-grid">
        <button 
          className="tactile-btn" 
          onClick={() => { player?.previousTrack(); }}
        >
          [4] PREV
        </button>
        <button 
          className="tactile-btn" 
          onClick={() => { player?.togglePlay(); }}
        >
          [7] PLAY/PAUSE
        </button>
        <button 
          className="tactile-btn" 
          onClick={() => { player?.nextTrack(); }}
        >
          [8] NEXT
        </button>
      </div>
    </div>
  );
}

export default App;
