//数据库Model的一些帮助类
const Model = {
    fields: {
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
    },
    updateDate: model => {
        model.pre('save', function (next) {
            const now = Date.now();
            if (this.isNew) {
                this.createAt = now;
            }
            this.updateAt = now;
            next();
        });
    }
};

module.exports = {
    Model
};