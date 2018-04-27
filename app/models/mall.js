const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uuid = require('uuid');
const {Model} = require('./../help');
const formatTime = require('./../../util/formatTime');

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

//结果返回的字段
const resultFields = {
    categoryName: true,
    categoryId: true,
    limit: true,
    subCategory: true,
    _id: false,
    createAt: true,
    updateAt: true
};

const formatItem = item => {
    const format = {};
    const {createAt, updateAt} = item;
    Object.keys(resultFields).forEach(field => {
        if (resultFields[field]) {
            format[field] = item[field];
        }
    });
    format.createAt = formatTime(createAt);
    format.updateAt = formatTime(updateAt);
    return format;
};

//数据方法
CategorySchema.statics = {
    async getItemByName(name) {
        return await this.findOne({
            categoryName: name
        }).exec();
    },

    //创建分类
    async createCategory(fields = {}) {
        fields = Object.assign({
            categoryId: uuid.v1(),
            _status: 1,
            subCategory: []
        }, fields);
        const category = new this(fields);
        await category.save();
        return fields;
    },

    //分页
    async splitPage(page = 1, limit = 0, keyword) {
        const total = await this.model('UpKey').getKey('mallCategory');
        const start = total - ((page - 1) * limit);
        const filter = {
            _status: 1,
            _index: {
                $lt: start + 1
            },
            ...keyword
        };
        return await this.find(
            filter,
            resultFields
        ).sort({
            _index: -1
        }).limit(limit).exec().then(queryList => {
            return queryList.map(item =>
                formatItem(item)
            );
        });
    },

    //更新
    async updateCategory(id, update) {
        const options = {
            new:true
        };

        const query = {
            _status: 1,
            categoryId: id
        };

        const updateOpts = {
            $set: update
        };

        const category = await this.findOneAndUpdate(
            query,
            updateOpts,
            options
        );

        if (category) {
            return formatItem(await category.save({
                new:true
            }));
        }
        throw '该分类已被删除！'
    }
};

mongoose.model('MallCategory', CategorySchema);
//-------------------------------------------华丽的分割线-----------------------------------------------

