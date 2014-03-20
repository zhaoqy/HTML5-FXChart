/************************************************************************/
// Author : zhaoqy
// Date : 2012-02-16 
/************************************************************************/
var cloud = cloud || {};
cloud = {
	Tenkan: [],
	Kijun: [],
	Span1: [],
	Span2: [],
	cloud_max_min: function(start, end, array) {
		// Calculate the data of four cloud lines
		this.Tenkan = this.hl_cloud(array, start, end, RANK_CLOUD[0], 'tenkan');
		this.Kijun = this.hl_cloud(array, start, end, RANK_CLOUD[1], 'kijun');
		this.Span1 = this.span1_cloud(this.Tenkan, this.Kijun, start, end);
		this.Span2 = this.hl_cloud(array, start, end, RANK_CLOUD[2], 'span2');
		// Get the max and the min from four cloud lines
		var maxmin_array = [];
		maxmin_array = this.array_compare(start, end, this.Tenkan, this.Kijun, this.Span1, this.Span2);
		return maxmin_array;
	},
	draw_cloud: function(array, start, end, max_min, chart_settings) {
		// Calculate the data of four cloud lines
		this.Tenkan = this.hl_cloud(array, start, end, RANK_CLOUD[0], 'tenkan');
		this.Kijun = this.hl_cloud(array, start, end, RANK_CLOUD[1], 'kijun');
		this.Span1 = this.span1_cloud(this.Tenkan, this.Kijun, start, end);
		this.Span2 = this.hl_cloud(array, start, end, RANK_CLOUD[2], 'span2');
		//Paint four cloud lines
		this.draw_move_line(this.Span1, max_min[0], max_min[1], start, end, chart_settings, "#0000CD", 'span1');
		this.draw_move_line(this.Span2, max_min[0], max_min[1], start, end, chart_settings, "#FF00FF", 'span2');
		this.cloud_fill(this.Span1, this.Span2, max_min[0], max_min[1], start, end, chart_settings, '#fff');
		this.draw_move_line(this.Tenkan, max_min[0], max_min[1], start, end, chart_settings, "#ffa500", 'tenkan');
		this.draw_move_line(this.Kijun, max_min[0], max_min[1], start, end, chart_settings, "#006400", 'kijun');
	},
	//Get new data from moving cycle of type1
	hl_cloud: function(array, start, end, inc_num, flag) {
		var hl_cloud = [];
		var show_end = end;
		var show_start = start;
		//The start of tenkan and kijun move RANK_CLOUD[1]
		if (flag == 'tenkan' || flag == 'kijun') {
			if (show_start <= RANK_CLOUD[1]) {
				show_start = 0;
			} else {
				show_start -= RANK_CLOUD[1];
			}
		}
		for (var i = show_start; i < show_end; i++) {
			var max = cal.get_max(i, i + inc_num, array, 'bhigh');
			var min = cal.get_min(i, i + inc_num, array, 'blow');
			hl_cloud[i] = (max + min) / 2;
		}
		return hl_cloud;
	},
	//Calculate average value of two lines
	span1_cloud: function(Tenkan, Kijun, start, end) {
		var span1_cloud = [];
		for (var i = start; i < end; i++) {
			span1_cloud[i] = (Tenkan[i] + Kijun[i]) / 2;
		}
		return span1_cloud;
	},
	//Paint lines
	draw_move_line: function(ma_array, max, min, start, end, CHART, color, flag) {
		//The position of first data on X
		var x_pos = CHART['x_start'];
		//The space between every data on X
		var x_blank = parseFloat((CHART['chart_width']) / (end - start));
		//The scale of the data on Y
		var y_blank = parseFloat(CHART['chart_height'] / (max - min));
		var show_end = end;
		var show_start = start;
		if (flag == 'tenkan' || flag == 'kijun') {
			var show = cal.cloud_show(start, end);
			show_start = show[0];
			show_end = show[1];
		}
		//Traverse record
		for (var i = show_end - 2; i >= show_start; i--) {
			//The position of the data at present on Y
			var y_c = (max - ma_array[i]) * y_blank + CHART['y_start'];
			//The position of the data at present on X
			var x_c = x_pos + x_blank;
			//The position of last data on Y
			var y_pos = (max - ma_array[i + 1]) * y_blank + CHART['y_start'];
			//Paint lines
			line_basic_draw(context_chart, x_pos, y_pos, x_c, y_c, 1, color);
			x_pos += x_blank;
		}
	},
	//Get the max and the min from more arrays
	array_compare: function(start, end, Tenkan, Kijun, Span1, Span2) {
		var ma_max = Span1[start];
		var ma_min = Span1[start + 1];
		if (typeof(Tenkan) != "undefined") {
			var show = cal.cloud_show(start, end);
			var show_start = show[0];
			var show_end = show[1];
			for (var i = show_start; i < show_end; i++) {
				if (Tenkan[i] - ma_max > 0) ma_max = Tenkan[i];
				if (Tenkan[i] - ma_min < 0) ma_min = Tenkan[i];
			}
		}
		if (typeof(Kijun) != "undefined") {
			var show = cal.cloud_show(start, end);
			var show_start = show[0];
			var show_end = show[1];
			for (var i = show_start; i < show_end; i++) {
				if (Kijun[i] - ma_max > 0) ma_max = Kijun[i];
				if (Kijun[i] - ma_min < 0) ma_min = Kijun[i];
			}
		}
		if (typeof(Span1) != "undefined") {
			for (var i = start; i < end; i++) {
				if (Span1[i] - ma_max > 0) ma_max = Span1[i];
				if (Span1[i] - ma_min < 0) ma_min = Span1[i];
			}
		}
		if (typeof(Span2) != "undefined") {
			for (var i = start; i < end; i++) {
				if (Span2[i] - ma_max > 0) ma_max = Span2[i];
				if (Span2[i] - ma_min < 0) ma_min = Span2[i];
			}
		}
		return [ma_max, ma_min];
	},
	cloud_fill: function(span1, span2, max, min, start, end, CHART, color) {
		//The position of first data on X
		var x_pos = CHART['x_start'];
		//The space between every data on X
		var x_blank = parseFloat((CHART['chart_width']) / (end - start));
		//The scale of the data on Y
		var y_blank = parseFloat(CHART['chart_height'] / (max - min));
		//Traverse record
		for (var i = end - 2; i >= start; i--) {
			//The position of span1 at present on Y
			var y_c1 = (max - span1[i]) * y_blank + CHART['y_start'];
			//The position of span1 at present on X
			var x_c1 = x_pos + x_blank;
			//The position of span2 at present on Y
			var y_c2 = (max - span2[i]) * y_blank + CHART['y_start'];
			//The position of span2 at present on X
			var x_c2 = x_pos + x_blank;
			//The position of last span1 on Y
			var y_pos1 = (max - span1[i + 1]) * y_blank + CHART['y_start'];
			//The position of last span2 on Y
			var y_pos2 = (max - span2[i + 1]) * y_blank + CHART['y_start'];
			context_chart.beginPath();
			context_chart.lineWidth = 0.1;
			context_chart.strokeStyle = "rgba(84,101,84,0.5)";
			context_chart.moveTo(x_pos, y_pos1);
			context_chart.lineTo(x_pos, y_pos2);
			context_chart.lineTo(x_c2, y_c2);
			context_chart.lineTo(x_c1, y_c1);
			context_chart.closePath();
			context_chart.stroke();
			context_chart.fillStyle = "rgba(84,101,84,0.5)";
			context_chart.fill();
			x_pos += x_blank;
		}
	}
};