/************************************************************************/
// Author : zhaoqy
// Date : 2012-02-16 
/************************************************************************/
var company = "FX";

var win = window;
var listener = win.addEventListener;
var storage = win.localStorage;

var $ = function(id) {
    return "string" == typeof id ? document.getElementById(id) : id;
};

var isDebuge = true;

var comon = comon || {};
var conf = conf || {};

conf = {
    chartJson_url: "service/chartData.php",
    tickJson_url: "service/soap_tick.php",
    interval: 3000
};

comon = {
    chart_update_int: 0,
    pair: "USDJPY",
    unit: "day",
    num: 200, //Number of requests exchange rate
    chart_type: "main", //The type of graph
    start_x: 0, //Offset the initial
    distance: 0, //Offset accumulation
    distance_x: 0, //Slide the x-axis offset
    old_time: 0, //Double-click the event start time
    diamonds: true, //Determine whether to draw the crosshairs
    timeoutInt: 0,
    init_flag: 'Y',
    rates_value: [],
    init: function() {
        $("chartShelter").addEventListener("touchstart", comon.add_default, false);
        $("chartShelter").addEventListener("touchmove", comon.add_default, false);
        $("chartSubMenu").addEventListener("touchmove", comon.add_default, false);
        $("chartHead").addEventListener("touchmove", comon.add_default, false);
        var input = $("chartSubMenu").getElementsByTagName("input");
        for (var i in input) {
            if (input[i].type == "range") {
                input[i].addEventListener("touchmove", comon.remove_default, false);
            }
        }
        $("chartCanvas").addEventListener("touchstart", comon.handle_touchstart, false);
        $("chartCanvas").addEventListener("touchmove", comon.handle_drag, false);
        $("chartCanvas").addEventListener("touchend", comon.handle_touchend, false);
    },
    add_default: function(e) {
        e.preventDefault();
    },
    remove_default: function(e) {
        e.stopPropagation();
    },
    handle_touchstart: function(e) {
        comon.stop();
        e.preventDefault();
        if (e.touches.length == 1) {
            comon.start_x = e.touches[0].pageX;
            var new_time = new Date().getTime();
            //Twice a touch less than 0.36s to draw crosshairs		
            if (new_time - comon.old_time < 360) {
                if (comon.diamonds) {
                    comon.diamonds = false;
                    var x = e.touches[0].pageX - parseInt($('canvas_diamonds').style.left);
                    var y = e.touches[0].pageY - parseInt($('canvas_diamonds').style.top);
                    main.position(x, y);
                } else {
                    //only clear once
                    if (!comon.diamonds) {
                        context_diamonds.clearRect(0, 0, chart_settings['canvas_w'], chart_settings['canvas_h']);
                        comon.diamonds = true;
                    }
                }
            }
            comon.old_time = new_time;
        } else {
            comon.distance_x = Math.abs(e.touches[0].pageX - e.touches[1].pageX);
        }
    },
    handle_touchend: function(e) {
        comon.start_x = 0;
        comon.distance_x = 0;
        comon.timeoutInt = win.setTimeout(function() {
            comon.request();
        }, 1000);
    },
    ajax: function(url, pams, method) {
        var xmlText = "";
        try {
            xmlhttp = new XMLHttpRequest();
            xmlhttp.open("POST", url, false);
            xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xmlhttp.send(pams);
            if (xmlhttp.readyState == 4) {
                if (xmlhttp.status == 200) {
                    xmlText = xmlhttp.responseText;
                } else {
                    console.log("Problem retrieving data");
                    return null;
                }
            }
        } catch (err) {
            return null;
        }
        return xmlText;
    },
    request: function() {
        if (comon.chart_update_int != 0) {
            comon.stop();
        }
        comon.chart_update_int = setInterval(function() {
            comon.update_data(
                comon.pair,
                comon.unit,
                comon.num,
                comon.chart_type
            );
        }, conf.interval);
    },
    update_request: function(pair, unit, num, chart_type) {
        this.pair = pair || this.pair;
        this.unit = unit || this.unit;
        this.num = num || this.num;
        this.chart_type = chart_type || this.chart_type;
        this.request();
    },
    ajax_chart_response: function(pair, unit, num) {
        var pams, url;
        if (unit == "bid" || unit == "ask") {
            url = conf.tickJson_url;
            pams = "PAIRZ=" + pair + "&CANDLE_NUM=" + num + "&INIT_FLAG=" + this.init_flag;
            this.init_flag = 'N';
        } else {
            url = conf.chartJson_url;
            pams = "PAIRZ=" + pair + "&TYPE=" + unit + "&CANDLE_NUM=" + num;
        }
        var response = this.ajax(url, pams);
        if (response == null || response.trim() == "") {
            return null;
        }
        try {
            return JSON.parse(response);
        } catch (e) {
            return null;
        }
    },
    update_data: function(pair, unit, num) {
        var newValue = this.get_rate(pair, unit, num);
        if (newValue && typeof(newValue['pairz']) == 'undefined') {
            var index = 0;
            console.log(this.rates_value[0]);
            console.log(newValue[0]);

            for (var i = 0; i < newValue.length; i++) {
                if (this.rates_value[0]['utimer'] === newValue[i]['utimer']) {

                    console.log("index:" + i);
                }
                //delete this.rates_value[i];
                this.rates_value[i] = newValue[i].Clone();

            }

            main.update(this.rates_value);
        }
    },
    get_rate: function(pair, unit, num) {
        var rates = this.ajax_chart_response(pair, unit, num);
        if (rates && !! rates['pairz']) {
            this.rates_value = rates;
        }
        return rates;
    },
    save_setting: function(arr, type) {
        if (storage) {
            try {
                var intArr = [];
                for (var i in arr) {
                    intArr[i] = parseInt(arr[i])
                };
                storage.removeItem(company + "_Chart_" + type); //Compatible with older browsers
                storage.setItem(company + "_Chart_" + type, intArr.join("#"));
            } catch (e) {
                alert(e.message + " " + "localStorage is full,please clear it");
            }
        }
    },
    load_setting: function(type) {
        if (storage) {
            try {
                var value = storage.getItem(company + "_Chart_" + type);
                if (value != null) {
                    var arr = value.split("#");
                    for (var i in arr) {
                        arr[i] = parseInt(arr[i]);
                    }
                    return arr;
                } else {
                    return null;
                }
            } catch (e) {
                alert(e.massage);
                return null;
            }
        }
    },
    handle_drag: function(e) {
        win.clearTimeout(comon.timeoutInt);
        e.preventDefault();
        //Judge if the crosshairs move the crosshairs, the absence of the crosshairs move record
        if (!comon.diamonds) {
            var x = e.touches[0].pageX - parseInt($('canvas_diamonds').style.left);
            var y = e.touches[0].pageY - parseInt($('canvas_diamonds').style.top);
            main.position(x, y);
        } else {
            if (e.touches.length == 1) {
                //Single finger
                if (comon.start_x == 0) {
                    comon.start_x = e.touches[0].pageX;
                } else {
                    var dis = comon.start_x - e.touches[0].pageX;
                    comon.start_x = e.touches[0].pageX;
                    comon.handle_distance(dis, 0);
                }
            } else {
                //Two fingers		
                if (comon.distance_x == 0) {
                    comon.distance_x = Math.abs(e.touches[0].pageX - e.touches[1].pageX);
                } else {
                    var distance_x = Math.abs(e.touches[0].pageX - e.touches[1].pageX);
                    var dis = comon.distance_x - distance_x;
                    comon.distance_x = distance_x;
                    comon.handle_distance(dis, 1);
                }
            }
        }
    },
    handle_distance: function(distance, type) {
        if (distance == 0) return;
        comon.distance += -distance;
        var x_blank;
        if (main.x_blank == 0) {
            x_blank = parseFloat((main.chart_settings['chart_width']) / (main.type_settings.end - main.type_settings.start));
        } else {
            x_blank = main.x_blank;
        }
        var num = Math.round(comon.distance / x_blank);
        if (num != 0) {
            comon.Quene.add(main.drag, main, [type, comon.distance]);
            comon.distance = 0;
        } else {
            comon.distance += -distance;
        }
    },
    handle_zoom: function(flag) {
        comon.Quene.add(main.zoom, main, [flag, 5]);
    },
    start: function() {
        comon.init();
    },
    stop: function() {
        win.clearInterval(comon.chart_update_int);
    }
}
//buffer event queue
comon.isFinish = true;
comon.Quene = (function(win, comon, undefined) {
    var Quene = [];
    //Clear the buffer events within 25 milliseconds.
    var processTime = 25;
    var id = 0;
    var add = function(fn, context, arrParam) {
        Quene.push({
            fn: fn,
            context: context || {},
            param: arrParam || []
        });
        if (comon.isFinish) {
            start(true);
            comon.isFinish = false;
        }
    };

    function start(excNow) {
        if (excNow) {
            process();
        } else {
            id = win.setTimeout(function() {
                process();
            }, processTime);
        }
    }

    function process() {
        var quene = Quene.shift();
        if (!quene) {
            comon.isFinish = true;
            win.clearTimeout(id);
            return;
        }
        quene.fn.apply(quene.context, quene.param);
        quene = [];
        start(false);
    }
    return {
        add: add
    };
})(window, comon);
//set  update rate listener
if (listener) {
    addEventListener('load', comon.start, false);
    addEventListener('pageshow', comon.request, false);
    addEventListener('beforeunload', comon.stop, false);
    addEventListener('unload', comon.stop, false);
    addEventListener('pagehide', comon.stop, false);
    addEventListener('blur', comon.stop, false);
    addEventListener('focus', comon.request, false);
};
