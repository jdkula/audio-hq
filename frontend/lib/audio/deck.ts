import { FileManager } from '../useFileManager';
import { Play_Status_Minimum } from '../graphql_type_helper';
import { EventEmitter } from 'events';
import { Track } from './track';

export class Deck extends EventEmitter {
    private _fm: FileManager;
    private _ctx: AudioContext;
    private _status: Play_Status_Minimum;
    private _mainGain: GainNode;

    private _tracks: Track[];

    constructor(state: Play_Status_Minimum, fm: FileManager, ctx: AudioContext) {
        super();

        this._ctx = ctx;
        this._fm = fm;
        this._status = state;
        this._mainGain = ctx.createGain();
        this._mainGain.connect(ctx.destination);

        this._tracks = [];

        for (const qe of state.queue) {
            const tr = new Track(state, ctx, qe, fm, this._mainGain);
            this._tracks.push(tr);
            tr.on('blocked', () => this.emit('blocked'));
        }

        (window as any).__DECK = this;
    }

    connect(node: AudioNode) {
        this._mainGain.connect(node);
    }

    isReferentFor(state: Play_Status_Minimum): boolean {
        return (
            state.queue.length === this._status.queue.length &&
            this._status.queue.every((qem, idx) => qem.id === state.queue[idx].id)
        );
    }

    reconcile(newState: Play_Status_Minimum): boolean {
        if (!this.isReferentFor(newState)) {
            return false;
        }
        this._status = newState;
        this._tracks.forEach((track) => track.update(newState));

        return true;
    }

    rereconcile(): boolean {
        return this.reconcile(this._status);
    }

    async unblock() {
        try {
            await Promise.all(this._tracks.map((track) => track.unblock()));
        } catch (e) {
            this.emit('blocked', e);
        }
    }

    destroy() {
        console.log('Destroying...');
        this._tracks.forEach((track) => track.destroy());
        this.removeAllListeners();
    }
}
