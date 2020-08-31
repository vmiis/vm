//-------------------------------------
var m=$vm.module_list['__MODULE__'];
m.google=0;
m.query={};
m.sort={_id:-1}
m.projection={}
//-------------------------------------
m.set_req=function(){
};
//-------------------------------------
m.set_req_export=function(i1,i2){
    var sql="with tb as (select Information,DateTime,Author,RowNum=row_number() over (order by ID DESC) from [TABLE-"+m.db_pid+"-@S1] )";
    sql+="select Information,DateTime,Author from tb where RowNum between @I1 and @I2";
	m.req={cmd:'read',qid:m.qid,sql:sql,i1:i1,i2:i2};
}
//-----------------------------------------------
m.request_data=function(){
    if(m.input!=undefined && m.input.silence==1){
        return;
    }
    var mt1=new Date().getTime();
    var f_cmd="find";
    if(m.cmd_type=='s') f_cmd='find-s';
    else if(m.cmd_type=='p1') f_cmd='find-p1';
    else if(m.cmd_type=='p2') f_cmd='find-p2';
    $vm.request({cmd:f_cmd,table:m.Table,query:m.query,sort:m.sort,projection:m.projection},function(res){
        var mt2=new Date().getTime();
        var tt_all=mt2-mt1;
        var tt_server=parseInt(res.sys.elapsed_time);
        if(tt_all<tt_server) tt_all=tt_server;
        var db="<span style='color:#0919ec'>&#9679;</span> "; if(res.sys.db==1 || res.sys.db=='on') db="<span style='color:#0bbe0b'>&#9679;</span> ";
        var tb="<span style='color:red'>&#9679;</span> ";     if(res.sys.tb==1 || res.sys.tb=='on') tb="<span style='color:#0bbe0b'>&#9679;</span> ";
        $("#elapsed__ID").html(db+tb+(JSON.stringify(res.result).length/1000).toFixed(1)+"kb/"+tt_all.toString()+"ms/"+tt_server+'ms');
        
        if(res.status=='np' || res.result==undefined){
            res.result=[];
        }

        if(res.status=='np'){
            if(res.sys.tb=='on') $vm.alert("No permission. Private database table, ask the table's owner for permissions.");
            else $vm.alert("No permission.");
        }

        m.records=res.result;
        m.res=res;
        if(m.data_process!==undefined){ m.data_process(); }
    })
};
//-------------------------------------
$('#query__ID').on('click',function(){    m.set_req(); m.request_data(); })
$('#D__ID').on('load',function(){  /*m.input=$vm.vm['__ID'].input;*/ if(m.preload==true) return; if(m.load!=undefined) m.load(); m.set_req(); m.request_data(); })
$('#D__ID').on('show',function(){  if($vm.refresh==1){$vm.refresh=0; m.set_req(); m.request_data();} })
//-------------------------------------
m.start=function(){
    if(m.google==0){
        m.google=1;
        m.set_req(); m.request_data();
    }
}
//-------------------------------------
m.I=0;
m.loop__ID=setInterval(function (){
    if($vm['loader-js']!=undefined){
        clearInterval(m.loop__ID); m.start();
    }
    m.I++; if(m.I>50){
        clearInterval(m.loop__ID); alert("Google loader.js is not installed.");
    }
},100);
//-------------------------------------
