//-------------------------------------
var m=$vm.module_list['__MODULE__'];
m.rid=undefined;
//-------------------------------------
m.load=function(){
    m.input=$vm.vm['__ID'].input; if(m.input==undefined) m.input={};
    $('#F__ID')[0].reset();
    $('#submit__ID').show();
    $vm.request({cmd:"find-setup"},function(res){
        if(res.records.length!=0){
            $vm.deserialize(res.records[0],'#F__ID');
            m.rid=res.records[0]._id;
        }
    })
}
//-------------------------------
m.submit=function(event){
    //--------------------------------------------------------
    event.preventDefault();
    $('#submit__ID').hide();
    //--------------------------------------------------------
    var data=$vm.serialize('#F__ID');
    var file=$vm.serialize_file('#F__ID');
    var dbv={}
    var r=true;
    if(m.before_submit!=undefined) r=m.before_submit(data,dbv);
    if(r==false){$('#submit__ID').show(); return;}
    //--------------------------------------------------------
    if(m.rid==undefined){
        $vm.request({cmd:"insert-setup",data:data},function(res){
            window.history.go(-1);
        });
    }
    else if(m.rid!=undefined){
        $vm.request({cmd:"update-setup",id:m.rid,data:data},function(res){
            window.history.go(-1);
        });
    }
}
//--------------------------------------------------------
$('#D__ID').on('load',function(){ m.load();})
$('#F__ID').submit(function(event){m.submit(event);})
//--------------------------------------------------------
