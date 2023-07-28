import * as $protobuf from "protobufjs";
import Long = require("long");
/** Namespace audiohq. */
export namespace audiohq {

    /** DeckType enum. */
    enum DeckType {
        MAIN = 1,
        AMBIENT = 2,
        SFX = 3
    }

    /** Properties of a Deck. */
    interface IDeck {

        /** Deck id */
        id?: (string|null);

        /** Deck type */
        type?: (audiohq.DeckType|null);

        /** Deck volume */
        volume?: (number|null);

        /** Deck speed */
        speed?: (number|null);

        /** Deck startTimestamp */
        startTimestamp?: (number|null);

        /** Deck playing */
        playing?: (boolean|null);

        /** Deck pausedTimestamp */
        pausedTimestamp?: (number|null);

        /** Deck queue */
        queue?: (string[]|null);

        /** Deck createdAt */
        createdAt?: (number|null);
    }

    /** Represents a Deck. */
    class Deck implements IDeck {

        /**
         * Constructs a new Deck.
         * @param [properties] Properties to set
         */
        constructor(properties?: audiohq.IDeck);

        /** Deck id. */
        public id: string;

        /** Deck type. */
        public type: audiohq.DeckType;

        /** Deck volume. */
        public volume: number;

        /** Deck speed. */
        public speed: number;

        /** Deck startTimestamp. */
        public startTimestamp: number;

        /** Deck playing. */
        public playing?: (boolean|null);

        /** Deck pausedTimestamp. */
        public pausedTimestamp?: (number|null);

        /** Deck queue. */
        public queue: string[];

        /** Deck createdAt. */
        public createdAt: number;

        /** Deck paused. */
        public paused?: ("playing"|"pausedTimestamp");

        /**
         * Creates a new Deck instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Deck instance
         */
        public static create(properties?: audiohq.IDeck): audiohq.Deck;

        /**
         * Encodes the specified Deck message. Does not implicitly {@link audiohq.Deck.verify|verify} messages.
         * @param message Deck message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: audiohq.IDeck, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Deck message, length delimited. Does not implicitly {@link audiohq.Deck.verify|verify} messages.
         * @param message Deck message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: audiohq.IDeck, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Deck message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Deck
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): audiohq.Deck;

        /**
         * Decodes a Deck message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Deck
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): audiohq.Deck;

        /**
         * Verifies a Deck message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Deck message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Deck
         */
        public static fromObject(object: { [k: string]: any }): audiohq.Deck;

        /**
         * Creates a plain object from a Deck message. Also converts values to other types if specified.
         * @param message Deck
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: audiohq.Deck, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Deck to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for Deck
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a DeckCreate. */
    interface IDeckCreate {

        /** DeckCreate type */
        type?: (audiohq.DeckType|null);

        /** DeckCreate volume */
        volume?: (number|null);

        /** DeckCreate speed */
        speed?: (number|null);

        /** DeckCreate startTimestamp */
        startTimestamp?: (number|null);

        /** DeckCreate playing */
        playing?: (boolean|null);

        /** DeckCreate pausedTimestamp */
        pausedTimestamp?: (number|null);

        /** DeckCreate queue */
        queue?: (string[]|null);
    }

    /** Represents a DeckCreate. */
    class DeckCreate implements IDeckCreate {

        /**
         * Constructs a new DeckCreate.
         * @param [properties] Properties to set
         */
        constructor(properties?: audiohq.IDeckCreate);

        /** DeckCreate type. */
        public type: audiohq.DeckType;

        /** DeckCreate volume. */
        public volume: number;

        /** DeckCreate speed. */
        public speed: number;

        /** DeckCreate startTimestamp. */
        public startTimestamp: number;

        /** DeckCreate playing. */
        public playing?: (boolean|null);

        /** DeckCreate pausedTimestamp. */
        public pausedTimestamp?: (number|null);

        /** DeckCreate queue. */
        public queue: string[];

        /** DeckCreate paused. */
        public paused?: ("playing"|"pausedTimestamp");

        /**
         * Creates a new DeckCreate instance using the specified properties.
         * @param [properties] Properties to set
         * @returns DeckCreate instance
         */
        public static create(properties?: audiohq.IDeckCreate): audiohq.DeckCreate;

        /**
         * Encodes the specified DeckCreate message. Does not implicitly {@link audiohq.DeckCreate.verify|verify} messages.
         * @param message DeckCreate message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: audiohq.IDeckCreate, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified DeckCreate message, length delimited. Does not implicitly {@link audiohq.DeckCreate.verify|verify} messages.
         * @param message DeckCreate message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: audiohq.IDeckCreate, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a DeckCreate message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns DeckCreate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): audiohq.DeckCreate;

        /**
         * Decodes a DeckCreate message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns DeckCreate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): audiohq.DeckCreate;

        /**
         * Verifies a DeckCreate message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a DeckCreate message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns DeckCreate
         */
        public static fromObject(object: { [k: string]: any }): audiohq.DeckCreate;

