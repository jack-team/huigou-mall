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
    async splitPage(page = 1, limit = 0) {
        const total = await this.count();
        const start = total - (( page - 1 ) * limit);
        const fields = {
            categoryName: true,
            categoryId: true,
            limit: true,
            subCategory: true,
            _id: false,
            createAt: true,
            _index:true
        };
        return await this.find({
            _status: 1,
            _index: {
                $lt: start + 1
            }
        }, fields).sort({
            _index:-1
        }).
        limit(limit).
        exec().
        then(queryList => {
            return queryList.map(item => {
                const obj = {};
                const { createAt } = item;
                Object.keys(fields).forEach(field => {
                    if(fields[field]) obj[field] = item[field];
                });
                obj.createAt = formatTime(createAt);
                return obj;
            });
        });
    },

    async updateCategory(id, update) {
        const options = {
            returnNewDocument: true
        };
        const query = {
            categoryId: id,
            _status: 1
        };
        update = {
            $set: update
        };
        return await this.findOneAndUpdate(
            query,
            update,
            options
        ).exec().then(async function (Category) {
            if (Category) {
                return await Category.save();
            }
            throw '该分类已被删除！'
        });
    }
};

mongoose.model('MallCategory', CategorySchema);
//-------------------------------------------华丽的分割线-----------------------------------------------

