//----------------------------------------------
$vm.show_json_data=function(D){
    var txt=JSON.stringify(D, null, '\t');
    txt=txt.replace(/\n/g,"<br>");
    txt=txt.replace(/\t/g,"&nbsp;&nbsp;&nbsp;&nbsp;");
    var win=window.open("","JSON data");
    win.document.body.innerHTML=txt+"<title>JSON data</title><style> body{ font-family:Courier New;font-size:12px; white-space: nowrap; } </style>";
}
//----------------------------------------------
$vm.source=function(module_id,event){
	if (event.altKey) {
		if($vm.vm[module_id].url!==undefined){
			var url='__COMPONENT__/c/code-viewer.01.html'
			var module_url=$vm.vm[module_id].url;
			if(module_url[0]=='/') module_url=$vm.hosting_path+module_url;
			else{
				if(module_url.substring(0,7)!='http://' && module_url.substring(0,8)!='https://'){
					module_url=$vm.hosting_path+"/"+module_url;
				}
			}
			$.get(module_url+'?'+new Date().getTime(), function(data){
				var nm=$vm.vm[module_id].name;
				if($vm.module_list[nm]!==undefined){
                    if($vm.module_list[nm].html_filter!=undefined){
                        data=$vm.module_list[nm].html_filter(data);
                    }
					if($vm.module_list["sys_code_viewer"]==undefined){
						$vm.module_list["sys_code_viewer"]={url:url}
					}
					var msg="No."+module_id.replace('_','')+",  Name:"+nm;
					if($vm.module_list[nm]['Table']!=undefined){
						msg+=",  Table:"+$vm.module_list[nm]['Table'];
                    }
                    msg+=",  Url:"+module_url
					$vm.load_module("sys_code_viewer",'',{code:data,msg:msg});
				}
			})
		}
    }
	else if (event.ctrlKey) {
    }
	else if(event.shiftKey){
	}
}
//----------------------------------------------
$vm.set_dropdown_list_from_text=function($List,text){
    var txt=$("<div></div>").html(text).text();
    txt=txt.replace(/\r/g,'\n');
    txt=txt.replace(/\n\n/g,'\n');
    txt=txt.replace(/\n/g,',');
    txt=txt.replace(/,,/g,',');
    var lines=txt.split(',');
    $List.html('');
    for(var i=0;i<lines.length;i++){
        var line=lines[i];
        var items=line.split(';');
        var sel='';
        if(items[0].length>0 && items[0]=='*'){
            items[0]=items[0].replace('*','');
            sel='selected';
        }
        if(items.length==2)	$List.append(  $('<option '+sel+'></option>').val(items[1]).html(items[0])  );
        else			    $List.append(  $('<option '+sel+'></option>').val(items[0]).html(items[0])  );
    }
}
//---------------------------------------------
$vm.vm_password=function(length, special) {
    var iteration = 0;
    var password = "";
    var randomNumber;
    if(special == undefined){
        var special = false;
    }
    while(iteration < length){
        randomNumber = (Math.floor((Math.random() * 100)) % 94) + 33;
        if(!special){
            if ((randomNumber >=33) && (randomNumber <=47)) { continue; }
            if ((randomNumber >=58) && (randomNumber <=64)) { continue; }
            if ((randomNumber >=91) && (randomNumber <=96)) { continue; }
            if ((randomNumber >=123) && (randomNumber <=126)) { continue; }
        }
        iteration++;
        password += String.fromCharCode(randomNumber);
    }
    return password;
}
//---------------------------------------------
$vm.autocomplete=function($input,req,autocomplete_list,callback){
    var field=$input.attr('data-id');
    $input.focus(function(){$input.autocomplete("search","");});
    return $input.autocomplete({
        minLength:0,
        source:function(request,response){
            req.search=request.term;
            $vm.request(req,function(res){
                if(res.sys.permission==false){
                    console.log("No permission");
                    return;
                }
                response(autocomplete_list(res.result));
            })
        },
        select: function(event,ui){
            if(callback!=undefined){
                callback(ui.item);
            }
        }
    })
}
//-------------------------------------
$vm.autocomplete_s=function($input,sql,autocomplete_list,callback){
    var field=$input.attr('data-id');
    $input.focus(function(){$input.autocomplete("search","");});
    return $input.autocomplete({
        minLength:0,
        source:function(request,response){
            $VmAPI.request({data:{cmd:'read',qid:$vm.qid,s1:request.term,sql:sql,minLength:0},callback:function(res){
                response(autocomplete_list(res.records));
            }});
        },
        select: function(event,ui){
            if(callback!=undefined){
                callback(ui.item);
            }
        }
    })
}
//-------------------------------------
$vm.status_of_data=function(data){
    var N1=0,N2=0;
    for(key in data){
        if(key!=""){
            N2++;
            if(data[key]=='') N1++;
        }
    }
    var status="#FFCC00";
    if(N1==N2) 		    status='#FF0000';
    else if(N1==0)  	status='#00FF00';
    return status;
}
//--------------------------------------------------------
$vm.text=function(txt){
	return $('<div></div>').html(txt).text();
}
//--------------------------------------------------------
$vm.invert_color=function(hex) {
    var padZero=function(str, len) {
        len = len || 2;
        var zeros = new Array(len).join('0');
        return (zeros + str).slice(-len);
    }
    var getRandomColor=function() {
        var color = Math.round(Math.random() * 0x1000000).toString(16);
        return "#" + padZero(color, 6);
    }
    if (hex.indexOf('#') === 0) {
        hex = hex.slice(1);
    }
    // convert 3-digit hex to 6-digits.
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) {
        throw new Error('Invalid HEX color.');
    }
    // invert color components
    var r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16),
        g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16),
        b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16);
    // pad each with zeros and return
    return "#" + padZero(r) + padZero(g) + padZero(b);
}
//--------------------------------------------------------
$vm.whire_or_black_color=function(color){
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
    var red=parseInt(result[1], 16);
    var green=parseInt(result[2], 16);
    var blue=parseInt(result[3], 16);
    var c='#ffffff';
    if ((red*0.299 + green*0.587 + blue*0.114) > 186 ) c='#000000';
    return c;
}
//--------------------------------------------------------
$vm.white_or_black_color=function(color){
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
    var red=parseInt(result[1], 16);
    var green=parseInt(result[2], 16);
    var blue=parseInt(result[3], 16);
    var c='#ffffff';
    if ((red*0.299 + green*0.587 + blue*0.114) > 186 ) c='#000000';
    return c;
}
//--------------------------------------------------------
$vm.download_csv=function(fn,data){
    var CSV='';
    var row="";
    var ids=[];
    for(var i=0;i<data.length;i++){
        if(i==0){
            for(k in data[i]){
                ids.push(k);
                if(row!="") row+=",";
                row+='"'+k+'"';
            }
            row+="\r\n";
            CSV+=row;
        }
        row="";
        for(j=0;j<ids.length;j++){
            if(j!==0) row+=",";
            var v="";
            var id=ids[j];
            if(data[i][id]!==undefined) v=data[i][id];
            if(v!=null) v=v.toString().replace(/"/g,''); //remove "  ???
            row+='"'+v+'"';
        }
        row+="\r\n";
        CSV+=row;
    }
    //-----------------------
    var bytes = [];
        bytes.push(239);
        bytes.push(187);
        bytes.push(191);
    for (var i = 0; i < CSV.length; i++) {
        if(CSV.charCodeAt(i)<128) {
            bytes.push(CSV.charCodeAt(i));
        }
        else if(CSV.charCodeAt(i)<2048) {
            bytes.push(( (CSV.charCodeAt(i) & 192) >> 6 ) + ((CSV.charCodeAt(i) & 1792)>>6 ) +192); //xC0>>6 + x700>>8 +xE0
            bytes.push(CSV.charCodeAt(i) & 63 + 128); //x3F + x80
        }
        else if(CSV.charCodeAt(i)<65536) {
            bytes.push(((CSV.charCodeAt(i) & 61440) >>12) + 224 ); //xF00>>12 + xE0
            bytes.push(( (CSV.charCodeAt(i) & 192) >> 6 ) + ((CSV.charCodeAt(i) & 3840)>>6 ) +128); //xC0>>6 + xF00>>8 +x80
            bytes.push(CSV.charCodeAt(i) & 63 + 128); //x3F + x80
        }
    }
    var u8 = new Uint8Array(bytes);
    var blob = new Blob([u8]);
    //-----------------------
    if (navigator.appVersion.toString().indexOf('.NET') > 0){
        window.navigator.msSaveBlob(blob, name);
    }
    else{
        var link = document.createElement("a");
        link.setAttribute("href", window.URL.createObjectURL(blob));
        link.setAttribute("download", name);
        link.style = "visibility:hidden";
        link.download = fn;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}
//---------------------------------------------
String.prototype.splitCSV = function(sep) {
    for (var foo = this.split(sep = sep || ","), x = foo.length - 1, tl; x >= 0; x--) {
      if (foo[x].replace(/"\s+$/, '"').charAt(foo[x].length - 1) == '"') {
        if ((tl = foo[x].replace(/^\s+"/, '"')).length > 1 && tl.charAt(0) == '"') {
          foo[x] = foo[x].replace(/^\s*"|"\s*$/g, '').replace(/""/g, '"');
        } else if (x) {
          foo.splice(x - 1, 2, [foo[x - 1], foo[x]].join(sep));
        } else foo = foo.shift().split(sep).concat(foo);
      } else foo[x].replace(/""/g, '"');
    } 
    return foo;
}
//---------------------------------------------
$vm.xmlToJson=function(xml) {
    // Create the return object
    var obj = {};
    if (xml.nodeType == 1) { // element
        // do attributes
        if (xml.attributes.length > 0) {
        obj["@attributes"] = {};
            for (var j = 0; j < xml.attributes.length; j++) {
                var attribute = xml.attributes.item(j);
                obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
            }
        }
    } else if (xml.nodeType == 3) { // text
        obj = xml.nodeValue;
    }

    // do children
    // If just one text node inside
    if (xml.hasChildNodes() && xml.childNodes.length === 1 && xml.childNodes[0].nodeType === 3) {
        obj = xml.childNodes[0].nodeValue;
    }
    else if (xml.hasChildNodes()) {
        for(var i = 0; i < xml.childNodes.length; i++) {
            var item = xml.childNodes.item(i);
            var nodeName = item.nodeName;
            if (typeof(obj[nodeName]) == "undefined") {
                obj[nodeName] = $vm.xmlToJson(item);
            } else {
                if (typeof(obj[nodeName].push) == "undefined") {
                    var old = obj[nodeName];
                    obj[nodeName] = [];
                    obj[nodeName].push(old);
                }
                obj[nodeName].push($vm.xmlToJson(item));
            }
        }
    }
    return obj;
}
//---------------------------------------------
$vm.tool_table_info=function(user,op){
    if(user==undefined) user=$vm.user_name;
    if(op==undefined) op="Find";
    var rt=[]
    var tables=[]
    for(a in $vm.module_list){
        if($vm.module_list[a].Table!=undefined && tables.indexOf($vm.module_list[a].Table)==-1){
            tables.push($vm.module_list[a].Table);
        }
    }
    var I=0;
    var from_server=function(){
        I++;
        if(I==tables.length){
            console.log(rt)
        }
    }
    var to_server=function(tb){
        $vm.request({cmd:'permission-check',data:{Table:tb,Operation:op,Login:user}},function(res){
            var z1="Yes"; if(res.sys.tb=='off') z1='No ';
            var z2="Yes"; if(res.sys.db=='0') z2='No ';
            var z3="Yes"; if(res.status=='np') z3='No ';
            rt.push("private-table: "+z1+", \t\tremote-db: "+z2+"\t\t"+op+": "+z3+"\t\t"+tb)
            from_server();
        });
    }
    var set_t=function(i){
        setTimeout(function(){  
            to_server(tables[i]);
        }, 100*i);
    }
    for(var i=0;i<tables.length;i++){
        set_t(i);
    }
}
//---------------------------------------------
$vm.sys_structure=function(){
    var txt="<html>\r\n\t<body>\r\n";
        txt+="\t\t<header>\r\n";
        $('#header >div').each(function(){
            var a=$(this).attr('id');
            var m=$(this).attr('module');
            var c="url:"+"@1span class=c1@2"+$vm.module_list[m].url+"@1/span@2";
            var tb=$vm.module_list[m].Table;
            if(tb!=undefined) c=c+", table:"+"@1span class=c2@2"+tb+"@1/span@2";
            txt+="\t\t\t<div id="+a+" module=@1span class=c@2"+m+"@1/span@2>"+c+"</div>\r\n";
        })
        txt+="\t\t</header>\r\n";
        txt+="\t\t<content>\r\n";
            $('#content >div').each(function(){
            var a=$(this).attr('id');
            var m=$(this).attr('module');
            var c="url:"+"@1span class=c1@2"+$vm.module_list[m].url+"@1/span@2";
            var tb=$vm.module_list[m].Table;
            if(tb!=undefined) c=c+", table:"+"@1span class=c2@2"+tb+"@1/span@2";
            txt+="\t\t\t<div id="+a+" module=@1span class=c@2"+m+"@1/span@2>"+c+"</div>\r\n";
        })
        txt+="\t\t</content>\r\n";
        txt+="\t\t<footer>\r\n";
            $('#footer >div').each(function(){
            var a=$(this).attr('id');
            var m=$(this).attr('module');
            var c="url:"+"@1span class=c1@2"+$vm.module_list[m].url+"@1/span@2";
            var tb=$vm.module_list[m].Table;
            if(tb!=undefined) c=c+", table:"+"@1span class=c2@2"+tb+"@1/span@2";
            txt+="\t\t\t<div id="+a+" module=@1span class=c@2"+m+"@1/span@2>"+c+"</div>\r\n";
        })
        txt+="\t\t</footer>\r\n";
        txt+="\t\t<system>\r\n";
            $('#system >div').each(function(){
            var a=$(this).attr('id');
            var m=$(this).attr('module');
            var c="url:"+"@1span class=c1@2"+$vm.module_list[m].url+"@1/span@2";
            var tb=$vm.module_list[m].Table;
            if(tb!=undefined) c=c+", table:"+"@1span class=c2@2"+tb+"@1/span@2";
            txt+="\t\t\t<div id="+a+" module=@1span class=c@2"+m+"@1/span@2>"+c+"</div>\r\n";
        })
        txt+="\t\t</system>\r\n";
        txt+="\t</body>\r\n</html>";
        txt=txt.replace(/</g,'&lt;');
        txt=txt.replace(/>/g,'&gt;');
        txt=txt.replace(/@1/g,'<');
        txt=txt.replace(/@2/g,'>');
    var win=window.open("","Systsm Infomation");
    win.document.body.innerHTML="<pre>"+txt+"</pre><title>System Infomation</title><style> .c{color:red;} .c1{color:blue;} .c2{color:green;} body{ font-family:Courier New;font-size:12px; white-space: nowrap; } </style>";
}
//---------------------------------------------
$vm.sys_settings=function(){
    var path=window.location.href.split('?')[0].replace('/index.html','')
    var sites=window.location.href.indexOf('/sites/');
    localStorage.setItem("__temp1001_"+path,JSON.stringify($vm.module_list));
    if(sites==-1) window.open('/057/index.html?path='+path);
    else window.open(window.location.href.split('/sites/')[0]+'/sites/057/index.html?path='+path);
}
//---------------------------------------------
$vm.getB64Str=function(buffer) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}
//---------------------------------------------
$vm.alert=function(txt){ alert(txt); }
//--------------------------------------------------------
$vm.load_resource=function(link,callback){
    var nm=link.split('/').pop();
    nm=nm.replace(/\./g,'-');
    if($vm[nm]==1){
        callback(link);
    }
    else{
        var e=link.split('.').pop();
        if(e=='css'){
            $('head').append("<link rel='stylesheet' href='"+link+"'>");
            if(callback!=undefined) callback(link);
        }
        else if(e=='js'){
            $vm.load_js_link(link,callback);
        }
    }
}
//------------------------------------
$vm.load_js_link=function(link,callback){
    $.ajaxSetup({cache:true});
    $.getScript(link,function(data, textStatus, jqxhr){
        var nm=link.split('/').pop();
        nm=nm.replace(/\./g,'-');
        $vm[nm]=1;
        if(callback!=undefined) callback(link);
        if(nm=='loader-js'){
            google.charts.load('current', {packages: ['corechart']});
        }
    });
}
//------------------------------------
