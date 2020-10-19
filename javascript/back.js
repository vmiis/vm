//-------------------------------------------------------------
$vm.set_block=function(name){
	var prefix=$vm.module_list[name].prefix;
	if(prefix==undefined) prefix="";
	var parent=prefix+$vm.module_list[name].parent;
	if($vm.module_list[name].parent!=undefined){
		var slot=$vm.module_list[parent].slot;
		var id=$vm.module_list[parent].id;
		if(slot==undefined) slot=$vm.root_layout_content_slot;
		$('#'+slot+' >div').css('display','none');
		$('#D'+id).css('display','block');
	}

	var slot=$vm.module_list[name].slot;
	var id=$vm.module_list[name].id;
	if(slot==undefined) slot=$vm.root_layout_content_slot;
	$('#'+slot+' >div').css('display','none');
	$('#D'+id).css('display','block');
}
//-------------------------------------------------------------
window.onpopstate=function(event){
	//new ==========================================
	if(event.state==undefined) return;
    var W_index=event.state.index;
    var V_index=0;
    var L=$vm.page_stack.length;
    if(L>1){
        var previous=$vm.page_stack[L-2];
        V_index=previous.index;
    }
    if(W_index==V_index){
        //back
        var top=$vm.page_stack.pop();
        var slot_of_hide_module="";
        if(top!=undefined){
            slot_of_hide_module=top.slot;
			$('#D'+top.ID).css('display','none');
			$('#D'+top.ID).triggerHandler('hide');
		}
        if($vm.page_stack.length==0){
            window.history.back(-1);
        }
        else{
            var L=$vm.page_stack.length;
			var top=$vm.page_stack[L-1];
			var current_slot=top.slot;
			var current_id=top.ID;
			var current_name=top.m_name;
			//var parent_id=$vm.module_list[current_name].parent_id;
            $('#'+current_slot +' >div').css('display','none');
            $('#D'+current_id).css('display','block');
			$('#D'+current_id).triggerHandler('show');
			
			$vm.set_block(event.state.m_name);
			
			if($vm.show!=undefined){$vm.show(current_name); }
        }
        if(slot_of_hide_module!=""){
            var block=0; $('#'+slot_of_hide_module+' > div').each(function(){ if($(this).css('display')=='block') block++; })
            if(block==0) window.history.back(-1);
        }
    }
    else if(W_index>V_index){
        //forword
        var L=$vm.page_stack.length;
		var top=$vm.page_stack[L-1];
		

        $('#D'+top.ID).css('display','none');
		$('#D'+top.ID).triggerHandler('hide');
        $('#D'+event.state.ID).css('display','block');
		$('#D'+event.state.ID).triggerHandler('show');
        $vm.page_stack.push(event.state);
		
		$vm.set_block(event.state.m_name);
		
		if($vm.show!=undefined){ $vm.show(event.state.m_name); }
    }
    //console.log($vm.page_stack);
    //new ==========================================
    return;

    //old ==========================================
    if(event.state==null){
		window.history.back(-1);
	}
	else{
		var slot=$vm.root_layout_content_slot;
		var current_ID=$('#'+slot).data("current_state").ID;
		var last_ID=event.state.ID;
		if(last_ID!=undefined){
			$('#D'+last_ID).css('display','block');
            $('#D'+last_ID).triggerHandler('show');
			if(current_ID!=last_ID){
				$('#D'+current_ID).css('display','none');
                $('#D'+last_ID).triggerHandler('hide');
			}
		}
		$('#'+slot).data("current_state",event.state);
        console.log('popstate'+event.state.ID+'   last:'+current_ID+" --- current:"+event.state.ID)
	}
    //old ==========================================
}
//------------------------------------






//------------------------------------
//not used
$vm.push_back_to_park=function(options){
	var div=options.div;
	if( $('#D'+div).length>0){
		var scroll=$('#vm_body').scrollTop();
		$('#D'+div).data('scroll',scroll);

		//$('#D'+div).appendTo('#vm_park');
		$('#D'+div).css('display','none');

		$('#D'+div).triggerHandler('hide');
	}
}
$vm.push_to_slot=function(options){
	var div	=options.div;
	var slot=options.slot;

	//$('#'+slot).html('');
   	//$('#D'+div).appendTo('#'+slot);
	$('#D'+div).css('display','block');

	$('#D'+div).triggerHandler('show');
	var scroll=$('#D'+div).data('scroll');
	if(scroll==undefined) scroll=0;
	$('#vm_body').scrollTop(scroll)
}
$vm.back=function(options){
	var div=options.div;
	var back_module=$('#D'+div).data('back_module');
	var back_slot=$('#D'+div).data('back_slot');
	$vm.push_back_to_park({div:div});
	$vm.push_to_slot({div:back_module,slot:back_slot});
	$('#'+back_slot).data("current",back_module);
	var form=options.form;
	var refresh_back=options.refresh_back;
	if(form!==undefined){
		if(refresh_back===undefined) $('#D'+back_module).triggerHandler('form_back'); //without save on form
		else if(refresh_back!==undefined) $('#D'+back_module).triggerHandler('refresh_back'); //with save on form
	}
	else $('#D'+back_module).triggerHandler('back');
}
$vm.back_and_refresh=function(options){
	var div=options.div;
	var back_module=$('#D'+div).data('back_module');
	var back_slot=$('#D'+div).data('back_slot');
	$vm.push_back_to_park({div:div});
	$vm.push_to_slot({div:back_module,slot:back_slot});
	$('#'+back_slot).data("current",back_module);
	$('#D'+back_module).triggerHandler('refresh_back');
}
