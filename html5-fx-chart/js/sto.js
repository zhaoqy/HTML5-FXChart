var sto = sto || {};
sto = {
    STOK : [],
    STOD : [],
    new_STOK : [],
	max_min_array : [],
	high_array : [],
    low_array : [],
	draw_sto : function(array,start,end,CHART,STO_RANK,flag){
		var count_start = start ;
		if(flag == "cloud"){
			var show = cal.cloud_show(start,end);
			count_start = show[0];
		}
		var median = Number(array['pairz']['num']);
		var high = '';
		var low = '';
		var num = end-count_start;
		for(var i=count_start;i<end+STO_RANK[0];i++){
			for(var j=0;j<STO_RANK[1];j++){
				this.high_array[j] = array[i+j]['bhigh'];
				this.low_array[j]  = array[i+j]['blow'];
			}
			high = Array.max(this.high_array);
			low  = Array.min(this.low_array);
			this.STOK[i]	= (array[i]['bclose']-low)/(high-low)*100;
		}
		for(var i=count_start;i<end;i++){
			var sum = 0;
			for(var j=0;j<STO_RANK[0];j++){
				sum += this.STOK[i+j];
			}
			this.STOD[i] = sum/STO_RANK[0];
		}
		for(var i=count_start;i<end;i++){
			this.new_STOK[i] = this.STOK[i];
		}
		this.max_min_array =[100,0];
		context_background.clearRect(0,CHART['y_start'],CHART['canvas_w'],CHART['canvas_h']); 
		draw_bg(100,0,median,num,CHART);
		context_chart.clearRect(0,CHART['y_start'],CHART['canvas_w'],CHART['canvas_h']);
		macd.draw_two_chart_line(this.STOD,100,0,start,end,CHART,"#00FF00",array,flag);
		mas.draw_move_line(this.new_STOK,100,0,start,end,CHART,"#00FFFF",flag);
	},
};