var utility = require('../js/utility');
var PythonShell = require('python-shell');

var inputPanel = document.getElementById('inputPanel');
var loadingPanel = document.getElementById('panel-load');
var imageInfoPanel = document.getElementById('panel-imageInfo');
var uploadImagePanel = document.getElementById('panel-uploadImage');
var carouselPanel = document.getElementById('panel-carousel');
var carrierImage = document.getElementById('img-carrier');
var extractButton = document.getElementById('btn-extract');
var downloadButton = document.getElementById('btn-download');

var carrierImagePath;
var imageURL = [];

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
    ease: Linear.easeNone,
  });
});

carrierImage.addEventListener('mouseout', function () {
  TweenMax.set(this, {
    clearProps: 'all',
  });
});

inputPanel.addEventListener('mouseover', function () {
  TweenMax.set(extractButton, {
    clearProps: 'all',
  });
  TweenMax.set(carrierImage, {
    clearProps: 'all',
  });
});

extractButton.addEventListener('mouseover', function () {
  TweenMax.to(this, 0.1, {
    height: '+=5',
    width: '+=5',
    boxShadow: '0 0 5px 5px #9feaf9',
    ease: Linear.easeNone,
  });
});

extractButton.addEventListener('mouseout', function () {
  TweenMax.set(this, {
    clearProps: 'all',
  });
});

extractButton.addEventListener('click', function () {
  if (carrierImagePath === undefined) {
    TweenMax.to(carrierImage, 0.1, {
      x: '+=20',
      yoyo: true,
      repeat: 5,
      borderColor: '#800000',
      boxShadow: '0 0 10px 10px #800000',
    });
    return;
  }
  initiateLoading();
  initializeCarousel(stopLoading);
});

downloadButton.addEventListener('click', function () {
  var activeCarouselImagePath = $('div.active').find('img').attr('src');
  utility.saveFile(activeCarouselImagePath.substring(0, activeCarouselImagePath.length - 1));
});

downloadButton.addEventListener('mouseover', function () {
  TweenMax.to(this, 0.1, {
    height: '+=5',
    width: '+=5',
    boxShadow: '0 0 5px 5px #9feaf9',
    ease: Linear.easeNone,
  });
});

downloadButton.addEventListener('mouseout', function () {
  TweenMax.set(this, {
    clearProps: 'height, width, boxShadow',
  });
});

$(window).bind('mousewheel', function (event) {
  if (event.originalEvent.wheelDelta >= 0) {
    if ($(carouselPanel).css('display') == 'block') {
      $(carouselPanel).carousel('next');
    }
  } else {
    if ($(carouselPanel).css('display') == 'block') {
      $(carouselPanel).carousel('prev');
    }
  }
});

setInterval(function () {
  var carousalIndex = $('div.active').index() % 24;
  setImageInfo(carousalIndex);
}, 100);

function initializeCarousel(callback) {
  getColorPlanes(function () {
    $('.carousel-indicators').empty();
    $('.carousel-inner').empty();

    for (var i = 0; i < imageURL.length; i++) {
      $('<div class="item"><img src="' + imageURL[i] + ' " class="img-plane" ></div>').appendTo('.carousel-inner');
    }

    $('.item').first().addClass('active');
    $('.carousel-indicators > li').first().addClass('active');
    $(carouselPanel).carousel();
    $(carouselPanel).carousel('pause');

    uploadImagePanel.style.display = 'none';
    carouselPanel.style.display = 'block';
    imageInfoPanel.style.display = 'block';
    downloadButton.style.display = 'block';
    callback();
  });
}

function getColorPlanes(callback) {
  var colorPlane = 0;
  loopColorPlanes(colorPlane, function () {
    callback();
  });
}

function loopColorPlanes(colorPlane, callback) {
  var colorIndex = 0;
  loopColorIndex(colorIndex, colorPlane, function () {
    colorPlane++;
    if (colorPlane < 3) {
      loopColorPlanes(colorPlane, callback);
    } else {
      callback();
    }
  });
}

function loopColorIndex(colorIndex, colorPlane, callback) {
  processColorPlane(colorIndex, colorPlane, carrierImagePath, function () {
    colorIndex++;
    if (colorIndex < 8) {
      loopColorIndex(colorIndex, colorPlane, callback);
    } else {
      callback();
    }
  });
}

function processColorPlane(colorIndex, colorPlane, carrierImagePath, callback) {
  var outputImagePath = utility.getAppPath() + '/Images/' + colorPlane.toString() + colorIndex.toString() + '.png';
  var options = {
    mode: 'text',
    scriptPath: utility.getAppPath() + '/scripts',
    args: ['extractembedded', '-o ' + outputImagePath, '-I ' + colorIndex, '-i ' + carrierImagePath, '-p ' + colorPlane],
  };

  PythonShell.run('runner.py', options, function (err, results) {
    if (!err) {
      imageURL.push(outputImagePath);
      callback();
    } else
      console.log(err);
  });
}

function initiateLoading() {
  TweenMax.to(loadingPanel, 0.5, {
    alpha: 0.8,
    zIndex: 999,
  });
  TweenMax.to(inputPanel, 0.5, {
    alpha: 0.5,
  });
}

function stopLoading() {
  TweenMax.to(inputPanel, 0.5, {
    autoAlpha: 1,
  });
  TweenMax.to(loadingPanel, 0.5, {
    autoAlpha: 0,
    zIndex: -1,
  });
}

function getPlaneName(colorPlane) {
  if (colorPlane == 0) {
    return 'Red';
  } else if (colorPlane == 1) {
    return 'Green';
  } else if (colorPlane == 2) {
    return 'Blue';
  } else {
    return 'Invalid Plane';
  }
}

function setImageInfo(carousalIndex) {
  var planeIndex = parseInt(carousalIndex / 8);
  var bitIndex = carousalIndex % 8;
  var planeName = getPlaneName(planeIndex);
  $(imageInfoPanel).empty();
  $(imageInfoPanel).append('<p>Plane: ' + planeName + '</p>' + '<p>Index: ' + bitIndex + '</p>');
}