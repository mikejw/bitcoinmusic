
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
import { debounce } from 'lodash';

const useStyles = makeStyles({
  root: {
    width: 200,
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

  const [ sound, setSound ] = useState(
    new Howl({
      src: ['/vitamin_d.mp3', '/dillema.mp3', '/pop.mp3', '/shuff.mp3'],
      autoplay: false,
      loop: false
    })
  );

  const [ trackSeek, setTrackSeek ] = useState(0);

  const [ trackLength, setTrackLength ] = useState(0);

  const [ position, setPosition ] = useState(0);

  const [ playing, setPlaying ] = useState(false);

  const [ volume, setVolume ] = useState(0);
  Howler.volume(volume);

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

  let debounceHandleChangePosition = debounce(handleChangePosition, 10);

  useEffect(() => {
    if (!playing) {
      clearInterval(interval);
    } else {
      interval = setInterval(() => {
        let trackSeek = formatTime(sound.seek());
        setTrackSeek(trackSeek);
        let position = Math.ceil(sound.seek() / sound._duration * 100);
        setPosition(position);

        let trackLength = formatTime(sound._duration);
        setTrackLength(trackLength);

      }, 1000);
    }
  }, [playing]);

  return (
    <Container>
      <div>
        {!playing &&
          <PlayCircleFilled onClick={ play } style={{ color: '#eee', cursor: 'pointer'}} />
        }
        {playing &&
          <PauseCircleFilled onClick={ pause } style={{ color: '#eee', cursor: 'pointer'}} />
        }
      </div>
      <div className={classes.root}>
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
            <Slider onMouseDown={ () => { console.log('pressed') } }value={ position } onChange={ debounceHandleChangePosition } aria-labelledby="continuous-slider" />
          </Grid>
          <Grid item>
            { trackSeek } / { trackLength }
          </Grid>
        </Grid>
      </div>
    </Container>
  );
}
