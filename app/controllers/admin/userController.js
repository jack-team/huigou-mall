var mongoose =  require('mongoose')
var User = mongoose.model('User');
const trim = (str=``) => str.trim();

const md5 = require('./../../../util/md5');

const signup = async ctx => {
    const { username, password } = ctx.request.body;
    
    const user = await User.findOne({
        userName: username
    }).exec();

    
    if(!!user) {
        ctx.body = {
            code:500,
            message:`该用户已存在！`
        }    
    } else {
       const currentUser = new User({
            userName:username,
            passWord:md5(password),
            nickname:`测试用户`,
            avatar:`http://static.yutao2012.com/c51aee10-42f4-11e8-ba26-db895b35ee3b.jpg`,
            accessToken:`12sdd`
        });
    
        try {
            await currentUser.save();
            ctx.body = {
              code:200,
              message:`注册成功！`
            }
         }  catch (e) {
            ctx.body = {
              code:500,
              message:e.errmsg
            }
        }
    }
}


const login = async (ctx, next) => {
    const { username, password } = ctx.request.body;

    if (!trim(username) || !trim(password)) {
        return ctx.body = {
            code: 403,
            message: `用户名或密码不能为空！`
        }
    };
    
    const user = await User.findOne({
        userName: username
    }).exec();

    //与用户不存在
    if(!user) {
        return ctx.body = {
            code:403,
            message:`该用户名不存在！`
        }
    }

    //密码错误
    if( user.passWord !== md5(password) ) {
        ctx.body = {
            code:403,
            message:`密码错误！`
        }
    } 

    //密码正确
    else {
        
    }

};


module.exports = {
    signup,
    login
}