        /**
         * Creates a plain object from a DeckCreate message. Also converts values to other types if specified.
         * @param message DeckCreate
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: audiohq.DeckCreate, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this DeckCreate to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for DeckCreate
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a DeckMutate. */
    interface IDeckMutate {

        /** DeckMutate volume */
        volume?: (number|null);

        /** DeckMutate speed */
        speed?: (number|null);

        /** DeckMutate startTimestamp */
        startTimestamp?: (number|null);

        /** DeckMutate playing */
        playing?: (boolean|null);

        /** DeckMutate pausedTimestamp */
        pausedTimestamp?: (number|null);

        /** DeckMutate queue */
        queue?: (string[]|null);
    }

    /** Represents a DeckMutate. */
    class DeckMutate implements IDeckMutate {

        /**
         * Constructs a new DeckMutate.
         * @param [properties] Properties to set
         */
        constructor(properties?: audiohq.IDeckMutate);

        /** DeckMutate volume. */
        public volume: number;

        /** DeckMutate speed. */
        public speed: number;

        /** DeckMutate startTimestamp. */
        public startTimestamp: number;

        /** DeckMutate playing. */
        public playing?: (boolean|null);

        /** DeckMutate pausedTimestamp. */
        public pausedTimestamp?: (number|null);

        /** DeckMutate queue. */
        public queue: string[];

        /** DeckMutate paused. */
        public paused?: ("playing"|"pausedTimestamp");

        /**
         * Creates a new DeckMutate instance using the specified properties.
         * @param [properties] Properties to set
         * @returns DeckMutate instance
         */
        public static create(properties?: audiohq.IDeckMutate): audiohq.DeckMutate;

        /**
         * Encodes the specified DeckMutate message. Does not implicitly {@link audiohq.DeckMutate.verify|verify} messages.
         * @param message DeckMutate message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: audiohq.IDeckMutate, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified DeckMutate message, length delimited. Does not implicitly {@link audiohq.DeckMutate.verify|verify} messages.
         * @param message DeckMutate message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: audiohq.IDeckMutate, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a DeckMutate message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns DeckMutate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): audiohq.DeckMutate;

        /**
         * Decodes a DeckMutate message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns DeckMutate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): audiohq.DeckMutate;

        /**
         * Verifies a DeckMutate message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a DeckMutate message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns DeckMutate
         */
        public static fromObject(object: { [k: string]: any }): audiohq.DeckMutate;

        /**
         * Creates a plain object from a DeckMutate message. Also converts values to other types if specified.
         * @param message DeckMutate
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: audiohq.DeckMutate, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this DeckMutate to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for DeckMutate
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a ListDecksResponse. */
    interface IListDecksResponse {

        /** ListDecksResponse results */
        results?: (audiohq.IDeck[]|null);
    }

    /** Represents a ListDecksResponse. */
    class ListDecksResponse implements IListDecksResponse {

        /**
         * Constructs a new ListDecksResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: audiohq.IListDecksResponse);

        /** ListDecksResponse results. */
        public results: audiohq.IDeck[];

        /**
         * Creates a new ListDecksResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ListDecksResponse instance
         */
        public static create(properties?: audiohq.IListDecksResponse): audiohq.ListDecksResponse;

        /**
         * Encodes the specified ListDecksResponse message. Does not implicitly {@link audiohq.ListDecksResponse.verify|verify} messages.
         * @param message ListDecksResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: audiohq.IListDecksResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ListDecksResponse message, length delimited. Does not implicitly {@link audiohq.ListDecksResponse.verify|verify} messages.
         * @param message ListDecksResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: audiohq.IListDecksResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ListDecksResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ListDecksResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): audiohq.ListDecksResponse;

        /**
         * Decodes a ListDecksResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ListDecksResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): audiohq.ListDecksResponse;

        /**
         * Verifies a ListDecksResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ListDecksResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ListDecksResponse
         */
        public static fromObject(object: { [k: string]: any }): audiohq.ListDecksResponse;

        /**
         * Creates a plain object from a ListDecksResponse message. Also converts values to other types if specified.
         * @param message ListDecksResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: audiohq.ListDecksResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ListDecksResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for ListDecksResponse
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an Entry. */
    interface IEntry {

        /** Entry id */
        id?: (string|null);

        /** Entry single */
        single?: (audiohq.ISingle|null);

        /** Entry folder */
        folder?: (audiohq.IFolder|null);
    }

    /** Represents an Entry. */
    class Entry implements IEntry {

        /**
         * Constructs a new Entry.
         * @param [properties] Properties to set
         */
        constructor(properties?: audiohq.IEntry);

