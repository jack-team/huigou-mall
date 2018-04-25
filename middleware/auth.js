const auth = async (ctx, next) => {
    const { methods , isLogin } = ctx;
    if (!isLogin) {
        return ctx.body = {
            code: 403,
            message: `请先登录`
        }
    }

    const user = methods.baseUser();

    //如果不是管理员
    if(!user.isAdmin) {
        return ctx.body = {
            code: 699,
            message: `不是管理员，无法访问！`
        }
    }

    return next();
};

module.exports = auth;