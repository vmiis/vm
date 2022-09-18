//-------------------------------------------------------------
$vm.set_block=function(name){
	var prefix=$vm.module_list[name].prefix;
	if(prefix==undefined) prefix="";
	var parent=prefix+$vm.module_list[name].parent;
	if($vm.module_list[name].parent!=undefined){
		var slot=$vm.module_list[parent].slot;
		var id=$vm.module_list[parent].id;
		if(slot==undefined) slot=$vm.root_layout_content_slot;
		$('#'+slot+' >div').css('display','none');
		$('#D'+id).css('display','block');
	}

	var slot=$vm.module_list[name].slot;
	var id=$vm.module_list[name].id;
	if(slot==undefined) slot=$vm.root_layout_content_slot;
	$('#'+slot+' >div').css('display','none');
	$('#D'+id).css('display','block');
}
//-------------------------------------------------------------
window.onpopstate=function(event){
	//new ==========================================
	if(event.state==undefined) return;
    var W_index=event.state.index;
    var V_index=0;
    var L=$vm.page_stack.length;
    if(L>1){
        var previous=$vm.page_stack[L-2];
        V_index=previous.index;
    }
    if(W_index==V_index){
        //back
        var top=$vm.page_stack.pop();
        var slot_of_hide_module="";
        if(top!=undefined){
            slot_of_hide_module=top.slot;
			$('#D'+top.ID).css('display','none');
			$('#D'+top.ID).triggerHandler('hide');
		}
        if($vm.page_stack.length==0){
            window.history.back(-1);
        }
        else{
            var L=$vm.page_stack.length;
			var top=$vm.page_stack[L-1];
			var current_slot=top.slot;
			var current_id=top.ID;
			var current_name=top.m_name;
			//var parent_id=$vm.module_list[current_name].parent_id;
            $('#'+current_slot +' >div').css('display','none');
            $('#D'+current_id).css('display','block');
			$('#D'+current_id).triggerHandler('show');
			
			$vm.set_block(event.state.m_name);
			
			if($vm.show!=undefined){$vm.show(current_name); }
        }
        if(slot_of_hide_module!=""){
            var block=0; $('#'+slot_of_hide_module+' > div').each(function(){ if($(this).css('display')=='block') block++; })
            if(block==0) window.history.back(-1);
        }
    }
    else if(W_index>V_index){
        //forword
        var L=$vm.page_stack.length;
		var top=$vm.page_stack[L-1];
		

        $('#D'+top.ID).css('display','none');
		$('#D'+top.ID).triggerHandler('hide');
        $('#D'+event.state.ID).css('display','block');
		$('#D'+event.state.ID).triggerHandler('show');
        $vm.page_stack.push(event.state);
		
		$vm.set_block(event.state.m_name);
		
		if($vm.show!=undefined){ $vm.show(event.state.m_name); }
    }
    //console.log($vm.page_stack);
    //new ==========================================
    return;

    //old ==========================================
    if(event.state==null){
		window.history.back(-1);
	}
	else{
		var slot=$vm.root_layout_content_slot;
		var current_ID=$('#'+slot).data("current_state").ID;
		var last_ID=event.state.ID;
		if(last_ID!=undefined){
			$('#D'+last_ID).css('display','block');
            $('#D'+last_ID).triggerHandler('show');
			if(current_ID!=last_ID){
				$('#D'+current_ID).css('display','none');
                $('#D'+last_ID).triggerHandler('hide');
			}
		}
		$('#'+slot).data("current_state",event.state);
        console.log('popstate'+event.state.ID+'   last:'+current_ID+" --- current:"+event.state.ID)
	}
    //old ==========================================
}
//------------------------------------






