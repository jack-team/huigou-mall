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

    const {
        methods,
        validator
    } = ctx;

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

        const {
            userName
        } = methods.baseUser();

        const onlyIndex = await UpKey.createKey(`mallCategory`);
        let category = await Category.createCategory({
            categoryName: categoryName,
            limit: limit,
            _index: onlyIndex,
            createUser: userName,
            updateUser: userName
        });

        category = {
            ...category.getItem(),
            ...category.formatTime()
        };

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

        const list = resultList.map((item) => {
            const curItem = item.getItem();
            const formatTimes = item.formatTime();
            return {
                ...curItem,
                ...formatTimes
            }
        });

        ctx.body = methods.format({
            code: 200,
            data: {
                list: list,
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
    const {
        methods,
        validator
    } = ctx;
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
        const {
            userName
        } = methods.baseUser();
        const updateItem = await Category.updateCategory(categoryId, {
            categoryName,
            limit,
            updateUser: userName
        });
        const result = {
            ...updateItem.getItem(),
            ...updateItem.formatTime()
        };
        ctx.body = methods.format({
            code: 200,
            data: result,
            message: `修改成功！`
        });
    }
    catch (err) {
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
        const total = await MallGoods.count({
            _status: 2,
            categoryId: categoryId
        });

        if (total > 0) {
            return ctx.body = methods.format({
                code: 500,
                message: `该分类下存在未下架商品！`
            });
        }

        const {
            userName
        } = methods.baseUser();

        await Category.updateCategory(categoryId, {
            _status: 0,
            updateUser: userName
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

//-------------------------------------------------------------
const vailCommon = (validator, fields) => {
    const {
        categoryId,
        goodsName,
        price,
        stock,
        liveStart,
        liveEnd,
        cover,
        banners,
        desc,
        limit
    } = fields;

    return validator({
        categoryId: {
            value: categoryId,
            rule: {
                required: true
            }
        },
        goodsName: {
            value: goodsName,
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
        },
        price: {
            value: price,
            rule: {
                required: true,
                number: true
            }
        },
        stock: {
            value: stock,
            rule: {
                required: true,
                number: true
            }
        },
        liveStart: {
            value: liveStart,
            rule: {
                required: true,
                isDate: true
            }
        },
        liveEnd: {
            value: liveEnd,
            rule: {
                required: true,
                isDate: true
            }
        },
        cover: {
            value: cover,
            rule: {
                required: true
            }
        },
        banners: {
            value: banners,
            rule: {
                required: true
            }
        },
        desc: {
            value: desc,
            rule: {
                required: true
            }
        }
    });
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
*  limit number
*/

exports.goodsAdd = async function (ctx) {
    const {
        methods,
        validator
    } = ctx;

    const params = methods.getPara();

    const message = vailCommon(
        validator,
        params
    );

    if (!!message) {
        return ctx.body = methods.format({
            code: 500,
            message: message
        })
    }

    const {
        categoryId,
        goodsName,
        price,
        stock,
        liveStart,
        liveEnd,
        cover,
        banners,
        desc,
        limit
    } = params;

    try {
        const {
            userName
        } = methods.baseUser();
        await MallGoods.createGoods(categoryId, {
            goodsName,
            price,
            stock,
            liveStart,
            liveEnd,
            cover,
            banners,
            desc,
            limit,
            createUser: userName,
            updateUser: userName
        });
        return ctx.body = methods.format({
            code: 200,
            message: '保存成功！'
        })
    }
    catch (e) {
        return ctx.body = methods.format({
            code: 500,
            message: `${e}`
        })
    }
};

/*
*  获取商品列表
*  page number
*  pageSize number
*  filters object
*/

exports.goodsList = async function (ctx) {

    const {
        methods,
        validator
    } = ctx;

    let {
        page,
        pageSize,
        categoryId,
        goodsName,
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
            message: message
        })
    }

    //初始条件为状态不为删除
    const searchCategoryKey = {
        _status: 1
    };

    //初始化搜索商品状态不为删除
    const searchGoodsKey = {
        _status: 1
    };

    page = parseInt(page);
    pageSize = parseInt(pageSize);

    try {
        if (!!categoryId) {
            searchCategoryKey[`categoryId`] = categoryId;
        }

        //先查询出可用分类
        const someCategory = await Category.find(
            searchCategoryKey
        ).exec();

        const categoryIds = someCategory.map(item => (
            item.categoryId
        ));

        //如果没有查询到可用的分类,支付返回空数据
        if (!categoryIds.length) {
            return ctx.body = methods.format({
                data: {
                    list: [],
                    page,
                    pageSize,
                    pageTotal: 0
                }
            })
        }

        if (!!goodsName) {
            searchGoodsKey[`goodsName`] = {
                $regex: new RegExp(goodsName, 'i')
            }
        }

        searchGoodsKey[`categoryId`] = {
            $in: categoryIds
        };

        const total = await MallGoods.count(
            searchGoodsKey
        );

        const pageTotal = Math.ceil(total / pageSize);

        const list = (await MallGoods.splitPage(
            page,
            pageSize,
            searchGoodsKey
        )).map(item => ({
            ...item.getItem(),
            ...item.formatTime(),
        }));

        ctx.body = methods.format({
            data: {
                list: list,
                page,
                pageSize,
                pageTotal
            }
        })
    }
    catch (err) {
        ctx.body = methods.format({
            code: 500,
            message: `${err}`
        })
    }
};


/*
*  获取单个商品信息
*  id string
*/
exports.getDetail = async function (ctx) {
    const {
        methods,
        validator
    } = ctx;

    const {
        id
    } = methods.getPara();

    const message = validator({
        id: {
            value: id,
            rule: {
                required: true
            }
        },
    });

    if (!!message) {
        return ctx.body = methods.format({
            code: 500,
            message: message
        })
    }

    try {
        const goods = await MallGoods.getGoodsById(id);
        if (!!goods) {
            return ctx.body = methods.format({
                data: goods
            });
        }
        else {
            return ctx.body = methods.format({
                code: 404,
                message: `找不到该商品！`
            });
        }
    }
    catch (err) {
        ctx.body = methods.format({
            code: 500,
            message: `${err}`
        })
    }
};


/*
*  更新单个商品
*  goodsId string,
*  update object
*/

exports.updateDetail = async function (ctx) {
    const {
        methods,
        validator
    } = ctx;

    const {
        goodsId,
        update
    } = methods.getPara();

    const fieldErr = validator({
        goodsId: {
            value: goodsId,
            rule: {
                required: true,
                string: true
            }
        },
        update: {
            value: update,
            rule: {
                required: true,
                object: true
            }
        }
    });

    if (fieldErr) {
        return ctx.body = methods.format({
            code: 500,
            message: fieldErr
        });
    }

    const message = vailCommon(validator, update);

    if (message) {
        return ctx.body = methods.format({
            code: 500,
            message: message
        });
    }

    try {
        const item = await MallGoods.getGoodsById(goodsId);
        if (!item) {
            return ctx.body = methods.format({
                code: 500,
                message: `该商品不存在！`
            });
        }

        const {
            _status
        } = item;

        //如果是上架状态
        if (_status === 2) {
            return ctx.body = methods.format({
                code: 500,
                message: `该商品上架中，不能进行编辑！`
            });
        }
        const {
            userName
        } = methods.baseUser();

        await MallGoods.updateGoods(goodsId, {
            ...update,
            updateUser: userName
        });

        return ctx.body = methods.format({
            code: 200,
            message: `更新成功！`
        });
    } catch (err) {
        return ctx.body = methods.format({
            code: 500,
            message: `${err}`
        });
    }
};


/*
*  商品上下架
*  goodsId string
*/

exports.upOrDown = async function (ctx) {

    const {
        methods,
        validator
    } = ctx;

    const {
        goodsId
    } = methods.getPara();

    const fieldErr = validator({
        goodsId: {
            value: goodsId,
            rule: {
                required: true,
                string: true
            }
        }
    });

    if (!!fieldErr) {
        return methods.format({
            code: 500,
            message: fieldErr
        })
    }

    try {
        const curGoods = await MallGoods.getGoodsById(goodsId);
        if (!curGoods) {
            return ctx.body = methods.format({
                code: 500,
                message: `不存在该商品！`
            })
        }
        const {
            _status
        } = curGoods;

        const {
            userName
        } = methods.baseUser();

        let result = await MallGoods.updateGoods(goodsId, {
            _status: _status === 1 ? 2 : 1,
            updateUser:userName
        });

        result = {
            ...result.getItem(),
            ...result.formatTime()
        };

        return ctx.body = methods.format({
            data: result
        })
    }
    catch (e) {
        return ctx.body = methods.format({
            code: 500,
            message: `${e}`
        })
    }
};


/*
*  删除商品
*  goodsId string
*/
exports.deleteGoods = async function (ctx) {
    const {
        methods,
        validator
    } = ctx;

    const {
        goodsId
    } = methods.getPara();

    const fieldErr = validator({
        goodsId: {
            value: goodsId,
            rule: {
                required: true,
                string: true
            }
        }
    });

    if (!!fieldErr) {
        return ctx.body = methods.format({
            code: 500,
            message: fieldErr
        })
    }

    try {
        const findItem = await MallGoods.getGoodsById(goodsId);

        if (!findItem) {
            return ctx.body = methods.format({
                code: 500,
                message: `该商品不存在或已被删除！`
            })
        }

        //判断商品是否下架
        const {
            _status
        } = findItem;

        if (_status > 1) {
            return ctx.body = methods.format({
                code: 500,
                message: `请先下架该商品，再进行删除操作！`
            })
        }

        const {
            userName
        } = methods.baseUser();

        await MallGoods.updateGoods(goodsId, {
            _status: 0,
            updateUser:userName
        });

        ctx.body = methods.format({
            code: 200,
            message: `删除成功！`
        })
    }
    catch (e) {
        ctx.body = methods.format({
            code: 500,
            message: `${e}`
        })
    }
};

