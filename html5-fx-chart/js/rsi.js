/************************************************************************/
// Author : zhaoqy
// Date : 2012-02-16 
/************************************************************************/
var rsi = rsi || {};
rsi = {
	max_min_array: [],
	draw_rsi: function(rate_array, start, end, CHART, RANK_RSI, flag) {
		var count_start = start;
		if (flag == "cloud") {
			var show = cal.cloud_show(start, end);
			count_start = show[0];
		}
		var median = Number(rate_array['pairz']['num']);
		var RSI_SHORT = [];
		var RSI_LONG = [];
		var num = end - count_start;
		RSI_LONG = this.rsi_count(rate_array, count_start, end, RANK_RSI[0]);
		RSI_SHORT = this.rsi_count(rate_array, count_start, end, RANK_RSI[1]);
		this.max_min_array = [100, 0];
		context_background.clearRect(0, CHART['y_start'], CHART['canvas_w'], CHART['canvas_h']);
		draw_bg(100, 0, median, num, CHART, CHART);
		context_chart.clearRect(0, CHART['y_start'], CHART['canvas_w'], CHART['canvas_h']);
		mas.draw_move_line(RSI_LONG, 100, 0, start, end, CHART, "#00FFFF", flag);
		macd.draw_two_chart_line(RSI_SHORT, 100, 0, start, end, CHART, "#00FF00", rate_array, flag);
	},
	rsi_count: function(array, start, end, inc_num) {
		var rsi_array = [];
		for (var i = start; i < end; i++) {
			var sum_up = 0;
			var sum_down = 0;
			var down = 0;
			var up = 0;
			var rs = 0;
			for (var j = 0; j < inc_num; j++) {
				var result = array[i + j]['bclose'] - array[i + j + 1]['bclose'];
				if (result > 0) {
					sum_up += result;
				} else if (result < 0) {
					sum_down += Math.abs(result);
				}
			}
			if (sum_down != 0) {
				up = sum_up / inc_num;
				down = sum_down / inc_num;
				rs = up / down;
				rsi_array[i] = 100 * rs / (1 + rs);
			} else {
				if (sum_up == 0) {
					rsi_array[i] = 0.0;
				} else {
					rsi_array[i] = 100.0;
				}
			}
		}
		return rsi_array;
	},
};