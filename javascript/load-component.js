//------------------------------------------------
$vm.create_component_and_run=function(txt,url,div,m_name,callback){
	var last_part=url.split('/').pop();
	var c_path=url.replace(last_part,'');
	txt=txt.replace(/__CURRENT_PATH__/g,c_path);
	var id=$vm.id();
	txt=txt.replace(/__ID/g, id);
	txt=txt.replace(/__MODULE__/g, m_name);	
	txt=$vm.url(txt);
	$('#'+div).append(txt);
	if (typeof window['F'+id] == 'function') {
		try{
			eval('F'+id+"()");
		}
		catch(err){
			alert(err+"\r\nThis error happend in the module\r\n"+url);
		}
	}
	$('#D'+id).attr('module',m_name);
	$('#D'+id).triggerHandler('load');
    if(callback!=undefined) callback(m_name);
}
//------------------------------------------------
$vm.load_component_include_and_run=function(lines,i,url,div,m_name,callback){ //Step B-2
	var last_part=url.split('/').pop();
	var c_path=url.replace(last_part,'');
	
	//var name=lines[i].replace('//VmInclude:','').replace('VmInclude:','').trim();
	var name=lines[i].replace('<!--VmInclude:','').replace('/*VmInclude:','').replace('//VmInclude:','').replace('VmInclude:','').trim();
	name=name.replace('-->','').replace('*/','').trim();
	name=name.replace(/\'/g,'').replace(/\"/g,'');
	var com_url=$vm.url(name);
	if(com_url[0]=='/') com_url=$vm.hosting_path+com_url;
	com_url=com_url.replace('__CURRENT_PATH__',c_path);
	//------------------------------
	var create_and_run=function(all_txt,div,callback){
		if(all_txt.indexOf('VmInclude:')==-1) $vm.create_component_and_run(all_txt,url,div,m_name,callback);
		else $vm.process_component_include_and_run(all_txt,url,div,m_name,callback); //Step C
	}
	//------------------------------
	var apppath=window.location.href.substring(0, window.location.href.lastIndexOf('/')).split('\/?')[0];
	//var ver=localStorage.getItem(apppath+url+"ver"); //wrong!!!
	//var txt=localStorage.getItem(apppath+url+"txt");
	var ver=localStorage.getItem(apppath+com_url+"ver");
	var txt=localStorage.getItem(apppath+com_url+"txt");
	var http127=0;
	if(url.indexOf('http://127.0.0.1')!=-1 || url.indexOf('http://localhost')!=-1 || url.indexOf('http://vmiis-local.com')!=-1) http127=1;
	//------------------------------
	if(ver!=$vm.ver[0] || http127==1 || txt==null || $vm.reload!=''){
		var new_url=com_url+'?_v='+new Date().getTime();
		//if(url.indexOf('?')!==-1) new_url=url+'&_v='+($vm.ver[0]+$vm.reload).replace(/\./,'')+"&g="+_g_vm_chrom_loop++; //wrong
		if(url.indexOf('?')!==-1) new_url=com_url+'&_v='+($vm.ver[0]+$vm.reload).replace(/\./,'')+"&g="+_g_vm_chrom_loop++;
		if($vm.loading_url_info==1) console.log('%cloading from url. '+new_url+" "+ver+"/"+$vm.ver[0]+" 127:"+http127+" re:"+$vm.reload,"color:#b55")
		$.get(new_url, function(data){
			var c_m=$("<p>"+data+"</p>").filter('#D__ID').html();
			if(c_m!=undefined && c_m!='' && c_m!=null){ data=c_m;}
			localStorage.setItem(apppath+url+"_txt",data);
			localStorage.setItem(apppath+url+"_ver",$vm.ver[0]);
			var current_all=$vm.replace_and_recreate_content(lines,i,data);
			create_and_run(current_all,div,callback);
		},'text');
	}
	else{
		//console.log('loading from stotage. '+url+" "+ver+"/"+$vm.ver[0]+" 127:"+http127+" re:"+$vm.reload) //wrong!!!
		console.log('%cloading from stotage. '+com_url+" "+ver+"/"+$vm.ver[0]+" 127:"+http127+" re:"+$vm.reload,"color:#055")
		var current_all=$vm.replace_and_recreate_content(lines,i,txt)
		create_and_run(current_all,div,callback);
	}
}
//------------------------------------------------
$vm.process_component_include_and_run=function(txt,url,div,m_name,callback){ //Step A-2
	var lines=txt.split('\n');
	for(var i=0;i<lines.length;i++){
		if(lines[i].length>10){
			if(lines[i].indexOf('VmInclude:')!==-1){
				$vm.load_component_include_and_run(lines,i,url,div,m_name,callback); //Step B-1 //only process the first include
				return;
			}
		}
	}
}
//------------------------------------------------
/*
$vm.load_component=function(name,div,input,dialog){
	if($vm.module_list[name]==undefined && dialog==undefined){
		alert("The module '"+name+"' is not in the module list.");
		return;
	}
	var url=$vm.module_list[name].url;
	if(url==undefined && dialog==undefined){
		alert("The module '"+name+"' does not have url.");
		return;
	}
*/
$vm.load_component=function(name,div,input,callback){
	if($vm.module_list[name]==undefined){
		alert("The module '"+name+"' is not in the module list.");
		return;
	}
	var url=$vm.module_list[name].url;
	if(url==undefined){
		alert("The module '"+name+"' does not have url.");
		return;
	}
	if($vm.module_list[name]==undefined){
		return;
	}
	var url=$vm.module_list[name].url;
	if(url==undefined){
		return;
	}
	var m=$vm.module_list[name];
	m.input=input;
	var apppath=window.location.href.substring(0, window.location.href.lastIndexOf('/')).split('\/?')[0];
	var ver=localStorage.getItem(apppath+url+"ver");
	var txt=localStorage.getItem(apppath+url+"txt");
	var http127=0;
	if(url.indexOf('http://127.0.0.1')!=-1 || url.indexOf('http://localhost')!=-1 || url.indexOf('http://vmiis-local.com')!=-1) http127=1;
	//-----------------------------------
	var create_and_run=function(txt,div,callback){
		if(txt.indexOf('VmInclude:')==-1) $vm.create_component_and_run(txt,url,div,name,callback);
		else $vm.process_component_include_and_run(txt,url,div,name,callback); //Step A-1
	}
	//-----------------------------------
	var reload=0;
	if(window.location.toString().indexOf('reload='+name)!=-1){
		reload=1;
	}
	if(ver!=$vm.ver[0] || http127==1 || txt==null || $vm.reload!='' || reload==1){
		$.get(url+'?_='+new Date().getTime(),function(new_txt){
			localStorage.setItem(apppath+url+"txt",new_txt);
			localStorage.setItem(apppath+url+"ver",$vm.ver[0]);
			if($vm.loading_url_info==1) console.log('%cloading from url. '+url+' '+ver+'/'+$vm.ver[0]+" 127:"+http127,"color:#b55");
			create_and_run(new_txt,div,callback);
		},'text');
	}
	else{
		console.log('%cloading from storage. '+url+' '+ver+'/'+$vm.ver[0]+" 127:"+http127,"color:#055");
		create_and_run(txt,div,callback);
	}
};
//------------------------------------------------
$vm.install_component=function(name,div,input,callback){
    $vm.load_component(name,div,input,callback);
}
//------------------------------------------------
