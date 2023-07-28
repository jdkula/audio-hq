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
    private static _trackCache: Array<{ track: Track; owner: Deck | null; url: string }> = [];

    static pruneCache() {
        for (let i = Deck._trackCache.length - 1; i >= 0; i--) {
            if (this._trackCache[i].owner === null) {
                const [{ track }] = this._trackCache.splice(i, 1);
                track.destroy();
            }
        }
    }

    private _status: API.Deck;

    private _tracks: Track[];

    constructor(state: API.Deck, fm: FileManager) {
        super();

        this._status = state;

        this._tracks = [];

        for (const single of state.queue) {
            const cached = Deck._trackCache.find((entry) => entry.url === single.url);
            let tr: Track;
            if (cached && cached.owner === null) {
                tr = cached.track;
                cached.owner = this;
            } else {
                tr = new Track(state, single, fm);
                Deck._trackCache.push({
                    owner: this,
                    track: tr,
                    url: single.url,
                });
            }
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

    disownTracks() {
        Deck._trackCache.forEach((cacheEntry) => {
            if (this._tracks.includes(cacheEntry.track) && cacheEntry.owner === this) {
                cacheEntry.owner = null;
            }
        });
    }

    destroy() {
        this.disownTracks();
        this.removeAllListeners();
    }
}
