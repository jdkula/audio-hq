import { createContext } from 'react';
import { AudioHQClient } from '@audio-hq/clients/lib/AudioHQClient';

const AudioHQApiContext = createContext<AudioHQClient>(null as never);

export default AudioHQApiContext;
