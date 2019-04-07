$vm.load_component=function(name,div){
	if($vm.module_list[name]===undefined){
		alert("The module '"+name+"' is not in the module list.");
		return;
	}
	var url=$vm.module_list[name].url;
	if(url==undefined){
		alert("The module '"+name+"' does not have url.");
		return;
	}

	var apppath=window.location.href.substring(0, window.location.href.lastIndexOf('/')).split('\/?')[0];
	var ver=localStorage.getItem(apppath+url+"ver");
	var txt=localStorage.getItem(apppath+url+"txt");
	var http127=0;
	if(url.indexOf('http://127.0.0.1')!=-1 || url.indexOf('http://localhost')!=-1) http127=1;
	var create_and_run=function(txt,div){
		var last_part=url.split('/').pop();
		var c_path=url.replace(last_part,'');
		txt=txt.replace(/__CURRENT_PATH__/g,c_path);
		var id=$vm.id();
		txt=txt.replace(/__ID/g, id);
		$('#'+div).html(txt);
		if (typeof window['F'+id] == 'function') {
			try{
				eval('F'+id+"()");
			}
			catch(err){
				alert(err+"\r\nThis error happend in the module\r\n"+url);
			}
		}
		$('#D'+id).triggerHandler('load');
	}
	if(ver!=$vm.ver[0] || http127==1 || txt==null || $vm.reload!='' || reload==1){
		$.get(url+'?_='+new Date().getTime(),function(new_txt){
			localStorage.setItem(apppath+url+"txt",new_txt);
			localStorage.setItem(apppath+url+"ver",$vm.ver[1]);
			console.log('loading from url. '+url+' '+ver+'/'+$vm.ver[1]+" 127:"+http127);
			create_and_run(new_txt,div);
		},'text');
	}
	else{
		console.log('loading from storage. '+url+' '+ver+'/'+$vm.ver[1]+" 127:"+http127);
		create_and_run(txt,div);
	}
};
