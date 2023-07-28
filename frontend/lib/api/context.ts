import { createContext } from 'react';
import { AudioHQApiImplRest } from './impl/rest';

const AudioHQApiContext = createContext<AudioHQApiImplRest>(null as never);

export default AudioHQApiContext;
