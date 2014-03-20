/*****************************************************************************/
// Copyright (c) EMAT Information Technology (WUXI) Co.,LTD. 
// Author : mtools 
// html page setting
// Date:2012-02-18
/*******************************************************************************/
function checkSelect(o){
    var se = o || $("se_unit");
    var val=se.options[se.selectedIndex].value;
    if(val=="bid" || val=="ask"){
        $("se_type").disabled=true;
        $("se_type2").disabled=true;
        $("se_type3").disabled=true;
        $("set1").disabled=true;
        $("set2").disabled=true;
    }else{
        $("se_type").disabled=false;
        //check type2
        var type2 = $("se_type2");
        typeSelect(type2,"type2");
        type2.disabled=false;
        //check type3
        var type3 = $("se_type3");
        typeSelect(type3,"type3");
        type3.disabled=false;
    }
}
function typeSelect(o,type){
    var type2=$("se_type2").options[$("se_type2").selectedIndex].value;
    var type3=$("se_type3").options[$("se_type3").selectedIndex].value;
    set_inc_max(type2,type3);
    var val=o.options[o.selectedIndex].value;
    if(type=='type2'){
        if(val =='' || val =="cloud"){$("set1").disabled=true;}
        else{$("set1").disabled=false;}
    }else if(type=='type3'){
        if(val == ''){$("set2").disabled=true;}
        else{$("set2").disabled=false;}
    }
}
function firstSet(type){
    $("mainSetings").style.visibility="hidden";
    if(type==1){
        //set1
        switch($("se_type2").value){
            case "mas" 	 :  $("mas_set").style.visibility="visible";  break;
            case "emas"  :  $("emas_set").style.visibility="visible"; break;
            case "tech"    :  $("tech_set").style.visibility="visible"; break;
            case "cloud"  :  $("set1").disabled=true; break;
            default : break;
        }
    }else{
        //set2
        switch($("se_type3").value){
            case "macd" :	$("macd_set").style.visibility="visible";   break;
            case "sto"	:	$("sto_set").style.visibility="visible";    break;
            case "rsi"	:	$("rsi_set").style.visibility="visible";    break;
            default : break;
        } 
    }
    }
