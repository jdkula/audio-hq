import { FunctionComponent, useState, ChangeEvent } from 'react';

export const Seeker: FunctionComponent<{
    onSeek: (value: number) => void;
    onInterimSeek?: (value: number | null) => void;
    value: number;
    min: number;
    max: number;
    step: number;
    live?: boolean;
}> = ({ value: inputValue, min, max, step, onSeek, live, onInterimSeek }) => {
    const [seekValue, setSeekValue] = useState<number | null>(null);

    const value = seekValue ?? inputValue;

    const handleSeek = (e: ChangeEvent<HTMLInputElement>) => {
        console.log('Seeking...');
        const val = parseInt((e.target as HTMLInputElement).value);
        setSeekValue(val / 100);
        onInterimSeek?.(val / 100);
        if (live) {
            onSeek(val / 100);
        }
    };

    const finishSeek = () => {
        console.log('Finishing seek...');
        onInterimSeek?.(null);

        if (seekValue === null) return;
        onSeek(seekValue);
        setSeekValue(null);
    };

    return (
        <input
            type="range"
            value={(value * 100).toString()}
            min={(min * 100).toString()}
            max={(max * 100).toString()}
            step={(step * 100).toString()}
            onInput={handleSeek}
            onChange={() => {}}
            onMouseUp={finishSeek}
            onTouchEnd={finishSeek}
        />
    );
};
