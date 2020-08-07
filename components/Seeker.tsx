import { FunctionComponent, useState, ChangeEvent } from "react";

export const Seeker: FunctionComponent<{
    onSeek: (value: number) => void;
    value: number;
    min: number;
    max: number;
    step: number;
    live?: boolean;
}> = ({ value: inputValue, min, max, step, onSeek, live }) => {
    const [seekValue, setSeekValue] = useState<number | null>(null);

    const value = seekValue ?? inputValue;

    const handleSeek = (e: ChangeEvent<HTMLInputElement>) => {
        const val = parseInt((e.target as HTMLInputElement).value);
        setSeekValue(val / 100);
        if (live) {
            onSeek(val / 100);
        }
    };

    const finishSeek = () => {
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
            onChange={handleSeek}
            onMouseUp={finishSeek}
        />
    );
};
