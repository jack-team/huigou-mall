const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    //用户名
    userName:{
        unique:true,
        type:String
    },
    //头像
    avatar:String,
    //令牌
    accessToken:String,
    //密码
    passWord:String,
    //昵称
    nickname:String,
    //创建时间
    createAt: {
        type: Date,
        dafault: Date.now()
    },
    //更新时间
    updateAt: {
        type: Date,
        dafault: Date.now()
    }
});

UserSchema.pre('save', function(next) {
    if (this.isNew) {
        this.createAt = this.updateAt = Date.now();
    }
    else {
        this.updateAt = Date.now();
    }
    next()
});

mongoose.model('User', UserSchema);
