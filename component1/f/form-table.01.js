//-------------------------------------
var m=$vm.module_list['__MODULE__'];
//-------------------------------------
m.load=function(){
    m.input=$vm.vm['__ID'].input; if(m.input==undefined) m.input={};
    $('#F__ID')[0].reset();
    $('#submit__ID').show();
    var grid_record=m.input.record;
    $('#delete__ID').hide(); if(grid_record!=undefined && grid_record._id!==undefined) $('#delete__ID').show();
    $vm.deserialize(grid_record,'#F__ID');
}
//-------------------------------
m.submit=function(event){
    //--------------------------------------------------------
    event.preventDefault();
    $('#submit__ID').hide();
    //--------------------------------------------------------
    var data=$vm.serialize('#F__ID');
    var dbv={}
    var r=true;
    if(m.before_submit!=undefined) r=m.before_submit(data,dbv);
    if(r==false){$('#submit__ID').show(); return;}
    //--------------------------------------------------------
    var rid=undefined; if(m.input.record!=undefined) rid=m.input.record._id;
    if(rid==undefined){
        $vm.request({cmd:"insert-table",data:data},function(res){
            if(res.ok==-1){
                alert("The table is existed.");
                $('#submit__ID').show();
                return;
            }
            $vm.refresh=1;
            window.history.go(-1);
        });
    }
    else if(rid!=undefined){
        $vm.request({cmd:"update-table",id:rid,data:data},function(res){
            if(res.ok==-1){
                alert("The table is existed.");
                $('#submit__ID').show();
                return;
            }
            $vm.refresh=1;
            window.history.go(-1);
        });
    }
}
//--------------------------------------------------------
$('#D__ID').on('load',function(){ m.load();})
$('#F__ID').submit(function(event){m.submit(event);})
//--------------------------------------------------------
