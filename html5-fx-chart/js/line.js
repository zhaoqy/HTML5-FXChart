/************************************************************************/
// Author : zhaoqy
// Date : 2012-02-16 
/************************************************************************/
var line = line || {};
line = {
	draw_line: function(array, start, end, max_min, CHART, flag) {
		var num = end - start;
		var median = array['pairz']['num'];
		var x_blank_p = CHART['x_start'];
		var x_blank = parseFloat(CHART['chart_width'] / num);
		var previous_y = array[end - 1]['bclose'];
		var y_p = CHART['y_start'] + (max_min[0] - previous_y) * CHART['chart_height'] / (max_min[0] - max_min[1]);
		if (flag == 'cloud') {
			var show = cal.cloud_show(start, end);
			start = show[0];
			end = show[1];
		}
		for (var j = end - 2; j >= start; j--) {
			var current_y = array[j]['bclose'];
			var y_c = CHART['y_start'] + (max_min[0] - current_y) * CHART['chart_height'] / (max_min[0] - max_min[1]);
			var x_c = parseFloat((x_blank_p) + x_blank);
			var line_color = "";
			if (array[j + 1]['bclose'] - array[j]['bclose'] > 0) line_color = "#00f";
			if (array[j + 1]['bclose'] - array[j]['bclose'] < 0) line_color = "#f00";
			if (array[j + 1]['bclose'] - array[j]['bclose'] == 0) line_color = "#fff";
			line_basic_draw(context_chart, x_blank_p, y_p, x_c, y_c, 1, line_color);
			x_blank_p = x_c;
			y_p = y_c;
			if (flag == 'cloud') {
				if (!((j + 1 + RANK_CLOUD[1]) % 10) && j > start && j < end - 1) {
					v_CHART(x_c, array[j]["utimer"], CHART);
				}
			} else {
				if (!((j + 1) % 10) && j > start && j < end - 1) {
					v_CHART(x_c, array[j]["utimer"], CHART);
				}
			}
		}
		if (flag == 'cloud') {
			cal.v_fill(CHART, x_c, x_blank);
		}
		top(array, start, CHART['x_pos'], y_p);
	},
};