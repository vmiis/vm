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
$vm.open_s3_url=function(filename,url){
    $vm.request({cmd:"s3_download_url",filename:filename,url:url},function(res){
        var link = document.createElement("a");
        link.href = res.url;
        link.style = "visibility:hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
}
//---------------------------------------------