        /** Entry id. */
        public id: string;

        /** Entry single. */
        public single?: (audiohq.ISingle|null);

        /** Entry folder. */
        public folder?: (audiohq.IFolder|null);

        /** Entry value. */
        public value?: ("single"|"folder");

        /**
         * Creates a new Entry instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Entry instance
         */
        public static create(properties?: audiohq.IEntry): audiohq.Entry;

        /**
         * Encodes the specified Entry message. Does not implicitly {@link audiohq.Entry.verify|verify} messages.
         * @param message Entry message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: audiohq.IEntry, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Entry message, length delimited. Does not implicitly {@link audiohq.Entry.verify|verify} messages.
         * @param message Entry message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: audiohq.IEntry, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an Entry message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Entry
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): audiohq.Entry;

        /**
         * Decodes an Entry message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Entry
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): audiohq.Entry;

        /**
         * Verifies an Entry message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an Entry message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Entry
         */
        public static fromObject(object: { [k: string]: any }): audiohq.Entry;

        /**
         * Creates a plain object from an Entry message. Also converts values to other types if specified.
         * @param message Entry
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: audiohq.Entry, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Entry to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for Entry
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a Single. */
    interface ISingle {

        /** Single path */
        path?: (string[]|null);

        /** Single name */
        name?: (string|null);

        /** Single ordering */
        ordering?: (number|null);

        /** Single description */
        description?: (string|null);

        /** Single length */
        length?: (number|null);

        /** Single url */
        url?: (string|null);
    }

    /** Represents a Single. */
    class Single implements ISingle {

        /**
         * Constructs a new Single.
         * @param [properties] Properties to set
         */
        constructor(properties?: audiohq.ISingle);

        /** Single path. */
        public path: string[];

        /** Single name. */
        public name: string;

        /** Single ordering. */
        public ordering: number;

        /** Single description. */
        public description: string;

        /** Single length. */
        public length: number;

        /** Single url. */
        public url: string;

        /**
         * Creates a new Single instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Single instance
         */
        public static create(properties?: audiohq.ISingle): audiohq.Single;

        /**
         * Encodes the specified Single message. Does not implicitly {@link audiohq.Single.verify|verify} messages.
         * @param message Single message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: audiohq.ISingle, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Single message, length delimited. Does not implicitly {@link audiohq.Single.verify|verify} messages.
         * @param message Single message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: audiohq.ISingle, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Single message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Single
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): audiohq.Single;

        /**
         * Decodes a Single message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Single
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): audiohq.Single;

        /**
         * Verifies a Single message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Single message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Single
         */
        public static fromObject(object: { [k: string]: any }): audiohq.Single;

        /**
         * Creates a plain object from a Single message. Also converts values to other types if specified.
         * @param message Single
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: audiohq.Single, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Single to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for Single
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a SingleMutate. */
    interface ISingleMutate {

        /** SingleMutate path */
        path?: (string[]|null);

        /** SingleMutate name */
        name?: (string|null);

        /** SingleMutate ordering */
        ordering?: (number|null);

        /** SingleMutate last */
        last?: (boolean|null);

        /** SingleMutate description */
        description?: (string|null);
    }

    /** Represents a SingleMutate. */
    class SingleMutate implements ISingleMutate {

        /**
         * Constructs a new SingleMutate.
         * @param [properties] Properties to set
         */
        constructor(properties?: audiohq.ISingleMutate);

        /** SingleMutate path. */
        public path: string[];

        /** SingleMutate name. */
        public name: string;

        /** SingleMutate ordering. */
        public ordering?: (number|null);

        /** SingleMutate last. */
        public last?: (boolean|null);

        /** SingleMutate description. */
        public description: string;

        /** SingleMutate modOrdering. */
        public modOrdering?: ("ordering"|"last");

        /**
         * Creates a new SingleMutate instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SingleMutate instance
         */
        public static create(properties?: audiohq.ISingleMutate): audiohq.SingleMutate;

        /**
         * Encodes the specified SingleMutate message. Does not implicitly {@link audiohq.SingleMutate.verify|verify} messages.
         * @param message SingleMutate message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: audiohq.ISingleMutate, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SingleMutate message, length delimited. Does not implicitly {@link audiohq.SingleMutate.verify|verify} messages.
         * @param message SingleMutate message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: audiohq.ISingleMutate, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SingleMutate message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SingleMutate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): audiohq.SingleMutate;

        /**
         * Decodes a SingleMutate message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SingleMutate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): audiohq.SingleMutate;

        /**
         * Verifies a SingleMutate message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SingleMutate message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SingleMutate
         */
        public static fromObject(object: { [k: string]: any }): audiohq.SingleMutate;

