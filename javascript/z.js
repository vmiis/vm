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
					var msg=module_url;
					if($vm.module_list[nm]['App']!=undefined && $vm.module_list[nm]['Table']!=undefined){
						msg=msg+ " - "+$vm.module_list[nm]['App']+"/"+$vm.module_list[nm]['Table'];
					}
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
                if(res.permission==false){
                    console.log("No permission");
                    return;
                }
                response(autocomplete_list(res.records));
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
