$vm.render_checkbox_field=function(record,mID,$div,html){
    var field=$div.attr('data-id');
    //record.vm_custom[field]=true;
    $div.html(html);
    if(record[field]=="1" || record[field]=="True" || record[field]=="on" ) $div.find('input').prop('checked', true);
    $div.find('input').on('click', function(){
        var value='0';
        if($(this).prop("checked") == true)   value='1';

        if(value==="" && record[field]===undefined) return;
        if(value!==record[field]){
            record.vm_dirty=1;
            record[field]=value;
            $('#save'+mID).css('background','#E00');
        }
    });
}
