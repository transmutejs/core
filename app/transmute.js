#!/usr/bin/env node
'use strict';

// Load base requirements
const program = require('commander'),
      dotenv = require('dotenv').config();

// Load our libraries
const utils = require('./lib/utils'),
      logger = require('./lib/log'),
      i18n = require('./lib/locale'),
      queue = require('./lib/queue');

// Just for now
process.exit(0);
