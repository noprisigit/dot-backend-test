const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");
const db = require("../app/models");

chai.use(chaiHttp);
chai.should();

const User = db.users;
const Book = db.books;

let defaultUser = {
  name: "Default User",
  email: "default@user.com",
  password: "12345678",
};

const book = {
  id: 1000,
  title: "Harry Potter",
  description: "Description.",
  author: "J. K. Rowling",
  publisher: "Bloomsbury",
  released_date: "1997-10-01",
  price: 80000,
  stock: 10,
};

let token;
let userId;

describe("Book", () => {
  before((done) => {
    chai
      .request(app)
      .post("/api/v1/register")
      .send(defaultUser)
      .end((err, res) => {
        res.should.have.status(201);
        done();
      });
  });
  before((done) => {
    chai
      .request(app)
      .post("/api/v1/login")
      .send(defaultUser)
      .end((err, res) => {
        token = res.body.token;
        userId = res.body.data.id;
        res.should.have.status(200);
        done();
      });
  });
  after((done) => {
    // After each test we truncate the database
    User.destroy({ where: { email: [defaultUser.email] } });
    done();
  });

  describe("POST /api/v1/books", () => {
    it("should return errors if validation fails", (done) => {
      chai
        .request(app)
        .post("/api/v1/books")
        .set("x-access-token", token)
        .send({
          title: "",
          description: "",
          author: "",
          publisher: "",
          released_date: "",
          price: "",
          stock: "",
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

    it("should create a new book if validation succeeds", (done) => {
      chai
        .request(app)
        .post("/api/v1/books")
        .set("x-access-token", token)
        .send({
          title: "Test Book",
          description: "Test Description",
          author: "Test Author",
          publisher: "Test Publisher",
          released_date: "2020-01-01",
          price: "1000",
          stock: "10",
        })
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a("object");
          res.body.should.have.property("status").eql("success");
          res.body.should.have
            .property("message")
            .eql("Book created successfully");
          res.body.should.have.property("data");
          res.body.should.have.property("data").property("id");
          res.body.should.have.property("data").property("title");
          res.body.should.have.property("data").property("description");
          res.body.should.have.property("data").property("author");
          res.body.should.have.property("data").property("publisher");
          res.body.should.have.property("data").property("released_date");
          res.body.should.have.property("data").property("price");
          res.body.should.have.property("data").property("stock");
          done();
        });
    });
  });

  describe("GET /api/v1/books", () => {
    it("should return all books", (done) => {
      chai
        .request(app)
        .get("/api/v1/books")
        .set("x-access-token", token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("status").eql("success");
          res.body.should.have
            .property("message")
            .eql("Books retrieved successfully");
          res.body.should.have.property("data");
          done();
        });
    }).timeout(5000);
  });

  describe("GET /api/v1/books/:id", () => {
    it("should return a book with the given id", (done) => {
      Book.create({
        id: book.id,
        title: book.title,
        author: book.author,
        description: book.description,
        released_date: book.released_date,
        publisher: book.publisher,
        price: book.price,
        stock: book.stock,
        user_id: userId,
      });

      chai
        .request(app)
        .get("/api/v1/books/" + book.id)
        .set("x-access-token", token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("status").eql("success");
          res.body.should.have
            .property("message")
            .eql("Book retrieved successfully");
          res.body.should.have.property("data");
          res.body.should.have.property("data").property("id");
          res.body.should.have.property("data").property("title");
          res.body.should.have.property("data").property("description");
          res.body.should.have.property("data").property("author");
          res.body.should.have.property("data").property("publisher");
          res.body.should.have.property("data").property("released_date");
          res.body.should.have.property("data").property("price");
          res.body.should.have.property("data").property("stock");
          done();
        })
        .timeout(5000);
    }).timeout(5000);

    it("should return an error if book with given id does not exist", (done) => {
      chai
        .request(app)
        .get("/api/v1/books/678")
        .set("x-access-token", token)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        })
        .timeout(5000);
    });
  });
});
