const fs = require('fs'),
    process = require("process");
const staticPath = `${process.cwd()}/public`;

const index = async ctx => {
    const {
        methods,
        isLogin
    } = ctx;
    const staticUrl = ``;
    const user = methods.baseUser();
    //获取静态路径
    const assetPath = `${staticPath}/asset.json`;
    const asset = fs.readFileSync(assetPath, `utf-8`);

    await ctx.render("admin", {
        user: JSON.stringify({
            ...user,
            isLogin
        }),
        static: {
            staticUrl: staticUrl,
            ...asset
        }
    })
};

module.exports = {
    index
};