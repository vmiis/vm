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
