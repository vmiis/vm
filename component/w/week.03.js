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
m.hour_start=7;
m.hour_end=18;
m.calendar_render=function(){
    var rc=function(h,q){
        var a=" h="+h+" q="+q;
        var txt="<div class=c_cell__ID "+a+" d=1 >&nbsp;</div>";
        txt+="<div class=c_cell__ID "+a+" d=2 >&nbsp;</div>";
        txt+="<div class=c_cell__ID "+a+" d=3 >&nbsp;</div>";
        txt+="<div class=c_cell__ID "+a+" d=4 >&nbsp;</div>";
        txt+="<div class=c_cell__ID "+a+" d=5 >&nbsp;</div>";
        txt+="<div class=c_cell__ID "+a+" d=6 >&nbsp;</div>";
        txt+="<div class=c_cell__ID "+a+" d=0 >&nbsp;</div>";
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
    txt+="<div class=c_hd_row__ID><div class=c_T__ID></div><div class=c_c_cell__ID>"+hd+"</div></div>"
    for(i=m.hour_start;i<m.hour_end;i++){
        var t=$vm.pad(i,2)+":00";
        txt+="<div class=c_row__ID><div class=c_T__ID>"+t+"</div><div class=c_c_cell__ID>"+rc(i,1)+"</div></div>"
        txt+="<div class=c_row__ID><div class=c_T__ID></div><div class=c_c_cell__ID>"+rc(i,2)+"</div></div>"
        txt+="<div class=c_row__ID><div class=c_T__ID></div><div class=c_c_cell__ID>"+rc(i,3)+"</div></div>"
        txt+="<div class=c_row__ID><div class=c_T__ID></div><div class=c_c_cell__ID style='border-bottom:1px solid #eee;'>"+rc(i,4)+"</div> </div>"
    }
    $('#calendar__ID').html(txt);

    /*
    var drag=0;
    var drag_start=-1;
    var drag_end=-1;
    var drag_d=-1;
    var $rect;
    var cell_height;
    var set_rect=function(){
        if(drag_start==-1){
            $rect.find('div').text('');
            return;
        }
        var h1=$vm.pad(Math.floor((drag_start)/60),2)+":"+$vm.pad((drag_start)%60,2);
        var h2=$vm.pad(Math.floor((drag_end+15)/60),2)+":"+$vm.pad((drag_end+15)%60,2);
        $rect.text(h1+ " - "+h2);
        $rect.css('height',cell_height*(drag_end+15-drag_start)/15+(drag_end+15-drag_start)/60);
    }
    
    $('#calendar__ID .c_cell__ID').on('mousedown',function(){
        drag=1; 
        var h=$(this).attr("h");
        var q=$(this).attr("q");
        var d=$(this).attr("d");
        var p=parseInt(h)*60+(parseInt(q)-1)*15;
        drag_start=p;
        drag_end=p;
        drag_d=d;
        $div=$(this);
        $div.html("&nbsp;<div class=rect_a__ID>&nbsp;</div>");
        $rect=$div.find('div.rect_a__ID');
        $rect.css('width',$(this).width());
        cell_height=$rect.height();
        set_rect();
    })
    $('#calendar__ID .c_cell__ID').on('mouseup',function(){
        var dd=drag_end-drag_start;
        var item=$('#item_list__ID').val();
        var day=$vm.date_to_yyyymmdd($vm.date_add_days(d,7*m.ref+parseInt(drag_d)-1));
        var time=$vm.pad(Math.floor((drag_start)/60),2)+":"+$vm.pad((drag_start)%60,2);
        var duration=$vm.pad(Math.floor((drag_end+15-drag_start)/60),2)+":"+$vm.pad((drag_end+15-drag_start)%60,2);
        drag=0;
        drag_start=-1;
        drag_end=-1;
        $rect.html('&nbsp;');
        $rect.remove();
        if(dd>=0){
            m.new_record({item:item,day:day,time:time,duration:duration,goback:1});
        }
    })
    
    $('#calendar__ID .c_cell__ID').on('mouseover',function(){
        if(drag==1){
            var h=$(this).attr("h");
            var q=$(this).attr("q");
            var p=parseInt(h)*60+(parseInt(q)-1)*15;
            drag_end=p;
            set_rect();
        }
    })
    */
    $('#calendar__ID .c_cell__ID').on('click',function(){
        var h=$(this).attr("h");
        var q=$(this).attr("q");
        var d=$(this).attr("d");
        var p=parseInt(h)*60+(parseInt(q)-1)*15;
        var day=$vm.date_to_yyyymmdd($vm.date_add_days(fd,7*m.ref+d-1));
        var time=$vm.pad(Math.floor((p)/60),2)+":"+$vm.pad((p)%60,2);
        var item=$('#item_list__ID').val();
        m.new_record({item:item,day:day,time:time,goback:1});
    })
}
//---------------------------------------------
m.get_cell_div=function(h,q,d){
    var R=undefined;
    $('#calendar__ID div.c_cell__ID').each(function(){
        var hh=$(this).attr('h');
        var qq=$(this).attr('q');
        var dd=$(this).attr('d');
        if(h==hh && q==qq && d==dd){
            R=$(this);
            m.cell_width=$(this).width();
            m.cell_height=$(this).height();
            return false;
        }
    })
    return R;
}
//-----------------------------------
m.new_record=function(input){}
