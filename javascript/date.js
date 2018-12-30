$vm.date_to_string_dmy=function(d){
      return $vm.pad(d.getDate(),2)+"/"+$vm.pad(d.getMonth()+1,2)+"/"+d.getFullYear();
}
$vm.pad=function(num, size) {
      var s = "000000000" + num;
      return s.substr(s.length-size);
}
$vm.date_parse=function(a) {
    try{
        var b=a.split('/');
        return new Date(b[2],b[1]-1,b[0]);
    }
    catch(e){
        return new Date(1800,0,1);
    }
}
$vm.date_weekfirst=function(d0){
      var d=new Date(d0);
      var day = d.getDay(), diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
      return new Date(d.setDate(diff));
}
$vm.date_day_diff=function(a,b){
    var ms=(b.getTimezoneOffset()-a.getTimezoneOffset())*60*1000;
	return Math.floor( (b.getTime()-a.getTime()-ms)/1000/3600/24 );
}
$vm.first_day_of_current_month=function(){
	var date = new Date(), y = date.getFullYear(), m = date.getMonth();
	var firstDay = new Date(y, m, 1,0,0,0,0);
	return firstDay;
}
$vm.first_day_of_current_year=function(){
	var date = new Date(), y = date.getFullYear();
	var firstDay = new Date(y, 0, 1);
	return $vm.date_to_string_dmy(firstDay);
}
$vm.time12=function(time){
	//----------------------
	var timeB=time;
	var ts=time.split(':');
	var new_h=parseInt(ts[0])-12;
	if(new_h>=0){
		if(new_h==0) new_h=12;
		timeB=$vm.pad(new_h,2)+':'+ts[1]+'pm';
	}
	else{
		new_h=new_h+12;
		if(new_h==0) new_h=12;
		timeB=$vm.pad(new_h,2)+':'+ts[1]+'am';
	}
	//----------------------
    return timeB;
}
//----------------------------------------------------------------------------
$vm.date_today=function(){
  var d=new Date();
  return new Date(d.getFullYear(),d.getMonth(),d.getDate(),0,0,0,0);
}
//----------------------------------------------------------------------------
$vm.date_yyyymmdd_parse=function(a) {
    try{
        var b=a.split('-');
        return new Date(b[0],b[1]-1,b[2]);
    }
    catch(e){
        return new Date(1800,0,1);
    }
}
//----------------------------------------------------------------------------
$vm.au_date_to_string_yyyymmdd=function(d){
    if(d==undefined) return "";
    var items=d.split('/');
    if(items.length==3 && items[2].length==4){
      var nd=new Date(items[2],items[1]-1,items[0]);
      return nd.getFullYear()+"-"+$vm.pad(nd.getMonth()+1,2)+"-"+$vm.pad(nd.getDate(),2);
    }
    else return d;
}
//----------------------------------------------------------------------------
$vm.date_to_string_yyyymmdd=function(nd){
    return nd.getFullYear()+"-"+$vm.pad(nd.getMonth()+1,2)+"-"+$vm.pad(nd.getDate(),2);
}
//----------------------------------------------------------------------------
//do not use this
$vm.date_to_ddmmyyyy=function(d){
	if(d==undefined || d==null || d=="" )  return '';
	var ds=d.toString().split('-');
	var year = ds[0];
	var month =ds[1];
	var day = ds[2];
	return day+'/'+month+'/'+year;
}
//----------------------------------------------
//----------------------------------------------
$vm.ddmmyyyy_to_yyyymmdd=function(d){
	if(d==undefined || d==null || d=="" )  return '';
    var ds=d.toString().split('-');
    if(ds.length!=3) ds=d.toString().split('/');
	var year = ds[0];
	var month =ds[1];
	var day = ds[2];
	return day+'/'+month+'/'+year;
}
//----------------------------------------------
$vm.date_add_days=function(d,n){
    var ms0 = d.getTime() + (86400000 * n);
    var ms1 = d.getTime() + (86400000 * n+3600000);

    var d0= new Date(ms0);
    var d1= new Date(ms1);

    var dms=(d1.getTimezoneOffset()-d.getTimezoneOffset())*60*1000;

    var added = new Date(ms0+dms);
    return added;
}
//----------------------------------------------
$vm.date_to_yyyymmdd=function(nd){
    return nd.getFullYear()+"-"+$vm.pad(nd.getMonth()+1,2)+"-"+$vm.pad(nd.getDate(),2);
}
//----------------------------------------------------------------------------
