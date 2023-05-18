const path = require("path")
const fs = require('fs')

exports.removeImages = (filePath) => {
  filePath = path.join(__dirname, '../..', filePath)
  fs.unlink(filePath, err => console.log(err));
}