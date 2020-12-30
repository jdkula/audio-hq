import { createContext } from 'react';

export default createContext<{ context: AudioContext; blocked: boolean }>(null as never);
