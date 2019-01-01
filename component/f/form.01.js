//-------------------------------------
var m=$vm.module_list['__MODULE__'];
//-------------------------------------
m.load=function(){
    $('#D__ID').scrollTop(0);
    $(window).scrollTop(0);
    $('#F__ID')[0].reset();
    $('#submit__ID').show();
    $('#delete__ID').hide(); if(m.input.record!=undefined && m.input.record._id!==undefined) $('#delete__ID').show();
    $vm.deserialize(m.input.record,'#F__ID');
}
//-------------------------------
m.set_file_link=function(tag){
    $('#link_'+tag+'__ID').html("");
    $('#x_'+tag+'__ID').hide();
    var record=m.input.record;
    if(record==undefined) return;
    var filename=record.Data[tag];
    if(filename==undefined){
        filename="";
    }
    else{
        $('#x_'+tag+'__ID').show();
    }
    $('#link_'+tag+'__ID').html(filename);
    var url=record.App+"/"+record.Table+"/"+record.UID+"-"+tag+"-"+filename;
    $('#link_'+tag+'__ID').on('click',function(){
        if(record._id!==undefined){
            if(filename!="") $vm.open_s3_url(filename,url);
        }
        else alert("No file was found on server.")
    });
    $('#x_'+tag+'__ID').on('click',function(){
        $('#link_'+tag+'__ID').html('');
        $('#x_'+tag+'__ID').hide();
        record.Data[tag]="";
    })
}
//-------------------------------
m.submit=function(event){
    //--------------------------------------------------------
    event.preventDefault();
    $('#submit__ID').hide();
    //--------------------------------------------------------
    var data={};
    var index={};
    var data_new=$vm.serialize('#F__ID');
    if(m.input.record!=undefined){
        for(k in m.input.record.Data){
            data[k]=m.input.record.Data[k];
        }
    }
    if(data_new!=undefined){
        for(k in data_new){
            data[k]=data_new[k];
        }
    }
    delete data[""];
    var file=$vm.serialize_file('#F__ID');
    var FN=0; $('#F__ID').find('input[type=file]').each(function(evt){ if(this.files.length==1) FN++; });
    var r=true;
    if(m.before_submit!=undefined) r=m.before_submit(data,index);
    if(r==false){$('#submit__ID').show(); return;}
    //--------------------------------------------------------
    var table={App:m.App,Table:m.Table}
    var rid=undefined; if(m.input.record!=undefined) rid=m.input.record._id;
    if(rid==undefined){
        var record={Data:data,File:file}
        $vm.request({cmd:"insert",table:table,data:data,index:index,file:file},function(res){
            if(res.permission==false){
                alert("No permission to insert a new record in to the database.");
                if(m.input.goback!=undefined){
                    $vm.refresh=1;
                    window.history.go(-1);       //from grid
                }
                return;
            }
            var after_submit=function(){
                if(m.after_insert!=undefined){
                    m.after_insert(record,res); return;
                }
                $vm.refresh=1;
                if(m.input.goback!=undefined) window.history.go(-1);       //from grid
                else $vm.alert('Your data has been successfully submitted');    //standalone
            }
            if(FN==0) after_submit();
            else{
                open_model__ID();
                $vm.upload_form_files(res,$('#F__ID'),"msg__ID",function(){
                    close_model__ID();
                    after_submit();
                })
            }
            //-----------------------------
        });
    }
    else if(rid!=undefined){
        var record={_id:rid,Data:data,File:file}
        $vm.request({cmd:"update",id:rid,table:table,data:data,index:index,file:file},function(res){
            //-----------------------------
            if(res.permission==false){
                alert("No permission to update this record.");
                return;
            }
            //-----------------------------
            var after_submit=function(){
                if(m.after_update!=undefined){
                    m.after_modify(record,res); return;
                }
                $vm.refresh=1;
                if(rid!=undefined) window.history.go(-1);                       //modify
            }
            //-----------------------------
            if(FN==0) after_submit();
            else{
                open_model__ID();
                $vm.upload_form_files(res,$('#F__ID'),"msg__ID",function(){
                    close_model__ID();
                    after_submit();
                })
            }
            //-----------------------------
        });
    }
}
//--------------------------------------------------------
$('#D__ID').on('load',function(){ m.load();})
$('#F__ID').submit(function(event){m.submit(event);})
//--------------------------------------------------------
$('#delete__ID').on('click', function(){
    var record=m.input.record;
    if(record==undefined) return;
    var rid=record._id;
    if(rid==undefined){
        return;
    }
    if(confirm("Are you sure to delete?\n")){
        var req={cmd:"delete",qid:m.qid,db_pid:m.db_pid,rid:rid,dbv:{}};
        $VmAPI.request({data:req,callback:function(res){
            //-------------------------------
            if(res.Error!==undefined) return false;
            if(res.ret=='NULL'){
                if(res.msg!==undefined) alert(res.msg);
                else alert("No permission!");
                return false;
            }
            //-------------------------------
            if(m.after_delete!==undefined)  m.after_delete(res);
            //-------------------------------
            $vm.refresh=1;
            window.history.go(-1);
        }});
    }
})
//-------------------------------------
$('#header__ID').on('click', function(event){
    if(event.ctrlKey){
        var x=document.getElementById("F__ID");
        var txt="";var nm0="";
        for (var i=0; i < x.length; i++) {
            var nm=x.elements[i].getAttribute("name");
            if(nm!=null && nm!=nm0){ if(txt!="") txt+=", "; txt+=nm; nm0=nm;}
        }
        //$vm.alert(txt);
        console.log(txt);
    }
});
//--------------------------------------------------------
