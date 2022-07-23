const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");

chai.use(chaiHttp);
chai.should();

describe("User", () => {
  describe("POST /api/v1/users/login", () => {
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

    it("should return a token", (done) => {
      chai
        .request(app)
        .post("/api/v1/login")
        .send({
          email: "noprisigit@gmail.com",
          password: "12345678",
        })
        .end((err, res) => {
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

    it("should return an error if email is not provided", (done) => {
      chai
        .request(app)
        .post("/api/v1/login")
        .send({
          email: "testingaccount@gmail.com",
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
          email: "noprisigit@gmail.com",
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
  });

  describe("POST /api/v1/users/register", () => {
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
          name: "Sigit Prasetyo Noprianto",
          email: "noprisigit@gmail.com",
          password: "12345678",
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
          name: "Budi Kurniawan",
          email: "budikurniawan@gmail.com",
          password: "12345678",
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
