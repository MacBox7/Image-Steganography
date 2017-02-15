const electron = require('electron')
var fs = require('fs');
var remote = electron.remote
var dialog = remote.dialog;

module.exports = {
    openFile: function (callback) {
        dialog.showOpenDialog({
            filters: [{
                name: 'Images',
                extensions: ['jpg', 'png', 'bmp']
            }],

        }, function (fileNames) {
            if (fileNames === undefined) return;
            var filePath = fileNames[0];
            return callback(filePath)
        })
    }
}