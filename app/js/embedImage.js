var utility = require('../js/utility')

var vesselImage = document.getElementById('img-vessel');
var carrierImage = document.getElementById('img-carrier');

vesselImage.addEventListener('click', function () {
    utility.openFile(function (filePath) {
        document.getElementById('img-vessel').src = filePath
    })
})

carrierImage.addEventListener('click', function () {
    utility.openFile(function (filePath) {
        document.getElementById('img-carrier').src = filePath
    })
})

embedImage()

function embedImage() {

    vesselImage.src = ''
    TweenMax.to(vesselImage, 1, {
        height: '10vh', // Tween to the current x value minus 50
        top: '40vh', // Tween to the current y value plus 50,
        ease: Back.easeOut,
        width: '40vh'
    })

    TweenMax.to(vesselImage, 1, {
        left: '0vh',
        zIndex: '1'
    })
}