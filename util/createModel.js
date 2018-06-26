const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const {
    autoUpdateTime,
    mergeMethods,
    mergeStatics,
} = require('./../util/modelPlugin');

module.exports = fields => {
    //默认的字段
    const baseFields = {
        //创建时间
        createAt: {
            type: Date,
            default: Date.now()
        },
        //更新时间
        updateAt: {
            type: Date,
            default: Date.now()
        }
    };
    const modelFields = Object.assign(fields, baseFields);
    const model = new Schema(modelFields);
    model.plugin(autoUpdateTime);
    model.plugin(mergeMethods);
    model.plugin(mergeStatics);
    return model;
};