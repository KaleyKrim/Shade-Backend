const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');
const saltRounds = 12;

const db = require('../models');
const User = db.user;
const Message = db.message;
const Status = db.status;


//api/users gets you JUST the users

router.get('/', (req, res) => {
  return User.findAll({
    where: {
      role_id: 1
    },
    attributes: {
      exclude: ['password']
    }})
  .then(users => {
    return res.json(users);
  })
  .catch((err) => {
    console.log(err);
  })
});

//api/users/all gets you all users + their related tables

router.get('/all', (req, res) => {
  return User.findAll({
    where: {
      role_id: 1
    },
    attributes: {
      exclude: ['password']
    },
    include: [
      { model: Message, as: 'offense' },
      { model: Message, as: 'defense' },
      { model: Status, as: 'user_status' }
    ]
  })
  .then((users) => {
    return res.json(users);
  })
  .catch((err) => {
    console.log(err);
  });
});

router.get('/:id', (req, res) => {
  let id = req.params.id;
  return User.findById(id, {
    attributes: {
      exclude: ['password']
    },
    include:[
      { model: Message, as: 'offense' },
      { model: Message, as: 'defense' },
      { model: Status, as: 'user_status' }
    ]
  })
  .then((user) => {
    return res.json(user);
  })
  .catch((err) => {
    console.log(err);
  });
});

module.exports = router;