$('#select_工段').change(function(){
    $.ajax({
        type: "post",
        url: "../API/DFS/工程检_不良模式.py",
        data:{
            工段:$('#select_工段').val()
        },
        dataType: "json",
        success: function (response) {
            var data = response.data;
            var state = response.state;
            if (state == "") {
                list = data.split(",");
                var insert = '<option value="">不限</option>';
                for (i = 0; i < list.length; i++) {
                    insert = insert + "<option>" + list[i] + "</option>";
                }
                $('#select_不良模式').html(insert);
                $('#re_select_不良模式').html(insert);
                $('.selectpicker').selectpicker('refresh')
            }
            return list;
        }
    });
});

function 查询(){
    document.getElementById('dis_table').innerHTML = '';
    document.getElementById("progressbar").style.visibility = "visible";
    $.ajax({
        type: "post",
        url: "../API/DFS/工程检_不良数据.py",
        data:{
            开始日期:$('#input_开始').val(),
            结束日期:$('#input_结束').val(),
            品名:$('#input_品名').val(),
            LOT:$('#input_LOT').val(),
            工段:$('#select_工段').val(),
            不良模式:$('#select_不良模式').val(),
        },
        dataType: "json",
        success: function (response) {
            var data = response.data;
            var t = AVIC_JSON_TO_TABLE(data, ["工段", "LOT", "SHEET", "PANEL", "品名", "日期", "工号","姓名", "不良模式", "图片","备注"],'tb');
            document.getElementById("dis_table").innerHTML = t;
            AVIC_TABLE();
            var rows1 = document.getElementsByTagName('tr');
            var flag1;
            Array.from(rows1)
                .forEach(element => {
                    element.onclick = function () {
                        flag1 ? flag1.style.backgroundColor = '' : '';
                        element.style.backgroundColor = 'rgb(162, 213, 255)';
                        flag1 = element;
                    }
                });
            document.getElementById("progressbar").style.visibility = "hidden";
        }
    });

}
//图片展示
function showpicture(url,obj) {
    var api = "http://10.1.10.211/API/SS/ftp_image.py";
    var ftpurl = url;
    if(ftpurl.substr(0, 1) == "h"){
        document.getElementById("ftp_picture").src = ftpurl;
    }
    else{
    ftpurl = ftpurl.replace('http','ftp');
    ftpurl = ftpurl.replace('10.1.10.229','10.1.10.102');
    var ftpsrc = SS.ftp_image({
        ID: 'ftp_picture',
        API: api,
        URL: ftpurl
    })
}
    document.getElementById("ftp_picture").src = ftpsrc;
}
function showtext(obj){
    var Content = obj.parentNode.parentNode.childNodes;
    $('#dis_LOT').val(Content[1].innerText);
    $('#dis_SHEET').val(Content[2].innerText);
    $('#dis_PANEL').val(Content[3].innerText);
    $('#dis_工号').val(Content[6].innerText);
    $('#dis_姓名').val(Content[7].innerText);
    $('#old_不良模式').val(Content[8].innerText);
}
function 删除() {
    document.getElementById("ftp_picture").src = '';
}

//
function AVIC_TABLE() {
    $("#tb").bootstrapTable({
        striped: true, //是否显示行间隔色
        height: 703,
        sortable: true, //是否排序
        search: false, //是否显示表格搜索，此搜索是客户端搜索，不会进服务端
        strictSearch: false, //是否显示刷新
        showColumns: false, //是否显示所有的列
        showRefresh: false, //是否显示刷新按钮
        clickToSelect: true,
        pagination: false, //分页
        // minimumCountColumns: 2, //最少允许的列数
    })
}
var day1 = new Date();
    day1.setTime(day1.getTime()-24*60*60*1000);
    YEAR1 = day1.getFullYear();
    MONTH1 = day1.getMonth()+1;
    DAY1 = day1.getDate();
    if (MONTH1<10) MONTH1 = "0" + MONTH1;
    if (DAY1<10) DAY1 = "0" + DAY1;

    var s1 = YEAR1+"-" + MONTH1 + "-" + DAY1;

    var day2 = new Date();
    day2.setTime(day2.getTime());
    YEAR2 = day2.getFullYear();
    MONTH2 = day2.getMonth()+1;
    DAY2 = day2.getDate();
    if (MONTH2<10) MONTH2 = "0" + MONTH2;
    if (DAY2<10) DAY2 = "0" + DAY2;

    var s2 = YEAR2+"-" + MONTH2 + "-" + DAY2 ;

    document.getElementById("input_开始").value = s1;
    document.getElementById("input_结束").value = s2;