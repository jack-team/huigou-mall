const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const guid = require('./../../util/guid');
const { Model } = require('./../help');

//商品分类模块
const CategorySchema = new Schema({
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
    },
    ...Model.fields
});

//更新时间
Model.updateDate(CategorySchema);

//数据方法
CategorySchema.statics = {
    async getItemByName (name) {
        return await this.findOne({
            categoryName: name
        }).exec();
    },
    async createCategory(fields = {}) {
        fields = Object.assign({
            categoryId:guid.create(),
            _status:1,
            subCategory:[]
        },fields);
        const category = new this(fields);
        await category.save();
        return fields;
    },
    async splitPage(start=1 , limit =0 ) {
        return await this.find({
            _index: {$gt: start - 1}
        }, {
            categoryName: true,
            categoryId: true,
            limit: true,
            subCategory: true,
            _id: false
        }).
        limit(limit).sort({
            _index: -1
        }).
        exec();
    }
};

mongoose.model('MallCategory', CategorySchema);
//-------------------------------------------华丽的分割线-----------------------------------------------

