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
