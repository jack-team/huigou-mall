const fs = require('fs');
const path = require('path');

const walk = (modelPath, blackList = []) => {
    fs.readdirSync(modelPath).forEach(file => {
        const filePath = path.join(modelPath, `/${file}`);
        const stat = fs.statSync(filePath);
        const fileIndex = blackList.findIndex(fileName => `${fileName}.js` === file);
        if (stat.isFile() && fileIndex < 0) {
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

