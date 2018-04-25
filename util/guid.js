/**
 * guid模块提供生成唯一值ID，用于token生成等。
 * @module guid
 */
module.exports = {
    create: function() {
        return 'xxxxyxxxxyxyyxyxyyyxxxyyyxxyyxy'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0,
                v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        }).toUpperCase();
    }
};