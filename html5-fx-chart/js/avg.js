var avg = avg || {};
avg = {
	start_value : [],
	high_value  : [],
	low_value   : [],
	close_vlaue  : [],
	avg_max_min : function(start,end,array){
		this.start_value[end-1] = (array[end]['bopen']+array[end]['bclose'])/2;
		this.high_value[end-1]  = array[end-1]['bhigh'];
		this.low_value[end-1]   = array[end-1]['blow'];	
		this.close_vlaue[end-1]  = (array[end-1]['bhigh']+array[end-1]['bopen']+array[end-1]['blow']+array[end-1]['bclose'])/4;
		for(var i=end-2;i>=start;i--){
			this.start_value[i]	= (this.start_value[i+1] + this.close_vlaue[i+1])/2;
			this.high_value[i]	= array[i]['bhigh'];
			this.low_value[i] 	= array[i]['blow'];
			this.close_vlaue[i]	= (array[i]['bhigh']+array[i]['bopen']+array[i]['blow']+array[i]['bclose'])/4;
		}
		var high_max_min_array = this.get_max_min(this.high_value);
		var low_max_min_array  = this.get_max_min(this.low_value);

		return [high_max_min_array[0],low_max_min_array[1]];
	},
	draw_avg : function(array,start,end,max_min,chart_settings,flag){
		var x_blank_p = chart_settings['x_start'];
		var x_blank = parseFloat(chart_settings['chart_width']/(end-start));  
		var open_point = '';
		var close_point = '';
		var high_point = '';
		var low_point = '';
		var show_start = start;
		var show_end = end;
		if(flag=='cloud'){
			var show = cal.cloud_show(start,end);
			show_start = show[0];
			show_end = show[1];
		}
		for(var i =show_end-1;i>=show_start;i--){
			open_point = chart_settings['y_start']+(max_min[0]-this.start_value[i])*chart_settings['chart_height']/(max_min[0]-max_min[1]);
			close_point = chart_settings['y_start']+(max_min[0]-this.close_vlaue[i])*chart_settings['chart_height']/(max_min[0]-max_min[1]);
			high_point = chart_settings['y_start']+(max_min[0]-this.high_value[i])*chart_settings['chart_height']/(max_min[0]-max_min[1]);
			low_point = chart_settings['y_start']+(max_min[0]-this.low_value[i])*chart_settings['chart_height']/(max_min[0]-max_min[1]);
			var cand_color = "" ;
			if(this.start_value[i]-this.close_vlaue[i]>0){
				cand_color = "#0f0";
			}else if(this.start_value[i]-this.close_vlaue[i]<0){
				cand_color = "#f00";
			}else if(this.start_value[i]-this.close_vlaue[i]==0){
				cand_color = "#fff";
			}			
			cand.drawCandle(x_blank_p,high_point,low_point,open_point,close_point);
			if(flag=='cloud'){
				if(!((i+1+RANK_CLOUD[1])%10)&&i>show_start&&i<show_end-1){
					v_CHART(x_blank_p,array[i]["utimer"],chart_settings);
				}					
			}else{
				if(!((i+1)%10)&&i>show_start&&i<show_end-1){
					v_CHART(x_blank_p,array[i]["utimer"],chart_settings);
				}
			}
			x_blank_p += x_blank ;
		}
		if(flag=='cloud'){
			cal.v_fill(chart_settings,x_blank_p-x_blank,x_blank);
		}
		top(array,show_start,CHART['x_pos'],close_point);		
	},
	get_max_min : function (array){
		return [Array.max(array),Array.min(array)];
	}
};