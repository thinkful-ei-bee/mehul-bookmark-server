'use strict';

const express = require('express');

const bookmarkRouter = express.Router();
const bodyParser = express.json();
const uuid = require('uuid/v4');
const logger = require('./logger');




const books = [{
  id:uuid(),
  title:'test',
  url:'testurl',
  description:'test descript',
  rating: 2
}];

bookmarkRouter
  .route('/bookmarks')
  .get((req,res) => {

    res
      .json(books);
  })
  .post(bodyParser, (req,res) => {
    const { title,url,description,rating } = req.body;
    console.log(title);
    if (!title || !url) {
      logger.error('title and url both required');
      return res
        .status(400)
        .send('Invalid data');
    }
    if(rating && isNaN(rating))
    {
      logger.error('rating must be a number');
      return res
        .status(400)
        .send('Invalid data');
    }
    let rating_num = parseInt(rating);

    if(rating_num <1 || rating_num >5){
      logger.error('rating must be between 1 and 5');
      return res
        .status(400)
        .send('Invalid data');
    }

    console.log('hello');
    const book_D = books.find(book => book.title === title && book.url === url );

    if (book_D) {
      logger.error('bookmark already in list');
      return res
        .status(404)
        .send('Bookmark Already Found');
    }
    const id = uuid();

    const bookmark_add = {
      id,
      title,
      url,
      description,
      rating
    };

    books.push(bookmark_add);

  
    logger.info(`bookmark with id ${id} created`);

    res
      .status(201)
      .location(`http://localhost:8000/bookmarks/${id}`)
      .json({id});
    
  });


bookmarkRouter
  .route('/bookmarks/:id')
  .get((req,res) => {
    const { id } = req.params;
    const book_D = books.find(book => book.id === id);

    // make sure we found a card
    if (!book_D) {
      logger.error(`Bookmark with id ${id} not found.`);
      return res
        .status(404)
        .send('Book Not Found');
    }

    res.json(book_D);
  })
  .delete((req,res) => {

    const { id } = req.params;

    const listIndex = books.findIndex(book => book.id === id);

    if (listIndex === -1) {
      logger.error(`Bookmark with id ${id} not found.`);
      return res
        .status(404)
        .send('Not Found');
    }

    books.splice(listIndex, 1);

    logger.info(`Bookmark with id ${id} deleted.`);
    res
      .status(204)
      .end();
  });

module.exports = bookmarkRouter;