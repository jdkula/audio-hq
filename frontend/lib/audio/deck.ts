/**
 * deck.ts
 * ========
 * Provides a class that coordinates a number of Tracks according to a
 * database's Deck.
 */
import { FileManager } from '../useWorkspaceDetails';
import { EventEmitter } from 'events';
import { Track } from './track';
import * as API from '../api/models';

export class Deck extends EventEmitter {
    private _status: API.Deck;

    private _tracks: Track[];

    constructor(state: API.Deck, fm: FileManager) {
        super();

        this._status = state;

        this._tracks = [];

        for (const qe of state.queue) {
            const tr = new Track(state, qe, fm);
            this._tracks.push(tr);
            tr.on('blocked', () => this.emit('blocked'));
        }
    }

    isReferentFor(state: API.Deck): boolean {
        return (
            state.queue.length === this._status.queue.length &&
            this._status.queue.every((qem, idx) => qem.url === state.queue[idx].url)
        );
    }

    reconcile(newState: API.Deck): boolean {
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
