/************************************************************************/
// Author : zhaoqy
// Date : 2012-02-16 
/************************************************************************/
var emas = emas || {};
emas = {
	ema1: [],
	ema2: [],
	ema3: [],
	emas_max_min: function(start, end, array) {
		this.ema1 = this.ema_count(array, start, end, RANK_EMA[0], '');
		this.ema2 = this.ema_count(array, start, end, RANK_EMA[1], '');
		this.ema3 = this.ema_count(array, start, end, RANK_EMA[2], '');
		var maxmin_array = [];
		maxmin_array = macd.array_compare(start, end, this.ema1, this.ema2, this.ema3);
		return maxmin_array;
	},
	draw_emas: function(array, start, end, max_min, chart_settings) {
		mas.draw_move_line(this.ema1, max_min[0], max_min[1], start, end, chart_settings, "#FF0000");
		mas.draw_move_line(this.ema2, max_min[0], max_min[1], start, end, chart_settings, "#94C300");
		mas.draw_move_line(this.ema3, max_min[0], max_min[1], start, end, chart_settings, "#3159AD");
	},
	ema_count: function(array, start, end, inc_num, flag) {
		var ema_array = [];
		var smooth_modulus = 2 / (inc_num + 1);
		var sum = 0;
		var show_start = start;
		if (flag == "cloud") {
			if (start <= RANK_CLOUD[1]) {
				show_start = 0;
			} else {
				show_start -= RANK_CLOUD[1];
			}
		}
		for (var i = end; i < end + inc_num; i++) {
			sum += array[i]['bclose'];
		}
		ema_array[end - 1] = sum / inc_num;
		var yest_ema = ema_array[end - 1];
		for (var j = end - 2; j >= show_start; j--) {
			ema_array[j] = (smooth_modulus * (array[j]['bclose'] - yest_ema) + yest_ema);
			yest_ema = ema_array[j];
		}
		return ema_array;
	},
};