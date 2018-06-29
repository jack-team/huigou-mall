const Router = require('koa-router');
const router = new Router();
const auth = require('./../middleware/auth');

const homeControllers = require('./controllers/home');
const userControllers = require('./controllers/user');
const mallController = require('./controllers/mall');


//--------------------------homePage------------------------------
router.get([`/`,`/site/*`], homeControllers.index);


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

/*添加商品接口*/
router.post(`/mall/goods/add`,auth,mallController.goodsAdd);
/*获取商品列表*/
router.get(`/mall/goods/list`,auth,mallController.goodsList);
/*获取商品信息*/
router.get(`/mall/goods/detail`,auth,mallController.getDetail);
/*更新商品详情*/
router.post(`/mall/goods/update`,auth,mallController.updateDetail);
/*商品上下架*/
router.post(`/mall/goods/upOrDown`,auth,mallController.upOrDown);
/*删除商品*/
router.post(`/mall/goods/delete`,auth,mallController.deleteGoods);

module.exports = router;