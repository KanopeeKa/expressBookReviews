const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// User registration
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (isValid(username)) {
    return res.status(409).json({ message: "User already exists" });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "User successfully registered. Now you can login" });
});

// Get the book list available in the shop using Promise callbacks
public_users.get('/', function (req, res) {
  Promise.resolve(books)
    .then((data) => {
      return res.status(200).json(data);
    })
    .catch((error) => {
      return res.status(500).json({ message: error });
    });
});

// Get book details based on ISBN using Promise callbacks
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  Promise.resolve(books[isbn])
    .then((book) => {
      if (!book) {
        throw "Book not found";
      }
      return res.status(200).json(book);
    })
    .catch((error) => {
      return res.status(404).json({ message: error });
    });
});

// Get book details based on author using Promise callbacks
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;

  Promise.resolve(
    Object.values(books).filter((book) => book.author === author)
  )
    .then((filteredBooks) => {
      if (filteredBooks.length === 0) {
        throw "Book not found";
      }
      return res.status(200).json(filteredBooks);
    })
    .catch((error) => {
      return res.status(404).json({ message: error });
    });
});

// Get all books based on title using Promise callbacks
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;

  Promise.resolve(
    Object.values(books).filter((book) => book.title === title)
  )
    .then((filteredBooks) => {
      if (filteredBooks.length === 0) {
        throw "Book not found";
      }
      return res.status(200).json(filteredBooks);
    })
    .catch((error) => {
      return res.status(404).json({ message: error });
    });
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).json(book.reviews);
  }

  return res.status(404).json({ message: "Book not found" });
});

module.exports.general = public_users;