var express = require('express');
var router = express.Router();
var findRouter = require('./find')

router.use('/findProject', findRouter)

module.exports = router;
