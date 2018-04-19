const index = async ctx => {
    const userInfo = ctx.getBaseUser();
    await ctx.render("admin", {
        static: {
            css: [`http://localhost:8088/css/app.css`],
            js: [
                `http://localhost:8088/js/common.js`,
                `http://localhost:8088/js/app.js`
            ]
        },
        user: JSON.stringify({
            ...userInfo,
            isLogin:ctx.isLogin,
            accessToken:undefined
        })
    })
};

module.exports = {
    index
};