        /**
         * Creates a plain object from a SingleMutate message. Also converts values to other types if specified.
         * @param message SingleMutate
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: audiohq.SingleMutate, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SingleMutate to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for SingleMutate
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a Folder. */
    interface IFolder {

        /** Folder path */
        path?: (string[]|null);

        /** Folder name */
        name?: (string|null);

        /** Folder ordering */
        ordering?: (number|null);
    }

    /** Represents a Folder. */
    class Folder implements IFolder {

        /**
         * Constructs a new Folder.
         * @param [properties] Properties to set
         */
        constructor(properties?: audiohq.IFolder);

        /** Folder path. */
        public path: string[];

        /** Folder name. */
        public name: string;

        /** Folder ordering. */
        public ordering: number;

        /**
         * Creates a new Folder instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Folder instance
         */
        public static create(properties?: audiohq.IFolder): audiohq.Folder;

        /**
         * Encodes the specified Folder message. Does not implicitly {@link audiohq.Folder.verify|verify} messages.
         * @param message Folder message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: audiohq.IFolder, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Folder message, length delimited. Does not implicitly {@link audiohq.Folder.verify|verify} messages.
         * @param message Folder message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: audiohq.IFolder, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Folder message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Folder
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): audiohq.Folder;

        /**
         * Decodes a Folder message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Folder
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): audiohq.Folder;

        /**
         * Verifies a Folder message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Folder message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Folder
         */
        public static fromObject(object: { [k: string]: any }): audiohq.Folder;

        /**
         * Creates a plain object from a Folder message. Also converts values to other types if specified.
         * @param message Folder
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: audiohq.Folder, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Folder to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for Folder
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a FolderMutate. */
    interface IFolderMutate {

        /** FolderMutate path */
        path?: (string[]|null);

        /** FolderMutate name */
        name?: (string|null);

        /** FolderMutate ordering */
        ordering?: (number|null);

        /** FolderMutate last */
        last?: (boolean|null);
    }

    /** Represents a FolderMutate. */
    class FolderMutate implements IFolderMutate {

        /**
         * Constructs a new FolderMutate.
         * @param [properties] Properties to set
         */
        constructor(properties?: audiohq.IFolderMutate);

        /** FolderMutate path. */
        public path: string[];

        /** FolderMutate name. */
        public name: string;

        /** FolderMutate ordering. */
        public ordering?: (number|null);

        /** FolderMutate last. */
        public last?: (boolean|null);

        /** FolderMutate modOrdering. */
        public modOrdering?: ("ordering"|"last");

        /**
         * Creates a new FolderMutate instance using the specified properties.
         * @param [properties] Properties to set
         * @returns FolderMutate instance
         */
        public static create(properties?: audiohq.IFolderMutate): audiohq.FolderMutate;

        /**
         * Encodes the specified FolderMutate message. Does not implicitly {@link audiohq.FolderMutate.verify|verify} messages.
         * @param message FolderMutate message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: audiohq.IFolderMutate, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified FolderMutate message, length delimited. Does not implicitly {@link audiohq.FolderMutate.verify|verify} messages.
         * @param message FolderMutate message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: audiohq.IFolderMutate, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a FolderMutate message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns FolderMutate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): audiohq.FolderMutate;

        /**
         * Decodes a FolderMutate message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns FolderMutate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): audiohq.FolderMutate;

        /**
         * Verifies a FolderMutate message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a FolderMutate message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns FolderMutate
         */
        public static fromObject(object: { [k: string]: any }): audiohq.FolderMutate;

        /**
         * Creates a plain object from a FolderMutate message. Also converts values to other types if specified.
         * @param message FolderMutate
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: audiohq.FolderMutate, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this FolderMutate to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for FolderMutate
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a ListEntriesResponse. */
    interface IListEntriesResponse {

        /** ListEntriesResponse entries */
        entries?: (audiohq.IEntry[]|null);
    }

    /** Represents a ListEntriesResponse. */
    class ListEntriesResponse implements IListEntriesResponse {

        /**
         * Constructs a new ListEntriesResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: audiohq.IListEntriesResponse);

        /** ListEntriesResponse entries. */
        public entries: audiohq.IEntry[];

        /**
         * Creates a new ListEntriesResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ListEntriesResponse instance
         */
        public static create(properties?: audiohq.IListEntriesResponse): audiohq.ListEntriesResponse;

        /**
         * Encodes the specified ListEntriesResponse message. Does not implicitly {@link audiohq.ListEntriesResponse.verify|verify} messages.
         * @param message ListEntriesResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: audiohq.IListEntriesResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ListEntriesResponse message, length delimited. Does not implicitly {@link audiohq.ListEntriesResponse.verify|verify} messages.
         * @param message ListEntriesResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: audiohq.IListEntriesResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ListEntriesResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ListEntriesResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): audiohq.ListEntriesResponse;

        /**
         * Decodes a ListEntriesResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ListEntriesResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): audiohq.ListEntriesResponse;

        /**
         * Verifies a ListEntriesResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ListEntriesResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ListEntriesResponse
         */
        public static fromObject(object: { [k: string]: any }): audiohq.ListEntriesResponse;

