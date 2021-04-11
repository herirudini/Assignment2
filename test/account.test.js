const req = require("supertest");
const app = require("../app.js");
const User = require("../models/User.js");
const accountController = require('../controllers/account-controller.js')
const auth = require("../middlewares/authJwt");
const bcrypt =  require('bcrypt');

test('signup should create new user', async ()=> {
  beforeEach(accountController.signup);
  const res = await req(app)
  .post('/signup', auth.uniqueData, accountController.signup)
  .send({
    new_email: "herirudini@gmail.com",
    new_username: "herirudini",
    new_password: "1234"
  })
  .expect(res.status).toBe(201);
  //Assert that the db was changed correctly ->
  const userInDb = await User.findById(res.body.user._id);
  expect(userInDb).not.toBeNull();
  //Assert about the response
  expect(res.body).toMatchObject({
    data: {
      username: "herirudini",
      email: "herirudini@gmail.com",
    },
  });
  expect(User.password).toBe(bcrypt.hashSync("1234",8));
})