//------------------------------------
//not used
$vm.push_back_to_park=function(options){
	var div=options.div;
	if( $('#D'+div).length>0){
		var scroll=$('#vm_body').scrollTop();
		$('#D'+div).data('scroll',scroll);

		//$('#D'+div).appendTo('#vm_park');
		$('#D'+div).css('display','none');

		$('#D'+div).triggerHandler('hide');
	}
}
$vm.push_to_slot=function(options){
	var div	=options.div;
	var slot=options.slot;

	//$('#'+slot).html('');
   	//$('#D'+div).appendTo('#'+slot);
	$('#D'+div).css('display','block');

	$('#D'+div).triggerHandler('show');
	var scroll=$('#D'+div).data('scroll');
	if(scroll==undefined) scroll=0;
	$('#vm_body').scrollTop(scroll)
}
$vm.back=function(options){
	var div=options.div;
	var back_module=$('#D'+div).data('back_module');
	var back_slot=$('#D'+div).data('back_slot');
	$vm.push_back_to_park({div:div});
	$vm.push_to_slot({div:back_module,slot:back_slot});
	$('#'+back_slot).data("current",back_module);
	var form=options.form;
	var refresh_back=options.refresh_back;
	if(form!==undefined){
		if(refresh_back===undefined) $('#D'+back_module).triggerHandler('form_back'); //without save on form
		else if(refresh_back!==undefined) $('#D'+back_module).triggerHandler('refresh_back'); //with save on form
	}
	else $('#D'+back_module).triggerHandler('back');
}
$vm.back_and_refresh=function(options){
	var div=options.div;
	var back_module=$('#D'+div).data('back_module');
	var back_slot=$('#D'+div).data('back_slot');
	$vm.push_back_to_park({div:div});
	$vm.push_to_slot({div:back_module,slot:back_slot});
	$('#'+back_slot).data("current",back_module);
	$('#D'+back_module).triggerHandler('refresh_back');
}
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
$vm.first_day_of_current_week=function(){
      var d=new Date(); d.setHours(0,0,0,0);
      var day = d.getDay(), diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
      return new Date(d.setDate(diff));
}
$vm.first_day_of_current_month=function(){
	var date = new Date();
    date.setHours(0,0,0,0);
    var y = date.getFullYear(), m = date.getMonth();
	var firstDay = new Date(y, m, 1,0,0,0,0);
	return firstDay;
}
$vm.first_day_of_current_year=function(){
	var date = new Date();
    date.setHours(0,0,0,0);
    var y = date.getFullYear();
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
$vm.yyyymmdd_to_ddmmyyyy=function(d){
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
$vm.render_checkbox_field=function(record,mID,$div,html){
    var field=$div.attr('data-id');
    //record.vm_custom[field]=true;
    $div.html(html);
    if(record[field]=="1" || record[field]=="True" || record[field]=="on" ) $div.find('input').prop('checked', true);
    $div.find('input').on('click', function(){
        var value='0';
        if($(this).prop("checked") == true)   value='1';

        if(value==="" && record[field]===undefined) return;
        if(value!==record[field]){
            record.vm_dirty=1;
            record[field]=value;
            $('#save'+mID).css('background','#E00');
        }
    });
}
//-----------------------------------------------------------------
$vm.init=function(callback){
    $vm.user_name="guest";
    $vm.user_id="-";
	$vm.user_ip="0";
	$vm.sys_N=0;
	if(callback==undefined) return;
	
	if($vm.api_type=="sqlserver"){
		$vm.init_s(callback);
		return;		
	}
	
    $vm.request({cmd:'user-info'},function(res){
        $vm.user_name=res.records[0].user_name;
        $vm.displayname=res.records[0].displayname;
        $vm.groups=res.records[0].groups;
        if(callback!==undefined) callback(res);
    })
}
//-----------------------------------------------------------------
$vm.init_s=function(callback){
	if($vm.vm==undefined) $vm.vm={};
	$vm.edge=0;
	if(navigator.appVersion.indexOf('Edge')!=-1) $vm.edge=1;
	$vm.user="guest";
	$VmAPI.request({data:{cmd:'user_name',ip:$vm.ip},callback:function(res){
		if(res.user!==undefined){
			$vm.user=res.user;
			$vm.user_name=res.user;
			$vm.user_id=res.user_id;
			$vm.user_ip=res.user_ip;
			$vm.user_puid=res.user_puid;
		}
		if(callback!==undefined) callback(res);

		//------------------------------------------------------------------
		/*
		$vm.ip='';
		try{
			window.RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
			var pc = new RTCPeerConnection({iceServers:[]}), noop = function(){};
			pc.createDataChannel("");
			pc.createOffer(pc.setLocalDescription.bind(pc), noop);
			pc.onicecandidate = function(ice){
			   if(!ice || !ice.candidate || !ice.candidate.candidate)  return;
			   $vm.ip=/([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/.exec(ice.candidate.candidate)[1];
			   pc.onicecandidate = noop;
			   $VmAPI.request({data:{cmd:'user_ip',ip:$vm.ip,name:$vm.user},callback:function(res){}})
			   //-----------------------------------------------------
			};
		}catch(e){
			$VmAPI.request({data:{cmd:'user_ip',ip:'0.0.0.0',name:$vm.user},callback:function(res){}})
		}
		//------------------------------------------------------------------
		*/
	}})
	//-----------------------------------------------------
};
//------------------------------------------------------------------
//------------------------------------------------
$vm.install_module=function(name,slot,input,callback){
	//---
	var id0=$vm.module_list[name].id;
	if(id0!=undefined){ //all ready installed
		callback(name,id0);
		return; 
	}
	//---
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
	m.input=input;	
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
				data=$vm.url(data);
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
			var m=$vm.module_list[m_name];
			eval('F'+module_id)(m);
			//eval('F'+module_id+"()");
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
	//var name=lines[i].replace('//VmInclude:','').replace('VmInclude:','').trim();
	var name=lines[i].replace('<!--VmInclude:','').replace('/*VmInclude:','').replace('//VmInclude:','').replace('VmInclude:','').trim();
	name=name.replace('-->','').replace('*/','').trim();
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
            data=$vm.url(data);
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
		console.log('%cloading from url. '+new_url+" "+ver+"/"+$vm.ver[0]+" 127:"+http127+" re:"+$vm.reload,"color:#b55")
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
			console.log('%cloading from url. '+url+' '+ver+'/'+$vm.ver[0]+" 127:"+http127,"color:#b55");
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
//-----------------------------------------------------------------
$vm.id=function(){
	if($vm._id==undefined) $vm._id=0;
	$vm._id++;
	return "_"+$vm._id.toString();
}
//------------------------------------------------------------------
$vm.load_content=function(name,slot,input,content){
	var url=$vm.module_list[name]['url'];

	var apppath=window.location.href.substring(0, window.location.href.lastIndexOf('/')).split('\/?')[0];
	localStorage.setItem(apppath+url+"_txt",content);

	if(slot=='') slot=$vm.root_layout_content_slot;
	var id=$vm.module_list[name].id;
	if(id==undefined) id=$vm.id();
	$vm.module_list[name].id=id;
	$vm.vm[id]={};
	
	if(url[0]=='/') url=$vm.hosting_path+url;
	var last_part=url.split('/').pop();
    var current_path=url.replace(last_part,'');
	$vm.vm[id].current_path=current_path;

	if(content.indexOf('VmInclude:')==-1){
		$vm.create_module_and_run_code(content,id,url,slot,name);
		$vm.insert_and_trigger_load(id,slot,name);
	}
	else{
		$vm.process_first_include(content,id,slot,url,name);
	}
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
		//var ver=localStorage.getItem(apppath+storage_url+"_ver");
		//var txt=localStorage.getItem(apppath+storage_url+"_txt");
		var ver=localStorage.getItem(storage_url+"_ver");
		var txt=localStorage.getItem(storage_url+"_txt");
		var http127_i=0;
		if(url.indexOf('http://127.0.0.1')!=-1 || url.indexOf('http://localhost')!=-1 || url.indexOf('http://vmiis-local.com')!=-1) http127_i=1;
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
				//localStorage.setItem(apppath+storage_url+"_txt",data);
				//localStorage.setItem(apppath+storage_url+"_ver",$vm.ver[0]);
				localStorage.setItem(storage_url+"_txt",data);
				localStorage.setItem(storage_url+"_ver",$vm.ver[0]);
				var current_all=data;
				if(current_all.indexOf('VmInclude:')==-1){
					$vm.create_module_and_run_code(current_all,module_id,url,slot,m_name);
					if(input !=undefined && input.silence==1){}
					else $vm.insert_and_trigger_load(module_id,slot,m_name);
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
				if(input !=undefined && input.silence==1){}
				else $vm.insert_and_trigger_load(module_id,slot,m_name);
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
			var m=$vm.module_list[m_name];
			eval('F'+module_id)(m);
			//eval('F'+module_id+"()");
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
	$('#'+slot+' >div').css('display','none');
	$('#D'+module_id).css('display','block');
	$('#D'+module_id).triggerHandler('show');

	//if(slot!=$vm.root_layout_content_slot) return;

	$vm.page_stack_index++;
	var parent_id='';
    $vm.page_stack.push({m_name:options.m_name,ID:module_id,parent_id:parent_id,slot:slot,index:$vm.page_stack_index});
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
	else{
		pp=window.location.href.split('?')[0];
	}
    window.history.pushState({m_name:options.m_name,ID:module_id,slot:slot,index:$vm.page_stack_index}, null, pp);
	//if($vm.change_meta!=undefined){ $vm.change_meta(module_id); }
	if($vm.show!=undefined){ $vm.show(options.m_name); }
	else if($vm.first_module==undefined) $vm.first_module=options.m_name;
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
	var name=lines[i].replace('<!--VmInclude:','').replace('/*VmInclude:','').replace('//VmInclude:','').replace('VmInclude:','').trim();
	name=name.replace('-->','').replace('*/','').trim();
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
	if(url.indexOf('http://127.0.0.1')!=-1 || url.indexOf('http://localhost')!=-1 || url.indexOf('http://vmiis-local.com')!=-1) http127_i=1;
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
            data=$vm.url(data);
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
				var input=$vm.vm[module_id].input;
				if(input !=undefined && input.silence==1){}
				else $vm.insert_and_trigger_load(module_id,slot,m_name);
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
			var input=$vm.vm[module_id].input;
			if(input!=undefined && input.silence==1){}
			else $vm.insert_and_trigger_load(module_id,slot,m_name);
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
$vm.show_module=function(name,input){
	if($vm.module_list[name]===undefined){
		alert("The module '"+name+"' is not in the module list.");
		return;
	}
	var prefix=$vm.module_list[name].prefix;
	if(prefix==undefined) prefix="";
	var m=$vm.module_list[name];
	var install_this=function(){
		var parent=prefix+m.parent;
		m.input=input;	
		var id=$vm.module_list[name].id;
		if(id==undefined){ 
			var slot=$vm.root_layout_content_slot;
			if(m.parent!=undefined)	slot='content'+$vm.module_list[parent].id;
			$vm.install_module(name,slot,input, function(name,id){
				//console.log('%c'+name + ' is installed','color:green');
				if(m.parent!=undefined){
					var pm=$vm.module_list[parent];
					$vm.insert_and_trigger_load(pm.id,pm.slot,parent);	
				}
				$vm.insert_and_trigger_load(m.id,m.slot,name);
			})
		}
		else{
			if(m.parent!=undefined){
				var pm=$vm.module_list[parent];
				$vm.insert_and_trigger_load(pm.id,pm.slot,parent);	
			}
			$vm.insert_and_trigger_load(m.id,m.slot,name);
		}
	}
	if(m.parent!=undefined){
		var parent=prefix+m.parent;
		if($vm.module_list[parent].id==undefined){ //install parent first
			$vm.install_module(parent,$vm.root_layout_content_slot,{},function(name,id){
				//console.log('%c'+name + ' is installed','color:green');
				install_this();	
			})
		}
		else install_this(); //parent is installed already
	}
	else install_this(); //no parent;
	
	/*
	var m=$vm.module_list[name];
	m.input=input;
	if(m.parent!=undefined){
		var pm=$vm.module_list[m.parent];
		$vm.insert_and_trigger_load(pm.id,pm.slot,m.parent);	
	}
	$vm.insert_and_trigger_load(m.id,m.slot,name);
	*/
}
//-----------------------------------
//-----------------------------------------------------------------
$vm.request=function(req,callback,progress){
    var api_url=$vm.api_address;
    var token_name="vm_token";
    if(req.api!=undefined){
        api_url=$vm.api_addresses[req.api];
        token_name=req.api+" token";
    }
    
    $vm.sys_N++;
    var this_N=$vm.sys_N;
    $vm.sys_token="guest|where|when|scode";
    if($vm.debug_message===true){
        console.log("%c"+req.cmd+'('+this_N+') TO ',"color:orange",req);
    }
    var dt1=new Date().getTime();
    $vm.ajax_server_error=0;
    //var token=sessionStorage.getItem("vm_token");
    var token=sessionStorage.getItem(token_name);
    if(token==undefined) token="";
    
    var param={
        headers:{'Authorization':'Bearer ' + token},
        type: "POST",
        url: api_url,
        contentType: "application/json",
        charset:"utf-8",
        dataType: "json",
        error: function(jqXHR,error, errorThrown){ 
            if(error && req.cmd=='file'){callback(404);}
            if(jqXHR.status) {} 
            else {}
        },
        data: JSON.stringify(req),
        success: function(c,textStatus, request){
            var dt2=new Date().getTime();
            if($vm.debug_message===true){
                if(c.status=='ok' || req.cmd=='file')  console.log("%c"+req.cmd+'('+this_N+') FROM'+" --- "+(dt2-dt1).toString()+"ms","color:lightgreen",c);
                else                                   console.log("%c"+req.cmd+'('+this_N+') FROM'+" --- "+(dt2-dt1).toString()+"ms","color:red",c);
            }
            if($vm.ajax_server_error==1) return;
            try{
                if(callback!==undefined) callback(c,textStatus, request);
            }catch(err){
                alert(err.toString());
            }
        },
        dataFilter: $vm.request_filter,
    }
    if(progress!=undefined){
        param.xhr=function(){
            var xhr = $.ajaxSettings.xhr() ;
            xhr.upload.onprogress = function(evt){ progress(evt.loaded, evt.total); } ;
            xhr.upload.onload = function(){ } ;
            return xhr ;
        }
    }
    if(req.cmd=="export" || req.cmd=="export2"){
        param.xhr=function(){
            var i=1;
            var xhr = new window.XMLHttpRequest();
            xhr.addEventListener("progress", function(evt){
                var N=-1,end="";
                var len=xhr.responseText.length;
                if(len>=5 && N==-1)  N=parseInt(xhr.responseText.substring(0,5));
                if(len>=14) end=xhr.responseText.substring(len-9,len);
                if(end=='__E_N_D__') i=-1;
                callback(N,i,xhr.responseText);
                i++;
            }, false);
            return xhr;
        }
    }
    else if( req.cmd=="file" && req.datetime==undefined ){
        delete param.dataType;
        param.xhrFields={responseType: 'blob'};
    }
    $.ajax(param)
};
//-----------------------------------------------------------------
/*
$vm.request=function(req,callback){
    $vm.sys_N++;
    $vm.sys_token="guest|where|when|scode";
    if($vm.debug_message===true){
        //console.log(' ');
        console.log("%c"+req.cmd+'('+$vm.sys_N+') TO ',"color:orange",req);
        //console.dir(req);
    }
    var dt1=new Date().getTime();
    $vm.ajax_server_error=0;
    var token=sessionStorage.getItem("vm_token");
    if(token==undefined) token="";
    
    var param={
        headers:{'Authorization':'Bearer ' + token},
        type: "POST",
        url: $vm.api_address,
        contentType: "application/json",
        charset:"utf-8",
        dataType: "json",
        error: function(jqXHR,error, errorThrown){ if(jqXHR.status) {} else {}},
        data: JSON.stringify(req),
        success: function(c,textStatus, request){
            var dt2=new Date().getTime();
            if($vm.debug_message===true){
                if(c.status=='ok')  console.log("%c"+req.cmd+'('+$vm.sys_N+') FROM'+" --- "+(dt2-dt1).toString()+"ms","color:lightgreen",c);
                else                console.log("%c"+req.cmd+'('+$vm.sys_N+') FROM'+" --- "+(dt2-dt1).toString()+"ms","color:red",c);
            }
            if($vm.ajax_server_error==1) return;
            try{
                if(callback!==undefined) callback(c,textStatus, request);
            }catch(err){
                alert(err.toString());
            }
        },
        dataFilter: $vm.request_filter,
        
        
    }
    if(req.cmd=="export"){
        param.xhr=function(){
            var i=1;
            var xhr = new window.XMLHttpRequest();
            xhr.addEventListener("progress", function(evt){
                var N=-1,end="";
                var len=xhr.responseText.length;
                if(len>=5 && N==-1)  N=parseInt(xhr.responseText.substring(0,5));
                if(len>=14) end=xhr.responseText.substring(len-9,len);
                if(end=='__E_N_D__') i=-1;
                callback(N,i,xhr.responseText);
                i++;
            }, false);
            return xhr;
        }
    }
    $.ajax(param)
};
*/
//-----------------------------------------------------------------
$vm.request_filter=function(c){
    try{
        var a=$.parseJSON(c);
        if(a.Error!=undefined){
            alert(a.Error);
            $vm.ajax_server_error=1;
        }
    }
    catch(e){}
    return c;
}
//-----------------------------------------------------------------
$vm.set_token=function(token){
    sessionStorage.setItem("vm_token",token);
};
$vm.clear_token=function(token){
    sessionStorage.setItem("vm_token","");
};
//-----------------------------------------------------------------
//-----------------------------------------------------------------
(function(){
	var _token="notoken";
	$VmAPI.set_token=function(token,api_url,loginname,userid,nickname){
		sessionStorage.setItem("ahsj634cupsd6349wquyewij4swq7202",token);
		sessionStorage.setItem("x7645hscvf650hd64083hgf69087201a",api_url);
		sessionStorage.setItem("h3879j478450wjh830ks9937300kj3kj",loginname);
		sessionStorage.setItem("gu8309ihd407js6h59eje8jhl630543h",userid);
		sessionStorage.setItem("v84yw673jhekerhgs4fld54hdfzshjrt",nickname);
  		_token=token;
		if(token=="") _token="notoken";
  	};
	$VmAPI.clear_token=function(){
		sessionStorage.setItem("ahsj634cupsd6349wquyewij4swq7202","notoken");
		sessionStorage.setItem("x7645hscvf650hd64083hgf69087201a","");
		sessionStorage.setItem("h3879j478450wjh830ks9937300kj3kj","");
		sessionStorage.setItem("gu8309ihd407js6h59eje8jhl630543h","");
		sessionStorage.setItem("v84yw673jhekerhgs4fld54hdfzshjrt","");
	}
	$VmAPI.get_username=function(){
		return sessionStorage.getItem("h3879j478450wjh830ks9937300kj3kj");
	}
	var g_N=0;
  	$VmAPI.request=function(options){
		g_N++;
		var this_N=g_N;
		_token=sessionStorage.getItem("ahsj634cupsd6349wquyewij4swq7202");
		if(typeof(_token)==undefined){ //safari bug
			console.log('safari bug')
			_token="notoken";
		}
  		//$VmAPI._request(_token,options)
		var data=options.data;
		var callback=options.callback;
		$VmAPI.ajax_server_error=0;
		var url=$VmAPI.api_base+'api.aspx?api=1';
		if($vm.debug_message===true){
			console.log(' ');
			//console.log('TO '+url+" --- "+JSON.stringify(data));
			console.log(data.cmd+'('+this_N+') TO '/*+url*/);
			console.dir(data);
			//console.log(data);
		}
		var dt1=new Date().getTime();
		var headers={'Authorization':'Bearer ' + _token};
		//if(_token=='') headers={}; else headers={'Authorization':_token.substring(0,50)};
		$.ajax({
			headers:headers,
			type: "POST",
			url: url,
			contentType: "application/json",
			charset:"utf-8",
			dataType: "json",
			error: function(jqXHR,error, errorThrown){ if(jqXHR.status) {alert(jqXHR.responseText);} else {alert("Something went wrong");}},
			data: JSON.stringify(data),
			success: function(c,textStatus, request){
				var dt2=new Date().getTime();
				if($vm.debug_message===true){
					console.log(' ');
					console.log(data.cmd+'('+this_N+') FROM '+/*url+*/" --- "+(dt2-dt1).toString()+"ms"/*+"--- "+JSON.stringify(c)*/);
					console.dir(c);
				}
				if($VmAPI.ajax_server_error==1) return;
				try{
					if(callback!==undefined) callback(c);
				}catch(err){
					alert(err.toString());
				}
			},
			dataFilter: $VmAPI.request_filter,
			/*
			beforeSend:function(jqXHR,settings){
				alert(_token)
				//if(_token!='') jqXHR.setRequestHeader('Authorization',_token);
			},
			*/
		})
  	};
	$VmAPI.connect=function(db_pid,room_uid,onmessage,callback){
		var url=$VmAPI.api_base.replace('https://','wss://')+'api.ashx';
		var ws= new WebSocket(url);
		ws.onmessage=onmessage;
        ws.onopen = function () {
            ws.send("VM_CONNECT:"+_token+"|"+db_pid+"|"+room_uid);
			callback(ws);
        };
	}
}());
//$VmAPI._request=function(token,options){};
//-----------------------------------------------------------------
$VmAPI.request_filter=function(c){
	var a=$.parseJSON(c);
	if(a.Error!=undefined){
		//alert(a.Error);
		console.log(a.Error)
		$VmAPI.ajax_server_error=1;
		if(typeof($VmAPI.submit_div)!=='undefined' && $VmAPI.submit_div!=""){
   			$('#D'+$VmAPI.submit_div).triggerHandler('submit_failed');
		}
	}
	return c;
}
//-----------------------------------------------------------------
//--------------------------------------------------------
$vm.upload_form_files=function(res,$form,msg_id,callback){
    //--------------------------------------------------------
    var total_num=0;
    $form.find('input[type=file]').each(function(evt){
        if(this.files.length===1){
            total_num++;
        }
    });
    if(total_num!=0){
        $form.find('input[type=file]').each(function(evt){
            if(this.files.length===1){
                var name=this.name;
                var s3_upload_url=res.aws[name];
                $vm.uploading_file(s3_upload_url,this.files[0],msg_id,function(){
                    total_num--;
                    if(total_num==0){
                        callback();
                    }
                });
            }
        });
    }
    else callback();
    //--------------------------------------------------------
}
//--------------------------------------------------------
$vm.upload_form_files_s=function(res,$form,msg_id,callback){
    //--------------------------------------------------------
    var total_num=0;
    $form.find('input[type=file]').each(function(evt){
        if(this.files.length===1){
            total_num++;
        }
    });
    if(total_num!=0){
        $form.find('input[type=file]').each(function(evt){
            if(this.files.length===1){
                var name=this.name;
                var s3_upload_url=res['file__'+name];
                $vm.uploading_file(s3_upload_url,this.files[0],msg_id,function(){
                    total_num--;
                    if(total_num==0){
                        callback();
                    }
                });
            }
        });
    }
    else callback();
    //--------------------------------------------------------
}
//--------------------------------------------------------
$vm.uploading_file=function(s3_upload_url,file,msg_id,callback){
    if(file){
        $.ajax({
            xhr: function(){
                var xhr = new window.XMLHttpRequest();
                xhr.upload.addEventListener("progress", function(evt){
                    $('#'+msg_id).text(evt.loaded);
                }, false);
                return xhr;
            },
            url : s3_upload_url,
            type : "PUT",
            data : file,
            headers: {'Content-Type': file.type },
            cache : false,
            processData : false
        })
        .done(function() {
            callback();
        })
        .fail(function(e) {
            alert('Upload error');
        });
    }
}
//---------------------------------------------
$vm.open_s3_url=function(id,table,filename,url,expires){
    $vm.request({cmd:"s3_download_url",id:id,table:table,filename:filename,url:url,expires:expires},function(res){
        if(res.sys.permission==false){
            alert("No permission.")
            return;
        }
        var link = document.createElement("a");
        link.href = res.result;
        link.style = "visibility:hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
}
//---------------------------------------------
$vm.open_s3_url_s=function(rid,filename,minutes){
    var req={cmd:'get_s3_download_url',qid:$vm.qid,rid:rid,filename:filename,minutes:minutes};
    $VmAPI.request({data:req,callback:function(res){
        var link = document.createElement("a");
        link.href = res.s3_download_url;
        link.style = "visibility:hidden";
        var fn=filename.split('-');
        link.download = filename.replace(fn[0]+'-','').replace(/ /g,'_');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }});
}
//---------------------------------------------
$vm.get_image_url=function(tag,record,expires,callback){
    var modified=record.Update_date;
       if(modified==undefined) modified=record.Submit_date;
    
    var filename=record.Data[tag];
    if(filename==undefined || filename==""){
        callback('');
        return;
    }
    var img_id='img_'+tag+'_'+record._id;
    if($vm[img_id]!=undefined) callback($vm[img_id]);
    else{
        var img_url				=localStorage.getItem(img_id+"_url");
        var img_last_load_date	=localStorage.getItem(img_id+"_last_load_date");
        var img_modified		=localStorage.getItem(img_id+"_modified");
        var D1=new Date();
        var D0=new Date(img_last_load_date);
        var dif=D1.getTime()-D0.getTime();
        dif=dif/1000/3600/24;
        if(img_url!==null && dif<6 && img_modified==modified){
            $vm[img_id]=img_url;
            callback($vm[img_id]);
        }
        else{
            var url=record.Table+"/"+record.UID+"-"+tag+"-"+filename;
            $vm.request({cmd:"s3_download_url",id:record._id,table:record.Table,filename:filename,url:url,expires:expires},function(res){
                if(res.status=="np"){
                    callback('');
                    return;
                }
                localStorage.setItem(img_id+"_url",res.result);
                localStorage.setItem(img_id+"_last_load_date",new Date().toString());
                localStorage.setItem(img_id+"_modified",modified);
                $vm[img_id]=res.result;
                callback($vm[img_id]);
            });
        }
    }
}
//---------------------------------------------
//--------------------------------------------------------
$vm.add_value_to_select=function($el, v){
	var exists = false;
	$el.find('option').each(function(index){
		if (this.value == v) {
			exists = true;
			return false;
		}
	});    
	if(exists==false){
		$el.append(new Option(v, v));
	}
}
$vm.deserialize=function(record,form_id){
	if(record==undefined || record.Data==undefined) return;
	$.each(record.Data, function(name, value){
		if(name!=''){
			var $els = $(form_id+' *[name='+name+']');
			$els.each(function(){
				var $el=$(this);
				var type = $el.attr('type');
				switch(type){
					case 'checkbox':
						if(value=='off' || value=='0' || value=='' || value==undefined ) $el.prop('checked', false);
						else $el.prop('checked', true);
						break;
					case 'radio':
						if($el.attr('value')==value){
							$el.prop('checked', true);
						}
						break;
					case 'file':
						break;
					case 'text':
					case 'email':
					case 'date':
					case 'time':
					case 'tel':
					case 'textarea':
					case 'select':
						$el.val(value);
						break;
					case 'undefined':
						break;
					default:
						var type1=$(this).prop('nodeName');
						switch(type1){
							case "SELECT":
								$vm.add_value_to_select($el,value);
								$el.val(value);
								break;
							case "TEXTAREA":
                                $el.val(value); 
                                break;
							default: 
								console.log(type+"---"+type1)				
                                $el.val(value); 
                                break;
						}
						break;
				}
			});
		}
	});
}
/*
$vm.deserialize=function(record,form_id){
    if(record==undefined || record.Data==undefined) return;
    $.each(record.Data, function(name, value){
        if(name!=''){
            var $els = $(form_id+' *[name='+name+']');
            $els.each(function(){
                var $el=$(this);
                var type = $el.attr('type');
                switch(type){
                    case 'checkbox':
                        if(value=='off' || value=='0' || value=='' || value==undefined ) $el.prop('checked', false);
                        else $el.prop('checked', true);
                        break;
                    case 'radio':
                        if($el.attr('value')==value){
                             $el.prop('checked', true);
                        }
                        break;
                    case 'file':
                        break;
                    case 'text':
                    case 'email':
                    case 'textarea':
                    case 'select':
                        $el.val(value);
                        break;
                    case 'undefined':
                        break;
                    default:
                        $el.val(value);
                        break;

                }
            });
        }
    });
}
*/
$vm.deserialize_s=function(record,form_id){
    if(record==undefined) return;
    $.each(record, function(name, value){
        if(name!=''){
            var $els = $(form_id+' *[name='+name+']');
            $els.each(function(){
                var $el=$(this);
                var type = $el.attr('type');
                switch(type){
                    case 'checkbox':
                        if(value=='off' || value=='0' || value=='' ) $el.prop('checked', false);
                        else $el.prop('checked', true);
                        break;
                    case 'radio':
                        if($el.attr('value')==value){
                             $el.prop('checked', true);
                        }
                        break;
                    case 'file':
                        break;
                    case 'text':
                    case 'email':
                    case 'textarea':
                    case 'select':
                        $el.val(value);
                        break;
                    case 'undefined':
                        break;
                    default:
                        $el.val(value);
                        break;

                }
            });
        }
    });
}
$vm.serialize=function(form_id){
    var data={};
    var a=$(form_id).serializeArray();
    $.each(a, function () { data[this.name]=this.value || '';});
    $(form_id+" input:checkbox:not(:checked)").each(function(){
		data[this.name]="off";
	})
    $(form_id+" input:file").each(function(){
        if(this.files.length==1){
            data[this.name]=this.files[0].name;
        }
	})
    return data;
}
$vm.serialize_file=function(form_id){
    var data={};
    $(form_id+" input:file").each(function(){
        if(this.files.length==1){
            data[this.name]=this.files[0].name+'|'+this.files[0].type;
        }
	})
    return data;
}
//---------------------------------------------
$vm.signin=function(){
	if($vm.api_type=="sqlserver"){
		$vm.signin_s();
		return;		
	}
	if($vm.user_name=='guest'){
		window.open($vm.api_address+"/signin.html","Sign In","width=600, height=700");
	}
}
//---------------------------------------------
$vm.adsignin=function(){
	if($vm.user_name=='guest'){
		window.open($vm.api_address+"/signinad.html","Sign In","width=600, height=700");
	}
}
//---------------------------------------------
$vm.signin_s=function(){
	if($vm.user=='guest'){
		window.open($VmAPI.api_base+"signin.html?url="+window.location.href,"Sign In","width=600, height=700");
	}
}
//---------------------------------------------
$vm.signout=function(){
	if($vm.api_type=="sqlserver"){
		$vm.signout_s();
		return;		
	}
	$vm.clear_token();
	sessionStorage["signinout"]=1;
	location.reload();
}
//---------------------------------------------
$vm.signout_s=function(){
	$VmAPI.clear_token();
	sessionStorage["signinout"]=1;
	location.reload(true);
	/*
	$VmAPI.request({data:{cmd:'signout'},callback:function(c){
		sessionStorage["signinout"]=1;
		location.reload(true);
	}});
	*/
}
//---------------------------------------------
//----------------------------------------------
$vm.show_json_data=function(D){
    var txt=JSON.stringify(D, null, '\t');
    txt=txt.replace(/\n/g,"<br>");
    txt=txt.replace(/\t/g,"&nbsp;&nbsp;&nbsp;&nbsp;");
    var win=window.open("","JSON data");
    win.document.body.innerHTML=txt+"<title>JSON data</title><style> body{ font-family:Courier New;font-size:12px; white-space: nowrap; } </style>";
}
//----------------------------------------------
$vm.source=function(module_id,event){
	if (event.altKey) {
		if($vm.vm[module_id].url!==undefined){
			var url='__COMPONENT__/c/code-viewer.01.html'
			var module_url=$vm.vm[module_id].url;
			if(module_url[0]=='/') module_url=$vm.hosting_path+module_url;
			else{
				if(module_url.substring(0,7)!='http://' && module_url.substring(0,8)!='https://'){
					module_url=$vm.hosting_path+"/"+module_url;
				}
			}
			$.get(module_url+'?'+new Date().getTime(), function(data){
				var nm=$vm.vm[module_id].name;
				if($vm.module_list[nm]!==undefined){
                    if($vm.module_list[nm].html_filter!=undefined){
                        data=$vm.module_list[nm].html_filter(data);
                    }
					if($vm.module_list["sys_code_viewer"]==undefined){
						$vm.module_list["sys_code_viewer"]={url:url}
					}
					var msg="No."+module_id.replace('_','')+",  Name:"+nm;
					if($vm.module_list[nm]['Table']!=undefined){
						msg+=",  Table:"+$vm.module_list[nm]['Table'];
                    }
                    msg+=",  Url:"+module_url
					$vm.load_module("sys_code_viewer",'',{code:data,msg:msg});
				}
			})
		}
    }
	else if (event.ctrlKey) {
    }
	else if(event.shiftKey){
	}
}
//----------------------------------------------
$vm.set_dropdown_list_from_text=function($List,text){
    var txt=$("<div></div>").html(text).text();
    txt=txt.replace(/\r/g,'\n');
    txt=txt.replace(/\n\n/g,'\n');
    txt=txt.replace(/\n/g,',');
    txt=txt.replace(/,,/g,',');
    var lines=txt.split(',');
    $List.html('');
    for(var i=0;i<lines.length;i++){
        var line=lines[i];
        var items=line.split(';');
        var sel='';
        if(items[0].length>0 && items[0]=='*'){
            items[0]=items[0].replace('*','');
            sel='selected';
        }
        if(items.length==2)	$List.append(  $('<option '+sel+'></option>').val(items[1]).html(items[0])  );
        else			    $List.append(  $('<option '+sel+'></option>').val(items[0]).html(items[0])  );
    }
}
//---------------------------------------------
$vm.vm_password=function(length, special) {
    var iteration = 0;
    var password = "";
    var randomNumber;
    if(special == undefined){
        var special = false;
    }
    while(iteration < length){
        randomNumber = (Math.floor((Math.random() * 100)) % 94) + 33;
        if(!special){
            if ((randomNumber >=33) && (randomNumber <=47)) { continue; }
            if ((randomNumber >=58) && (randomNumber <=64)) { continue; }
            if ((randomNumber >=91) && (randomNumber <=96)) { continue; }
            if ((randomNumber >=123) && (randomNumber <=126)) { continue; }
        }
        iteration++;
        password += String.fromCharCode(randomNumber);
    }
    return password;
}
//---------------------------------------------
$vm.autocomplete=function($input,req,autocomplete_list,callback){
    var field=$input.attr('data-id');
    $input.focus(function(){$input.autocomplete("search","");});
    return $input.autocomplete({
        minLength:0,
        source:function(request,response){
            req.search=request.term;
            $vm.request(req,function(res){
                if(res.sys.permission==false){
                    console.log("No permission");
                    return;
                }
                response(autocomplete_list(res.result));
            })
        },
        select: function(event,ui){
            if(callback!=undefined){
                callback(ui.item);
            }
        }
    })
}
//-------------------------------------
$vm.autocomplete_s=function($input,sql,autocomplete_list,callback){
    var field=$input.attr('data-id');
    $input.focus(function(){$input.autocomplete("search","");});
    return $input.autocomplete({
        minLength:0,
        source:function(request,response){
            $VmAPI.request({data:{cmd:'read',qid:$vm.qid,s1:request.term,sql:sql,minLength:0},callback:function(res){
                response(autocomplete_list(res.records));
            }});
        },
        select: function(event,ui){
            if(callback!=undefined){
                callback(ui.item);
            }
        }
    })
}
//-------------------------------------
$vm.status_of_data=function(data){
    var N1=0,N2=0;
    for(key in data){
        if(key!=""){
            N2++;
            if(data[key]=='') N1++;
        }
    }
    var status="#FFCC00";
    if(N1==N2) 		    status='#FF0000';
    else if(N1==0)  	status='#00FF00';
    return status;
}
//--------------------------------------------------------
$vm.text=function(txt){
	return $('<div></div>').html(txt).text();
}
//--------------------------------------------------------
$vm.invert_color=function(hex) {
    var padZero=function(str, len) {
        len = len || 2;
        var zeros = new Array(len).join('0');
        return (zeros + str).slice(-len);
    }
    var getRandomColor=function() {
        var color = Math.round(Math.random() * 0x1000000).toString(16);
        return "#" + padZero(color, 6);
    }
    if (hex.indexOf('#') === 0) {
        hex = hex.slice(1);
    }
    // convert 3-digit hex to 6-digits.
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) {
        throw new Error('Invalid HEX color.');
    }
    // invert color components
    var r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16),
        g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16),
        b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16);
    // pad each with zeros and return
    return "#" + padZero(r) + padZero(g) + padZero(b);
}
//--------------------------------------------------------
$vm.whire_or_black_color=function(color){
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
    var red=parseInt(result[1], 16);
    var green=parseInt(result[2], 16);
    var blue=parseInt(result[3], 16);
    var c='#ffffff';
    if ((red*0.299 + green*0.587 + blue*0.114) > 186 ) c='#000000';
    return c;
}
//--------------------------------------------------------
$vm.white_or_black_color=function(color){
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
    var red=parseInt(result[1], 16);
    var green=parseInt(result[2], 16);
    var blue=parseInt(result[3], 16);
    var c='#ffffff';
    if ((red*0.299 + green*0.587 + blue*0.114) > 186 ) c='#000000';
    return c;
}
//--------------------------------------------------------
$vm.download_csv=function(fn,data){
    var CSV='';
    var row="";
    var ids=[];
    for(var i=0;i<data.length;i++){
        if(i==0){
            for(k in data[i]){
                ids.push(k);
                if(row!="") row+=",";
                row+='"'+k+'"';
            }
            row+="\r\n";
            CSV+=row;
        }
        row="";
        for(j=0;j<ids.length;j++){
            if(j!==0) row+=",";
            var v="";
            var id=ids[j];
            if(data[i][id]!==undefined) v=data[i][id];
            if(v!=null) v=v.toString().replace(/"/g,''); //remove "  ???
            row+='"'+v+'"';
        }
        row+="\r\n";
        CSV+=row;
    }
    //-----------------------
    var bytes = [];
        bytes.push(239);
        bytes.push(187);
        bytes.push(191);
    for (var i = 0; i < CSV.length; i++) {
        if(CSV.charCodeAt(i)<128) {
            bytes.push(CSV.charCodeAt(i));
        }
        else if(CSV.charCodeAt(i)<2048) {
            bytes.push(( (CSV.charCodeAt(i) & 192) >> 6 ) + ((CSV.charCodeAt(i) & 1792)>>6 ) +192); //xC0>>6 + x700>>8 +xE0
            bytes.push(CSV.charCodeAt(i) & 63 + 128); //x3F + x80
        }
        else if(CSV.charCodeAt(i)<65536) {
            bytes.push(((CSV.charCodeAt(i) & 61440) >>12) + 224 ); //xF00>>12 + xE0
            bytes.push(( (CSV.charCodeAt(i) & 192) >> 6 ) + ((CSV.charCodeAt(i) & 3840)>>6 ) +128); //xC0>>6 + xF00>>8 +x80
            bytes.push(CSV.charCodeAt(i) & 63 + 128); //x3F + x80
        }
    }
    var u8 = new Uint8Array(bytes);
    var blob = new Blob([u8]);
    //-----------------------
    if (navigator.appVersion.toString().indexOf('.NET') > 0){
        window.navigator.msSaveBlob(blob, name);
    }
    else{
        var link = document.createElement("a");
        link.setAttribute("href", window.URL.createObjectURL(blob));
        link.setAttribute("download", name);
        link.style = "visibility:hidden";
        link.download = fn;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}
//---------------------------------------------
String.prototype.splitCSV = function(sep) {
    for (var foo = this.split(sep = sep || ","), x = foo.length - 1, tl; x >= 0; x--) {
      if (foo[x].replace(/"\s+$/, '"').charAt(foo[x].length - 1) == '"') {
        if ((tl = foo[x].replace(/^\s+"/, '"')).length > 1 && tl.charAt(0) == '"') {
          foo[x] = foo[x].replace(/^\s*"|"\s*$/g, '').replace(/""/g, '"');
        } else if (x) {
          foo.splice(x - 1, 2, [foo[x - 1], foo[x]].join(sep));
        } else foo = foo.shift().split(sep).concat(foo);
      } else foo[x].replace(/""/g, '"');
    } 
    return foo;
}
//---------------------------------------------
$vm.xmlToJson=function(xml) {
    // Create the return object
    var obj = {};
    if (xml.nodeType == 1) { // element
        // do attributes
        if (xml.attributes.length > 0) {
        obj["@attributes"] = {};
            for (var j = 0; j < xml.attributes.length; j++) {
                var attribute = xml.attributes.item(j);
                obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
            }
        }
    } else if (xml.nodeType == 3) { // text
        obj = xml.nodeValue;
    }

    // do children
    // If just one text node inside
    if (xml.hasChildNodes() && xml.childNodes.length === 1 && xml.childNodes[0].nodeType === 3) {
        obj = xml.childNodes[0].nodeValue;
    }
    else if (xml.hasChildNodes()) {
        for(var i = 0; i < xml.childNodes.length; i++) {
            var item = xml.childNodes.item(i);
            var nodeName = item.nodeName;
            if (typeof(obj[nodeName]) == "undefined") {
                obj[nodeName] = $vm.xmlToJson(item);
            } else {
                if (typeof(obj[nodeName].push) == "undefined") {
                    var old = obj[nodeName];
                    obj[nodeName] = [];
                    obj[nodeName].push(old);
                }
                obj[nodeName].push($vm.xmlToJson(item));
            }
        }
    }
    return obj;
}
//---------------------------------------------
$vm.tool_table_info=function(user,op){
    if(user==undefined) user=$vm.user_name;
    if(op==undefined) op="Find";
    var rt=[]
    var tables=[]
    for(a in $vm.module_list){
        if($vm.module_list[a].Table!=undefined && tables.indexOf($vm.module_list[a].Table)==-1){
            tables.push($vm.module_list[a].Table);
        }
    }
    var I=0;
    var from_server=function(){
        I++;
        if(I==tables.length){
            console.log(rt)
        }
    }
    var to_server=function(tb){
        $vm.request({cmd:'permission-check',data:{Table:tb,Operation:op,Login:user}},function(res){
            var z1="Yes"; if(res.sys.tb=='off') z1='No ';
            var z2="Yes"; if(res.sys.db=='0') z2='No ';
            var z3="Yes"; if(res.status=='np') z3='No ';
            rt.push("private-table: "+z1+", \t\tremote-db: "+z2+"\t\t"+op+": "+z3+"\t\t"+tb)
            from_server();
        });
    }
    var set_t=function(i){
        setTimeout(function(){  
            to_server(tables[i]);
        }, 100*i);
    }
    for(var i=0;i<tables.length;i++){
        set_t(i);
    }
}
//---------------------------------------------
$vm.sys_structure=function(){
    var txt="<html>\r\n\t<body>\r\n";
        txt+="\t\t<header>\r\n";
        $('#header >div').each(function(){
            var a=$(this).attr('id');
            var m=$(this).attr('module');
            var c="url:"+"@1span class=c1@2"+$vm.module_list[m].url+"@1/span@2";
            var tb=$vm.module_list[m].Table;
            if(tb!=undefined) c=c+", table:"+"@1span class=c2@2"+tb+"@1/span@2";
            txt+="\t\t\t<div id="+a+" module=@1span class=c@2"+m+"@1/span@2>"+c+"</div>\r\n";
        })
        txt+="\t\t</header>\r\n";
        txt+="\t\t<content>\r\n";
            $('#content >div').each(function(){
            var a=$(this).attr('id');
            var m=$(this).attr('module');
            var c="url:"+"@1span class=c1@2"+$vm.module_list[m].url+"@1/span@2";
            var tb=$vm.module_list[m].Table;
            if(tb!=undefined) c=c+", table:"+"@1span class=c2@2"+tb+"@1/span@2";
            txt+="\t\t\t<div id="+a+" module=@1span class=c@2"+m+"@1/span@2>"+c+"</div>\r\n";
        })
        txt+="\t\t</content>\r\n";
        txt+="\t\t<footer>\r\n";
            $('#footer >div').each(function(){
            var a=$(this).attr('id');
            var m=$(this).attr('module');
            var c="url:"+"@1span class=c1@2"+$vm.module_list[m].url+"@1/span@2";
            var tb=$vm.module_list[m].Table;
            if(tb!=undefined) c=c+", table:"+"@1span class=c2@2"+tb+"@1/span@2";
            txt+="\t\t\t<div id="+a+" module=@1span class=c@2"+m+"@1/span@2>"+c+"</div>\r\n";
        })
        txt+="\t\t</footer>\r\n";
        txt+="\t\t<system>\r\n";
            $('#system >div').each(function(){
            var a=$(this).attr('id');
            var m=$(this).attr('module');
            var c="url:"+"@1span class=c1@2"+$vm.module_list[m].url+"@1/span@2";
            var tb=$vm.module_list[m].Table;
            if(tb!=undefined) c=c+", table:"+"@1span class=c2@2"+tb+"@1/span@2";
            txt+="\t\t\t<div id="+a+" module=@1span class=c@2"+m+"@1/span@2>"+c+"</div>\r\n";
        })
        txt+="\t\t</system>\r\n";
        txt+="\t</body>\r\n</html>";
        txt=txt.replace(/</g,'&lt;');
        txt=txt.replace(/>/g,'&gt;');
        txt=txt.replace(/@1/g,'<');
        txt=txt.replace(/@2/g,'>');
    var win=window.open("","Systsm Infomation");
    win.document.body.innerHTML="<pre>"+txt+"</pre><title>System Infomation</title><style> .c{color:red;} .c1{color:blue;} .c2{color:green;} body{ font-family:Courier New;font-size:12px; white-space: nowrap; } </style>";
}
//---------------------------------------------
$vm.sys_settings=function(){
    var path=window.location.href.split('?')[0].replace('/index.html','')
    var sites=window.location.href.indexOf('/sites/');
    localStorage.setItem("__temp1001_"+path,JSON.stringify($vm.module_list));
    if(sites==-1) window.open('/057/index.html?path='+path);
    else window.open(window.location.href.split('/sites/')[0]+'/sites/057/index.html?path='+path);
}
//---------------------------------------------
$vm.getB64Str=function(buffer) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}
//---------------------------------------------
$vm.alert=function(txt){ alert(txt); }
//--------------------------------------------------------
$vm.load_resource=function(link,callback){
    var nm=link.split('/').pop();
    nm=nm.replace(/\./g,'-');
    if($vm[nm]==1){
        callback(link);
    }
    else{
        var e=link.split('.').pop();
        if(e=='css'){
            $('head').append("<link rel='stylesheet' href='"+link+"'>");
            if(callback!=undefined) callback(link);
        }
        else if(e=='js'){
            $vm.load_js_link(link,callback);
        }
    }
}
//------------------------------------
$vm.load_js_link=function(link,callback){
    $.ajaxSetup({cache:true});
    $.getScript(link,function(data, textStatus, jqxhr){
        var nm=link.split('/').pop();
        nm=nm.replace(/\./g,'-');
        $vm[nm]=1;
        if(callback!=undefined) callback(link);
        if(nm=='loader-js'){
            google.charts.load('current', {packages: ['corechart']});
        }
    });
}
//------------------------------------
$vm.responsive=function(a){
    var dw=a[0].contentRect.width;
    var id=a[0].target.id;
    var bp=document.getElementById(id).getAttribute("bp"); 
    if(bp==null) return;
    var bps=bp.split('|');
    var n0=10000000; if(bps.length>0) n0=parseInt(bps[0]);
    var n1=20000000; if(bps.length>1) n1=parseInt(bps[1]);
    var n2=30000000; if(bps.length>2) n2=parseInt(bps[2]);
    var n3=40000000; if(bps.length>3) n3=parseInt(bps[3]);

    var divs = document.getElementById(id).getElementsByTagName('div');
    for( i=0; i< divs.length; i++ ){
        var vmw=divs[i].getAttribute("w");
        if(vmw!=null){
            divs[i].style['float']='left';
            divs[i].style['box-sizing']='border-box';
            divs[i].parentElement.style['border-width']=0;
            divs[i].parentElement.style['box-sizing']='border-box';
            divs[i].parentElement.style['display']="flow-root";
            var ws=vmw.split('|');
            var pw=parseFloat(getComputedStyle(divs[i].parentElement, null).getPropertyValue('width').replace('.px',''));
            var LR1=parseFloat(getComputedStyle(divs[i].parentElement, null).getPropertyValue('padding-left').replace('.px',''))+
                    parseFloat(getComputedStyle(divs[i].parentElement, null).getPropertyValue('padding-right').replace('.px',''))+
                    parseFloat(getComputedStyle(divs[i].parentElement, null).getPropertyValue('border-left-width').replace('.px',''))+
                    parseFloat(getComputedStyle(divs[i].parentElement, null).getPropertyValue('border-right-width').replace('.px',''));
            pw=pw-LR1;
            
            var nw0=576; if(ws.length>0) nw0=(pw*ws[0]/100);
            var nw1=nw0; if(ws.length>1) nw1=(pw*ws[1]/100);
            var nw2=nw1; if(ws.length>2) nw2=(pw*ws[2]/100);
            var nw3=nw2; if(ws.length>3) nw3=(pw*ws[3]/100);
            var nw4=nw3; if(ws.length>4) nw4=(pw*ws[4]/100);

            var nw=0;
            if(dw<n0)           nw=nw0;
            if(dw>=n0 && dw<n1) nw=nw1
            if(dw>=n1 && dw<n2) nw=nw2
            if(dw>=n2 && dw<n3) nw=nw3;
            if(dw>=n3)          nw=nw4;
            divs[i].style.width=nw+"px"; 
        }
    }                    
}
//------------------------------------
$vm.contenteditable_filter=function(c){
    if(c!=undefined){
        c=c.replace(/<div>/g,'@#@%1');
        c=c.replace(/<\/div>/g,'@#@%2');
        c=c.replace(/<img/g,'@#@%3');
        c=$vm.text(c);
        c=c.replace(/@#@%1/g,'<div>');
        c=c.replace(/@#@%2/g,'</div>');
        c=c.replace(/@#@%3/g,'<img');
        return c;
    }
    else return "undefined";
}
$vm.onpaste=function(e){
    var items = e.clipboardData.items;
    if(items != undefined){
        for (var i = 0; i < items.length; i++) {
            if (items[i].type.indexOf("image") != -1){
                break;
            }
            else if(items[i].type.indexOf("text/plain") != -1 || items[i].type.indexOf("text/html") != -1){
                e.stopPropagation();
                e.preventDefault();
                var txt=e.clipboardData.getData("Text");
                var sel, range;
                if (window.getSelection) {
                    sel = window.getSelection();
                    if (sel.getRangeAt && sel.rangeCount) {
                        range = sel.getRangeAt(0);
                        range.deleteContents();
                        range.insertNode( document.createTextNode(txt) );
                    }
                } else if (document.selection && document.selection.createRange) {
                    document.selection.createRange().text = txt;
                }
                break;
            }
            else{
                e.stopPropagation();
                e.preventDefault();
            }
        }
    };
}
//---------------------------------------
$vm.vmpost=function (url,data,callback){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (this.readyState == 4){
            callback(this.status);
        } 
        else if (this.status == 404) {
            callback(404);
        }
    }
    xmlHttp.open("POST", url, true); // true for asynchronous
    xmlHttp.setRequestHeader("Content-Type", "application/json");
    xmlHttp.send(JSON.stringify(data));
}
//---------------------------------------
$vm.jwt_decode=function(token){
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
};
//-----------------------------------------------------------------
$vm.json_to_table=function(jdata,table_id){
    var txt="";
    var J=jdata[0].length;
    for(var i=0;i<jdata.length;i++){
        txt+="<tr>"
        if(i==0) txt+="<th></th>";
        else txt+="<td>"+i+"</td>"
        for(var j=0;j<J;j++){
            if(i==0) txt+="<th>"+jdata[i][j]+"</th>";
            else{
                var c="";
                if(j<jdata[i].length) c=jdata[i][j];
                if(c==undefined) c="";
                txt+="<td>"+c+"</td>";
            }
        }
        txt+="</tr>";
    }
    return txt
}
//-------------------------------
$vm.get_file=function(api,table,UID,field,filename,callback){
    var get_file_from_server=function(){
        $vm.request({api:api,cmd:"file2",table:table,uid:UID,field:field,filename:filename},function(res, status, xhr){
            if(res.status=='np') alert("No permissaion.");
            else if(res.status=='err') alert("Error code: "+res.result);
            if('caches' in window){
                caches.open('VM').then(cache => {
                    var aHeaders = new Headers();
                    aHeaders.append('last-modifie',xhr.getResponseHeader('last-modified'));
                    var rs=new Response(res, { "headers" :aHeaders} );
                    cache.put(table+"-"+UID+"-"+field,rs);
                    return;
                })
            }
            callback(res);
        });
    }
    var get_file_from_cache=function(){
        if('caches' in window){
            caches.open('VM').then(
                cache => {
                    cache.match(table+"-"+UID+"-"+field).then(response => {
                        if(response){
                            $vm.request({cmd:"file2",table:table,uid:UID,field:field,filename:filename,datetime:1},function(res){
                                if(res.status=="np"){
                                    alert("No permissaion.");
                                    return;
                                };
                                var dtA=new Date(response.headers.get('last-modifie')).getTime();
                                var dtB=new Date(res.result).getTime();
                                dtA=dtA-dtA%1000;
                                dtB=dtB-dtB%1000;
                                if(dtA==dtB){
                                    callback(response.result);
                                    console.log(response)
                                }
                                else get_file_from_server();
                            })
                        }
                        else{
                            get_file_from_server();
                        }
                    })
                }
            )
        }
    }
    get_file_from_cache();
}
//-------------------------------
$vm.download_txt=function(fn,txt){
    //-----------------------
    var bytes = [];
        bytes.push(239);
        bytes.push(187);
        bytes.push(191);
    for (var i = 0; i < txt.length; i++) {
        if(txt.charCodeAt(i)<128) {
            bytes.push(txt.charCodeAt(i));
        }
        else if(txt.charCodeAt(i)<2048) {
            bytes.push(( (txt.charCodeAt(i) & 192) >> 6 ) + ((txt.charCodeAt(i) & 1792)>>6 ) +192); //xC0>>6 + x700>>8 +xE0
            bytes.push(txt.charCodeAt(i) & 63 + 128); //x3F + x80
        }
        else if(txt.charCodeAt(i)<65536) {
            bytes.push(((txt.charCodeAt(i) & 61440) >>12) + 224 ); //xF00>>12 + xE0
            bytes.push(( (txt.charCodeAt(i) & 192) >> 6 ) + ((txt.charCodeAt(i) & 3840)>>6 ) +128); //xC0>>6 + xF00>>8 +x80
            bytes.push(txt.charCodeAt(i) & 63 + 128); //x3F + x80
        }
    }
    var u8 = new Uint8Array(bytes);
    var blob = new Blob([u8]);
    //-----------------------
    if (navigator.appVersion.toString().indexOf('.NET') > 0){
        window.navigator.msSaveBlob(blob, fn);
    }
    else{
        var link = document.createElement("a");
        link.setAttribute("href", window.URL.createObjectURL(blob));
        link.setAttribute("download", fn);
        link.style = "visibility:hidden";
        link.download = fn;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}
//---------------------------------------------
