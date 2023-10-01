'use client';
import { useEffect, useRef, useState } from 'react';

function useGetterRef<T>(create: () => T): T {
    function createValueOnce(): T {
        if (created.current) return null as never;
        created.current = true;
        return create();
    }
    const created = useRef(false);
    const value = useRef(createValueOnce());

    return value.current;
}

function Experiment(): React.ReactElement {
    const audioContext = useGetterRef(() => new AudioContext());

    useEffect(() => {
        const interactHandler = () => {
            audioContext.resume();
        };
        document.addEventListener('click', interactHandler);
        document.addEventListener('keydown', interactHandler);
        return () => {
            document.removeEventListener('click', interactHandler);
            document.removeEventListener('keydown', interactHandler);
        };
    }, [audioContext]);

    const [files, setFiles] = useState<FileList | null>(null);
    const gains = useRef<GainNode[]>([]);

    useEffect(() => {
        if (files && files.length > 0) {
            const file = files.item(0);
            if (!file) return;

            const url = URL.createObjectURL(file);
            const audio = new Audio(url);
            audio.onloadedmetadata = () => {
                const gainOne = audioContext.createGain();
                const gainTwo = audioContext.createGain();
                const gainThree = audioContext.createGain();

                const splitter = audioContext.createChannelSplitter(16);
                const audioIn = audioContext.createMediaElementSource(audio);
                audioIn.connect(splitter);

                const mergeOne = audioContext.createChannelMerger(2);
                const mergeTwo = audioContext.createChannelMerger(2);
                const mergeThree = audioContext.createChannelMerger(2);

                splitter.connect(mergeOne, 0, 0);
                splitter.connect(mergeOne, 1, 1);
                splitter.connect(mergeTwo, 2, 0);
                splitter.connect(mergeTwo, 3, 1);
                splitter.connect(mergeThree, 4, 0);
                splitter.connect(mergeThree, 5, 1);

                mergeOne.connect(gainOne);
                mergeTwo.connect(gainTwo);
                mergeThree.connect(gainThree);

                gainOne.connect(audioContext.destination);
                gainTwo.connect(audioContext.destination);
                gainThree.connect(audioContext.destination);

                audio.play();
                gains.current = [gainOne, gainTwo, gainThree];
            };
        }
    }, [files, audioContext]);

    return (
        <div>
            <input type="file" onChange={(e) => setFiles(e.target.files)} />
            <div>
                <label>
                    One
                    <input
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        onChange={(e) =>
                            gains.current[0]?.gain.value !== undefined &&
                            (gains.current[0].gain.value = e.target.valueAsNumber / 100)
                        }
                    />
                </label>
            </div>
            <div>
                <label>
                    Two
                    <input
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        onChange={(e) =>
                            gains.current[1]?.gain.value !== undefined &&
                            (gains.current[1].gain.value = e.target.valueAsNumber / 100)
                        }
                    />
                </label>
            </div>
            <div>
                <label>
                    Three
                    <input
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        onChange={(e) =>
                            gains.current[2]?.gain.value !== undefined &&
                            (gains.current[2].gain.value = e.target.valueAsNumber / 100)
                        }
                    />
                </label>
            </div>
        </div>
    );
}

export default function Home(): React.ReactElement {
    if (typeof window === 'undefined') return <div>Loading</div>;
    return <Experiment />;
}
