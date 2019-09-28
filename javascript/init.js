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
