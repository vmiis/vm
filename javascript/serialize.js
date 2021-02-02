//--------------------------------------------------------
$vm.add_value_to_select=function($el, v){
	var exists = false;
	$el.find('option').each(function(index){
		if (this.value == v) {
			exists = true;
			return false;
		}
	});    
	if(exists==false){
		$el.append(new Option(v, v));
	}
}
$vm.deserialize=function(record,form_id){
	if(record==undefined || record.Data==undefined) return;
	$.each(record.Data, function(name, value){
		if(name!=''){
			var $els = $(form_id+' *[name='+name+']');
			$els.each(function(){
				var $el=$(this);
				var type = $el.attr('type');
				switch(type){
					case 'checkbox':
						if(value=='off' || value=='0' || value=='' || value==undefined ) $el.prop('checked', false);
						else $el.prop('checked', true);
						break;
					case 'radio':
						if($el.attr('value')==value){
							$el.prop('checked', true);
						}
						break;
					case 'file':
						break;
					case 'text':
					case 'email':
					case 'textarea':
					case 'select':
						$el.val(value);
						break;
					case 'undefined':
						break;
					default:
						var type1=$(this).prop('nodeName');
						switch(type1){
							case "SELECT":
								$vm.add_value_to_select($el,value);
								$el.val(value);
								break;
							case "TEXTAREA":
                                $el.val(value); 
                                break;
							default: 
								console.log(type+"---"+type1)				
                                $el.val(value); 
                                break;
						}
						break;
				}
			});
		}
	});
}
/*
$vm.deserialize=function(record,form_id){
    if(record==undefined || record.Data==undefined) return;
    $.each(record.Data, function(name, value){
        if(name!=''){
            var $els = $(form_id+' *[name='+name+']');
            $els.each(function(){
                var $el=$(this);
                var type = $el.attr('type');
                switch(type){
                    case 'checkbox':
                        if(value=='off' || value=='0' || value=='' || value==undefined ) $el.prop('checked', false);
                        else $el.prop('checked', true);
                        break;
                    case 'radio':
                        if($el.attr('value')==value){
                             $el.prop('checked', true);
                        }
                        break;
                    case 'file':
                        break;
                    case 'text':
                    case 'email':
                    case 'textarea':
                    case 'select':
                        $el.val(value);
                        break;
                    case 'undefined':
                        break;
                    default:
                        $el.val(value);
                        break;

                }
            });
        }
    });
}
*/
$vm.deserialize_s=function(record,form_id){
    if(record==undefined) return;
    $.each(record, function(name, value){
        if(name!=''){
            var $els = $(form_id+' *[name='+name+']');
            $els.each(function(){
                var $el=$(this);
                var type = $el.attr('type');
                switch(type){
                    case 'checkbox':
                        if(value=='off' || value=='0' || value=='' ) $el.prop('checked', false);
                        else $el.prop('checked', true);
                        break;
                    case 'radio':
                        if($el.attr('value')==value){
                             $el.prop('checked', true);
                        }
                        break;
                    case 'file':
                        break;
                    case 'text':
                    case 'email':
                    case 'textarea':
                    case 'select':
                        $el.val(value);
                        break;
                    case 'undefined':
                        break;
                    default:
                        $el.val(value);
                        break;

                }
            });
        }
    });
}
$vm.serialize=function(form_id){
    var data={};
    var a=$(form_id).serializeArray();
    $.each(a, function () { data[this.name]=this.value || '';});
    $(form_id+" input:checkbox:not(:checked)").each(function(){
		data[this.name]="off";
	})
    $(form_id+" input:file").each(function(){
        if(this.files.length==1){
            data[this.name]=this.files[0].name;
        }
	})
    return data;
}
$vm.serialize_file=function(form_id){
    var data={};
    $(form_id+" input:file").each(function(){
        if(this.files.length==1){
            data[this.name]=this.files[0].name+'|'+this.files[0].type;
        }
	})
    return data;
}
