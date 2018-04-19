const Koa = require('koa');
const path = require('path');
const koaBody = require('koa-body');
const render = require('koa-ejs');

const app = new Koa();

app.keys = ['some secret hurr'];

//连接数据库
require('./config/db.connect');

//载入数据模型
const models = path.join(__dirname, '/app/models');
require('./util/walk')(models);

app.use(koaBody());

//设置跨域共享
const cors = require('./middleware/cors');
app.use(cors);

//初始化session
const session = require('./middleware/session');
app.use(session(app));


app.use((ctx, next) => {

    const { userInfo = {} } = ctx.session;

    //是否在登录状态
    ctx.isLogin = !!userInfo.accessToken;

    //存储session
    if (!ctx.saveSession) {
        ctx.saveSession = (key, value) => {
            ctx.session[key] = value;
        };
    }

    //获取用户基本信息，不包含密码
    if (!ctx.getBaseUser) {
        ctx.getBaseUser = user => {
            const {
                userName = null,
                avatar = null,
                accessToken = null,
                nickname = null
            } = user || userInfo;
            return {
                userName,
                avatar,
                accessToken,
                nickname
            }
        }
    }

    return next();
});

//配置模板引擎
render(app, {
    root: path.join(__dirname, 'app/views'),
    layout: false,
    viewExt: 'html',
    cache: false,
    debug: false
});

//路由模块分发
const router = require('./app/index');
app.use(router.routes());

app.listen(6868, () => {
    console.log(`server start at 6868...`);
});
