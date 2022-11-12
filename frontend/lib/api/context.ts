import { createContext } from 'react';
import AudioHQApi from './AudioHQApi';

const AudioHQApiContext = createContext<AudioHQApi>(null as never);

export default AudioHQApiContext;
