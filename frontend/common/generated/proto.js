/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
import * as $protobuf from "protobufjs/minimal";

// @ts-expect-error Explicitly disable long.js support
$protobuf.util.Long = undefined;
$protobuf.configure();

// Common aliases
const $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
const $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

export const audiohq = $root.audiohq = (() => {

    /**
     * Namespace audiohq.
     * @exports audiohq
     * @namespace
     */
    const audiohq = {};

    /**
     * DeckType enum.
     * @name audiohq.DeckType
     * @enum {number}
     * @property {number} MAIN=1 MAIN value
     * @property {number} AMBIENT=2 AMBIENT value
     * @property {number} SFX=3 SFX value
     */
    audiohq.DeckType = (function() {
        const valuesById = {}, values = Object.create(valuesById);
        values[valuesById[1] = "MAIN"] = 1;
        values[valuesById[2] = "AMBIENT"] = 2;
        values[valuesById[3] = "SFX"] = 3;
        return values;
    })();

    audiohq.Deck = (function() {

        /**
         * Properties of a Deck.
         * @memberof audiohq
         * @interface IDeck
         * @property {string|null} [id] Deck id
         * @property {audiohq.DeckType|null} [type] Deck type
         * @property {number|null} [volume] Deck volume
         * @property {number|null} [speed] Deck speed
         * @property {number|null} [startTimestamp] Deck startTimestamp
         * @property {boolean|null} [playing] Deck playing
         * @property {number|null} [pausedTimestamp] Deck pausedTimestamp
         * @property {Array.<string>|null} [queue] Deck queue
         * @property {number|null} [createdAt] Deck createdAt
         */

        /**
         * Constructs a new Deck.
         * @memberof audiohq
         * @classdesc Represents a Deck.
         * @implements IDeck
         * @constructor
         * @param {audiohq.IDeck=} [properties] Properties to set
         */
        function Deck(properties) {
            this.queue = [];
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Deck id.
         * @member {string} id
         * @memberof audiohq.Deck
         * @instance
         */
        Deck.prototype.id = "";

        /**
         * Deck type.
         * @member {audiohq.DeckType} type
         * @memberof audiohq.Deck
         * @instance
         */
        Deck.prototype.type = 1;

        /**
         * Deck volume.
         * @member {number} volume
         * @memberof audiohq.Deck
         * @instance
         */
        Deck.prototype.volume = 0;

        /**
         * Deck speed.
         * @member {number} speed
         * @memberof audiohq.Deck
         * @instance
         */
        Deck.prototype.speed = 0;

        /**
         * Deck startTimestamp.
         * @member {number} startTimestamp
         * @memberof audiohq.Deck
         * @instance
         */
        Deck.prototype.startTimestamp = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        /**
         * Deck playing.
         * @member {boolean|null|undefined} playing
         * @memberof audiohq.Deck
         * @instance
         */
        Deck.prototype.playing = null;

        /**
         * Deck pausedTimestamp.
         * @member {number|null|undefined} pausedTimestamp
         * @memberof audiohq.Deck
         * @instance
         */
        Deck.prototype.pausedTimestamp = null;

        /**
         * Deck queue.
         * @member {Array.<string>} queue
         * @memberof audiohq.Deck
         * @instance
         */
        Deck.prototype.queue = $util.emptyArray;

        /**
         * Deck createdAt.
         * @member {number} createdAt
         * @memberof audiohq.Deck
         * @instance
         */
        Deck.prototype.createdAt = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        // OneOf field names bound to virtual getters and setters
        let $oneOfFields;

        /**
         * Deck paused.
         * @member {"playing"|"pausedTimestamp"|undefined} paused
         * @memberof audiohq.Deck
         * @instance
         */
        Object.defineProperty(Deck.prototype, "paused", {
            get: $util.oneOfGetter($oneOfFields = ["playing", "pausedTimestamp"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Creates a new Deck instance using the specified properties.
         * @function create
         * @memberof audiohq.Deck
         * @static
         * @param {audiohq.IDeck=} [properties] Properties to set
         * @returns {audiohq.Deck} Deck instance
         */
        Deck.create = function create(properties) {
            return new Deck(properties);
        };

        /**
         * Encodes the specified Deck message. Does not implicitly {@link audiohq.Deck.verify|verify} messages.
         * @function encode
         * @memberof audiohq.Deck
         * @static
         * @param {audiohq.IDeck} message Deck message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Deck.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
            if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.type);
            if (message.volume != null && Object.hasOwnProperty.call(message, "volume"))
                writer.uint32(/* id 3, wireType 5 =*/29).float(message.volume);
            if (message.speed != null && Object.hasOwnProperty.call(message, "speed"))
                writer.uint32(/* id 4, wireType 5 =*/37).float(message.speed);
            if (message.startTimestamp != null && Object.hasOwnProperty.call(message, "startTimestamp"))
                writer.uint32(/* id 5, wireType 0 =*/40).uint64(message.startTimestamp);
            if (message.playing != null && Object.hasOwnProperty.call(message, "playing"))
                writer.uint32(/* id 6, wireType 0 =*/48).bool(message.playing);
            if (message.pausedTimestamp != null && Object.hasOwnProperty.call(message, "pausedTimestamp"))
                writer.uint32(/* id 7, wireType 0 =*/56).uint64(message.pausedTimestamp);
            if (message.queue != null && message.queue.length)
                for (let i = 0; i < message.queue.length; ++i)
                    writer.uint32(/* id 8, wireType 2 =*/66).string(message.queue[i]);
            if (message.createdAt != null && Object.hasOwnProperty.call(message, "createdAt"))
                writer.uint32(/* id 9, wireType 0 =*/72).uint64(message.createdAt);
            return writer;
        };

        /**
         * Encodes the specified Deck message, length delimited. Does not implicitly {@link audiohq.Deck.verify|verify} messages.
         * @function encodeDelimited
         * @memberof audiohq.Deck
         * @static
         * @param {audiohq.IDeck} message Deck message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Deck.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Deck message from the specified reader or buffer.
         * @function decode
         * @memberof audiohq.Deck
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {audiohq.Deck} Deck
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Deck.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.audiohq.Deck();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.id = reader.string();
                        break;
                    }
                case 2: {
                        message.type = reader.int32();
                        break;
                    }
                case 3: {
                        message.volume = reader.float();
                        break;
                    }
                case 4: {
                        message.speed = reader.float();
                        break;
                    }
                case 5: {
                        message.startTimestamp = reader.uint64();
                        break;
                    }
                case 6: {
                        message.playing = reader.bool();
                        break;
                    }
                case 7: {
                        message.pausedTimestamp = reader.uint64();
                        break;
                    }
                case 8: {
                        if (!(message.queue && message.queue.length))
                            message.queue = [];
                        message.queue.push(reader.string());
                        break;
                    }
                case 9: {
                        message.createdAt = reader.uint64();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Deck message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof audiohq.Deck
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {audiohq.Deck} Deck
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Deck.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Deck message.
         * @function verify
         * @memberof audiohq.Deck
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Deck.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            let properties = {};
            if (message.id != null && message.hasOwnProperty("id"))
                if (!$util.isString(message.id))
                    return "id: string expected";
            if (message.type != null && message.hasOwnProperty("type"))
                switch (message.type) {
                default:
                    return "type: enum value expected";
                case 1:
                case 2:
                case 3:
                    break;
                }
            if (message.volume != null && message.hasOwnProperty("volume"))
                if (typeof message.volume !== "number")
                    return "volume: number expected";
            if (message.speed != null && message.hasOwnProperty("speed"))
                if (typeof message.speed !== "number")
                    return "speed: number expected";
            if (message.startTimestamp != null && message.hasOwnProperty("startTimestamp"))
                if (!$util.isInteger(message.startTimestamp) && !(message.startTimestamp && $util.isInteger(message.startTimestamp.low) && $util.isInteger(message.startTimestamp.high)))
                    return "startTimestamp: integer|Long expected";
            if (message.playing != null && message.hasOwnProperty("playing")) {
                properties.paused = 1;
                if (typeof message.playing !== "boolean")
                    return "playing: boolean expected";
            }
            if (message.pausedTimestamp != null && message.hasOwnProperty("pausedTimestamp")) {
                if (properties.paused === 1)
                    return "paused: multiple values";
                properties.paused = 1;
                if (!$util.isInteger(message.pausedTimestamp) && !(message.pausedTimestamp && $util.isInteger(message.pausedTimestamp.low) && $util.isInteger(message.pausedTimestamp.high)))
                    return "pausedTimestamp: integer|Long expected";
            }
            if (message.queue != null && message.hasOwnProperty("queue")) {
                if (!Array.isArray(message.queue))
                    return "queue: array expected";
                for (let i = 0; i < message.queue.length; ++i)
                    if (!$util.isString(message.queue[i]))
                        return "queue: string[] expected";
            }
            if (message.createdAt != null && message.hasOwnProperty("createdAt"))
                if (!$util.isInteger(message.createdAt) && !(message.createdAt && $util.isInteger(message.createdAt.low) && $util.isInteger(message.createdAt.high)))
                    return "createdAt: integer|Long expected";
            return null;
        };

        /**
         * Creates a Deck message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof audiohq.Deck
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {audiohq.Deck} Deck
         */
        Deck.fromObject = function fromObject(object) {
            if (object instanceof $root.audiohq.Deck)
                return object;
            let message = new $root.audiohq.Deck();
            if (object.id != null)
                message.id = String(object.id);
            switch (object.type) {
            default:
                if (typeof object.type === "number") {
                    message.type = object.type;
                    break;
                }
                break;
            case "MAIN":
            case 1:
                message.type = 1;
                break;
            case "AMBIENT":
            case 2:
                message.type = 2;
                break;
            case "SFX":
            case 3:
                message.type = 3;
                break;
            }
            if (object.volume != null)
                message.volume = Number(object.volume);
            if (object.speed != null)
                message.speed = Number(object.speed);
            if (object.startTimestamp != null)
                if ($util.Long)
                    (message.startTimestamp = $util.Long.fromValue(object.startTimestamp)).unsigned = true;
                else if (typeof object.startTimestamp === "string")
                    message.startTimestamp = parseInt(object.startTimestamp, 10);
                else if (typeof object.startTimestamp === "number")
                    message.startTimestamp = object.startTimestamp;
                else if (typeof object.startTimestamp === "object")
                    message.startTimestamp = new $util.LongBits(object.startTimestamp.low >>> 0, object.startTimestamp.high >>> 0).toNumber(true);
            if (object.playing != null)
                message.playing = Boolean(object.playing);
            if (object.pausedTimestamp != null)
                if ($util.Long)
                    (message.pausedTimestamp = $util.Long.fromValue(object.pausedTimestamp)).unsigned = true;
                else if (typeof object.pausedTimestamp === "string")
                    message.pausedTimestamp = parseInt(object.pausedTimestamp, 10);
                else if (typeof object.pausedTimestamp === "number")
                    message.pausedTimestamp = object.pausedTimestamp;
                else if (typeof object.pausedTimestamp === "object")
                    message.pausedTimestamp = new $util.LongBits(object.pausedTimestamp.low >>> 0, object.pausedTimestamp.high >>> 0).toNumber(true);
            if (object.queue) {
                if (!Array.isArray(object.queue))
                    throw TypeError(".audiohq.Deck.queue: array expected");
                message.queue = [];
                for (let i = 0; i < object.queue.length; ++i)
                    message.queue[i] = String(object.queue[i]);
            }
            if (object.createdAt != null)
                if ($util.Long)
                    (message.createdAt = $util.Long.fromValue(object.createdAt)).unsigned = true;
                else if (typeof object.createdAt === "string")
                    message.createdAt = parseInt(object.createdAt, 10);
                else if (typeof object.createdAt === "number")
                    message.createdAt = object.createdAt;
                else if (typeof object.createdAt === "object")
                    message.createdAt = new $util.LongBits(object.createdAt.low >>> 0, object.createdAt.high >>> 0).toNumber(true);
            return message;
        };

        /**
         * Creates a plain object from a Deck message. Also converts values to other types if specified.
         * @function toObject
         * @memberof audiohq.Deck
         * @static
         * @param {audiohq.Deck} message Deck
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Deck.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.arrays || options.defaults)
                object.queue = [];
            if (options.defaults) {
                object.id = "";
                object.type = options.enums === String ? "MAIN" : 1;
                object.volume = 0;
                object.speed = 0;
                if ($util.Long) {
                    let long = new $util.Long(0, 0, true);
                    object.startTimestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.startTimestamp = options.longs === String ? "0" : 0;
                if ($util.Long) {
                    let long = new $util.Long(0, 0, true);
                    object.createdAt = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.createdAt = options.longs === String ? "0" : 0;
            }
            if (message.id != null && message.hasOwnProperty("id"))
                object.id = message.id;
            if (message.type != null && message.hasOwnProperty("type"))
                object.type = options.enums === String ? $root.audiohq.DeckType[message.type] === undefined ? message.type : $root.audiohq.DeckType[message.type] : message.type;
            if (message.volume != null && message.hasOwnProperty("volume"))
                object.volume = options.json && !isFinite(message.volume) ? String(message.volume) : message.volume;
            if (message.speed != null && message.hasOwnProperty("speed"))
                object.speed = options.json && !isFinite(message.speed) ? String(message.speed) : message.speed;
            if (message.startTimestamp != null && message.hasOwnProperty("startTimestamp"))
                if (typeof message.startTimestamp === "number")
                    object.startTimestamp = options.longs === String ? String(message.startTimestamp) : message.startTimestamp;
                else
                    object.startTimestamp = options.longs === String ? $util.Long.prototype.toString.call(message.startTimestamp) : options.longs === Number ? new $util.LongBits(message.startTimestamp.low >>> 0, message.startTimestamp.high >>> 0).toNumber(true) : message.startTimestamp;
            if (message.playing != null && message.hasOwnProperty("playing")) {
                object.playing = message.playing;
                if (options.oneofs)
                    object.paused = "playing";
            }
            if (message.pausedTimestamp != null && message.hasOwnProperty("pausedTimestamp")) {
                if (typeof message.pausedTimestamp === "number")
                    object.pausedTimestamp = options.longs === String ? String(message.pausedTimestamp) : message.pausedTimestamp;
                else
                    object.pausedTimestamp = options.longs === String ? $util.Long.prototype.toString.call(message.pausedTimestamp) : options.longs === Number ? new $util.LongBits(message.pausedTimestamp.low >>> 0, message.pausedTimestamp.high >>> 0).toNumber(true) : message.pausedTimestamp;
                if (options.oneofs)
                    object.paused = "pausedTimestamp";
            }
            if (message.queue && message.queue.length) {
                object.queue = [];
                for (let j = 0; j < message.queue.length; ++j)
                    object.queue[j] = message.queue[j];
            }
            if (message.createdAt != null && message.hasOwnProperty("createdAt"))
                if (typeof message.createdAt === "number")
                    object.createdAt = options.longs === String ? String(message.createdAt) : message.createdAt;
                else
                    object.createdAt = options.longs === String ? $util.Long.prototype.toString.call(message.createdAt) : options.longs === Number ? new $util.LongBits(message.createdAt.low >>> 0, message.createdAt.high >>> 0).toNumber(true) : message.createdAt;
            return object;
        };

        /**
         * Converts this Deck to JSON.
         * @function toJSON
         * @memberof audiohq.Deck
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Deck.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for Deck
         * @function getTypeUrl
         * @memberof audiohq.Deck
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Deck.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/audiohq.Deck";
        };

        return Deck;
    })();

    audiohq.DeckCreate = (function() {

        /**
         * Properties of a DeckCreate.
         * @memberof audiohq
         * @interface IDeckCreate
         * @property {audiohq.DeckType|null} [type] DeckCreate type
         * @property {number|null} [volume] DeckCreate volume
         * @property {number|null} [speed] DeckCreate speed
         * @property {number|null} [startTimestamp] DeckCreate startTimestamp
         * @property {boolean|null} [playing] DeckCreate playing
         * @property {number|null} [pausedTimestamp] DeckCreate pausedTimestamp
         * @property {Array.<string>|null} [queue] DeckCreate queue
         */

        /**
         * Constructs a new DeckCreate.
         * @memberof audiohq
         * @classdesc Represents a DeckCreate.
         * @implements IDeckCreate
         * @constructor
         * @param {audiohq.IDeckCreate=} [properties] Properties to set
         */
        function DeckCreate(properties) {
            this.queue = [];
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * DeckCreate type.
         * @member {audiohq.DeckType} type
         * @memberof audiohq.DeckCreate
         * @instance
         */
        DeckCreate.prototype.type = 1;

        /**
         * DeckCreate volume.
         * @member {number} volume
         * @memberof audiohq.DeckCreate
         * @instance
         */
        DeckCreate.prototype.volume = 0;

        /**
         * DeckCreate speed.
         * @member {number} speed
         * @memberof audiohq.DeckCreate
         * @instance
         */
        DeckCreate.prototype.speed = 0;

        /**
         * DeckCreate startTimestamp.
         * @member {number} startTimestamp
         * @memberof audiohq.DeckCreate
         * @instance
         */
        DeckCreate.prototype.startTimestamp = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        /**
         * DeckCreate playing.
         * @member {boolean|null|undefined} playing
         * @memberof audiohq.DeckCreate
         * @instance
         */
        DeckCreate.prototype.playing = null;

        /**
         * DeckCreate pausedTimestamp.
         * @member {number|null|undefined} pausedTimestamp
         * @memberof audiohq.DeckCreate
         * @instance
         */
        DeckCreate.prototype.pausedTimestamp = null;

        /**
         * DeckCreate queue.
         * @member {Array.<string>} queue
         * @memberof audiohq.DeckCreate
         * @instance
         */
        DeckCreate.prototype.queue = $util.emptyArray;

        // OneOf field names bound to virtual getters and setters
        let $oneOfFields;

        /**
         * DeckCreate paused.
         * @member {"playing"|"pausedTimestamp"|undefined} paused
         * @memberof audiohq.DeckCreate
         * @instance
         */
        Object.defineProperty(DeckCreate.prototype, "paused", {
            get: $util.oneOfGetter($oneOfFields = ["playing", "pausedTimestamp"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Creates a new DeckCreate instance using the specified properties.
         * @function create
         * @memberof audiohq.DeckCreate
         * @static
         * @param {audiohq.IDeckCreate=} [properties] Properties to set
         * @returns {audiohq.DeckCreate} DeckCreate instance
         */
        DeckCreate.create = function create(properties) {
            return new DeckCreate(properties);
        };

        /**
         * Encodes the specified DeckCreate message. Does not implicitly {@link audiohq.DeckCreate.verify|verify} messages.
         * @function encode
         * @memberof audiohq.DeckCreate
         * @static
         * @param {audiohq.IDeckCreate} message DeckCreate message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DeckCreate.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.type);
            if (message.volume != null && Object.hasOwnProperty.call(message, "volume"))
                writer.uint32(/* id 3, wireType 5 =*/29).float(message.volume);
            if (message.speed != null && Object.hasOwnProperty.call(message, "speed"))
                writer.uint32(/* id 4, wireType 5 =*/37).float(message.speed);
            if (message.startTimestamp != null && Object.hasOwnProperty.call(message, "startTimestamp"))
                writer.uint32(/* id 5, wireType 0 =*/40).uint64(message.startTimestamp);
            if (message.playing != null && Object.hasOwnProperty.call(message, "playing"))
                writer.uint32(/* id 6, wireType 0 =*/48).bool(message.playing);
            if (message.pausedTimestamp != null && Object.hasOwnProperty.call(message, "pausedTimestamp"))
                writer.uint32(/* id 7, wireType 0 =*/56).uint64(message.pausedTimestamp);
            if (message.queue != null && message.queue.length)
                for (let i = 0; i < message.queue.length; ++i)
                    writer.uint32(/* id 8, wireType 2 =*/66).string(message.queue[i]);
            return writer;
        };

        /**
         * Encodes the specified DeckCreate message, length delimited. Does not implicitly {@link audiohq.DeckCreate.verify|verify} messages.
         * @function encodeDelimited
         * @memberof audiohq.DeckCreate
         * @static
         * @param {audiohq.IDeckCreate} message DeckCreate message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DeckCreate.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a DeckCreate message from the specified reader or buffer.
         * @function decode
         * @memberof audiohq.DeckCreate
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {audiohq.DeckCreate} DeckCreate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DeckCreate.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.audiohq.DeckCreate();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 2: {
                        message.type = reader.int32();
                        break;
                    }
                case 3: {
                        message.volume = reader.float();
                        break;
                    }
                case 4: {
                        message.speed = reader.float();
                        break;
                    }
                case 5: {
                        message.startTimestamp = reader.uint64();
                        break;
                    }
                case 6: {
                        message.playing = reader.bool();
                        break;
                    }
                case 7: {
                        message.pausedTimestamp = reader.uint64();
                        break;
                    }
                case 8: {
                        if (!(message.queue && message.queue.length))
                            message.queue = [];
                        message.queue.push(reader.string());
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a DeckCreate message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof audiohq.DeckCreate
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {audiohq.DeckCreate} DeckCreate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DeckCreate.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a DeckCreate message.
         * @function verify
         * @memberof audiohq.DeckCreate
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        DeckCreate.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            let properties = {};
            if (message.type != null && message.hasOwnProperty("type"))
                switch (message.type) {
                default:
                    return "type: enum value expected";
                case 1:
                case 2:
                case 3:
                    break;
                }
            if (message.volume != null && message.hasOwnProperty("volume"))
                if (typeof message.volume !== "number")
                    return "volume: number expected";
            if (message.speed != null && message.hasOwnProperty("speed"))
                if (typeof message.speed !== "number")
                    return "speed: number expected";
            if (message.startTimestamp != null && message.hasOwnProperty("startTimestamp"))
                if (!$util.isInteger(message.startTimestamp) && !(message.startTimestamp && $util.isInteger(message.startTimestamp.low) && $util.isInteger(message.startTimestamp.high)))
                    return "startTimestamp: integer|Long expected";
            if (message.playing != null && message.hasOwnProperty("playing")) {
                properties.paused = 1;
                if (typeof message.playing !== "boolean")
                    return "playing: boolean expected";
            }
            if (message.pausedTimestamp != null && message.hasOwnProperty("pausedTimestamp")) {
                if (properties.paused === 1)
                    return "paused: multiple values";
                properties.paused = 1;
                if (!$util.isInteger(message.pausedTimestamp) && !(message.pausedTimestamp && $util.isInteger(message.pausedTimestamp.low) && $util.isInteger(message.pausedTimestamp.high)))
                    return "pausedTimestamp: integer|Long expected";
            }
            if (message.queue != null && message.hasOwnProperty("queue")) {
                if (!Array.isArray(message.queue))
                    return "queue: array expected";
                for (let i = 0; i < message.queue.length; ++i)
                    if (!$util.isString(message.queue[i]))
                        return "queue: string[] expected";
            }
            return null;
        };

        /**
         * Creates a DeckCreate message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof audiohq.DeckCreate
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {audiohq.DeckCreate} DeckCreate
         */
        DeckCreate.fromObject = function fromObject(object) {
            if (object instanceof $root.audiohq.DeckCreate)
                return object;
            let message = new $root.audiohq.DeckCreate();
            switch (object.type) {
            default:
                if (typeof object.type === "number") {
                    message.type = object.type;
                    break;
                }
                break;
            case "MAIN":
            case 1:
                message.type = 1;
                break;
            case "AMBIENT":
            case 2:
                message.type = 2;
                break;
            case "SFX":
            case 3:
                message.type = 3;
                break;
            }
            if (object.volume != null)
                message.volume = Number(object.volume);
            if (object.speed != null)
                message.speed = Number(object.speed);
            if (object.startTimestamp != null)
                if ($util.Long)
                    (message.startTimestamp = $util.Long.fromValue(object.startTimestamp)).unsigned = true;
                else if (typeof object.startTimestamp === "string")
                    message.startTimestamp = parseInt(object.startTimestamp, 10);
                else if (typeof object.startTimestamp === "number")
                    message.startTimestamp = object.startTimestamp;
                else if (typeof object.startTimestamp === "object")
                    message.startTimestamp = new $util.LongBits(object.startTimestamp.low >>> 0, object.startTimestamp.high >>> 0).toNumber(true);
            if (object.playing != null)
                message.playing = Boolean(object.playing);
            if (object.pausedTimestamp != null)
                if ($util.Long)
                    (message.pausedTimestamp = $util.Long.fromValue(object.pausedTimestamp)).unsigned = true;
                else if (typeof object.pausedTimestamp === "string")
                    message.pausedTimestamp = parseInt(object.pausedTimestamp, 10);
                else if (typeof object.pausedTimestamp === "number")
                    message.pausedTimestamp = object.pausedTimestamp;
                else if (typeof object.pausedTimestamp === "object")
                    message.pausedTimestamp = new $util.LongBits(object.pausedTimestamp.low >>> 0, object.pausedTimestamp.high >>> 0).toNumber(true);
            if (object.queue) {
                if (!Array.isArray(object.queue))
                    throw TypeError(".audiohq.DeckCreate.queue: array expected");
                message.queue = [];
                for (let i = 0; i < object.queue.length; ++i)
                    message.queue[i] = String(object.queue[i]);
            }
            return message;
        };

        /**
         * Creates a plain object from a DeckCreate message. Also converts values to other types if specified.
         * @function toObject
         * @memberof audiohq.DeckCreate
         * @static
         * @param {audiohq.DeckCreate} message DeckCreate
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        DeckCreate.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.arrays || options.defaults)
                object.queue = [];
            if (options.defaults) {
                object.type = options.enums === String ? "MAIN" : 1;
                object.volume = 0;
                object.speed = 0;
                if ($util.Long) {
                    let long = new $util.Long(0, 0, true);
                    object.startTimestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.startTimestamp = options.longs === String ? "0" : 0;
            }
            if (message.type != null && message.hasOwnProperty("type"))
                object.type = options.enums === String ? $root.audiohq.DeckType[message.type] === undefined ? message.type : $root.audiohq.DeckType[message.type] : message.type;
            if (message.volume != null && message.hasOwnProperty("volume"))
                object.volume = options.json && !isFinite(message.volume) ? String(message.volume) : message.volume;
            if (message.speed != null && message.hasOwnProperty("speed"))
                object.speed = options.json && !isFinite(message.speed) ? String(message.speed) : message.speed;
            if (message.startTimestamp != null && message.hasOwnProperty("startTimestamp"))
                if (typeof message.startTimestamp === "number")
                    object.startTimestamp = options.longs === String ? String(message.startTimestamp) : message.startTimestamp;
                else
                    object.startTimestamp = options.longs === String ? $util.Long.prototype.toString.call(message.startTimestamp) : options.longs === Number ? new $util.LongBits(message.startTimestamp.low >>> 0, message.startTimestamp.high >>> 0).toNumber(true) : message.startTimestamp;
            if (message.playing != null && message.hasOwnProperty("playing")) {
                object.playing = message.playing;
                if (options.oneofs)
                    object.paused = "playing";
            }
            if (message.pausedTimestamp != null && message.hasOwnProperty("pausedTimestamp")) {
                if (typeof message.pausedTimestamp === "number")
                    object.pausedTimestamp = options.longs === String ? String(message.pausedTimestamp) : message.pausedTimestamp;
                else
                    object.pausedTimestamp = options.longs === String ? $util.Long.prototype.toString.call(message.pausedTimestamp) : options.longs === Number ? new $util.LongBits(message.pausedTimestamp.low >>> 0, message.pausedTimestamp.high >>> 0).toNumber(true) : message.pausedTimestamp;
                if (options.oneofs)
                    object.paused = "pausedTimestamp";
            }
            if (message.queue && message.queue.length) {
                object.queue = [];
                for (let j = 0; j < message.queue.length; ++j)
                    object.queue[j] = message.queue[j];
            }
            return object;
        };

        /**
         * Converts this DeckCreate to JSON.
         * @function toJSON
         * @memberof audiohq.DeckCreate
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        DeckCreate.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for DeckCreate
         * @function getTypeUrl
         * @memberof audiohq.DeckCreate
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        DeckCreate.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/audiohq.DeckCreate";
        };

        return DeckCreate;
    })();

    audiohq.DeckMutate = (function() {

        /**
         * Properties of a DeckMutate.
         * @memberof audiohq
         * @interface IDeckMutate
         * @property {number|null} [volume] DeckMutate volume
         * @property {number|null} [speed] DeckMutate speed
         * @property {number|null} [startTimestamp] DeckMutate startTimestamp
         * @property {boolean|null} [playing] DeckMutate playing
         * @property {number|null} [pausedTimestamp] DeckMutate pausedTimestamp
         * @property {Array.<string>|null} [queue] DeckMutate queue
         */

        /**
         * Constructs a new DeckMutate.
         * @memberof audiohq
         * @classdesc Represents a DeckMutate.
         * @implements IDeckMutate
         * @constructor
         * @param {audiohq.IDeckMutate=} [properties] Properties to set
         */
        function DeckMutate(properties) {
            this.queue = [];
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * DeckMutate volume.
         * @member {number} volume
         * @memberof audiohq.DeckMutate
         * @instance
         */
        DeckMutate.prototype.volume = 0;

        /**
         * DeckMutate speed.
         * @member {number} speed
         * @memberof audiohq.DeckMutate
         * @instance
         */
        DeckMutate.prototype.speed = 0;

        /**
         * DeckMutate startTimestamp.
         * @member {number} startTimestamp
         * @memberof audiohq.DeckMutate
         * @instance
         */
        DeckMutate.prototype.startTimestamp = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        /**
         * DeckMutate playing.
         * @member {boolean|null|undefined} playing
         * @memberof audiohq.DeckMutate
         * @instance
         */
        DeckMutate.prototype.playing = null;

        /**
         * DeckMutate pausedTimestamp.
         * @member {number|null|undefined} pausedTimestamp
         * @memberof audiohq.DeckMutate
         * @instance
         */
        DeckMutate.prototype.pausedTimestamp = null;

        /**
         * DeckMutate queue.
         * @member {Array.<string>} queue
         * @memberof audiohq.DeckMutate
         * @instance
         */
        DeckMutate.prototype.queue = $util.emptyArray;

        // OneOf field names bound to virtual getters and setters
        let $oneOfFields;

        /**
         * DeckMutate paused.
         * @member {"playing"|"pausedTimestamp"|undefined} paused
         * @memberof audiohq.DeckMutate
         * @instance
         */
        Object.defineProperty(DeckMutate.prototype, "paused", {
            get: $util.oneOfGetter($oneOfFields = ["playing", "pausedTimestamp"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Creates a new DeckMutate instance using the specified properties.
         * @function create
         * @memberof audiohq.DeckMutate
         * @static
         * @param {audiohq.IDeckMutate=} [properties] Properties to set
         * @returns {audiohq.DeckMutate} DeckMutate instance
         */
        DeckMutate.create = function create(properties) {
            return new DeckMutate(properties);
        };

        /**
         * Encodes the specified DeckMutate message. Does not implicitly {@link audiohq.DeckMutate.verify|verify} messages.
         * @function encode
         * @memberof audiohq.DeckMutate
         * @static
         * @param {audiohq.IDeckMutate} message DeckMutate message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DeckMutate.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.volume != null && Object.hasOwnProperty.call(message, "volume"))
                writer.uint32(/* id 3, wireType 5 =*/29).float(message.volume);
            if (message.speed != null && Object.hasOwnProperty.call(message, "speed"))
                writer.uint32(/* id 4, wireType 5 =*/37).float(message.speed);
            if (message.startTimestamp != null && Object.hasOwnProperty.call(message, "startTimestamp"))
                writer.uint32(/* id 5, wireType 0 =*/40).uint64(message.startTimestamp);
            if (message.playing != null && Object.hasOwnProperty.call(message, "playing"))
                writer.uint32(/* id 6, wireType 0 =*/48).bool(message.playing);
            if (message.pausedTimestamp != null && Object.hasOwnProperty.call(message, "pausedTimestamp"))
                writer.uint32(/* id 7, wireType 0 =*/56).uint64(message.pausedTimestamp);
            if (message.queue != null && message.queue.length)
                for (let i = 0; i < message.queue.length; ++i)
                    writer.uint32(/* id 8, wireType 2 =*/66).string(message.queue[i]);
            return writer;
        };

        /**
         * Encodes the specified DeckMutate message, length delimited. Does not implicitly {@link audiohq.DeckMutate.verify|verify} messages.
         * @function encodeDelimited
         * @memberof audiohq.DeckMutate
         * @static
         * @param {audiohq.IDeckMutate} message DeckMutate message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DeckMutate.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a DeckMutate message from the specified reader or buffer.
         * @function decode
         * @memberof audiohq.DeckMutate
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {audiohq.DeckMutate} DeckMutate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DeckMutate.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.audiohq.DeckMutate();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 3: {
                        message.volume = reader.float();
                        break;
                    }
                case 4: {
                        message.speed = reader.float();
                        break;
                    }
                case 5: {
                        message.startTimestamp = reader.uint64();
                        break;
                    }
                case 6: {
                        message.playing = reader.bool();
                        break;
                    }
                case 7: {
                        message.pausedTimestamp = reader.uint64();
                        break;
                    }
                case 8: {
                        if (!(message.queue && message.queue.length))
                            message.queue = [];
                        message.queue.push(reader.string());
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a DeckMutate message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof audiohq.DeckMutate
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {audiohq.DeckMutate} DeckMutate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DeckMutate.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a DeckMutate message.
         * @function verify
         * @memberof audiohq.DeckMutate
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        DeckMutate.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            let properties = {};
            if (message.volume != null && message.hasOwnProperty("volume"))
                if (typeof message.volume !== "number")
                    return "volume: number expected";
            if (message.speed != null && message.hasOwnProperty("speed"))
                if (typeof message.speed !== "number")
                    return "speed: number expected";
            if (message.startTimestamp != null && message.hasOwnProperty("startTimestamp"))
                if (!$util.isInteger(message.startTimestamp) && !(message.startTimestamp && $util.isInteger(message.startTimestamp.low) && $util.isInteger(message.startTimestamp.high)))
                    return "startTimestamp: integer|Long expected";
            if (message.playing != null && message.hasOwnProperty("playing")) {
                properties.paused = 1;
                if (typeof message.playing !== "boolean")
                    return "playing: boolean expected";
            }
            if (message.pausedTimestamp != null && message.hasOwnProperty("pausedTimestamp")) {
                if (properties.paused === 1)
                    return "paused: multiple values";
                properties.paused = 1;
                if (!$util.isInteger(message.pausedTimestamp) && !(message.pausedTimestamp && $util.isInteger(message.pausedTimestamp.low) && $util.isInteger(message.pausedTimestamp.high)))
                    return "pausedTimestamp: integer|Long expected";
            }
            if (message.queue != null && message.hasOwnProperty("queue")) {
                if (!Array.isArray(message.queue))
                    return "queue: array expected";
                for (let i = 0; i < message.queue.length; ++i)
                    if (!$util.isString(message.queue[i]))
                        return "queue: string[] expected";
            }
            return null;
        };

        /**
         * Creates a DeckMutate message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof audiohq.DeckMutate
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {audiohq.DeckMutate} DeckMutate
         */
        DeckMutate.fromObject = function fromObject(object) {
            if (object instanceof $root.audiohq.DeckMutate)
                return object;
            let message = new $root.audiohq.DeckMutate();
            if (object.volume != null)
                message.volume = Number(object.volume);
            if (object.speed != null)
                message.speed = Number(object.speed);
            if (object.startTimestamp != null)
                if ($util.Long)
                    (message.startTimestamp = $util.Long.fromValue(object.startTimestamp)).unsigned = true;
                else if (typeof object.startTimestamp === "string")
                    message.startTimestamp = parseInt(object.startTimestamp, 10);
                else if (typeof object.startTimestamp === "number")
                    message.startTimestamp = object.startTimestamp;
                else if (typeof object.startTimestamp === "object")
                    message.startTimestamp = new $util.LongBits(object.startTimestamp.low >>> 0, object.startTimestamp.high >>> 0).toNumber(true);
            if (object.playing != null)
                message.playing = Boolean(object.playing);
            if (object.pausedTimestamp != null)
                if ($util.Long)
                    (message.pausedTimestamp = $util.Long.fromValue(object.pausedTimestamp)).unsigned = true;
                else if (typeof object.pausedTimestamp === "string")
                    message.pausedTimestamp = parseInt(object.pausedTimestamp, 10);
                else if (typeof object.pausedTimestamp === "number")
                    message.pausedTimestamp = object.pausedTimestamp;
                else if (typeof object.pausedTimestamp === "object")
                    message.pausedTimestamp = new $util.LongBits(object.pausedTimestamp.low >>> 0, object.pausedTimestamp.high >>> 0).toNumber(true);
            if (object.queue) {
                if (!Array.isArray(object.queue))
                    throw TypeError(".audiohq.DeckMutate.queue: array expected");
                message.queue = [];
                for (let i = 0; i < object.queue.length; ++i)
                    message.queue[i] = String(object.queue[i]);
            }
            return message;
        };

        /**
         * Creates a plain object from a DeckMutate message. Also converts values to other types if specified.
         * @function toObject
         * @memberof audiohq.DeckMutate
         * @static
         * @param {audiohq.DeckMutate} message DeckMutate
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        DeckMutate.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.arrays || options.defaults)
                object.queue = [];
            if (options.defaults) {
                object.volume = 0;
                object.speed = 0;
                if ($util.Long) {
                    let long = new $util.Long(0, 0, true);
                    object.startTimestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.startTimestamp = options.longs === String ? "0" : 0;
            }
            if (message.volume != null && message.hasOwnProperty("volume"))
                object.volume = options.json && !isFinite(message.volume) ? String(message.volume) : message.volume;
            if (message.speed != null && message.hasOwnProperty("speed"))
                object.speed = options.json && !isFinite(message.speed) ? String(message.speed) : message.speed;
            if (message.startTimestamp != null && message.hasOwnProperty("startTimestamp"))
                if (typeof message.startTimestamp === "number")
                    object.startTimestamp = options.longs === String ? String(message.startTimestamp) : message.startTimestamp;
                else
                    object.startTimestamp = options.longs === String ? $util.Long.prototype.toString.call(message.startTimestamp) : options.longs === Number ? new $util.LongBits(message.startTimestamp.low >>> 0, message.startTimestamp.high >>> 0).toNumber(true) : message.startTimestamp;
            if (message.playing != null && message.hasOwnProperty("playing")) {
                object.playing = message.playing;
                if (options.oneofs)
                    object.paused = "playing";
            }
            if (message.pausedTimestamp != null && message.hasOwnProperty("pausedTimestamp")) {
                if (typeof message.pausedTimestamp === "number")
                    object.pausedTimestamp = options.longs === String ? String(message.pausedTimestamp) : message.pausedTimestamp;
                else
                    object.pausedTimestamp = options.longs === String ? $util.Long.prototype.toString.call(message.pausedTimestamp) : options.longs === Number ? new $util.LongBits(message.pausedTimestamp.low >>> 0, message.pausedTimestamp.high >>> 0).toNumber(true) : message.pausedTimestamp;
                if (options.oneofs)
                    object.paused = "pausedTimestamp";
            }
            if (message.queue && message.queue.length) {
                object.queue = [];
                for (let j = 0; j < message.queue.length; ++j)
                    object.queue[j] = message.queue[j];
            }
            return object;
        };

        /**
         * Converts this DeckMutate to JSON.
         * @function toJSON
         * @memberof audiohq.DeckMutate
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        DeckMutate.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for DeckMutate
         * @function getTypeUrl
         * @memberof audiohq.DeckMutate
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        DeckMutate.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/audiohq.DeckMutate";
        };

        return DeckMutate;
    })();

    audiohq.ListDecksResponse = (function() {

        /**
         * Properties of a ListDecksResponse.
         * @memberof audiohq
         * @interface IListDecksResponse
         * @property {Array.<audiohq.IDeck>|null} [results] ListDecksResponse results
         */

        /**
         * Constructs a new ListDecksResponse.
         * @memberof audiohq
         * @classdesc Represents a ListDecksResponse.
         * @implements IListDecksResponse
         * @constructor
         * @param {audiohq.IListDecksResponse=} [properties] Properties to set
         */
        function ListDecksResponse(properties) {
            this.results = [];
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ListDecksResponse results.
         * @member {Array.<audiohq.IDeck>} results
         * @memberof audiohq.ListDecksResponse
         * @instance
         */
        ListDecksResponse.prototype.results = $util.emptyArray;

        /**
         * Creates a new ListDecksResponse instance using the specified properties.
         * @function create
         * @memberof audiohq.ListDecksResponse
         * @static
         * @param {audiohq.IListDecksResponse=} [properties] Properties to set
         * @returns {audiohq.ListDecksResponse} ListDecksResponse instance
         */
        ListDecksResponse.create = function create(properties) {
            return new ListDecksResponse(properties);
        };

        /**
         * Encodes the specified ListDecksResponse message. Does not implicitly {@link audiohq.ListDecksResponse.verify|verify} messages.
         * @function encode
         * @memberof audiohq.ListDecksResponse
         * @static
         * @param {audiohq.IListDecksResponse} message ListDecksResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ListDecksResponse.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.results != null && message.results.length)
                for (let i = 0; i < message.results.length; ++i)
                    $root.audiohq.Deck.encode(message.results[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified ListDecksResponse message, length delimited. Does not implicitly {@link audiohq.ListDecksResponse.verify|verify} messages.
         * @function encodeDelimited
         * @memberof audiohq.ListDecksResponse
         * @static
         * @param {audiohq.IListDecksResponse} message ListDecksResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ListDecksResponse.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ListDecksResponse message from the specified reader or buffer.
         * @function decode
         * @memberof audiohq.ListDecksResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {audiohq.ListDecksResponse} ListDecksResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ListDecksResponse.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.audiohq.ListDecksResponse();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        if (!(message.results && message.results.length))
                            message.results = [];
                        message.results.push($root.audiohq.Deck.decode(reader, reader.uint32()));
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a ListDecksResponse message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof audiohq.ListDecksResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {audiohq.ListDecksResponse} ListDecksResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ListDecksResponse.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ListDecksResponse message.
         * @function verify
         * @memberof audiohq.ListDecksResponse
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ListDecksResponse.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.results != null && message.hasOwnProperty("results")) {
                if (!Array.isArray(message.results))
                    return "results: array expected";
                for (let i = 0; i < message.results.length; ++i) {
                    let error = $root.audiohq.Deck.verify(message.results[i]);
                    if (error)
                        return "results." + error;
                }
            }
            return null;
        };

        /**
         * Creates a ListDecksResponse message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof audiohq.ListDecksResponse
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {audiohq.ListDecksResponse} ListDecksResponse
         */
        ListDecksResponse.fromObject = function fromObject(object) {
            if (object instanceof $root.audiohq.ListDecksResponse)
                return object;
            let message = new $root.audiohq.ListDecksResponse();
            if (object.results) {
                if (!Array.isArray(object.results))
                    throw TypeError(".audiohq.ListDecksResponse.results: array expected");
                message.results = [];
                for (let i = 0; i < object.results.length; ++i) {
                    if (typeof object.results[i] !== "object")
                        throw TypeError(".audiohq.ListDecksResponse.results: object expected");
                    message.results[i] = $root.audiohq.Deck.fromObject(object.results[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a ListDecksResponse message. Also converts values to other types if specified.
         * @function toObject
         * @memberof audiohq.ListDecksResponse
         * @static
         * @param {audiohq.ListDecksResponse} message ListDecksResponse
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ListDecksResponse.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.arrays || options.defaults)
                object.results = [];
            if (message.results && message.results.length) {
                object.results = [];
                for (let j = 0; j < message.results.length; ++j)
                    object.results[j] = $root.audiohq.Deck.toObject(message.results[j], options);
            }
            return object;
        };

        /**
         * Converts this ListDecksResponse to JSON.
         * @function toJSON
         * @memberof audiohq.ListDecksResponse
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ListDecksResponse.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for ListDecksResponse
         * @function getTypeUrl
         * @memberof audiohq.ListDecksResponse
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        ListDecksResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/audiohq.ListDecksResponse";
        };

        return ListDecksResponse;
    })();

    audiohq.Entry = (function() {

        /**
         * Properties of an Entry.
         * @memberof audiohq
         * @interface IEntry
         * @property {string|null} [id] Entry id
         * @property {audiohq.ISingle|null} [single] Entry single
         * @property {audiohq.IFolder|null} [folder] Entry folder
         */

        /**
         * Constructs a new Entry.
         * @memberof audiohq
         * @classdesc Represents an Entry.
         * @implements IEntry
         * @constructor
         * @param {audiohq.IEntry=} [properties] Properties to set
         */
        function Entry(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Entry id.
         * @member {string} id
         * @memberof audiohq.Entry
         * @instance
         */
        Entry.prototype.id = "";

        /**
         * Entry single.
         * @member {audiohq.ISingle|null|undefined} single
         * @memberof audiohq.Entry
         * @instance
         */
        Entry.prototype.single = null;

        /**
         * Entry folder.
         * @member {audiohq.IFolder|null|undefined} folder
         * @memberof audiohq.Entry
         * @instance
         */
        Entry.prototype.folder = null;

        // OneOf field names bound to virtual getters and setters
        let $oneOfFields;

        /**
         * Entry value.
         * @member {"single"|"folder"|undefined} value
         * @memberof audiohq.Entry
         * @instance
         */
        Object.defineProperty(Entry.prototype, "value", {
            get: $util.oneOfGetter($oneOfFields = ["single", "folder"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Creates a new Entry instance using the specified properties.
         * @function create
         * @memberof audiohq.Entry
         * @static
         * @param {audiohq.IEntry=} [properties] Properties to set
         * @returns {audiohq.Entry} Entry instance
         */
        Entry.create = function create(properties) {
            return new Entry(properties);
        };

        /**
         * Encodes the specified Entry message. Does not implicitly {@link audiohq.Entry.verify|verify} messages.
         * @function encode
         * @memberof audiohq.Entry
         * @static
         * @param {audiohq.IEntry} message Entry message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Entry.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
            if (message.single != null && Object.hasOwnProperty.call(message, "single"))
                $root.audiohq.Single.encode(message.single, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.folder != null && Object.hasOwnProperty.call(message, "folder"))
                $root.audiohq.Folder.encode(message.folder, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified Entry message, length delimited. Does not implicitly {@link audiohq.Entry.verify|verify} messages.
         * @function encodeDelimited
         * @memberof audiohq.Entry
         * @static
         * @param {audiohq.IEntry} message Entry message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Entry.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an Entry message from the specified reader or buffer.
         * @function decode
         * @memberof audiohq.Entry
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {audiohq.Entry} Entry
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Entry.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.audiohq.Entry();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.id = reader.string();
                        break;
                    }
                case 2: {
                        message.single = $root.audiohq.Single.decode(reader, reader.uint32());
                        break;
                    }
                case 3: {
                        message.folder = $root.audiohq.Folder.decode(reader, reader.uint32());
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an Entry message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof audiohq.Entry
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {audiohq.Entry} Entry
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Entry.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an Entry message.
         * @function verify
         * @memberof audiohq.Entry
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Entry.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            let properties = {};
            if (message.id != null && message.hasOwnProperty("id"))
                if (!$util.isString(message.id))
                    return "id: string expected";
            if (message.single != null && message.hasOwnProperty("single")) {
                properties.value = 1;
                {
                    let error = $root.audiohq.Single.verify(message.single);
                    if (error)
                        return "single." + error;
                }
            }
            if (message.folder != null && message.hasOwnProperty("folder")) {
                if (properties.value === 1)
                    return "value: multiple values";
                properties.value = 1;
                {
                    let error = $root.audiohq.Folder.verify(message.folder);
                    if (error)
                        return "folder." + error;
                }
            }
            return null;
        };

        /**
         * Creates an Entry message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof audiohq.Entry
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {audiohq.Entry} Entry
         */
        Entry.fromObject = function fromObject(object) {
            if (object instanceof $root.audiohq.Entry)
                return object;
            let message = new $root.audiohq.Entry();
            if (object.id != null)
                message.id = String(object.id);
            if (object.single != null) {
                if (typeof object.single !== "object")
                    throw TypeError(".audiohq.Entry.single: object expected");
                message.single = $root.audiohq.Single.fromObject(object.single);
            }
            if (object.folder != null) {
                if (typeof object.folder !== "object")
                    throw TypeError(".audiohq.Entry.folder: object expected");
                message.folder = $root.audiohq.Folder.fromObject(object.folder);
            }
            return message;
        };

        /**
         * Creates a plain object from an Entry message. Also converts values to other types if specified.
         * @function toObject
         * @memberof audiohq.Entry
         * @static
         * @param {audiohq.Entry} message Entry
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Entry.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults)
                object.id = "";
            if (message.id != null && message.hasOwnProperty("id"))
                object.id = message.id;
            if (message.single != null && message.hasOwnProperty("single")) {
                object.single = $root.audiohq.Single.toObject(message.single, options);
                if (options.oneofs)
                    object.value = "single";
            }
            if (message.folder != null && message.hasOwnProperty("folder")) {
                object.folder = $root.audiohq.Folder.toObject(message.folder, options);
                if (options.oneofs)
                    object.value = "folder";
            }
            return object;
        };

        /**
         * Converts this Entry to JSON.
         * @function toJSON
         * @memberof audiohq.Entry
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Entry.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for Entry
         * @function getTypeUrl
         * @memberof audiohq.Entry
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Entry.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/audiohq.Entry";
        };

        return Entry;
    })();

    audiohq.Single = (function() {

        /**
         * Properties of a Single.
         * @memberof audiohq
         * @interface ISingle
         * @property {Array.<string>|null} [path] Single path
         * @property {string|null} [name] Single name
         * @property {number|null} [ordering] Single ordering
         * @property {string|null} [description] Single description
         * @property {number|null} [length] Single length
         * @property {string|null} [url] Single url
         */

        /**
         * Constructs a new Single.
         * @memberof audiohq
         * @classdesc Represents a Single.
         * @implements ISingle
         * @constructor
         * @param {audiohq.ISingle=} [properties] Properties to set
         */
        function Single(properties) {
            this.path = [];
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Single path.
         * @member {Array.<string>} path
         * @memberof audiohq.Single
         * @instance
         */
        Single.prototype.path = $util.emptyArray;

        /**
         * Single name.
         * @member {string} name
         * @memberof audiohq.Single
         * @instance
         */
        Single.prototype.name = "";

        /**
         * Single ordering.
         * @member {number} ordering
         * @memberof audiohq.Single
         * @instance
         */
        Single.prototype.ordering = 0;

        /**
         * Single description.
         * @member {string} description
         * @memberof audiohq.Single
         * @instance
         */
        Single.prototype.description = "";

        /**
         * Single length.
         * @member {number} length
         * @memberof audiohq.Single
         * @instance
         */
        Single.prototype.length = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        /**
         * Single url.
         * @member {string} url
         * @memberof audiohq.Single
         * @instance
         */
        Single.prototype.url = "";

        /**
         * Creates a new Single instance using the specified properties.
         * @function create
         * @memberof audiohq.Single
         * @static
         * @param {audiohq.ISingle=} [properties] Properties to set
         * @returns {audiohq.Single} Single instance
         */
        Single.create = function create(properties) {
            return new Single(properties);
        };

        /**
         * Encodes the specified Single message. Does not implicitly {@link audiohq.Single.verify|verify} messages.
         * @function encode
         * @memberof audiohq.Single
         * @static
         * @param {audiohq.ISingle} message Single message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Single.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.path != null && message.path.length)
                for (let i = 0; i < message.path.length; ++i)
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.path[i]);
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.name);
            if (message.ordering != null && Object.hasOwnProperty.call(message, "ordering"))
                writer.uint32(/* id 4, wireType 0 =*/32).sint32(message.ordering);
            if (message.description != null && Object.hasOwnProperty.call(message, "description"))
                writer.uint32(/* id 6, wireType 2 =*/50).string(message.description);
            if (message.length != null && Object.hasOwnProperty.call(message, "length"))
                writer.uint32(/* id 7, wireType 0 =*/56).uint64(message.length);
            if (message.url != null && Object.hasOwnProperty.call(message, "url"))
                writer.uint32(/* id 8, wireType 2 =*/66).string(message.url);
            return writer;
        };

        /**
         * Encodes the specified Single message, length delimited. Does not implicitly {@link audiohq.Single.verify|verify} messages.
         * @function encodeDelimited
         * @memberof audiohq.Single
         * @static
         * @param {audiohq.ISingle} message Single message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Single.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Single message from the specified reader or buffer.
         * @function decode
         * @memberof audiohq.Single
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {audiohq.Single} Single
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Single.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.audiohq.Single();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 2: {
                        if (!(message.path && message.path.length))
                            message.path = [];
                        message.path.push(reader.string());
                        break;
                    }
                case 3: {
                        message.name = reader.string();
                        break;
                    }
                case 4: {
                        message.ordering = reader.sint32();
                        break;
                    }
                case 6: {
                        message.description = reader.string();
                        break;
                    }
                case 7: {
                        message.length = reader.uint64();
                        break;
                    }
                case 8: {
                        message.url = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Single message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof audiohq.Single
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {audiohq.Single} Single
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Single.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Single message.
         * @function verify
         * @memberof audiohq.Single
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Single.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.path != null && message.hasOwnProperty("path")) {
                if (!Array.isArray(message.path))
                    return "path: array expected";
                for (let i = 0; i < message.path.length; ++i)
                    if (!$util.isString(message.path[i]))
                        return "path: string[] expected";
            }
            if (message.name != null && message.hasOwnProperty("name"))
                if (!$util.isString(message.name))
                    return "name: string expected";
            if (message.ordering != null && message.hasOwnProperty("ordering"))
                if (!$util.isInteger(message.ordering))
                    return "ordering: integer expected";
            if (message.description != null && message.hasOwnProperty("description"))
                if (!$util.isString(message.description))
                    return "description: string expected";
            if (message.length != null && message.hasOwnProperty("length"))
                if (!$util.isInteger(message.length) && !(message.length && $util.isInteger(message.length.low) && $util.isInteger(message.length.high)))
                    return "length: integer|Long expected";
            if (message.url != null && message.hasOwnProperty("url"))
                if (!$util.isString(message.url))
                    return "url: string expected";
            return null;
        };

        /**
         * Creates a Single message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof audiohq.Single
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {audiohq.Single} Single
         */
        Single.fromObject = function fromObject(object) {
            if (object instanceof $root.audiohq.Single)
                return object;
            let message = new $root.audiohq.Single();
            if (object.path) {
                if (!Array.isArray(object.path))
                    throw TypeError(".audiohq.Single.path: array expected");
                message.path = [];
                for (let i = 0; i < object.path.length; ++i)
                    message.path[i] = String(object.path[i]);
            }
            if (object.name != null)
                message.name = String(object.name);
            if (object.ordering != null)
                message.ordering = object.ordering | 0;
            if (object.description != null)
                message.description = String(object.description);
            if (object.length != null)
                if ($util.Long)
                    (message.length = $util.Long.fromValue(object.length)).unsigned = true;
                else if (typeof object.length === "string")
                    message.length = parseInt(object.length, 10);
                else if (typeof object.length === "number")
                    message.length = object.length;
                else if (typeof object.length === "object")
                    message.length = new $util.LongBits(object.length.low >>> 0, object.length.high >>> 0).toNumber(true);
            if (object.url != null)
                message.url = String(object.url);
            return message;
        };

        /**
         * Creates a plain object from a Single message. Also converts values to other types if specified.
         * @function toObject
         * @memberof audiohq.Single
         * @static
         * @param {audiohq.Single} message Single
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Single.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.arrays || options.defaults)
                object.path = [];
            if (options.defaults) {
                object.name = "";
                object.ordering = 0;
                object.description = "";
                if ($util.Long) {
                    let long = new $util.Long(0, 0, true);
                    object.length = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.length = options.longs === String ? "0" : 0;
                object.url = "";
            }
            if (message.path && message.path.length) {
                object.path = [];
                for (let j = 0; j < message.path.length; ++j)
                    object.path[j] = message.path[j];
            }
            if (message.name != null && message.hasOwnProperty("name"))
                object.name = message.name;
            if (message.ordering != null && message.hasOwnProperty("ordering"))
                object.ordering = message.ordering;
            if (message.description != null && message.hasOwnProperty("description"))
                object.description = message.description;
            if (message.length != null && message.hasOwnProperty("length"))
                if (typeof message.length === "number")
                    object.length = options.longs === String ? String(message.length) : message.length;
                else
                    object.length = options.longs === String ? $util.Long.prototype.toString.call(message.length) : options.longs === Number ? new $util.LongBits(message.length.low >>> 0, message.length.high >>> 0).toNumber(true) : message.length;
            if (message.url != null && message.hasOwnProperty("url"))
                object.url = message.url;
            return object;
        };

        /**
         * Converts this Single to JSON.
         * @function toJSON
         * @memberof audiohq.Single
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Single.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for Single
         * @function getTypeUrl
         * @memberof audiohq.Single
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Single.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/audiohq.Single";
        };

        return Single;
    })();

    audiohq.SingleMutate = (function() {

        /**
         * Properties of a SingleMutate.
         * @memberof audiohq
         * @interface ISingleMutate
         * @property {Array.<string>|null} [path] SingleMutate path
         * @property {string|null} [name] SingleMutate name
         * @property {number|null} [ordering] SingleMutate ordering
         * @property {boolean|null} [last] SingleMutate last
         * @property {string|null} [description] SingleMutate description
         */

        /**
         * Constructs a new SingleMutate.
         * @memberof audiohq
         * @classdesc Represents a SingleMutate.
         * @implements ISingleMutate
         * @constructor
         * @param {audiohq.ISingleMutate=} [properties] Properties to set
         */
        function SingleMutate(properties) {
            this.path = [];
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * SingleMutate path.
         * @member {Array.<string>} path
         * @memberof audiohq.SingleMutate
         * @instance
         */
        SingleMutate.prototype.path = $util.emptyArray;

        /**
         * SingleMutate name.
         * @member {string} name
         * @memberof audiohq.SingleMutate
         * @instance
         */
        SingleMutate.prototype.name = "";

        /**
         * SingleMutate ordering.
         * @member {number|null|undefined} ordering
         * @memberof audiohq.SingleMutate
         * @instance
         */
        SingleMutate.prototype.ordering = null;

        /**
         * SingleMutate last.
         * @member {boolean|null|undefined} last
         * @memberof audiohq.SingleMutate
         * @instance
         */
        SingleMutate.prototype.last = null;

        /**
         * SingleMutate description.
         * @member {string} description
         * @memberof audiohq.SingleMutate
         * @instance
         */
        SingleMutate.prototype.description = "";

        // OneOf field names bound to virtual getters and setters
        let $oneOfFields;

        /**
         * SingleMutate modOrdering.
         * @member {"ordering"|"last"|undefined} modOrdering
         * @memberof audiohq.SingleMutate
         * @instance
         */
        Object.defineProperty(SingleMutate.prototype, "modOrdering", {
            get: $util.oneOfGetter($oneOfFields = ["ordering", "last"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Creates a new SingleMutate instance using the specified properties.
         * @function create
         * @memberof audiohq.SingleMutate
         * @static
         * @param {audiohq.ISingleMutate=} [properties] Properties to set
         * @returns {audiohq.SingleMutate} SingleMutate instance
         */
        SingleMutate.create = function create(properties) {
            return new SingleMutate(properties);
        };

        /**
         * Encodes the specified SingleMutate message. Does not implicitly {@link audiohq.SingleMutate.verify|verify} messages.
         * @function encode
         * @memberof audiohq.SingleMutate
         * @static
         * @param {audiohq.ISingleMutate} message SingleMutate message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SingleMutate.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.path != null && message.path.length)
                for (let i = 0; i < message.path.length; ++i)
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.path[i]);
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.name);
            if (message.ordering != null && Object.hasOwnProperty.call(message, "ordering"))
                writer.uint32(/* id 4, wireType 0 =*/32).sint32(message.ordering);
            if (message.last != null && Object.hasOwnProperty.call(message, "last"))
                writer.uint32(/* id 5, wireType 0 =*/40).bool(message.last);
            if (message.description != null && Object.hasOwnProperty.call(message, "description"))
                writer.uint32(/* id 6, wireType 2 =*/50).string(message.description);
            return writer;
        };

        /**
         * Encodes the specified SingleMutate message, length delimited. Does not implicitly {@link audiohq.SingleMutate.verify|verify} messages.
         * @function encodeDelimited
         * @memberof audiohq.SingleMutate
         * @static
         * @param {audiohq.ISingleMutate} message SingleMutate message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SingleMutate.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a SingleMutate message from the specified reader or buffer.
         * @function decode
         * @memberof audiohq.SingleMutate
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {audiohq.SingleMutate} SingleMutate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SingleMutate.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.audiohq.SingleMutate();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 2: {
                        if (!(message.path && message.path.length))
                            message.path = [];
                        message.path.push(reader.string());
                        break;
                    }
                case 3: {
                        message.name = reader.string();
                        break;
                    }
                case 4: {
                        message.ordering = reader.sint32();
                        break;
                    }
                case 5: {
                        message.last = reader.bool();
                        break;
                    }
                case 6: {
                        message.description = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a SingleMutate message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof audiohq.SingleMutate
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {audiohq.SingleMutate} SingleMutate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SingleMutate.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a SingleMutate message.
         * @function verify
         * @memberof audiohq.SingleMutate
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        SingleMutate.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            let properties = {};
            if (message.path != null && message.hasOwnProperty("path")) {
                if (!Array.isArray(message.path))
                    return "path: array expected";
                for (let i = 0; i < message.path.length; ++i)
                    if (!$util.isString(message.path[i]))
                        return "path: string[] expected";
            }
            if (message.name != null && message.hasOwnProperty("name"))
                if (!$util.isString(message.name))
                    return "name: string expected";
            if (message.ordering != null && message.hasOwnProperty("ordering")) {
                properties.modOrdering = 1;
                if (!$util.isInteger(message.ordering))
                    return "ordering: integer expected";
            }
            if (message.last != null && message.hasOwnProperty("last")) {
                if (properties.modOrdering === 1)
                    return "modOrdering: multiple values";
                properties.modOrdering = 1;
                if (typeof message.last !== "boolean")
                    return "last: boolean expected";
            }
            if (message.description != null && message.hasOwnProperty("description"))
                if (!$util.isString(message.description))
                    return "description: string expected";
            return null;
        };

        /**
         * Creates a SingleMutate message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof audiohq.SingleMutate
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {audiohq.SingleMutate} SingleMutate
         */
        SingleMutate.fromObject = function fromObject(object) {
            if (object instanceof $root.audiohq.SingleMutate)
                return object;
            let message = new $root.audiohq.SingleMutate();
            if (object.path) {
                if (!Array.isArray(object.path))
                    throw TypeError(".audiohq.SingleMutate.path: array expected");
                message.path = [];
                for (let i = 0; i < object.path.length; ++i)
                    message.path[i] = String(object.path[i]);
            }
            if (object.name != null)
                message.name = String(object.name);
            if (object.ordering != null)
                message.ordering = object.ordering | 0;
            if (object.last != null)
                message.last = Boolean(object.last);
            if (object.description != null)
                message.description = String(object.description);
            return message;
        };

        /**
         * Creates a plain object from a SingleMutate message. Also converts values to other types if specified.
         * @function toObject
         * @memberof audiohq.SingleMutate
         * @static
         * @param {audiohq.SingleMutate} message SingleMutate
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        SingleMutate.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.arrays || options.defaults)
                object.path = [];
            if (options.defaults) {
                object.name = "";
                object.description = "";
            }
            if (message.path && message.path.length) {
                object.path = [];
                for (let j = 0; j < message.path.length; ++j)
                    object.path[j] = message.path[j];
            }
            if (message.name != null && message.hasOwnProperty("name"))
                object.name = message.name;
            if (message.ordering != null && message.hasOwnProperty("ordering")) {
                object.ordering = message.ordering;
                if (options.oneofs)
                    object.modOrdering = "ordering";
            }
            if (message.last != null && message.hasOwnProperty("last")) {
                object.last = message.last;
                if (options.oneofs)
                    object.modOrdering = "last";
            }
            if (message.description != null && message.hasOwnProperty("description"))
                object.description = message.description;
            return object;
        };

        /**
         * Converts this SingleMutate to JSON.
         * @function toJSON
         * @memberof audiohq.SingleMutate
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        SingleMutate.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for SingleMutate
         * @function getTypeUrl
         * @memberof audiohq.SingleMutate
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        SingleMutate.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/audiohq.SingleMutate";
        };

        return SingleMutate;
    })();

    audiohq.Folder = (function() {

        /**
         * Properties of a Folder.
         * @memberof audiohq
         * @interface IFolder
         * @property {Array.<string>|null} [path] Folder path
         * @property {string|null} [name] Folder name
         * @property {number|null} [ordering] Folder ordering
         */

        /**
         * Constructs a new Folder.
         * @memberof audiohq
         * @classdesc Represents a Folder.
         * @implements IFolder
         * @constructor
         * @param {audiohq.IFolder=} [properties] Properties to set
         */
        function Folder(properties) {
            this.path = [];
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Folder path.
         * @member {Array.<string>} path
         * @memberof audiohq.Folder
         * @instance
         */
        Folder.prototype.path = $util.emptyArray;

        /**
         * Folder name.
         * @member {string} name
         * @memberof audiohq.Folder
         * @instance
         */
        Folder.prototype.name = "";

        /**
         * Folder ordering.
         * @member {number} ordering
         * @memberof audiohq.Folder
         * @instance
         */
        Folder.prototype.ordering = 0;

        /**
         * Creates a new Folder instance using the specified properties.
         * @function create
         * @memberof audiohq.Folder
         * @static
         * @param {audiohq.IFolder=} [properties] Properties to set
         * @returns {audiohq.Folder} Folder instance
         */
        Folder.create = function create(properties) {
            return new Folder(properties);
        };

        /**
         * Encodes the specified Folder message. Does not implicitly {@link audiohq.Folder.verify|verify} messages.
         * @function encode
         * @memberof audiohq.Folder
         * @static
         * @param {audiohq.IFolder} message Folder message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Folder.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.path != null && message.path.length)
                for (let i = 0; i < message.path.length; ++i)
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.path[i]);
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.name);
            if (message.ordering != null && Object.hasOwnProperty.call(message, "ordering"))
                writer.uint32(/* id 4, wireType 0 =*/32).sint32(message.ordering);
            return writer;
        };

        /**
         * Encodes the specified Folder message, length delimited. Does not implicitly {@link audiohq.Folder.verify|verify} messages.
         * @function encodeDelimited
         * @memberof audiohq.Folder
         * @static
         * @param {audiohq.IFolder} message Folder message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Folder.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Folder message from the specified reader or buffer.
         * @function decode
         * @memberof audiohq.Folder
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {audiohq.Folder} Folder
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Folder.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.audiohq.Folder();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 2: {
                        if (!(message.path && message.path.length))
                            message.path = [];
                        message.path.push(reader.string());
                        break;
                    }
                case 3: {
                        message.name = reader.string();
                        break;
                    }
                case 4: {
                        message.ordering = reader.sint32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Folder message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof audiohq.Folder
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {audiohq.Folder} Folder
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Folder.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Folder message.
         * @function verify
         * @memberof audiohq.Folder
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Folder.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.path != null && message.hasOwnProperty("path")) {
                if (!Array.isArray(message.path))
                    return "path: array expected";
                for (let i = 0; i < message.path.length; ++i)
                    if (!$util.isString(message.path[i]))
                        return "path: string[] expected";
            }
            if (message.name != null && message.hasOwnProperty("name"))
                if (!$util.isString(message.name))
                    return "name: string expected";
            if (message.ordering != null && message.hasOwnProperty("ordering"))
                if (!$util.isInteger(message.ordering))
                    return "ordering: integer expected";
            return null;
        };

        /**
         * Creates a Folder message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof audiohq.Folder
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {audiohq.Folder} Folder
         */
        Folder.fromObject = function fromObject(object) {
            if (object instanceof $root.audiohq.Folder)
                return object;
            let message = new $root.audiohq.Folder();
            if (object.path) {
                if (!Array.isArray(object.path))
                    throw TypeError(".audiohq.Folder.path: array expected");
                message.path = [];
                for (let i = 0; i < object.path.length; ++i)
                    message.path[i] = String(object.path[i]);
            }
            if (object.name != null)
                message.name = String(object.name);
            if (object.ordering != null)
                message.ordering = object.ordering | 0;
            return message;
        };

        /**
         * Creates a plain object from a Folder message. Also converts values to other types if specified.
         * @function toObject
         * @memberof audiohq.Folder
         * @static
         * @param {audiohq.Folder} message Folder
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Folder.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.arrays || options.defaults)
                object.path = [];
            if (options.defaults) {
                object.name = "";
                object.ordering = 0;
            }
            if (message.path && message.path.length) {
                object.path = [];
                for (let j = 0; j < message.path.length; ++j)
                    object.path[j] = message.path[j];
            }
            if (message.name != null && message.hasOwnProperty("name"))
                object.name = message.name;
            if (message.ordering != null && message.hasOwnProperty("ordering"))
                object.ordering = message.ordering;
            return object;
        };

        /**
         * Converts this Folder to JSON.
         * @function toJSON
         * @memberof audiohq.Folder
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Folder.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for Folder
         * @function getTypeUrl
         * @memberof audiohq.Folder
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Folder.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/audiohq.Folder";
        };

        return Folder;
    })();

    audiohq.FolderMutate = (function() {

        /**
         * Properties of a FolderMutate.
         * @memberof audiohq
         * @interface IFolderMutate
         * @property {Array.<string>|null} [path] FolderMutate path
         * @property {string|null} [name] FolderMutate name
         * @property {number|null} [ordering] FolderMutate ordering
         * @property {boolean|null} [last] FolderMutate last
         */

        /**
         * Constructs a new FolderMutate.
         * @memberof audiohq
         * @classdesc Represents a FolderMutate.
         * @implements IFolderMutate
         * @constructor
         * @param {audiohq.IFolderMutate=} [properties] Properties to set
         */
        function FolderMutate(properties) {
            this.path = [];
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * FolderMutate path.
         * @member {Array.<string>} path
         * @memberof audiohq.FolderMutate
         * @instance
         */
        FolderMutate.prototype.path = $util.emptyArray;

        /**
         * FolderMutate name.
         * @member {string} name
         * @memberof audiohq.FolderMutate
         * @instance
         */
        FolderMutate.prototype.name = "";

        /**
         * FolderMutate ordering.
         * @member {number|null|undefined} ordering
         * @memberof audiohq.FolderMutate
         * @instance
         */
        FolderMutate.prototype.ordering = null;

        /**
         * FolderMutate last.
         * @member {boolean|null|undefined} last
         * @memberof audiohq.FolderMutate
         * @instance
         */
        FolderMutate.prototype.last = null;

        // OneOf field names bound to virtual getters and setters
        let $oneOfFields;

        /**
         * FolderMutate modOrdering.
         * @member {"ordering"|"last"|undefined} modOrdering
         * @memberof audiohq.FolderMutate
         * @instance
         */
        Object.defineProperty(FolderMutate.prototype, "modOrdering", {
            get: $util.oneOfGetter($oneOfFields = ["ordering", "last"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Creates a new FolderMutate instance using the specified properties.
         * @function create
         * @memberof audiohq.FolderMutate
         * @static
         * @param {audiohq.IFolderMutate=} [properties] Properties to set
         * @returns {audiohq.FolderMutate} FolderMutate instance
         */
        FolderMutate.create = function create(properties) {
            return new FolderMutate(properties);
        };

        /**
         * Encodes the specified FolderMutate message. Does not implicitly {@link audiohq.FolderMutate.verify|verify} messages.
         * @function encode
         * @memberof audiohq.FolderMutate
         * @static
         * @param {audiohq.IFolderMutate} message FolderMutate message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        FolderMutate.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.path != null && message.path.length)
                for (let i = 0; i < message.path.length; ++i)
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.path[i]);
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.name);
            if (message.ordering != null && Object.hasOwnProperty.call(message, "ordering"))
                writer.uint32(/* id 4, wireType 0 =*/32).sint32(message.ordering);
            if (message.last != null && Object.hasOwnProperty.call(message, "last"))
                writer.uint32(/* id 5, wireType 0 =*/40).bool(message.last);
            return writer;
        };

        /**
         * Encodes the specified FolderMutate message, length delimited. Does not implicitly {@link audiohq.FolderMutate.verify|verify} messages.
         * @function encodeDelimited
         * @memberof audiohq.FolderMutate
         * @static
         * @param {audiohq.IFolderMutate} message FolderMutate message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        FolderMutate.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a FolderMutate message from the specified reader or buffer.
         * @function decode
         * @memberof audiohq.FolderMutate
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {audiohq.FolderMutate} FolderMutate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        FolderMutate.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.audiohq.FolderMutate();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 2: {
                        if (!(message.path && message.path.length))
                            message.path = [];
                        message.path.push(reader.string());
                        break;
                    }
                case 3: {
                        message.name = reader.string();
                        break;
                    }
                case 4: {
                        message.ordering = reader.sint32();
                        break;
                    }
                case 5: {
                        message.last = reader.bool();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a FolderMutate message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof audiohq.FolderMutate
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {audiohq.FolderMutate} FolderMutate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        FolderMutate.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a FolderMutate message.
         * @function verify
         * @memberof audiohq.FolderMutate
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        FolderMutate.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            let properties = {};
            if (message.path != null && message.hasOwnProperty("path")) {
                if (!Array.isArray(message.path))
                    return "path: array expected";
                for (let i = 0; i < message.path.length; ++i)
                    if (!$util.isString(message.path[i]))
                        return "path: string[] expected";
            }
            if (message.name != null && message.hasOwnProperty("name"))
                if (!$util.isString(message.name))
                    return "name: string expected";
            if (message.ordering != null && message.hasOwnProperty("ordering")) {
                properties.modOrdering = 1;
                if (!$util.isInteger(message.ordering))
                    return "ordering: integer expected";
            }
            if (message.last != null && message.hasOwnProperty("last")) {
                if (properties.modOrdering === 1)
                    return "modOrdering: multiple values";
                properties.modOrdering = 1;
                if (typeof message.last !== "boolean")
                    return "last: boolean expected";
            }
            return null;
        };

        /**
         * Creates a FolderMutate message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof audiohq.FolderMutate
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {audiohq.FolderMutate} FolderMutate
         */
        FolderMutate.fromObject = function fromObject(object) {
            if (object instanceof $root.audiohq.FolderMutate)
                return object;
            let message = new $root.audiohq.FolderMutate();
            if (object.path) {
                if (!Array.isArray(object.path))
                    throw TypeError(".audiohq.FolderMutate.path: array expected");
                message.path = [];
                for (let i = 0; i < object.path.length; ++i)
                    message.path[i] = String(object.path[i]);
            }
            if (object.name != null)
                message.name = String(object.name);
            if (object.ordering != null)
                message.ordering = object.ordering | 0;
            if (object.last != null)
                message.last = Boolean(object.last);
            return message;
        };

        /**
         * Creates a plain object from a FolderMutate message. Also converts values to other types if specified.
         * @function toObject
         * @memberof audiohq.FolderMutate
         * @static
         * @param {audiohq.FolderMutate} message FolderMutate
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        FolderMutate.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.arrays || options.defaults)
                object.path = [];
            if (options.defaults)
                object.name = "";
            if (message.path && message.path.length) {
                object.path = [];
                for (let j = 0; j < message.path.length; ++j)
                    object.path[j] = message.path[j];
            }
            if (message.name != null && message.hasOwnProperty("name"))
                object.name = message.name;
            if (message.ordering != null && message.hasOwnProperty("ordering")) {
                object.ordering = message.ordering;
                if (options.oneofs)
                    object.modOrdering = "ordering";
            }
            if (message.last != null && message.hasOwnProperty("last")) {
                object.last = message.last;
                if (options.oneofs)
                    object.modOrdering = "last";
            }
            return object;
        };

        /**
         * Converts this FolderMutate to JSON.
         * @function toJSON
         * @memberof audiohq.FolderMutate
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        FolderMutate.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for FolderMutate
         * @function getTypeUrl
         * @memberof audiohq.FolderMutate
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        FolderMutate.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/audiohq.FolderMutate";
        };

        return FolderMutate;
    })();

    audiohq.ListEntriesResponse = (function() {

        /**
         * Properties of a ListEntriesResponse.
         * @memberof audiohq
         * @interface IListEntriesResponse
         * @property {Array.<audiohq.IEntry>|null} [entries] ListEntriesResponse entries
         */

        /**
         * Constructs a new ListEntriesResponse.
         * @memberof audiohq
         * @classdesc Represents a ListEntriesResponse.
         * @implements IListEntriesResponse
         * @constructor
         * @param {audiohq.IListEntriesResponse=} [properties] Properties to set
         */
        function ListEntriesResponse(properties) {
            this.entries = [];
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ListEntriesResponse entries.
         * @member {Array.<audiohq.IEntry>} entries
         * @memberof audiohq.ListEntriesResponse
         * @instance
         */
        ListEntriesResponse.prototype.entries = $util.emptyArray;

        /**
         * Creates a new ListEntriesResponse instance using the specified properties.
         * @function create
         * @memberof audiohq.ListEntriesResponse
         * @static
         * @param {audiohq.IListEntriesResponse=} [properties] Properties to set
         * @returns {audiohq.ListEntriesResponse} ListEntriesResponse instance
         */
        ListEntriesResponse.create = function create(properties) {
            return new ListEntriesResponse(properties);
        };

        /**
         * Encodes the specified ListEntriesResponse message. Does not implicitly {@link audiohq.ListEntriesResponse.verify|verify} messages.
         * @function encode
         * @memberof audiohq.ListEntriesResponse
         * @static
         * @param {audiohq.IListEntriesResponse} message ListEntriesResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ListEntriesResponse.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.entries != null && message.entries.length)
                for (let i = 0; i < message.entries.length; ++i)
                    $root.audiohq.Entry.encode(message.entries[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified ListEntriesResponse message, length delimited. Does not implicitly {@link audiohq.ListEntriesResponse.verify|verify} messages.
         * @function encodeDelimited
         * @memberof audiohq.ListEntriesResponse
         * @static
         * @param {audiohq.IListEntriesResponse} message ListEntriesResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ListEntriesResponse.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ListEntriesResponse message from the specified reader or buffer.
         * @function decode
         * @memberof audiohq.ListEntriesResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {audiohq.ListEntriesResponse} ListEntriesResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ListEntriesResponse.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.audiohq.ListEntriesResponse();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        if (!(message.entries && message.entries.length))
                            message.entries = [];
                        message.entries.push($root.audiohq.Entry.decode(reader, reader.uint32()));
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a ListEntriesResponse message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof audiohq.ListEntriesResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {audiohq.ListEntriesResponse} ListEntriesResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ListEntriesResponse.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ListEntriesResponse message.
         * @function verify
         * @memberof audiohq.ListEntriesResponse
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ListEntriesResponse.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.entries != null && message.hasOwnProperty("entries")) {
                if (!Array.isArray(message.entries))
                    return "entries: array expected";
                for (let i = 0; i < message.entries.length; ++i) {
                    let error = $root.audiohq.Entry.verify(message.entries[i]);
                    if (error)
                        return "entries." + error;
                }
            }
            return null;
        };

        /**
         * Creates a ListEntriesResponse message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof audiohq.ListEntriesResponse
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {audiohq.ListEntriesResponse} ListEntriesResponse
         */
        ListEntriesResponse.fromObject = function fromObject(object) {
            if (object instanceof $root.audiohq.ListEntriesResponse)
                return object;
            let message = new $root.audiohq.ListEntriesResponse();
            if (object.entries) {
                if (!Array.isArray(object.entries))
                    throw TypeError(".audiohq.ListEntriesResponse.entries: array expected");
                message.entries = [];
                for (let i = 0; i < object.entries.length; ++i) {
                    if (typeof object.entries[i] !== "object")
                        throw TypeError(".audiohq.ListEntriesResponse.entries: object expected");
                    message.entries[i] = $root.audiohq.Entry.fromObject(object.entries[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a ListEntriesResponse message. Also converts values to other types if specified.
         * @function toObject
         * @memberof audiohq.ListEntriesResponse
         * @static
         * @param {audiohq.ListEntriesResponse} message ListEntriesResponse
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ListEntriesResponse.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.arrays || options.defaults)
                object.entries = [];
            if (message.entries && message.entries.length) {
                object.entries = [];
                for (let j = 0; j < message.entries.length; ++j)
                    object.entries[j] = $root.audiohq.Entry.toObject(message.entries[j], options);
            }
            return object;
        };

        /**
         * Converts this ListEntriesResponse to JSON.
         * @function toJSON
         * @memberof audiohq.ListEntriesResponse
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ListEntriesResponse.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for ListEntriesResponse
         * @function getTypeUrl
         * @memberof audiohq.ListEntriesResponse
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        ListEntriesResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/audiohq.ListEntriesResponse";
        };

        return ListEntriesResponse;
    })();

    audiohq.EntryMutate = (function() {

        /**
         * Properties of an EntryMutate.
         * @memberof audiohq
         * @interface IEntryMutate
         * @property {audiohq.IEntryMutate|null} [entry] EntryMutate entry
         * @property {audiohq.IFolderMutate|null} [folder] EntryMutate folder
         */

        /**
         * Constructs a new EntryMutate.
         * @memberof audiohq
         * @classdesc Represents an EntryMutate.
         * @implements IEntryMutate
         * @constructor
         * @param {audiohq.IEntryMutate=} [properties] Properties to set
         */
        function EntryMutate(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * EntryMutate entry.
         * @member {audiohq.IEntryMutate|null|undefined} entry
         * @memberof audiohq.EntryMutate
         * @instance
         */
        EntryMutate.prototype.entry = null;

        /**
         * EntryMutate folder.
         * @member {audiohq.IFolderMutate|null|undefined} folder
         * @memberof audiohq.EntryMutate
         * @instance
         */
        EntryMutate.prototype.folder = null;

        // OneOf field names bound to virtual getters and setters
        let $oneOfFields;

        /**
         * EntryMutate mutation.
         * @member {"entry"|"folder"|undefined} mutation
         * @memberof audiohq.EntryMutate
         * @instance
         */
        Object.defineProperty(EntryMutate.prototype, "mutation", {
            get: $util.oneOfGetter($oneOfFields = ["entry", "folder"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Creates a new EntryMutate instance using the specified properties.
         * @function create
         * @memberof audiohq.EntryMutate
         * @static
         * @param {audiohq.IEntryMutate=} [properties] Properties to set
         * @returns {audiohq.EntryMutate} EntryMutate instance
         */
        EntryMutate.create = function create(properties) {
            return new EntryMutate(properties);
        };

        /**
         * Encodes the specified EntryMutate message. Does not implicitly {@link audiohq.EntryMutate.verify|verify} messages.
         * @function encode
         * @memberof audiohq.EntryMutate
         * @static
         * @param {audiohq.IEntryMutate} message EntryMutate message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        EntryMutate.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.entry != null && Object.hasOwnProperty.call(message, "entry"))
                $root.audiohq.EntryMutate.encode(message.entry, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.folder != null && Object.hasOwnProperty.call(message, "folder"))
                $root.audiohq.FolderMutate.encode(message.folder, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified EntryMutate message, length delimited. Does not implicitly {@link audiohq.EntryMutate.verify|verify} messages.
         * @function encodeDelimited
         * @memberof audiohq.EntryMutate
         * @static
         * @param {audiohq.IEntryMutate} message EntryMutate message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        EntryMutate.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an EntryMutate message from the specified reader or buffer.
         * @function decode
         * @memberof audiohq.EntryMutate
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {audiohq.EntryMutate} EntryMutate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        EntryMutate.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.audiohq.EntryMutate();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.entry = $root.audiohq.EntryMutate.decode(reader, reader.uint32());
                        break;
                    }
                case 2: {
                        message.folder = $root.audiohq.FolderMutate.decode(reader, reader.uint32());
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an EntryMutate message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof audiohq.EntryMutate
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {audiohq.EntryMutate} EntryMutate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        EntryMutate.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an EntryMutate message.
         * @function verify
         * @memberof audiohq.EntryMutate
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        EntryMutate.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            let properties = {};
            if (message.entry != null && message.hasOwnProperty("entry")) {
                properties.mutation = 1;
                {
                    let error = $root.audiohq.EntryMutate.verify(message.entry);
                    if (error)
                        return "entry." + error;
                }
            }
            if (message.folder != null && message.hasOwnProperty("folder")) {
                if (properties.mutation === 1)
                    return "mutation: multiple values";
                properties.mutation = 1;
                {
                    let error = $root.audiohq.FolderMutate.verify(message.folder);
                    if (error)
                        return "folder." + error;
                }
            }
            return null;
        };

        /**
         * Creates an EntryMutate message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof audiohq.EntryMutate
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {audiohq.EntryMutate} EntryMutate
         */
        EntryMutate.fromObject = function fromObject(object) {
            if (object instanceof $root.audiohq.EntryMutate)
                return object;
            let message = new $root.audiohq.EntryMutate();
            if (object.entry != null) {
                if (typeof object.entry !== "object")
                    throw TypeError(".audiohq.EntryMutate.entry: object expected");
                message.entry = $root.audiohq.EntryMutate.fromObject(object.entry);
            }
            if (object.folder != null) {
                if (typeof object.folder !== "object")
                    throw TypeError(".audiohq.EntryMutate.folder: object expected");
                message.folder = $root.audiohq.FolderMutate.fromObject(object.folder);
            }
            return message;
        };

        /**
         * Creates a plain object from an EntryMutate message. Also converts values to other types if specified.
         * @function toObject
         * @memberof audiohq.EntryMutate
         * @static
         * @param {audiohq.EntryMutate} message EntryMutate
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        EntryMutate.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (message.entry != null && message.hasOwnProperty("entry")) {
                object.entry = $root.audiohq.EntryMutate.toObject(message.entry, options);
                if (options.oneofs)
                    object.mutation = "entry";
            }
            if (message.folder != null && message.hasOwnProperty("folder")) {
                object.folder = $root.audiohq.FolderMutate.toObject(message.folder, options);
                if (options.oneofs)
                    object.mutation = "folder";
            }
            return object;
        };

        /**
         * Converts this EntryMutate to JSON.
         * @function toJSON
         * @memberof audiohq.EntryMutate
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        EntryMutate.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for EntryMutate
         * @function getTypeUrl
         * @memberof audiohq.EntryMutate
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        EntryMutate.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/audiohq.EntryMutate";
        };

        return EntryMutate;
    })();

    /**
     * JobStatus enum.
     * @name audiohq.JobStatus
     * @enum {number}
     * @property {number} GETTING_READY=1 GETTING_READY value
     * @property {number} WAITING=2 WAITING value
     * @property {number} ASSIGNED=3 ASSIGNED value
     * @property {number} DOWNLOADING=4 DOWNLOADING value
     * @property {number} CONVERTING=5 CONVERTING value
     * @property {number} UPLOADING=6 UPLOADING value
     * @property {number} SAVING=7 SAVING value
     * @property {number} DONE=8 DONE value
     * @property {number} ERROR=9 ERROR value
     */
    audiohq.JobStatus = (function() {
        const valuesById = {}, values = Object.create(valuesById);
        values[valuesById[1] = "GETTING_READY"] = 1;
        values[valuesById[2] = "WAITING"] = 2;
        values[valuesById[3] = "ASSIGNED"] = 3;
        values[valuesById[4] = "DOWNLOADING"] = 4;
        values[valuesById[5] = "CONVERTING"] = 5;
        values[valuesById[6] = "UPLOADING"] = 6;
        values[valuesById[7] = "SAVING"] = 7;
        values[valuesById[8] = "DONE"] = 8;
        values[valuesById[9] = "ERROR"] = 9;
        return values;
    })();

    audiohq.Job = (function() {

        /**
         * Properties of a Job.
         * @memberof audiohq
         * @interface IJob
         * @property {string|null} [id] Job id
         * @property {audiohq.ISingleMutate|null} [details] Job details
         * @property {Array.<audiohq.IModification>|null} [modifications] Job modifications
         * @property {number|null} [progress] Job progress
         * @property {audiohq.JobStatus|null} [status] Job status
         * @property {boolean|null} [unassigned] Job unassigned
         * @property {string|null} [assignedWorker] Job assignedWorker
         * @property {boolean|null} [ok] Job ok
         * @property {string|null} [errorDetails] Job errorDetails
         * @property {string|null} [url] Job url
         */

        /**
         * Constructs a new Job.
         * @memberof audiohq
         * @classdesc Represents a Job.
         * @implements IJob
         * @constructor
         * @param {audiohq.IJob=} [properties] Properties to set
         */
        function Job(properties) {
            this.modifications = [];
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Job id.
         * @member {string} id
         * @memberof audiohq.Job
         * @instance
         */
        Job.prototype.id = "";

        /**
         * Job details.
         * @member {audiohq.ISingleMutate|null|undefined} details
         * @memberof audiohq.Job
         * @instance
         */
        Job.prototype.details = null;

        /**
         * Job modifications.
         * @member {Array.<audiohq.IModification>} modifications
         * @memberof audiohq.Job
         * @instance
         */
        Job.prototype.modifications = $util.emptyArray;

        /**
         * Job progress.
         * @member {number} progress
         * @memberof audiohq.Job
         * @instance
         */
        Job.prototype.progress = 0;

        /**
         * Job status.
         * @member {audiohq.JobStatus} status
         * @memberof audiohq.Job
         * @instance
         */
        Job.prototype.status = 1;

        /**
         * Job unassigned.
         * @member {boolean|null|undefined} unassigned
         * @memberof audiohq.Job
         * @instance
         */
        Job.prototype.unassigned = null;

        /**
         * Job assignedWorker.
         * @member {string|null|undefined} assignedWorker
         * @memberof audiohq.Job
         * @instance
         */
        Job.prototype.assignedWorker = null;

        /**
         * Job ok.
         * @member {boolean|null|undefined} ok
         * @memberof audiohq.Job
         * @instance
         */
        Job.prototype.ok = null;

        /**
         * Job errorDetails.
         * @member {string|null|undefined} errorDetails
         * @memberof audiohq.Job
         * @instance
         */
        Job.prototype.errorDetails = null;

        /**
         * Job url.
         * @member {string} url
         * @memberof audiohq.Job
         * @instance
         */
        Job.prototype.url = "";

        // OneOf field names bound to virtual getters and setters
        let $oneOfFields;

        /**
         * Job assignment.
         * @member {"unassigned"|"assignedWorker"|undefined} assignment
         * @memberof audiohq.Job
         * @instance
         */
        Object.defineProperty(Job.prototype, "assignment", {
            get: $util.oneOfGetter($oneOfFields = ["unassigned", "assignedWorker"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Job error.
         * @member {"ok"|"errorDetails"|undefined} error
         * @memberof audiohq.Job
         * @instance
         */
        Object.defineProperty(Job.prototype, "error", {
            get: $util.oneOfGetter($oneOfFields = ["ok", "errorDetails"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Creates a new Job instance using the specified properties.
         * @function create
         * @memberof audiohq.Job
         * @static
         * @param {audiohq.IJob=} [properties] Properties to set
         * @returns {audiohq.Job} Job instance
         */
        Job.create = function create(properties) {
            return new Job(properties);
        };

        /**
         * Encodes the specified Job message. Does not implicitly {@link audiohq.Job.verify|verify} messages.
         * @function encode
         * @memberof audiohq.Job
         * @static
         * @param {audiohq.IJob} message Job message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Job.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                writer.uint32(/* id 0, wireType 2 =*/2).string(message.id);
            if (message.details != null && Object.hasOwnProperty.call(message, "details"))
                $root.audiohq.SingleMutate.encode(message.details, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.modifications != null && message.modifications.length)
                for (let i = 0; i < message.modifications.length; ++i)
                    $root.audiohq.Modification.encode(message.modifications[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.progress != null && Object.hasOwnProperty.call(message, "progress"))
                writer.uint32(/* id 3, wireType 5 =*/29).float(message.progress);
            if (message.status != null && Object.hasOwnProperty.call(message, "status"))
                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.status);
            if (message.unassigned != null && Object.hasOwnProperty.call(message, "unassigned"))
                writer.uint32(/* id 5, wireType 0 =*/40).bool(message.unassigned);
            if (message.assignedWorker != null && Object.hasOwnProperty.call(message, "assignedWorker"))
                writer.uint32(/* id 6, wireType 2 =*/50).string(message.assignedWorker);
            if (message.ok != null && Object.hasOwnProperty.call(message, "ok"))
                writer.uint32(/* id 7, wireType 0 =*/56).bool(message.ok);
            if (message.errorDetails != null && Object.hasOwnProperty.call(message, "errorDetails"))
                writer.uint32(/* id 8, wireType 2 =*/66).string(message.errorDetails);
            if (message.url != null && Object.hasOwnProperty.call(message, "url"))
                writer.uint32(/* id 9, wireType 2 =*/74).string(message.url);
            return writer;
        };

        /**
         * Encodes the specified Job message, length delimited. Does not implicitly {@link audiohq.Job.verify|verify} messages.
         * @function encodeDelimited
         * @memberof audiohq.Job
         * @static
         * @param {audiohq.IJob} message Job message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Job.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Job message from the specified reader or buffer.
         * @function decode
         * @memberof audiohq.Job
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {audiohq.Job} Job
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Job.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.audiohq.Job();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 0: {
                        message.id = reader.string();
                        break;
                    }
                case 1: {
                        message.details = $root.audiohq.SingleMutate.decode(reader, reader.uint32());
                        break;
                    }
                case 2: {
                        if (!(message.modifications && message.modifications.length))
                            message.modifications = [];
                        message.modifications.push($root.audiohq.Modification.decode(reader, reader.uint32()));
                        break;
                    }
                case 3: {
                        message.progress = reader.float();
                        break;
                    }
                case 4: {
                        message.status = reader.int32();
                        break;
                    }
                case 5: {
                        message.unassigned = reader.bool();
                        break;
                    }
                case 6: {
                        message.assignedWorker = reader.string();
                        break;
                    }
                case 7: {
                        message.ok = reader.bool();
                        break;
                    }
                case 8: {
                        message.errorDetails = reader.string();
                        break;
                    }
                case 9: {
                        message.url = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Job message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof audiohq.Job
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {audiohq.Job} Job
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Job.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Job message.
         * @function verify
         * @memberof audiohq.Job
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Job.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            let properties = {};
            if (message.id != null && message.hasOwnProperty("id"))
                if (!$util.isString(message.id))
                    return "id: string expected";
            if (message.details != null && message.hasOwnProperty("details")) {
                let error = $root.audiohq.SingleMutate.verify(message.details);
                if (error)
                    return "details." + error;
            }
            if (message.modifications != null && message.hasOwnProperty("modifications")) {
                if (!Array.isArray(message.modifications))
                    return "modifications: array expected";
                for (let i = 0; i < message.modifications.length; ++i) {
                    let error = $root.audiohq.Modification.verify(message.modifications[i]);
                    if (error)
                        return "modifications." + error;
                }
            }
            if (message.progress != null && message.hasOwnProperty("progress"))
                if (typeof message.progress !== "number")
                    return "progress: number expected";
            if (message.status != null && message.hasOwnProperty("status"))
                switch (message.status) {
                default:
                    return "status: enum value expected";
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                case 8:
                case 9:
                    break;
                }
            if (message.unassigned != null && message.hasOwnProperty("unassigned")) {
                properties.assignment = 1;
                if (typeof message.unassigned !== "boolean")
                    return "unassigned: boolean expected";
            }
            if (message.assignedWorker != null && message.hasOwnProperty("assignedWorker")) {
                if (properties.assignment === 1)
                    return "assignment: multiple values";
                properties.assignment = 1;
                if (!$util.isString(message.assignedWorker))
                    return "assignedWorker: string expected";
            }
            if (message.ok != null && message.hasOwnProperty("ok")) {
                properties.error = 1;
                if (typeof message.ok !== "boolean")
                    return "ok: boolean expected";
            }
            if (message.errorDetails != null && message.hasOwnProperty("errorDetails")) {
                if (properties.error === 1)
                    return "error: multiple values";
                properties.error = 1;
                if (!$util.isString(message.errorDetails))
                    return "errorDetails: string expected";
            }
            if (message.url != null && message.hasOwnProperty("url"))
                if (!$util.isString(message.url))
                    return "url: string expected";
            return null;
        };

        /**
         * Creates a Job message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof audiohq.Job
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {audiohq.Job} Job
         */
        Job.fromObject = function fromObject(object) {
            if (object instanceof $root.audiohq.Job)
                return object;
            let message = new $root.audiohq.Job();
            if (object.id != null)
                message.id = String(object.id);
            if (object.details != null) {
                if (typeof object.details !== "object")
                    throw TypeError(".audiohq.Job.details: object expected");
                message.details = $root.audiohq.SingleMutate.fromObject(object.details);
            }
            if (object.modifications) {
                if (!Array.isArray(object.modifications))
                    throw TypeError(".audiohq.Job.modifications: array expected");
                message.modifications = [];
                for (let i = 0; i < object.modifications.length; ++i) {
                    if (typeof object.modifications[i] !== "object")
                        throw TypeError(".audiohq.Job.modifications: object expected");
                    message.modifications[i] = $root.audiohq.Modification.fromObject(object.modifications[i]);
                }
            }
            if (object.progress != null)
                message.progress = Number(object.progress);
            switch (object.status) {
            default:
                if (typeof object.status === "number") {
                    message.status = object.status;
                    break;
                }
                break;
            case "GETTING_READY":
            case 1:
                message.status = 1;
                break;
            case "WAITING":
            case 2:
                message.status = 2;
                break;
            case "ASSIGNED":
            case 3:
                message.status = 3;
                break;
            case "DOWNLOADING":
            case 4:
                message.status = 4;
                break;
            case "CONVERTING":
            case 5:
                message.status = 5;
                break;
            case "UPLOADING":
            case 6:
                message.status = 6;
                break;
            case "SAVING":
            case 7:
                message.status = 7;
                break;
            case "DONE":
            case 8:
                message.status = 8;
                break;
            case "ERROR":
            case 9:
                message.status = 9;
                break;
            }
            if (object.unassigned != null)
                message.unassigned = Boolean(object.unassigned);
            if (object.assignedWorker != null)
                message.assignedWorker = String(object.assignedWorker);
            if (object.ok != null)
                message.ok = Boolean(object.ok);
            if (object.errorDetails != null)
                message.errorDetails = String(object.errorDetails);
            if (object.url != null)
                message.url = String(object.url);
            return message;
        };

        /**
         * Creates a plain object from a Job message. Also converts values to other types if specified.
         * @function toObject
         * @memberof audiohq.Job
         * @static
         * @param {audiohq.Job} message Job
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Job.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.arrays || options.defaults)
                object.modifications = [];
            if (options.defaults) {
                object.id = "";
                object.details = null;
                object.progress = 0;
                object.status = options.enums === String ? "GETTING_READY" : 1;
                object.url = "";
            }
            if (message.id != null && message.hasOwnProperty("id"))
                object.id = message.id;
            if (message.details != null && message.hasOwnProperty("details"))
                object.details = $root.audiohq.SingleMutate.toObject(message.details, options);
            if (message.modifications && message.modifications.length) {
                object.modifications = [];
                for (let j = 0; j < message.modifications.length; ++j)
                    object.modifications[j] = $root.audiohq.Modification.toObject(message.modifications[j], options);
            }
            if (message.progress != null && message.hasOwnProperty("progress"))
                object.progress = options.json && !isFinite(message.progress) ? String(message.progress) : message.progress;
            if (message.status != null && message.hasOwnProperty("status"))
                object.status = options.enums === String ? $root.audiohq.JobStatus[message.status] === undefined ? message.status : $root.audiohq.JobStatus[message.status] : message.status;
            if (message.unassigned != null && message.hasOwnProperty("unassigned")) {
                object.unassigned = message.unassigned;
                if (options.oneofs)
                    object.assignment = "unassigned";
            }
            if (message.assignedWorker != null && message.hasOwnProperty("assignedWorker")) {
                object.assignedWorker = message.assignedWorker;
                if (options.oneofs)
                    object.assignment = "assignedWorker";
            }
            if (message.ok != null && message.hasOwnProperty("ok")) {
                object.ok = message.ok;
                if (options.oneofs)
                    object.error = "ok";
            }
            if (message.errorDetails != null && message.hasOwnProperty("errorDetails")) {
                object.errorDetails = message.errorDetails;
                if (options.oneofs)
                    object.error = "errorDetails";
            }
            if (message.url != null && message.hasOwnProperty("url"))
                object.url = message.url;
            return object;
        };

        /**
         * Converts this Job to JSON.
         * @function toJSON
         * @memberof audiohq.Job
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Job.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for Job
         * @function getTypeUrl
         * @memberof audiohq.Job
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Job.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/audiohq.Job";
        };

        return Job;
    })();

    audiohq.Modification = (function() {

        /**
         * Properties of a Modification.
         * @memberof audiohq
         * @interface IModification
         * @property {audiohq.ICutModification|null} [cut] Modification cut
         * @property {audiohq.IFadeModification|null} [fade] Modification fade
         */

        /**
         * Constructs a new Modification.
         * @memberof audiohq
         * @classdesc Represents a Modification.
         * @implements IModification
         * @constructor
         * @param {audiohq.IModification=} [properties] Properties to set
         */
        function Modification(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Modification cut.
         * @member {audiohq.ICutModification|null|undefined} cut
         * @memberof audiohq.Modification
         * @instance
         */
        Modification.prototype.cut = null;

        /**
         * Modification fade.
         * @member {audiohq.IFadeModification|null|undefined} fade
         * @memberof audiohq.Modification
         * @instance
         */
        Modification.prototype.fade = null;

        // OneOf field names bound to virtual getters and setters
        let $oneOfFields;

        /**
         * Modification modification.
         * @member {"cut"|"fade"|undefined} modification
         * @memberof audiohq.Modification
         * @instance
         */
        Object.defineProperty(Modification.prototype, "modification", {
            get: $util.oneOfGetter($oneOfFields = ["cut", "fade"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Creates a new Modification instance using the specified properties.
         * @function create
         * @memberof audiohq.Modification
         * @static
         * @param {audiohq.IModification=} [properties] Properties to set
         * @returns {audiohq.Modification} Modification instance
         */
        Modification.create = function create(properties) {
            return new Modification(properties);
        };

        /**
         * Encodes the specified Modification message. Does not implicitly {@link audiohq.Modification.verify|verify} messages.
         * @function encode
         * @memberof audiohq.Modification
         * @static
         * @param {audiohq.IModification} message Modification message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Modification.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.cut != null && Object.hasOwnProperty.call(message, "cut"))
                $root.audiohq.CutModification.encode(message.cut, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.fade != null && Object.hasOwnProperty.call(message, "fade"))
                $root.audiohq.FadeModification.encode(message.fade, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified Modification message, length delimited. Does not implicitly {@link audiohq.Modification.verify|verify} messages.
         * @function encodeDelimited
         * @memberof audiohq.Modification
         * @static
         * @param {audiohq.IModification} message Modification message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Modification.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Modification message from the specified reader or buffer.
         * @function decode
         * @memberof audiohq.Modification
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {audiohq.Modification} Modification
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Modification.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.audiohq.Modification();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.cut = $root.audiohq.CutModification.decode(reader, reader.uint32());
                        break;
                    }
                case 2: {
                        message.fade = $root.audiohq.FadeModification.decode(reader, reader.uint32());
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Modification message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof audiohq.Modification
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {audiohq.Modification} Modification
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Modification.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Modification message.
         * @function verify
         * @memberof audiohq.Modification
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Modification.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            let properties = {};
            if (message.cut != null && message.hasOwnProperty("cut")) {
                properties.modification = 1;
                {
                    let error = $root.audiohq.CutModification.verify(message.cut);
                    if (error)
                        return "cut." + error;
                }
            }
            if (message.fade != null && message.hasOwnProperty("fade")) {
                if (properties.modification === 1)
                    return "modification: multiple values";
                properties.modification = 1;
                {
                    let error = $root.audiohq.FadeModification.verify(message.fade);
                    if (error)
                        return "fade." + error;
                }
            }
            return null;
        };

        /**
         * Creates a Modification message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof audiohq.Modification
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {audiohq.Modification} Modification
         */
        Modification.fromObject = function fromObject(object) {
            if (object instanceof $root.audiohq.Modification)
                return object;
            let message = new $root.audiohq.Modification();
            if (object.cut != null) {
                if (typeof object.cut !== "object")
                    throw TypeError(".audiohq.Modification.cut: object expected");
                message.cut = $root.audiohq.CutModification.fromObject(object.cut);
            }
            if (object.fade != null) {
                if (typeof object.fade !== "object")
                    throw TypeError(".audiohq.Modification.fade: object expected");
                message.fade = $root.audiohq.FadeModification.fromObject(object.fade);
            }
            return message;
        };

        /**
         * Creates a plain object from a Modification message. Also converts values to other types if specified.
         * @function toObject
         * @memberof audiohq.Modification
         * @static
         * @param {audiohq.Modification} message Modification
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Modification.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (message.cut != null && message.hasOwnProperty("cut")) {
                object.cut = $root.audiohq.CutModification.toObject(message.cut, options);
                if (options.oneofs)
                    object.modification = "cut";
            }
            if (message.fade != null && message.hasOwnProperty("fade")) {
                object.fade = $root.audiohq.FadeModification.toObject(message.fade, options);
                if (options.oneofs)
                    object.modification = "fade";
            }
            return object;
        };

        /**
         * Converts this Modification to JSON.
         * @function toJSON
         * @memberof audiohq.Modification
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Modification.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for Modification
         * @function getTypeUrl
         * @memberof audiohq.Modification
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Modification.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/audiohq.Modification";
        };

        return Modification;
    })();

    audiohq.CutModification = (function() {

        /**
         * Properties of a CutModification.
         * @memberof audiohq
         * @interface ICutModification
         * @property {number|null} [startSeconds] CutModification startSeconds
         * @property {number|null} [endSeconds] CutModification endSeconds
         */

        /**
         * Constructs a new CutModification.
         * @memberof audiohq
         * @classdesc Represents a CutModification.
         * @implements ICutModification
         * @constructor
         * @param {audiohq.ICutModification=} [properties] Properties to set
         */
        function CutModification(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * CutModification startSeconds.
         * @member {number} startSeconds
         * @memberof audiohq.CutModification
         * @instance
         */
        CutModification.prototype.startSeconds = 0;

        /**
         * CutModification endSeconds.
         * @member {number} endSeconds
         * @memberof audiohq.CutModification
         * @instance
         */
        CutModification.prototype.endSeconds = 0;

        /**
         * Creates a new CutModification instance using the specified properties.
         * @function create
         * @memberof audiohq.CutModification
         * @static
         * @param {audiohq.ICutModification=} [properties] Properties to set
         * @returns {audiohq.CutModification} CutModification instance
         */
        CutModification.create = function create(properties) {
            return new CutModification(properties);
        };

        /**
         * Encodes the specified CutModification message. Does not implicitly {@link audiohq.CutModification.verify|verify} messages.
         * @function encode
         * @memberof audiohq.CutModification
         * @static
         * @param {audiohq.ICutModification} message CutModification message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CutModification.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.startSeconds != null && Object.hasOwnProperty.call(message, "startSeconds"))
                writer.uint32(/* id 1, wireType 1 =*/9).double(message.startSeconds);
            if (message.endSeconds != null && Object.hasOwnProperty.call(message, "endSeconds"))
                writer.uint32(/* id 2, wireType 1 =*/17).double(message.endSeconds);
            return writer;
        };

        /**
         * Encodes the specified CutModification message, length delimited. Does not implicitly {@link audiohq.CutModification.verify|verify} messages.
         * @function encodeDelimited
         * @memberof audiohq.CutModification
         * @static
         * @param {audiohq.ICutModification} message CutModification message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CutModification.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a CutModification message from the specified reader or buffer.
         * @function decode
         * @memberof audiohq.CutModification
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {audiohq.CutModification} CutModification
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CutModification.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.audiohq.CutModification();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.startSeconds = reader.double();
                        break;
                    }
                case 2: {
                        message.endSeconds = reader.double();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a CutModification message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof audiohq.CutModification
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {audiohq.CutModification} CutModification
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CutModification.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a CutModification message.
         * @function verify
         * @memberof audiohq.CutModification
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        CutModification.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.startSeconds != null && message.hasOwnProperty("startSeconds"))
                if (typeof message.startSeconds !== "number")
                    return "startSeconds: number expected";
            if (message.endSeconds != null && message.hasOwnProperty("endSeconds"))
                if (typeof message.endSeconds !== "number")
                    return "endSeconds: number expected";
            return null;
        };

        /**
         * Creates a CutModification message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof audiohq.CutModification
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {audiohq.CutModification} CutModification
         */
        CutModification.fromObject = function fromObject(object) {
            if (object instanceof $root.audiohq.CutModification)
                return object;
            let message = new $root.audiohq.CutModification();
            if (object.startSeconds != null)
                message.startSeconds = Number(object.startSeconds);
            if (object.endSeconds != null)
                message.endSeconds = Number(object.endSeconds);
            return message;
        };

        /**
         * Creates a plain object from a CutModification message. Also converts values to other types if specified.
         * @function toObject
         * @memberof audiohq.CutModification
         * @static
         * @param {audiohq.CutModification} message CutModification
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        CutModification.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.startSeconds = 0;
                object.endSeconds = 0;
            }
            if (message.startSeconds != null && message.hasOwnProperty("startSeconds"))
                object.startSeconds = options.json && !isFinite(message.startSeconds) ? String(message.startSeconds) : message.startSeconds;
            if (message.endSeconds != null && message.hasOwnProperty("endSeconds"))
                object.endSeconds = options.json && !isFinite(message.endSeconds) ? String(message.endSeconds) : message.endSeconds;
            return object;
        };

        /**
         * Converts this CutModification to JSON.
         * @function toJSON
         * @memberof audiohq.CutModification
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        CutModification.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for CutModification
         * @function getTypeUrl
         * @memberof audiohq.CutModification
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        CutModification.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/audiohq.CutModification";
        };

        return CutModification;
    })();

    audiohq.FadeModification = (function() {

        /**
         * Properties of a FadeModification.
         * @memberof audiohq
         * @interface IFadeModification
         * @property {number|null} [inSeconds] FadeModification inSeconds
         * @property {number|null} [outSeconds] FadeModification outSeconds
         */

        /**
         * Constructs a new FadeModification.
         * @memberof audiohq
         * @classdesc Represents a FadeModification.
         * @implements IFadeModification
         * @constructor
         * @param {audiohq.IFadeModification=} [properties] Properties to set
         */
        function FadeModification(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * FadeModification inSeconds.
         * @member {number} inSeconds
         * @memberof audiohq.FadeModification
         * @instance
         */
        FadeModification.prototype.inSeconds = 0;

        /**
         * FadeModification outSeconds.
         * @member {number} outSeconds
         * @memberof audiohq.FadeModification
         * @instance
         */
        FadeModification.prototype.outSeconds = 0;

        /**
         * Creates a new FadeModification instance using the specified properties.
         * @function create
         * @memberof audiohq.FadeModification
         * @static
         * @param {audiohq.IFadeModification=} [properties] Properties to set
         * @returns {audiohq.FadeModification} FadeModification instance
         */
        FadeModification.create = function create(properties) {
            return new FadeModification(properties);
        };

        /**
         * Encodes the specified FadeModification message. Does not implicitly {@link audiohq.FadeModification.verify|verify} messages.
         * @function encode
         * @memberof audiohq.FadeModification
         * @static
         * @param {audiohq.IFadeModification} message FadeModification message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        FadeModification.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.inSeconds != null && Object.hasOwnProperty.call(message, "inSeconds"))
                writer.uint32(/* id 1, wireType 1 =*/9).double(message.inSeconds);
            if (message.outSeconds != null && Object.hasOwnProperty.call(message, "outSeconds"))
                writer.uint32(/* id 2, wireType 1 =*/17).double(message.outSeconds);
            return writer;
        };

        /**
         * Encodes the specified FadeModification message, length delimited. Does not implicitly {@link audiohq.FadeModification.verify|verify} messages.
         * @function encodeDelimited
         * @memberof audiohq.FadeModification
         * @static
         * @param {audiohq.IFadeModification} message FadeModification message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        FadeModification.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a FadeModification message from the specified reader or buffer.
         * @function decode
         * @memberof audiohq.FadeModification
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {audiohq.FadeModification} FadeModification
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        FadeModification.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.audiohq.FadeModification();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.inSeconds = reader.double();
                        break;
                    }
                case 2: {
                        message.outSeconds = reader.double();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a FadeModification message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof audiohq.FadeModification
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {audiohq.FadeModification} FadeModification
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        FadeModification.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a FadeModification message.
         * @function verify
         * @memberof audiohq.FadeModification
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        FadeModification.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.inSeconds != null && message.hasOwnProperty("inSeconds"))
                if (typeof message.inSeconds !== "number")
                    return "inSeconds: number expected";
            if (message.outSeconds != null && message.hasOwnProperty("outSeconds"))
                if (typeof message.outSeconds !== "number")
                    return "outSeconds: number expected";
            return null;
        };

        /**
         * Creates a FadeModification message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof audiohq.FadeModification
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {audiohq.FadeModification} FadeModification
         */
        FadeModification.fromObject = function fromObject(object) {
            if (object instanceof $root.audiohq.FadeModification)
                return object;
            let message = new $root.audiohq.FadeModification();
            if (object.inSeconds != null)
                message.inSeconds = Number(object.inSeconds);
            if (object.outSeconds != null)
                message.outSeconds = Number(object.outSeconds);
            return message;
        };

        /**
         * Creates a plain object from a FadeModification message. Also converts values to other types if specified.
         * @function toObject
         * @memberof audiohq.FadeModification
         * @static
         * @param {audiohq.FadeModification} message FadeModification
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        FadeModification.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.inSeconds = 0;
                object.outSeconds = 0;
            }
            if (message.inSeconds != null && message.hasOwnProperty("inSeconds"))
                object.inSeconds = options.json && !isFinite(message.inSeconds) ? String(message.inSeconds) : message.inSeconds;
            if (message.outSeconds != null && message.hasOwnProperty("outSeconds"))
                object.outSeconds = options.json && !isFinite(message.outSeconds) ? String(message.outSeconds) : message.outSeconds;
            return object;
        };

        /**
         * Converts this FadeModification to JSON.
         * @function toJSON
         * @memberof audiohq.FadeModification
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        FadeModification.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for FadeModification
         * @function getTypeUrl
         * @memberof audiohq.FadeModification
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        FadeModification.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/audiohq.FadeModification";
        };

        return FadeModification;
    })();

    audiohq.JobCreate = (function() {

        /**
         * Properties of a JobCreate.
         * @memberof audiohq
         * @interface IJobCreate
         * @property {audiohq.ISingleMutate|null} [details] JobCreate details
         * @property {Array.<audiohq.IModification>|null} [modifications] JobCreate modifications
         * @property {string|null} [url] JobCreate url
         */

        /**
         * Constructs a new JobCreate.
         * @memberof audiohq
         * @classdesc Represents a JobCreate.
         * @implements IJobCreate
         * @constructor
         * @param {audiohq.IJobCreate=} [properties] Properties to set
         */
        function JobCreate(properties) {
            this.modifications = [];
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * JobCreate details.
         * @member {audiohq.ISingleMutate|null|undefined} details
         * @memberof audiohq.JobCreate
         * @instance
         */
        JobCreate.prototype.details = null;

        /**
         * JobCreate modifications.
         * @member {Array.<audiohq.IModification>} modifications
         * @memberof audiohq.JobCreate
         * @instance
         */
        JobCreate.prototype.modifications = $util.emptyArray;

        /**
         * JobCreate url.
         * @member {string} url
         * @memberof audiohq.JobCreate
         * @instance
         */
        JobCreate.prototype.url = "";

        /**
         * Creates a new JobCreate instance using the specified properties.
         * @function create
         * @memberof audiohq.JobCreate
         * @static
         * @param {audiohq.IJobCreate=} [properties] Properties to set
         * @returns {audiohq.JobCreate} JobCreate instance
         */
        JobCreate.create = function create(properties) {
            return new JobCreate(properties);
        };

        /**
         * Encodes the specified JobCreate message. Does not implicitly {@link audiohq.JobCreate.verify|verify} messages.
         * @function encode
         * @memberof audiohq.JobCreate
         * @static
         * @param {audiohq.IJobCreate} message JobCreate message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        JobCreate.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.details != null && Object.hasOwnProperty.call(message, "details"))
                $root.audiohq.SingleMutate.encode(message.details, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.modifications != null && message.modifications.length)
                for (let i = 0; i < message.modifications.length; ++i)
                    $root.audiohq.Modification.encode(message.modifications[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.url != null && Object.hasOwnProperty.call(message, "url"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.url);
            return writer;
        };

        /**
         * Encodes the specified JobCreate message, length delimited. Does not implicitly {@link audiohq.JobCreate.verify|verify} messages.
         * @function encodeDelimited
         * @memberof audiohq.JobCreate
         * @static
         * @param {audiohq.IJobCreate} message JobCreate message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        JobCreate.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a JobCreate message from the specified reader or buffer.
         * @function decode
         * @memberof audiohq.JobCreate
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {audiohq.JobCreate} JobCreate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        JobCreate.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.audiohq.JobCreate();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.details = $root.audiohq.SingleMutate.decode(reader, reader.uint32());
                        break;
                    }
                case 2: {
                        if (!(message.modifications && message.modifications.length))
                            message.modifications = [];
                        message.modifications.push($root.audiohq.Modification.decode(reader, reader.uint32()));
                        break;
                    }
                case 3: {
                        message.url = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a JobCreate message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof audiohq.JobCreate
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {audiohq.JobCreate} JobCreate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        JobCreate.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a JobCreate message.
         * @function verify
         * @memberof audiohq.JobCreate
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        JobCreate.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.details != null && message.hasOwnProperty("details")) {
                let error = $root.audiohq.SingleMutate.verify(message.details);
                if (error)
                    return "details." + error;
            }
            if (message.modifications != null && message.hasOwnProperty("modifications")) {
                if (!Array.isArray(message.modifications))
                    return "modifications: array expected";
                for (let i = 0; i < message.modifications.length; ++i) {
                    let error = $root.audiohq.Modification.verify(message.modifications[i]);
                    if (error)
                        return "modifications." + error;
                }
            }
            if (message.url != null && message.hasOwnProperty("url"))
                if (!$util.isString(message.url))
                    return "url: string expected";
            return null;
        };

        /**
         * Creates a JobCreate message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof audiohq.JobCreate
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {audiohq.JobCreate} JobCreate
         */
        JobCreate.fromObject = function fromObject(object) {
            if (object instanceof $root.audiohq.JobCreate)
                return object;
            let message = new $root.audiohq.JobCreate();
            if (object.details != null) {
                if (typeof object.details !== "object")
                    throw TypeError(".audiohq.JobCreate.details: object expected");
                message.details = $root.audiohq.SingleMutate.fromObject(object.details);
            }
            if (object.modifications) {
                if (!Array.isArray(object.modifications))
                    throw TypeError(".audiohq.JobCreate.modifications: array expected");
                message.modifications = [];
                for (let i = 0; i < object.modifications.length; ++i) {
                    if (typeof object.modifications[i] !== "object")
                        throw TypeError(".audiohq.JobCreate.modifications: object expected");
                    message.modifications[i] = $root.audiohq.Modification.fromObject(object.modifications[i]);
                }
            }
            if (object.url != null)
                message.url = String(object.url);
            return message;
        };

        /**
         * Creates a plain object from a JobCreate message. Also converts values to other types if specified.
         * @function toObject
         * @memberof audiohq.JobCreate
         * @static
         * @param {audiohq.JobCreate} message JobCreate
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        JobCreate.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.arrays || options.defaults)
                object.modifications = [];
            if (options.defaults) {
                object.details = null;
                object.url = "";
            }
            if (message.details != null && message.hasOwnProperty("details"))
                object.details = $root.audiohq.SingleMutate.toObject(message.details, options);
            if (message.modifications && message.modifications.length) {
                object.modifications = [];
                for (let j = 0; j < message.modifications.length; ++j)
                    object.modifications[j] = $root.audiohq.Modification.toObject(message.modifications[j], options);
            }
            if (message.url != null && message.hasOwnProperty("url"))
                object.url = message.url;
            return object;
        };

        /**
         * Converts this JobCreate to JSON.
         * @function toJSON
         * @memberof audiohq.JobCreate
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        JobCreate.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for JobCreate
         * @function getTypeUrl
         * @memberof audiohq.JobCreate
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        JobCreate.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/audiohq.JobCreate";
        };

        return JobCreate;
    })();

    audiohq.ListJobsResponse = (function() {

        /**
         * Properties of a ListJobsResponse.
         * @memberof audiohq
         * @interface IListJobsResponse
         * @property {Array.<audiohq.IJob>|null} [results] ListJobsResponse results
         */

        /**
         * Constructs a new ListJobsResponse.
         * @memberof audiohq
         * @classdesc Represents a ListJobsResponse.
         * @implements IListJobsResponse
         * @constructor
         * @param {audiohq.IListJobsResponse=} [properties] Properties to set
         */
        function ListJobsResponse(properties) {
            this.results = [];
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ListJobsResponse results.
         * @member {Array.<audiohq.IJob>} results
         * @memberof audiohq.ListJobsResponse
         * @instance
         */
        ListJobsResponse.prototype.results = $util.emptyArray;

        /**
         * Creates a new ListJobsResponse instance using the specified properties.
         * @function create
         * @memberof audiohq.ListJobsResponse
         * @static
         * @param {audiohq.IListJobsResponse=} [properties] Properties to set
         * @returns {audiohq.ListJobsResponse} ListJobsResponse instance
         */
        ListJobsResponse.create = function create(properties) {
            return new ListJobsResponse(properties);
        };

        /**
         * Encodes the specified ListJobsResponse message. Does not implicitly {@link audiohq.ListJobsResponse.verify|verify} messages.
         * @function encode
         * @memberof audiohq.ListJobsResponse
         * @static
         * @param {audiohq.IListJobsResponse} message ListJobsResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ListJobsResponse.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.results != null && message.results.length)
                for (let i = 0; i < message.results.length; ++i)
                    $root.audiohq.Job.encode(message.results[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified ListJobsResponse message, length delimited. Does not implicitly {@link audiohq.ListJobsResponse.verify|verify} messages.
         * @function encodeDelimited
         * @memberof audiohq.ListJobsResponse
         * @static
         * @param {audiohq.IListJobsResponse} message ListJobsResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ListJobsResponse.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ListJobsResponse message from the specified reader or buffer.
         * @function decode
         * @memberof audiohq.ListJobsResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {audiohq.ListJobsResponse} ListJobsResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ListJobsResponse.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.audiohq.ListJobsResponse();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        if (!(message.results && message.results.length))
                            message.results = [];
                        message.results.push($root.audiohq.Job.decode(reader, reader.uint32()));
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a ListJobsResponse message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof audiohq.ListJobsResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {audiohq.ListJobsResponse} ListJobsResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ListJobsResponse.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ListJobsResponse message.
         * @function verify
         * @memberof audiohq.ListJobsResponse
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ListJobsResponse.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.results != null && message.hasOwnProperty("results")) {
                if (!Array.isArray(message.results))
                    return "results: array expected";
                for (let i = 0; i < message.results.length; ++i) {
                    let error = $root.audiohq.Job.verify(message.results[i]);
                    if (error)
                        return "results." + error;
                }
            }
            return null;
        };

        /**
         * Creates a ListJobsResponse message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof audiohq.ListJobsResponse
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {audiohq.ListJobsResponse} ListJobsResponse
         */
        ListJobsResponse.fromObject = function fromObject(object) {
            if (object instanceof $root.audiohq.ListJobsResponse)
                return object;
            let message = new $root.audiohq.ListJobsResponse();
            if (object.results) {
                if (!Array.isArray(object.results))
                    throw TypeError(".audiohq.ListJobsResponse.results: array expected");
                message.results = [];
                for (let i = 0; i < object.results.length; ++i) {
                    if (typeof object.results[i] !== "object")
                        throw TypeError(".audiohq.ListJobsResponse.results: object expected");
                    message.results[i] = $root.audiohq.Job.fromObject(object.results[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a ListJobsResponse message. Also converts values to other types if specified.
         * @function toObject
         * @memberof audiohq.ListJobsResponse
         * @static
         * @param {audiohq.ListJobsResponse} message ListJobsResponse
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ListJobsResponse.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.arrays || options.defaults)
                object.results = [];
            if (message.results && message.results.length) {
                object.results = [];
                for (let j = 0; j < message.results.length; ++j)
                    object.results[j] = $root.audiohq.Job.toObject(message.results[j], options);
            }
            return object;
        };

        /**
         * Converts this ListJobsResponse to JSON.
         * @function toJSON
         * @memberof audiohq.ListJobsResponse
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ListJobsResponse.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for ListJobsResponse
         * @function getTypeUrl
         * @memberof audiohq.ListJobsResponse
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        ListJobsResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/audiohq.ListJobsResponse";
        };

        return ListJobsResponse;
    })();

    audiohq.Workspace = (function() {

        /**
         * Properties of a Workspace.
         * @memberof audiohq
         * @interface IWorkspace
         * @property {string|null} [id] Workspace id
         * @property {string|null} [name] Workspace name
         * @property {number|null} [createdAt] Workspace createdAt
         * @property {number|null} [updatedAt] Workspace updatedAt
         */

        /**
         * Constructs a new Workspace.
         * @memberof audiohq
         * @classdesc Represents a Workspace.
         * @implements IWorkspace
         * @constructor
         * @param {audiohq.IWorkspace=} [properties] Properties to set
         */
        function Workspace(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Workspace id.
         * @member {string} id
         * @memberof audiohq.Workspace
         * @instance
         */
        Workspace.prototype.id = "";

        /**
         * Workspace name.
         * @member {string} name
         * @memberof audiohq.Workspace
         * @instance
         */
        Workspace.prototype.name = "";

        /**
         * Workspace createdAt.
         * @member {number} createdAt
         * @memberof audiohq.Workspace
         * @instance
         */
        Workspace.prototype.createdAt = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        /**
         * Workspace updatedAt.
         * @member {number} updatedAt
         * @memberof audiohq.Workspace
         * @instance
         */
        Workspace.prototype.updatedAt = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        /**
         * Creates a new Workspace instance using the specified properties.
         * @function create
         * @memberof audiohq.Workspace
         * @static
         * @param {audiohq.IWorkspace=} [properties] Properties to set
         * @returns {audiohq.Workspace} Workspace instance
         */
        Workspace.create = function create(properties) {
            return new Workspace(properties);
        };

        /**
         * Encodes the specified Workspace message. Does not implicitly {@link audiohq.Workspace.verify|verify} messages.
         * @function encode
         * @memberof audiohq.Workspace
         * @static
         * @param {audiohq.IWorkspace} message Workspace message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Workspace.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.name);
            if (message.createdAt != null && Object.hasOwnProperty.call(message, "createdAt"))
                writer.uint32(/* id 3, wireType 0 =*/24).uint64(message.createdAt);
            if (message.updatedAt != null && Object.hasOwnProperty.call(message, "updatedAt"))
                writer.uint32(/* id 4, wireType 0 =*/32).uint64(message.updatedAt);
            return writer;
        };

        /**
         * Encodes the specified Workspace message, length delimited. Does not implicitly {@link audiohq.Workspace.verify|verify} messages.
         * @function encodeDelimited
         * @memberof audiohq.Workspace
         * @static
         * @param {audiohq.IWorkspace} message Workspace message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Workspace.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Workspace message from the specified reader or buffer.
         * @function decode
         * @memberof audiohq.Workspace
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {audiohq.Workspace} Workspace
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Workspace.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.audiohq.Workspace();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.id = reader.string();
                        break;
                    }
                case 2: {
                        message.name = reader.string();
                        break;
                    }
                case 3: {
                        message.createdAt = reader.uint64();
                        break;
                    }
                case 4: {
                        message.updatedAt = reader.uint64();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Workspace message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof audiohq.Workspace
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {audiohq.Workspace} Workspace
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Workspace.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Workspace message.
         * @function verify
         * @memberof audiohq.Workspace
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Workspace.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.id != null && message.hasOwnProperty("id"))
                if (!$util.isString(message.id))
                    return "id: string expected";
            if (message.name != null && message.hasOwnProperty("name"))
                if (!$util.isString(message.name))
                    return "name: string expected";
            if (message.createdAt != null && message.hasOwnProperty("createdAt"))
                if (!$util.isInteger(message.createdAt) && !(message.createdAt && $util.isInteger(message.createdAt.low) && $util.isInteger(message.createdAt.high)))
                    return "createdAt: integer|Long expected";
            if (message.updatedAt != null && message.hasOwnProperty("updatedAt"))
                if (!$util.isInteger(message.updatedAt) && !(message.updatedAt && $util.isInteger(message.updatedAt.low) && $util.isInteger(message.updatedAt.high)))
                    return "updatedAt: integer|Long expected";
            return null;
        };

        /**
         * Creates a Workspace message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof audiohq.Workspace
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {audiohq.Workspace} Workspace
         */
        Workspace.fromObject = function fromObject(object) {
            if (object instanceof $root.audiohq.Workspace)
                return object;
            let message = new $root.audiohq.Workspace();
            if (object.id != null)
                message.id = String(object.id);
            if (object.name != null)
                message.name = String(object.name);
            if (object.createdAt != null)
                if ($util.Long)
                    (message.createdAt = $util.Long.fromValue(object.createdAt)).unsigned = true;
                else if (typeof object.createdAt === "string")
                    message.createdAt = parseInt(object.createdAt, 10);
                else if (typeof object.createdAt === "number")
                    message.createdAt = object.createdAt;
                else if (typeof object.createdAt === "object")
                    message.createdAt = new $util.LongBits(object.createdAt.low >>> 0, object.createdAt.high >>> 0).toNumber(true);
            if (object.updatedAt != null)
                if ($util.Long)
                    (message.updatedAt = $util.Long.fromValue(object.updatedAt)).unsigned = true;
                else if (typeof object.updatedAt === "string")
                    message.updatedAt = parseInt(object.updatedAt, 10);
                else if (typeof object.updatedAt === "number")
                    message.updatedAt = object.updatedAt;
                else if (typeof object.updatedAt === "object")
                    message.updatedAt = new $util.LongBits(object.updatedAt.low >>> 0, object.updatedAt.high >>> 0).toNumber(true);
            return message;
        };

        /**
         * Creates a plain object from a Workspace message. Also converts values to other types if specified.
         * @function toObject
         * @memberof audiohq.Workspace
         * @static
         * @param {audiohq.Workspace} message Workspace
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Workspace.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.id = "";
                object.name = "";
                if ($util.Long) {
                    let long = new $util.Long(0, 0, true);
                    object.createdAt = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.createdAt = options.longs === String ? "0" : 0;
                if ($util.Long) {
                    let long = new $util.Long(0, 0, true);
                    object.updatedAt = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.updatedAt = options.longs === String ? "0" : 0;
            }
            if (message.id != null && message.hasOwnProperty("id"))
                object.id = message.id;
            if (message.name != null && message.hasOwnProperty("name"))
                object.name = message.name;
            if (message.createdAt != null && message.hasOwnProperty("createdAt"))
                if (typeof message.createdAt === "number")
                    object.createdAt = options.longs === String ? String(message.createdAt) : message.createdAt;
                else
                    object.createdAt = options.longs === String ? $util.Long.prototype.toString.call(message.createdAt) : options.longs === Number ? new $util.LongBits(message.createdAt.low >>> 0, message.createdAt.high >>> 0).toNumber(true) : message.createdAt;
            if (message.updatedAt != null && message.hasOwnProperty("updatedAt"))
                if (typeof message.updatedAt === "number")
                    object.updatedAt = options.longs === String ? String(message.updatedAt) : message.updatedAt;
                else
                    object.updatedAt = options.longs === String ? $util.Long.prototype.toString.call(message.updatedAt) : options.longs === Number ? new $util.LongBits(message.updatedAt.low >>> 0, message.updatedAt.high >>> 0).toNumber(true) : message.updatedAt;
            return object;
        };

        /**
         * Converts this Workspace to JSON.
         * @function toJSON
         * @memberof audiohq.Workspace
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Workspace.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for Workspace
         * @function getTypeUrl
         * @memberof audiohq.Workspace
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Workspace.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/audiohq.Workspace";
        };

        return Workspace;
    })();

    audiohq.WorkspaceMutate = (function() {

        /**
         * Properties of a WorkspaceMutate.
         * @memberof audiohq
         * @interface IWorkspaceMutate
         * @property {string|null} [name] WorkspaceMutate name
         */

        /**
         * Constructs a new WorkspaceMutate.
         * @memberof audiohq
         * @classdesc Represents a WorkspaceMutate.
         * @implements IWorkspaceMutate
         * @constructor
         * @param {audiohq.IWorkspaceMutate=} [properties] Properties to set
         */
        function WorkspaceMutate(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * WorkspaceMutate name.
         * @member {string} name
         * @memberof audiohq.WorkspaceMutate
         * @instance
         */
        WorkspaceMutate.prototype.name = "";

        /**
         * Creates a new WorkspaceMutate instance using the specified properties.
         * @function create
         * @memberof audiohq.WorkspaceMutate
         * @static
         * @param {audiohq.IWorkspaceMutate=} [properties] Properties to set
         * @returns {audiohq.WorkspaceMutate} WorkspaceMutate instance
         */
        WorkspaceMutate.create = function create(properties) {
            return new WorkspaceMutate(properties);
        };

        /**
         * Encodes the specified WorkspaceMutate message. Does not implicitly {@link audiohq.WorkspaceMutate.verify|verify} messages.
         * @function encode
         * @memberof audiohq.WorkspaceMutate
         * @static
         * @param {audiohq.IWorkspaceMutate} message WorkspaceMutate message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        WorkspaceMutate.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
            return writer;
        };

        /**
         * Encodes the specified WorkspaceMutate message, length delimited. Does not implicitly {@link audiohq.WorkspaceMutate.verify|verify} messages.
         * @function encodeDelimited
         * @memberof audiohq.WorkspaceMutate
         * @static
         * @param {audiohq.IWorkspaceMutate} message WorkspaceMutate message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        WorkspaceMutate.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a WorkspaceMutate message from the specified reader or buffer.
         * @function decode
         * @memberof audiohq.WorkspaceMutate
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {audiohq.WorkspaceMutate} WorkspaceMutate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        WorkspaceMutate.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.audiohq.WorkspaceMutate();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.name = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a WorkspaceMutate message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof audiohq.WorkspaceMutate
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {audiohq.WorkspaceMutate} WorkspaceMutate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        WorkspaceMutate.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a WorkspaceMutate message.
         * @function verify
         * @memberof audiohq.WorkspaceMutate
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        WorkspaceMutate.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.name != null && message.hasOwnProperty("name"))
                if (!$util.isString(message.name))
                    return "name: string expected";
            return null;
        };

        /**
         * Creates a WorkspaceMutate message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof audiohq.WorkspaceMutate
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {audiohq.WorkspaceMutate} WorkspaceMutate
         */
        WorkspaceMutate.fromObject = function fromObject(object) {
            if (object instanceof $root.audiohq.WorkspaceMutate)
                return object;
            let message = new $root.audiohq.WorkspaceMutate();
            if (object.name != null)
                message.name = String(object.name);
            return message;
        };

        /**
         * Creates a plain object from a WorkspaceMutate message. Also converts values to other types if specified.
         * @function toObject
         * @memberof audiohq.WorkspaceMutate
         * @static
         * @param {audiohq.WorkspaceMutate} message WorkspaceMutate
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        WorkspaceMutate.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults)
                object.name = "";
            if (message.name != null && message.hasOwnProperty("name"))
                object.name = message.name;
            return object;
        };

        /**
         * Converts this WorkspaceMutate to JSON.
         * @function toJSON
         * @memberof audiohq.WorkspaceMutate
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        WorkspaceMutate.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for WorkspaceMutate
         * @function getTypeUrl
         * @memberof audiohq.WorkspaceMutate
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        WorkspaceMutate.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/audiohq.WorkspaceMutate";
        };

        return WorkspaceMutate;
    })();

    audiohq.WorkspaceSearchResponse = (function() {

        /**
         * Properties of a WorkspaceSearchResponse.
         * @memberof audiohq
         * @interface IWorkspaceSearchResponse
         * @property {Array.<audiohq.IWorkspace>|null} [results] WorkspaceSearchResponse results
         */

        /**
         * Constructs a new WorkspaceSearchResponse.
         * @memberof audiohq
         * @classdesc Represents a WorkspaceSearchResponse.
         * @implements IWorkspaceSearchResponse
         * @constructor
         * @param {audiohq.IWorkspaceSearchResponse=} [properties] Properties to set
         */
        function WorkspaceSearchResponse(properties) {
            this.results = [];
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * WorkspaceSearchResponse results.
         * @member {Array.<audiohq.IWorkspace>} results
         * @memberof audiohq.WorkspaceSearchResponse
         * @instance
         */
        WorkspaceSearchResponse.prototype.results = $util.emptyArray;

        /**
         * Creates a new WorkspaceSearchResponse instance using the specified properties.
         * @function create
         * @memberof audiohq.WorkspaceSearchResponse
         * @static
         * @param {audiohq.IWorkspaceSearchResponse=} [properties] Properties to set
         * @returns {audiohq.WorkspaceSearchResponse} WorkspaceSearchResponse instance
         */
        WorkspaceSearchResponse.create = function create(properties) {
            return new WorkspaceSearchResponse(properties);
        };

        /**
         * Encodes the specified WorkspaceSearchResponse message. Does not implicitly {@link audiohq.WorkspaceSearchResponse.verify|verify} messages.
         * @function encode
         * @memberof audiohq.WorkspaceSearchResponse
         * @static
         * @param {audiohq.IWorkspaceSearchResponse} message WorkspaceSearchResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        WorkspaceSearchResponse.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.results != null && message.results.length)
                for (let i = 0; i < message.results.length; ++i)
                    $root.audiohq.Workspace.encode(message.results[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified WorkspaceSearchResponse message, length delimited. Does not implicitly {@link audiohq.WorkspaceSearchResponse.verify|verify} messages.
         * @function encodeDelimited
         * @memberof audiohq.WorkspaceSearchResponse
         * @static
         * @param {audiohq.IWorkspaceSearchResponse} message WorkspaceSearchResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        WorkspaceSearchResponse.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a WorkspaceSearchResponse message from the specified reader or buffer.
         * @function decode
         * @memberof audiohq.WorkspaceSearchResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {audiohq.WorkspaceSearchResponse} WorkspaceSearchResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        WorkspaceSearchResponse.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.audiohq.WorkspaceSearchResponse();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        if (!(message.results && message.results.length))
                            message.results = [];
                        message.results.push($root.audiohq.Workspace.decode(reader, reader.uint32()));
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a WorkspaceSearchResponse message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof audiohq.WorkspaceSearchResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {audiohq.WorkspaceSearchResponse} WorkspaceSearchResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        WorkspaceSearchResponse.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a WorkspaceSearchResponse message.
         * @function verify
         * @memberof audiohq.WorkspaceSearchResponse
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        WorkspaceSearchResponse.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.results != null && message.hasOwnProperty("results")) {
                if (!Array.isArray(message.results))
                    return "results: array expected";
                for (let i = 0; i < message.results.length; ++i) {
                    let error = $root.audiohq.Workspace.verify(message.results[i]);
                    if (error)
                        return "results." + error;
                }
            }
            return null;
        };

        /**
         * Creates a WorkspaceSearchResponse message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof audiohq.WorkspaceSearchResponse
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {audiohq.WorkspaceSearchResponse} WorkspaceSearchResponse
         */
        WorkspaceSearchResponse.fromObject = function fromObject(object) {
            if (object instanceof $root.audiohq.WorkspaceSearchResponse)
                return object;
            let message = new $root.audiohq.WorkspaceSearchResponse();
            if (object.results) {
                if (!Array.isArray(object.results))
                    throw TypeError(".audiohq.WorkspaceSearchResponse.results: array expected");
                message.results = [];
                for (let i = 0; i < object.results.length; ++i) {
                    if (typeof object.results[i] !== "object")
                        throw TypeError(".audiohq.WorkspaceSearchResponse.results: object expected");
                    message.results[i] = $root.audiohq.Workspace.fromObject(object.results[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a WorkspaceSearchResponse message. Also converts values to other types if specified.
         * @function toObject
         * @memberof audiohq.WorkspaceSearchResponse
         * @static
         * @param {audiohq.WorkspaceSearchResponse} message WorkspaceSearchResponse
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        WorkspaceSearchResponse.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.arrays || options.defaults)
                object.results = [];
            if (message.results && message.results.length) {
                object.results = [];
                for (let j = 0; j < message.results.length; ++j)
                    object.results[j] = $root.audiohq.Workspace.toObject(message.results[j], options);
            }
            return object;
        };

        /**
         * Converts this WorkspaceSearchResponse to JSON.
         * @function toJSON
         * @memberof audiohq.WorkspaceSearchResponse
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        WorkspaceSearchResponse.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for WorkspaceSearchResponse
         * @function getTypeUrl
         * @memberof audiohq.WorkspaceSearchResponse
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        WorkspaceSearchResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/audiohq.WorkspaceSearchResponse";
        };

        return WorkspaceSearchResponse;
    })();

    return audiohq;
})();

export { $root as default };