        /**
         * Creates a plain object from a ListEntriesResponse message. Also converts values to other types if specified.
         * @param message ListEntriesResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: audiohq.ListEntriesResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ListEntriesResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for ListEntriesResponse
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an EntryMutate. */
    interface IEntryMutate {

        /** EntryMutate entry */
        entry?: (audiohq.IEntryMutate|null);

        /** EntryMutate folder */
        folder?: (audiohq.IFolderMutate|null);
    }

    /** Represents an EntryMutate. */
    class EntryMutate implements IEntryMutate {

        /**
         * Constructs a new EntryMutate.
         * @param [properties] Properties to set
         */
        constructor(properties?: audiohq.IEntryMutate);

        /** EntryMutate entry. */
        public entry?: (audiohq.IEntryMutate|null);

        /** EntryMutate folder. */
        public folder?: (audiohq.IFolderMutate|null);

        /** EntryMutate mutation. */
        public mutation?: ("entry"|"folder");

        /**
         * Creates a new EntryMutate instance using the specified properties.
         * @param [properties] Properties to set
         * @returns EntryMutate instance
         */
        public static create(properties?: audiohq.IEntryMutate): audiohq.EntryMutate;

        /**
         * Encodes the specified EntryMutate message. Does not implicitly {@link audiohq.EntryMutate.verify|verify} messages.
         * @param message EntryMutate message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: audiohq.IEntryMutate, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified EntryMutate message, length delimited. Does not implicitly {@link audiohq.EntryMutate.verify|verify} messages.
         * @param message EntryMutate message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: audiohq.IEntryMutate, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an EntryMutate message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns EntryMutate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): audiohq.EntryMutate;

        /**
         * Decodes an EntryMutate message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns EntryMutate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): audiohq.EntryMutate;

        /**
         * Verifies an EntryMutate message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an EntryMutate message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns EntryMutate
         */
        public static fromObject(object: { [k: string]: any }): audiohq.EntryMutate;

        /**
         * Creates a plain object from an EntryMutate message. Also converts values to other types if specified.
         * @param message EntryMutate
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: audiohq.EntryMutate, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this EntryMutate to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for EntryMutate
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** JobStatus enum. */
    enum JobStatus {
        GETTING_READY = 1,
        WAITING = 2,
        ASSIGNED = 3,
        DOWNLOADING = 4,
        CONVERTING = 5,
        UPLOADING = 6,
        SAVING = 7,
        DONE = 8,
        ERROR = 9
    }

    /** Properties of a Job. */
    interface IJob {

        /** Job id */
        id?: (string|null);

        /** Job details */
        details?: (audiohq.ISingleMutate|null);

        /** Job modifications */
        modifications?: (audiohq.IModification[]|null);

        /** Job progress */
        progress?: (number|null);

        /** Job status */
        status?: (audiohq.JobStatus|null);

        /** Job unassigned */
        unassigned?: (boolean|null);

        /** Job assignedWorker */
        assignedWorker?: (string|null);

        /** Job ok */
        ok?: (boolean|null);

        /** Job errorDetails */
        errorDetails?: (string|null);

        /** Job url */
        url?: (string|null);
    }

    /** Represents a Job. */
    class Job implements IJob {

        /**
         * Constructs a new Job.
         * @param [properties] Properties to set
         */
        constructor(properties?: audiohq.IJob);

        /** Job id. */
        public id: string;

        /** Job details. */
        public details?: (audiohq.ISingleMutate|null);

        /** Job modifications. */
        public modifications: audiohq.IModification[];

        /** Job progress. */
        public progress: number;

        /** Job status. */
        public status: audiohq.JobStatus;

        /** Job unassigned. */
        public unassigned?: (boolean|null);

        /** Job assignedWorker. */
        public assignedWorker?: (string|null);

        /** Job ok. */
        public ok?: (boolean|null);

        /** Job errorDetails. */
        public errorDetails?: (string|null);

        /** Job url. */
        public url: string;

        /** Job assignment. */
        public assignment?: ("unassigned"|"assignedWorker");

        /** Job error. */
        public error?: ("ok"|"errorDetails");

        /**
         * Creates a new Job instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Job instance
         */
        public static create(properties?: audiohq.IJob): audiohq.Job;

