var cand = cand || {};
cand = {
	//The end of data
	end : 50,
	//The start of data
	start : 0,
	drawCandle : function(time,high,low,open,close){	
		context_chart.save();		
		//Upper shadow and lower shadow	
		context_chart.beginPath();
		context_chart.strokeStyle="#fff";
		context_chart.lineWidth=1;
		context_chart.moveTo(time,high);
		context_chart.lineTo(time,low);
		context_chart.stroke();
		context_chart.restore();		
		//Stereogram
		context_chart.beginPath();
		context_chart.strokeStyle="#fff";
		if(close>open){
			context_chart.strokeStyle="#4169E1";
		}
		if(close<open){
			context_chart.strokeStyle="#f00";
		}
		context_chart.lineWidth=5;
		context_chart.moveTo(time,open);
		context_chart.lineTo(time,close);
		context_chart.stroke();			
	},
	draw_cand : function(rate_array,start,end,cand_max,cand_min,chart_settings,flag){
		this.start=start;
		this.end=end;
		var Y_max = cand_max;
		var Y_min = cand_min;		
		var CHART=chart_settings.Clone();
		//The digits of exchange rate
		var median = rate_array['pairz']['num'];
		//The position of first data on X
		var x_pos = CHART['x_start'];			
		//The space between every data on X
		var x_blank = parseFloat((CHART['chart_width']) / (this.end-this.start)); 
		//The scale of the data on Y
		var y_blank = parseFloat((CHART['chart_height']/ (Y_max-Y_min)).toFixed(median)); 			
		var rate = [];
		//If type3 is cloud,the number of type1 and type2 will move RANK_CLOUD[1]
		var show_end = end;
		var show_start = start;
		if(flag=='cloud'){
			var show = cal.cloud_show(start,end);
			show_start = show[0];
			show_end = show[1];
		}
		//Traverse record
		for(var i=show_end-1;i>=show_start;i--){
			rate[i] = [];				
			rate[i]['bhigh']=(Y_max-rate_array[i]['bhigh'])*y_blank+CHART['y_start'];
			rate[i]['blow']=(Y_max-rate_array[i]['blow'])*y_blank+CHART['y_start'];
			rate[i]['bopen']=(Y_max-rate_array[i]['bopen'])*y_blank+CHART['y_start'];
			rate[i]['bclose']=(Y_max-rate_array[i]['bclose'])*y_blank+CHART['y_start'];			
			this.drawCandle(x_pos,rate[i]['bhigh'],rate[i]['blow'],rate[i]['bopen'],rate[i]['bclose']);
			//Paint vertical line every ten
			if(flag=='cloud'){
				if(!((i+1+RANK_CLOUD[1])%10)&&i>show_start&&i<show_end-1){
					v_CHART(x_pos,rate_array[i]["utimer"],CHART);
				}					
			}else{
				if(!((i+1)%10)&&i>show_start&&i<show_end-1){
					v_CHART(x_pos,rate_array[i]["utimer"],CHART);
				}
			}
			x_pos+=x_blank;
		}
		//Complement the right vertical lines
		x_pos-=x_blank;
		if(flag=='cloud'){
			cal.v_fill(CHART,x_pos,x_blank);
		}
		top(rate_array,show_start,CHART['x_pos'],rate[show_start]['bclose']);			
	}
}