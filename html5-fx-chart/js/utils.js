/************************************************************************/
// Author : zhaoqy 
// Date : 2012-02-13 
/************************************************************************/
// Drawing a line
function line_basic_draw(cxt, movex, movey, linex, liney, lineWidth, color) {
    cxt.beginPath();
    cxt.lineWidth = lineWidth;
    cxt.strokeStyle = color;
    cxt.moveTo(movex, movey);
    cxt.lineTo(linex, liney);
    cxt.closePath();
    cxt.stroke();
}
//Painting a candle
function candlebar_basic_draw(context, draw_x, open_pos, close_pos, high_pos, low_pos, color) {
    var height = Math.abs(close_pos - open_pos);
    context.fillStyle = color;
    line_basic_draw(context, Math.floor(draw_x - 3), open_pos, Math.floor(draw_x - 3), high_pos, 1, "#fff");
    line_basic_draw(context, Math.floor(draw_x - 3), close_pos, Math.floor(draw_x - 3), low_pos, 1, "#fff");
    if (close_pos - open_pos < 0) {
        context.fillRect(draw_x - 6, close_pos, 5, height);
    } else {
        context.fillRect(draw_x - 6, open_pos, 5, height);
    }
}
//Clear the canvas
function canvas_clear(cxt, x, y) {
    cxt.clearRect(0, 0, x, y);
}

function canvas_clearRect(cxt, x, y, width, height) {
    cxt.clearRect(x, y, width, height);
}
//image draw
function img_basic_draw(cxt, img, x, y, sw, sh, dx, dy, dw, dh) {
    if (!sw) cxt.drawImage(img, x, y);
    else cxt.drawImage(img, x, y, sw, sh, dx, dy, dw, dh);
}
//Draw text
function text_basic_draw(cxt, string, x, y, color, size) {
    cxt.fillStyle = color;
    cxt.font = size + "px sans-serif";
    cxt.fillText(string, x, y);
}
//Seek the maximum value in the array
Array.max = function(array) {
    return Math.max.apply(Math, array);
};
//Seeking the minimum value in the array
Array.min = function(array) {
    return Math.min.apply(Math, array);
};
//Query expansion
Array.prototype.index = function(obj) {
    for (var i = 0, l = this.length; i < l; i++) {
        if (obj == this[i]) {
            return i;
        }
    }
    return -1;
};
//Extension to delete
Array.prototype.remove = function(obj) {
    for (var i = 0, l = this.length; i < l; i++) {
        if (obj == this[i]) {
            this.splice(i, 1);
            break;
        }
    }
};
//Filter space
String.prototype.trim = String.prototype.trim || function() {
    return this.replace(/(^[\s]+|[\s]+$)/, '');
}
//Rounded to the nearest whole
function parse_to_int(number) {
    return (Number(number) + 0.5) << 0;
}
//Object replication, non-reference
Object.prototype.Clone = function() {
    var objClone;
    if (this.constructor == Object) {
        objClone = new this.constructor();
    } else {
        objClone = new this.constructor(this.valueOf());
    }
    for (var key in this) {
        if (objClone[key] != this[key]) {
            if (typeof(this[key]) == 'object') {
                objClone[key] = this[key].Clone();
            } else {
                objClone[key] = this[key];
            }
        }
    }
    objClone.toString = this.toString;
    objClone.valueOf = this.valueOf;
    return objClone;
};

Object.prototype.equals = function(obj) {
    if (this == obj)
        return true;
    if (typeof(obj) == "undefined" || obj == null || typeof(obj) != "object")
        return false;
    var length = 0;
    var length1 = 0;
    for (var ele in this) {
        length++;
    }
    for (var ele in obj) {
        length1++;
    }
    if (length != length1)
        return false;
    if (obj.constructor == this.constructor) {
        for (var ele in this) {
            if (typeof(this[ele]) == "object") {
                if (!this[ele].equals(obj[ele]))
                    return false;
            } else if (typeof(this[ele]) == "function") {
                if (!this[ele].toString().equals(obj[ele].toString()))
                    return false;
            } else if (this[ele] != obj[ele])
                return false;
        }
        return true;
    }
    return false;
};
//test OS iPhone or iPad
function testOS() {
    var userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.match(/ipad/i) == "ipad") {
        return "ipad";
    } else if (userAgent.match(/iphone/i) == "iphone") {
        return "iphone";
    } else if (userAgent.match(/android/i) == "android") {
        return "android";
    } else {
        return "win";
    }
}
//Time formatting
Date.prototype.format = function(utimer) {
    var data = new Date(utimer);
    var time = {};
    time['Year'] = data.getFullYear();
    if (time['Year'] < 10) time['Year'] = "0" + time['Year'];
    time['Month'] = data.getMonth() + 1;
    if (time['Month'] < 10) time['Month'] = "0" + time['Month'];
    time['Dates'] = data.getDate();
    if (time['Dates'] < 10) time['Dates'] = "0" + time['Dates'];
    time['Hour'] = data.getHours();
    if (time['Hour'] < 10) time['Hour'] = "0" + time['Hour'];
    time['Minute'] = data.getMinutes();
    if (time['Minute'] < 10) time['Minute'] = "0" + time['Minute'];
    return time;
}