#!/usr/bin/env node

var budo = require('budo');
var es2040 = require('es2040');
var createIndex = require('./default-index');

budo('index.js', {
  host: 'localhost',
  live: true,
  open: false,//true,
  watchGlob: [
    'slides/*',
    'index.html',
    'assets/*'
  ],
  css: 'styles.css',
  browserify: {
    transform: [es2040]
  },
  forceDefaultIndex: true,
  defaultIndex: function () {
    try {
      return createIndex();
    } catch (e) {
      console.log(e);
    }
  },
})
