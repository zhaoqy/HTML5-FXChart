var tick = tick || {};
tick = {
	//The end of data
	show_end : 50,
	//The start of data
	show_start : 0,
	draw_tick : function(rate_array,start,end,tick_max,tick_min,chart_settings,mark){
		this.show_start=start;
		this.show_end=end;
		var Y_max = tick_max;
		var Y_min = tick_min;		
		var CHART=chart_settings.Clone();
		//The digits of exchange rate
		var median = rate_array['pairz']['num'];
		//The position of first data on X
		var x_pos = CHART['x_start'];
		//The space between every data on X	
		var x_blank = parseFloat((CHART['chart_width']) / (this.show_end-this.show_start)); 
		//The scale of the data on Y
		var y_blank = parseFloat((CHART['chart_height']/ (Y_max-Y_min)).toFixed(median)); 
		var line_color="#808080";			
		//Traverse record
		for(var i=this.show_end-2;i>=this.show_start;i--){
			//The position of the data at present on Y
			var y_c = (Y_max-rate_array[i][mark+'close'])*y_blank+CHART['y_start'];
			//The position of the data at present on X
			var x_c = x_pos+x_blank;
			//The position of last data on Y
			var y_pos = (Y_max-rate_array[i+1][mark+'close'])*y_blank+CHART['y_start'];
			//Paint lines
			line_basic_draw(context_chart,x_pos,y_pos,x_c,y_c,1,line_color);
			//Paint vertical line every ten
			if(!((i+1)%10)&&i>this.show_start&&i<this.show_end-1){
				v_CHART(x_c,rate_array[i]["utimer"],CHART);
			}
			x_pos += x_blank;
		}
		top(rate_array,this.show_start,CHART['x_pos'],(Y_max-rate_array[this.show_start][mark+'close'])*y_blank+CHART['y_start'],mark);	
	}
}