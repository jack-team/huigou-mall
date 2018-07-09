const uuid = require('uuid');
const mongoose = require('mongoose');
const createModel = require('../../util/createModel');

const UserModel = createModel({
    /*
    * @用户名
    */
    userName: {
        unique: true,
        type: String
    },
    /*
    * @头像
    */
    avatar: String,
    /*
    * @令牌
    */
    accessToken:  {
        unique: true,
        type: String
    },
    /*
    * @密码
    */
    passWord: String,
    /*
    * @昵称
    */
    nickname: String,
    /*
    * @用户手机号码
    */
    phone:{
        type: String
    },
    /*
    * @超级管理员
    *可进行任何操作,包括添加用户，删除用户
    *
    */
    isAdmin: {
        type: Boolean,
        default: false
    },
    /*
    * @角色
    * 1为普通角色无法进行编辑但可以进行查看操作
    * 2为管理员，可进行查看编辑删除操作
    */
    role:{
        type: Number,
        default: 1
    },
    /*
     * @真实姓名
     */
    realName:{
        type: String
    },
    /*
    * @最近一次登录时间
    */
    loginAt: {
        type: Date,
        default: Date.now()
    }
});

//静态方法
UserModel.statics.setMethods({
    /*使用userName查找用户信息*/
    async getUserByName(name) {
        return await this.findOne({
            userName: name
        }).exec();
    },
    /*使用accessToken查找用户信息*/
    async getUserByToken(accessToken) {
        return await this.findOne({
            accessToken: accessToken
        }).exec();
    },
    /*使用accessToken查找用户信息并更新用户信息*/
    async updateUser(accessToken, update) {
        const options = {
            new: true
        };
        update = {
            $set: update
        };
        return await this.findOneAndUpdate(
            {accessToken},
            update,
            options
        );
    },
    /*创建新用户*/
    async createUser(fields) {
        const defaultFields = {
            avatar: `http://static.yutao2012.com/a3cf50a0-484b-11e8-ab57-4b50cb30be35.jpg`,
            accessToken: uuid.v4(),
            isAdmin: false,
            nickname: '测试用户',
            role:1
        };
        const user = new this(Object.assign(
            defaultFields,
            fields
        ));
        return await user.save();
    }
});

mongoose.model('AdminUser', UserModel);


