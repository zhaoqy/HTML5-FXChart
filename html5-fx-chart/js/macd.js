/************************************************************************/
// Author : zhaoqy
// Date : 2012-02-16 
/************************************************************************/
var macd = macd || {};
macd = {
	max_min_array: [],
	SHORT: [],
	LONG: [],
	macd_max_min: function(start, end, array) {
		this.SHORT = emas.ema_count(array, start, end, RANK_MACD[0], '');
		this.LONG = emas.ema_count(array, start, end, RANK_MACD[1], '');
		var max_min_array = this.array_compare(start, end, this.SHORT, this.LONG, '');
		return max_min_array;
	},
	draw_long_short: function(rate_array, start, end, max_min, CHART, flag) {
		var show_start = start;
		if (flag == "cloud") {
			var show = cal.cloud_show(start, end);
			start = show[0];
		}
		mas.draw_move_line(this.SHORT, max_min[0], max_min[1], show_start, end, CHART, "#00FFFF", flag);
		mas.draw_move_line(this.LONG, max_min[0], max_min[1], show_start, end, CHART, "#FF00FF", flag);
	},
	draw_macd: function(rate_array, start, end, CHART, RANK_MACD, flag) {
		var count_start = start;
		if (flag == "cloud") {
			var show = cal.cloud_show(start, end);
			count_start = show[0];
		}
		var median = Number(rate_array['pairz']['num']);
		var num = end - start;
		var EMA_SHORT = emas.ema_count(rate_array, count_start, end + RANK_MACD[2], RANK_MACD[0], flag);
		var EMA_LONG = emas.ema_count(rate_array, count_start, end + RANK_MACD[2], RANK_MACD[1], flag);

		var MACD = [];
		for (var i = count_start; i < end; i++) {
			MACD[i] = EMA_SHORT[i] - EMA_LONG[i];
		}
		var SIG = [];
		var temp = [];
		for (var i = count_start; i < end + RANK_MACD[2]; i++) {
			temp[i] = EMA_SHORT[i] - EMA_LONG[i];
		}
		SIG = this.macd_sig_count(temp, count_start, end, RANK_MACD[2]);
		this.max_min_array = macd.array_compare(count_start, end, MACD, SIG, '');
		this.max_min_array[0] = this.max_min_array[0] + Number(rate_array['pairz']['high']);
		this.max_min_array[1] = this.max_min_array[1] - Number(rate_array['pairz']['low']);
		context_background.clearRect(0, CHART['y_start'], CHART['canvas_w'], CHART['canvas_h']);
		draw_bg(this.max_min_array[0], this.max_min_array[1], median, num, CHART);
		context_chart.clearRect(0, CHART['y_start'], CHART['canvas_w'], CHART['canvas_h']);
		mas.draw_move_line(MACD, this.max_min_array[0], this.max_min_array[1], start, end, CHART, "#FF8E00", flag);
		this.draw_two_chart_line(SIG, this.max_min_array[0], this.max_min_array[1], start, end, CHART, "#00EF00", rate_array, flag);
	},
	macd_sig_count: function(array, start, end, inc_num) {
		var ema_array = [];
		var smooth_modulus = 2 / (inc_num + 1);
		var sum = 0;
		for (var i = end; i < end + inc_num; i++) {
			sum += array[i];
		}
		ema_array[end - 1] = sum / inc_num;
		var yest_ema = ema_array[end - 1];
		for (var j = end - 2; j >= start; j--) {
			ema_array[j] = smooth_modulus * (array[j] - yest_ema) + yest_ema;
			yest_ema = ema_array[j];
		}
		return ema_array;
	},
	draw_two_chart_line: function(ma_array, max, min, start, end, CHART, color, array, flag) {
		var num = end - start;
		var ma_previous_y = ma_array[end - 1];
		var ma_previous_y_p = CHART['y_start'] + (max - ma_previous_y) * CHART['chart_height'] / (max - min);
		var ma_x_blank_p = CHART['x_start'];
		var ma_x_blank = parseFloat(CHART['chart_width'] / num);
		var show_start = start;
		var show_end = end;
		if (flag == 'cloud') {
			var show = cal.cloud_show(start, end);
			show_start = show[0];
			show_end = show[1];
		}
		for (var i = show_end - 2; i >= show_start; i--) {
			var current_ma_y = Number(ma_array[i]);
			var ma_y_c = CHART['y_start'] + (max - current_ma_y) * CHART['chart_height'] / (max - min);
			var x_c = parseFloat((ma_x_blank_p) + ma_x_blank);
			line_basic_draw(context_chart, ma_x_blank_p, ma_previous_y_p, x_c, ma_y_c, 1, color);
			ma_x_blank_p = x_c;
			ma_previous_y_p = ma_y_c;
			if (flag == 'cloud') {
				if (!((i + 1 + RANK_CLOUD[1]) % 10) && i > show_start && i < show_end - 1) {
					v_CHART(x_c, array[i]["utimer"], CHART);
				}
			} else {
				if (!((i + 1) % 10) && i > show_start && i < show_end - 1) {
					v_CHART(x_c, array[i]["utimer"], CHART);
				}
			}
		}
		if (flag == "cloud") {
			cal.v_fill(CHART, x_c, ma_x_blank);
		}
	},
	array_compare: function(start, end, ma1, ma2, ma3) {
		var ma_max = ma1[start];
		var ma_min = ma1[start + 1];
		if (ma1 != "") {
			for (var i = start; i < end; i++) {
				if (ma1[i] - ma_max > 0) ma_max = ma1[i];
				if (ma1[i] - ma_min < 0) ma_min = ma1[i];
			}
		}
		if (ma2 != "") {
			for (var i = start; i < end; i++) {
				if (ma2[i] - ma_max > 0) ma_max = ma2[i];
				if (ma2[i] - ma_min < 0) ma_min = ma2[i];
			}
		}
		if (ma3 != "") {
			for (var i = start; i < end; i++) {
				if (ma3[i] - ma_max > 0) ma_max = ma3[i];
				if (ma3[i] - ma_min < 0) ma_min = ma3[i];
			}
		}
		return [ma_max, ma_min];
	},
};