const mongoose = require('mongoose');
const uuid = require('uuid');
const createModel = require('../../../util/createModel');

//商品分类模块
const CategorySchema = createModel({
    //分类名称
    categoryName: {
        type: String,
        unique: true
    },
    //排序，数字越大越靠前
    limit: {
        type: Number,
        default: 1
    },
    //分类id
    categoryId: {
        type: String,
        unique: true
    },
    //子分类
    subCategory: {
        type: Array,
        default: []
    },
    //索引
    _index: {
        type: Number,
        default: 0
    },
    //这条数据的状态，1为正常，0为删除
    _status: {
        type: Number,
        default: 1
    }
});

//数据方法
CategorySchema.statics.setMethods({

    /*结果返回的字段*/
    resultFields: {
        categoryName: true,
        categoryId: true,
        limit: true,
        subCategory: true,
        createAt: true,
        updateAt: true,
        _id: false
    },

    /*通过 categoryName 获取单个分类*/
    async getItemByName(name) {
        const {
            resultFields
        } = this;
        return await this.findOne({
            categoryName: name
        }, resultFields).exec();
    },

    /*通过categoryId 查询*/
    async getItemById(categoryId) {
        const {
            resultFields
        } = this;
        return await this.findOne({
            categoryId: categoryId
        }, resultFields).exec();
    },

    /*创建分类*/
    async createCategory(fields = {}) {
        const category = new this(
            Object.assign({
                categoryId: uuid.v1(),
                _status: 1,
                subCategory: []
            }, fields),
        );
        return await category.save().exec()
    },

    //分页
    async splitPage(page = 1, limit = 0, filters) {
        const filter = {
            _status: 1,
            ...filters,
        };
        const skipNum = (page - 1) * limit;
        return await this.find(
            filter,
            this.resultFields
        ).skip(skipNum).sort({
            _index: -1
        }).limit(limit).exec();
    },

    //更新
    async updateCategory(id, update) {
        const options = {
            new: true,
            projection: this.resultFields
        };
        const query = {_status: 1, categoryId: id};
        const updateOpts = {$set: update};
        const category = await this.findOneAndUpdate(
            query,
            updateOpts,
            options
        ).exec();
        if (category) return category;
        throw '没有这个分类！'
    }
});

mongoose.model('MallCategory', CategorySchema);


