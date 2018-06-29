const index = async ctx => {
    const {methods , isLogin } = ctx;
    const staticUrl = `http://localhost:8088/`;
    const user = methods.baseUser();
    await ctx.render("admin", {
        user:JSON.stringify({
            ...user,
            isLogin
        }),
        static: {
            staticUrl: staticUrl,
            css: [`css/app.css`],
            js: [`js/common.js`, `js/app.js`]
        }
    })
};

module.exports = {
    index
};