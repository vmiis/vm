//---------------------------------------------
var m=$vm.module_list['__MODULE__'];
if(m.prefix==undefined) m.prefix="";
m.change_status=0;
m.ref=0
//---------------------------------------------
$('#previous__ID').on('click',function(){ m.ref--;	m.set_ref();	m.request_and_render();	})
$('#this__ID').on('click',    function(){	m.ref=0;    m.set_ref();	m.request_and_render();	})
$('#next__ID').on('click',    function(){	m.ref++;	m.set_ref();	m.request_and_render();	})
$('#refresh__ID').on('click', function(){	                              m.request_and_render();	})
//---------------------------------------------
m.set_ref=function(){
    var d=$vm.first_day_of_current_week();
    m.first_day=$vm.date_add_days(d,7*m.ref);
    m.last_day=$vm.date_add_days(d,7*m.ref+6);
    var s="From "+$vm.date_to_yyyymmdd(m.first_day)+" to "+$vm.date_to_yyyymmdd(m.last_day);
    $('#period__ID').text(s);

      /*
    var d=new Date();
    var y=d.getFullYear()
    var mm=d.getMonth()+m.ref;
    var d0=new Date(y,mm,1,0,0,0,0);
    var e=d0.getDay(); if(e===0) e=7;
    e=e-1; //0,1,...6 --- Monday....Sunday
    var x=$vm.date_add_days(d0,-e-1);	  m.first_day=$vm.date_to_yyyymmdd(x);
    var y=$vm.date_add_days(d0,-e+41+1);  m.last_day= $vm.date_to_yyyymmdd(y);
    */
}
m.set_ref();
//---------------------------------------------
m.get_cell_div=function(d){
    var R=undefined;
    $('#calendar__ID u').each(function(){
          var ddd=$(this).data('d');
          if(ddd!==undefined){
                var sd=$vm.date_to_yyyymmdd(ddd)
                if(sd===d){
                    R=$(this).parent().next().next();
                    return false;
                }
          }
    })
    if(R!==undefined) return $(R);
    return R;
}
//-----------------------------------
m.calendar_render=function(html){
    $('#body__ID').html('');
    var id=new Date().getTime();
    for(var i=0;i<1;i++){
          var row="<div class=row__ID>";
          for(var j=0;j<7;j++){
                var idd='A'+id+'_'+i+'_'+j
                var d=$vm.date_add_days(m.first_day,j)
                var N=d.getDate();
                var N="<u id="+idd+" style=cursor:pointer>"+N+"</u>";
                var weekday="";
                if(j==0) weekday="<span class=weekday>Monday</span>";
                if(j==1) weekday="<span class=weekday>Tuesday</span>";
                if(j==2) weekday="<span class=weekday>Wednesday</span>";
                if(j==3) weekday="<span class=weekday>Thursday</span>";
                if(j==4) weekday="<span class=weekday>Friday</span>";
                if(j==5) weekday="<span class=weekday>Saturday</span>";
                if(j==6) weekday="<span class=weekday>Sunday</span>";
                row+="<div class=col__ID><div class=day__ID>"+N+"</div>"+weekday+"&nbsp;<div class=event_container__ID>"+html+"</div></div>";
          }
          row+="</div>";
          $('#body__ID').append(row);
          for(var j=0;j<7;j++){
                var d=$vm.date_add_days(m.first_day,j);
                var idd='A'+id+'_'+i+'_'+j
                $('#'+idd).data('d',d);
                $('#'+idd).on('click',function(){
                      var date=$vm.date_to_yyyymmdd($(this).data('d'))
                      m.on_day_click_fun( date );
                })
          }
    }
}
//-----------------------------------
m.on_day_click_fun=function(){}
m.request_and_render=function(){};
//---------------------------------------------
