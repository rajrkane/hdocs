/**
 * @file Top level backend file. Handles passport authentication, backend sockets, and port listening.
 * @author Raj Kane
 */

const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const logger = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const session = require('express-session');

const routes = require('./routes');
const models = require('../models/models');

mongoose.connect(process.env.MONGODB_URI);

const app = express();
import http from 'http';
const server = http.Server(app);
import socketIO from 'socket.io';
const io = socketIO(server);

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());

io.on('connection', function(socket) {
  socket.on('openDocument', (data, next) => {
    socket.join(data.docId)
  })

  socket.on('syncDocument', (data) => {
    socket.to(data.docId).emit('syncDocument', data.raw)
  })

  socket.on('closeDocument', (data) => {
    socket.leave(data.docId)
  })
});

passport.serializeUser(function(user, done) {
  done(null, user._id)
});

passport.deserializeUser(function(id, done) {
  models.User.findById(id, function(err, user) {
    done(err, user)
  })
});

passport.use(new LocalStrategy((username, password, done) => {
  models.User.findOne({username: username}, (err, user) => {
    if(err) return done(err)
    if(!user) return done(null, false, {message: 'Incorrect username'})
    if (user.password !== password) return done(null, false, {message: 'Incorrect password'})
    return done(null, user)
  })
}));

app.use(routes(passport));

app.post('/create', function(req, res) {
  new models.Document({
    content: '',
    title: req.body.title,
    owner: req.user,
    collaborators: [req.user],
    timeOfCreation: Date(),
  }).save(function(err, doc) {
      if(err) res.status(500).json({err: err.message})
      else res.status(200).json({success: true, doc})
  })
});

app.get('/documentList', function(req, res) {
  models.Document.find({collaborators: {$in: [req.user]}}, (err, docs) => {
    if(err) res.status.end(err.message)
    else res.json(docs)
  })
});

app.get('/document/:id', function(req, res) {
  models.Document.findById(req.params.id, (err, doc) => {
    if(err) res.status(500).end(err.message)
    else res.json(doc)
  })
});

app.post('/save', function(req, res) {
  models.Document.update({_id: req.body.id}, {$set: {content: JSON.stringify(req.body.newContent)}}, (err, result) => {
    if(err) res.json({success: false})
    else res.json({success: true})
  })
});

app.get('/joinDocument', function(req, res) {
  models.Document.findById(req.query.id, (err, doc) => {
    if(err) res.status(500).end(err.message)
    else doc.collaborators.push(req.user)
    doc.save(err => {
      models.Document.find({collaborators: {$in: [req.user]}}, (err, docs) => {
        if(err) res.status(500).end(err.message)
        else res.json(docs)
      })
    })
  })
});

app.use(function(req, res, next) {
  const err = new Error('not found')
  err.status = 400
  next(err)
});

app.use((req, res, next) => {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
});

app.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.json({
    message: err.message,
    error: {}
  })
});

server.listen(process.env.PORT || 3000);
console.log('Server running at port 3000');
module.exports = app;
