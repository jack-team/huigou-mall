const Router = require('koa-router');
const router = new Router();
const auth = require('./../../middleware/auth');

const homeControllers = require('./../controllers/admin/home');
const userControllers = require('./../controllers/admin/user');
const mallController = require('./../controllers/admin/mall');

//--------------------------admin首页------------------------------
router.get(`/`, homeControllers.index);

//---------------------------user---------------------------------
/*注册接口*/
router.post(`/user/signUp`, userControllers.signUp);
/*登录接口*/
router.post(`/user/signIn`, userControllers.signIn);
/*退出登录接口*/
router.post(`/user/signOut`, auth, userControllers.signOut);
/*更新用户信息接口*/
router.post(`/user/updateUser`, auth, userControllers.updateUser);
/*修改密码*/
router.post(`/user/updatePassword`, auth, userControllers.updatePassword);


//-------------------------------mall--------------------------------------------
/*添加分类接口*/
router.post(`/mall/category/add`, auth, mallController.categoryAdd);
router.get(`/mall/category/list`, auth, mallController.categoryList);


module.exports = router;