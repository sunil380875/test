const express = require("express");
const routeLabel = require("route-label");
const router = express.Router();
const namedRouter = routeLabel(router);

class UserController {
 //Login 
 async login(req, res) {
    try {
        if (req.session && req.session.token) {
            res.redirect(namedRouter.urlFor('user.dashboard'));
        } else {
            res.clearCookie('admin_auth');
            res.render('user/views/login.ejs');
        }
    } catch (e) {
        throw e;
    }
};
}

module.exports = new UserController();
