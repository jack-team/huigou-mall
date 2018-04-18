const mongoose = require('mongoose');

const connectUrl = `mongodb://localhost:27017/huigou`;

module.exports = () => (
    mongoose.connect(connectUrl).then(() => {
        console.log(`数据库连接成功...,11`)
    }).catch(err => {
        console.log(`连接失败:${err}`)
    })
);


