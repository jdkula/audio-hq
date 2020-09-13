/**
 * TrackOptions/index.tsx
 * ========================
 * Provides an accordion that contains all the possible additional
 * conversion options, such as cutting tracks or fading them in/out.
 */

import { Accordion, AccordionDetails, AccordionSummary } from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import React, { forwardRef, ForwardRefRenderFunction, useEffect, useImperativeHandle, useState } from 'react';
import styled from 'styled-components';
import ConvertOptions from '~/lib/ConvertOptions';
import TrackCutOptions from './TrackCutOptions';
import TrackFadeOptions from './TrackFadeOptions';

const TrackOptionsBase = styled.div``;

const TrackOptionsList = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
`;

interface TrackOptionsProps {
    setOptions: (options: ConvertOptions) => void;
}

// Since nullish ConvertOptions are ambiguous, values must be imperatively reset.
export interface TrackRef {
    reset: () => void;
}

const TrackOptions: ForwardRefRenderFunction<TrackRef, TrackOptionsProps> = ({ setOptions }, ref) => {
    const [shouldCut, setShouldCut] = useState(true);
    const [startTime, setStartTime] = useState(0);
    const [endTime, setEndTime] = useState(3600);

    const [shouldFadeIn, setShouldFadeIn] = useState(false);
    const [fadeInTime, setFadeInTime] = useState(3);

    const [shouldFadeOut, setShouldFadeOut] = useState(false);
    const [fadeOutTime, setFadeOutTime] = useState(3);

    const reset = () => {
        setShouldCut(true);
        setStartTime(0);
        setEndTime(3600);

        setShouldFadeIn(false);
        setFadeInTime(3);

        setShouldFadeOut(false);
        setFadeOutTime(3);
    };

    useEffect(() => {
        const cut = !shouldCut ? null : { start: startTime, end: endTime };
        const fadeIn = !shouldFadeIn ? null : fadeInTime;
        const fadeOut = !shouldFadeOut ? null : fadeOutTime;
        setOptions({ cut, fadeIn, fadeOut });
    }, [shouldCut, startTime, endTime, shouldFadeIn, fadeInTime, shouldFadeOut, fadeOutTime]);

    useImperativeHandle(ref, () => ({ reset }));

    return (
        <TrackOptionsBase>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMore />}
                    id="otheroptions-header"
                    aria-controls="otheroptions-content"
                >
                    Other Options
                </AccordionSummary>
                <AccordionDetails>
                    <TrackOptionsList>
                        <TrackCutOptions
                            {...{ shouldCut, setShouldCut, startTime, setStartTime, endTime, setEndTime }}
                        />
                        <TrackFadeOptions
                            fadeType="in"
                            fadeTime={fadeInTime}
                            setFadeTime={setFadeInTime}
                            shouldFade={shouldFadeIn}
                            setShouldFade={setShouldFadeIn}
                        />
                        <TrackFadeOptions
                            fadeType="out"
                            fadeTime={fadeOutTime}
                            setFadeTime={setFadeOutTime}
                            shouldFade={shouldFadeOut}
                            setShouldFade={setShouldFadeOut}
                        />
                    </TrackOptionsList>
                </AccordionDetails>
            </Accordion>
        </TrackOptionsBase>
    );
};

export default forwardRef(TrackOptions);
