
import React, { useState, useEffect } from 'react'
import Container from '@material-ui/core/Container';
import { Howl, Howler } from 'howler';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import VolumeDown from '@material-ui/icons/VolumeDown';
import VolumeUp from '@material-ui/icons/VolumeUp';
import PlayCircleFilled from '@material-ui/icons/PlayCircleFilled';
import PauseCircleFilled from '@material-ui/icons/PauseCircleFilled';
import SkipNext from '@material-ui/icons/SkipNext';
import SkipPrevious from '@material-ui/icons/SkipPrevious';
import { debounce } from 'lodash';
import usePrevious from "./hooks/usePrevious";


const useStyles = makeStyles({
  root: {
    maxWidth: '370px',
    margin: 'auto'
  },
});

function padDigits(number, digits) {
  return Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;
}

function formatTime(time) {
  time = time / 60;
  let timeArr = String(time).split('.');
  let seconds = parseFloat(`0.${timeArr[1]}`) * 60;
  seconds = Math.floor(seconds);
  return `${ padDigits(timeArr[0], 2) }:${ padDigits(seconds, 2) }`;
}

const defTracks = [
  {
    title: 'Shell As Seen - 90schillwave',
    file:  '/tracks/90schillwave.mp3',
  },
  {
    title: 'Shell As Seen - Driving Boys',
    file:  '/tracks/driving boys.mp3',
  },
  {
    title: 'Shell As Seen - Emily',
    file: '/tracks/emily.mp3'
  },
  {
    title: 'Shell As Seen - Exp1',
    file: '/tracks/exp1.mp3'
  },
  {
    title: 'Shell As Seen - Rockin\' Williams',
    file: '/tracks/rockin-williams.mp3'
  },
  {
    title: 'Chew - \'Weird\'',
    file: '/tracks/weird.mp3'
  }
]

var interval;
const START_VOLUME = 20;

