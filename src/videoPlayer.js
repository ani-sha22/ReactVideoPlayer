import React, { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';
import WaveSurfer from 'https://unpkg.com/wavesurfer.js@7/dist/wavesurfer.esm.js';
import DragDropFiles from './components/Input';
import './style.css';



const VideoPlayer = () => {
  const [videoMetadata, setVideoMetadata] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const waveformContainerRef = useRef(null);
  const wavesurferRef = useRef(null);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);

    if (wavesurferRef.current && playerRef.current) {
      if (isPlaying) {
        wavesurferRef.current.pause();
        playerRef.current.seekTo(wavesurferRef.current.getCurrentTime());
      } else {
        wavesurferRef.current.play();
        playerRef.current.seekTo(wavesurferRef.current.getCurrentTime());
      }
    }
  };

  const handleFileChange = (file) => {
    setSelectedFile(file);
    if (wavesurferRef.current) {
      wavesurferRef.current.load(URL.createObjectURL(file));
    }
  };

  const handleReady = () => {
    if (wavesurferRef.current.isReady && playerRef.current) {
      const duration = playerRef.current.getDuration();
      setVideoMetadata({ ...videoMetadata, duration });
      wavesurferRef.current.zoom(0, duration);
    }
  };

  const handleLoad = (metadata) => {
    setVideoMetadata(metadata);
  };

  useEffect(() => {
    const wavesurfer = WaveSurfer.create({
      container: waveformContainerRef.current,
      waveColor: '#ff2ba7',
      progressColor: '#d3ff6f',
      barWidth: 3,
      cursorWidth: 1,
      height: 100,
    });

    wavesurferRef.current = wavesurfer;

    return () => {
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (wavesurferRef.current) {
      wavesurferRef.current.on('audioprocess', () => {
        const currentTime = wavesurferRef.current.getCurrentTime();
        if (playerRef.current) {
          playerRef.current.seekTo(currentTime);
        }
      });
    }

    return () => {
      if (wavesurferRef.current) {
        wavesurferRef.current.un('audioprocess');
      }
    };
  }, [wavesurferRef]);

  return (
    <div>
      <h2>Video Player</h2>

      <DragDropFiles onFileChange={handleFileChange} />

      {videoMetadata && (
        <div>
          <p>Duration: {videoMetadata.duration.toFixed(2)} seconds</p>

          {videoMetadata.timescale && <p>Timescale: {videoMetadata.timescale}</p>}
          {videoMetadata.isFragmented !== undefined && (
            <p>Is Fragmented: {videoMetadata.isFragmented?.toString()}</p>
          )}

          

        </div>
      )}

      <div
        className='player'
        style={{
          position: 'relative',
          width: '980px',
          height: '400px',
        }}
      >
        <div className='area'>
          <div>
            <ReactPlayer
              ref={playerRef}
              url={selectedFile && URL.createObjectURL(selectedFile)}
              width='100%'
              height='100%'
              playing={isPlaying}
              controls={false}
              onReady={handleReady}
              onLoad={handleLoad}
            />
          </div>

          <div
            className='play-button'
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              cursor: 'pointer',
              fontSize: '24px',
            }}
            onClick={handlePlayPause}
          >
            {isPlaying ? 'Pause' : 'Play'}
          </div>
        </div>

        <div className='waveform-container' ref={waveformContainerRef}></div>
      </div>
    </div>
  );
};

export default VideoPlayer;
