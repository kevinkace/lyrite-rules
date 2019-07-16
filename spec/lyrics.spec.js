const { setup, teardown } = require('./helpers');
const { assertFails, assertSucceeds } = require('@firebase/testing');

describe('Lyric rules', () => {
    let db, ref;

    beforeAll(async () => {
        db = await setup();

        ref = db.collection('songs'); // ???
    });

    afterAll(async () => {
        await teardown();
    });

    test('can load all lyrics', async () => {
        await expect(ref.get()).toAllow();
    });
});
