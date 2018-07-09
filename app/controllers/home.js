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
    const assetPath = `${staticPath}/site/asset.json`;
    let asset = fs.readFileSync(assetPath, `utf-8`);
    asset = !!asset ? JSON.parse(asset) : {};
    console.log(asset)
    await ctx.render("admin", {
        user: JSON.stringify({
            ...user,
            isLogin
        }),
        staticUrl: staticUrl,
        static: asset
    })
};

module.exports = {
    index
};