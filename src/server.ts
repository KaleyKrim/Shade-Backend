import * as express from "express";
import * as compression from "compression";
import * as session from "express-session";
import * as passport from "passport";
import * as bodyParser from "body-parser";
import * as connectRedis from "connect-redis";
// import * as db from "./models";
import * as routes from "./routes";
import * as middleware from "./middlewares";
const RedisStore = connectRedis(session);

export const app = express()
	.use(compression())
	.use(bodyParser.urlencoded({ "extended" : false }))
	.use(bodyParser.json())
	.use(session({
		store: new RedisStore({ host: '127.0.0.1', port: 6379 }),
		secret: 'Shade',
		resave: false,
		saveUninitialized: false,
	}))
	.use(passport.initialize())
	.use(passport.session())
	.use(middleware.headerSetter)
	.use('/api', routes);
