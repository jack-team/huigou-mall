const moment = require('moment');
const copy = json => JSON.parse(JSON.stringify(json));

module.exports = {
    autoUpdateTime: schema => {
        const hooks = [
            `save`,
            `update`,
            `findOneAndUpdate`
        ];
        //更新一些时间字段
        hooks.forEach(hook => (
            schema.pre(hook, function (next) {
                const now = Date.now();
                const isUpdate = new RegExp(`update`, `i`).test(hook);
                //如果是更新
                if (isUpdate) {
                    if (!this._update.$set) {
                        this._update.$set = {};
                    }
                    this._update.$set.updateAt = now;
                }
                else {
                    this.updateAt = now;
                    if (this.isNew) {
                        this.createAt = now
                    }
                }
                next();
            })
        ));
    },
    mergeStatics: schema => {

        schema.statics.setMethods = methods => (
            schema.statics = Object.assign(
                schema.statics,
                methods
            )
        );
    },
    mergeMethods: schema => {
        schema.methods.getItem = function () {
            const item = copy(this._doc);
            if (item._status) {
                item.status = item._status;
                delete item._status;
            }
            return item;
        };
        schema.methods.formatTime = function (keys) {
            const format = {};
            const curItem = this.getItem();
            keys = keys || [`createAt`, `updateAt`];
            keys.forEach(key => {
                const value = curItem[key];
                if (!!value) {
                    format[key] = moment(value).format(`YYYY-MM-DD HH:mm:ss`);
                }
            });
            return format;
        };
        schema.methods.setMethods = methods => (
            schema.methods = Object.assign(
                schema.methods,
                methods
            )
        )
    }
};