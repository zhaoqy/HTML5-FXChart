var tech = tech || {};
tech = {
	MA : [],
	MD : [],
	MB :[],
	BOL1_UP :[],
	BOL1_DOWN :[],
	BOL2_UP :[],
	BOL2_DOWN :[],
	BOL3_UP :[],
	BOL3_DOWN :[],
	tech_max_min : function(start,end,array){
		var count_num = end-start;
		this.MA = mas.ma_count(array,start,end,RANK_TECH[0]);
		this.MD = this.md_count(array,start,end,this.MA,RANK_TECH[0]);
		this.MB = mas.ma_count(array,start,end,RANK_TECH[0]-1);
		this.BOL1_UP = this.up_count(start,end,this.MB,this.MD,RANK_TECH[1]);
		this.BOL1_DOWN = this.down_count(start,end,this.MB,this.MD,RANK_TECH[1]);
		this.BOL2_UP = this.up_count(start,end,this.MB,this.MD,RANK_TECH[2]);
		this.BOL2_DOWN = this.down_count(start,end,this.MB,this.MD,RANK_TECH[2]);
		this.BOL3_UP = this.up_count(start,end,this.MB,this.MD,RANK_TECH[3]);
		this.BOL3_DOWN = this.down_count(start,end,this.MB,this.MD,RANK_TECH[3]);
		
		var temp_up = [];
		var temp_down =[];
		var temp_max =0;
		if(RANK_TECH[1]>=RANK_MA[2]){
			if(RANK_TECH[1]>=RANK_TECH[3]){
				temp_max = 1
			}else{
				temp_max = 3
			}
		}else{
			if(RANK_TECH[2]>=RANK_TECH[3]){
				temp_max= 2;
			}else{
				temp_max= 3;
			}
		}
		switch(temp_max){
			case 1 : temp_up = this.BOL1_UP;temp_down = this.BOL1_DOWN; break;
			case 2 : temp_up = this.BOL2_UP;temp_down = this.BOL2_DOWN; break;
			case 3 : temp_up = this.BOL3_UP;temp_down = this.BOL3_DOWN; break;
			default  : break;
		}
		var max_min_array = macd.array_compare(start,end,this.MA,temp_up,temp_down);
		return max_min_array;
	},
	draw_tech : function(array,start,end,max_min,chart_settings){
		mas.draw_move_line(this.MA,max_min[0],max_min[1],start,end,chart_settings,"#FFFF00");
		mas.draw_move_line(this.BOL1_UP,max_min[0],max_min[1],start,end,chart_settings,"#FF0000");
		mas.draw_move_line(this.BOL1_DOWN,max_min[0],max_min[1],start,end,chart_settings,"#FF0000");
		mas.draw_move_line(this.BOL2_UP,max_min[0],max_min[1],start,end,chart_settings,"#94C300");
		mas.draw_move_line(this.BOL2_DOWN,max_min[0],max_min[1],start,end,chart_settings,"#94C300");
		mas.draw_move_line(this.BOL3_UP,max_min[0],max_min[1],start,end,chart_settings,"#3159AD");
		mas.draw_move_line(this.BOL3_DOWN,max_min[0],max_min[1],start,end,chart_settings,"#3159AD");
	},
	md_count : function(array,start,end,ma_array,ma_num){
		var md_array = [];
		for(var i=start;i<end;i++){
			var sum = 0;
			for(var j=0;j<ma_num;j++){
				sum += Math.pow((array[i+j]['bclose']-ma_array[i]),2);
			}
			md_array[i] = Math.sqrt(sum/ma_num);
		}
		return md_array;
	},
	up_count : function(start,end,mb_array,md_array,k){
		var up_array = [];
		for(var i =start;i<end;i++){
			up_array[i] = mb_array[i] + k*md_array[i];
		}
		return up_array;
	},
	down_count : function(start,end,mb_array,md_array,k){
		var down_array = [];
		for(var i =start;i<end;i++){
			down_array[i] = mb_array[i] - k*md_array[i];
		}
		return down_array;
	},
};