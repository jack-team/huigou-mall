const methods = ctx => ({
    getPara() {
        const {request} = ctx;
        const {method, body, query} = request;
        return method === `POST` ? body : query;
    },
    format(body) {
        return Object.assign({
            code: 200,
            data: {},
            message: ''
        }, body);
    },
    save(key, value) {
        ctx.session[key] = value;
        return ctx.session;
    },
    //将user信息存入会话中
    saveUser(user) {
        this.save('userInfo', user);
        return this.baseUser();
    },
    //删除会话中的user信息
    deleteUser() {
        ctx.session[`userInfo`] = undefined;
    },
    baseUser() {
        const { userInfo = {} } = ctx.session;
        let {
            userName = null,
            avatar = null,
            accessToken = null,
            nickname = null,
            isAdmin = null,
            loginAt = null
        } = userInfo;
        return {
            userName,
            avatar,
            accessToken,
            nickname,
            isAdmin,
            loginAt
        }
    }
});

module.exports = async (ctx, next) => {
    //是否在登录状态
    const {userInfo} = ctx.session;
    ctx.isLogin = !!userInfo;

    //将一些公用的方法放在 methods 里，全局可调用
    ctx.methods = methods(ctx);
    return next();
};
