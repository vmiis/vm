//-------------------------------------
var m=$vm.module_list['__MODULE__'];
m.query={};
m.options={};
//-------------------------------------
$('#import_export_section__ID').hide();
m.set_req=function(){
    m.query={}
}
//-------------------------------------
m.set_req_export=function(i1,i2){
    var sql="with tb as (select Information,DateTime,Author,RowNum=row_number() over (order by ID DESC) from [TABLE-"+m.db_pid+"-@S1] )";
    sql+="select Information,DateTime,Author from tb where RowNum between @I1 and @I2";
	m.req={cmd:'read',qid:m.qid,sql:sql,i1:i1,i2:i2};
}
//-----------------------------------------------
m.request_data=function(){
    var limit=parseInt($('#page_size__ID').val());
    var skip=limit*parseInt($('#I__ID').text());
    var mt1=new Date().getTime();
    $vm.request({cmd:"count-table",search:$('#keyword__ID').val()},function(res){
        var N=res.result;
        m.max_I=N/limit-1;
        $("#B__ID").text(N)
        var n2=skip+limit; if(n2>N) n2=N;
        var a=(skip+1).toString()+"~"+(n2).toString()+" of ";
        $("#A__ID").text(a);
    });
    $vm.request({cmd:"find-table",search:$('#keyword__ID').val(),skip:skip,limit:limit},function(res){
        var mt2=new Date().getTime();
        var tt_all=mt2-mt1;
        var tt_server=parseInt(res.sys.elapsed_time);
        if(tt_all<tt_server) tt_all=tt_server;
        $("#elapsed__ID").text((JSON.stringify(res.result).length/1000).toFixed(1)+"kb/"+tt_all.toString()+"ms/"+tt_server+'ms');
        $('#save__ID').css('background','');
        m.records=res.result;
        m.res=res;
        m.render();
    })
};
//-------------------------------------
m.render=function(){
    var start=0;
    var max=m.records.length;
    for(var i=start;i<max;i++){
        if(m.records[i].DateTime!==undefined){
            m.records[i].DateTime=m.records[i].DateTime.substring(0,10);
        }
        if(m.records[i].vm_dirty===undefined) m.records[i].vm_dirty=0;
        if(m.records[i].vm_custom===undefined) m.records[i].vm_custom={};
        if(m.records[i].vm_readonly===undefined) m.records[i].vm_readonly={};
    }

    var txt="";
    txt+="<tr><th></th>"
    //-------------------------
    m.create_header();
    //-------------------------
    for(var i=0;i<m.field_header.length;i++){
        var print='';
        var header_name=m.field_header[i];
        if(m.field_header[i][0]=='_'){
            print='class=c_print';
            header_name=header_name.replace('_','');
        }
        header_name=header_name.replace(/_/g,' ');
        var header_id=m.field_id[i];
        if(m.field_header[i]=='_Form')        txt+="<th "+print+" data-header="+header_id+"></th>";
        else if(m.field_header[i]=='_Delete') txt+="<th "+print+" data-header="+header_id+" style='width:30px;'></th>";
        else                                  txt+="<th "+print+" data-header="+header_id+">"+header_name+"</th>";
    }
    txt+"</tr>";
    for(var i=0;i<m.records.length;i++){
        txt+="<tr><td>"+(i+1).toString()+"</td>";
        for(var j=0;j<m.field_header.length;j++){
            var b=m.field_id[j];
            var value="";
            if(m.records[i][b]!==undefined){
                value=m.records[i][b];
                if(b=="Submit_date") value=$vm.date_to_ddmmyyyy(value.substring(0,10));
            }
            else{
                if(m.records[i]['Data']!=undefined && m.records[i]['Data'][b]!==undefined){
                    value=m.records[i]['Data'][b];
                }
            }
            if(value==undefined) value="";
            value=value.toString();
            value=$('<div/>').text(value).html();
            value=value.replace(/\n/g,'<br>');
            var print='';
            if(m.field_header[j][0]=='_') print='class=c_print';
            txt+="<td data-id="+b+" "+print+" >"+value+"</td>";
        }
        txt+="</tr>";
    }
    $('#grid__ID').html(txt);
    //------------------------------------
    m.cell_process();
}
//-------------------------------------
m.cell_process=function(){
    //cell render
    $('#grid__ID td').each(function(){
        var col = $(this).parent().children().index($(this));
        var row = $(this).parent().parent().children().index($(this).parent())-1; var I=row;
        var column_name=$('#grid__ID th:nth-child('+(col+1)+')').attr('data-header');
        //-------------------------
        if(column_name=='_Form'){
            var data_id=$(this).attr('data-id');
            $(this).css({'color':'#666','padding-left':'8px','padding-right':'8px'})
            $(this).html("<u style='cursor:pointer'><i class='fa fa-pencil-square-o'></i></u>");
            $(this).find('u').on('click',function(){
                m.form_I=row;
                if($vm.module_list[m.form_module]===undefined){
                    alert('Can not find "'+m.form_module+'" in the module list');
                    return;
                }
                $vm.load_module(m.form_module,$vm.root_layout_content_slot,{record:m.records[I]});
            })
        }
        //-------------------------
        if(column_name=='_Delete'){
            $(this).css({'color':'#666','padding-left':'8px','padding-right':'8px'})
            $(this).html("<u style='cursor:pointer'><i class='fa fa-trash-o'></i></u>");
            $(this).find('u').data('ID',m.records[row]._id);
            $(this).find('u').on('click',function(){
                var rid=$(this).data('ID');
                if(confirm("Are you sure to delete?\n")){
                    m.N_total=1;
                    m.delete(rid);
                }
            })
        }
        //-------------------------
        if(m.cell_render!==undefined){ m.cell_render(m.records,row,column_name,$(this)); }
        //-------------------------
        if(column_name=='_Form' || column_name=='_Delete' || column_name=='DateTime' || column_name=='Author' || m.records[row].vm_readonly[column_name]===true){
            if($vm.edge==0) $(this).removeAttr('contenteditable');
            else if($vm.edge==1) $(this).find('div:first').removeAttr('contenteditable');
            $(this).css('background-color','#F8F8F8')
        }
        if(m.records[row].vm_custom[column_name]===true){
            if($vm.edge==0) $(this).removeAttr('contenteditable');
            else if($vm.edge==1) $(this).find('div:first').removeAttr('contenteditable');
        }
    })
    //------------------------------------
    //cell value process
    if($vm.edge==0) $('#grid__ID td').blur(function(){
        var col = $(this).parent().children().index($(this));
        var row = $(this).parent().parent().children().index($(this).parent())-1;
        var column_name=$('#grid__ID th:nth-child('+(col+1)+')').attr('data-header');
        if(column_name=='_Form' || column_name=='_Delete' || m.records[row].vm_custom[column_name]===true){
            return;
        }
        var value=$(this).html().replace(/<div>/g,'').replace(/<\/div>/g,'\n').replace(/<br>/g,'\n');
        var value=$('<div/>').html(value).text();

        if(m.cell_value_process!==undefined) value=m.cell_value_process(value,column_name);
        m.set_value(value,m.records,row,column_name);
        if(m.after_change!==undefined){ m.after_change(m.records,row,column_name,$(this),m.set_value,'grid'); }
    })
    //------------------------------------
    if($vm.edge==1) $('#grid__ID td').find('div:first').blur(function(){
        var col = $(this).parent().parent().children().index($(this).parent()); //edge
        var row = $(this).parent().parent().parent().children().index($(this).parent().parent())-1; //edge
        var column_name=$('#grid__ID th:nth-child('+(col+1)+')').attr('data-header');
        if(column_name=='_Form' || column_name=='_Delete' || m.records[row].vm_custom[column_name]===true){
            return;
        }
        var value=$(this).html().replace(/<div>/g,'').replace(/<\/div>/g,'\n').replace(/<br>/g,'\n');
        var value=$('<div/>').html(value).text();
        if(m.cell_value_process!==undefined) value=m.cell_value_process(value,column_name);
        m.set_value(value,m.records,row,column_name);
        if(m.after_change!==''){ m.after_change(m.records,row,column_name,$(this),m.set_value,'grid'); }
    })
    //------------------------------------
}
//-------------------------------------
m.create_header=function(){
    var cols=m.fields.split(',');
    m.field_header=[];
    m.field_id=[];
    //------------------------------------
    //table
    for(var i=0;i<cols.length;i++){
        var th=cols[i];
        var thA=th.split('|')[0];
        var thB=th.split('|').pop().trim().replace(/ /g,'_');
        //create grid header and id
        m.field_header.push(thA);
        m.field_id.push(thB);
    }
    //-------------------------
}
//-------------------------------------
m.set_value=function(value,records,I,column_name){
    if(value==="" && records[I][column_name]===undefined) return;
    if(value!==records[I][column_name]){
        records[I].vm_dirty=1;
        records[I][column_name]=value;
        $('#save__ID').css('background','#E00');
    }
}
//-----------------------------------------------
m.row_data=function(record){
    var data={};
    for(var i=0;i<m.form_field_id.length;i++){
        var id=m.form_field_id[i];
        data[id]=record[id];
    }
    return data;
}
//-----------------------------------------------
m.delete=function(rid){
    $vm.request({cmd:"delete-table",id:rid},function(res){
        var after_delete=function(){
            if(m.after_update!=undefined){
                m.after_modify(query,res); return;
            }
        }
        m.request_data();
        after_delete();
    });
};
//-------------------------------
m.export_records=function(){
    var g_I,gLoop,busy,results,gDialog_module_id;
	//g_I page number, 0 is first page
    var start=$('#start__ID').val();  if(start==="") start=1;
    var page_size=parseInt($('#page_size__ID').val());
    var num=$('#num__ID').val(); num=parseInt(num);

    if($('#start__ID').val()==undefined || $('#start__ID').val()=="") start=1;
    if($('#page_size__ID').val()==undefined) page_size=30;
    if($('#num__ID').val()==undefined || $('#num__ID').val()=="") num=1;
    var one_loop=function(){
		//page by page (500ms) to get data and save to results
        if(busy==1) return;
        busy=1;

        console.log(g_I)

        var i1=1+(start-1+g_I)*page_size,i2=i1+page_size-1;
        m.set_req_export(i1.toString(),i2.toString());
        $VmAPI.request({data:m.req,callback:function(res){
            busy=0;
            $('#export_num'+gDialog_module_id).text("Page "+(g_I+1).toString());
            if(res.records.length!=0){
                for(var i=0;i<res.records.length;i++){
                    results.push(res.records[i]);
                }
            }
            else{
                end_export();
                return;
            }
            g_I++;
            if(g_I>=num){
                end_export();
                return;
            }
        }})
    }
    //-------------------------------------
    var start_export=function(){
        g_I=0;busy=0;results=[];
        gDialog_module_id=$vm.get_module_id({name:'_system_export_dialog_module'})
        $('#export_num'+gDialog_module_id).text("Page 0");
        $vm.open_dialog({name:'_system_export_dialog_module'});
		gLoop=setInterval(one_loop, 500);
		$vm._export_g_loop=gLoop;
    }
    //-------------------------------------
    var end_export=function(){
        clearInterval(gLoop);
        $vm.close_dialog({name:'_system_export_dialog_module'});
        if(m.fields_e===undefined) m.fields_e=m.fields.replace('_Form,','').replace(',_Delete','');
		m.records=results;
		if(m.data_process!==undefined){ m.data_process(); }
        var fn=m.export_filename;
        if(fn==undefined) fn="F"+m.db_pid+".csv";
        $vm.download_csv({name:fn,data:m.records,fields:m.fields_e});
    }
    //-------------------------------------
    start_export();
}
//---------------------------------------------
$('#search__ID').on('click',function(){   m.set_req(); m.request_data(); })
$('#query__ID').on('click',function(){    m.set_req(); m.request_data(); })
$('#export__ID').on('click',function(){   m.export_records(); })
$("#p__ID").on('click',function(){  var I=$("#I__ID").text();I--; if(I<0) I=0; $("#I__ID").text(I); m.set_req(); m.request_data();})
$("#n__ID").on('click',function(){  var I=$("#I__ID").text();I++; if(I>m.max_I) I=m.max_I; $("#I__ID").text(I); m.set_req(); m.request_data();})
//-------------------------------------
$('#new__ID').on('click', function(){
    if(m.new!=undefined){
        m.new();
        return;
    }
    if(m.form_module!=undefined){
        $vm.load_module(m.form_module,'',{goback:1});
        return;
    }
    if(m.new_process!=undefined){
        if(m.new_process()==false) return;
    }
    var new_records;
    var new_row={}
    for(var i=0;i<m.field_id.length;i++){
        var b=m.field_id[i];
        if(b!=="ID" && b!=="DateTime" && b!=="Author" && b!=="_Form" && b!=="_Delete"){
            new_row[b]="";
        }
    }
    m.records.splice(0, 0, new_row);
    if(m.new_pre_data_process!==undefined){
        m.new_pre_data_process();
    }
    m.render(0);
});
$('#D__ID').on('load',function(){  m.input=$vm.vm['__ID'].input; if(m.preload==true) return; if(m.load!=undefined) m.load(); m.set_req(); m.request_data(); })
$('#D__ID').on('show',function(){  if($vm.refresh==1){$vm.refresh=0; m.set_req(); m.request_data();} })
//-----------------------------------------------
