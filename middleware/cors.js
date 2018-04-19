const cors = require('koa2-cors');

module.exports = cors({
    origin: ctx => {
        return ctx.header.origin;
    },
    maxAge: 5,
    credentials: true,
    allowMethods: [`GET`, `POST`, `DELETE`, `PUT`,`OPTIONS`],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept','X-Requested-With'],
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization']
});