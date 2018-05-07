const mongoose = require('mongoose');
const Category = mongoose.model('MallCategory');
const MallGoods = mongoose.model('MallGoods');
const UpKey = mongoose.model('UpKey');

/*
*  添加分类
*  categoryName:string
*  limit:int
*/
exports.categoryAdd = async function (ctx) {
    const { methods, validator } = ctx;
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
*  searchName:String
*/
exports.categoryList = async function (ctx) {
    const {methods, validator} = ctx;
    let {
        page,
        pageSize,
        searchName
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
    searchName = searchName || '';
    const searchKey = {
        categoryName: {
            $regex: new RegExp(searchName, 'i')
        }
    };
    try {
        const total = await Category.count({
            _status: 1,
            ...searchKey
        });
        const pageTotal = Math.ceil(total / pageSize);
        const resultList = await Category.splitPage(page, pageSize, searchKey);
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
        const item = await Category.updateCategory(categoryId, {
            categoryName,
            limit
        });
        ctx.body = methods.format({
            code: 200,
            data: item,
            message: `修改成功！`
        });
    } catch (err) {
        let err_msg = err.errmsg;
        switch (err.code) {
            case 11000:
                err_msg = '已存在该分类名称！';
                break;
        }
        return ctx.body = methods.format({
            code: 500,
            message: `${err_msg}`
        });
    }
};


/*
*  删除分类
*  categoryId:string
*/
exports.categoryDelete = async function (ctx) {
    const {methods, validator} = ctx;
    let {
        categoryId
    } = methods.getPara();

    const message = validator({
        categoryId: {
            value: categoryId,
            rule: {
                required: true
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
            _status: 0
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

/*
*  添加商品
*  categoryId string
*  goodsName string
*  price number
*  stock number
*  liveStart Date
*  liveEnd Date
*  cover string
*  banners array
*  desc string
*/

exports.goodsAdd = async function ( ctx ) {
    const {
        methods,
        validator
    } = ctx;
    const {
        categoryId,
        goodsName,
        price,
        stock,
        liveStart,
        liveEnd,
        cover,
        banners,
        desc
    } = methods.getPara();

    const message = validator({
        categoryId:{
            value:categoryId,
            rule:{
                required:true
            }
        },
        goodsName:{
            value:goodsName,
            rule:{
                required:true
            }
        },
        price:{
            value:price,
            rule:{
                required:true,
                number:true
            }
        },
        stock:{
            value:stock,
            rule:{
                required:true,
                number:true
            }
        },
        liveStart:{
            value:liveStart,
            rule:{
                required:true,
                isDate:true
            }
        },
        liveEnd:{
            value:liveEnd,
            rule:{
                required:true,
                isDate:true
            }
        },
        cover:{
            value:cover,
            rule:{
                required:true
            }
        },
        banners:{
            value:banners,
            rule:{
                required:true
            }
        },
        desc:{
            value:desc,
            rule:{
                required:true
            }
        }
    });
    if(!!message) {
        return ctx.body = methods.format({
            code:500,
            message:message
        })
    }
    try {
        await MallGoods.createGoods(categoryId,{
            goodsName,
            price,
            stock,
            liveStart,
            liveEnd,
            cover,
            banners,
            desc
        });
        return ctx.body = methods.format({
            code:200,
            message:'保存成功！'
        })
    }
    catch (e) {
        return ctx.body = methods.format({
            code:500,
            message:`${e}`
        })
    }
};

/*
*  获取商品列表
*  page number
*  pageSize number
*  keyWords string
*/

exports.goodsList = ctx => {
    const {
        methods,
        validator
    } = ctx;
    const {
       page,
       pageSize,
       keyWords
    } = methods.getPara();

    const message = validator({
        page:{
            value:page,
            rule:{
                required:true,
                number:true
            }
        },
        pageSize:{
            value:pageSize,
            rule:{
                required:true,
                number:true
            }
        },
        keyWords:{
            value:keyWords,
            rule:{
                required:true
            }
        }
    });

    if(!!message) {
        ctx.body =  methods.format({
            code:500,
            message:message
        })
    }



};
