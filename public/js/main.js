var $ = function (selector, el) {
    if (!el) {el = document;}
    return el.querySelector(selector);
}
var $$ = function (selector, el) {
     if (!el) {el = document;}
     return el.querySelectorAll(selector);
}

var input = $('input');
var photo = new Image();
var preview = $('.preview');
var canvas = $('canvas');
var svg = $('svg');
var ctx = canvas.getContext('2d');

var cropBegin = { x: 0, y: 0 };
var cropEnd = { x: 200, y: 200 };
var cropSize = { width: 0, height: 0 };

/*
 *  ctx paint
 */

var mouse = { x: 0, y: 0 };

canvas.addEventListener('mousemove', function(e) {
    mouse.x = e.pageX - this.offsetLeft;
    mouse.y = e.pageY - this.offsetTop;
}, false);

ctx.lineWidth = 24;
ctx.lineJoin = 'round';
ctx.lineCap = 'round';
ctx.strokeStyle = '#000';

canvas.addEventListener('mousedown', function(e) {
    ctx.beginPath();
    ctx.moveTo(mouse.x, mouse.y);

    canvas.addEventListener('mousemove', onPaint, false);
}, false);

canvas.addEventListener('mouseup', function() {
    canvas.removeEventListener('mousemove', onPaint, false);
}, false);

var onPaint = function() {
    ctx.lineTo(mouse.x, mouse.y);
    ctx.stroke();
};

/*
 *  effect event
 */

// handle mode change
$('.effect-mode button.crop').addEventListener('click', handleMode.bind(null, 'crop'));
$('.effect-mode button.brush').addEventListener('click', handleMode.bind(null, 'brush'));
$('.effect-mode button.filter').addEventListener('click', handleMode.bind(null, 'filter'));

function handleMode(mode, e) {
    var svg = $('svg');
    var brush = $('div.effect-brush');
    var filter = $('div.effect-filter');

    switch (mode) {
        case 'crop':
            svg.classList.remove('hide');
            brush.classList.remove('show');
            break;
        case 'brush':
            svg.classList.add('hide');
            brush.classList.add('show');
            filter.classList.remove('show');
            break;
        case 'filter':
            svg.classList.add('hide');
            filter.classList.add('show');
            brush.classList.remove('show');
            break;
    }
}

// handle filter apply
var filters = $$('.effect-filter-img');

filters[0].addEventListener('click', handleFilter.bind(null, 'origin'));
filters[1].addEventListener('click', handleFilter.bind(null, 'bright'));
filters[2].addEventListener('click', handleFilter.bind(null, 'contrast'));
filters[3].addEventListener('click', handleFilter.bind(null, 'classical'));
filters[4].addEventListener('click', handleFilter.bind(null, 'gray-scale'));

function handleFilter(filter, e) {
    switch (filter) {
        case 'origin':
            ctx.filter = 'none';
            ctx.drawImage(photo, 0, 0);
            break;
        case 'bright':
            ctx.filter = 'saturate(120%) brightness(120%)';
            ctx.drawImage(photo, 0, 0);
            break;
        case 'contrast':
            ctx.filter = 'contrast(150%)';
            ctx.drawImage(photo, 0, 0);
            break;
        case 'classical':
            ctx.filter = 'saturate(80%) brightness(80%)';
            ctx.drawImage(photo, 0, 0);
            break;
        case 'gray-scale':
            ctx.filter = 'grayscale(100%)';
            ctx.drawImage(photo, 0, 0);
            break;
    }
}

// handle stroke color
var colorBtns = $$('.effect-brush-color button');

colorBtns[0].addEventListener('click', handleColor.bind(null, 'black'));
colorBtns[1].addEventListener('click', handleColor.bind(null, 'blue'));
colorBtns[2].addEventListener('click', handleColor.bind(null, 'deep-blue'));
colorBtns[3].addEventListener('click', handleColor.bind(null, 'green'));
colorBtns[4].addEventListener('click', handleColor.bind(null, 'light-green'));
colorBtns[5].addEventListener('click', handleColor.bind(null, 'yellow'));
colorBtns[6].addEventListener('click', handleColor.bind(null, 'orange'));
colorBtns[7].addEventListener('click', handleColor.bind(null, 'pink'));
colorBtns[8].addEventListener('click', handleColor.bind(null, 'purple'));

