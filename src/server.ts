import * as express from "express";
import * as compression from "compression";
import * as session from "express-session";
import * as passport from "passport";
import * as bodyParser from "body-parser";
import * as connectRedis from "connect-redis";
import * as path from "path";
import * as db from "./models";
import * as routes from "./routes";
import * as middleware from "./middlewares";
const RedisStore = connectRedis(session);
const PORT = require(`../config/${process.env.NODE_ENV}`).PORT;

const app = express();
app.use(compression());
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(bodyParser.urlencoded({ "extended" : false }));
app.use(bodyParser.json());
app.use(session({
	store: new RedisStore({ host: '127.0.0.1', port: 6379 }),
	secret: 'Shade',
	resave: false,
	saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(middleware.headerSetter);

app.use('/api', routes);

module.exports = app;
