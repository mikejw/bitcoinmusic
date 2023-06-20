import React from 'react';
import App from './App';
import Container from '@mui/material/Container';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  root: {
    maxWidth: '370px',
    margin: 'auto'
  },
});

const rel1 = {
  title: 'Shell As Seen - Live 2 Demos ft. CHW (Unreleased)',
  tracks: [
    {
      title: 'Shell As Seen - 90schillwave',
      file: '/tracks/90schillwave.mp3',
    },
    {
      title: 'Shell As Seen - Driving Boys',
      file: '/tracks/driving boys.mp3',
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
  ],
  artwork: 'vitamin-d.jpg'
};

const rel2 = {
  title: 'Shell As Seen - Vitamin D',
  tracks: [
    {
      title: 'Shell As Seen - Shuffle',
      file: '/tracks/shuff.mp3',
    },
    {
      title: 'Shell As Seen - Not as Easy as it Looks',
      file: '/tracks/pop.mp3',
    },
    {
      title: 'Shell As Seen - Vitamin D',
      file: '/tracks/vitamin_d.mp3'
    },
    {
      title: 'Shell As Seen - Dilemma',
      file: '/tracks/dilemma.mp3'
    }
  ],
  artwork: 'vitamin-d.jpg'
}


export default function() {
  const classes = useStyles();

  return (
    <>
      <Container>
        <div className={classes.root}>
          <App defTracks={rel1} />
          <p>&nbsp;</p>
          <App defTracks={rel2} />
          <p>&nbsp;</p>
          <p>WARNING: Phone lock may interrupt playing!</p>
          <p>&nbsp;</p>
        </div>
      </Container>
    </>
  );
}
