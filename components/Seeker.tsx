import { FunctionComponent, useState, ChangeEvent } from 'react';
import { Slider, SliderProps } from '@material-ui/core';

export const Seeker: FunctionComponent<
    {
        onSeek: (value: number) => void;
        onInterimSeek?: (value: number | null) => void;
        value: number;
        min: number;
        max: number;
        step: number;
        live?: boolean;
    } & SliderProps
> = ({ value: inputValue, min, max, step, onSeek, live, onInterimSeek, ...rest }) => {
    const [seekValue, setSeekValue] = useState<number | null>(null);

    const value = seekValue ?? inputValue;

    const handleSeek = (e: any, newValue: number | number[]) => {
        console.log('Seeking...');
        const val = newValue as number;
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
        <Slider
            value={value * 100}
            min={min * 100}
            max={max * 100}
            step={step * 100}
            onChange={handleSeek}
            onMouseUp={finishSeek}
            onTouchEnd={finishSeek}
            {...rest}
        />
    );
};
