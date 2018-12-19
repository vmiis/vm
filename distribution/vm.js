window.onpopstate=function(event) {
    //new ==========================================
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
        if(top!=undefined){
			$('#D'+top.ID).css('display','none');
			$('#D'+top.ID).triggerHandler('hide');
		}
        if($vm.page_stack.length==0){
            window.history.back(-1);
        }
        else{
            var L=$vm.page_stack.length;
            var top=$vm.page_stack[L-1];
            $('#D'+top.ID).css('display','block');
			$('#D'+top.ID).triggerHandler('show');
			//if($vm.change_meta!=undefined){ $vm.change_meta(top.ID); }
			if($vm.show!=undefined){ $vm.show(top.ID); }
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
		//if($vm.change_meta!=undefined){ $vm.change_meta(event.state.ID); }
		if($vm.show!=undefined){ $vm.show(event.state.ID); }
    }
    console.log($vm.page_stack);
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
//-----------------------------------------------------------------
$vm.init=function(callback){
    $vm.user_name="guest";
    $vm.user_id="-";
    $vm.user_ip="0";
    $vm.sys_N=0;
    $vm.request({cmd:'user-info'},function(res){
        $vm.user_name=res.records[0].user_name;
        if(callback!==undefined) callback(res);
    })
}
//-----------------------------------------------------------------
//-----------------------------------------------------------------
$vm._id=-1;
$vm.id=function(txt){
	$vm._id++;
	return "_"+$vm._id.toString();
}
//------------------------------------------------------------------
_g_current_path='';
$vm.load_module=function(name,slot,input){
    if(name==undefined) return;
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
	var m_name=name;
	var module_id	=id;
	if(url[0]=='/') url=$vm.hosting_path+url;
	var last_part=url.split('/').pop();
    _g_current_path=url.replace(last_part,'');
	if($('#D'+module_id).length===0){
		$vm.vm[module_id]={};
	}
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
					$vm.insert_and_trigger_load(module_id,slot);
				}
				else{
					$vm.process_first_include(current_all,module_id,slot,url,m_name);
				}
			}).fail(function() {
			    alert( "The file '"+url+"' doesn't exist!" );
			});
		}
		else{
			console.log('loading from stotage. '+url+" "+ver+"/"+$vm.ver[0]+" 127:"+http127_i+" re:"+$vm.reload)
			var current_all=txt;
			if(current_all.indexOf('VmInclude:')==-1){
				$vm.create_module_and_run_code(current_all,module_id,url,slot,m_name);
				$vm.insert_and_trigger_load(module_id,slot);
			}
			else{
				$vm.process_first_include(current_all,module_id,slot,url,m_name);
			}
		}
	}
	else $vm.insert_and_trigger_load(module_id,slot);
};
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
	content=content.replace(/<!--([\s\S]*?)-->/mig, '');
	//-----------------
	if(slot!='body'){
		content="<div id=D"+module_id+" module='"+m_name+"' class=vm_module style='display:none'><!--"+url+"-->"+content+"</div>"
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
	if($vm.vm_module_border!==undefined){
		$('div.vm_module').css("border","1px solid red");
	}
	//-------------------------------------
}
//-----------------------------------
$vm.insert_and_trigger_load=function(module_id,slot){
	if(slot!="body"){
		$vm.insert_module({module_id:module_id,slot:slot});
		$('#D'+module_id).triggerHandler('load');
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
    $vm.page_stack_index++;
    $vm.page_stack.push({ID:module_id,slot:slot,index:$vm.page_stack_index});
	var pp=null;
	if($vm.vm_router!=undefined){
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
    window.history.pushState({ID:module_id,slot:slot,index:$vm.page_stack_index}, null, pp);
	//if($vm.change_meta!=undefined){ $vm.change_meta(module_id); }
	if($vm.show!=undefined){ $vm.show(module_id); }
    console.log($vm.page_stack)
    //=====================================
    return;
};
//------------------------------------
/*
$vm.show_module=function(module_id,slot,op){
	if($vm.vm[module_id].op!=undefined && op!=undefined){
		for (var a in op){
			$vm.vm[module_id].op[a]=op[a];
		};
	}
	$vm.insert_module({module_id:module_id,slot:slot});
	$('#D'+module_id).triggerHandler('load');
}
*/
//-----------------------------------
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
	var name=lines[i].replace('VmInclude:','').trim();
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
	if(ver!=$vm.version || http127_i==1 || txt==null || $vm.reload!=''){
		//var new_url=url+'?_v='+($vm.version+$vm.reload).replace(/\./,'')+"&g="+_g_vm_chrom_loop++;
		var new_url=url+'?_v='+new Date().getTime();
		if(url.indexOf('?')!==-1) new_url=url+'&_v='+($vm.version+$vm.reload).replace(/\./,'')+"&g="+_g_vm_chrom_loop++;
		console.log('loading from url. '+new_url+" "+ver+"/"+$vm.version+" 127:"+http127_i+" re:"+$vm.reload)
		$.get(new_url, function(data){
			var c_m=$("<p>"+data+"</p>").filter('#D__ID').html();
			if(c_m!=undefined && c_m!='' && c_n!=null){ data=c_m;}
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
			localStorage.setItem(apppath+url+"_ver",$vm.version);
			var current_all=$vm.replace_and_recreate_content(lines,i,data)
			if(current_all.indexOf('VmInclude:')==-1){
				$vm.create_module_and_run_code(current_all,module_id,url_0,slot,m_name);
				$vm.insert_and_trigger_load(module_id,slot);
			}
			else{
				$vm.process_first_include(current_all,module_id,slot,url_0,m_name);
			}
		},'text');

	}
	else{
		console.log('loading from stotage. '+url+" "+ver+"/"+$vm.version+" 127:"+http127_i+" re:"+$vm.reload)
		var current_all=$vm.replace_and_recreate_content(lines,i,txt)
		if(current_all.indexOf('VmInclude:')==-1){
			$vm.create_module_and_run_code(current_all,module_id,url_0,slot,m_name);
			$vm.insert_and_trigger_load(module_id,slot);
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
//-----------------------------------------------------------------
$vm.request=function(req,callback){
    $vm.sys_N++;
    $vm.sys_token="guest|where|when|scode";
    if($vm.debug_message===true){
        console.log(' ');
        console.log(req.cmd+'('+$vm.sys_N+') TO ');
        console.dir(req);
    }
    var dt1=new Date().getTime();
    $vm.ajax_server_error=0;
    var token=sessionStorage.getItem("vm_token");
    if(token==undefined) token="";
    $.ajax({
        headers:{'Authorization':'Bearer ' + token},
        type: "POST",
        url: $vm.api_address,
        contentType: "application/json",
        charset:"utf-8",
        dataType: "json",
        error: function(jqXHR,error, errorThrown){ if(jqXHR.status) {alert(jqXHR.responseText);} else {alert("Something went wrong");}},
        data: JSON.stringify(req),
        success: function(c,textStatus, request){
            var dt2=new Date().getTime();
            if($vm.debug_message===true){
                console.log(' ');
                console.log(req.cmd+'('+$vm.sys_N+') FROM '+" --- "+(dt2-dt1).toString()+"ms");
                console.dir(c);
            }
            if($vm.ajax_server_error==1) return;
            try{
                if(callback!==undefined) callback(c);
            }catch(err){
                alert(err.toString());
            }
        },
        dataFilter: $vm.request_filter,
    })
};
//-----------------------------------------------------------------
$vm.request_filter=function(c){
    var a=$.parseJSON(c);
    if(a.Error!=undefined){
        alert(a.Error);
        $vm.ajax_server_error=1;
    }
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
$vm.open_s3_url=function(filename,url){
    $vm.request({cmd:"s3_download_url",filename:filename,url:url},function(res){
        var link = document.createElement("a");
        link.href = res.url;
        link.style = "visibility:hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
}
//---------------------------------------------
//--------------------------------------------------------
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
	if($vm.user_name=='guest'){
		window.open($vm.api_address+"/signin.html","Sign In","width=600, height=700");
	}
}
//---------------------------------------------
$vm.signout=function(){
	$vm.clear_token();
	sessionStorage["signinout"]=1;
	location.reload(true);
}
//---------------------------------------------
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
					var msg='module name: '+nm+', App: '+$vm.module_list[nm]['App']+', Table: '+$vm.module_list[nm]['Table'];
					if($vm.module_list["sys_code_viewer"]==undefined){
						$vm.module_list["sys_code_viewer"]={url:url}
					}
					$vm.load_module("sys_code_viewer",'',{code:data,name:msg,url:module_url});
				}
			})
		}
    }
	else if (event.ctrlKey) {
    }
	else if(event.shiftKey){
	}
}
