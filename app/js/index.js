var options = document.querySelectorAll('.image');
var optionName = document.querySelector('#heading-optionName');

options.forEach(function (image) {
    image.addEventListener('mouseover', function () {
        TweenMax.to(optionName, 0.2, {
            autoAlpha: 0,
            scale: 1,
            ease: Linear.easeNone,
            onComplete: function () {
                optionName.innerHTML = getOptionName(image);
                TweenMax.to(optionName, 0.3, {
                    autoAlpha: 1,
                    scale: 1.5,
                    ease: Linear.easeNone
                });
            }
        });
        TweenMax.to(image, 0.5, {
            rotation: '360',
            ease: Linear.easeNone,
            scale: 1.4,
            fill: '#ffffff',
            stroke: '#ffffff'
        });
    });
    image.addEventListener('mouseout', function () {
        TweenMax.to(optionName, 0.2, {
            autoAlpha: 0,
            scale: 1,
            ease: Linear.easeNone
        });
        TweenMax.to(image, 0.2, {
            rotation: '0',
            ease: Linear.easeNone,
            scale: 1
        });
    });
});

function getOptionName(image) {
    if (image.id == 'img-embedImage') {
        return 'Embed Image';
    } else if (image.id == 'img-extractImage') {
        return 'Extract Image';
    } else if (image.id == 'img-embedText') {
        return 'Embed Text';
    } else if (image.id == 'img-extractText') {
        return 'Extract Text';
    } else {
        return 'Invalid Option';
    }
}