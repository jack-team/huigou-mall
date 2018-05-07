//数据库Model的一些帮助类
const formatTime = require('./../util/formatTime');
const Model = {
    output: input => {
        if (!input) return input;
        const isArray = Array.isArray(input);
        input = isArray ? input : [input];
        const output = input.map(item => {
            const document = item._doc;
            return {
                ...document,
                createAt: formatTime(document.createAt),
                updateAt: formatTime(document.updateAt)
            }
        });
        return isArray ? output : output[0];
    }
};

module.exports = {
    Model
};