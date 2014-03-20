/************************************************************************/
// Author : zhaoqy 
// chart data init
/************************************************************************/
var CHART = CHART || {};
var type_settings = type_settings || {};
var chart_settings = chart_settings || {};
//Define parameters of chart
var appliWidth = 0;

var ctx_bg = $("canvas_background");
var ctx_chart = $("canvas_chart");
var ctx_ct = $("canvas_chartText");
var ctx_diamonds = $("canvas_diamonds");

var context_background = ctx_bg.getContext("2d");
var context_chart = ctx_chart.getContext("2d");
var canvas_chartText = ctx_ct.getContext("2d");
var context_diamonds = ctx_diamonds.getContext("2d");

var inc_1 = 0;
var inc_2 = 0;
var RANK_MA = [5, 25, 75];
var RANK_EMA = [5, 25, 75];
var RANK_TECH = [25, 1, 2, 3];
var RANK_MACD = [12, 26, 9];
var RANK_RSI = [9, 14];
var RANK_STO = [3, 9];
var RANK_CLOUD = [9, 26, 52];
var CHART_SETTING = [0, 0, 0, 0, 0];
//Decover all value
var RE_RANK_MA = [5, 25, 75];
var RE_RANK_EMA = [5, 25, 75];
var RE_RANK_TECH = [25, 1, 2, 3];
var RE_RANK_MACD = [12, 26, 9];
var RE_RANK_RSI = [9, 14];
var RE_RANK_STO = [3, 9];
var RE_RANK_CLOUD = [9, 26, 52];
var RE_CHART_SETTING = [0, 0, 0, 0, 0];

var type1 = "cand";
var type2 = "";
var type3 = "";
var pair = "USDJPY";
var unit = "bid";
var num = 200; //There are 200 data at most,can't alert
var view = true;
var start = 0;
var end = 80;
var max = 105;
var min = 45;
var inc_max = 0;
var y_grid_num = 0;
var text_y_pos_inc = 20;

var type_settings;
var chart_settings = CHART;

function sub_chart() {
	type1 = $("se_type").value;
	type2 = $("se_type2").value;
	type3 = $("se_type3").value;
	unit = $("se_unit").value;
	pair = $("se_pair").value;
	init_type_settings();
	main.init(type_settings, chart_settings);
}
//init load data
addEventListener('load', function() {
	init();
}, false);
//Change orientation listener
parent.window.addEventListener('orientationchange', function() {
	init();
}, false);

function init() {
	//Store local data at first,initialize by local data at second,set parameters of pages at third,initialize parameters requested at last.	
	loadSetting();
	showSetting();
	setPosition();
	init_type_settings();
	main.init(type_settings, chart_settings);
}

function loadSetting() {
	var mas = comon.load_setting("mas");
	RANK_MA = (mas == null ? RANK_MA : mas);
	var emas = comon.load_setting("emas");
	RANK_EMA = (emas == null ? RANK_EMA : emas);
	var tech = comon.load_setting("tech");
	RANK_TECH = (tech == null ? RANK_TECH : tech);
	var sto = comon.load_setting("sto");
	RANK_STO = (sto == null ? RANK_STO : sto);
	var rsi = comon.load_setting("rsi");
	RANK_RSI = (rsi == null ? RANK_RSI : rsi);
	var macd = comon.load_setting("macd");
	RANK_MACD = (macd == null ? RANK_MACD : macd);
	var setting = comon.load_setting("type");
	CHART_SETTING = (setting == null ? CHART_SETTING : setting);
	if (CHART_SETTING != null) {
		pair = $('se_pair').options[CHART_SETTING[0]].value;
		unit = $('se_unit').options[CHART_SETTING[1]].value;
		type1 = $('se_type').options[CHART_SETTING[2]].value;
		type2 = $('se_type2').options[CHART_SETTING[3]].value;
		type3 = $('se_type3').options[CHART_SETTING[4]].value;
	}
}

