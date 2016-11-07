'use strict';
var winston = require('winston');
var fs = require('fs');

var logger = new (winston.Logger)({
    transports: [
      new (winston.transports.File)( { filename: '././logs/mylogfile.log', level: 'info', timestamp:false})
    ]
  });

exports.logger = logger;