const mongoose = require('mongoose');
const Category = mongoose.model('MallCategory');
const UpKey = mongoose.model('UpKey');

/*
*  添加分类
*  categoryName:string
*  limit:int
*/
exports.categoryAdd = async function (ctx) {
    const {methods, validator} = ctx;
    const {
        categoryName,
        limit
    } = methods.getPara();

    const message = validator({
        categoryName: {
            value: categoryName,
            rule: {
                required: true,
                length: [2]
            },
        },
        limit: {
            value: limit,
            rule: {
                required: true,
                number: true
            }
        }
    });

    if (!!message) {
        return ctx.body = methods.format({
            code: 500,
            message
        });
    }

    try {
        const has = !!await Category.getItemByName(categoryName);
        if (has) {
            return ctx.body = methods.format({
                code: 500,
                message: `该分类已存在！`
            });
        }
        const onlyIndex = await UpKey.createKey(`mallCategory`);
        const category = await Category.createCategory({
            categoryName: categoryName,
            limit: limit,
            _index: onlyIndex
        });
        return ctx.body = methods.format({
            code: 200,
            data: category,
            message: `添加成功！`
        });

    } catch (err) {
        return ctx.body = methods.format({
            code: 500,
            message: `${err}`
        });
    }
};

/*
*  获取分类列表
*  page:number
*  pageSize:number
*/
exports.categoryList = async function (ctx) {
    const {methods, validator} = ctx;

    let {
        page,
        pageSize
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
        return ctx.body = methods.format({
            code: 500,
            message
        });
    }

    page = parseInt(page);
    pageSize = parseInt(pageSize);

    try {
        const total = await Category.count({_status:1});
        const pageTotal = Math.ceil(total / pageSize);
        const resultList = await Category.splitPage(page, pageSize);
        ctx.body = methods.format({
            code: 200,
            data: {
                list: resultList,
                page,
                pageSize,
                pageTotal
            }
        });
    } catch (err) {
        return ctx.body = methods.format({
            code: 500,
            message: `${err}`
        });
    }
};

/*
*  编辑分类
*  categoryId:string
*  categoryName:string
*  limit:int
*/
exports.categoryEditor = async function (ctx) {
    const {methods, validator} = ctx;
    let {
        categoryId,
        categoryName,
        limit
    } = methods.getPara();

    const message = validator({
        categoryId: {
            value: categoryId,
            rule: {
                required: true
            }
        },
        categoryName: {
            value: categoryName,
            rule: {
                required: true
            }
        },
        limit: {
            value: limit,
            rule: {
                required: true,
                number: true
            }
        }
    });
    if (!!message) {
        return ctx.body = methods.format({
            code: 500,
            message
        });
    }
    try {
        await Category.updateCategory(categoryId, {
            categoryName,
            limit
        });
        ctx.body = methods.format({
            code: 200,
            message: `修改成功！`
        });
    } catch (err) {
        return ctx.body = methods.format({
            code: 500,
            message: `${err}`
        });
    }
};


/*
*  删除分类
*  categoryId:string
*/
exports.categoryDelete = async function (ctx) {
    const { methods, validator } = ctx;
    let {
        categoryId
    } = methods.getPara();

    const message = validator({
        categoryId:{
            value:categoryId,
            rule:{
                required:true
            }
        }
    });
    if(!!message) {
        return ctx.body = methods.format({
            code: 500,
            message
        });
    }
    try {
        await Category.updateCategory(categoryId, {
            _status:0
        });
        ctx.body = methods.format({
            code: 200,
            message: `删除成功！`
        });
    } catch (err) {
        return ctx.body = methods.format({
            code: 500,
            message: `${err}`
        });
    }
};