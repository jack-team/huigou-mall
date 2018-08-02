const loginUserCache = {};

const methods = ctx => ({
    //获取参数
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
        const {
            accessToken
        } = user;
        loginUserCache[accessToken] = user;
        return this.baseUser();
    },

    //删除会话中的user信息
    deleteUser() {
        const {
            accessToken
        } = this.baseUser();
        //删除缓存
        if (!!accessToken) {
            delete loginUserCache[accessToken];
        }
        ctx.session[`userInfo`] = undefined;
    },

    baseUser() {
        let {
            userInfo = {}
        } = ctx.session;

        if (!!userInfo.accessToken) {
            const {
                accessToken
            } = userInfo;

            if (!!loginUserCache[accessToken]) {
                userInfo = loginUserCache[accessToken];
            }
        }

        const {
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
    const {
        userInfo
    } = ctx.session;
    ctx.isLogin = !!userInfo;

    //将一些公用的方法放在 methods 里，全局可调用
    ctx.methods = methods(ctx);
    return next();
};
