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
    $.ajax({
        headers:{'Authorization':'Bearer ' + $vm.sys_token},
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
