export interface Player {
    duration: number;

    play(): void;
    pause(): void;
    seek(timecode?: number): number;
    volume(vol?: number): number;

    connect(node: AudioNode): Promise<void>;
    reset(): void;
}
