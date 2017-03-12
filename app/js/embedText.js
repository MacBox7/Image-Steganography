var utility = require('../js/utility');
var PythonShell = require('python-shell');

var inputPanel = document.getElementById('inputPanel');
var carrierImage = document.getElementById('img-carrier');
var messageTextArea = document.getElementById('text-message');
var hideButton = document.getElementById('btn-hide');
var downloadButton = document.getElementById('btn-download');
var encryptedImage = document.getElementById('img-encrypted');
var cancelButton = document.getElementById('btn-cancel');
var inputKey = document.getElementById('input-key');
var radioEncryption = document.getElementById('radio-encryption');
var panelRequestEncryption = document.getElementById('panel-requestEncryption');
var panelEnterKey = document.getElementById('panel-enterKey');

var carrierImagePath;

carrierImage.addEventListener('click', function () {
    utility.openFile(function (filePath) {
        carrierImage.src = filePath;
        carrierImagePath = filePath;
    });
});

carrierImage.addEventListener('mouseover', function () {
    TweenMax.to(this, 0.1, {
        boxShadow: '0 0 10px 10px #9feaf9',
        height: '+=10',
        width: '+=10',
        ease: Linear.easeNone
    });
});

carrierImage.addEventListener('mouseout', function () {
    TweenMax.set(this, {
        clearProps: 'all'
    });
});

inputPanel.addEventListener('mouseover', function () {
    TweenMax.set(hideButton, {
        clearProps: 'height, width, boxShadow'
    });
    TweenMax.set(downloadButton, {
        clearProps: 'height, width, boxShadow'
    });
    TweenMax.set(carrierImage, {
        clearProps: 'height, width, boxShadow'
    });
    TweenMax.set(messageTextArea, {
        clearProps: 'boxShadow'
    });
    TweenMax.set(inputKey, {
        clearProps: 'boxShadow'
    });
});

downloadButton.addEventListener('click', function () {
    utility.saveFile(carrierImagePath);
});

downloadButton.addEventListener('mouseover', function () {
    TweenMax.to(this, 0.1, {
        height: '+=5',
        width: '+=5',
        boxShadow: '0 0 5px 5px #9feaf9',
        ease: Linear.easeNone
    });
});

downloadButton.addEventListener('mouseout', function () {
    TweenMax.set(this, {
        clearProps: 'height, width, boxShadow'
    });
});

hideButton.addEventListener('mouseover', function () {
    TweenMax.to(this, 0.1, {
        height: '+=5',
        width: '+=5',
        boxShadow: '0 0 5px 5px #9feaf9',
        ease: Linear.easeNone
    });
});

hideButton.addEventListener('mouseout', function () {
    TweenMax.set(this, {
        clearProps: 'all'
    });
});

hideButton.addEventListener('click', function () {
    var message = messageTextArea.value;
    var key = inputKey.value;

    if (carrierImagePath === undefined) {
        TweenMax.to(carrierImage, 0.1, {
            x: '+=20',
            yoyo: true,
            repeat: 5,
            borderColor: '#800000',
            boxShadow: '0 0 10px 10px #800000'
        });
        return;
    } else if (message.length < 1) {
        TweenMax.to(messageTextArea, 0.1, {
            x: '+=20',
            yoyo: true,
            repeat: 5,
            borderColor: '#800000',
            boxShadow: '0 0 10px 10px #800000'
        });
        return;
    } else if (radioEncryption.checked == 1 && key.length < 1) {
        TweenMax.to(inputKey, 0.1, {
            x: '+=10',
            yoyo: true,
            repeat: 5,
            borderColor: '#800000',
            boxShadow: '0 0 10px 10px #800000'
        });
        return;
    }

    embedText();

    // var options = {
    //     mode: 'text',
    //     scriptPath: utility.getAppPath() + '/scripts',
    //     args: ['embed', '-m ' + messageImagePath, '-I ' + colorIndex, '-i ' + carrierImagePath, '-p ' + colorPlane]
    // };

    // PythonShell.run('runner.py', options, function (err, results) {
    //     if (err)
    //         alert('The dimensions of carrier must be larger than message');
    //     else
    //         embedImage();
    // });
});

messageTextArea.addEventListener('input', function () {
    TweenMax.to(this, 0.1, {
        boxShadow: '0 0 5px 5px #9feaf9',
        ease: Linear.easeNone
    });
});

radioEncryption.addEventListener('click', function () {
    TweenMax.set(panelRequestEncryption, {
        autoAlpha: 0,
        display: 'none'
    });
    TweenMax.to(panelEnterKey, 1, {
        autoAlpha: 1,
        display: 'block',
        ease: Bounce.easeOut
    });
});

inputKey.addEventListener('input', function () {
    TweenMax.to(this, 0.1, {
        boxShadow: '0 0 2px 2px #9feaf9',
        ease: Linear.easeNone
    });
});

cancelButton.addEventListener('click', function () {
    TweenMax.set(panelEnterKey, {
        autoAlpha: 0
    });
    radioEncryption.checked = false;
    TweenMax.to(panelRequestEncryption, 1, {
        autoAlpha: 1,
        display: 'block',
        ease: Bounce.easeOut
    });
});

function embedText() {
    carrierImage.src = '';
    carrierImage.alt = '';
    messageTextArea.value = ' ';

    TweenMax.to(panelRequestEncryption, 1, {
        autoAlpha: 0
    });

    TweenMax.to(panelEnterKey, 1, {
        autoAlpha: 0
    });

    TweenMax.to(messageTextArea, 1, {
        height: '10vh',
        top: '40vh',
        ease: Back.easeOut,
        width: '40vh',
        right: '40%',
        background: '#2b2e3b'
    });

    TweenMax.fromTo(carrierImage, 1, {
        right: '80%',
    }, {
        height: '10vh',
        top: '40vh',
        ease: Back.easeOut,
        width: '40vh',
        right: '40%',
        onComplete: function () {
            TweenMax.set(messageTextArea, {
                display: 'none'
            });
            TweenMax.set(carrierImage, {
                display: 'none'
            });
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
                boxShadow: '0 0 5px 5px #9feaf9',
                onComplete: function () {
                    encryptedImage.src = carrierImagePath;
                    hideButton.style.display = 'none';
                    downloadButton.style.display = 'block';
                }
            });
        },
    });
}