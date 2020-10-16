$vm.install_module=function(name,slot,input,callback){
    if(name==undefined) return;
	if($vm.vm==undefined) $vm.vm={}
	var slot_1=$vm.root_layout_content_slot;
	if(slot!=undefined && slot!="") slot_1=slot;
    slot=slot_1
    $vm.module_list[name].slot=slot;
	if($vm.module_list[name]===undefined){
		console.log("%cThe module '"+name+"' is not in the module list.","color:red");
		return;
	}
    var url=$vm.module_list[name]['url'];
    if(url===undefined) return;
    url=$vm.url(url);
	var id=$vm.id();
	$vm.module_list[name].id=id;
	var m=$vm.module_list[name];
	var m_name=name;
	var module_id	=id;
	if(url[0]=='/') url=$vm.hosting_path+url;
	var last_part=url.split('/').pop();
    var current_path=url.replace(last_part,'');
	if($('#D'+module_id).length===0){
		$vm.vm[module_id]={};
	}
	if($vm.vm[module_id]==undefined) $vm.vm[module_id]={};
	$vm.vm[module_id].current_path=current_path;
    $vm.vm[module_id].input=input;
    $vm.vm[module_id].name=name;
    $vm.vm[module_id].url=url;
	//------------------------------
	if($('#D'+module_id).length==0){
		var apppath=window.location.href.substring(0, window.location.href.lastIndexOf('/')).split('\/?')[0];
        var storage_url=url;
		var ver=localStorage.getItem(storage_url+"_ver");
		var txt=localStorage.getItem(storage_url+"_txt");
		var http127_i=0;
		if(url.indexOf('http://127.0.0.1')!=-1 || url.indexOf('http://localhost')!=-1 || url.indexOf('http://vmiis-local.com')!=-1) http127_i=1;
		if(ver!=$vm.ver[0] || http127_i==1 || txt==null){
			var new_url=url+'?_v='+new Date().getTime();
			if(url.indexOf('?')!==-1) new_url=url+'&_v='+($vm.ver[0]+$vm.reload).replace(/\./,'');
			console.log('%cloading from url. '+new_url+" "+ver+"/"+$vm.ver[0]+" for "+m_name,"color:#b55")
            if(window.location.hostname!='127.0.0.1' && window.location.hostname!='localhost')	$('#vm_loader').show();
			$.get(new_url, function(data){
				//-----------------------------------
				//for images belong to this module
				if(data.indexOf('__CURRENT_NAME__')!=-1){
					var nm=new_url.split('/').pop().split('?')[0];
					data=data.replace(/__CURRENT_NAME__/g,nm);
				}
				//-----------------------------------
				localStorage.setItem(storage_url+"_txt",data);
				localStorage.setItem(storage_url+"_ver",$vm.ver[0]);
				var current_all=data;
				if(current_all.indexOf('VmInclude:')==-1){
					$vm.install_create_module_and_run_code(current_all,module_id,url,slot,m_name,callback);
				}
				else{
					$vm.install_process_first_include(current_all,module_id,slot,url,m_name,callback);
				}
			}).fail(function() {
				console.log("%cThe module '"+url+"' doesn't exist or you have AdBlock that blocks this remote module to be loaded.","color:red");
			});
		}
		else{
			console.log('%cloading from stotage. '+url+" "+ver+"/"+$vm.ver[0]+" for "+m_name,"color:#055")
			var current_all=txt;
			if(current_all.indexOf('VmInclude:')==-1){
				$vm.install_create_module_and_run_code(current_all,module_id,url,slot,m_name,callback);
			}
			else{
				$vm.install_process_first_include(current_all,module_id,slot,url,m_name,callback);
			}
		}
	}
}
//-----------------------------------
$vm.install_create_module_and_run_code=function(txt,module_id,url,slot,m_name,callback){
	txt=txt.replace(/__CURRENT_PATH__/g,$vm.vm[module_id].current_path);
	var content=txt;
	if(m_name!=undefined && $vm.module_list[m_name]!=undefined){
		if($vm.module_list[m_name].full_content!=='1'){
			var c_m=$(content).filter('#D__ID').html();
			if(c_m!=undefined && c_m!='') content=c_m;
		}
	}
	content=$vm.url(content);
    if(m_name!=undefined && $vm.module_list[m_name]!=undefined){
		if($vm.module_list[m_name].html_filter!=undefined){
        	content=$vm.module_list[m_name].html_filter(content);
		}
    }
	content=content.replace(/__ID/g, module_id);
	content=content.replace(/__MODULE__/g, m_name);
	content=content.replace(/<!--([\s\S]*?)-->/mig, '');
	
	if(slot!='body'){
		content="<div id=D"+module_id+" module='"+m_name+"' style='display:none'><!--"+url+"-->"+content+"</div>"
		$("#D"+module_id).remove();
		if(slot=='' || slot==undefined) slot=$vm.root_layout_content_slot;
		$("#"+slot).append($(content));
	}
	else{
		$("body").append($(content));
	}
	//-----------------
	if (typeof window['F'+module_id] == 'function') {
		try{
			eval('F'+module_id+"()");
		}
		catch(err){
			var module=url;
			if(module===undefined) module=module_id;
			//alert(err+"\r\nThis error happend in the module\r\n"+module);
			console.log("%c"+err+" --- This error happend in the module "+module,"color:red");
		}
	}
	//-----------------------------------------
	$('#D'+module_id).on('dblclick',function(event){
		event.stopPropagation();
		$vm.source(''+module_id,event);
	});
    //-------------------------------------
    if(callback!=undefined) callback(m_name,module_id);
}
//-----------------------------------
$vm.install_process_first_include=function(txt,module_id,slot,url_0,m_name,callback){
	var lines=txt.split('\n');
	for(var i=0;i<lines.length;i++){
		if(lines[i].length>10){
			if(lines[i].indexOf('VmInclude:')!==-1){
				$vm.install_load_include(lines,i,module_id,slot,url_0,m_name,callback); //find the first include and process
				return;
			}
		}
	}
}
//-----------------------------------
$vm.install_load_include=function(lines,i,module_id,slot,url_0,m_name,callback){
	var name=lines[i].replace('//VmInclude:','').replace('VmInclude:','').trim();
	name=name.replace(/\'/g,'');
	name=name.replace(/\"/g,'');
	var items=name.split('|');
	var url=$vm.url(items[0]);
	if(url[0]=='/') url=$vm.hosting_path+url;
	url=url.replace('__CURRENT_PATH__',$vm.vm[module_id].current_path);
	//------------------------------
	var apppath=window.location.href.substring(0, window.location.href.lastIndexOf('/')).split('\/?')[0];
	var ver=localStorage.getItem(apppath+url+"_ver");
	var txt=localStorage.getItem(apppath+url+"_txt");
	var http127_i=0;
	if(url.indexOf('http://127.0.0.1')!=-1 || url.indexOf('http://localhost')!=-1 || url.indexOf('http://vmiis-local.com')!=-1) http127_i=1;
	else if($vm.localhost==true && url.indexOf('http://')==-1 && url.indexOf('https://')==-1){ //like modules/home.html
        http127_i=1;
        if(url[0]=='/') url=$vm.hosting_path+url;
        else url=$vm.hosting_path+"/"+url;
    }
	if(ver!=$vm.ver[0] || http127_i==1 || txt==null || $vm.reload!=''){
		var new_url=url+'?_v='+new Date().getTime();
		if(url.indexOf('?')!==-1) new_url=url+'&_v='+($vm.ver[0]+$vm.reload).replace(/\./,'')+"&g="+_g_vm_chrom_loop++;
		console.log('%cloading from url. '+new_url+" "+ver+"/"+$vm.ver[0]+" for "+m_name,"color:#b55")
		$.get(new_url, function(data){
			var c_m=$("<p>"+data+"</p>").filter('#D__ID').html();
			if(c_m!=undefined && c_m!='' && c_m!=null){ data=c_m;}
			if(items.length>1){
				for(var kk=0;kk<(items.length-1)/2;kk++){
					var k1=2*kk+1;
					var k2=2*kk+2;
					if(k1<items.length && k2<items.length){
						var re=new RegExp(items[k1], 'g');
						data=data.replace(re,items[k2]);
					}
				}
			}
			localStorage.setItem(apppath+url+"_txt",data);
			localStorage.setItem(apppath+url+"_ver",$vm.ver[0]);
			var current_all=$vm.replace_and_recreate_content(lines,i,data)
			if(current_all.indexOf('VmInclude:')==-1){
				$vm.install_create_module_and_run_code(current_all,module_id,url_0,slot,m_name,callback);
				var input=$vm.vm[module_id].input;
				if(input !=undefined && input.silence==1){}
				//else $vm.insert_and_trigger_load(module_id,slot,m_name);
			}
			else{
				$vm.install_process_first_include(current_all,module_id,slot,url_0,m_name,callback);
			}
		},'text');

	}
	else{
		//console.log('%cloading from stotage. '+url+" "+ver+"/"+$vm.ver[0]+" for "+m_name,"color:#055")
		var current_all=$vm.replace_and_recreate_content(lines,i,txt)
		if(current_all.indexOf('VmInclude:')==-1){
			$vm.install_create_module_and_run_code(current_all,module_id,url_0,slot,m_name,callback);
			var input=$vm.vm[module_id].input;
			if(input!=undefined && input.silence==1){}
			//else $vm.insert_and_trigger_load(module_id,slot,m_name);
		}
		else{
			$vm.install_process_first_include(current_all,module_id,slot,url_0,m_name,callback);
		}
	}
}
//-----------------------------------