function showSetting() {
	if (CHART_SETTING != null) {
		$('se_pair').selectedIndex = CHART_SETTING[0];
		$('se_unit').selectedIndex = CHART_SETTING[1];
		$('se_type').selectedIndex = CHART_SETTING[2];
		$('se_type2').selectedIndex = CHART_SETTING[3];
		$('se_type3').selectedIndex = CHART_SETTING[4];
		if (CHART_SETTING[3] == 0 || CHART_SETTING[3] == 4) {
			$("set1").disabled = true;
		} else {
			$("set1").disabled = false;
		}
		if (CHART_SETTING[4] == 0) {
			$("set2").disabled = true;
		} else {
			$("set2").disabled = false;
		}
	}
	$("ma1").value = RANK_MA[0];
	$("ma2").value = RANK_MA[1];
	$("ma3").value = RANK_MA[2];
	$('show_ma1').innerHTML = RANK_MA[0];
	$('show_ma2').innerHTML = RANK_MA[1];
	$('show_ma3').innerHTML = RANK_MA[2];

	$("ema1").value = RANK_EMA[0];
	$("ema2").value = RANK_EMA[1];
	$("ema3").value = RANK_EMA[2];
	$('show_ema1').innerHTML = RANK_EMA[0];
	$('show_ema2').innerHTML = RANK_EMA[1];
	$('show_ema3').innerHTML = RANK_EMA[2];

	$("tma").value = RANK_TECH[0];
	$("bol1").value = RANK_TECH[1];
	$("bol2").value = RANK_TECH[2];
	$("bol3").value = RANK_TECH[3];
	$('show_tma').innerHTML = RANK_TECH[0];
	$('show_bol1').innerHTML = RANK_TECH[1];
	$('show_bol2').innerHTML = RANK_TECH[2];
	$('show_bol3').innerHTML = RANK_TECH[3];

	$("short").value = RANK_MACD[0];
	$("long").value = RANK_MACD[1];
	$("mid").value = RANK_MACD[2];
	$('show_short').innerHTML = RANK_MACD[0];
	$('show_long').innerHTML = RANK_MACD[1];
	$('show_mid').innerHTML = RANK_MACD[2];

	$("rsi1").value = RANK_RSI[0];
	$("rsi2").value = RANK_RSI[1];
	$('show_rsi1').innerHTML = RANK_RSI[0];
	$('show_rsi2').innerHTML = RANK_RSI[1];

	$("sto_d").value = RANK_STO[0];
	$("sto_k").value = RANK_STO[1];
	$('show_stod').innerHTML = RANK_STO[0];
	$('show_stok').innerHTML = RANK_STO[1];

	$("chartFlag").alt = pair.substr(0, 3) + "/" + pair.substr(3, 3);
	$("chartFlag").src = "img/flag/" + pair.toLowerCase() + ".png";
	$("chartUnit").innerHTML = $('se_unit').options[$('se_unit').selectedIndex].text;
	checkSelect(); //set.js
}

function init_type_settings() {
	init_inc_max();
	type_settings['pairs'] = pair;
	type_settings['unit'] = unit;
	type_settings['type1'] = type1;
	type_settings['type2'] = type2;
	type_settings['type3'] = type3;
	type_settings['start'] = start;
	type_settings['end'] = end;
	type_settings['max'] = max;
	type_settings['min'] = min;
	type_settings['view'] = view;
	type_settings['num'] = 200 + Number(inc_max);
}

function init_inc_max() {
	var type1 = $("se_type").options[$("se_type").selectedIndex].value;
	var type2 = $("se_type2").options[$("se_type2").selectedIndex].value;
	var type3 = $("se_type3").options[$("se_type3").selectedIndex].value;
	if (type1 == "avg" && inc_max == 0) {
		inc_max = 1;
	}
	set_inc_max(type2, type3);
}

function set_inc_max(type2, type3) {
	if (type2 != '') {
		switch (type2) {
			case "mas":
				inc_1 = Array.max(RANK_MA);
				break;
			case "emas":
				inc_1 = Array.max(RANK_EMA);
				break;
			case "tech":
				inc_1 = Array.max(RANK_TECH);
				break;
			case "cloud":
				inc_1 = Array.max(RANK_CLOUD);
				break;
			default:
				break;
		}
	}
	if (type3 != '') {
		switch (type3) {
			case "macd":
				if (RANK_MACD[0] > RANK_MACD[1]) {
					inc_2 = RANK_MACD[0] + RANK_MACD[2];
				} else {
					inc_2 = RANK_MACD[1] + RANK_MACD[2];
				}
				break;
			case "sto":
				inc_2 = RANK_STO[0] + RANK_STO[1];
				break;
			case "rsi":
				inc_2 = Array.max(RANK_RSI);
				break;
			default:
				break;
		}
	}
	if (inc_1 - inc_2 > 0) {
		inc_max = inc_1;
	} else {
		inc_max = inc_2;
	}
}

