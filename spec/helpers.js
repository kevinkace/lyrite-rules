const fs = require('fs');
const { promisify } = require('util');

const readFile = promisify(fs.readFile);

const firebase = require('@firebase/testing');

module.exports.setup = async (auth, data) => {
    const projectId = `rules-spec-${Date.now()}`;
    const rules     = await readFile('./firestore.rules');
    const app       = await firebase.initializeTestApp({
            projectId,
            auth
        });
    const db = app.firestore();

    if (data) {
        for (const key in data) {
            const ref = db.doc(key);
            await ref.set(data[key]);
        }
    }

    await firebase.loadFirestoreRules({
        projectId,
        rules
    });

    return db;
};

module.exports.teardown = async () => {
    Promise.all(firebase.apps().map(app => app.delete()));
};

expect.extend({
    async toAllow(x) {
        let pass = false;

        try {
            await firebase.assertSucceeds(x);
            pass = true;
        } catch (err) {}

        return {
            pass,
            message : () => 'Only shown if fails'
        };
    }
});

expect.extend({
    async toDeny(x) {
        let pass = false;

        try {
            await firebase.assertFails(x);
            pass = true;
        } catch (err) {}

        return {
            pass,
            message : () => 'only when fail'
        };
    }
});
