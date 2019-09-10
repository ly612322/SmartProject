class Product {
    constructor() {
        //数据存储
        this.tip = false; // 确认删除tip
        this.data = [];
        this.files = []; //选择的所有图片
        this.newfiles = []; //过滤后地图片文件
        this.arr_title = []; //表格的head
        this.fileName = new Set(); //图片
        this.Setkind = new Set(); // 不良模式
        this.pmlist = ''; //品名简称
        this.modelist = ''; //不良模式
        this.fenzelist = ''; //分责
        this.uploadState = false;
        this.offX = 100; // 图片x
        this.offY = 60; //图片y
        this.UID = window.top.SS_UID; // 外层工号
        this.workname = '';
        this.pmindex = '';
        this.badindex = '';


        //页面
        this.inputFile = document.getElementById('inputFile');
        this.fromPlace = document.getElementById('selectFrom');
        this.oneKeyup = document.getElementById('oneKey');
        this.resetBtn = document.getElementById('reset');
        this.displayTable = document.getElementsByClassName('item2')[0];
        this.pinming = document.getElementById('select_品名简称');
        this.mode = document.getElementById('select_模式');
        this.fenze = document.getElementById('select_分责');
        this.reset = document.getElementById('reset');
        this.BigImgDiv = document.getElementsByClassName('BigImg')[0];
        this.BigImgSrc = document.getElementById('BigImgSrc');
        //
        this.selectFile = this.selectFile.bind(this);
        this.QueryPM = this.QueryPM.bind(this);
        this.QueryMode = this.QueryMode.bind(this);
        this.Reset = this.Reset.bind(this);
        this.allUpload = this.allUpload.bind(this);
        this.makeFormData = this.makeFormData.bind(this);
        this.base64toBlob = this.base64toBlob.bind(this);
        this.showpicture = this.showpicture.bind(this);
        this.queryname = this.queryname.bind(this);
        this.find = this.find.bind(this);
        this.inputpm = this.inputpm.bind(this);

        // 
        this.inputFile.addEventListener('change', this.selectFile);
        this.reset.addEventListener('click', this.Reset);
        // this.BigImgSrc.addEventListener('click',this.hiddenImg)
        window.addEventListener('load', this.QueryMode);
        window.addEventListener('load', this.QueryPM);
        window.addEventListener('load', this.queryname)
        this.oneKeyup.addEventListener('click', this.allUpload);
    }
    queryname() {
        let ajax = new XMLHttpRequest();
        ajax.open("post", "/API/DFS/成品检_用户信息查询.py", true)
        ajax.setRequestHeader(
            "Content-Type",
            "application/x-www-form-urlencoded;charset=UTF-8"
        );
        ajax.send("UID=" + this.UID);
        ajax.onload = () => {
            let response = JSON.parse(ajax.response);
            this.workname = response.data[0].姓名;
        }
    }

    selectFile(event) {
        if (this.fromPlace.value == '') {
            alert('请选择来源');
            window.location.reload();
            return
        }
        this.files = event.target.files;
        //表格制作
        this.arr_title = ["简称", "品名简称", "不良代码", "LOT", "SHEET", "PANEL", "PANEL状态", "不良模式", "分责", "上传", "删除", "图一", "图二", "图三", "图四", "图五", "图六", "备注"];
        let table = document.createElement('table');
        table.id = 'tb';
        let t_thead = table.createTHead().insertRow();
        this.arr_title.forEach(element => {
            var h_td = document.createElement('th');
            h_td.style.textAlign = 'center';
            h_td.style.height = '40px';
            h_td.innerHTML = element;
            t_thead.appendChild(h_td)
        });
        let tbody = table.createTBody();
        Array.from(this.files).forEach((element) => {
            let td_简称 = element.name.slice(0, element.name.indexOf('-'));
            //过滤非图片类型
            if (element.type != "image/jpeg") {
                return;
            }
            if (element.name.length < 22) {
                this.fileName.add(element.name.slice(0, td_简称.length + 10))
            } else {
                this.fileName.add(element.name.slice(0, td_简称.length + 21));
            }
            this.newfiles.push(element); //过滤后的files
        });

        this.fileName.forEach(element => {
            let first = this.find(element, '-', 0);
            let second = this.find(element, '-', 1);
            let third = this.find(element, '-', 2);
            let td_简称 = element.slice(0, first);
            let td_不良 = element.slice(first + 1, second);
            let trtd = tbody.insertRow();
            if (element.slice(second + 1, third) == 0) { // 无LOT号
                trtd.insertCell().innerHTML = td_简称; //简称
                let um_select = document.createElement('select');
                um_select.id = 'select_品名简称';
                um_select.innerHTML = this.pmlist;
                trtd.insertCell().appendChild(um_select);
                trtd.insertCell().innerHTML = td_不良 //不良
                trtd.insertCell().innerHTML = '0' //LOT
                trtd.insertCell().innerHTML = '' //SHEET
                trtd.insertCell().innerHTML = '' //PANEL
                trtd.insertCell().innerHTML = element.slice(third + 1, third + 3) //PANEL状态

            } else {
                trtd.insertCell().innerHTML = td_简称; //简称
                let um_select = document.createElement('select');
                um_select.id = 'select_品名简称';
                um_select.innerHTML = this.pmlist;
                trtd.insertCell().appendChild(um_select);
                trtd.insertCell().innerHTML = td_不良; //不良
                trtd.insertCell().innerHTML = element.slice(second + 1, second + 9); //LOT
                trtd.insertCell().innerHTML = element.slice(second + 9, second + 11); //SHEET
                trtd.insertCell().innerHTML = element.slice(second + 11, second + 13); //PANEL
                trtd.insertCell().innerHTML = element.slice(third + 1, third + 3); //PANEL状态
            }
            let um_select1 = document.createElement('select');
            um_select1.id = 'select_模式';
            um_select1.innerHTML = this.modelist;
            um_select1.addEventListener('change', function (event) {
                let target = event.target;
                if (target == um_select1) {
                    let ajax = new XMLHttpRequest();
                    ajax.open("post", "/API/DFS/成品检_不良模式_修改.py", true);
                    ajax.send();
                    ajax.onload = () => {
                        let response = JSON.parse(ajax.response);
                        let data = response.data;
                        this.fenzelist = `<option value=''></option>`;
                        Array.from(data).forEach(element => {
                            if (element['不良模式'] == um_select1.value) {
                                this.fenzelist = this.fenzelist + `<option>${element['分责']}</option>`;
                            }
                        })
                        let content = um_select1.parentNode.parentNode.childNodes[8].childNodes[0];
                        content.innerHTML = this.fenzelist;

                    }
                }
            });
            trtd.insertCell().appendChild(um_select1);
            let um_select2 = document.createElement('select');
            um_select2.id = 'select_分责';
            um_select2.style.width = '75px';
            trtd.insertCell().appendChild(um_select2);
            let um_input = document.createElement('input');
            um_input.type = 'button';
            um_input.id = 'btn_上传';
            um_input.value = '等待上传';
            um_input.classList.add('uploadbtn');
            um_input.style.margin = '0 auto';
            trtd.insertCell().appendChild(um_input);
            um_input.addEventListener('click', (event) => {
                let target = event.target;
                if (target == um_input) {
                    let uploadImg = new Object();
                    this.uploadState = false;
                    let context = um_input2.parentNode.parentNode.childNodes;
                    this.arr_title.forEach((element, index) => {
                        switch (index) {
                            case 1:
                                uploadImg[element] = context[index].childNodes[0].value;
                                break;
                            case 7:
                                uploadImg[element] = context[index].childNodes[0].value;
                                break;
                            case 8:
                                uploadImg[element] = context[index].childNodes[0].value;
                                break;
                            case 9:
                                break;
                            case 10:
                                break;
                            case 11:
                            case 12:
                            case 13:
                            case 14:
                            case 15:
                            case 16:
                                let b64Data = context[index].childNodes[0].getAttribute('src');
                                let imgname = context[index].childNodes[0].getAttribute('name');
                                if (b64Data != 'errorImg.png') {
                                    b64Data = b64Data.substring(b64Data.indexOf(',') + 1);
                                    let blobData = this.base64toBlob(b64Data, Blob);
                                    let fileData = new File([blobData], "filename");
                                    if (fileData.size == 0) {
                                        break
                                    } else {
                                        uploadImg[element] = fileData;
                                        uploadImg[`file_name${index-10}`] = imgname;
                                        break
                                    }
                                } else {
                                    break
                                }
                                case 17:
                                    uploadImg[element] = context[index].childNodes[0].value;
                                    uploadImg[element] = uploadImg[element].replace(/^\s|&quot;|'$/, '').replace(/\n/g, '-').replace(/\r/g, '-').replace(/\t/g, '-').replace(/,/g, '，').replace(/\\/g, '/');
                                    break;
                                default:
                                    uploadImg[element] = context[index].innerHTML;
                        }
                    })
                    let formData = new FormData();
                    this.makeFormData(uploadImg, formData);
                    formData.set('来源', this.fromPlace.value);
                    if (formData.get('品名简称') == '' || formData.get('不良模式') == '' || formData.get('分责') == '') {
                        alert('请完善上传信息')
                        return
                    }
                    context[9].childNodes[0].value = '上传中...'
                    let changeDate = new Date();
                    changeDate.setTime(changeDate.getTime());
                    let YEAR2 = changeDate.getFullYear();
                    let MONTH2 = changeDate.getMonth() + 1;
                    let DAY2 = changeDate.getDate();
                    let HOUR = changeDate.getHours();
                    let MIN = changeDate.getMinutes();
                    let SEC = changeDate.getSeconds();
                    if (MONTH2 < 10) MONTH2 = "0" + MONTH2;
                    if (DAY2 < 10) DAY2 = "0" + DAY2;
                    if (HOUR < 10) HOUR = "0" + HOUR;
                    if (MIN < 10) MIN = "0" + MIN;
                    if (SEC < 10) SEC = "0" + SEC;
                    let time = YEAR2 + "-" + MONTH2 + "-" + DAY2 + " " + HOUR + ":" + MIN + ":" + SEC;
                    formData.append('UP_DATE', time);
                    formData.append('创建时间', time);
                    formData.append('工号', this.UID);
                    formData.append('姓名', this.workname);
                    let ajax = new XMLHttpRequest();
                    ajax.open("post", "/API/DFS/成品检上传_解析数据.py", true);
                    ajax.send(formData);
                    ajax.onload = () => {
                        let response = JSON.parse(ajax.response);
                        let data = response.state;
                        context[9].childNodes[0].value = data;
                        context[9].childNodes[0].style.backgroundColor = '#009688';
                        context[9].childNodes[0].style.cursor = 'not-allowed';
                        context[9].childNodes[0].setAttribute('disabled', true);

                        return this.uploadState = true;
                    }
                }
            })
            let um_input2 = document.createElement('input');
            um_input2.type = 'button';
            um_input2.id = 'btn_删除';
            um_input2.value = '删除';
            um_input2.classList.add('deletebtn');
            um_input2.style.margin = '0 auto';
            trtd.insertCell().appendChild(um_input2);
            um_input2.addEventListener('click', (event) => {
                var tips = confirm("确认删除吗？")
                if (tips) {
                    let target = event.target;
                    if (target == um_input2) {
                        let content = um_input2.parentNode.parentNode;
                        content.parentNode.removeChild(content);
                    }
                } else {
                    return
                }
            });
            //图片位置
            let um_pic = document.createElement('img');
            um_pic.classList = 'um_picture';
            um_pic.src = '';
            um_pic.onerror = (um_pic.src = 'errorImg.png');
            var td = trtd.insertCell();
            td.style.width = '10%';
            td.appendChild(um_pic);
            let um_pic2 = document.createElement('img');
            um_pic2.classList = 'um_picture';
            um_pic2.src = '';
            um_pic2.onerror = (um_pic2.src = 'errorImg.png');
            var td = trtd.insertCell();
            td.style.width = '10%';
            td.appendChild(um_pic2);
            let um_pic3 = document.createElement('img');
            um_pic3.classList = 'um_picture';
            um_pic3.src = '';
            um_pic3.onerror = (um_pic3.src = 'errorImg.png');
            var td = trtd.insertCell();
            td.style.width = '10%';
            td.appendChild(um_pic3);
            let um_pic4 = document.createElement('img');
            um_pic4.classList = 'um_picture';
            um_pic4.src = '';
            um_pic4.onerror = (um_pic4.src = 'errorImg.png');

            var td = trtd.insertCell();
            td.style.width = '10%';
            td.appendChild(um_pic4);
            let um_pic5 = document.createElement('img');
            um_pic5.classList = 'um_picture';
            um_pic5.src = '';
            um_pic5.onerror = (um_pic5.src = 'errorImg.png');
            var td = trtd.insertCell();
            td.style.width = '10%';
            td.appendChild(um_pic5);
            let um_pic6 = document.createElement('img');
            um_pic6.classList = 'um_picture';
            um_pic6.src = '';
            um_pic6.onerror = (um_pic6.src = 'errorImg.png');
            var td = trtd.insertCell();
            td.style.width = '10%';
            td.appendChild(um_pic6);
            let um_input3 = document.createElement('input');
            um_input3.type = 'text';
            um_input3.classList = '';
            um_input3.style.margin = '0 auto';
            um_input3.style.width = '100%';
            um_input3.style.height = '100%';
            um_input3.style.border = '0';
            var td = trtd.insertCell();
            td.style.width = '10%';
            td.appendChild(um_input3);
        })
        this.displayTable.append(table);
        var rows1 = document.getElementsByTagName('tr');
        var flag1;
        Array.from(rows1)
            .forEach(element => {
                element.onclick = function () {
                    flag1 ? flag1.style.backgroundColor = '' : '';
                    element.style.backgroundColor = '#D3D3D3';
                    flag1 = element;
                }
            });
        Array.from(rows1).forEach((ele, index) => {
            if (index == 0) {
                return false
            }
            let tdpm = ele.childNodes[1];
            let pm = ele.childNodes[1].childNodes[0];
            let tdkind = ele.childNodes[7];
            let kind = ele.childNodes[7].childNodes[0];
            let _ = true;
            let flag = true;
            tdpm.onclick = () => {
                if (!_) return;
                if (pm.value == '') {
                    if (this.pmindex != '') {
                        let option = pm.options;
                        option[this.pmindex].selected = true;
                    }
                }
                _ = false;
            }
            pm.onchange = () => {
                this.pmindex = pm.selectedIndex;
            }
            tdkind.onclick = () => {
                if (!flag) return;
                if (kind.value == '') {
                    if (this.badindex != '') {
                        let option = kind.options;
                        option[this.badindex].selected = true;
                    }
                }
                flag = false
            }
            kind.onchange = () => {
                this.badindex = kind.selectedIndex;
            }
        });

        // Array.from(rows1).forEach((element, index) => {
        //     if (index == 0) {
        //         return false
        //     }
        //     let newpm = element.childNodes[1];
        //     newpm.innerHTML = '';
        //     let um_select = document.createElement('select');
        //     um_select.id = 'select_品名简称';
        //     um_select.innerHTML = this.pmlist;
        //     newpm.appendChild(um_select);
        // })
        //图片插入
        for (let i = 1; i <= [...this.fileName].length; i++) {
            let tableLot = table.rows[i].cells[2].innerHTML + '-' //表格内LOT+SHEET+PANEL
                +
                table.rows[i].cells[3].innerHTML + table.rows[i].cells[4].innerHTML +
                table.rows[i].cells[5].innerHTML + '-' + table.rows[i].cells[6].innerHTML;
            let tableNoLot = table.rows[i].cells[0].innerHTML + '-' //表格内无LOT号 取到0
                +
                table.rows[i].cells[2].innerHTML + '-' +
                table.rows[i].cells[3].innerHTML;

            for (let j = 0; j < this.newfiles.length; j++) { //循环筛选过的图片
                let first = this.find(this.newfiles[j].name, '-', 0);
                let second = this.find(this.newfiles[j].name, '-', 1);
                let third = this.find(this.newfiles[j].name, '-', 2);
                let td_简称 = this.newfiles[j].name.slice(0, first);
                if (this.newfiles[j].name.length < 22) { //图片名小于22认为无LOT号
                    let LOTNO = this.newfiles[j].name.slice(0, second + 2); //     
                    if (LOTNO == tableNoLot) { //无LOT号图片上传
                        let reader = new FileReader();
                        reader.readAsDataURL(this.newfiles[j]);
                        reader.onload = () => {
                            let result = reader.result;
                            for (let x = 11; x < 17; x++) {
                                let pic = table.rows[i].cells[x].childNodes[0];
                                if (pic.getAttribute('src') == 'errorImg.png') {
                                    pic.setAttribute('src', result);
                                    pic.setAttribute('name', this.newfiles[j].name)
                                    // pic.dataset.blobs = blob;
                                    break
                                }
                            }
                        }
                    }
                }
                if (this.newfiles[j].name.length > 21) {
                    // let LotPanelS = this.newfiles[j].name.slice(td_简称.length + 1, td_简称.length + 19);
                    let LotPanelS = this.newfiles[j].name.slice(first + 1, third + 3);
                    if (tableLot == LotPanelS) {
                        let reader = new FileReader();
                        reader.readAsDataURL(this.newfiles[j]);
                        reader.onload = () => {
                            let result = reader.result;
                            for (let x = 11; x < 17; x++) {
                                let pic = table.rows[i].cells[x].childNodes[0];
                                if (pic.getAttribute('src') == 'errorImg.png') {
                                    pic.setAttribute('src', result);
                                    pic.setAttribute('name', this.newfiles[j].name)
                                    // pic.dataset.blobs = blob;
                                    break
                                }
                            }
                        }
                    }
                }
            }
        }
        let Img = document.getElementsByTagName('img');
        Array.from(Img).forEach(ele => {
            ele.onclick = () => {
                this.BigImgDiv.style.display = 'block';
                if (ele.src == 'http://10.1.10.234/DFS/errorImg.png') {
                    this.BigImgSrc.src = '';
                    this.BigImgDiv.style.display = 'none';
                } else {
                    this.BigImgSrc.src = ele.src;
                    this.showpicture();
                }
            }

            // if (ele.src == 'http://10.1.10.211/DFS/errorImg.png') {
            //     this.BigImgSrc.src = '';
            //     this.BigImgDiv.style.display = 'none';
            // }
            // else {
            //     if (this.BigImgDiv.style.display == 'block') {
            //         this.BigImgSrc.src = '';
            //         this.BigImgDiv.style.display = 'none';
            //     } else {
            //         this.BigImgDiv.style.display = 'block';
            //         this.BigImgSrc.src = ele.src;
            //         this.showpicture();
            //     }
            // }

        })
    }
    //品名简称
    QueryPM() {
        let ajax = new XMLHttpRequest();
        ajax.open("post", "../API/DFS/成品检_品名简称修改.py", true);
        ajax.send();
        ajax.onload = () => {
            let response = JSON.parse(ajax.response);
            let data = response.data;
            let Data = new Set();
            data.forEach(ele => {
                Data.add(ele['简称'])
            });
            this.pmlist = `<option value=''></option>`;
            Array.from(Data).forEach(Element => {
                this.pmlist = this.pmlist + `<option>${Element}</option>`;
            });

        }
    }
    //模式
    QueryMode() {
        let ajax = new XMLHttpRequest();
        ajax.open("post", "/API/DFS/成品检_不良模式_修改.py", true);
        ajax.send();
        ajax.onload = () => {
            let response = JSON.parse(ajax.response);
            this.data = response.data;
            this.modelist = `<option value=''></option>`;
            Array.from(this.data).forEach((Element) => {
                this.Setkind.add(Element['不良模式']);
            });
            this.Setkind = [...this.Setkind];
            this.Setkind.forEach(element => {
                this.modelist = this.modelist + `<option>${element}</option>`;
            })
        }
    }
    //清空
    Reset() {
        window.location.reload();
    }
    //MAP转对象
    // strMapToObj(strMap) {
    //     let obj = Object.create(null);
    //     for (let [k, v] of strMap) {
    //         obj[k] = v;
    //     }
    //     return obj;
    // }

    //一键上传
    allUpload() {
        let table = document.getElementById('tb');
        // console.log([...this.fileName].length);
        for (let i = 1; i < [...this.fileName].length + 1; i++) {
            let tr = table.rows[i]
            let uploadBtn = tr.cells[9].childNodes[0];
            let e = document.createEvent("MouseEvents");
            e.initEvent("click", true, true);
            uploadBtn.dispatchEvent(e);
            // deleteBtn.dispatchEvent(e);
        }
    }
    //对象转formdata
    makeFormData(obj, form_data) {
        var data = [];
        if (obj instanceof File) {
            data.push({
                key: "",
                value: obj
            });
        } else if (obj instanceof Array) {
            for (var j = 0, len = obj.length; j < len; j++) {
                var arr = this.makeFormData(obj[j]);
                for (var k = 0, l = arr.length; k < l; k++) {
                    var key = !!form_data ? j + arr[k].key : "[" + j + "]" + arr[k].key;
                    data.push({
                        key: key,
                        value: arr[k].value
                    })
                }
            }
        } else if (typeof obj == 'object') {
            for (var j in obj) {
                var arr = this.makeFormData(obj[j]);
                for (var k = 0, l = arr.length; k < l; k++) {
                    var key = !!form_data ? j + arr[k].key : "[" + j + "]" + arr[k].key;
                    data.push({
                        key: key,
                        value: arr[k].value
                    })
                }
            }
        } else {
            data.push({
                key: "",
                value: obj
            });
        }
        if (!!form_data) {
            // 封装
            for (var i = 0, len = data.length; i < len; i++) {
                form_data.append(data[i].key, data[i].value)
            }
        } else {
            return data;
        }
    }

    base64toBlob(base64, type) {
        // 将base64转为Unicode规则编码
        let bstr = atob(base64, type),
            n = bstr.length,
            u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n) // 转换编码后才可以使用charCodeAt 找到Unicode编码
        }
        return new Blob([u8arr])
    }
    //图片展示
    showpicture() {
        var oDiv = document.getElementById("BigImgSrc");
        oDiv.style.left = this.offX;
        oDiv.style.top = this.offY;
        oDiv.onmousedown = function (ev) {
            var oEvent = ev;
            var disX = oEvent.clientX - oDiv.offsetLeft;
            var disY = oEvent.clientY - oDiv.offsetTop;
            document.onmousemove = function (ev) {
                oEvent = ev;
                oDiv.style.left = oEvent.clientX - disX + "px";
                oDiv.style.top = oEvent.clientY - disY + "px";

                this.offX = oEvent.clientX - disX + "px";
                this.offY = oEvent.clientY - disY + "px";

            }
            document.onmouseup = function () {
                document.onmousemove = null;
                document.onmouseup = null;
            }
        }
    }
    //查找字符串位置
    find(str, cha, num) {
        var x = str.indexOf(cha);
        for (var i = 0; i < num; i++) {
            x = str.indexOf(cha, x + 1);
        }
        return x;
    }
    //品名简称填入
    inputpm() {
        let tr = document.getElementsByTagName('tr');
        let table = document.getElementById('tb');
        for (let i = 0; i < tr.length - 1; i++) {
            let tdpm = table.rows[i].cells[2];
            tdpm.onclick = () => {
                alert(1)
            }
        }
    }

}
new Product();