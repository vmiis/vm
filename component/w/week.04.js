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
m.set_ref=function(){
    var d=$vm.first_day_of_current_week();
    m.first_day=$vm.date_add_days(d,7*m.ref);
    m.last_day=$vm.date_add_days(d,7*m.ref+6);
}
m.set_ref();
//---------------------------------------------
m.calendar_render=function(hml){
    var rc=function(){
        var a="";
        var txt="<div class=c_cell__ID "+a+" d=1 >"+hml+"</div>";
        txt+="<div class=c_cell__ID "+a+" d=2 >"+hml+"</div>";
        txt+="<div class=c_cell__ID "+a+" d=3 >"+hml+"</div>";
        txt+="<div class=c_cell__ID "+a+" d=4 >"+hml+"</div>";
        txt+="<div class=c_cell__ID "+a+" d=5 >"+hml+"</div>";
        txt+="<div class=c_cell__ID "+a+" d=6 >"+hml+"</div>";
        txt+="<div class=c_cell__ID "+a+" d=0 >"+hml+"</div>";
        return txt;
    }
    var fd=$vm.first_day_of_current_week();
    var d1= $vm.date_to_yyyymmdd($vm.date_add_days(fd,7*m.ref));
    var d2= $vm.date_to_yyyymmdd($vm.date_add_days(fd,7*m.ref+1));
    var d3= $vm.date_to_yyyymmdd($vm.date_add_days(fd,7*m.ref+2));
    var d4= $vm.date_to_yyyymmdd($vm.date_add_days(fd,7*m.ref+3));
    var d5= $vm.date_to_yyyymmdd($vm.date_add_days(fd,7*m.ref+4));
    var d6= $vm.date_to_yyyymmdd($vm.date_add_days(fd,7*m.ref+5));
    var d7= $vm.date_to_yyyymmdd($vm.date_add_days(fd,7*m.ref+6));
    var txt="";
    var hd="<div class=c_hd_cell__ID>MON &nbsp;&nbsp;"+d1+"</div>";
        hd+="<div class=c_hd_cell__ID>TUE &nbsp;&nbsp;"+d2+"</div>";
        hd+="<div class=c_hd_cell__ID>WED &nbsp;&nbsp;"+d3+"</div>";
        hd+="<div class=c_hd_cell__ID>THU &nbsp;&nbsp;"+d4+"</div>";
        hd+="<div class=c_hd_cell__ID>FRI &nbsp;&nbsp;"+d5+"</div>";
        hd+="<div class=c_hd_cell__ID>SAT &nbsp;&nbsp;"+d6+"</div>";
        hd+="<div class=c_hd_cell__ID>SUN &nbsp;&nbsp;"+d7+"</div>";
    txt+="<div class=c_hd_row__ID><div class=c_c_cell__ID>"+hd+"</div></div>"
    txt+="<div class=c_row__ID><div class=c_c_cell__ID>"+rc()+"</div></div>"
    $('#calendar__ID').html(txt);

    $('#calendar__ID .c_cell__ID').on('click',function(){
        //var h=$(this).attr("h");
        //var q=$(this).attr("q");
        var d=$(this).attr("d");
        //var p=parseInt(h)*60+(parseInt(q)-1)*15;
        var day=$vm.date_to_yyyymmdd($vm.date_add_days(fd,7*m.ref+d-1));
        //var time=$vm.pad(Math.floor((p)/60),2)+":"+$vm.pad((p)%60,2);
        var item=$('#item_list__ID').val();
        m.new_record({item:item,day:day,goback:1});
    })
}
//---------------------------------------------
m.get_cell_div=function(d){
    var R=undefined;
    $('#calendar__ID div.c_cell__ID').each(function(){
        var dd=$(this).attr('d');
        if(d==dd){
            R=$(this);
            return false;
        }
    })
    return R;
}
//-----------------------------------
m.new_record=function(input){}
