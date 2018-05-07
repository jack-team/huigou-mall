const baseValidator = require('validator');
const keys = obj => Object.keys(obj);
const trim = (str = ``) => str.trim();
const moment = require('moment');

const vailRules = {
    //验证为空
    required(value){
        if (vailRules.string(value).result) {
            value = trim(value);
        }
        const result = (!!value || value === 0);
        return {
            result,
            message: 'must be a required！'
        };
    },
    //验证为数字
    number(value){
        const type = typeof value;
        const result = (type.toLocaleUpperCase() === "NUMBER" || !isNaN(value));
        return {
            result,
            message: 'must be a Number！'
        };
    },
    //验证为字符串
    string(value){
        const type = typeof value;
        const result = type.toLocaleUpperCase() === "STRING";
        return {
            result,
            message: 'must be a String！'
        };
    },
    length (value, range = []) {
        let result = false;
        const min = range[0] || 0,
            max = range[1];
        try {
            result = baseValidator.isLength(`${value}`, {min, max});
        } catch (err) {
            result = false;
        }
        const isUp = !max;
        const message = isUp ? `length range must not be less than ${min}` :
            `length range must be between ${min} and ${max}`;
        return {
            result,
            message
        }
    },
    isArray(value){
        return Array.isArray(value)
    },
    object(value){
        let result = false;
        if(!vailRules.isArray(value)) {
            const type = typeof value;
            result =  type.toLocaleUpperCase() === "OBJECT";
        }
        return {
            result,
            message:`must be a object！`
        };
    },
    isDate(value){
        const result = moment(value).isValid();
        return {
            result,
            message:`must be a object！`
        };
    }
};

const validator = (rules = {}) => {
    let err_msg = null;
    keys(rules).some(field => {
        const {value, rule} = rules[field] || {};
        return keys(rule).some(name => {
            const handel = vailRules[name];
            if (!handel) return false;
            const {
                result,
                message
            } = handel(value, rule[name]);
            if (!result) {
                err_msg = `field(${field}) ${message}`;
                return true
            }
        });
    });
    return err_msg;
};

module.exports = async (ctx, next) => {
    ctx.validator = validator;
    return next();
};
