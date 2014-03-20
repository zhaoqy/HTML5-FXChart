var cal = {
	//Get the max and the min from the array
	get_max_min : function(start,end,array,type){
		var arr = [];
		for(var i=start;i<end;i++){
			arr[i-start]=array[i][type];
		}
		var max = Array.max(arr);
		var min = Array.min(arr);
		return [max,min];
	},
	get_max : function(start,end,array,type){
		var arr = [];
		for(var i=start;i<end;i++){
			arr[i-start]=array[i][type];
		}
		var max = Array.max(arr);
		return max;
	},
	get_min : function(start,end,array,type){
		var arr = [];
		for(var i=start;i<end;i++){
			arr[i-start]=array[i][type];
		}
		var min = Array.min(arr);
		return min;
	},
	//If type3 is cloud,the number of type1 and type2 will move RANK_CLOUD[1]
	cloud_show : function(start,end){
		end -=RANK_CLOUD[1];
		if(start<=RANK_CLOUD[1]){
			start=0;
		}else{
			start-=RANK_CLOUD[1];
		} 
		return [start,end];
	},
	//Complement the right vertical lines
	v_fill : function(CHART,x_pos,x_blank){
		var i=0;
		while(i>-RANK_CLOUD[1]){
			if(!((i+1+RANK_CLOUD[1])%10)){
				v_CHART(x_pos,'',CHART);
			}
			x_pos+=x_blank;
			i--;
		}
	}
}