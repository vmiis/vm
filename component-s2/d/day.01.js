//---------------------------------------------
var m=$vm.module_list['__MODULE__'];
if(m.prefix==undefined) m.prefix="";
m.change_status=0;
m.ref=0
//---------------------------------------------
$('#previous__ID').on('click',function(){   m.ref--;	m.set_ref();	m.request_and_render();	})
$('#this__ID').on('click',    function(){	m.ref=0;    m.set_ref();	m.request_and_render();	})
$('#next__ID').on('click',    function(){	m.ref++;	m.set_ref();	m.request_and_render();	})
$('#refresh__ID').on('click', function(){	                            m.request_and_render();	})
//---------------------------------------------
$('#date__ID').on('change',function(){
    m.ref=$vm.date_day_diff($vm.date_today(),$vm.date_yyyymmdd_parse($('#date__ID').val()));
    m.request_and_render();
});
//---------------------------------------------
m.set_ref=function(){
    var d=$vm.date_to_yyyymmdd($vm.date_add_days($vm.date_today(),m.ref));
    $('#date__ID').val(d);
}
m.set_ref();
//---------------------------------------------
m.request_and_render=function(){};
//---------------------------------------------
