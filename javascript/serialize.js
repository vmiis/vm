//--------------------------------------------------------
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
