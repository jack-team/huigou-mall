const Router = require('koa-router');
const router = new Router();

const {
    loginAuth,
    roleAuth
} = require('./../middleware/auth');

const homeControllers = require('./controllers/home');
const userControllers = require('./controllers/user');
const mallController = require('./controllers/mall');


//--------------------------homePage------------------------------
router.get([`/`, `/site`, `/site/*`], homeControllers.index);

//---------------------------user---------------------------------
/*注册接口*/
router.post(`/user/signUp`, userControllers.signUp);
/*登录接口*/
router.post(`/user/signIn`, userControllers.signIn);
/*退出登录接口*/
router.post(`/user/signOut`, loginAuth, userControllers.signOut);
/*更新用户信息接口*/
router.post(`/user/updateUser`, loginAuth, userControllers.updateUser);
/*修改密码*/
router.post(`/user/updatePassword`, loginAuth, userControllers.updatePassword);


//-------------------------------mall--------------------------------------------
/*添加分类接口*/
router.post(`/mall/category/add`, loginAuth, roleAuth, mallController.categoryAdd);
/*获取分类列表接口*/
router.get(`/mall/category/list`, loginAuth, mallController.categoryList);
/*编辑分类接口*/
router.post(`/mall/category/editor`, loginAuth, roleAuth, mallController.categoryEditor);
/*删除分类接口*/
router.post(`/mall/category/delete`, loginAuth, roleAuth, mallController.categoryDelete);

/*添加商品接口*/
router.post(`/mall/goods/add`, loginAuth, roleAuth, mallController.goodsAdd);
/*获取商品列表*/
router.get(`/mall/goods/list`, loginAuth, mallController.goodsList);
/*获取商品信息*/
router.get(`/mall/goods/detail`, loginAuth, mallController.getDetail);
/*更新商品详情*/
router.post(`/mall/goods/update`, loginAuth, roleAuth, mallController.updateDetail);
/*商品上下架*/
router.post(`/mall/goods/upOrDown`, loginAuth, roleAuth, mallController.upOrDown);
/*删除商品*/
router.post(`/mall/goods/delete`, loginAuth, roleAuth, mallController.deleteGoods);

module.exports = router;