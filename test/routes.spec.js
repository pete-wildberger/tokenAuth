process.env.NODE_ENV = 'test';

const chai = require('chai'),
  should = chai.should(),
  expect = chai.expect,
  config = require('../config.js'),
  chaiHttp = require('chai-http'),
  server = require('../server'),
  chaiJWT = require('chai-jwt');

chai.use(chaiJWT);
chai.use(chaiHttp);

const validJWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbiI6dHJ1ZSwiaWF0IjoxNTEzMTAxNzM2LCJleHAiOjE1MTMxMDIzMzZ9.89XaTfNFI75blxeFxYfo-xQAWJvKv4DVgiGtwapnz_U';
const invalidJWT = 'eyJ0eXAiOiJK22V1QiLCJhbGciOiJIUzI1NiJ9..1b4RC22Kpx4X4GWXU-Wgsk4IbeRGVD7tNW-tM-LzkVE';

expect(validJWT).to.be.a.jwt; // Doesn't fail
expect(invalidJWT).to.be.a.jwt; // fails

expect(validJWT).to.be.a.jwt.and.eql({
  admin: true
});
expect(validJWT).to.be.signedWith(config.secret);

describe('GET /api/users', function() {
  it('should return all users', function(done) {
    chai
      .request(server)
      .get('/api/users')
      .end(function(err, res) {
        res.should.have.status(200);
        res.should.be.json; // jshint ignore:line
        res.body.should.have.property('name');
        res.body.name.should.equal('Peter');
        res.body.should.have.property('password');
        done();
      });
  });
});
