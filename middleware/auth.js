const loginAuth = async (ctx, next) => {
    const { isLogin } = ctx;
    if (!isLogin) {
        return ctx.body = {
            code: 403,
            message: `请先登录`
        }
    }
    return next();
};

const roleAuth = async (ctx, next) => {
    const { methods } = ctx;
    const user = methods.baseUser();
    //如果是超级管理员
    if(user.isAdmin) {
        return next();
    }
    //编辑权限
    if(user.role === 2) {
        return next();
    }
    return ctx.body = {
        code: 699,
        message: `当前用户不具备该权限`
    };
};



module.exports = {
    loginAuth,
    roleAuth
};