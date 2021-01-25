//-------------------------------------
var m=$vm.module_list['__MODULE__'];
if(m.prefix==undefined) m.prefix="";
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
    var json=data;
    if(m.JSON==1) json={Data:JSON.stringify(data)}
    //--------------------------------------------------------
    var r=true;
    if(m.before_submit!=undefined) r=m.before_submit(data);
    if(r==false){$('#submit__ID').show(); return;}
    var rid=undefined; if(m.input.record!=undefined) rid=m.input.record._id;
    if(rid==undefined){
        m.add_record(data);
        /*
        $vm.m365_msal.acquireTokenSilent(m.scope).then(function (tokenResponse) {
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.onreadystatechange = function () {
                console.log(this.readyState+" "+this.status)
                if (this.readyState == 4 && (this.status == 200 || this.status == 201)){
                    if(m.after_insert!=undefined){
                        var res=JSON.parse(this.responseText);  
                        m.after_insert(data,res); return;
                    }
                    $vm.refresh=1;
                    window.history.go(-1);
                }
                else if (this.readyState == 4 && (this.status == 400 || this.status == 403  || this.status == 500)) {
                    var res=JSON.parse(this.responseText); 
                    if(res.error!=undefined) $vm.alert(res.error.message);
                    else if(res["odata.error"]!=undefined) $vm.alert(res["odata.error"].message.value);
                }
            }
            xmlHttp.open("POST", m.endpoint_a, true);
            xmlHttp.setRequestHeader('Authorization', 'Bearer ' + tokenResponse.accessToken);
            xmlHttp.setRequestHeader("Accept", "application/json");  
            xmlHttp.setRequestHeader("Content-Type", "application/json; charset=utf-8");  
            var d=JSON.stringify(json);
            xmlHttp.send(d);
        }).catch(function (error) {
            console.log(error);
        });
        */
    }
    else if(rid!=undefined){
        m.modify_record(rid,data);
        /*
        $vm.m365_msal.acquireTokenSilent(m.scope).then(function (tokenResponse) {
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.onreadystatechange = function () {
                console.log(this.readyState+" "+this.status)
                if (this.readyState == 4 && (this.status == 200 || this.status == 204)){
                    if(m.after_update!=undefined){
                        var res=JSON.parse(this.responseText);  
                        m.after_update(data,res); return;
                    }
                    $vm.refresh=1;
                    if(rid!=undefined){
                        console.log('go back.');
                        console.log(window.history.state.m_name);
                        console.log(window.history);
                        window.history.go(-1);
                        console.log(window.history);
                        console.log(window.history.state.m_name);
                    }
                }
                else if (this.readyState == 4 && (this.status == 400 || this.status == 403 || this.status == 500)) {
                    var res=JSON.parse(this.responseText); 
                    $vm.alert(res.error.message);
                }
            }
            xmlHttp.open("PATCH", m.endpoint_u, true); // true for asynchronous
            xmlHttp.setRequestHeader('Authorization', 'Bearer ' + tokenResponse.accessToken);
            xmlHttp.setRequestHeader("Accept", "application/json");  
            xmlHttp.setRequestHeader("Content-Type", "application/json; charset=utf-8");  
            xmlHttp.setRequestHeader("IF-MATCH", "*");  
            var d=JSON.stringify(json);
            xmlHttp.send(d);
        }).catch(function (error) {
            console.log(error);
        });
        */
    }
}
//--------------------------------------------------------
$('#D__ID').on('load',function(){ m.load();})
$('#F__ID').submit(function(event){m.submit(event);})
$('#FP1__ID').submit(function(event){m.submit_p1(event);})
$('#FP2__ID').submit(function(event){m.submit_p2(event);})
//--------------------------------------------------------
m.ajax_add=function(endpoint,data,tokenResponse,callback){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        console.log(this.readyState+" "+this.status)
        if (this.readyState == 4 && (this.status == 200 || this.status == 201  || this.status == 204)){
            if(m.after_insert!=undefined){
                var res=JSON.parse(this.responseText);  
                m.after_insert(data,res); return;
            }
            callback();
        }
        else if (this.readyState == 4 && (this.status == 400 || this.status == 403  || this.status == 500)) {
            var res=JSON.parse(this.responseText); 
            if(res.error!=undefined) $vm.alert(res.error.message);
            else if(res["odata.error"]!=undefined) $vm.alert(res["odata.error"].message.value);
        }
    }
    xmlHttp.open("POST", endpoint, true);
    xmlHttp.setRequestHeader('Authorization', 'Bearer ' + tokenResponse.accessToken);
    xmlHttp.setRequestHeader("Accept", "application/json");  
    xmlHttp.setRequestHeader("Content-Type", "application/json; charset=utf-8");  
    var d=JSON.stringify(data);
    xmlHttp.send(d);
}
//-------------------------------------
m.ajax_modify=function(endpoint,data,tokenResponse,callback){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        console.log(this.readyState+" "+this.status)
        if (this.readyState == 4 && (this.status == 200 || this.status == 204)){
            if(m.after_update!=undefined){
                var res=JSON.parse(this.responseText);  
                m.after_update(data,res); return;
            }
           callback();
        }
        else if (this.readyState == 4 && (this.status == 400 || this.status == 403 || this.status == 500)) {
            var res=JSON.parse(this.responseText); 
            $vm.alert(res.error.message);
        }
    }
    xmlHttp.open("PATCH", endpoint, true); // true for asynchronous
    xmlHttp.setRequestHeader('Authorization', 'Bearer ' + tokenResponse.accessToken);
    xmlHttp.setRequestHeader("Accept", "application/json");  
    xmlHttp.setRequestHeader("Content-Type", "application/json; charset=utf-8");  
    xmlHttp.setRequestHeader("IF-MATCH", "*");  
    var d=JSON.stringify(data);
    xmlHttp.send(d);
}
//-------------------------------------
