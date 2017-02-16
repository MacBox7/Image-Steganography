var utility = require('../js/utility')
var PythonShell = require('python-shell');

var messageImage = document.getElementById('img-message')
var carrierImage = document.getElementById('img-carrier')
var encryptedImage = document.getElementById('img-encrypted')
var mergeButton = document.getElementById('btn-merge')
var downloadButton = document.getElementById('btn-download')
var carrierImagePath, messageImagePath


messageImage.addEventListener('click', function () {
    utility.openFile(function (filePath) {
        messageImage.src = filePath
        messageImagePath = filePath
    })
})

carrierImage.addEventListener('click', function () {
    utility.openFile(function (filePath) {
        carrierImage.src = filePath
        carrierImagePath = filePath
    })
})

downloadButton.addEventListener('click', function () {
    utility.saveFile(carrierImagePath)
})

mergeButton.addEventListener('click', function () {
    embedImage()

    var options = {
        mode: 'text',
        scriptPath: '/media/ankit/Pandora\'s Box/Code Stuff/Development/Image-Steganography/scripts',
        args: ['embed', '-m ' + messageImagePath, '-I ' + 0, '-i ' + carrierImagePath, '-p ' + 0]
    }

    PythonShell.run('runner.py', options, function (err, results) {
        if (err) throw err;
        // results is an array consisting of messages collected during execution 
    })
})

function embedImage() {

    messageImage.src = ''
    messageImage.alt = ''
    carrierImage.src = ''
    carrierImage.alt = ''

    TweenMax.to(messageImage, 1.5, {
        height: '10vh',
        top: '40vh',
        ease: Back.easeOut,
        width: '40vh',
        right: '40%'
    })

    TweenMax.fromTo(carrierImage, 1.5, {
        right: '80%'
    }, {
        height: '10vh',
        top: '40vh',
        ease: Back.easeOut,
        width: '40vh',
        right: '40%',
        onComplete: function () {
            TweenMax.set(messageImage, {
                display: 'none'
            })
            TweenMax.set(carrierImage, {
                display: 'none'
            })
            TweenMax.fromTo(encryptedImage, 1.5, {
                height: '10vh',
                top: '40vh',
                width: '40vh',
                right: '40%'
            }, {
                autoAlpha: 1,
                ease: Back.easeOut,
                top: '20vh',
                display: 'block',
                height: '50vh',
                width: '50vh',
                right: '37%',
                onComplete: function () {
                    downloadButton.style.display = 'block'
                    mergeButton.style.display = 'none'
                    encryptedImage.src = carrierImagePath
                }
            })
        }
    })

}