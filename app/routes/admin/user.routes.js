const express = require('express');
const routeLabel = require('route-label');
const router = express.Router();
const namedRouter = routeLabel(router);
const userController = require('../../modules/user/controllers/user.controller');
const fs = require('fs');

namedRouter.get('user.login', `/`, userController.login);

module.exports = router;