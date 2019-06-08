//-------------------------------------
var m=$vm.module_list['__MODULE__'];
if(m.prefix==undefined) m.prefix="";
//m.endpoint=$vm.m365.organizationURI;
//-------------------------------------
m.load=function(){
    $('#D__ID').scrollTop(0);
    $(window).scrollTop(0);
    $('#F__ID')[0].reset();
    $('#submit__ID').show();
    $('#FP1__ID')[0].reset();
    $('#submit_p1__ID').show();
    $('#delete__ID').hide(); if(m.input.record!=undefined && m.input.record._id!==undefined) $('#delete__ID').show();
    $vm.deserialize(m.input.record,'#F__ID');
    
    if(m.input.record!=undefined){
        $vm.deserialize(m.input.record.record_p1,'#FP1__ID');
    }
}
//-------------------------------
m.submit=function(event){
    //--------------------------------------------------------
    event.preventDefault();
    $('#submit__ID').hide();
    //--------------------------------------------------------
    var data={};
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
    var json={Data:JSON.stringify(data)}
    //--------------------------------------------------------
    var r=true;
    if(m.before_submit_1!=undefined) r=m.before_submit_1(data);
    if(r==false){$('#submit__ID').show(); return;}
    var rid=undefined; if(m.input.record!=undefined) rid=m.input.record._id;
    if(rid==undefined){
        $vm.m365_msal.acquireTokenSilent(m.scope).then(function (tokenResponse) {
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 201){
                    if(m.after_insert_1!=undefined){
                        var res=JSON.parse(this.responseText);  
                        m.after_insert_1(data,res); return;
                    }
                    $vm.refresh=1;
                    window.history.go(-1);
                }
                else if (this.readyState == 4 && (this.status == 400 || this.status == 500)) {
                    var res=JSON.parse(this.responseText); 
                    if(res.error!=undefined) $vm.alert(res.error.message);
                    else if(res["odata.error"]!=undefined) $vm.alert(res["odata.error"].message.value);
                }
            }
            xmlHttp.open("POST", m.endpoint_1_a, true);
            xmlHttp.setRequestHeader('Authorization', 'Bearer ' + tokenResponse.accessToken);
            xmlHttp.setRequestHeader("Accept", "application/json");  
            xmlHttp.setRequestHeader("Content-Type", "application/json; charset=utf-8");  
            var d=JSON.stringify(json);
            xmlHttp.send(d);
        }).catch(function (error) {
            console.log(error);
        });
    }
    else if(rid!=undefined){
        $vm.m365_msal.acquireTokenSilent(m.scope).then(function (tokenResponse) {
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 204){
                    if(m.after_update!=undefined){
                        var res=JSON.parse(this.responseText);  
                        m.after_update(data,res); return;
                    }
                    $vm.refresh=1;
                    if(rid!=undefined) window.history.go(-1);
                }
                else if (this.readyState == 4 && (this.status == 400 || this.status == 500)) {
                    var res=JSON.parse(this.responseText); 
                    $vm.alert(res.error.message);
                }
            }
            xmlHttp.open("PATCH", m.endpoint_1_u, true); // true for asynchronous
            xmlHttp.setRequestHeader('Authorization', 'Bearer ' + tokenResponse.accessToken);
            xmlHttp.setRequestHeader("Accept", "application/json");  
            xmlHttp.setRequestHeader("Content-Type", "application/json; charset=utf-8");  
            xmlHttp.setRequestHeader("IF-MATCH", "*");  
            var d=JSON.stringify(json);
            xmlHttp.send(d);
        }).catch(function (error) {
            console.log(error);
        });
    }
}
//--------------------------------------------------------
m.submit_p1=function(event){
    //--------------------------------------------------------
    event.preventDefault();
    if(m.input.record==undefined) return;
    if(m.input.record._id==undefined) return;    
    
    $('#submit_p1__ID').hide();
    //--------------------------------------------------------
    var data={};
    var data_new=$vm.serialize('#FP1__ID');
    if(m.input.record!=undefined){
        for(k in m.input.record.Data){
            data[k]=m.input.record.record_p1.Data[k];
        }
    }
    if(data_new!=undefined){
        for(k in data_new){
            data[k]=data_new[k];
        }
    }
    delete data[""];
    var json={PID:parseInt(m.input.record._id), Data:JSON.stringify(data)}
    //--------------------------------------------------------
    var r=true;
    if(m.before_submit_p1!=undefined) r=m.before_submit_p1(data);
    if(r==false){$('#submit_p1__ID').show(); return;}
    var rid=undefined; if(m.input.record.record_p1!=undefined) rid=m.input.record.record_p1._id;
    if(rid==undefined){
        $vm.m365_msal.acquireTokenSilent(m.scope).then(function (tokenResponse) {
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 201){
                    if(m.after_insert_1!=undefined){
                        var res=JSON.parse(this.responseText);  
                        m.after_insert_1(data,res); return;
                    }
                    $vm.refresh=1;
                    window.history.go(-1);
                }
                else if (this.readyState == 4 && (this.status == 400 || this.status == 500)) {
                    var res=JSON.parse(this.responseText); 
                    if(res.error!=undefined) $vm.alert(res.error.message);
                    else if(res["odata.error"]!=undefined) $vm.alert(res["odata.error"].message.value);
                }
            }
            xmlHttp.open("POST", m.endpoint_p1_a, true);
            xmlHttp.setRequestHeader('Authorization', 'Bearer ' + tokenResponse.accessToken);
            xmlHttp.setRequestHeader("Accept", "application/json");  
            xmlHttp.setRequestHeader("Content-Type", "application/json; charset=utf-8");  
            var d=JSON.stringify(json);
            xmlHttp.send(d);
        }).catch(function (error) {
            console.log(error);
        });
    }
    else if(rid!=undefined){
        $vm.m365_msal.acquireTokenSilent(m.scope).then(function (tokenResponse) {
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 204){
                    if(m.after_update!=undefined){
                        var res=JSON.parse(this.responseText);  
                        m.after_update(data,res); return;
                    }
                    $vm.refresh=1;
                    if(rid!=undefined) window.history.go(-1);
                }
                else if (this.readyState == 4 && (this.status == 400 || this.status == 500)) {
                    var res=JSON.parse(this.responseText); 
                    $vm.alert(res.error.message);
                }
            }
            xmlHttp.open("PATCH", m.endpoint_p1_u, true); // true for asynchronous
            xmlHttp.setRequestHeader('Authorization', 'Bearer ' + tokenResponse.accessToken);
            xmlHttp.setRequestHeader("Accept", "application/json");  
            xmlHttp.setRequestHeader("Content-Type", "application/json; charset=utf-8");  
            xmlHttp.setRequestHeader("IF-MATCH", "*");  
            var d=JSON.stringify(json);
            xmlHttp.send(d);
        }).catch(function (error) {
            console.log(error);
        });
    }
}
//--------------------------------------------------------
$('#D__ID').on('load',function(){ m.load();})
$('#F__ID').submit(function(event){m.submit(event);})
$('#FP1__ID').submit(function(event){m.submit_p1(event);})
$('#FP2__ID').submit(function(event){m.submit_p2(event);})
//--------------------------------------------------------
$('#delete__ID').on('click', function(){
    var record=m.input.record;    if(record==undefined) return;
    var rid=record._id;           if(rid==undefined)    return;
    if(confirm("Are you sure to delete?\n")){
        $vm.request({cmd:"delete",id:rid,table:m.Table},function(res){
            //-----------------------------
            if(res.status=="lk"){
                $vm.alert("This record is locked.");
                return;
            }
            //-----------------------------
            if(res.status=="np"){
                alert("No permission to delete this record.");
                return;
            }
            //-----------------------------
            if(m.after_delete!=undefined){
                m.after_delete(res); 
                return;
            }
            //-------------------------------
            $vm.refresh=1;
            window.history.go(-1);
        });
    }
})
//-------------------------------------
$('#copy__ID').on('click',function(){
    if($vm.copy_paste==undefined) $vm.copy_paste={}
    $vm.copy_paste['__ID']={Data:$vm.serialize('#F__ID')};
    console.log($vm.copy_paste['__ID'])
})
//---------------------------------------------
$('#paste__ID').on('click',function(){
    if($vm.copy_paste!=undefined && $vm.copy_paste['__ID']!=null){
        $vm.deserialize($vm.copy_paste['__ID'],'#F__ID');
        if(m.paste!=undefined) m.paste($vm.copy_paste['__ID']);
    }
})
//---------------------------------------------
$('#header__ID').on('click', function(event){
    if(event.ctrlKey){
        var x=document.getElementById("F__ID");
        var txt="";var nm0="";
        for (var i=0; i < x.length; i++) {
            var nm=x.elements[i].getAttribute("name");
            if(nm!=null && nm!=nm0){ if(txt!="") txt+=", "; txt+=nm; nm0=nm;}
        }
        console.log(txt);
    }
});
//--------------------------------------------------------
$('#pdf__ID').on('click',function(){
    $('#D__ID').scrollTop(0);
    $(window).scrollTop(0);
    var h=$('#D__ID').css('height');
    $('#D__ID').css('height',"210mm");
    $('form_container__ID').css('height',"297mm");
    $('#F__ID').css('border-bottom-width','0');
    $('#submit__ID').hide();
    $('#pdf__ID').hide();
    var pdf=new jsPDF('p', 'pt', 'a4');
    //pdf.internal.scaleFactor = 2.25;
    var options = {
        //pagesplit: true,
        background: '#fff'
    };
    pdf.addHTML($('#form_container__ID'),options,function() {
        pdf.save(m.Table+'.pdf');
        $('#F__ID').css('border-bottom-width','1px');
        $('#submit__ID').show();
        $('#pdf__ID').show();
        $('#D__ID').css('height',h);
    });
    
})
//-------------------------------------
m.boolean_field=function(data,name){
    var d=data[name];
    if(d==1) data[name]=true;
    if(d==0) data[name]=false;
}
//-------------------------------------
m.date_field=function(data,name){
    var d=data[name];
    if(d=="") delete data[name];
}
//-------------------------------------
m.string_array_field=function(data,name,names){
    var items=names.split(',');
    //var d=data[name];

    var as=[];
    for(i in items){
        var a=items[i];
        if(data[a]=='on') as.push(a.replace(/__/g,'\/').replace(/_/g,' '));
        delete data[a];
    }
    data[name]=as;
    data[name+"@odata.type"]="Collection(Edm.String)";
}
//-------------------------------------