function handleColor(color, e) {
    switch (color) {
        case 'black':
            ctx.strokeStyle = '#000';
            break;
        case 'blue':
            ctx.strokeStyle = '#78c5d6';
            break;
        case 'deep-blue':
            ctx.strokeStyle = '#459ba8';
            break;
        case 'green':
            ctx.strokeStyle = '#79c267';
            break;
        case 'light-green':
            ctx.strokeStyle = '#c5d647';
            break;
        case 'yellow':
            ctx.strokeStyle = '#f5d63d';
            break;
        case 'orange':
            ctx.strokeStyle = '#f28c33';
            break;
        case 'pink':
            ctx.strokeStyle = '#e868a2';
            break;
        case 'purple':
            ctx.strokeStyle = '#bf62a6';
            break;
    }
}

// handle stroke width
var sizeBtns = $$('.effect-brush-size button');

sizeBtns[0].addEventListener('click', handleSize.bind(null, 'large'));
sizeBtns[1].addEventListener('click', handleSize.bind(null, 'medium'));
sizeBtns[2].addEventListener('click', handleSize.bind(null, 'small'));

function handleSize(size) {
    switch (size) {
        case 'large':
            ctx.lineWidth = 24;
            break;
        case 'medium':
            ctx.lineWidth = 16;
            break;
        case 'small':
            ctx.lineWidth = 8;
            break;
    }
}

/*
 *  d3 brush
 */

var brush = d3.brush()
    .on("end", brushended);

var svg = d3.select("svg");

function brushended() {
    var offset = 3;

    cropBegin.x = $('.handle.handle--nw').x.baseVal.value + offset;
    cropBegin.y = $('.handle.handle--nw').y.baseVal.value + offset;
    cropEnd.x = $('.handle.handle--se').x.baseVal.value + offset;
    cropEnd.y = $('.handle.handle--se').y.baseVal.value + offset;
    cropSize.width = cropEnd.x - cropBegin.x;
    cropSize.height = cropEnd.y - cropBegin.y;
    console.log(cropSize)
}

/*
 *  input file and submit button
 */


input.style.opacity = 0;
input.addEventListener('change', handleFile);

function handleFile() {
    var curFiles = input.files;

    photo.className = 'photo';
    photo.src = window.URL.createObjectURL(curFiles[0]);

    photo.addEventListener('load', handlePhoto);

}

function handlePhoto(e) {

    $('.effect-mode').classList.add('show');

    var filterImgs = $$('.effect-filter-img');
    filterImgs.forEach(function(el) {
        el.src = photo.src;
    });

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(photo, 0, 0);

    var gBrush = $('svg').childNodes[0];
    if (gBrush) {
        gBrush.remove();
    }
    svg.append("g")
        .attr("class", "brush")
        .call(brush)
        .call(brush.move, [
            [cropBegin.x, cropBegin.y],
            [cropEnd.x, cropEnd.y]
        ]);
}

/*
 *  drag file input
 */

var holder = document.getElementById('holder');
var state = document.getElementById('status');

if (typeof window.FileReader) {
    state.className = 'success';
    state.innerHTML = '';
} else {
    state.className = 'fail';
}

holder.ondragover = function() {
    this.className = 'hover';
    return false;
};
holder.ondragend = function() {
    this.className = '';
    return false;
};
holder.ondrop = function(e) {
    this.className = '';
    e.preventDefault();

    var file = e.dataTransfer.files[0];
    photo.src = window.URL.createObjectURL(file)

    photo.addEventListener('load', handlePhoto);


    return false;
};

/*
 *  handle submit
 */

$('button.submit').addEventListener('click', handleSubmit);

function handleSubmit(e) {

    if (window.confirm('The photo has been modified. Do you want to upload ?')) {
        var tempImg = document.createElement('img');
        var tempCanvas = document.createElement('canvas');
        var tempCtx = tempCanvas.getContext('2d');

        tempCanvas.width = cropSize.width;
        tempCanvas.height = cropSize.height;

        tempImg.src = canvas.toDataURL();
        tempImg.onload = function(e) {

            tempCtx.drawImage(tempImg, cropBegin.x, cropBegin.y, cropSize.width, cropSize.height, 0, 0, tempCanvas.width, tempCanvas.height);


            var xhr = new XMLHttpRequest();
            var apiURL = '/api/upload';
            var data = {};
            data.dataURL = tempCanvas.toDataURL();
            var json = JSON.stringify(data);

            if (!xhr) {
                alert('Cannot create an XMLHTTP instance');
                return false;
            }

            xhr.open('PUT', apiURL);
            xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        alert(xhr.responseText);
                    } else {
                        alert('There was a problem with the request.');
                        console.error('There was a problem with the request.');
                    }
                }
            };
            xhr.send(json);

        };
    }
}