        /**
         * Encodes the specified Job message. Does not implicitly {@link audiohq.Job.verify|verify} messages.
         * @param message Job message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: audiohq.IJob, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Job message, length delimited. Does not implicitly {@link audiohq.Job.verify|verify} messages.
         * @param message Job message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: audiohq.IJob, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Job message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Job
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): audiohq.Job;

        /**
         * Decodes a Job message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Job
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): audiohq.Job;

        /**
         * Verifies a Job message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Job message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Job
         */
        public static fromObject(object: { [k: string]: any }): audiohq.Job;

        /**
         * Creates a plain object from a Job message. Also converts values to other types if specified.
         * @param message Job
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: audiohq.Job, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Job to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for Job
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a Modification. */
    interface IModification {

        /** Modification cut */
        cut?: (audiohq.ICutModification|null);

        /** Modification fade */
        fade?: (audiohq.IFadeModification|null);
    }

    /** Represents a Modification. */
    class Modification implements IModification {

        /**
         * Constructs a new Modification.
         * @param [properties] Properties to set
         */
        constructor(properties?: audiohq.IModification);

        /** Modification cut. */
        public cut?: (audiohq.ICutModification|null);

        /** Modification fade. */
        public fade?: (audiohq.IFadeModification|null);

        /** Modification modification. */
        public modification?: ("cut"|"fade");

        /**
         * Creates a new Modification instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Modification instance
         */
        public static create(properties?: audiohq.IModification): audiohq.Modification;

        /**
         * Encodes the specified Modification message. Does not implicitly {@link audiohq.Modification.verify|verify} messages.
         * @param message Modification message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: audiohq.IModification, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Modification message, length delimited. Does not implicitly {@link audiohq.Modification.verify|verify} messages.
         * @param message Modification message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: audiohq.IModification, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Modification message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Modification
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): audiohq.Modification;

        /**
         * Decodes a Modification message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Modification
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): audiohq.Modification;

        /**
         * Verifies a Modification message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Modification message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Modification
         */
        public static fromObject(object: { [k: string]: any }): audiohq.Modification;

        /**
         * Creates a plain object from a Modification message. Also converts values to other types if specified.
         * @param message Modification
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: audiohq.Modification, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Modification to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for Modification
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a CutModification. */
    interface ICutModification {

        /** CutModification startSeconds */
        startSeconds?: (number|null);

        /** CutModification endSeconds */
        endSeconds?: (number|null);
    }

    /** Represents a CutModification. */
    class CutModification implements ICutModification {

        /**
         * Constructs a new CutModification.
         * @param [properties] Properties to set
         */
        constructor(properties?: audiohq.ICutModification);

        /** CutModification startSeconds. */
        public startSeconds: number;

        /** CutModification endSeconds. */
        public endSeconds: number;

        /**
         * Creates a new CutModification instance using the specified properties.
         * @param [properties] Properties to set
         * @returns CutModification instance
         */
        public static create(properties?: audiohq.ICutModification): audiohq.CutModification;

        /**
         * Encodes the specified CutModification message. Does not implicitly {@link audiohq.CutModification.verify|verify} messages.
         * @param message CutModification message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: audiohq.ICutModification, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified CutModification message, length delimited. Does not implicitly {@link audiohq.CutModification.verify|verify} messages.
         * @param message CutModification message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: audiohq.ICutModification, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a CutModification message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns CutModification
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): audiohq.CutModification;

        /**
         * Decodes a CutModification message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns CutModification
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): audiohq.CutModification;

        /**
         * Verifies a CutModification message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a CutModification message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns CutModification
         */
        public static fromObject(object: { [k: string]: any }): audiohq.CutModification;

        /**
         * Creates a plain object from a CutModification message. Also converts values to other types if specified.
         * @param message CutModification
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: audiohq.CutModification, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this CutModification to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for CutModification
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a FadeModification. */
    interface IFadeModification {

        /** FadeModification inSeconds */
        inSeconds?: (number|null);

        /** FadeModification outSeconds */
        outSeconds?: (number|null);
    }

    /** Represents a FadeModification. */
    class FadeModification implements IFadeModification {

        /**
         * Constructs a new FadeModification.
         * @param [properties] Properties to set
         */
        constructor(properties?: audiohq.IFadeModification);

        /** FadeModification inSeconds. */
        public inSeconds: number;

        /** FadeModification outSeconds. */
        public outSeconds: number;

        /**
         * Creates a new FadeModification instance using the specified properties.
         * @param [properties] Properties to set
         * @returns FadeModification instance
         */
        public static create(properties?: audiohq.IFadeModification): audiohq.FadeModification;

