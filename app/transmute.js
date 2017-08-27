#!/usr/bin/env node
'use strict';

// Load base requirements
const program = require('commander'),
      dotenv = require('dotenv').config(),
      path = require('path');

// Load our libraries
const utils = require('./libs/utils'),
      logger = require('./libs/log'),
      i18n = require('./libs/locale'),
      queue = require('./libs/queue'),
      task = require('./libs/task');

// Create new task
task.create({
  "name": "Two Brothers, One Impala",
  "directory": path.resolve('test/data/task/metadata'),
  "type": "show",
  "seasons": [1, 2],
  "options": {
    "preset": "slow",
    "video" : {
      "bitrate": 3500,
      "quality": 0
    }
   }
}).then((data) => {
  console.log('Resolved 1 -');
  console.log(data);
}).catch((err) => {
  console.log('Error 1 -');
  console.log(err);
});

// Create a second task instance
task.create({
  "name": "Less Drama, More Zombies",
  "directory": "Less Drama, More Zombies/",
  "type": "show",
  "seasons": [1, 2, 3, "4"],
  "options": {
    "preset": "slow",
    "video" : {
      "bitrate": 4000,
      "quality": 0
    }
   }
}).then((data) => {
  console.log('Resolved 2 -');
  console.log(data);
}).catch((err) => {
  console.log('Error 2 -');
  console.log(err);
});
