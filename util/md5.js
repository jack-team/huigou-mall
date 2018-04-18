const crypto = require('crypto');

module.exports= str => {
    const md5Str = crypto.createHash('md5').update(str).digest('hex');
    return md5Str;
}