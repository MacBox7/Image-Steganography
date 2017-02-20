var utility = require('../js/utility')
var PythonShell = require('python-shell')

var inputPanel = document.getElementById('inputPanel')
var messageImage = document.getElementById('img-message')
var carrierImage = document.getElementById('img-carrier')
var encryptedImage = document.getElementById('img-encrypted')
var mergeButton = document.getElementById('btn-merge')
var downloadButton = document.getElementById('btn-download')
var panelColorPlane = document.getElementById('panel-colorPlane')
var panelColorIndex = document.getElementById('panel-colorIndex')

var carrierImagePath, messageImagePath
var colorIndex, colorPlane

messageImage.addEventListener('click', function () {
    utility.openFile(function (filePath) {
        messageImage.src = filePath
        messageImagePath = filePath
    })
})

messageImage.addEventListener('mouseover', function () {
    TweenMax.to(this, 0.1, {
        boxShadow: "0 0 10px 10px #9feaf9",
        height: '+=10',
        width: '+=10',
        ease: Linear.easeNone
    })
})

messageImage.addEventListener('mouseout', function () {
    TweenMax.set(this, {
        clearProps: 'all'
    })
})

carrierImage.addEventListener('click', function () {
    utility.openFile(function (filePath) {
        carrierImage.src = filePath
        carrierImagePath = filePath
    })
})

carrierImage.addEventListener('mouseover', function () {
    TweenMax.to(this, 0.1, {
        boxShadow: "0 0 10px 10px #9feaf9",
        height: '+=10',
        width: '+=10',
        ease: Linear.easeNone
    })
})

carrierImage.addEventListener('mouseout', function () {
    TweenMax.set(this, {
        clearProps: 'all'
    })
})

inputPanel.addEventListener('mouseover', function () {

    TweenMax.set(mergeButton, {
        clearProps: 'height, width, boxShadow'
    })
    TweenMax.set(carrierImage, {
        clearProps: 'height, width, boxShadow'
    })
    TweenMax.set(messageImage, {
        clearProps: 'height, width, boxShadow'
    })
})

downloadButton.addEventListener('click', function () {
    utility.saveFile(carrierImagePath)
})

downloadButton.addEventListener('mouseover', function () {
    TweenMax.to(this, 0.1, {
        height: '+=5',
        width: '+=5',
        boxShadow: "0 0 5px 5px #9feaf9",
        ease: Linear.easeNone
    })
})

downloadButton.addEventListener('mouseout', function () {
    TweenMax.set(this, {
        clearProps: 'height, width, boxShadow'
    })
})

mergeButton.addEventListener('mouseover', function () {
    TweenMax.to(this, 0.1, {
        height: '+=5',
        width: '+=5',
        boxShadow: "0 0 5px 5px #9feaf9",
        ease: Linear.easeNone
    })
})

mergeButton.addEventListener('mouseout', function () {
    TweenMax.set(this, {
        clearProps: 'all'
    })
})

mergeButton.addEventListener('click', function () {
    colorIndex = getRadioVal('colorIndex')
    colorPlane = getRadioVal('colorPlane')

    if (carrierImagePath === undefined) {
        TweenMax.to(carrierImage, 0.1, {
            x: "+=20",
            yoyo: true,
            repeat: 5,
            borderColor: '#800000',
            boxShadow: "0 0 10px 10px #800000"
        })
        return
    } else if (messageImagePath === undefined) {
        TweenMax.to(messageImage, 0.1, {
            x: "+=20",
            yoyo: true,
            repeat: 5,
            borderColor: '#800000',
            boxShadow: "0 0 10px 10px #800000"
        })
        return
    } else if (colorPlane === undefined) {
        TweenMax.to(panelColorPlane, 0.1, {
            x: "+=20",
            yoyo: true,
            repeat: 5,
            borderColor: '#800000',
            boxShadow: "0 0 10px 10px #800000"
        })
        return
    } else if (colorIndex === undefined) {
        TweenMax.to(panelColorIndex, 0.1, {
            x: "+=20",
            yoyo: true,
            repeat: 5,
            borderColor: '#800000',
            boxShadow: "0 0 10px 10px #800000"
        })
        return
    }

    colorIndex = parseInt(colorIndex)
    colorPlane = parseInt(colorPlane)

    var options = {
        mode: 'text',
        scriptPath: utility.getAppPath() + '/scripts',
        args: ['embed', '-m ' + messageImagePath, '-I ' + colorIndex, '-i ' + carrierImagePath, '-p ' + colorPlane]
    }

    PythonShell.run('runner.py', options, function (err, results) {
        if (err)
            alert('The dimensions of carrier must be larger than message')
        else
            embedImage()
    })
})

function getRadioVal(name) {
    var val;
    var radios = document.getElementsByName(name);

    for (var i = 0, len = radios.length; i < len; i++) {
        if (radios[i].checked) {
            val = radios[i].value;
            break;
        }
    }
    return val;
}

function embedImage() {

    messageImage.src = ''
    messageImage.alt = ''
    carrierImage.src = ''
    carrierImage.alt = ''

    TweenMax.to(panelColorIndex, 1, {
        autoAlpha: 0
    })

    TweenMax.to(panelColorPlane, 1, {
        autoAlpha: 0
    })

    TweenMax.to(messageImage, 1, {
        height: '10vh',
        top: '40vh',
        ease: Back.easeOut,
        width: '40vh',
        right: '40%'
    })

    TweenMax.fromTo(carrierImage, 1, {
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
            TweenMax.fromTo(encryptedImage, 1, {
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
                boxShadow: "0 0 5px 5px #9feaf9",
                onComplete: function () {
                    encryptedImage.src = carrierImagePath
                    mergeButton.style.display = 'none'
                    downloadButton.style.display = 'block'
                }
            })
        }
    })
}