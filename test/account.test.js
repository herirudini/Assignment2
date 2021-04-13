// const assert = require('chai').assert;
// const expect = require('chai').expect;
// const should = require('chai').should();
// const foo = “bar”;
// assert.typeOf(foo, 'string');
// assert.equal(foo, 'bar');
// expect(foo).to.be.a('string');
// expect(foo).to.equal('bar');
// foo.should.be.a('string');
// foo.should.equal('bar');
//
// const User = require("../models/User.js");
// const app = require("../app.js");
// const bcrypt =  require('bcrypt');
//
// describe('accountController', ()=> {
//   const userA = {
//     username: "tester",
//     email: "tester@mail.com",
//     password: bcrypt.hashSync("1234",8)
//   };
//   it('signup', (done)=> {
//     app.post('/signup').send(userA).expect(201);
//   });
// })
// const UserA = {
//   username: "ridhi",
//   email: "ridhi@gmail.com",
//   password: bcrypt.hashSync("ridhi", 8),
// };
// let token;
// beforeEach(async () => {
//   await User.deleteMany();
//   await User.create(UserA);
//   await User.deleteMany();
//   token = jwt.sign({ id: UserA.id }, process.env.DB_USER);
// });


const app = require('../APIs/app.js');
const req = require('supertest')
const accountController = require('../APIs/controllers/account-controller.js')
const mongoose = require('mongoose');
const userId = new mongoose.Types.ObjectId();

test("Signup should create new user", async function testSignup(done) {
  let tryFind;
  try {
    req(app)
    .post('/signup')
    .send({
      new_email: "herirudini@gmail.com",
      new_username: "herirudini",
      new_password: "1234"
    })
    .expect(201);
    tryFind = await User.findOne({username: 'herirudini'})
    //Assert that the db was changed correctly ->
    expect(tryFind).not.toBeNull();
    //Assert about the response
    expect(res.body).toMatchObject({
      data: {
        username: "herirudini",
        email: "herirudini@gmail.com",
      },
    });
    expect(User.password).toBe(bcrypt.hashSync("1234",8));
  }
  finally{
    done()
  }
})
