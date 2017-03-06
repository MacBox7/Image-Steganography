let electron = require('electron');
let fs = require('fs');
let remote = electron.remote;
let app = remote.app;
let dialog = remote.dialog;

module.exports = {
    openFile: function(callback) {
        dialog.showOpenDialog({
            filters: [{
                name: 'Images',
                extensions: ['jpg', 'png', 'bmp'],
            }],

        }, function(fileNames) {
            if (fileNames === undefined) return;
            let filePath = fileNames[0];
            return callback(filePath);
        });
    },

    saveFile: function(filePath) {
        dialog.showSaveDialog(function(fileName) {
            if (fileName === undefined) {
                alert('File not saved');
                return;
            }
            fs.createReadStream(filePath).pipe(fs.createWriteStream(fileName));
            alert('File Saved Successfully');
        });
    },

    getAppPath: function() {
        return app.getAppPath();
    },
};
