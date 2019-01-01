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
    
    var param={
        headers:{'Authorization':'Bearer ' + token},
        type: "POST",
        url: $vm.api_address,
        contentType: "application/json",
        charset:"utf-8",
        dataType: "json",
        error: function(jqXHR,error, errorThrown){ if(jqXHR.status) {/*alert(jqXHR.responseText);*/} else {alert("Something went wrong");}},
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
