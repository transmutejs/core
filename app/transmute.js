#!/usr/bin/env node
'use strict';

// Load base requirements
const program = require('commander'),
      dotenv = require('dotenv').config();

// Load our libraries
const utils = require('./libs/utils'),
      logger = require('./libs/log'),
      i18n = require('./libs/locale'),
      queue = require('./libs/queue');

// Variables
let task1, task2;

// Create new task
try {
  task1 = new (require('./libs/task'))({
    "name": "Two Brothers, One Impala",
    "directory": "Two Brothers, One Impala/",
    "type": "tv",
    "seasons": [1, 2, 3, 4, 5, 6],
    "options": {
      "preset": "slow",
      "video" : {
        "bitrate": 3500,
        "quality": 0
      }
     }
  });
} catch (e) {
  console.log(e.message);
}

// Create a second task instance
try {
  task2 = new (require('./libs/task'))({
    "name": "Less Drama, More Zombies",
    "directory": "Less Drama, More Zombies/",
    "type": "tv",
    "seasons": [1, 2, 3, "4"],
    "options": {
      "preset": "slow",
      "video" : {
        "bitrate": 4000,
        "quality": 0
      }
     }
  });
} catch (e) {
  console.log(e.message);
}

// DEBUG
console.log(task1.data);
console.log(task2.data);

// Just for now
process.exit(0);