        /**
         * Encodes the specified FadeModification message. Does not implicitly {@link audiohq.FadeModification.verify|verify} messages.
         * @param message FadeModification message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: audiohq.IFadeModification, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified FadeModification message, length delimited. Does not implicitly {@link audiohq.FadeModification.verify|verify} messages.
         * @param message FadeModification message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: audiohq.IFadeModification, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a FadeModification message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns FadeModification
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): audiohq.FadeModification;

        /**
         * Decodes a FadeModification message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns FadeModification
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): audiohq.FadeModification;

        /**
         * Verifies a FadeModification message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a FadeModification message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns FadeModification
         */
        public static fromObject(object: { [k: string]: any }): audiohq.FadeModification;

        /**
         * Creates a plain object from a FadeModification message. Also converts values to other types if specified.
         * @param message FadeModification
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: audiohq.FadeModification, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this FadeModification to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for FadeModification
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a JobCreate. */
    interface IJobCreate {

        /** JobCreate details */
        details?: (audiohq.ISingleMutate|null);

        /** JobCreate modifications */
        modifications?: (audiohq.IModification[]|null);

        /** JobCreate url */
        url?: (string|null);
    }

    /** Represents a JobCreate. */
    class JobCreate implements IJobCreate {

        /**
         * Constructs a new JobCreate.
         * @param [properties] Properties to set
         */
        constructor(properties?: audiohq.IJobCreate);

        /** JobCreate details. */
        public details?: (audiohq.ISingleMutate|null);

        /** JobCreate modifications. */
        public modifications: audiohq.IModification[];

        /** JobCreate url. */
        public url: string;

        /**
         * Creates a new JobCreate instance using the specified properties.
         * @param [properties] Properties to set
         * @returns JobCreate instance
         */
        public static create(properties?: audiohq.IJobCreate): audiohq.JobCreate;

        /**
         * Encodes the specified JobCreate message. Does not implicitly {@link audiohq.JobCreate.verify|verify} messages.
         * @param message JobCreate message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: audiohq.IJobCreate, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified JobCreate message, length delimited. Does not implicitly {@link audiohq.JobCreate.verify|verify} messages.
         * @param message JobCreate message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: audiohq.IJobCreate, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a JobCreate message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns JobCreate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): audiohq.JobCreate;

        /**
         * Decodes a JobCreate message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns JobCreate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): audiohq.JobCreate;

        /**
         * Verifies a JobCreate message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a JobCreate message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns JobCreate
         */
        public static fromObject(object: { [k: string]: any }): audiohq.JobCreate;

        /**
         * Creates a plain object from a JobCreate message. Also converts values to other types if specified.
         * @param message JobCreate
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: audiohq.JobCreate, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this JobCreate to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for JobCreate
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a ListJobsResponse. */
    interface IListJobsResponse {

        /** ListJobsResponse results */
        results?: (audiohq.IJob[]|null);
    }

    /** Represents a ListJobsResponse. */
    class ListJobsResponse implements IListJobsResponse {

        /**
         * Constructs a new ListJobsResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: audiohq.IListJobsResponse);

        /** ListJobsResponse results. */
        public results: audiohq.IJob[];

        /**
         * Creates a new ListJobsResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ListJobsResponse instance
         */
        public static create(properties?: audiohq.IListJobsResponse): audiohq.ListJobsResponse;

        /**
         * Encodes the specified ListJobsResponse message. Does not implicitly {@link audiohq.ListJobsResponse.verify|verify} messages.
         * @param message ListJobsResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: audiohq.IListJobsResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ListJobsResponse message, length delimited. Does not implicitly {@link audiohq.ListJobsResponse.verify|verify} messages.
         * @param message ListJobsResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: audiohq.IListJobsResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ListJobsResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ListJobsResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): audiohq.ListJobsResponse;

        /**
         * Decodes a ListJobsResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ListJobsResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): audiohq.ListJobsResponse;

        /**
         * Verifies a ListJobsResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ListJobsResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ListJobsResponse
         */
        public static fromObject(object: { [k: string]: any }): audiohq.ListJobsResponse;

        /**
         * Creates a plain object from a ListJobsResponse message. Also converts values to other types if specified.
         * @param message ListJobsResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: audiohq.ListJobsResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ListJobsResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for ListJobsResponse
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a Workspace. */
    interface IWorkspace {

        /** Workspace id */
        id?: (string|null);

        /** Workspace name */
        name?: (string|null);

        /** Workspace createdAt */
        createdAt?: (number|null);

        /** Workspace updatedAt */
        updatedAt?: (number|null);
    }

    /** Represents a Workspace. */
    class Workspace implements IWorkspace {

        /**
         * Constructs a new Workspace.
         * @param [properties] Properties to set
         */
        constructor(properties?: audiohq.IWorkspace);

        /** Workspace id. */
        public id: string;

        /** Workspace name. */
        public name: string;

        /** Workspace createdAt. */
        public createdAt: number;

        /** Workspace updatedAt. */
        public updatedAt: number;

        /**
         * Creates a new Workspace instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Workspace instance
         */
        public static create(properties?: audiohq.IWorkspace): audiohq.Workspace;

