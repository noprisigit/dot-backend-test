const chai = require("chai");
const chaiHttp = require("chai-http");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const app = require("../app");
const db = require("../app/models");

chai.use(chaiHttp);
chai.should();

const User = db.users;
let defaultUser = {
  name: "Default User",
  email: "default@user.com",
  password: "12345678",
};

let newUser = {
  name: "New User",
  email: "new@user.com",
  password: "12345678",
};

describe("User", () => {
  describe("POST /api/v1/users/login", () => {
    before((done) => {
      User.create({
        name: defaultUser.name,
        email: defaultUser.email,
        password: bcrypt.hashSync(defaultUser.password, saltRounds),
      });
      done();
    });
    after((done) => {
      User.destroy({ where: { email: [defaultUser.email, newUser.email] } });
      done();
    });

    it("should return errors if validation fails", (done) => {
      chai
        .request(app)
        .post("/api/v1/login")
        .send({
          email: "",
          password: "",
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a("object");
          res.body.should.have.property("status").eql("error");
          res.body.should.have.property("message").eql("Validation errors");
          res.body.should.have.property("errors");
          done();
        });
    });

    it("should return an error if email is not provided", (done) => {
      chai
        .request(app)
        .post("/api/v1/login")
        .send({
          email: "notfound@gmail.com",
          password: "12345678",
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a("object");
          res.body.should.have.property("status").eql("error");
          res.body.should.have.property("message").eql("User does not exist");
          done();
        });
    });

    it("should return an error if password is not valid", (done) => {
      chai
        .request(app)
        .post("/api/v1/login")
        .send({
          email: defaultUser.email,
          password: "1234567",
        })
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a("object");
          res.body.should.have.property("status").eql("error");
          res.body.should.have.property("message").eql("Invalid Password");
          done();
        });
    });

    it("should return a token", (done) => {
      chai
        .request(app)
        .post("/api/v1/login")
        .send({
          email: defaultUser.email,
          password: defaultUser.password,
        })
        .end((err, res) => {
          console.log(err);
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("status").eql("success");
          res.body.should.have
            .property("message")
            .eql("User logged in successfully");
          res.body.should.have.property("data");
          res.body.should.have.property("token");
          done();
        });
    });
  });

  describe("POST /api/v1/users/register", () => {
    before((done) => {
      User.create({
        name: defaultUser.name,
        email: defaultUser.email,
        password: bcrypt.hashSync(defaultUser.password, saltRounds),
      });
      done();
    });
    after((done) => {
      User.destroy({ where: { email: [defaultUser.email, newUser.email] } });
      done();
    });
    
    it("should return errors if validation fails", (done) => {
      chai
        .request(app)
        .post("/api/v1/register")
        .send({
          name: "",
          email: "",
          password: "",
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a("object");
          res.body.should.have.property("status").eql("error");
          res.body.should.have.property("message").eql("Validation errors");
          res.body.should.have.property("errors");
          done();
        });
    });

    it("should return an error if email is already registered", (done) => {
      chai
        .request(app)
        .post("/api/v1/register")
        .send({
          name: defaultUser.name,
          email: defaultUser.email,
          password: defaultUser.password,
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a("object");
          res.body.should.have.property("status").eql("error");
          res.body.should.have.property("message").eql("Email already exists");
          done();
        });
    });

    it("should create a new user", (done) => {
      chai
        .request(app)
        .post("/api/v1/register")
        .send({
          name: newUser.name,
          email: newUser.email,
          password: newUser.password,
        })
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a("object");
          res.body.should.have.property("status").eql("success");
          res.body.should.have
            .property("message")
            .eql("User created successfully");
          done();
        });
    });
  });
});
