/************************************************************************/
// Author : zhaoqy 
// Date : 2012-02-16 
/************************************************************************/
var main = main || {};
main = {
	cross_x : 0,
	cross_y : 0,
	divide : 3/5,
	JSONData : {},
	currentRate : {},
	type_settings : {},
	chart_settings : {},
	show_num : 200,
    x_blank : 0,
	init : function(type_settings,chart_settings){
		this.type_settings = type_settings;
		this.chart_settings = chart_settings;		
		comon.update_request(this.type_settings.pairs, this.type_settings.unit, this.type_settings.num,"main");
		var rate =comon.get_rate(this.type_settings.pairs, this.type_settings.unit, this.type_settings.num);	
		if(rate != null ){
			this.JSONData =rate;	
			this.main_draw(this.type_settings,this.chart_settings,this.JSONData);
			show_bid_ask(this.JSONData);
		}
		if(type_settings.unit != "ask" && type_settings.unit != "bid"){
			text_y_pos_inc = 20;	//init redraw value
			this.draw_type_text();
		}
	},	
	main_draw : function(type_settings,chart_settings,JSONData){
		//If unit is tick the function will add parameter named mark
		if(type_settings.unit == "ask" || type_settings.unit == "bid"){
			var mark = type_settings.unit.charAt(0);
			canvas_chartText.clearRect(0,0,chart_settings['canvas_w'],chart_settings['canvas_h']);
			this.tick_draw(type_settings,chart_settings,JSONData,mark);
		}else{
			switch(type_settings.type1){
				case "line"  :  this.line_draw(type_settings,chart_settings,JSONData);    break ;
				case "cand"  :  this.cand_draw(type_settings,chart_settings,JSONData);  break ;
				case "avg"   :  this.avg_draw(type_settings,chart_settings,JSONData);    break;
			}
		}
		//Keep updating cross curve
		if(comon.diamonds == false){
			this.position(this.cross_x,this.cross_y);
		}
	},
	line_draw : function(type_settings,chart_settings,JSONData){
		var chart_settings_first = chart_settings.Clone();
		var chart_settings_second = chart_settings.Clone();
		if(this.type_settings.type3!=''){
			chart_settings_first['chart_height'] = chart_settings_first['chart_height'] * this.divide;
			chart_settings_second['chart_height'] = chart_settings_second['chart_height'] * (1-this.divide);
			chart_settings_first['canvas_h'] = chart_settings_first['chart_height'] + chart_settings_first['y_start'];
			chart_settings_second['canvas_h'] = chart_settings_second['canvas_h'] - chart_settings_first['canvas_h'];
			chart_settings_first['y_pos'] = chart_settings_first['y_pos']-chart_settings_second['chart_height'];
			chart_settings_second['y_start'] = chart_settings_second['y_start']+chart_settings_first['chart_height'];
		}		
		var line_max_min = cal.get_max_min(type_settings.start,type_settings.end,JSONData,"bclose");
		var max_min = [];			
		var median = JSONData['pairz']['num'];
		var flag = '';
		switch(this.type_settings.type2){
			case "mas"  : 
				flag = "mas";
				max_min = mas.mas_max_min(type_settings.start,type_settings.end,JSONData);
				break ;
			case "emas":  
				flag = "emas";
				max_min = emas.emas_max_min(type_settings.start,type_settings.end,JSONData);
				break ;
			case "cloud"  : 
				flag = "cloud";
				max_min = cloud.cloud_max_min(type_settings.start,type_settings.end,JSONData);
				break;
			case "tech"  :  
				flag = "tech";
				max_min = tech.tech_max_min(type_settings.start,type_settings.end,JSONData);
				break;
			default : break;
		}	
		if(this.type_settings.type3!=''&& this.type_settings.type3=="macd"){
			var macd_max_min = macd.macd_max_min(type_settings.start,type_settings.end,JSONData);
		}
		if(flag=='cloud'){
			var show = cal.cloud_show(type_settings.start,type_settings.end);
			var	show_start = show[0];
			var	show_end   = show[1];
			line_max_min   = cal.get_max_min(show_start,show_end,JSONData,"bclose");
			if(this.type_settings.type3!=''&& this.type_settings.type3=="macd"){
				macd_max_min   = macd.macd_max_min(show_start,show_end,JSONData);
			}
		}
		if(max_min.length!=0){
			if(line_max_min[0]-max_min[0]<0)  {
				line_max_min[0] = max_min[0];
			}
			if(line_max_min[1]-max_min[1]>0) {
				line_max_min[1] = max_min[1];
			}
		}	
		if(typeof(macd_max_min)!="undefined"){
			if(line_max_min[0]-macd_max_min[0]<0)  {
				line_max_min[0] = macd_max_min[0];
			}
			if(line_max_min[1]-macd_max_min[1]>0) {
				line_max_min[1] = macd_max_min[1];
			}
		}
		line_max_min[0] = line_max_min[0]+JSONData['pairz']['high'];
		line_max_min[1] = line_max_min[1] - JSONData['pairz']['low'];
		var count_num = type_settings.end-type_settings.start;
		context_background.clearRect(0,0,chart_settings_first['canvas_w'],chart_settings_first['canvas_h']);	
		draw_bg(line_max_min[0],line_max_min[1],median,count_num,chart_settings_first,'type1');
		context_chart.clearRect(0,0,chart_settings_first['canvas_w'],chart_settings_first['canvas_h']);
		line.draw_line(JSONData,type_settings.start,type_settings.end,line_max_min,chart_settings_first,flag);
		if(flag=="mas"){
			mas.draw_mas(JSONData,type_settings.start,type_settings.end,line_max_min,chart_settings_first);
		}else if(flag=="emas"){
			emas.draw_emas(JSONData,type_settings.start,type_settings.end,line_max_min,chart_settings_first);
		}else if(flag=="cloud"){
			cloud.draw_cloud(JSONData,type_settings.start,type_settings.end,line_max_min,chart_settings_first);
		}else if(flag=="tech"){
			tech.draw_tech(JSONData,type_settings.start,type_settings.end,line_max_min,chart_settings_first);
		}
		if(this.type_settings.type3!=''){
			switch(this.type_settings.type3){
				case "macd" :
					macd.draw_macd(JSONData,type_settings.start,type_settings.end,chart_settings_second,RANK_MACD,flag);
					macd.draw_long_short(JSONData,type_settings.start,type_settings.end,line_max_min,chart_settings_first,flag);
					break ;
				case "sto" :
					sto.draw_sto(JSONData,type_settings.start,type_settings.end,chart_settings_second,RANK_STO,flag);
					break;
				case "rsi" :
					rsi.draw_rsi(JSONData,type_settings.start,type_settings.end,chart_settings_second,RANK_RSI,flag);
					break;
				default : break;
			}	
		}	
	},
	cand_draw : function(type_settings,chart_settings,JSONData){
		//Initialize two chart_settings of the type3
		var chart_settings_first = chart_settings.Clone();
		var chart_settings_second = chart_settings.Clone();
		if(this.type_settings.type3!=''){
			chart_settings_first['chart_height'] = chart_settings_first['chart_height'] * this.divide;
			chart_settings_second['chart_height'] = chart_settings_second['chart_height'] * (1-this.divide);
			chart_settings_first['canvas_h'] = chart_settings_first['chart_height'] + chart_settings_first['y_start'];
			chart_settings_second['canvas_h'] = chart_settings_second['canvas_h'] - chart_settings_first['canvas_h'];
			chart_settings_first['y_pos'] = chart_settings_first['y_pos']-chart_settings_second['chart_height'];
			chart_settings_second['y_start'] = chart_settings_second['y_start']+chart_settings_first['chart_height'];
		}
		var cand_max = cal.get_max(type_settings.start,type_settings.end,JSONData,"bhigh");
		var cand_min = cal.get_min(type_settings.start,type_settings.end,JSONData,"blow");
		var median = JSONData['pairz']['num'];
		var flag = '';
		var max_min = [];
		//Get the max and the min from the type2 data
		switch(this.type_settings.type2){
			case "mas"  : 
				flag = "mas";
				max_min = mas.mas_max_min(type_settings.start,type_settings.end,JSONData);
				break ;
			case "emas":  
				flag = "emas";
				max_min = emas.emas_max_min(type_settings.start,type_settings.end,JSONData);
				break ;
			case "cloud"  : 
				flag = "cloud";
				max_min = cloud.cloud_max_min(type_settings.start,type_settings.end,JSONData);
				break;
			case "tech"  :  
				flag = "tech";
				max_min = tech.tech_max_min(type_settings.start,type_settings.end,JSONData);
				break;
			default : break;
		}
		if(this.type_settings.type3!=''&& this.type_settings.type3=="macd"){
			var macd_max_min = macd.macd_max_min(type_settings.start,type_settings.end,JSONData);
		}
		//If type3 is cloud,the number of type1 and type2 will move RANK_CLOUD[1]
		if(flag=='cloud'){
			var show = cal.cloud_show(type_settings.start,type_settings.end);
			var	show_start = show[0];
			var	show_end = show[1];
			cand_max = cal.get_max(show_start,show_end,JSONData,"bhigh");
			cand_min = cal.get_min(show_start,show_end,JSONData,"blow");
			if(this.type_settings.type3!=''&& this.type_settings.type3=="macd"){
				macd_max_min   = macd.macd_max_min(show_start,show_end,JSONData);
			}
		}
		//Get the max and the min from the first chart
		if(max_min.length!=0){
			if(cand_max-max_min[0]<0)  {
				cand_max = max_min[0];
			}
			if(cand_min-max_min[1]>0) {
				cand_min = max_min[1];
			}
		}
		if(typeof(macd_max_min) != "undefined"){
			if(cand_max-macd_max_min[0]<0)  {
				cand_max = macd_max_min[0];
			}
			if(cand_min-macd_max_min[1]>0) {
				cand_min = macd_max_min[1];
			}
		}
		cand_max += JSONData['pairz']['high'];
		cand_min -= JSONData['pairz']['low'];
		var cand_max_min =[cand_max,cand_min];
		var count_num = type_settings.end-type_settings.start;
		//Paint the background and the type1
		context_background.clearRect(0,0,chart_settings_first['canvas_w'],chart_settings_first['canvas_h']);		
		draw_bg(cand_max,cand_min,median,count_num,chart_settings_first,'type1');
		context_chart.clearRect(0,0,chart_settings_first['canvas_w'],chart_settings_first['canvas_h']);
		cand.draw_cand(JSONData,type_settings.start,type_settings.end,cand_max,cand_min,chart_settings_first,flag);
		//Paint the type2
		if(flag=="mas"){
			mas.draw_mas(JSONData,type_settings.start,type_settings.end,cand_max_min,chart_settings_first);
		}else if(flag=="emas"){
			emas.draw_emas(JSONData,type_settings.start,type_settings.end,cand_max_min,chart_settings_first);
		}else if(flag=="cloud"){
			cloud.draw_cloud(JSONData,type_settings.start,type_settings.end,cand_max_min,chart_settings_first);
		}else if(flag=="tech"){
			tech.draw_tech(JSONData,type_settings.start,type_settings.end,cand_max_min,chart_settings_first);
		}
		//Paint the type3
		if(this.type_settings.type3!=''){
			switch(this.type_settings.type3){
				case "macd" :
					macd.draw_macd(JSONData,type_settings.start,type_settings.end,chart_settings_second,RANK_MACD,flag);
					macd.draw_long_short(JSONData,type_settings.start,type_settings.end,cand_max_min,chart_settings_first,flag);
					break ;
				case "sto" :
					sto.draw_sto(JSONData,type_settings.start,type_settings.end,chart_settings_second,RANK_STO,flag);
					break;
				case "rsi" :
					rsi.draw_rsi(JSONData,type_settings.start,type_settings.end,chart_settings_second,RANK_RSI,flag);
					break;
				default : break;
			}
		}		
	},
	tick_draw : function(type_settings,chart_settings,JSONData,mark){
		//Get the max and the min from the tick
		var tick_max = cal.get_max(type_settings.start,type_settings.end,JSONData,mark+"high");
		var tick_min = cal.get_min(type_settings.start,type_settings.end,JSONData,mark+"low");
		var median = JSONData['pairz']['num'];
		tick_max += JSONData['pairz']['high'];
		tick_min -= JSONData['pairz']['low'];
		var tick_max_min =[tick_max,tick_min];
		//Paint the background and the type1
		var count_num = type_settings.end-type_settings.start;
		context_background.clearRect(0,0,chart_settings['canvas_w'],chart_settings['canvas_h']);
		draw_bg(tick_max,tick_min,median,count_num,chart_settings);
		context_chart.clearRect(0,0,chart_settings['canvas_w'],chart_settings['canvas_h']);
		tick.draw_tick(JSONData,type_settings.start,type_settings.end,tick_max,tick_min,chart_settings,mark);
	},
	avg_draw : function(type_settings,chart_settings,JSONData){
		var chart_settings_first = chart_settings.Clone();
		var chart_settings_second = chart_settings.Clone();
		if(this.type_settings.type3!=''){
			chart_settings_first['chart_height'] = chart_settings_first['chart_height'] * this.divide;
			chart_settings_second['chart_height'] = chart_settings_second['chart_height'] * (1-this.divide);
			chart_settings_first['canvas_h'] = chart_settings_first['chart_height'] + chart_settings_first['y_start'];
			chart_settings_second['canvas_h'] = chart_settings_second['canvas_h'] - chart_settings_first['canvas_h'];
			chart_settings_first['y_pos'] = chart_settings_first['y_pos']-chart_settings_second['chart_height'];
			chart_settings_second['y_start'] = chart_settings_second['y_start']+chart_settings_first['chart_height'];
		}		
		if(this.type_settings.type3 != '' && this.type_settings.type3 == "macd"){
			var macd_max_min = macd.macd_max_min(type_settings.start,type_settings.end,JSONData);
		}
		if(flag=='cloud'){
			var show = cal.cloud_show(type_settings.start,type_settings.end);
			var	show_start = show[0];
			var	show_end   = show[1];
			var avg_max_min = avg.avg_max_min(show_start,show_end,JSONData);
			if(this.type_settings.type3 != ''&& this.type_settings.type3 =="macd"){
				macd_max_min   = macd.macd_max_min(show_start,show_end,JSONData);
			}
		}else{
			var avg_max_min = avg.avg_max_min(type_settings.start,type_settings.end,JSONData);
		}
		var max_min = [];			
		var median = JSONData['pairz']['num'];
		var flag = '';
		switch(this.type_settings.type2){
			case "mas"  : 
				flag = "mas";
				max_min = mas.mas_max_min(type_settings.start,type_settings.end,JSONData);
				break ;
			case "emas":  
				flag = "emas";
				max_min = emas.emas_max_min(type_settings.start,type_settings.end,JSONData);
				break ;
			case "cloud"  : 
				flag = "cloud";
				max_min = cloud.cloud_max_min(type_settings.start,type_settings.end,JSONData);
				break;
			case "tech"  :  
				flag = "tech";
				max_min = tech.tech_max_min(type_settings.start,type_settings.end,JSONData);
				break;
			default : break;
		}			
		if(max_min.length!=0){
			if(avg_max_min[0]-max_min[0]<0)  {
				avg_max_min[0] = max_min[0];
			}
			if(avg_max_min[1]-max_min[1]>0) {
				avg_max_min[1] = max_min[1];
			}
		}	
		if(typeof(macd_max_min)!="undefined"){
			if(avg_max_min[0]-macd_max_min[0]<0)  {
				avg_max_min[0] = macd_max_min[0];
			}
			if(avg_max_min[1]-macd_max_min[1]>0) {
				avg_max_min[1] = macd_max_min[1];
			}
		}
		avg_max_min[0] = avg_max_min[0] +JSONData['pairz']['high'];
		avg_max_min[1] = avg_max_min[1] - JSONData['pairz']['low'];
		var count_num = type_settings.end-type_settings.start;
		context_background.clearRect(0,0,chart_settings_first['canvas_w'],chart_settings_first['canvas_h']);
		draw_bg(avg_max_min[0],avg_max_min[1],median,count_num,chart_settings_first,'type1');
		context_chart.clearRect(0,0,chart_settings_first['canvas_w'],chart_settings_first['canvas_h']);
		avg.draw_avg(JSONData,type_settings.start,type_settings.end,avg_max_min,chart_settings_first,flag);	
		if(flag=="mas"){
			mas.draw_mas(JSONData,type_settings.start,type_settings.end,avg_max_min,chart_settings_first);
		}else if(flag=="emas"){
			emas.draw_emas(JSONData,type_settings.start,type_settings.end,avg_max_min,chart_settings_first);
		}else if(flag=="cloud"){
			cloud.draw_cloud(JSONData,type_settings.start,type_settings.end,avg_max_min,chart_settings_first);
		}else if(flag=="tech"){
			tech.draw_tech(JSONData,type_settings.start,type_settings.end,avg_max_min,chart_settings_first);
		}
		if(this.type_settings.type3!=''){
			switch(this.type_settings.type3){
				case "macd" :
					macd.draw_macd(JSONData,type_settings.start,type_settings.end,chart_settings_second,RANK_MACD,flag);
					macd.draw_long_short(JSONData,type_settings.start,type_settings.end,avg_max_min,chart_settings_first,flag);
					break ;
				case "sto" :
					sto.draw_sto(JSONData,type_settings.start,type_settings.end,chart_settings_second,RANK_STO,flag);
					break;
				case "rsi" :
					rsi.draw_rsi(JSONData,type_settings.start,type_settings.end,chart_settings_second,RANK_RSI,flag);
					break;
				default : break;
			}
		}		
	},
	drag : function(flag,distance){
		//If distance is positive drag right,or drag left
		//The space between every data on X
		var x_blank = parseFloat((this.chart_settings['chart_width']) / (this.type_settings.end-this.type_settings.start)); 
        this.x_blank = x_blank;
		//The dragging number (right:positive,left:negative)
		var move_num =parse_to_int(distance/x_blank);
		//The upper limit and the lower limit in dragging
		if(flag==0){
			//The processing of border       
			if(this.type_settings.end+move_num>=this.show_num){
				move_num=this.show_num-this.type_settings.end;
			}
            if(this.type_settings.start+move_num<=0){
				move_num=-this.type_settings.start;
			}
			this.type_settings.end +=move_num;
			this.type_settings.start +=move_num;
		}else if(flag==1){
			//Define the moving number
			var rmove_num,lmove_num;
			//The processing of limit
			if(this.type_settings.end-this.type_settings.start-move_num<this.type_settings.min){
				move_num=this.type_settings.end-this.type_settings.start-this.type_settings.min;				
			}
            if(this.type_settings.end-this.type_settings.start-move_num>this.type_settings.max){
				move_num=(this.type_settings.end-this.type_settings.start)-this.type_settings.max;				
			}
			rmove_num=parseInt(move_num/2);
			lmove_num=move_num-rmove_num;
			//The processing of border
			if(this.type_settings.end-rmove_num>=this.show_num){
				lmove_num=this.show_num-this.type_settings.end;
				rmove_num=move_num-rmove_num;
			}
            if(this.type_settings.start+move_num<=0){
				rmove_num=this.type_settings.start;
				lmove_num=move_num-lmove_num;
			}			
			//Moving number
			this.type_settings.end -=lmove_num;
			this.type_settings.start +=rmove_num;
		}
		this.main_draw(this.type_settings,this.chart_settings,this.JSONData);
	},
	zoom :function(flag,zoom_num){
		//If flag is zero,reduce from left to right by default.(the max number is 'max')
		if(flag==0&&this.type_settings.end-this.type_settings.start<this.type_settings.max){
			if(this.type_settings.end==this.show_num){
				//If the end equals the last record,reduce from right to left.(the right limit is zero)
				this.type_settings.start-=zoom_num;
				if(this.type_settings.start<0){
                    this.show_start=0;
				}
			}else{
				this.type_settings.end+=zoom_num;
				//The left limit is 'show_num'
				if(this.type_settings.end>this.show_num){
					this.type_settings.end=this.show_num;
				}				
			}
		}
		//If flag is one,magnify from right to left by default.(the min number is 'min')
		if(flag==1&&this.type_settings.end-this.type_settings.start>this.type_settings.min){
			this.type_settings.end-=zoom_num;
			//The left limit is 'show_num'
			if(this.type_settings.end>this.show_num){
				this.type_settings.end=this.show_num;
			}
		}
		this.main_draw(this.type_settings,this.chart_settings,this.JSONData);
	},
	//Cross curve
	position : function(x,y){
		context_diamonds.clearRect(0,0,CHART['canvas_w'],CHART['canvas_h']);
		//The processing of passing 'y_pos' or 'x_pos'
		if(y >= this.chart_settings['y_pos']){
			y = this.chart_settings['y_pos'];
		}
		if(x >= this.chart_settings['x_pos']){
			x = this.chart_settings['x_pos'];
		}
		var max_min = [];
		var flag = '';
		var pos_max = cal.get_max(this.type_settings.start,this.type_settings.end,this.JSONData,"bhigh");
		var pos_min = cal.get_min(this.type_settings.start,this.type_settings.end,this.JSONData,"blow");
		//If type2 the processing of 'pos_max' and 'pos_min'
		switch(this.type_settings.type2){
			case "mas"  : 
				flag = "mas";
				max_min = mas.mas_max_min(type_settings.start,type_settings.end,this.JSONData);
				break ;
			case "emas":  
				flag = "emas";
				max_min = emas.emas_max_min(type_settings.start,type_settings.end,this.JSONData);
				break ;
			case "cloud"  : 
				flag = "cloud";
				max_min = cloud.cloud_max_min(type_settings.start,type_settings.end,this.JSONData);
				break;
			case "tech"  :  
				flag = "tech";
				max_min = tech.tech_max_min(type_settings.start,type_settings.end,this.JSONData);
				break;
			default : break;
		}
		//If type3 is cloud,the number of type1 and type2 will move RANK_CLOUD[1]
		if(flag=='cloud'){
			var show = cal.cloud_show(type_settings.start,type_settings.end);
			var	show_start = show[0];
			var	show_end = show[1];
			pos_max = cal.get_max(show_start,show_end,this.JSONData,"bhigh");
			pos_min = cal.get_min(show_start,show_end,this.JSONData,"blow");
		}
		if(max_min.length!=0){
			if(pos_max-max_min[0]<0)  
			{
				pos_max = max_min[0];
			}
			if(pos_min-max_min[1]>0) 
			{
				pos_min = max_min[1];
			}
		}
		//Get the max and the min when unit is tick
		if(this.type_settings.unit == "ask" || this.type_settings.unit == "bid"){
			var mark = type_settings.unit.charAt(0);
			pos_max = cal.get_max(this.type_settings.start,this.type_settings.end,this.JSONData,mark+"high");
			pos_min = cal.get_min(this.type_settings.start,this.type_settings.end,this.JSONData,mark+"low");
		}
		pos_max += this.JSONData['pairz']['high'];
		pos_min -= this.JSONData['pairz']['low'];
		var median = this.JSONData['pairz']['num'];
		var y_blank = (pos_max-pos_min)/this.chart_settings['chart_height'];
		var y_data = y_blank*(this.chart_settings['chart_height']+this.chart_settings['y_start']-y)+pos_min;
		if(this.type_settings.type3!=''){
			//The processing of type3
			var chart_settings_first = this.chart_settings.Clone();
			var chart_settings_second = this.chart_settings.Clone();
			chart_settings_first['chart_height'] = chart_settings_first['chart_height'] * this.divide;
			chart_settings_second['chart_height'] = chart_settings_second['chart_height'] * (1-this.divide);
			chart_settings_first['canvas_h'] = chart_settings_first['canvas_h'] * this.divide;
			chart_settings_second['canvas_h'] = chart_settings_second['canvas_h'] * (1-this.divide);
			chart_settings_first['y_pos'] = chart_settings_first['y_pos']-chart_settings_second['chart_height'];
			chart_settings_second['y_start'] = chart_settings_second['y_start']+chart_settings_first['chart_height'];
			if(y > chart_settings_first['y_pos']){
				//The processing of passing the border between the first and the second chart
				switch(this.type_settings.type3){
					case 'macd' : 
						pos_max = macd.max_min_array[0];
						pos_min = macd.max_min_array[1];
						break;
					case 'rsi' : 
						pos_max = rsi.max_min_array[0];
						pos_min = rsi.max_min_array[1];
						break;
					case 'sto' : 
						pos_max = sto.max_min_array[0];
						pos_min = sto.max_min_array[1];
						break;
						
				}
				y_blank = (pos_max-pos_min)/chart_settings_second['chart_height'];
				y_data = y_blank*(chart_settings_second['chart_height']+chart_settings_second['y_start']-y)+pos_min;
			}else{
				y_blank = (pos_max-pos_min)/chart_settings_first['chart_height'];
				y_data = y_blank*(chart_settings_first['chart_height']+chart_settings_first['y_start']-y)+pos_min;
			}
		}
		//The space between every data on X
		var x_blank = parseFloat((this.chart_settings['chart_width']) / (this.type_settings.end-this.type_settings.start)); 
		//The data pointed by the vertical lines of cross curve
		var n = this.type_settings.end-parseInt((x-this.chart_settings['x_start'])/x_blank)-1;
		n = n>=0?n:0;
		var x_data = this.JSONData[n]["utimer"];
		if(y >= this.chart_settings['y_start'] && x >= this.chart_settings['x_start']){		
			context_diamonds.beginPath();
			context_diamonds.strokeStyle='rgba(255,255,0,0.7)';
			context_diamonds.lineWidth=2;
			context_diamonds.moveTo(this.chart_settings['x_start'],y);
			context_diamonds.lineTo(this.chart_settings['x_pos'],y);
			context_diamonds.stroke();
			context_diamonds.beginPath();
			context_diamonds.strokeStyle='rgba(255,255,0,0.7)';
			context_diamonds.lineWidth=2;
			context_diamonds.moveTo(x,this.chart_settings['y_start']);
			context_diamonds.lineTo(x,this.chart_settings['y_pos']);
			context_diamonds.stroke();
			//The data pointed by the horizontal lines of cross curve
			y_rate_shape(context_diamonds,y_data.toFixed(median),this.chart_settings['x_pos'],y,'#ffa500','#ffff00',"#000");
			//The data pointed by the vertical lines of cross curve
			if(this.type_settings.unit == "day"){
				var time = x_data.split("-");
				var Month = time[1];
				var Dates = time[2];
				x_time_shape(context_diamonds,Month+"/"+Dates,x,this.chart_settings['y_pos'],'#ffa500','#ffff00',"#000");
			}else{
				var time =(new Date()).format(x_data);	
				x_time_shape(context_diamonds,time['Hour']+":"+time['Minute'],x,this.chart_settings['y_pos'],'#ffa500','#ffff00',"#000")			
			}
			//The data pointed by the cross curve show on the top
			if(this.type_settings.unit!="bid"&&this.type_settings.unit!="ask"){
				var close = this.JSONData[n]['bclose'];
				var open = this.JSONData[n]['bopen'];
				var high = this.JSONData[n]['bhigh'];
				var low = this.JSONData[n]['blow'];
				//top value
				$("tickOpen").innerHTML=open.toFixed(median);
				$("tickClose").innerHTML=close.toFixed(median);	
				$("tickHigh").innerHTML=high.toFixed(median);
				$("tickLow").innerHTML=low.toFixed(median);
				//The processing of the date
				var time = (new Date()).format(this.JSONData[n]["utimer"]);
				if(this.type_settings.unit=="day"){
					$("chartTime").innerHTML=this.JSONData[n]["utimer"];
				}else{			
					$("chartTime").innerHTML=time['Year']+"-"+time['Month']+"-"+time['Dates']+" "+time['Hour']+":"+time['Minute'];
				}
			}
		}
		this.cross_x = x;
		this.cross_y = y;
	},
    draw_type_text : function(){
		var chart_settings_first = this.chart_settings.Clone();
		var chart_settings_second = this.chart_settings.Clone();
		if(this.type_settings.type3!=''){
			chart_settings_first['chart_height'] = chart_settings_first['chart_height'] * this.divide;
			chart_settings_second['chart_height'] = chart_settings_second['chart_height'] * (1-this.divide);
			chart_settings_first['canvas_h'] = chart_settings_first['chart_height'] + chart_settings_first['y_start'];
			chart_settings_second['canvas_h'] = chart_settings_second['canvas_h'] - chart_settings_first['canvas_h'];
			chart_settings_first['y_pos'] = chart_settings_first['y_pos']-chart_settings_second['chart_height'];
			chart_settings_second['y_start'] = chart_settings_second['y_start']+chart_settings_first['chart_height'];
		}	
		canvas_chartText.clearRect(0,0,this.chart_settings['canvas_w'],this.chart_settings['canvas_h']);
		if(this.type_settings.type2!=''){
			switch(this.type_settings.type2){
				case "mas": 
                        var string_1 = "ma:MA_"+RANK_MA[0];
                        var string_2 = "ma:MA_"+RANK_MA[1];
                        var string_3 = "ma:MA_"+RANK_MA[2];
                        text_basic_draw(canvas_chartText,string_1,chart_settings_first['x_start']+10,chart_settings_first['y_start']+20,"#FF0000",text_size);
                        text_basic_draw(canvas_chartText,string_2,chart_settings_first['x_start']+10,chart_settings_first['y_start']+30+text_position_y,"#94C300",text_size);
                        text_basic_draw(canvas_chartText,string_3,chart_settings_first['x_start']+10,chart_settings_first['y_start']+40+2*text_position_y,"#3159AD",text_size);
                        text_y_pos_inc = 50+3*text_position_y;
                        break;
				case "emas":
                        var string_1 = "ema:EMA_"+RANK_EMA[0];
                        var string_2 = "ema:EMA_"+RANK_EMA[1];
                        var string_3 = "ema:EMA_"+RANK_EMA[2];
                        text_basic_draw(canvas_chartText,string_1,chart_settings_first['x_start']+10,chart_settings_first['y_start']+20,"#FF0000",text_size);
                        text_basic_draw(canvas_chartText,string_2,chart_settings_first['x_start']+10,chart_settings_first['y_start']+30+text_position_y,"#94C300",text_size);
                        text_basic_draw(canvas_chartText,string_3,chart_settings_first['x_start']+10,chart_settings_first['y_start']+40+2*text_position_y,"#3159AD",text_size);
                        text_y_pos_inc = 50+3*text_position_y;
                        break;
				case "cloud": 
                        var tenkan_txt = 'cloud : tenkan';
                        var kijun_txt = 'cloud : kijun';
                        var span1_txt = 'cloud : span1';
                        var span2_txt = 'cloud : span2';
                        text_basic_draw(canvas_chartText,tenkan_txt,chart_settings_first['x_start']+10,chart_settings_first['y_start']+20,"#ffa500",text_size);
                        text_basic_draw(canvas_chartText,kijun_txt,chart_settings_first['x_start']+10,chart_settings_first['y_start']+30+text_position_y,"#006400",text_size);
                        text_basic_draw(canvas_chartText,span1_txt,chart_settings_first['x_start']+10,chart_settings_first['y_start']+40+2*text_position_y,"#0000CD",text_size);
                        text_basic_draw(canvas_chartText,span2_txt,chart_settings_first['x_start']+10,chart_settings_first['y_start']+50+3*text_position_y,"#FF00FF",text_size);
                        text_y_pos_inc = 60+4*text_position_y;
                        break;
				case "tech":
                        var string_1 = "tech:BOL±"+RANK_TECH[1];
                        var string_2 = "tech:BOL±"+RANK_TECH[2];
                        var string_3 = "tech:BOL±"+RANK_TECH[3];
                        var string_4 = "tech:MA";
                        text_basic_draw(canvas_chartText,string_1,chart_settings_first['x_start']+10,chart_settings_first['y_start']+20+text_position_y,"#FF0000",text_size);
                        text_basic_draw(canvas_chartText,string_2,chart_settings_first['x_start']+10,chart_settings_first['y_start']+30+2*text_position_y,"#94C300",text_size);
                        text_basic_draw(canvas_chartText,string_3,chart_settings_first['x_start']+10,chart_settings_first['y_start']+40+3*text_position_y,"#3159AD",text_size);
                        text_basic_draw(canvas_chartText,string_4,chart_settings_first['x_start']+10,chart_settings_first['y_start']+50+4*text_position_y,"#FFFF00",text_size);
                        text_y_pos_inc = 60+5*text_position_y;
                        break;
				default :break;
			}
		}
		if(this.type_settings.type3!=''){
			switch(this.type_settings.type3){
				case "macd": 
                        var string_2 = "macd:long";
                        var string_1 = "macd:short";
                        var string1 = "macd:macd";
                        var string2 = "macd:sig";
                        text_basic_draw(canvas_chartText,string_1,chart_settings_first['x_start']+10,chart_settings_first['y_start']+text_y_pos_inc,"#00FFFF",text_size);
                        text_basic_draw(canvas_chartText,string_2,chart_settings_first['x_start']+10,chart_settings_first['y_start']+text_y_pos_inc+10+text_position_y,"#FF00FF",text_size);
                        text_basic_draw(canvas_chartText,string1,chart_settings_second['x_start']+10,chart_settings_second['y_start']+20+text_position_y,"#FF8E00",text_size);
                        text_basic_draw(canvas_chartText,string2,chart_settings_second['x_start']+10,chart_settings_second['y_start']+30+2*text_position_y,"#00EF00",text_size);
                        break;
				case "sto": 
                        var string_1 = "sto:stoK";
                        var string_2 = "sto:stoD";
                        text_basic_draw(canvas_chartText,string_1,chart_settings_second['x_start']+10,chart_settings_second['y_start']+20,"#00FFFF",text_size);
                        text_basic_draw(canvas_chartText,string_2,chart_settings_second['x_start']+10,chart_settings_second['y_start']+30+text_position_y,"#00FF00",text_size);
                        break;
				case "rsi": 
                        var string_1 = "rsi:rsi_"+RANK_RSI['0'];
                        var string_2 = "rsi:rsi_"+RANK_RSI['1'];
                        text_basic_draw(canvas_chartText,string_1,chart_settings_second['x_start']+10,chart_settings_second['y_start']+20,"#00FFFF",text_size);
                        text_basic_draw(canvas_chartText,string_2,chart_settings_second['x_start']+10,chart_settings_second['y_start']+30+text_position_y,"#00FF00",text_size);
                        break;
				default :break;
			}
		}
    },
	update : function(JSONData){
		if(JSONData!=null){
			this.JSONData = JSONData;
			this.main_draw(this.type_settings,this.chart_settings,this.JSONData);
			show_bid_ask(this.JSONData);			
		}
	}
}