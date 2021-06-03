const request = require('supertest');
const app = require('./app');

describe('test', function () {
    let server = null;

    beforeEach((done) => {
        server = app.listen(0, (err) => {
            if (err) return done(err);
            done();
        });
    });

    afterEach(() => {
        server.close();
    });

    it('Status code should be 200', function(done) {
        request(app)
        .get('/')
        .expect(200, done);
    })
});
