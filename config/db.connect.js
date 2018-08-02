const mongoose = require('mongoose');

const connectUrl = `mongodb://admin:huaxin19jt@localhost:27017/huigou?authSource=huigou`;

mongoose.connect(connectUrl).then(() => {
    console.log(`数据库连接成功...`);
}).catch(err => {
    console.log(`连接失败:${err}`);
});


