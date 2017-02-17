const electron = require('electron')
var fs = require('fs');
var remote = electron.remote
const app = remote.app
var dialog = remote.dialog

module.exports = {
    openFile: function (callback) {
        dialog.showOpenDialog({
            filters: [{
                name: 'Images',
                extensions: ['jpg', 'png', 'bmp']
            }],

        }, function (fileNames) {
            if (fileNames === undefined) return
            var filePath = fileNames[0]
            return callback(filePath)
        })
    },

    saveFile: function (filePath) {
        dialog.showSaveDialog(function (fileName) {
            if (fileName === undefined) {
                alert('File not saved');
                return;
            }
            fs.createReadStream(filePath).pipe(fs.createWriteStream(fileName))
        })
    },

    getAppPath: function () {
        return app.getAppPath()
    }
}