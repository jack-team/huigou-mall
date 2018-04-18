const path = require('path');
const Koa = require('koa');
const app = new Koa();
const koaBody = require('koa-body');
const connectDataBase = require('./config/db.connect');
const walk = require('./util/walk');

//连接数据库
connectDataBase();

//载入数据模型
const models_path = path.join(__dirname, '/app/models');
walk(models_path);

const cors = require('./middleware/cors');
const router = require('./app/index');

//设置跨域共享
app.use(cors);

app.use(koaBody());

//配置路由
app.use(router.routes());

app.listen(6868, () => {
    console.log(`server start at 6868...`);
});
