declare namespace NodeJS {
    export interface Global {
        __PROC_CACHE?: Map<string, Job>;
    }
}

declare module '@ffmpeg-installer/ffmpeg' {
    export const path: string;
}

declare module '@ffprobe-installer/ffprobe' {
    export const path: string;
}
