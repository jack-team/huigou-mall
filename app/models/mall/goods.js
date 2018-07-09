const mongoose = require('mongoose');
const uuid = require('uuid');
const createModel = require('../../../util/createModel');

const GoodSchema = createModel({
    //分类id
    categoryId: {
        type: String
    },
    //商品名称
    goodsName: {
        type: String
    },
    //商品Id
    goodsId: {
        type: String,
        unique: true
    },
    //商品价格
    price: {
        type: Number
    },
    //商品库存
    stock: {
        type: Number
    },
    //上架时间
    liveStart: {
        type: Date
    },
    //下架时间
    liveEnd: {
        type: Date
    },
    //封面图片
    cover: {
        type: String
    },
    //banner图片
    banners: {
        type: Array
    },
    //详情
    desc: {
        type: String
    },
    // 排序
    limit: {
        type: Number,
        default: 0
    },
    //创建人存入username
    createUser: {
        type: String
    },
    //更新人存入username
    updateUser: {
        type: String
    },
    //索引
    _index: {
        type: Number,
        default: 0
    },
    //这条数据的状态，0为删除 ,1为未上架， 2已上架
    _status: {
        type: Number,
        default: 1
    }
});

GoodSchema.statics.setMethods({
    //结果返回的字段
    resultFields: {
        _id: false,
        _index: false,
        // _status: false,
        __v: false
    },

    //创建商品
    async createGoods(categoryId, fields = {}) {
        const upKeyModel = this.model('UpKey');
        const onlyIndex = await upKeyModel.createKey('mallGoods');
        const goods = new this({
            categoryId: categoryId,
            goodsId: uuid.v4(),
            goodsName: fields.goodsName,
            price: fields.price,
            stock: fields.stock,
            liveStart: fields.liveStart,
            liveEnd: fields.liveEnd,
            cover: fields.cover,
            banners: fields.banners,
            desc: fields.desc,
            limit: fields.limit,
            updateUser: fields.updateUser,
            createUser: fields.createUser,
            _index: onlyIndex,
            _status: 1
        });
        return await goods.save();
    },

    //分页
    async splitPage(page = 1, limit = 0, filters) {
        const filter = {
            ...filters,
            _status: {
                $gt: 0
            }
        };

        const skipNum = (page - 1) * limit;
        return await this.find(
            filter,
            this.resultFields
        ).skip(skipNum).sort({
            _index: -1
        }).limit(limit).exec()
    },

    //通过id获取商品
    async getGoodsById(id) {
        const query = {
            goodsId: id,
            _status: {
                $gt: 0
            }
        };
        return await this.findOne(
            query,
            this.resultFields
        ).exec();
    },

    //更新商品
    async updateGoods(goodsId, updateFields) {
        const options = {
            new: true,
            projection: this.resultFields
        };
        const query = {
            _status: {
                $gt: 0
            },
            goodsId: goodsId
        };
        const updateOpts = {$set: updateFields};
        const category = await this.findOneAndUpdate(
            query,
            updateOpts,
            options
        ).exec();
        if (category) return category;
        throw '该商品不存在！'
    }
});

mongoose.model('MallGoods', GoodSchema);