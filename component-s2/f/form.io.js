//-------------------------------------
var m=$vm.module_list['__MODULE__'];
//-------------------------------------
m.load=function(){
    $('#D__ID').scrollTop(0);
    $(window).scrollTop(0);
}
m.submit=function(data,index){
    var file=undefined;
    var rid=undefined; if(m.input.record!=undefined) rid=m.input.record._id;
    if(rid==undefined){
        $vm.request({cmd:"insert",table:m.Table,data:data,index:index,file:file},function(res){
            if(res.status=="np"){
                alert("No permission to insert a new record in to the database.");
                if(m.input.goback!=undefined){
                    $vm.refresh=1;
                    window.history.go(-1);       //from grid
                }
                return;
            }
            var after_submit=function(){
                if(m.after_insert!=undefined){
                    m.after_insert(data,res); return;
                }
                $vm.refresh=1;
                if(m.input.goback!=undefined) window.history.go(-1);            //from grid
                else $vm.alert('Your data has been successfully submitted');    //standalone
            }
            after_submit();
            //-----------------------------
        });
    }
    else if(rid!=undefined){
        var cmd="update";
        if(m.cmd_type=='p1') cmd='update-p1';
        if(m.cmd_type=='p2') cmd='update-p2';
        $vm.request({cmd:cmd,id:rid,table:m.Table,data:data,index:index,file:{}},function(res){
            //-----------------------------
            if(res.status=="lk"){
                $vm.alert("This record is locked.");
                return;
            }
            //-----------------------------
            if(res.status=="np"){
                alert("No permission to update this record.");
                return;
            }
            //-----------------------------
            var after_submit=function(){
                if(m.after_update!=undefined){
                    m.after_update(data,res); return;
                }
                $vm.refresh=1;
                if(rid!=undefined) window.history.go(-1);                       //modify
            }
            //-----------------------------
            after_submit();
            //-----------------------------
        });
    }
}
//--------------------------------------------------------
$('#D__ID').on('load',function(){ m.load();})
//--------------------------------------------------------
