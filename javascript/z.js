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
					var msg='module name: '+nm+', App: '+$vm.module_list[nm]['App']+', Table: '+$vm.module_list[nm]['Table'];
					if($vm.module_list["sys_code_viewer"]==undefined){
						$vm.module_list["sys_code_viewer"]={url:url}
					}
					$vm.load_module("sys_code_viewer",'',{code:data,name:msg,url:module_url});
				}
			})
		}
    }
	else if (event.ctrlKey) {
    }
	else if(event.shiftKey){
	}
}
