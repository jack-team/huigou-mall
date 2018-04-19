const Router = require('koa-router');
const router = new Router();

const homeController = require('./../controllers/admin/home');
const userController = require('./../controllers/admin/user');

//admin首页
router.get(`/`, homeController.index);

//user
router.post(`/user/signUp`,userController.signUp);
router.post(`/user/signIn`,userController.signIn);
router.post(`/user/signOut`,userController.signOut);



module.exports = router;