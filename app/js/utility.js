const electron = require('electron')
var fs = require('fs');
var remote = electron.remote
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
            fs.createReadStream(filePath, function () {
                if (filePath === undefined) {
                    alert('File not saved')
                }
            }).pipe(fs.createWriteStream(fileName, function () {
                alert('File saved successfully')
            }))
        })
    }
}