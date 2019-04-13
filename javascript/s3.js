//--------------------------------------------------------
$vm.upload_form_files=function(res,$form,msg_id,callback){
    //--------------------------------------------------------
    var total_num=0;
    $form.find('input[type=file]').each(function(evt){
        if(this.files.length===1){
            total_num++;
        }
    });
    if(total_num!=0){
        $form.find('input[type=file]').each(function(evt){
            if(this.files.length===1){
                var name=this.name;
                var s3_upload_url=res.aws[name];
                $vm.uploading_file(s3_upload_url,this.files[0],msg_id,function(){
                    total_num--;
                    if(total_num==0){
                        callback();
                    }
                });
            }
        });
    }
    else callback();
    //--------------------------------------------------------
}
//--------------------------------------------------------
$vm.upload_form_files_s=function(res,$form,msg_id,callback){
    //--------------------------------------------------------
    var total_num=0;
    $form.find('input[type=file]').each(function(evt){
        if(this.files.length===1){
            total_num++;
        }
    });
    if(total_num!=0){
        $form.find('input[type=file]').each(function(evt){
            if(this.files.length===1){
                var name=this.name;
                var s3_upload_url=res['file__'+name];
                $vm.uploading_file(s3_upload_url,this.files[0],msg_id,function(){
                    total_num--;
                    if(total_num==0){
                        callback();
                    }
                });
            }
        });
    }
    else callback();
    //--------------------------------------------------------
}
//--------------------------------------------------------
$vm.uploading_file=function(s3_upload_url,file,msg_id,callback){
    if(file){
        $.ajax({
            xhr: function(){
                var xhr = new window.XMLHttpRequest();
                xhr.upload.addEventListener("progress", function(evt){
                    $('#'+msg_id).text(evt.loaded);
                }, false);
                return xhr;
            },
            url : s3_upload_url,
            type : "PUT",
            data : file,
            headers: {'Content-Type': file.type },
            cache : false,
            processData : false
        })
        .done(function() {
            callback();
        })
        .fail(function(e) {
            alert('Upload error');
        });
    }
}
//---------------------------------------------
$vm.open_s3_url=function(id,table,filename,url,expires){
    $vm.request({cmd:"s3_download_url",id:id,table:table,filename:filename,url:url,expires:expires},function(res){
        if(res.sys.permission==false){
            alert("No permission.")
            return;
        }
        var link = document.createElement("a");
        link.href = res.result;
        link.style = "visibility:hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
}
//---------------------------------------------
$vm.open_s3_url_s=function(rid,filename,minutes){
    var req={cmd:'get_s3_download_url',qid:$vm.qid,rid:rid,filename:filename,minutes:minutes};
    $VmAPI.request({data:req,callback:function(res){
        var link = document.createElement("a");
        link.href = res.s3_download_url;
        link.style = "visibility:hidden";
        var fn=filename.split('-');
        link.download = filename.replace(fn[0]+'-','').replace(/ /g,'_');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }});
}
//---------------------------------------------
$vm.get_image_url=function(tag,record,expires,callback){
    var modified=record.Update_date;
       if(modified==undefined) modified=record.Submit_date;
    
    var filename=record.Data[tag];
    if(filename==undefined || filename==""){
        callback('');
        return;
    }
    var img_id='img_'+tag+'_'+record._id;
    if($vm[img_id]!=undefined) callback($vm[img_id]);
    else{
        var img_url				=localStorage.getItem(img_id+"_url");
        var img_last_load_date	=localStorage.getItem(img_id+"_last_load_date");
        var img_modified		=localStorage.getItem(img_id+"_modified");
        var D1=new Date();
        var D0=new Date(img_last_load_date);
        var dif=D1.getTime()-D0.getTime();
        dif=dif/1000/3600/24;
        if(img_url!==null && dif<6 && img_modified==modified){
            $vm[img_id]=img_url;
            callback($vm[img_id]);
        }
        else{
            var url=record.Table+"/"+record.UID+"-"+tag+"-"+filename;
            $vm.request({cmd:"s3_download_url",id:record._id,table:record.Table,filename:filename,url:url,expires:expires},function(res){
                if(res.status=="np"){
                    callback('');
                    return;
                }
                localStorage.setItem(img_id+"_url",res.result);
                localStorage.setItem(img_id+"_last_load_date",new Date().toString());
                localStorage.setItem(img_id+"_modified",modified);
                $vm[img_id]=res.result;
                callback($vm[img_id]);
            });
        }
    }
}
//---------------------------------------------
