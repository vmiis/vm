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
		alert(a.Error);
		$VmAPI.ajax_server_error=1;
		if(typeof($VmAPI.submit_div)!=='undefined' && $VmAPI.submit_div!=""){
   			$('#D'+$VmAPI.submit_div).triggerHandler('submit_failed');
		}
	}
	return c;
}
//-----------------------------------------------------------------
