const express = require('express');
const router = express.Router();

const db = require('../models');
const Message = db.message;
const User = db.user;
const Status = db.status;

const multer = require('multer');
const aws = require('aws-sdk');
const multerS3 = require('multer-s3');

const skd = require('../_lib/keyconfig.js');

aws.config.update({
  secretAccessKey: skd.sak,
  accessKeyId: skd.aki,
  region: skd.region
});

const s3 = new aws.S3();

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'shade.storage',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    contentDisposition: 'inline',
    key: function(req, file, cb){
      console.log(file);
      cb(null, Date.now() + "-" + file.originalname);
    }
  })
});

router.get('/', (req, res) => {
  return Message.findAll({
    where: {
      deletedAt: null,
      offensive: {
        $lte: 3
      },
      $or: [
        {
          flag_one: {
            //note: this will be req.user.id, but for accessing the API when we're not logged in, I'm leaving 1 as a placeholder.
            $ne: 1
          }
        },
        {
          flag_one: null
        }
      ],
      $or: [
        {
          flag_two: {
            //note: this will be req.user.id, but for accessing the API when we're not logged in, I'm leaving 1 as a placeholder.
            $ne: 1
          }
        },
        {
          flag_two: null
        }
      ]
    },
    include:[
      { model: User, as: 'shader', attributes: ['username', 'id', 'status_id'] },
      { model: User, as: 'victim', attributes: ['username', 'id', 'status_id'] },
      { model: Status, as: 'message_status' }
    ]
  })
  .then(messages => {
    return res.json(messages);
  })
  .catch((err) => {
    console.log(err);
  })
});

router.post('/', upload.array('upl', 1), (req, res) => {

  if(req.files[0]){
    Message.create({
      body: req.body.body,
      shader_id: req.body.shader_id,
      victim_id: req.body.victim_id,
      media: req.files[0].key
    })
    .then((message) => {
      return Message.findById(message.id, {
        include:[
          { model: User, as: 'shader', attributes: ['username', 'id', 'status_id'] },
          { model: User, as: 'victim', attributes: ['username', 'id', 'status_id'] },
          { model: Status, as: 'message_status'}
        ]
      })
      .then((foundMessage) => {
        console.log(foundMessage);
        return res.json(foundMessage);
      })
    })
    .catch((err) => {
      console.log(err);
    });
  }else{
     Message.create({
      body: req.body.body,
      shader_id: req.body.shader_id,
      victim_id: req.body.victim_id
    })
    .then((message) => {
      return Message.findById(message.id, {
        include:[
          { model: User, as: 'shader', attributes: ['username', 'id', 'status_id'] },
          { model: User, as: 'victim', attributes: ['username', 'id', 'status_id'] },
          { model: Status, as: 'message_status'}
        ]
      })
      .then((foundMessage) => {
        console.log('foundMessage', foundMessage);
        return res.json(foundMessage);
      })
    })
    .catch((err) => {
      console.log(err);
    });
  }

});

router.get('/:id', (req, res) => {
  let id = req.params.id;
  return Message.findById(id, {
    include:[
      { model: User, as: 'shader', attributes: ['username', 'id', 'status_id'] },
      { model: User, as: 'victim', attributes: ['username', 'id', 'status_id'] },
      { model: Status, as: 'message_status'}
    ]
  })
  .then((message) => {
    return res.json(message);
  })
  .catch((err) => {
    console.log(err);
  });
});

router.put('/:id', (req, res) => {
  let newInfo = req.body;
  let id = req.params.id;
  //note: newInfo coming in from axios should be an object whose keys match the columns in messages
  return Message.findById(id)
  .then((message) => {
    if(parseInt(message.shader_id, 10) === parseInt(req.user.id, 10)){
      return message.update(newInfo, {
        returning: true,
        plain: true
      })
      .then((message) => {
        return Message.findById(id, {
          include: [
            { model: User, as: 'shader', attributes: ['username', 'id', 'status_id']},
            { model: User, as: 'victim', attributes: ['username', 'id', 'status_id'] },
            { model: Status, as: 'message_status'}
          ]
        })
        .then((foundMessage) => {
          return res.json(foundMessage);
        })
      })
      .catch((err) => {
        console.log(err);
      })
    }
  })
});

