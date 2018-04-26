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
router.post(`/user/signOut`, userControllers.signOut);
/*更新用户信息接口*/
router.post(`/user/updateUser`, auth, userControllers.updateUser);
/*修改密码*/
router.post(`/user/updatePassword`, auth, userControllers.updatePassword);


//-------------------------------mall--------------------------------------------
/*添加分类接口*/
router.post(`/mall/category/add`, auth, mallController.categoryAdd);
/*获取分类列表接口*/
router.get(`/mall/category/list`, auth, mallController.categoryList);
/*编辑分类接口*/
router.post(`/mall/category/editor`, auth, mallController.categoryEditor);
/*删除分类接口*/
router.post(`/mall/category/delete`, auth, mallController.categoryDelete);


module.exports = router;