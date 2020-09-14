export default function toTimestamp(seconds: number): string {
    if (seconds < 0) return `${Math.floor(seconds)}`;

    const hours = Math.floor(seconds / 3600);
    seconds %= 3600;
    const minutes = Math.floor(seconds / 60);
    seconds %= 60;

    const secondsPadded = seconds.toFixed(0).padStart(2, '0');
    const minutesPadded = minutes.toFixed(0).padStart(2, '0');
    if (hours) {
        return `${hours}:${minutesPadded}:${secondsPadded}`;
    } else {
        return `${minutes}:${secondsPadded}`;
    }
}
