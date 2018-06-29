const Koa = require('koa');
const path = require('path');
const koaBody = require('koa-body');
const render = require('koa-ejs');
const koaStaticPlus = require('koa-static-plus');

const app = new Koa();

app.keys = [`HUI GOU KEY`];

//连接数据库
require('./config/db.connect');

//载入数据模型
require('./util/walk')(path.join(__dirname, '/app/models'));

app.use(koaBody());

//设置跨域共享
const cors = require('./middleware/cors');
app.use(cors);

//初始化session
const session = require('./middleware/session');
app.use(session(app));

//一些公共的方法
const common = require('./middleware/common');
app.use(common);

//添加一些验证方法的中间件
const validator = require('./middleware/validator');
app.use(validator);

//设置静态路径
app.use(koaStaticPlus(path.join(__dirname, '/public'), {
    pathPrefix: '/static'
}));


//配置模板引擎
render(app, {
    root: path.join(__dirname, 'app/views'),
    layout: false,
    viewExt: 'html',
    cache: false,
    debug: false
});

//路由模块分发
const router = require('./app/router');

app.use(router.routes());

app.listen(6868, () => {
    console.log(`server start at 6868...`);
});
