import { PlayState, SfxState } from './Workspace';

export function shouldPlaySFX(sfx: SfxState): boolean {
    const lastTrigger = parseInt(localStorage.getItem('__AHQ_LAST_SFX') ?? '0');
    const valid = !!sfx.sfx && sfx.timeoutTimestamp > Date.now() && sfx.triggerTimestamp > lastTrigger;

    if (valid) {
        localStorage.setItem('__AHQ_LAST_SFX', JSON.stringify(sfx.triggerTimestamp));
    }
    return valid;
}
