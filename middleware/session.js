const session = require('koa-session');

const config = {
    key: 'HG:',
    maxAge: 86400000,
    overwrite: true,
    httpOnly: true,
    signed: true,
    rolling: false,
    renew: false
};

module.exports = app => (
    session(config, app)
);
