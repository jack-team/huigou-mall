const mongoose = require('mongoose');
const {Schema} = mongoose;
const createModel = require('./../../../util/createModel');

const UpKeySchema = createModel({
    //自增索引
    upIndex: {
        type: Number,
        default: 0
    },
    //唯一标识
    id: {
        type: String,
        unique: true
    },
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
});

UpKeySchema.statics.setMethods({
    async createKey (id) {
        const options = {
            new: true,
            upsert: true,
            returnNewDocument: true
        };
        const {
            upIndex
        } = await this.findOneAndUpdate({id}, {
            $inc: { upIndex: 1 }
            }, options
        );
        return upIndex;
    },
    async getKey(id) {
        const {
            upIndex
        } = await this.findOne({id});
        return upIndex;
    }
});

mongoose.model('UpKey', UpKeySchema);






