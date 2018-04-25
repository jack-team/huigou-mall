const mongoose = require('mongoose');
const {Schema} = mongoose;
const {Model} = require('./../help');

const UpKeySchema = new Schema({
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
    ...Model.fields
});

//更新时间
Model.updateDate(UpKeySchema);

UpKeySchema.statics = {
    createKey: async function (id) {
        const options = {
            new: true,
            upsert: true,
            returnNewDocument: true
        };
        const { upIndex } = await this.findOneAndUpdate({ id }, {
            $inc: {upIndex: 1}
        }, options);
        return upIndex;
    }
};

mongoose.model('UpKey', UpKeySchema);