export default function() {
  const classes = useStyles();

  const [ tracks, setTracks ] = useState(defTracks);

  const [ sound, setSound ] = useState(null);

  const [ trackPlaying, setTrackPlaying ] = useState(0);

  const [ trackSeek, setTrackSeek ] = useState(formatTime(0));

  const [ trackLength, setTrackLength ] = useState(formatTime(0));

  const [ position, setPosition ] = useState(0);

  const [ playing, setPlaying ] = useState(false);

  const [ hasTrackNext, setHasTrackNext ] = useState(tracks.length > 1);

  const [ hasTrackPrev, setHasTrackPrev ] = useState(false);

  const [ intro, setIntro ] = useState(true);

  const [ reload, setReload ] = useState(0); // incremented

  const [ playEvent, setPlayEvent ] = useState(0); // incremented

  const prevPlayEvent = usePrevious(playEvent)

  const [ volume, setVolume ] = useState(START_VOLUME);
  Howler.volume(`${(volume) / 100}`);

  const handleChangeVolume = (event, newValue) => {
    setVolume(newValue);
    let volume = parseFloat(`${(newValue) / 100}`);
    Howler.volume(volume);
  };

  function play() {
    sound.play();
    setPlaying(true);
  }

  function pause() {
    sound.pause();
    setPlaying(false);
  }

  function handleChangePosition(event, newValue) {
    let seek = (sound._duration / 100 * newValue);
    setPosition(newValue);
    sound.seek(seek);
    calculateTimes();
  }

  function handlePositionMouseDown() {
    sound.volume(0);
    window.addEventListener('mouseup', handlePositionMouseUp);
  }

  function handlePositionMouseUp() {
    sound.volume(1);
    window.removeEventListener('mouseup', handlePositionMouseUp);
  }

  function handleSkipNext() {
    setPosition(0);
    setHasTrackNext(!!tracks[trackPlaying + 2]);
    setHasTrackPrev(true);
    setTrackPlaying(trackPlaying + 1);
  }

  function handleSkipPrevious() {
    setPosition(0);
    if (intro && hasTrackPrev) {
      setHasTrackNext(!!tracks[trackPlaying - 1]);
      setHasTrackPrev(!!tracks[trackPlaying - 2]);
      setTrackPlaying(trackPlaying - 1);
    } else {
      setReload(reload + 1);
    }
  }

  function calculateTimes() {
    let trackSeek = formatTime(sound.seek());
    setTrackSeek(trackSeek);
    let trackLength = formatTime(sound._duration);
    setTrackLength(trackLength);
  }

  function tick() {
    const seek = sound.seek();
    let position = Math.ceil(seek / sound._duration * 100);
    setPosition(position);
    if (seek >= 3) {
      setIntro(false);
    }
    calculateTimes();
  }

  let debounceHandleChangePosition = debounce(handleChangePosition, 2);

  useEffect(() => {
    //console.log('Loaded track: ' + tracks[trackPlaying]);
    setIntro(true);
    let autoplay = false;
    if (playing) {
      autoplay = true;
      setPlayEvent(playEvent + 1);
    }
    if (sound) {
      sound.pause();
      calculateTimes();
    }
    setSound(
      new Howl({
        src: tracks[trackPlaying].file,
        autoplay: autoplay,
        loop: false,
        onend: () => {
          if (hasTrackNext) {
            setTimeout(() => {
              handleSkipNext();
            }, 500);
          } else {
            // reset
            setTimeout(() => {
              setPlaying(false);
              setPosition(0);
              setIntro(true);
              setTrackSeek(formatTime(0));
            }, 500);
          }
        }
      })
    );
  }, [trackPlaying, reload]);

  useEffect(() => {
    if (!playing) {
      clearInterval(interval);
    } else {
      if (prevPlayEvent !== playEvent) {
        clearInterval(interval);
      }
      tick();
      interval = setInterval(() => {
        tick();
      }, 1000);
    }
  }, [playing, playEvent]);

  return (
    <Container>
      <div className={classes.root}>
        <h1>Shell As Seen - Live 2 Demos (Unreleased)</h1>
        <img src={"/artwork/vitamin-d.jpg"} alt="Artwork" style={{ width: '100%'}} />
        <div style={{ textAlign: 'center', fontSize: '2rem' }}>
          <SkipPrevious
            onClick={ handleSkipPrevious }
            style={{ color: '#999', cursor: 'pointer'}}
          />
          {!playing &&
          <PlayCircleFilled onClick={ play } style={{ color: '#999', cursor: 'pointer'}} />
          }
          {playing &&
          <PauseCircleFilled onClick={ pause } style={{ color: '#999', cursor: 'pointer'}} />
          }
          <SkipNext
            onClick={ hasTrackNext? handleSkipNext: () => {} }
            style={ hasTrackNext? { color: '#999', cursor: 'pointer'}: { color: '#eee', cursor: 'default' } }
          />
        </div>
        <div>
          <Typography id="continuous-slider" gutterBottom>
            Volume
          </Typography>
          <Grid container spacing={ 2 }>
            <Grid item>
              <VolumeDown />
            </Grid>
            <Grid item xs>
              <Slider value={ volume } onChange={ handleChangeVolume } aria-labelledby="continuous-slider" />
            </Grid>
            <Grid item>
              <VolumeUp />
            </Grid>
          </Grid>
          <Typography id="continuous-slider" gutterBottom>
            Track
          </Typography>
          <Grid container spacing={ 2 }>
            <Grid item>
            </Grid>
            <Grid item xs>
              <Slider
                onMouseDown={ handlePositionMouseDown }
                value={ position }
                onChange={ debounceHandleChangePosition }
                aria-labelledby="continuous-slider"
              />
            </Grid>
            <Grid item>
              { trackSeek } / { trackLength }
            </Grid>
          </Grid>
          <p>{ tracks[trackPlaying].title }</p>
          {/*
          <p>Next: { hasTrackNext.toString() }</p>
          <p>Prev: { hasTrackPrev.toString() }</p>
          <p>Track index: { trackPlaying }</p>
          */}
          <p>&nbsp;</p>
        </div>
      </div>
    </Container>
  );
}