router.put('/:id/vote', (req, res) => {
  const data = req.body;
  const id = req.params.id;
  return Message.findById(id)
  .then((message) => {
    if(data.vote === 'up'){
      return message.update({
        points: Number(message.points) + Number(data.amount)
      }, {
        returning: true,
        plain: true
      })
      .then((upvotedMessage) => {
        if(Number(upvotedMessage.points) >= 10 && upvotedMessage.status_id === 1){
          return upvotedMessage.update({
            status_id: 2
          })
          .then((response) => {
            return Message.findById(id, {
              include: [
                { model: User, as: 'shader', attributes: ['username', 'id', 'status_id']},
                { model: User, as: 'victim', attributes: ['username', 'id', 'status_id'] },
                { model: Status, as: 'message_status'}
              ]
            })
            .then((extraMessage) => {
              return res.json(extraMessage);
            })
          })
        }else{
          return Message.findById(id, {
            include: [
              { model: User, as: 'shader', attributes: ['username', 'id', 'status_id']},
              { model: User, as: 'victim', attributes: ['username', 'id', 'status_id'] },
              { model: Status, as: 'message_status'}
            ]
          })
          .then((finalMessage) => {
            return res.json(finalMessage);
          })
        }
      })
    }else if(data.vote === 'down'){
      return message.update({
        points: Number(message.points) - Number(data.amount)
      }, {
        returning: true,
        plain: true
      })
      .then((downvotedMessage) => {
        if(downvotedMessage.points < 10 && downvotedMessage.status_id === 2){
          return downvotedMessage.update({
            status_id: 1
          })
          .then((response) => {
            return Message.findById(id, {
              include: [
                { model: User, as: 'shader', attributes: ['username', 'id', 'status_id']},
                { model: User, as: 'victim', attributes: ['username', 'id', 'status_id'] },
                { model: Status, as: 'message_status'}
              ]
            })
            .then((basicMessage) => {
              return res.json(basicMessage);
            })
          })
        }else{
          return Message.findById(id, {
            include: [
              { model: User, as: 'shader', attributes: ['username', 'id', 'status_id']},
              { model: User, as: 'victim', attributes: ['username', 'id', 'status_id'] },
              { model: Status, as: 'message_status'}
            ]
          })
          .then((finalMessage) => {
            return res.json(finalMessage);
          })
        }
      })
    }
  })
  .catch((err) => {
    console.log(err);
  });
});

router.put('/:id/inappropriate', (req, res) => {
  let userId = req.body.user;
  let id = req.body.id;

  return Message.findById(id)
  .then(message => {
    if(message.flag_one === null){
      return message.update({
        offensive : (message.offensive + 1),
        flag_one : userId
      }, {
        returning: true,
        plain: true
      })
      .then(message => {
        return res.json(message);
      })
    }else if((message.flag_two === null) && (message.flag_one != userId)){
      return message.update({
        offensive : (message.offensive + 1),
        flag_two : userId
      }, {
        returning: true,
        plain: true
      })
      .then(message => {
        return res.json(message);
      })
    }else if((message.flag_three === null) && (message.flag_two != userId) && (message.flag_one != userId)){
      return message.update({
        offensive : (message.offensive + 1),
        flag_three : userId
      }, {
        returning: true,
        plain: true
      })
      .then(message => {
        return res.json(message);
      })
    }
  })
  .catch((err) => {
    console.log(err);
  });
});

router.delete('/:id', (req, res) => {
  let id = req.params.id;

  return Message.findById(id)
  .then(message => {
    return message.update({deletedAt : Date.now()}, {
      returning: true,
      plain: true
    })
    .then(message => {
      return res.json(message);
    })
  })
  .catch((err) => {
    console.log(err);
  });
});

module.exports = router;