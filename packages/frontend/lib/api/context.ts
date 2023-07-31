import { createContext } from 'react';
import { AudioHQApiImplProto } from 'clients/lib/impl/protobase';

const AudioHQApiContext = createContext<AudioHQApiImplProto>(null as never);

export default AudioHQApiContext;
