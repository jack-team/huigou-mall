const auth = async (ctx, next) => {
    if (!ctx.isLogin) {
        return ctx.body = {
            code: 403,
            message: `请先登录`
        }
    }
    return next();
};

module.exports = auth;