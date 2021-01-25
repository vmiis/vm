//-------------------------------------
m.item_b_create_header=function(){
    var cols=m.item_b_fields.split(',');
    m.item_b_field_header=[];
    m.item_b_field_id=[];
    //------------------------------------
    //table
    for(var i=0;i<cols.length;i++){
        var th=cols[i];
        var thA=th.split('|')[0];
        var thB=th.split('|').pop().trim().replace(/ /g,'_');
        //create grid header and id
        m.item_b_field_header.push(thA);
        m.item_b_field_id.push(thB);
    }
    //-------------------------
}
//-------------------------------------
m.item_b_render=function(I){
    var start=0;
    var max=m.item_b_records.length;
    if(I!==undefined){
        start=I;
        max=I+1;
    }
    var txt="";
    txt+="<tr><th></th>"
    //-------------------------
    m.item_b_create_header();
    //-------------------------
    for(var i=0;i<m.item_b_field_header.length;i++){
        var print='';
        var header_name=m.item_b_field_header[i];
        if(m.item_b_field_header[i][0]=='_'){
            print='class=c_print';
            header_name=header_name.replace('_','');
        }
        header_name=header_name.replace(/_/g,' ');
        var header_id=m.item_b_field_id[i];
        if(m.item_b_field_header[i]=='_Remove') {txt+="<th "+print+" data-header="+header_id+" style='width:30px;'></th>";}
        else                                    txt+="<th "+print+" data-header="+header_id+">"+header_name+"</th>";
    }
    txt+"</tr>";
    for(var i=0;i<m.item_b_records.length;i++){
        txt+="<tr><td>"+(i+1).toString()+"</td>";
        for(var j=0;j<m.item_b_field_header.length;j++){
            var b=m.item_b_field_id[j];
            var value="";
            if(m.item_b_records[i][b]!==undefined) value=m.item_b_records[i][b];
            value=value.toString();
            value=$('<div/>').text(value).html();
            value=value.replace(/\n/g,'<br>');
            var print='';
            if(m.item_b_field_header[j][0]=='_') print='class=c_print';
            //if($vm.edge==0) txt+="<td data-id="+b+" "+print+" contenteditable>"+value+"</td>";
            //else if($vm.edge==1) 
            txt+="<td data-id="+b+" "+print+" ><div contenteditable>"+value+"</div></td>";
        }
        txt+"</tr>";
    }
    $('#grid_item_b__ID').html(txt);
    //------------------------------------
    m.item_b_cell_process();
    return;
}
//----------------------------------
m.item_b_cell_process=function(){
    //cell render
    $('#grid_item_b__ID td').each(function(){
        var col = $(this).parent().children().index($(this));
        var row = $(this).parent().parent().children().index($(this).parent())-1; var I=row;
        var column_name=$('#grid_item_b__ID th:nth-child('+(col+1)+')').attr('data-header');
        //-------------------------
        if(column_name=='_Remove'){
            $(this).css('color','#666')
            $(this).css('width','50px')
            $(this).html("<u style='cursor:pointer'><i class='fa fa-trash-o'></i></u>");
            $(this).find('u').data('ID',m.item_b_records[row].ID);
            $(this).find('u').on('click',function(){
                m.item_b_records.splice(row, 1);
                m.item_b_render();
                if(m.item_b_after_remove!=undefined) m.item_b_after_remove();
            })
        }
        //-------------------------
        if(m.item_b_cell_render!==undefined){ m.item_b_cell_render(m.item_b_records,row,column_name,$(this),m.item_b_set_value,'grid'); }
        //-------------------------
        /*
        if(m.item_b_records[row].vm_custom[column_name]===true){
            //if($vm.edge==0) $(this).removeAttr('contenteditable');
            //else if($vm.edge==1) 
            $(this).find('div:first').removeAttr('contenteditable');
        }
        */
    })
    //------------------------------------
    //cell value process
    /*
    if($vm.edge==0) $('#grid_item_b__ID td').blur(function(){
        var col = $(this).parent().children().index($(this));
        var row = $(this).parent().parent().children().index($(this).parent())-1;
        var column_name=$('#grid_item_b__ID th:nth-child('+(col+1)+')').attr('data-header');
        if(m.item_b_records[row].vm_custom[column_name]===true){
            return;
        }
        var value=$(this).html().replace(/<div>/g,'').replace(/<\/div>/g,'\n').replace(/<br>/g,'\n');
        var value=$('<div/>').html(value).text();

        if(m.item_b_cell_value_process!==undefined) value=m.item_b_cell_value_process(value,column_name);
        m.item_b_set_value(value,m.item_b_records,row,column_name);
        if(m.item_b_after_change!==undefined){ m.item_b_after_change(m.item_b_records,row,column_name,$(this),m.item_b_set_value,'grid'); }
    })
    //------------------------------------
    if($vm.edge==1)*/ 
    $('#grid_item_b__ID td').find('div:first').blur(function(){
        var col = $(this).parent().parent().children().index($(this).parent()); //edge
        var row = $(this).parent().parent().parent().children().index($(this).parent().parent())-1; //edge
        var column_name=$('#grid_item_b__ID th:nth-child('+(col+1)+')').attr('data-header');
        //if(m.item_b_records[row].vm_custom[column_name]===true){
        //    return;
        //}
        var value=$(this).html().replace(/<div>/g,'').replace(/<\/div>/g,'\n').replace(/<br>/g,'\n');
        var value=$('<div/>').html(value).text();
        if(m.item_b_cell_value_process!==undefined) value=m.item_b_cell_value_process(value,column_name);
        m.item_b_set_value(value,m.item_b_records,row,column_name);
        if(m.item_b_after_change!==''){ m.item_b_after_change(m.item_b_records,row,column_name,$(this),m.item_b_set_value,'grid'); }
    })
    //------------------------------------
}
//-------------------------------------
m.item_b_set_value=function(value,records,I,column_name){
    if(value==="" && records[I][column_name]===undefined) return;
    if(value!==records[I][column_name]){
        records[I][column_name]=value;
        //$('#save__ID').css('background','#E00');
    }
}
//-----------------------------------------------
m.item_b_add=function(){
    var new_records;
    var new_row={}
    for(var i=0;i<m.item_b_field_id.length;i++){
        var b=m.item_b_field_id[i];
        if(b!=="ID" && b!=="_Remove"){
            new_row[b]="";
        }
    }
    m.item_b_records.splice(0, 0, new_row);
    m.item_b_render(0);
};
//-----------------------------------------------
m.item_b_get_data=function(){
    var data=[];
    for(var i=0;i<m.item_b_records.length;i++){
        var one={}
        for(var j=0;j<m.item_b_field_id.length;j++){
            var id=m.item_b_field_id[j];
            if(id[0]!='_') one[id]=m.item_b_records[i][id];
        }
        data.push(one);
    }
    return data;
}
//-----------------------------------------------
