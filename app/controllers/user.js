const mongoose = require('mongoose');
const AdminUser = mongoose.model('AdminUser');
const md5 = require('../../util/md5');

//验证账号和密码
const vailPara = (ctx, para) => {
    const rules = {};
    Object.keys(para).forEach(key => {
        rules[key] = {
            value: para[key],
            rule: {
                required: true,
                length: [6, 20]
            }
        }
    });
    return ctx.validator(rules);
};

/*
*  用户注册
*  userName:string
*  passWord:string
*/

exports.signUp = async function (ctx) {
    const {
        methods
    } = ctx;

    const {
        userName,
        passWord
    } = methods.getPara();

    //验证字段
    const message = vailPara(ctx, {
        userName,
        passWord
    });

    //验证字段
    if (!!message) {
        return ctx.body = (
            methods.format({
                code: 500,
                message: message
            })
        )
    }

    try {
        const user = (
            await AdminUser.getUserByName(userName)
        );
        if (!!user) {
            return ctx.body = (
                methods.format({
                    code: 500,
                    message: '用户名已存在！'
                })
            );
        }
        //创建新用户 默认不为管理员权限
        await AdminUser.createUser({
            userName: userName,
            passWord: md5(passWord)
        });
        return ctx.body = (
            methods.format({
                code: 200,
                message: '注册成功！'
            })
        );
    }
    catch (err) {
        return ctx.body = methods.format({
            code: 500,
            message: `${err}`
        })
    }
};

/*
*  用户登录
*  userName:string
*  passWord:string
*/
exports.signIn = async function (ctx) {
    const {
        methods
    } = ctx;
    const {
        userName,
        passWord
    } = methods.getPara();

    //验证字段
    const message = vailPara(ctx, {
        userName,
        passWord
    });

    //返回错误
    if (!!message) {
        return ctx.body = (
            methods.format({
                code: 500,
                message: message
            })
        )
    }

    try {
        const loginUser = (
            await AdminUser.getUserByName(userName)
        );

        if (!loginUser) {
            return ctx.body = (
                methods.format({
                    code: 500,
                    message: `用户名不存在！`
                })
            )
        }

        //验证密码
        if (md5(passWord) !== loginUser.passWord) {
            return ctx.body = (
                methods.format({
                    code: 500,
                    message: `密码错误！`
                })
            )
        }

        //将用户存入会话
        const userInfo = methods.saveUser(loginUser);

        //更新登录时间
        loginUser.loginAt = Date.now();
        await loginUser.save();

        return ctx.body = (
            methods.format({
                code: 200,
                data: userInfo,
                message: `登录成功！`
            })
        )
    }
    catch (err) {
        return ctx.body = (
            methods.format({
                code: 500,
                message: `${err}`
            })
        )
    }
};


/*
*  退出登录
*/
exports.signOut = async function (ctx) {
    const {
        methods
    } = ctx;
    methods.deleteUser();
    return ctx.body = (
        methods.format({
            code: 200,
            message: `退出成功！`
        })
    )
};


/*
*  更新用户信息
*  nickName:string
*  avatarUrl:string
*/
exports.updateUser = async function (ctx) {
    const {
        methods,
        validator
    } = ctx;
    const {
        nickName,
        avatarUrl
    } = methods.getPara();

    const message = validator({
        nickName: {
            value: nickName,
            rule: {
                required: true,
                length: [2]
            }
        },
        avatarUrl: {
            value: avatarUrl,
            rule: {
                required: true
            }
        }
    });

    if (!!message) {
        return ctx.body = (
            methods.format({
                code: 500,
                message
            })
        )
    }

    const {
        accessToken
    } = methods.baseUser();

    const update = {
        nickname: nickName,
        avatar: avatarUrl
    };

    try {
        const updateUser = (
            await AdminUser.updateUser(accessToken, update)
        );
        const userInfo = methods.saveUser(updateUser);
        ctx.body = (
            methods.format({
                code: 200,
                data: userInfo,
                message: '更新成功！'
            })
        )
    }
    catch (err) {
        ctx.body = (
            methods.format({
                code: 500,
                message: `${err}`
            })
        )
    }
};


/*
*  修改密码
*  oldPassword:string
*  newPassword:string
*/
exports.updatePassword = async function (ctx) {
    const {
        methods
    } = ctx;

    const {
        oldPassword,
        newPassword
    } = methods.getPara();

    const message = vailPara(ctx, {
        oldPassword,
        newPassword
    });

    if (!!message) {
        return ctx.body = methods.format({
            code: 500,
            message
        });
    }

    const {
        accessToken
    } = methods.baseUser();

    try {

        const user = (
            await AdminUser.getUserByToken(accessToken)
        );

        if (md5(oldPassword) !== user.passWord) {
            return ctx.body = (
                methods.format({
                    code: 500,
                    message: '密码错误！'
                })
            )
        }

        if (oldPassword === newPassword) {
            return ctx.body = (
                methods.format({
                    code: 500,
                    message: '新旧密码不能相同！'
                })
            );
        }

        user.passWord = md5(newPassword);
        await user.save();

        ctx.body = (
            methods.format({
                code: 200,
                message: `修改成功！`
            })
        );
    }

    catch (err) {
        ctx.body = (
            methods.format({
                code: 500,
                message: `${err}`
            })
        );
    }
};


/*
*  获取所有用户列表
*/

exports.getUsers = async function () {
    const {
        methods
    } = ctx;

    let {
        page = 1,
        pageSize = 20,
    } = methods.getPara();

    const message = validator({
        page: {
            value: page,
            rule: {
                required: true,
                number: true
            }
        },
        pageSize: {
            value: pageSize,
            rule: {
                required: true,
                number: true
            }
        }
    });

    if (!!message) {
       return ctx.body = (
            methods.format({
                code: 500,
                message: message
            })
        );
    }

    const total = await AdminUser.count({

    });





};

