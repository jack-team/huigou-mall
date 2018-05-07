module.exports = function (schema) {
    const hooks = [`save`, `update`, `findOneAndUpdate`];
    for (let i = 0; i < hooks.length; i++) {
        schema.pre(hooks[i], function (next) {
            const now = Date.now();
            const isUpdate = new RegExp('update', 'i').test(this.op);
            if (isUpdate) {
                const {$set} = this._update;
                this._update = {
                    $set: {
                        ...$set,
                        updateAt: now
                    }
                }
            }
            else {
                if (this.isNew) {
                    this.createAt = now
                }
                this.updateAt = now;
            }
            next();
        })
    }
    schema.statics.setMethods = methods => (
        schema.statics = Object.assign(
            schema.statics,
            methods
        )
    );
};