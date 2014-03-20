var mas = mas || {};
mas = {
	ma1 : [],
	ma2 : [],
	ma3 : [],
	mas_max_min : function(start,end,array){
		var count_num = end-start;
		var high_max =  array[count_num-1]['bhigh'];
		var high_min =  array[count_num-1]['blow'];	
		for(var j=count_num-2;j>=start;j--){
			if(array[j]['bhigh'] > high_max)  high_max = array[j]['bhigh'];
			if(array[j]['blow'] < high_min)   high_min = array[j]['blow'];
		}	
		this.ma1 = this.ma_count(array,start,end,RANK_MA[0]);
		this.ma2 = this.ma_count(array,start,end,RANK_MA[1]);
		this.ma3 = this.ma_count(array,start,end,RANK_MA[2]); 
		var maxmin_array = [];
		maxmin_array = macd.array_compare(start,end,this.ma1,this.ma2,this.ma3);
		return maxmin_array;
	},
	draw_mas : function(array,start,end,max_min,chart_settings){
		this.ma1 = this.ma_count(array,start,end,RANK_MA[0]);
		this.ma2 = this.ma_count(array,start,end,RANK_MA[1]);
		this.ma3 = this.ma_count(array,start,end,RANK_MA[2]);
		this.draw_move_line(this.ma1,max_min[0],max_min[1],start,end,chart_settings,"#FF0000");
		this.draw_move_line(this.ma2,max_min[0],max_min[1],start,end,chart_settings,"#94C300");
		this.draw_move_line(this.ma3,max_min[0],max_min[1],start,end,chart_settings,"#3159AD");  
	},
 	ma_count : function (array,start,end,inc_num,flag){
		var ma_array = [];
		var show_start = start;
		if(flag == "cloud"){
			if(start<=RANK_CLOUD[1]){
				show_start = 0;
			}else{
				show_start -= RANK_CLOUD[1];
			}
		}
		for(var i=show_start;i<end;i++){
			var sum = 0;
			for(var j=0; j<inc_num;j++){
				sum += array[i+j]['bclose'];
			}
			ma_array[i] = sum/inc_num;
		}
		return ma_array;
	},	
	draw_move_line : function (ma_array,max,min,start,end,CHART,color,flag){
		var num = end-start;
		var ma_previous_y = ma_array[end-1];
		var ma_previous_y_p = CHART['y_start']+(max-ma_previous_y)*CHART['chart_height']/(max-min);
		var ma_x_blank_p = CHART['x_start'];
		var ma_x_blank = parseFloat(CHART['chart_width'] / num);
		var show_start = start ;
		var show_end = end;	
		if(flag=='cloud'){
            var show = cal.cloud_show(start,end);
            show_start = show[0];
            show_end = show[1];
        }	
		for(var i=show_end-2;i>=show_start;i--){
			var current_ma_y  = Number(ma_array[i]); 
			var ma_y_c	= CHART['y_start']+(max-current_ma_y)*CHART['chart_height']/(max-min);
			var x_c = parseFloat((ma_x_blank_p) + ma_x_blank);	
			line_basic_draw(context_chart,ma_x_blank_p,ma_previous_y_p,x_c,ma_y_c,1,color);
			ma_x_blank_p = x_c;
			ma_previous_y_p = ma_y_c;
		}
	}
};