function secondConfirm(type){
    $("mainSetings").style.visibility="visible";
    switch(type){
        /* type2 */
        case "mas":
            RANK_MA[0]=Number($('ma1').value);
            RANK_MA[1]=Number($('ma2').value);
            RANK_MA[2]=Number($('ma3').value);
            comon.save_setting(RANK_MA,"mas");
            inc_1 = Array.max(RANK_MA);
            break;
        case "emas":
            RANK_EMA[0]=Number($('ema1').value);
            RANK_EMA[1]=Number($('ema2').value);
            RANK_EMA[2]=Number($('ema3').value);
            comon.save_setting(RANK_EMA,"emas");			
            inc_1 = Array.max(RANK_EMA);
            break;
        case "tech":
            RANK_TECH[0]=Number($('tma').value);
            RANK_TECH[1]=Number($('bol1').value);
            RANK_TECH[2]=Number($('bol2').value);
            RANK_TECH[3]=Number($('bol3').value);
            comon.save_setting(RANK_TECH,"tech");	
            inc_1 = Array.max(RANK_TECH);
            break;
         /* type3 */
        case "macd":
            RANK_MACD[0]=Number($('short').value);
            RANK_MACD[1]=Number($('long').value);
            RANK_MACD[2]=Number($('mid').value);
            comon.save_setting(RANK_MACD,"macd");			
            if(RANK_MACD[0]>RANK_MACD[1]){
                inc_2 = RANK_MACD[0]+RANK_MACD[2];
            }else{
                inc_2 = RANK_MACD[1]+RANK_MACD[2];
            }
            break;
        case "sto":
            RANK_STO[0]=Number($('sto_d').value);
            RANK_STO[1]=Number($('sto_k').value);
            comon.save_setting(RANK_STO,"sto");			
            inc_2=RANK_STO[0]+RANK_STO[1];
            break;
        case "rsi":
            RANK_RSI[0]=Number($('rsi1').value);
            RANK_RSI[1]=Number($('rsi2').value);
            comon.save_setting(RANK_RSI,"rsi");			
            inc_2=Array.max(RANK_RSI);
            break;
        default : break;
    }
    if(inc_1-inc_2>0){inc_max = inc_1;}
    else{inc_max = inc_2;}
}
function upConfirm(){
    $('chartShelter').style.display='none';
    $('chartSubMenu').style.display='none';
    var unit = $("se_unit");
    $("chartUnit").innerHTML=unit.options[unit.selectedIndex].text;
    var pair=$("se_pair");
    var val=pair.options[pair.selectedIndex].value;
    $("chartFlag").alt = val.substr(0,3)+"/"+val.substr(3,3);
    $("chartFlag").src ="img/flag/"+val.toLowerCase()+".png";
        
    sub_chart();//init.js
    menu_setttings_save();
}
function backupSetting(){
    RE_RANK_MA = RANK_MA.slice(0);
    RE_RANK_EMA=RANK_EMA.slice(0);
    RE_RANK_TECH=RANK_TECH.slice(0);
    RE_RANK_STO = RANK_STO.slice(0);
    RE_RANK_RSI = RANK_RSI.slice(0);
    RE_RANK_MACD = RANK_MACD.slice(0);
    RE_RANK_CLOUD = RANK_CLOUD.slice(0);
    RE_CHART_SETTING = CHART_SETTING.slice(0);
}
function showSettingMenu(){
	
    $('chartSubMenu').style.display='block';
    $('chartShelter').style.display='block';		
	
    backupSetting();
}
function recoverSetting(){
    RANK_MA = RE_RANK_MA.slice(0);
    RANK_EMA=RE_RANK_EMA.slice(0);
    RANK_TECH=RE_RANK_TECH.slice(0);
    RANK_STO = RE_RANK_STO.slice(0);
    RANK_RSI = RE_RANK_RSI.slice(0);
    RANK_MACD = RE_RANK_MACD.slice(0);
    RANK_CLOUD = RE_RANK_CLOUD.slice(0);
    CHART_SETTING = RE_CHART_SETTING.slice(0);
}
function resetAllSetting(){
    recoverSetting();
    comon.save_setting(RANK_MA,"mas");
    $("ma1").value=RANK_MA[0];$("ma2").value=RANK_MA[1];$("ma3").value=RANK_MA[2];
    $('show_ma1').innerHTML = RANK_MA[0];
    $('show_ma2').innerHTML = RANK_MA[1];
    $('show_ma3').innerHTML = RANK_MA[2];
    comon.save_setting(RANK_EMA,"emas");			
    $("ema1").value=RANK_EMA[0];$("ema2").value=RANK_EMA[1];$("ema3").value=RANK_EMA[2];
    $('show_ema1').innerHTML = RANK_EMA[0];
    $('show_ema2').innerHTML = RANK_EMA[1];
    $('show_ema3').innerHTML = RANK_EMA[2];
    comon.save_setting(RANK_TECH,"tech");			
    $("tma").value=RANK_TECH[0];$("bol1").value=RANK_TECH[1];$("bol2").value=RANK_TECH[2];$("bol3").value=RANK_TECH[3];
    $('show_tma').innerHTML = RANK_TECH[0];
    $('show_bol1').innerHTML = RANK_TECH[1];
    $('show_bol2').innerHTML = RANK_TECH[2];
    $('show_bol3').innerHTML = RANK_TECH[3];
    comon.save_setting(RANK_MACD,"macd");			
    $("short").value=RANK_MACD[0];$("long").value=RANK_MACD[1];$("mid").value=RANK_MACD[2];
    $('show_short').innerHTML = RANK_MACD[0];
    $('show_long').innerHTML = RANK_MACD[1];
    $('show_mid').innerHTML = RANK_MACD[2];
    comon.save_setting(RANK_RSI,"rsi");			
    $("rsi1").value=RANK_RSI[0];$("rsi2").value=RANK_RSI[1];
    $('show_rsi1').innerHTML = RANK_RSI[0];
    $('show_rsi2').innerHTML = RANK_RSI[1];
    comon.save_setting(RANK_STO,"sto");			
    $("sto_d").value=RANK_STO[0];$("sto_k").value=RANK_STO[1];
    $('show_stod').innerHTML = RANK_STO[0];
    $('show_stok').innerHTML = RANK_STO[1];

    $("se_pair").selectedIndex=CHART_SETTING[0];
    $("se_unit").selectedIndex=CHART_SETTING[1];

    var type1= $("se_type")
    type1.selectedIndex=CHART_SETTING[2];

    var type2 = $("se_type2");
    type2.selectedIndex=CHART_SETTING[3];
    typeSelect(type2,"type2");

    var type3 = $("se_type3");
    type3.selectedIndex=CHART_SETTING[4];
    typeSelect(type3,"type3");
    checkSelect();//Must be placed at the end
}
function resetSetting(type){
    switch(type){
        case "mas" : 
            $("ma1").value=RANK_MA[0];$("ma2").value=RANK_MA[1];$("ma3").value=RANK_MA[2];
            $('show_ma1').innerHTML = RANK_MA[0];
            $('show_ma2').innerHTML = RANK_MA[1];
            $('show_ma3').innerHTML = RANK_MA[2];
            break;
        case "emas" : 
            $("ema1").value=RANK_EMA[0];$("ema2").value=RANK_EMA[1];$("ema3").value=RANK_EMA[2];
            $('show_ema1').innerHTML = RANK_EMA[0];
            $('show_ema2').innerHTML = RANK_EMA[1];
            $('show_ema3').innerHTML = RANK_EMA[2];
            break;
        case "tech" : 
            $("tma").value=RANK_TECH[0];$("bol1").value=RANK_TECH[1];$("bol2").value=RANK_TECH[2];$("bol3").value=RANK_TECH[3];
            $('show_tma').innerHTML = RANK_TECH[0];
            $('show_bol1').innerHTML = RANK_TECH[1];
            $('show_bol2').innerHTML = RANK_TECH[2];
            $('show_bol3').innerHTML = RANK_TECH[3];
            break;
        case "macd" : 
            $("short").value=RANK_MACD[0];$("long").value=RANK_MACD[1];$("mid").value=RANK_MACD[2];
            $('show_short').innerHTML = RANK_MACD[0];
            $('show_long').innerHTML = RANK_MACD[1];
            $('show_mid').innerHTML = RANK_MACD[2];
            break;
        case "rsi" : 
            $("rsi1").value=RANK_RSI[0];$("rsi2").value=RANK_RSI[1];
            $('show_rsi1').innerHTML = RANK_RSI[0];
            $('show_rsi2').innerHTML = RANK_RSI[1];
            break;
        case "sto" : 
            $("sto_d").value=RANK_STO[0];$("sto_k").value=RANK_STO[1];
            $('show_stod').innerHTML = RANK_STO[0];
            $('show_stok').innerHTML = RANK_STO[1];
        default : break;
    }
}
function menu_setttings_save(){
    CHART_SETTING[0] = $('se_pair').selectedIndex;
    CHART_SETTING[1] = $('se_unit').selectedIndex;
    CHART_SETTING[2] = $('se_type').selectedIndex;
    CHART_SETTING[3] = $('se_type2').selectedIndex;
    CHART_SETTING[4] = $('se_type3').selectedIndex;
    comon.save_setting(CHART_SETTING,"type");
}