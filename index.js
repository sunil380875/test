const {join,resolve} = require("path");
const http = require("http");
const express = require("express");
const cors = require("cors");
const engine = require("ejs-locals");
const session = require("express-session");
const flash = require('connect-flash');
const bodyParser = require('body-parser');
require("mongoose-pagination");
require("dotenv").config();
_ = require("underscore");
//custom module
// global.appRoot = require("./app");
const config = require(resolve(join(__dirname,'./app/config'),'index'))
utils = require(resolve(join(__dirname, 'app/helper', 'utils')));
const app = express();

const namedRouter = require("route-label")(app);
app.set('views',[join(__dirname,'./app/views'),join(__dirname,'./app/modules')]);
app.engine('ejs',engine);

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

/*****************************************************/
/********* Functions + variable declaration *********/
/***************************************************/
const isProd = config.app.isProd;
const getPort = config.app.port || process.env.PORT || 1740;
const getApiFolderName = config.app.getApiFolderName;

const getAdminFolderName = config.app.getAdminFolderName;
app.locals.moment = require('moment');
app.locals.layout_directory = '../../../views/layouts';
app.locals.module_directory = '../../../../app/modules/';
app.locals.partial_directory = '../../../views/partials';
global.project_description = config.app.project_description;
global.project_name = config.app.project_name;
global.generateUrl = generateUrl = (route_name, route_param = {}) => namedRouter.urlFor(route_name, route_param);


app.use(cors());
app.use(flash());
app.use(session({ secret: 'delivery@&beverage@#', resave: true, saveUninitialized: true ,cookie: { secure: true }}));
app.use(bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000
})); // get information from html forms
app.use(bodyParser.json({
    limit: "50mb"
}));
app.use(express.static("./public"));
console.log("hellos")


app.use(async (req, res, next) => {
    res.header('Cache-Control', 'private, no-cache, max-age=3600');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    res.locals.messages = req.flash();
    // auth = require(resolve(join(__dirname, 'app/middlewares', "auth")))(req, res, next);
    // app.use(auth.initialize());
    // if (req.cookies['admin_auth']) {
    //     req.session.token = req.cookies['admin_auth'];
    // } else if (req.session.token) {
    //     res.cookie('admin_auth', req.session.token, { httpOnly: true , maxAge: 2 * 24 * 60 * 60 * 1000});
    // }
    // // This is for admin end
    // if (req.session.token && req.session.token != null) {
    //     req.headers['token'] = req.session.token;
    // }
    // // This is for webservice end
    // if (req.headers['x-access-token'] != null) {
    //     req.headers['token'] = req.headers['x-access-token'];
    // }
    // console.log(req.headers['token'])
    // add this line to include winston logging
    next();
});






const server = http.createServer(app);

(async () => {
    try {
        // Database connection//
        await require(resolve(join(__dirname, 'app/config', 'database')))();
        // agenda = require(resolve(join(__dirname, "app/config", "agenda")));
        /******************* Routes Api ************/
        // const apiFiles = await utils._readdir(`./app/routes/${getApiFolderName}`);
        // apiFiles.forEach(file => {
        //     if (!file && file[0] == '.') return;
        //     namedRouter.use('', `/${getApiFolderName}`, require(join(__dirname, file)));
        // });

        /*********************** Routes Admin **********************/
        const adminApiFiles = await utils._readdir(`./app/routes/${getAdminFolderName}`);
        adminApiFiles.forEach(file => {
            if (file.split("/")[file.split("/").length - 1] != ".DS_Store") {
                if (!file && file[0] == '.') return;
                namedRouter.use('', require(join(__dirname, file)));
            }
        });

        namedRouter.buildRouteTable();
        global.routeList = namedRouter.getRouteTable();
        global.permissions = await utils.handleRoutes(routeList);
        if (!isProd && process.env.SHOW_NAMED_ROUTES === 'true') {
            console.log(routeList);
        }
        /******************* Service Launch *****************/
        server.listen(getPort);
        // server.on('error', onError);
        console.log(`${config.app.project_name} is running on ${(global.BASE_URL && global.BASE_URL !== '') ? global.BASE_URL : `http://${process.env.HOST}:${getPort}`}`);
    } catch (error) {
        console.error(error);
    }
})();

process.on('SIGINT', function() {
    process.exit();
});

// module.exports = app;