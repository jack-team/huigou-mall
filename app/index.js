const Router = require('koa-router');
const router = new Router();

const moduleRouter = modules => {
    Object.keys(modules).map(prefix => {
        const route = modules[prefix];
        router.use(prefix, route.routes(), route.allowedMethods());
    });
    return router;
};

//所有模块入口都在这里
module.exports = moduleRouter({
    "/admin": require('./routes/admin')
});
