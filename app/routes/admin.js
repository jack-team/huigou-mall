const Router = require('koa-router');
const router = new Router();

const userController = require('./../controllers/admin/userController');

router.get(`/`, async ctx => {
    ctx.body = `1111`;
});


//user
router.post(`/user/signup`,userController.signup);
router.post(`/user/login`,userController.login);


module.exports = router;