import { ObjectId } from 'mongodb';

export function asString(oid: ObjectId) {
    return oid.toString('base64').replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '!');
}

export function asObjectId(s: string) {
    return ObjectId.createFromBase64(s.replaceAll('-', '+').replaceAll('_', '/').replaceAll('!', '='));
}