function setPosition() {
	$('zoomBtn').style.visibility = 'hidden';
	var innerWidth = parent.window.innerWidth;
	if (innerWidth != appliWidth) {
		appliWidth = parent.window.innerWidth;
		if (appliWidth > 321) {
			init_chart_settings(true);
		} else {
			init_chart_settings(false);
		}
	}
	$("chartSubMenu").style.width = innerWidth + "px";
	$("chartSubMenu").style.height = innerWidth + "px";
	$("chartShelter").style.width = innerWidth + "px";
	$("chartShelter").style.height = innerWidth + "px";

	if ($("canvas_chart").height > 250) {
		$("zoomBtn").style.marginTop = "285px";
		$("chartSubMenu").style.left = "0px";
		$("chartSubMenu").style.top = "50px";
	} else {
		$("zoomBtn").style.marginTop = "190px";
		$("chartSubMenu").style.left = "45px";
		$("chartSubMenu").style.top = "0px";
	}
	$('zoomBtn').style.visibility = 'visible';
}
var canvas = document.getElementsByTagName('canvas');
//Set initial parameters of chart
function init_chart_settings(ver_hor) {
	if (ver_hor) { //horizontal
		view = true;
		start = (typeof(main.type_settings.start) != "undefined") ? main.type_settings.start : 0;
		end = start + 80;
		if (end >= num) {
			end = num;
			start = end - 80;
		}
		max = 105;
		min = 45;
		for (var i in canvas) {
			canvas[i].width = 410;
			canvas[i].height = 200;
		}
		CHART['canvas_w'] = ctx_chart.width;
		CHART['canvas_h'] = ctx_chart.height;
		//The size of the canvas
		CHART['chartw'] = CHART['canvas_w'];
		CHART['charth'] = CHART['canvas_h'];
		//The real size of the chart
		CHART['chart_width'] = CHART['chartw'] * 0.89;
		CHART['chart_height'] = CHART['charth'] * 0.86;
		CHART['x_start'] = 0;
		CHART['y_start'] = 12;
		y_grid_num = 8;
		CHART['x_grid'] = 8;
		CHART['y_grid'] = 8;
		CHART['x_pos'] = CHART['chart_width'] + CHART['x_start'];
		CHART['y_pos'] = CHART['chart_height'] + CHART['y_start'];
	} else { //vertical
		view = false;
		start = (typeof(main.type_settings.start) != "undefined") ? main.type_settings.start : 0;
		end = start + 50;
		if (end >= num) {
			end = num;
			start = end - 50;
		}
		max = 65;
		min = 25;
		for (var i in canvas) {
			canvas[i].width = 325;
			canvas[i].height = 328;
		}
		CHART['canvas_w'] = ctx_chart.width;
		CHART['canvas_h'] = ctx_chart.height;
		CHART['x_start'] = 0;
		CHART['y_start'] = 12;
		//The size of the canvas
		CHART['chartw'] = CHART['canvas_w'];
		CHART['charth'] = CHART['canvas_h'];
		//The real size of the chart
		CHART['chart_width'] = CHART['chartw'] * 0.83;
		CHART['chart_height'] = CHART['charth'] * 0.825;
		CHART['x_grid'] = 5;
		CHART['y_grid'] = 8;
		y_grid_num = 8;
		CHART['x_pos'] = CHART['chart_width'] + CHART['x_start'];
		CHART['y_pos'] = CHART['chart_height'] + CHART['y_start'];
	}
}
//Paint horizontal lines
function h_CHART(y_max, y_min, median, show_num, chart_settings, type) {
	var median = (median == undefined) ? 3 : median;
	//Y section and mark the value
	context_background.save();
	if (main.type_settings.type3 != '') {
		if (type == 'type1') {
			y_grid_num = 5;
		} else {
			y_grid_num = 4;
		}
	} else {
		y_grid_num = 8;
	}
	var y_blank = ((y_max - y_min) / y_grid_num).toFixed(median)
	var STEP_Y = parse_to_int(y_blank * (chart_settings['chart_height'] / (y_max - y_min)));
	var h_pos = parse_to_int(chart_settings['chart_height'] + chart_settings['y_start']);
	var data = Number(y_min);
	context_background.beginPath();
	context_background.font = "normal bold 12px sans";
	context_background.fillStyle = '#FFFAF0';
	context_background.fillText(Number(y_min).toFixed(median), chart_settings['x_pos'] + 4, chart_settings['y_pos']);
	while (h_pos - STEP_Y > chart_settings['y_start'] + 10) {
		h_pos -= STEP_Y;
		data += Number(y_blank);
		//line_width+space
		var line_space = 7.5;
		//line_width
		var line_width = 5;
		//The start place of lines
		var span_x = chart_settings['chart_width'] + chart_settings['x_start'] - line_width;
		while (span_x >= chart_settings['x_start']) {
			context_background.fillRect(span_x, h_pos, line_width, 0.2);
			span_x = span_x - line_space;
		}
		if (span_x + line_space - chart_settings['x_start'] > line_space - line_width) {
			context_background.fillRect(chart_settings['x_start'], h_pos, line_width, 0.2);
		}
		context_background.fillText(data.toFixed(median), chart_settings['x_pos'] + 4, h_pos + 4);
	}
	context_background.fillText(Number(y_max).toFixed(median), chart_settings['x_pos'] + 4, chart_settings['y_start'] + 8);
	context_background.restore();
}
//Paint vertical lines
function v_CHART(v_pos, utimer, chart_settings) {
	var v_pos = parse_to_int(v_pos);
	if (v_pos < chart_settings['x_pos']) {
		context_background.beginPath();
		context_background.font = "normal bold 12px sans";
		context_background.fillStyle = '#FFFAF0';
		//line_width+space
		var line_space = 7.5;
		//line_width
		var line_height = 5;
		//The start place of lines
		var span_y = chart_settings['chart_height'] + chart_settings['y_start'] - line_height;
		while (span_y >= chart_settings['y_start']) {
			context_background.fillRect(v_pos, span_y, 0.2, line_height);
			span_y = span_y - line_space;
		}
		//The processing of last line
		if (span_y + line_space - chart_settings['y_start'] > line_space - line_height) {
			context_background.fillRect(v_pos, chart_settings['y_start'], 0.2, span_y + line_space - chart_settings['y_start'] - (line_space - line_height));
		}
		context_background.closePath();
		if (utimer != '') {
			if (type_settings['unit'] == "day") {
				var time = utimer.split("-");
				var Months = time[1],
					Dates = time[2];
				context_background.fillText(Months + "/" + Dates, v_pos - 13, chart_settings['y_pos'] + 14);
			} else {
				var time = (new Date()).format(utimer);
				context_background.fillText(time['Hour'] + ":" + time['Minute'], v_pos - 13, chart_settings['y_pos'] + 14);
			}
		}
	}
}
//Initialize the top data{rate_array:data,x_pos:the place in X of new data，y_pos:the place in Y of new data,mark:tick mark}	
function top(rate_array, start, x_pos, y_pos, mark) {
	var median = rate_array['pairz']['num'];
	var close, open, high, low, bid, ask;
	var time = (new Date()).format(rate_array[start]["utimer"]);
	if (type_settings['unit'] == "bid" || type_settings['unit'] == "ask") {
		close = rate_array[start][mark + 'close'];
		high = rate_array[start][mark + 'high'];
		low = rate_array[start][mark + 'low'];
		$("tickClose").innerHTML = "-";
		$("tickOpen").innerHTML = "-";
		$("tickHigh").innerHTML = high.toFixed(median);
		$("tickLow").innerHTML = low.toFixed(median);
		$("chartTime").innerHTML = time['Year'] + "-" + time['Month'] + "-" + time['Dates'];
	} else {
		close = rate_array[start]['bclose'];
		open = rate_array[start]['bopen'];
		high = rate_array[start]['bhigh'];
		low = rate_array[start]['blow'];
		$("tickOpen").innerHTML = open.toFixed(median);
		$("tickClose").innerHTML = close.toFixed(median);
		$("tickHigh").innerHTML = high.toFixed(median);
		$("tickLow").innerHTML = low.toFixed(median);
		if (type_settings['unit'] == "day") {
			$("chartTime").innerHTML = rate_array[start]["utimer"];
		} else {
			$("chartTime").innerHTML = time['Year'] + "-" + time['Month'] + "-" + time['Dates'] + " " + time['Hour'] + ":" + time['Minute'];
		}
	}
	y_rate_shape(context_chart, close.toFixed(median), x_pos, y_pos, '#fff', '#f00', "#000");
}
//Show bid or ask data
function show_bid_ask(JSONData) {
	var median = JSONData['pairz']['num'];
	var bid, ask;
	if (type_settings['unit'] == "bid" || type_settings['unit'] == "ask") {
		bid = JSONData[0]['bclose'];
		ask = JSONData[0]['aclose'];
	} else {
		bid = JSONData["rates"]["bid"];
		ask = JSONData["rates"]["ask"];
	}
	$("bidTick").style.color = "#ffffff";
	$("askTick").style.color = "#ffffff";
	if (bid > Number($("bidTick").innerHTML)) {
		$("bidTick").style.color = "#FF0000";
	} else if (bid < Number($("bidTick").innerHTML)) {
		$("bidTick").style.color = "#0000FF";
	} else {
		$("bidTick").style.color = "#FFFFFF";
	}
	if (ask > Number($("askTick").innerHTML)) {
		$("askTick").style.color = "#ff0000";
	} else if (ask < Number($("askTick").innerHTML)) {
		$("askTick").style.color = "#0000ff";
	} else {
		$("askTick").style.color = "#FFFFFF";
	}
	$("bidTick").innerHTML = bid.toFixed(median);
	$("askTick").innerHTML = ask.toFixed(median);
}
//The border for new data and cross curve on Y
function y_rate_shape(chart, txt, x_pos, y_pos, border_color, fill_color, txt_color) {
	chart.beginPath();
	chart.lineWidth = 2;
	chart.strokeStyle = border_color;
	chart.moveTo(x_pos + 3, y_pos);
	chart.lineTo(x_pos + 48, y_pos);
	chart.lineTo(x_pos + 48, y_pos - 15);
	chart.lineTo(x_pos + 13, y_pos - 15);
	chart.closePath();
	chart.stroke();
	chart.fillStyle = fill_color;
	chart.fill();
	chart.fillStyle = txt_color;
	chart.fillText(txt, x_pos + 9, y_pos - 3);
}
//The border for cross curve on Y
function x_time_shape(chart, txt, x_pos, y_pos, border_color, fill_color, txt_color) {
	chart.beginPath();
	chart.lineWidth = 2;
	chart.strokeStyle = border_color;
	chart.moveTo(x_pos, y_pos);
	chart.lineTo(x_pos - 5, y_pos + 5);
	chart.lineTo(x_pos - 20, y_pos + 5);
	chart.lineTo(x_pos - 20, y_pos + 18);
	chart.lineTo(x_pos + 20, y_pos + 18);
	chart.lineTo(x_pos + 20, y_pos + 5);
	chart.lineTo(x_pos + 5, y_pos + 5);
	chart.closePath();
	chart.stroke();
	chart.fillStyle = fill_color;
	chart.fill();
	chart.fillStyle = txt_color;
	chart.fillText(txt, x_pos - 13, y_pos + 14);
}
//Parameters{y_max:the max,y_min:the min,median:The digits of exchange rate,show_num:the number in show,chart_setting:paramenters of the chart,type:chart type}
function draw_bg(y_max, y_min, median, show_num, chart_settings, type) {
	context_background.fillStyle = '#002500';
	context_background.fillRect(chart_settings['x_start'], chart_settings['y_start'], chart_settings['chart_width'], chart_settings['chart_height']);
	draw_chart_broder(chart_settings);
	h_CHART(y_max, y_min, median, show_num, chart_settings, type);
}

function draw_chart_broder(chart_settings) {
	context_background.beginPath();
	context_background.lineWidth = 1;
	context_background.strokeStyle = '#FFFFFF';
	context_background.moveTo(chart_settings['x_start'], chart_settings['y_start']);
	context_background.lineTo(chart_settings['x_start'], chart_settings['chart_height'] + chart_settings['y_start']);
	context_background.lineTo(chart_settings['x_start'] + chart_settings['chart_width'], chart_settings['chart_height'] + chart_settings['y_start']);
	context_background.lineTo(chart_settings['x_start'] + chart_settings['chart_width'], chart_settings['y_start']);
	context_background.lineTo(chart_settings['x_start'], chart_settings['y_start']);
	context_background.stroke();
	context_background.closePath();
}

function zoom(flag) {
	comon.handle_zoom(flag);
}