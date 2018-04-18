const fs = require('fs');
const path = require('path');

const walk = modelPath => {
    fs.readdirSync(modelPath).forEach(file => {
        const filePath = path.join(modelPath, '/' + file);
        const stat = fs.statSync(filePath);
        if (stat.isFile()) {
            if (/(.*)\.(js|coffee)/.test(file)) {
                require(filePath);
            }
        }
        else if (stat.isDirectory()) {
            walk(filePath);
        }
    })
};

module.exports = walk;

