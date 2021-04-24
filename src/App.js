
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

const useStyles = makeStyles({
  root: {
    width: '100%',
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

var interval;

export default function() {
  const classes = useStyles();

  const [ tracks, setTracks ] = useState(['/vitamin_d.mp3', '/dillema.mp3', '/pop.mp3', '/shuff.mp3'])

  const [ sound, setSound ] = useState(null);

  const [ trackPlaying, setTrackPlaying ] = useState(0);

  const [ trackSeek, setTrackSeek ] = useState(formatTime(0));

  const [ trackLength, setTrackLength ] = useState(formatTime(0));

  const [ position, setPosition ] = useState(0);

  const [ playing, setPlaying ] = useState(false);

  const [ hasTrackNext, setHasTrackNext ] = useState(tracks.length > 1);

  const [ hasTrackPrev, setHasTrackPrev ] = useState(false);

  const [ volume, setVolume ] = useState(30);
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

  function stop() {
    sound.stop();
  }

  function pause() {
    sound.pause();
    setPlaying(false);
  }

  function handleChangePosition(event, newValue) {
    setPosition(newValue);
    let seek = (sound._duration / 100 * newValue)
    sound.seek(seek);
  }

  function handlePositionMouseDown() {
    console.log('down');
    let volume = parseFloat(`0`);
    console.log(volume);
    Howler.volume(0);
    window.addEventListener('mouseup', handlePositionMouseUp);
  }

  function handlePositionMouseUp() {
    console.log('up');
    Howler.volume(parseFloat(`${(volume) / 100}`));
    window.removeEventListener('mouseup', handlePositionMouseUp);
  }

  function handleSkipNext() {
    setPlaying(false);
    setPosition(0);
    setTrackPlaying(trackPlaying + 1);
    setHasTrackNext(!!tracks[trackPlaying + 2]);
    setHasTrackPrev(true);
  }

  function handleSkipPrevious() {
    setPlaying(false);
    setPosition(0);
    setTrackPlaying(trackPlaying - 1);
    setHasTrackNext(!!tracks[trackPlaying + 2]);
    setHasTrackPrev(!!tracks[trackPlaying - 1]);
  }

  function tick() {
    let trackSeek = formatTime(sound.seek());
    setTrackSeek(trackSeek);
    let position = Math.ceil(sound.seek() / sound._duration * 100);
    setPosition(position);
    let trackLength = formatTime(sound._duration);
    setTrackLength(trackLength);
  }

  let debounceHandleChangePosition = debounce(handleChangePosition, 5);

  useEffect(() => {
    console.log('Loaded track: ' + tracks[trackPlaying]);
    let auto = false;
    if (sound) {
      sound.stop();
      auto = true;
      setPlaying(true);
    }
    setSound(
      new Howl({
        src: tracks[trackPlaying],
        autoplay: auto,
        loop: false,
        onend: handleSkipNext
      })
    );
  }, [trackPlaying]);

  useEffect(() => {
    if (!playing) {
      clearInterval(interval);
    } else {
      tick();
      interval = setInterval(() => {
        tick();
      }, 1000);
    }
  }, [playing]);

  return (
    <Container>
      <div className={classes.root}>
        <img src={"/art.jpg"} alt="Artwork" style={{ width: '100%'}} />
        <div>
          <SkipPrevious
            onClick={ hasTrackPrev? handleSkipPrevious: () => {} }
            style={ hasTrackPrev? { color: '#999', cursor: 'pointer'}: { color: '#eee', cursor: 'default' } }
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
      </div>
      <div className={classes.root}>
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
        <p>{ tracks[trackPlaying] }</p>
        <p>Next: { hasTrackNext.toString() }</p>
        <p>Prev: { hasTrackPrev.toString() }</p>
      </div>
    </Container>
  );
}
