require("dotenv").config();

const express = require("express");
const session = require("express-session");
const RedisStore = require("connect-redis")(session);
const app = express();

const redisOptions = {
    url: process.env.REDIS_SESSION_URL,
};

const sessionOptions = {
    store: new RedisStore(redisOptions),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    logError: true,
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 60 * 60 * 1000,
        domain: "vercel.app",
        sameSite: "none",
    },
};

app.set("trust proxy", 1);
app.use(session(sessionOptions));

app.get("/login", function (req, res) {
    // .. insert auth logic here .. //
    console.log(req.session);
    if (!req.session.user) {
        req.session.user = {
            id: Math.random(),
        };
    }

    res.json({
        message: "you are now logged in",
        user: req.session.user,
    });
});

app.get("/increment", function incrementCounter(req, res) {
    if (req.session.count) {
        req.session.count++;
    } else {
        req.session.count = 1;
    }
    res.json({
        message: "Incremented Count",
        count: req.session.count,
    });
});

app.get("/logout", function destroySession(req, res) {
    if (req.session) {
        req.session.destroy(function done() {
            res.json({
                message: "logged out : count reset",
            });
        });
    }
});

app.listen(8090, function () {
    console.log("WRITE server listening");
});