        /**
         * Encodes the specified Workspace message. Does not implicitly {@link audiohq.Workspace.verify|verify} messages.
         * @param message Workspace message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: audiohq.IWorkspace, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Workspace message, length delimited. Does not implicitly {@link audiohq.Workspace.verify|verify} messages.
         * @param message Workspace message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: audiohq.IWorkspace, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Workspace message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Workspace
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): audiohq.Workspace;

        /**
         * Decodes a Workspace message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Workspace
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): audiohq.Workspace;

        /**
         * Verifies a Workspace message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Workspace message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Workspace
         */
        public static fromObject(object: { [k: string]: any }): audiohq.Workspace;

        /**
         * Creates a plain object from a Workspace message. Also converts values to other types if specified.
         * @param message Workspace
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: audiohq.Workspace, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Workspace to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for Workspace
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a WorkspaceMutate. */
    interface IWorkspaceMutate {

        /** WorkspaceMutate name */
        name?: (string|null);
    }

    /** Represents a WorkspaceMutate. */
    class WorkspaceMutate implements IWorkspaceMutate {

        /**
         * Constructs a new WorkspaceMutate.
         * @param [properties] Properties to set
         */
        constructor(properties?: audiohq.IWorkspaceMutate);

        /** WorkspaceMutate name. */
        public name: string;

        /**
         * Creates a new WorkspaceMutate instance using the specified properties.
         * @param [properties] Properties to set
         * @returns WorkspaceMutate instance
         */
        public static create(properties?: audiohq.IWorkspaceMutate): audiohq.WorkspaceMutate;

        /**
         * Encodes the specified WorkspaceMutate message. Does not implicitly {@link audiohq.WorkspaceMutate.verify|verify} messages.
         * @param message WorkspaceMutate message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: audiohq.IWorkspaceMutate, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified WorkspaceMutate message, length delimited. Does not implicitly {@link audiohq.WorkspaceMutate.verify|verify} messages.
         * @param message WorkspaceMutate message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: audiohq.IWorkspaceMutate, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a WorkspaceMutate message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns WorkspaceMutate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): audiohq.WorkspaceMutate;

        /**
         * Decodes a WorkspaceMutate message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns WorkspaceMutate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): audiohq.WorkspaceMutate;

        /**
         * Verifies a WorkspaceMutate message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a WorkspaceMutate message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns WorkspaceMutate
         */
        public static fromObject(object: { [k: string]: any }): audiohq.WorkspaceMutate;

        /**
         * Creates a plain object from a WorkspaceMutate message. Also converts values to other types if specified.
         * @param message WorkspaceMutate
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: audiohq.WorkspaceMutate, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this WorkspaceMutate to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for WorkspaceMutate
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a WorkspaceSearchResponse. */
    interface IWorkspaceSearchResponse {

        /** WorkspaceSearchResponse results */
        results?: (audiohq.IWorkspace[]|null);
    }

    /** Represents a WorkspaceSearchResponse. */
    class WorkspaceSearchResponse implements IWorkspaceSearchResponse {

        /**
         * Constructs a new WorkspaceSearchResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: audiohq.IWorkspaceSearchResponse);

        /** WorkspaceSearchResponse results. */
        public results: audiohq.IWorkspace[];

        /**
         * Creates a new WorkspaceSearchResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns WorkspaceSearchResponse instance
         */
        public static create(properties?: audiohq.IWorkspaceSearchResponse): audiohq.WorkspaceSearchResponse;

        /**
         * Encodes the specified WorkspaceSearchResponse message. Does not implicitly {@link audiohq.WorkspaceSearchResponse.verify|verify} messages.
         * @param message WorkspaceSearchResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: audiohq.IWorkspaceSearchResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified WorkspaceSearchResponse message, length delimited. Does not implicitly {@link audiohq.WorkspaceSearchResponse.verify|verify} messages.
         * @param message WorkspaceSearchResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: audiohq.IWorkspaceSearchResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a WorkspaceSearchResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns WorkspaceSearchResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): audiohq.WorkspaceSearchResponse;

        /**
         * Decodes a WorkspaceSearchResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns WorkspaceSearchResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): audiohq.WorkspaceSearchResponse;

        /**
         * Verifies a WorkspaceSearchResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a WorkspaceSearchResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns WorkspaceSearchResponse
         */
        public static fromObject(object: { [k: string]: any }): audiohq.WorkspaceSearchResponse;

        /**
         * Creates a plain object from a WorkspaceSearchResponse message. Also converts values to other types if specified.
         * @param message WorkspaceSearchResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: audiohq.WorkspaceSearchResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this WorkspaceSearchResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for WorkspaceSearchResponse
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }
}
