//-----------------------------------------------------------------
$vm.id=function(){
	if($vm._id==undefined) $vm._id=0;
	$vm._id++;
	return "_"+$vm._id.toString();
}
//------------------------------------------------------------------
_g_current_path='';
$vm.load_module=function(name,slot,input){
    if(name==undefined) return;
	//if($vm.name==undefined) $vm.name={}
	if($vm.vm==undefined) $vm.vm={}
    _g_vm_chrom_loop=0;
	//$vm.load_module_by_name(name,slot_1,op);
    if(input==undefined) input={};
	var slot_1=$vm.root_layout_content_slot;
	if(slot!=undefined && slot!="") slot_1=slot;
	if(slot=="hidden") slot_1=undefined;

    slot=slot_1

	if($vm.module_list[name]===undefined){
		alert("The module '"+name+"' is not in the module list.");
		return;
	}
    var url=$vm.module_list[name]['url'];
    if(url===undefined) return;
    url=$vm.url(url);
	var id=$vm.module_list[name].id;
	if(id==undefined) id=$vm.id();
	$vm.module_list[name].id=id;
	//$vm.name[id]=name;
	var m=$vm.module_list[name];
	m.input=input;

	var m_name=name;
	var module_id	=id;
	if(url[0]=='/') url=$vm.hosting_path+url;
	var last_part=url.split('/').pop();
    _g_current_path=url.replace(last_part,'');
	if($('#D'+module_id).length===0){
		$vm.vm[module_id]={};
	}
	if($vm.vm[module_id]==undefined) $vm.vm[module_id]={};
	$vm.vm[module_id].current_path=_g_current_path;
    $vm.vm[module_id].input=input;
    $vm.vm[module_id].name=name;
    $vm.vm[module_id].url=url;
	//------------------------------
	if($('#D'+module_id).length==0){
		var apppath=window.location.href.substring(0, window.location.href.lastIndexOf('/')).split('\/?')[0];
        var storage_url=url;
		var ver=localStorage.getItem(apppath+storage_url+"_ver");
		var txt=localStorage.getItem(apppath+storage_url+"_txt");
		var http127_i=0;
		if(url.indexOf('http://127.0.0.1')!=-1 || url.indexOf('http://localhost')!=-1) http127_i=1;
		var reload=0;
		if(window.location.toString().indexOf('reload='+m_name)!=-1){
			reload=1;
		}
		if(ver!=$vm.ver[0] || http127_i==1 || txt==null || $vm.reload!='' || reload==1){
			var new_url=url+'?_v='+new Date().getTime();
			if(url.indexOf('?')!==-1) new_url=url+'&_v='+($vm.ver[0]+$vm.reload).replace(/\./,'');
			console.log('loading from url. '+new_url+" "+ver+"/"+$vm.ver[0]+" 127:"+http127_i+" re:"+$vm.reload)
            if(window.location.hostname!='127.0.0.1' && window.location.hostname!='localhost')	$('#vm_loader').show();
			$.get(new_url, function(data){
				//-----------------------------------
				//for images belong to this module
				if(data.indexOf('__CURRENT_NAME__')!=-1){
					var nm=new_url.split('/').pop().split('?')[0];
					data=data.replace(/__CURRENT_NAME__/g,nm);
				}
				//-----------------------------------
				localStorage.setItem(apppath+storage_url+"_txt",data);
				localStorage.setItem(apppath+storage_url+"_ver",$vm.ver[0]);
				var current_all=data;
				if(current_all.indexOf('VmInclude:')==-1){
					$vm.create_module_and_run_code(current_all,module_id,url,slot,m_name);
					$vm.insert_and_trigger_load(module_id,slot,m_name);
				}
				else{
					$vm.process_first_include(current_all,module_id,slot,url,m_name);
				}
			}).fail(function() {
			    alert( "The module '"+url+"' doesn't exist or you have AdBlock that blocks this remote module to be loaded." );
			});
		}
		else{
			console.log('loading from stotage. '+url+" "+ver+"/"+$vm.ver[0]+" 127:"+http127_i+" re:"+$vm.reload)
			var current_all=txt;
			if(current_all.indexOf('VmInclude:')==-1){
				$vm.create_module_and_run_code(current_all,module_id,url,slot,m_name);
				$vm.insert_and_trigger_load(module_id,slot,m_name);
			}
			else{
				$vm.process_first_include(current_all,module_id,slot,url,m_name);
			}
		}
	}
	else $vm.insert_and_trigger_load(module_id,slot,m_name);
};
$vm.load_module_v2=$vm.load_module;
//---------------------------------------------
$vm.create_module_and_run_code=function(txt,module_id,url,slot,m_name){
	//txt=txt.replace(/__CURRENT_PATH__/g,_g_current_path);
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
	//-----------------
	if(slot!='body'){
		//content="<div id=D"+module_id+" module='"+m_name+"' class=vm_module style='display:none'><!--"+url+"-->"+content+"</div>"
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
			alert(err+"\r\nThis error happend in the module\r\n"+module);
		}
	}
	//-----------------------------------------
	$('#D'+module_id).on('dblclick',function(event){
		event.stopPropagation();
		$vm.source(''+module_id,event);
	});
	//-------------------------------------
	//if($vm.vm_module_border!==undefined){
	//	$('div.vm_module').css("border","1px solid red");
	//}
	//-------------------------------------
}
//-----------------------------------
$vm.insert_and_trigger_load=function(module_id,slot,m_name){
	if(slot!="body"){
		$vm.insert_module({module_id:module_id,slot:slot,m_name:m_name});
		$('#D'+module_id).triggerHandler('load');
		window.scrollTo(0,0);
	}
	$('#vm_loader').hide();
}
//-----------------------------------
$vm.insert_module=function(options){
    if($vm.page_stack==undefined){
        $vm.page_stack=[];
        $vm.page_stack_index=0;
    }
	var module_id		=options.module_id;
	var slot	=options.slot;
    if(module_id===undefined) return;
	if(slot===undefined || slot=="") return;
    //new =================================
    var L=$vm.page_stack.length;
    if(L!=0){
        var top=$vm.page_stack[L-1];
        if(top!=undefined && top.slot==slot){
            $('#D'+top.ID).css('display','none');
            $('#D'+top.ID).triggerHandler('hide');
        }
    }
    //$vm.push_to_slot({div:module_id,slot:slot});
	$('#D'+module_id).css('display','block');
	$('#D'+module_id).triggerHandler('show');

	if(slot!=$vm.root_layout_content_slot) return;

    $vm.page_stack_index++;
    $vm.page_stack.push({m_name:options.m_name,ID:module_id,slot:slot,index:$vm.page_stack_index});
	var pp=null;
	//if($vm.vm_router!=undefined){
    //if($vm.module_list[$vm.vm[module_id].name].router!=undefined){
	if($vm.module_list[options.m_name].router!=undefined){
		var dd="";
		var q=window.location.href.split('?');
		if(q.length==2){
			if(q[1].length>0){
				if(q[1][0]!='/'){
					//.com/?xxx
					//.com/index.html?xxx
					dd="&"+q[1]; //&xxx
				}
				else{
					//.com/?/xxx
					//.com/?/xxx&yyy
					//.com/index.html?/xxx
					//.com/index.html?/xxx&yyy
					//q[1]=/xxx
					//q[1]=/xxx&yyy
					var s=q[1].split('&')[0];
					//s=/xxx
					dd=q[1].replace(s,''); //remove /xxx
				}
			}
			else{
				// .com/?
			}
		}
		var ext=q[0].split('.').pop();
		if(ext=='html') pp=q[0]+"?/"+$vm.vm[module_id].name.replace(/_/g,'\/')+dd;
		else            pp=$vm.hosting_path+"/?/"+$vm.vm[module_id].name.replace(/_/g,'\/')+dd;
	}
    window.history.pushState({m_name:options.m_name,ID:module_id,slot:slot,index:$vm.page_stack_index}, null, pp);
	//if($vm.change_meta!=undefined){ $vm.change_meta(module_id); }
	if($vm.show!=undefined){ $vm.show(options.m_name); }
//    console.log($vm.page_stack)
    //=====================================
    return;
};
//------------------------------------
$vm.process_first_include=function(txt,module_id,slot,url_0,m_name){
	var lines=txt.split('\n');
	for(var i=0;i<lines.length;i++){
		if(lines[i].length>10){
			if(lines[i].indexOf('VmInclude:')!==-1){
				$vm.load_include(lines,i,module_id,slot,url_0,m_name); //find the first include and process
				return;
			}
		}
	}
}
//-----------------------------------
$vm.load_include=function(lines,i,module_id,slot,url_0,m_name){
	var name=lines[i].replace('//VmInclude:','').replace('VmInclude:','').trim();
	name=name.replace(/\'/g,'');
	name=name.replace(/\"/g,'');
	var items=name.split('|');
	var url=$vm.url(items[0]);
	if(url[0]=='/') url=$vm.hosting_path+url;
	//url=url.replace('__CURRENT_PATH__',_g_current_path);
	url=url.replace('__CURRENT_PATH__',$vm.vm[module_id].current_path);
	//------------------------------
	var apppath=window.location.href.substring(0, window.location.href.lastIndexOf('/')).split('\/?')[0];
	var ver=localStorage.getItem(apppath+url+"_ver");
	var txt=localStorage.getItem(apppath+url+"_txt");

	var http127_i=0;
	if(url.indexOf('http://127.0.0.1')!=-1 || url.indexOf('http://localhost')!=-1) http127_i=1;
	else if($vm.localhost==true && url.indexOf('http://')==-1 && url.indexOf('https://')==-1){ //like modules/home.html
        http127_i=1;
        if(url[0]=='/') url=$vm.hosting_path+url;
        else url=$vm.hosting_path+"/"+url;
    }
	if(ver!=$vm.ver[0] || http127_i==1 || txt==null || $vm.reload!=''){
		//var new_url=url+'?_v='+($vm.ver[0]+$vm.reload).replace(/\./,'')+"&g="+_g_vm_chrom_loop++;
		var new_url=url+'?_v='+new Date().getTime();
		if(url.indexOf('?')!==-1) new_url=url+'&_v='+($vm.ver[0]+$vm.reload).replace(/\./,'')+"&g="+_g_vm_chrom_loop++;
		console.log('loading from url. '+new_url+" "+ver+"/"+$vm.ver[0]+" 127:"+http127_i+" re:"+$vm.reload)
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
				$vm.create_module_and_run_code(current_all,module_id,url_0,slot,m_name);
				$vm.insert_and_trigger_load(module_id,slot,m_name);
			}
			else{
				$vm.process_first_include(current_all,module_id,slot,url_0,m_name);
			}
		},'text');

	}
	else{
		console.log('loading from stotage. '+url+" "+ver+"/"+$vm.ver[0]+" 127:"+http127_i+" re:"+$vm.reload)
		var current_all=$vm.replace_and_recreate_content(lines,i,txt)
		if(current_all.indexOf('VmInclude:')==-1){
			$vm.create_module_and_run_code(current_all,module_id,url_0,slot,m_name);
			$vm.insert_and_trigger_load(module_id,slot,m_name);
		}
		else{
			$vm.process_first_include(current_all,module_id,slot,url_0,m_name);
		}
	}
}
//-----------------------------------
$vm.replace_and_recreate_content=function(lines,I,replace){
	lines[I]=replace;
	var all="";
	for(var j=0;j<lines.length;j++){
		all+=lines[j]+'\n';
	}
	return all;
}
//-----------------------------------
