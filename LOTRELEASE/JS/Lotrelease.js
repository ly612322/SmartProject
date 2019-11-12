class LotRelease {
    constructor() {
        //纵向表头
        this.arrTitle = ['品名', '型号', '面取数', 'LOT NO', '投入日期'];
        this.gpr = ['日期', '目标', '不良率', 'PR异物_G', '模糊G断_G'];
        this.gpvd = ['目标', '不良率', 'Sputter异物_G', '模糊G断_G'];
        this.dpr = ['日期', '目标', '不良率', 'D无核片状', 'PR不定型大面积', 'I无核圆形或片状'];
        this.dpvd = ['目标', '不良率', '模糊状D断', '模糊G断', '线状异物'];
        this.ddet = ['目标', '不良率', 'a-si残留'];
        this.dcvd = ['目标', '不良率', '三层异物'];
        this.skpr = ['日期', '目标', '号机', 'KITO残(S1-20)', 'KITO残(S1-4)'];
        this.scpr = ['日期', '目标', '号机', 'PA光刻胶缺失(S1-4)'];
        this.spipr = ['日期', '目标', '号机', '残留'];
        this.vi = ['日期', '目标', '不良率', 'CK', 'CI', 'TN', 'TK'];
        this.vt = ['日期', '目标', '不良率', 'Top 1', 'Top 2', 'Top 3', 'Top 4', 'Top 5', '异常处置记录'];
        this.sxlv = ['日期', '目标良率', 'Lot良率', 'S5', 'S6', 'L1', 'L2', 'LD', '黑名单'];
        this.et2 = ['日期', 'ID', '解析', 'PPM'];
        this.queryform = document.forms['formdata'];
        //
        this.maxlength = '';

        //元素
        this.badkind = document.getElementById('kind');
        this.submitBtn = document.getElementById('submitbtn');
        // this.resetBtn = document.getElementById('resetbtn');
        this.downloadBtn = document.getElementById('download');
        this.displatyTable = document.getElementById('displayTable');
        this.clonetable = document.getElementById('clonethead');
        this.progressbar = document.getElementById('progressbar');
        this.displatyarea = document.getElementsByClassName('container2')[0];
        this.clonecol = document.getElementById('clonecol');
        this.gongduan = document.getElementById('stage');
        this.lotno = document.getElementById('lotNo');
        //方法
        this.createtable = this.createtable.bind(this);
        this.createtablespan = this.createtablespan.bind(this);
        this.querytable = this.querytable.bind(this);
        // this.querybadkind = this.querybadkind.bind(this);
        // this.reset = this.reset.bind(this);
        this.download = this.download.bind(this);
        //事件
        this.queryform.addEventListener('submit', this.querytable);
        // this.resetBtn.addEventListener('click', this.reset);
        this.downloadBtn.addEventListener('click', this.download);
        this.gongduan.addEventListener('change', this.querybadkind);
        // window.addEventListener('mousewheel', this.winScroll)
    }

    // querybadkind() {
    //     let ajax = new XMLHttpRequest();
    //     ajax.open("post", "../API/DFS/工程检_不良模式.py", true);
    //     ajax.setRequestHeader(
    //         "Content-Type",
    //         "application/x-www-form-urlencoded;charset=UTF-8"
    //     );
    //     ajax.send("工段=" + this.gongduan.value);
    //     ajax.onload = () => {
    //         let response = JSON.parse(ajax.response);
    //         let data = response.data;
    //         data = data.split(",");
    //         let list = `<option value=''></option>`;
    //         Array.from(data).forEach(Element => {
    //             list = list + `<option>${Element}</option>`;
    //         })
    //         this.badkind.innerHTML = list;
    //     }
    // }

    querytable(event) {
        event.preventDefault();
        //表头数据
        let Hdata = {
            data: '',
            inputdate: [],
            lot: [],
            pm: [],
            mqs: [],
            jc: []

        }
        //G检
        let Gdata = {
            lot: [],
            data: '',
            state: "",
            datalot: [],
            badPatterns: [],
            alldata: [],
            target: []
        }
        //D检
        let Ddata = {
            lot: [],
            datalot: [],
            data: '',
            state: "",
            badPatterns: [],
            target: [],
            alldata: [],
        }
        //中试线
        let Zdata = {
            data: '',
            state: "",
            lot: [],
            oneVt: {
                lot: [],
                clonelot: [],
                data: [],
                badPatterns: [],
                target: [],
                alldata: [],
            },
            twoVt: {
                lot: [],
                clonelot: [],
                data: [],
                badPatterns: [],
                target: [],
                alldata: [],
            }
        }
        let _that = this;
        this.maxlength = ''
        this.progressbar.style.display = 'block';
        this.displatyTable.innerHTML = '';
        this.clonetable.innerHTML = '';
        let formData = new FormData(this.queryform);
        let Headajax = $.ajax({
            type: "post",
            url: "../API/LOT RELEASE/表头.py",
            data: formData,
            processData: false,
            contentType: false,
            dataType: "json",
            success: function success(response) {
                Hdata.data = response.data;
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert(textStatus);
            },
        })
        let Gajax = $.ajax({
            type: "post",
            url: "../API/LOT RELEASE/LOTRELEASE_G检数据.py",
            data: formData,
            processData: false,
            contentType: false,
            dataType: "json",
            success: function success(response) {
                Gdata.data = response.data;
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert(textStatus);
            },
        })
        let Dajax = $.ajax({
            type: "post",
            url: "../API/LOT RELEASE/LOTRELEASE_D检数据.py",
            data: formData,
            processData: false,
            contentType: false,
            dataType: "json",
            success: function success(response) {
                Ddata.data = response.data;

            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert(textStatus);
            },
        })
        let Zajax = $.ajax({
            type: "post",
            url: "../API/LOT RELEASE/中试线LOT良率.py",
            data: formData,
            processData: false,
            contentType: false,
            dataType: "json",
            success: function success(response) {
                Zdata.data = response.data;

            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert(textStatus);
            },
        })
        $.when(Headajax, Gajax, Dajax, Zajax).done(function () {
            if (Gdata.data && Ddata.data == "") {
                alert("查询无数据")
                _that.progressbar.style.display = 'none';
                return
            }
            //处理表头
            for (let i = 0; i < Hdata.data.length; i++) {
                Hdata.lot.push(Hdata.data[i].LOT);
                Hdata.pm.push(Hdata.data[i].品名);
                Hdata.mqs.push(parseInt(Hdata.data[i].面取数));
                Hdata.jc.push(Hdata.data[i].简称);
                Hdata.inputdate.push((Hdata.data[i].投入日期).slice(0, 10));
            }
            let titledata = [Hdata.pm, Hdata.jc, Hdata.mqs, Hdata.lot, Hdata.inputdate];

            //取工段数组最长的作为表格的长度
            //获取各工段lot，之后根据所选工段的lot进行位置匹配，没有的lot填入空白
            for (let i in Gdata.data) {
                Gdata.lot.push(Gdata.data[i].LOT);
            }
            for (let i in Ddata.data) {
                Ddata.lot.push(Ddata.data[i].LOT);
            }
            for (let i in Zdata.data) {
                Zdata.lot.push(Zdata.data[i].LOT);
            }
            Zdata.lot = [...new Set(Zdata.lot)]

            //G工段处理 ###################################################################################################
            if (_that.gongduan.value == "G") {
                //处理G数据
                _that.maxlength = Gdata.data.length; // 别的工段按G的长度生成表格
                //取首列不良模式
                for (let key in Gdata.data[0]) {
                    Gdata.badPatterns.push(key)
                }
                Gdata.badPatterns = Gdata.badPatterns.splice(1, Gdata.badPatterns.length); //去除LOT
                //获取不良模式对应的数据并插入目标
                for (let j = 0; j < Gdata.badPatterns.length; j++) {
                    let temp = []
                    for (let i = 0; i < Gdata.data.length; i++) {
                        Gdata.target.push('1%'); //  目标
                        temp.push(Gdata.data[i][Object.keys(Gdata.data[i])[j + 1]])
                    }
                    Gdata.alldata.push(temp)
                }
                Gdata.target.length = _that.maxlength
                Gdata.alldata.unshift(Gdata.target)
                Gdata.badPatterns.unshift('目标');
                //D匹配G 
                let cloneGlot = [...Gdata.lot] //复制G的lot
                let dlotIndex = Ddata.lot.map(ele => cloneGlot.indexOf(ele)) //D中lot号在G中的位置下标
                for (let i in cloneGlot) {
                    if (dlotIndex.includes(Number(i)) == false) { //遍历G中下标，在D中没有的填为空
                        cloneGlot[i] = ''
                    }
                }
                Ddata.lot = cloneGlot; //将克隆的G数据赋给D
                //取D检所有不良模式
                for (let [k, v] of Object.entries(Ddata.data)) {
                    Ddata.datalot.push(v.LOT)
                }
                for (let key in Ddata.data[0]) {
                    Ddata.badPatterns.push(key)
                }
                Ddata.badPatterns = Ddata.badPatterns.splice(1, Ddata.badPatterns.length);
                //取出不良模式对应的数据，当lot为空时，也填入空
                for (let i = 0; i < Ddata.badPatterns.length; i++) {
                    let temp = []
                    for (let j = 0; j < Ddata.lot.length; j++) {
                        if (Ddata.lot[j] == '') {
                            temp[j] = ''
                            Ddata.target.push('1%'); //  目标
                        } else {
                            Ddata.target.push('1%'); //  目标
                            let lotindex = Ddata.datalot.indexOf(Ddata.lot[j]) //匹配后的lot在原始lot中的位置                         
                            temp[j] = Ddata.data[lotindex][Object.keys(Ddata.data[lotindex])[i + 1]]
                        }
                    }
                    Ddata.alldata.push(temp)
                }
                Ddata.target.length = _that.maxlength
                Ddata.alldata.unshift(Ddata.target)
                Ddata.badPatterns.unshift('目标');
                //中试线匹配G
                //中试线数据处理
                //1.取出一二次Vt的LOt
                for (let i = 0; i < Zdata.data.length; i++) {
                    if (Zdata.data[i].作业工序 == "1次VT") {
                        Zdata.oneVt.lot.push(Zdata.data[i].LOT)
                    } else {
                        Zdata.twoVt.lot.push(Zdata.data[i].LOT)
                    }
                }
                Zdata.oneVt.lot = [...new Set(Zdata.oneVt.lot)] // 去重
                Zdata.twoVt.lot = [...new Set(Zdata.twoVt.lot)]
                //将数据按1Vt 2Vt分类，合并相同lot及不良代码等
                for (let i = 0; i < Zdata.oneVt.lot.length; i++) {
                    let temp = {}
                    for (let j = 0; j < Zdata.data.length; j++) {
                        if (Zdata.data[j].LOT == Zdata.oneVt.lot[i] && Zdata.data[j].作业工序 == '1次VT') {
                            temp.LOT = Zdata.data[j].LOT
                            temp.作业工序 = Zdata.data[j].作业工序
                            temp.作业总数 = Zdata.data[j].作业总数
                            temp.良率 = Zdata.data[j].良率
                            temp[Zdata.data[j].不良代码] = Zdata.data[j].不良率
                        }
                    }
                    Zdata.oneVt.data.push(temp)
                }
                for (let i = 0; i < Zdata.twoVt.lot.length; i++) {
                    let temp = {}
                    for (let j = 0; j < Zdata.data.length; j++) {
                        if (Zdata.data[j].LOT == Zdata.twoVt.lot[i] && Zdata.data[j].作业工序 == '2次VT') {
                            temp.LOT = Zdata.data[j].LOT
                            temp.作业工序 = Zdata.data[j].作业工序
                            temp.作业总数 = Zdata.data[j].作业总数
                            temp.良率 = Zdata.data[j].良率
                            temp[Zdata.data[j].不良代码] = Zdata.data[j].不良率
                        }
                    }
                    Zdata.twoVt.data.push(temp)
                }
                //和G匹配1Vt 和 2VT的lot，顺序对应，没有的补空
                let onecloneZlot = [...Gdata.lot]
                let onezlotIndex = Zdata.oneVt.lot.map(ele => onecloneZlot.indexOf(ele)) //D中lot号在G中的位置下标
                for (let i in onecloneZlot) {
                    if (onezlotIndex.includes(Number(i)) == false) { //遍历G中下标，在D中没有的填为空
                        onecloneZlot[i] = ''
                    }
                }
                let twocloneZlot = [...Gdata.lot]
                let twozlotIndex = Zdata.twoVt.lot.map(ele => twocloneZlot.indexOf(ele)) //D中lot号在G中的位置下标
                for (let i in twocloneZlot) {
                    if (twozlotIndex.includes(Number(i)) == false) { //遍历G中下标，在D中没有的填为空
                        twocloneZlot[i] = ''
                    }
                }
                Zdata.oneVt.clonelot = onecloneZlot;
                Zdata.twoVt.clonelot = twocloneZlot;
                //取中试线1VT所有不良模式
                for (let key in Zdata.oneVt.data[0]) {
                    Zdata.oneVt.badPatterns.push(key)
                }
                Zdata.oneVt.badPatterns = Zdata.oneVt.badPatterns.splice(1, Zdata.oneVt.badPatterns.length);
                //取出不良模式对应的数据，当lot为空时，也填入空
                for (let i = 0; i < Zdata.oneVt.badPatterns.length; i++) {
                    let temp = []
                    for (let j = 0; j < Zdata.oneVt.clonelot.length; j++) {
                        if (Zdata.oneVt.clonelot[j] == '') {
                            temp[j] = ''
                            Zdata.oneVt.target.push('5%')
                        } else {
                            Zdata.oneVt.target.push('5%')
                            let lotindex = Zdata.oneVt.lot.indexOf(Zdata.oneVt.clonelot[j]) //匹配后的lot在原始lot中的位置                         
                            temp[j] = Zdata.oneVt.data[lotindex][Object.keys(Zdata.oneVt.data[lotindex])[i + 1]]
                        }
                    }
                    Zdata.oneVt.alldata.push(temp)
                }
                Zdata.oneVt.target.length = _that.maxlength
                Zdata.oneVt.alldata.unshift(Zdata.oneVt.target)
                Zdata.oneVt.badPatterns.unshift('目标');

                //2Vt处理
                for (let key in Zdata.twoVt.data[0]) {
                    Zdata.twoVt.badPatterns.push(key)
                }
                Zdata.twoVt.badPatterns = Zdata.twoVt.badPatterns.splice(1, Zdata.twoVt.badPatterns.length);
                //取出不良模式对应的数据，当lot为空时，也填入空
                for (let i = 0; i < Zdata.twoVt.badPatterns.length; i++) {
                    let temp = []
                    for (let j = 0; j < Zdata.twoVt.clonelot.length; j++) {
                        if (Zdata.twoVt.clonelot[j] == '') {
                            temp[j] = ''
                            Zdata.twoVt.target.push('5%')
                        } else {
                            Zdata.twoVt.target.push('5%')
                            let lotindex = Zdata.twoVt.lot.indexOf(Zdata.twoVt.clonelot[j]) //匹配后的lot在原始lot中的位置                         
                            temp[j] = Zdata.twoVt.data[lotindex][Object.keys(Zdata.twoVt.data[lotindex])[i + 1]]
                        }
                    }
                    Zdata.twoVt.alldata.push(temp)
                }
                Zdata.twoVt.target.length = _that.maxlength
                Zdata.twoVt.alldata.unshift(Zdata.twoVt.target)
                Zdata.twoVt.badPatterns.unshift('目标');
            }

            //D段处理 ###############################################################################################################
            if (_that.gongduan.value == "D") {
                //处理D数据
                //取首列不良模式
                _that.maxlength = Ddata.data.length;
                for (let key in Ddata.data[0]) {
                    Ddata.badPatterns.push(key)
                }
                Ddata.badPatterns = Ddata.badPatterns.splice(1, Ddata.badPatterns.length);
                //获取不良模式对应的数据并插入目标
                for (let j = 0; j < Ddata.badPatterns.length; j++) {
                    let temp = []
                    for (let i = 0; i < Ddata.data.length; i++) {
                        Ddata.target.push('1%');
                        temp.push(Ddata.data[i][Object.keys(Ddata.data[i])[j + 1]])
                    }
                    Ddata.alldata.push(temp)
                }
                Ddata.target.length = _that.maxlength
                Ddata.alldata.unshift(Ddata.target)
                Ddata.badPatterns.unshift('目标');
                //G匹配D
                let cloneDlot = [...Ddata.lot] //复制G的lot
                let dlotIndex = Gdata.lot.map(ele => cloneDlot.indexOf(ele)) //D中lot号在G中的位置下标
                for (let i in cloneDlot) {
                    if (dlotIndex.includes(Number(i)) == false) { //遍历G中下标，在D中没有的填为空
                        cloneDlot[i] = ''
                    }
                }
                Gdata.lot = cloneDlot; //将克隆的G数据赋给D
                //取G检所有不良模式
                for (let [k, v] of Object.entries(Gdata.data)) {
                    Gdata.datalot.push(v.LOT)
                }
                for (let key in Gdata.data[0]) {
                    Gdata.badPatterns.push(key)
                }
                Gdata.badPatterns = Gdata.badPatterns.splice(1, Gdata.badPatterns.length);
                //取出不良模式对应的数据，当lot为空时，也填入空
                for (let i = 0; i < Gdata.badPatterns.length; i++) {
                    let temp = []
                    for (let j = 0; j < Gdata.lot.length; j++) {
                        if (Gdata.lot[j] == '') {
                            temp[j] = ''
                            Gdata.target.push('1%'); //  目标
                        } else {
                            Gdata.target.push('1%'); //  目标
                            let lotindex = Gdata.datalot.indexOf(Gdata.lot[j]) //匹配后的lot在原始lot中的位置                         
                            temp[j] = Gdata.data[lotindex][Object.keys(Gdata.data[lotindex])[i + 1]]
                        }
                    }
                    Gdata.alldata.push(temp)
                }
                Gdata.target.length = _that.maxlength
                Gdata.alldata.unshift(Gdata.target)
                Gdata.badPatterns.unshift('目标');
                //中试线匹配D
                //中试线数据处理
                //1.取出一二次Vt的LOt
                for (let i = 0; i < Zdata.data.length; i++) {
                    if (Zdata.data[i].作业工序 == "1次VT") {
                        Zdata.oneVt.lot.push(Zdata.data[i].LOT)
                    } else {
                        Zdata.twoVt.lot.push(Zdata.data[i].LOT)
                    }
                }
                Zdata.oneVt.lot = [...new Set(Zdata.oneVt.lot)] // 去重
                Zdata.twoVt.lot = [...new Set(Zdata.twoVt.lot)]
                //将数据按1Vt 2Vt分类，合并相同lot及不良代码等
                for (let i = 0; i < Zdata.oneVt.lot.length; i++) {
                    let temp = {}
                    for (let j = 0; j < Zdata.data.length; j++) {
                        if (Zdata.data[j].LOT == Zdata.oneVt.lot[i] && Zdata.data[j].作业工序 == '1次VT') {
                            temp.LOT = Zdata.data[j].LOT
                            temp.作业工序 = Zdata.data[j].作业工序
                            temp.作业总数 = Zdata.data[j].作业总数
                            temp.良率 = Zdata.data[j].良率
                            temp[Zdata.data[j].不良代码] = Zdata.data[j].不良率
                        }
                    }
                    Zdata.oneVt.data.push(temp)
                }
                for (let i = 0; i < Zdata.twoVt.lot.length; i++) {
                    let temp = {}
                    for (let j = 0; j < Zdata.data.length; j++) {
                        if (Zdata.data[j].LOT == Zdata.twoVt.lot[i] && Zdata.data[j].作业工序 == '2次VT') {
                            temp.LOT = Zdata.data[j].LOT
                            temp.作业工序 = Zdata.data[j].作业工序
                            temp.作业总数 = Zdata.data[j].作业总数
                            temp.良率 = Zdata.data[j].良率
                            temp[Zdata.data[j].不良代码] = Zdata.data[j].不良率
                        }
                    }
                    Zdata.twoVt.data.push(temp)
                }
                //和G匹配1Vt 和 2VT的lot，顺序对应，没有的补空
                let onecloneZlot = [...Ddata.lot]
                let onezlotIndex = Zdata.oneVt.lot.map(ele => onecloneZlot.indexOf(ele)) //D中lot号在G中的位置下标
                for (let i in onecloneZlot) {
                    if (onezlotIndex.includes(Number(i)) == false) { //遍历G中下标，在D中没有的填为空
                        onecloneZlot[i] = ''
                    }
                }
                let twocloneZlot = [...Ddata.lot]
                let twozlotIndex = Zdata.twoVt.lot.map(ele => twocloneZlot.indexOf(ele)) //D中lot号在G中的位置下标
                for (let i in twocloneZlot) {
                    if (twozlotIndex.includes(Number(i)) == false) { //遍历G中下标，在D中没有的填为空
                        twocloneZlot[i] = ''
                    }
                }
                Zdata.oneVt.clonelot = onecloneZlot;
                Zdata.twoVt.clonelot = twocloneZlot;
                //取中试线1VT所有不良模式
                for (let key in Zdata.oneVt.data[0]) {
                    Zdata.oneVt.badPatterns.push(key)
                }
                Zdata.oneVt.badPatterns = Zdata.oneVt.badPatterns.splice(1, Zdata.oneVt.badPatterns.length);
                //取出不良模式对应的数据，当lot为空时，也填入空
                for (let i = 0; i < Zdata.oneVt.badPatterns.length; i++) {
                    let temp = []
                    for (let j = 0; j < Zdata.oneVt.clonelot.length; j++) {
                        if (Zdata.oneVt.clonelot[j] == '') {
                            temp[j] = ''
                        } else {
                            Zdata.oneVt.target.push('1%')
                            let lotindex = Zdata.oneVt.lot.indexOf(Zdata.oneVt.clonelot[j]) //匹配后的lot在原始lot中的位置                         
                            temp[j] = Zdata.oneVt.data[lotindex][Object.keys(Zdata.oneVt.data[lotindex])[i + 1]]
                        }
                    }
                    Zdata.oneVt.alldata.push(temp)
                }
                Zdata.oneVt.target.length = _that.maxlength
                Zdata.oneVt.alldata.unshift(Zdata.oneVt.target)
                Zdata.oneVt.badPatterns.unshift('目标');

                //2Vt处理
                for (let key in Zdata.twoVt.data[0]) {
                    Zdata.twoVt.badPatterns.push(key)
                }
                Zdata.twoVt.badPatterns = Zdata.twoVt.badPatterns.splice(1, Zdata.twoVt.badPatterns.length);
                //取出不良模式对应的数据，当lot为空时，也填入空
                for (let i = 0; i < Zdata.twoVt.badPatterns.length; i++) {
                    let temp = []
                    for (let j = 0; j < Zdata.twoVt.clonelot.length; j++) {
                        if (Zdata.twoVt.clonelot[j] == '') {
                            temp[j] = ''
                        } else {
                            Zdata.twoVt.target.push('1%')
                            let lotindex = Zdata.twoVt.lot.indexOf(Zdata.twoVt.clonelot[j]) //匹配后的lot在原始lot中的位置                         
                            temp[j] = Zdata.twoVt.data[lotindex][Object.keys(Zdata.twoVt.data[lotindex])[i + 1]]
                        }
                    }
                    Zdata.twoVt.alldata.push(temp)
                }
                Zdata.twoVt.target.length = _that.maxlength
                Zdata.twoVt.alldata.unshift(Zdata.twoVt.target)
                Zdata.twoVt.badPatterns.unshift('目标');
            }
            //中试线处理 ###########################################################################################################
            if (_that.gongduan.value == "中试线") {
                //中试线数据
                _that.maxlength = Zdata.lot.length;
                //1.取出一二次Vt的LOt
                for (let i = 0; i < Zdata.data.length; i++) {
                    if (Zdata.data[i].作业工序 == "1次VT") {
                        Zdata.oneVt.lot.push(Zdata.data[i].LOT)
                    } else {
                        Zdata.twoVt.lot.push(Zdata.data[i].LOT)
                    }
                }
                Zdata.oneVt.lot = [...new Set(Zdata.oneVt.lot)] // 去重
                Zdata.twoVt.lot = [...new Set(Zdata.twoVt.lot)]

                //将数据按1Vt 2Vt分类，合并相同lot及不良代码等
                for (let i = 0; i < Zdata.oneVt.lot.length; i++) {
                    let temp = {}
                    for (let j = 0; j < Zdata.data.length; j++) {
                        if (Zdata.data[j].LOT == Zdata.oneVt.lot[i] && Zdata.data[j].作业工序 == '1次VT') {
                            temp.LOT = Zdata.data[j].LOT
                            temp.作业工序 = Zdata.data[j].作业工序
                            temp.作业总数 = Zdata.data[j].作业总数
                            temp.良率 = Zdata.data[j].良率
                            temp[Zdata.data[j].不良代码] = Zdata.data[j].不良率
                        }
                    }
                    Zdata.oneVt.data.push(temp)
                }
                for (let i = 0; i < Zdata.twoVt.lot.length; i++) {
                    let temp = {}
                    for (let j = 0; j < Zdata.data.length; j++) {
                        if (Zdata.data[j].LOT == Zdata.twoVt.lot[i] && Zdata.data[j].作业工序 == '2次VT') {
                            temp.LOT = Zdata.data[j].LOT
                            temp.作业工序 = Zdata.data[j].作业工序
                            temp.作业总数 = Zdata.data[j].作业总数
                            temp.良率 = Zdata.data[j].良率
                            temp[Zdata.data[j].不良代码] = Zdata.data[j].不良率
                        }
                    }
                    Zdata.twoVt.data.push(temp)
                }
                //1次VT的lot匹配总VT的lot
                let onecloneZlot = [...Zdata.lot]
                let onezlotIndex = Zdata.oneVt.lot.map(ele => onecloneZlot.indexOf(ele)) //D中lot号在G中的位置下标
                for (let i in onecloneZlot) {
                    if (onezlotIndex.includes(Number(i)) == false) { //遍历G中下标，在D中没有的填为空
                        onecloneZlot[i] = ''
                    }
                }
                //2次VT匹配总VT
                let twocloneZlot = [...Zdata.lot]
                let twozlotIndex = Zdata.twoVt.lot.map(ele => twocloneZlot.indexOf(ele)) //D中lot号在G中的位置下标
                for (let i in twocloneZlot) {
                    if (twozlotIndex.includes(Number(i)) == false) { //遍历G中下标，在D中没有的填为空
                        twocloneZlot[i] = ''
                    }
                }
                Zdata.oneVt.clonelot = onecloneZlot;
                Zdata.twoVt.clonelot = twocloneZlot;
                //取中试线1VT所有不良模式
                for (let key in Zdata.oneVt.data[0]) {
                    Zdata.oneVt.badPatterns.push(key)
                }
                Zdata.oneVt.badPatterns = Zdata.oneVt.badPatterns.splice(1, Zdata.oneVt.badPatterns.length);
                //取出不良模式对应的数据，当lot为空时，也填入空
                for (let i = 0; i < Zdata.oneVt.badPatterns.length; i++) {
                    let temp = []
                    for (let j = 0; j < Zdata.oneVt.clonelot.length; j++) {
                        if (Zdata.oneVt.clonelot[j] == '') {
                            temp[j] = ''
                        } else {
                            Zdata.oneVt.target.push('1%')
                            let lotindex = Zdata.oneVt.lot.indexOf(Zdata.oneVt.clonelot[j]) //匹配后的lot在原始lot中的位置                         
                            temp[j] = Zdata.oneVt.data[lotindex][Object.keys(Zdata.oneVt.data[lotindex])[i + 1]]
                        }
                    }
                    Zdata.oneVt.alldata.push(temp)
                }
                Zdata.oneVt.target.length = _that.maxlength
                Zdata.oneVt.alldata.unshift(Zdata.oneVt.target)
                Zdata.oneVt.badPatterns.unshift('目标');

                //2Vt处理
                for (let key in Zdata.twoVt.data[0]) {
                    Zdata.twoVt.badPatterns.push(key)
                }
                Zdata.twoVt.badPatterns = Zdata.twoVt.badPatterns.splice(1, Zdata.twoVt.badPatterns.length);
                //取出不良模式对应的数据，当lot为空时，也填入空
                for (let i = 0; i < Zdata.twoVt.badPatterns.length; i++) {
                    let temp = []
                    for (let j = 0; j < Zdata.twoVt.clonelot.length; j++) {
                        if (Zdata.twoVt.clonelot[j] == '') {
                            temp[j] = ''
                        } else {
                            Zdata.twoVt.target.push('1%')
                            let lotindex = Zdata.twoVt.lot.indexOf(Zdata.twoVt.clonelot[j]) //匹配后的lot在原始lot中的位置                         
                            temp[j] = Zdata.twoVt.data[lotindex][Object.keys(Zdata.twoVt.data[lotindex])[i + 1]]
                        }
                    }
                    Zdata.twoVt.alldata.push(temp)
                }
                Zdata.twoVt.target.length = _that.maxlength
                Zdata.twoVt.alldata.unshift(Zdata.twoVt.target)
                Zdata.twoVt.badPatterns.unshift('目标');

                //G匹配中试线
                let cloneZlot = [...Zdata.lot]
                let glotIndex = Gdata.lot.map(ele => cloneZlot.indexOf(ele))
                for (let i in cloneZlot) {
                    if (glotIndex.includes(Number(i)) == false) { //
                        cloneZlot[i] = ''
                    }
                }
                Gdata.lot = cloneZlot; //
                //取G检所有不良模式
                for (let [k, v] of Object.entries(Gdata.data)) {
                    Gdata.datalot.push(v.LOT)
                }
                for (let key in Gdata.data[0]) {
                    Gdata.badPatterns.push(key)
                }
                Gdata.badPatterns = Gdata.badPatterns.splice(1, Gdata.badPatterns.length);
                //取出不良模式对应的数据，当lot为空时，也填入空
                for (let i = 0; i < Gdata.badPatterns.length; i++) {
                    let temp = []
                    for (let j = 0; j < Gdata.lot.length; j++) {
                        if (Gdata.lot[j] == '') {
                            temp[j] = ''
                            Gdata.target.push('1%'); //  目标
                        } else {
                            Gdata.target.push('1%'); //  目标
                            let lotindex = Gdata.datalot.indexOf(Gdata.lot[j]) //匹配后的lot在原始lot中的位置                         
                            temp[j] = Gdata.data[lotindex][Object.keys(Gdata.data[lotindex])[i + 1]]
                        }
                    }
                    Gdata.alldata.push(temp)
                }
                Gdata.target.length = _that.maxlength
                Gdata.alldata.unshift(Gdata.target)
                Gdata.badPatterns.unshift('目标');

                //D匹配中试线
                let cloneDlot = [...Zdata.lot]
                let dlotIndex = Ddata.lot.map(ele => cloneDlot.indexOf(ele))
                for (let i in cloneDlot) {
                    if (dlotIndex.includes(Number(i)) == false) { //
                        cloneDlot[i] = ''
                    }
                }
                Ddata.lot = cloneDlot; //
                //取D检所有不良模式
                for (let [k, v] of Object.entries(Ddata.data)) {
                    Ddata.datalot.push(v.LOT)
                }
                for (let key in Ddata.data[0]) {
                    Ddata.badPatterns.push(key)
                }
                Ddata.badPatterns = Ddata.badPatterns.splice(1, Ddata.badPatterns.length);
                //取出不良模式对应的数据，当lot为空时，也填入空
                for (let i = 0; i < Ddata.badPatterns.length; i++) {
                    let temp = []
                    for (let j = 0; j < Ddata.lot.length; j++) {
                        if (Ddata.lot[j] == '') {
                            temp[j] = ''
                            Ddata.target.push('1%'); //  目标
                        } else {
                            Ddata.target.push('1%'); //  目标
                            let lotindex = Ddata.datalot.indexOf(Ddata.lot[j]) //匹配后的lot在原始lot中的位置                         
                            temp[j] = Ddata.data[lotindex][Object.keys(Ddata.data[lotindex])[i + 1]]
                        }
                    }
                    Ddata.alldata.push(temp)
                }
                Ddata.target.length = _that.maxlength
                Ddata.alldata.unshift(Ddata.target)
                Ddata.badPatterns.unshift('目标');
            }

            let table = document.createElement('table')
            table.id = 'tb';
            //表头三行
            let thead = table.createTHead();
            for (let j = 0; j < 5; j++) {
                let row = thead.insertRow();
                let firsttd = document.createElement('td');
                firsttd.setAttribute('colspan', '4');
                firsttd.innerHTML = _that.arrTitle[j];
                row.appendChild(firsttd)
                for (let i = 0; i < _that.maxlength; i++) {
                    //表头三行数据
                    if (j == 3) {
                        let tdname = document.createElement('td');
                        let lotNo = titledata[j][i] || '';
                        tdname.innerHTML = `<a href='#'>${lotNo}</a>`;
                        tdname.onclick = function () {
                            let html1 = 'Lot Instructions.html';
                            html1 = html1 + '?' + tdname.childNodes[0].innerHTML;
                            window.open(html1, 'newwindow', 'height=650, width=1120, top=100, left=200, toolbar=no, menubar=no,scrollbars=no, resizable=yes,location=no, status=no');
                        }
                        row.appendChild(tdname)
                    } else {
                        let tdname = document.createElement('td');
                        tdname.innerHTML = titledata[j][i] || '';
                        row.appendChild(tdname)
                    }
                    // _that.createtable(titledata[j][i], row)
                }
            }
            console.log(Gdata.alldata);

            let tbody = table.createTBody();
            //#############################################################################
            //array段表格
            let row = tbody.insertRow();
            _that.createtablespan(20 + Ddata.badPatterns.length + Gdata.badPatterns.length, 'Array', row);
            //Array-G检
            let row0 = tbody.insertRow();
            _that.createtablespanColRow(Gdata.badPatterns.length + 1, 2, `G检(全检)`, row0);
            //G
            for (let a = 0; a < Gdata.badPatterns.length; a++) {
                let td = tbody.insertRow();
                _that.createtable(Gdata.badPatterns[a], td);
                for (let b = 0; b < _that.maxlength; b++) {
                    // if (parseFloat(Gdata.alldata[a][b]) > 1) {
                    //     _that.createtable(Gdata.alldata[a][b] || '', td, 'red');
                    // } else {
                    _that.createtable(Gdata.alldata[a][b] || '', td);
                }
            }
            //D检
            let rowd = tbody.insertRow();
            _that.createtablespanColRow(Ddata.badPatterns.length + 1, 2, `D检(全检)`, rowd);

            for (let a = 0; a < Ddata.badPatterns.length; a++) {
                let td = tbody.insertRow();
                if (a == 0) {
                    td.style.backgroundColor = '#51b9ff'
                }
                _that.createtable(Ddata.badPatterns[a], td);
                for (let b = 0; b < _that.maxlength; b++) {
                    // if (Ddata.badPatterns[a] == '模糊G断' || '模糊D断' || 'PR不定型D断') {
                    //     if (Hdata.pm[b].substring(2, 3) == '9' || 'Y') {
                    //         if (parseFloat(Ddata.alldata[a][b]) > 4) {
                    //             _that.createtable(Ddata.alldata[a][b] || '', td, 'red');
                    //         } else {
                    //             _that.createtable(Ddata.alldata[a][b] || '', td);
                    //         }

                    //     } else {
                    //         if (parseFloat(Ddata.alldata[a][b]) > 2) {
                    //             _that.createtable(Ddata.alldata[a][b] || '', td, 'red');
                    //         } else {
                    //             _that.createtable(Ddata.alldata[a][b] || '', td);
                    //         }
                    //     }
                    // }
                    // if (parseFloat(Ddata.alldata[a][b]) > 1) {
                    //     _that.createtable(Ddata.alldata[a][b] || '', td, 'red');
                    // } else {
                    //     _that.createtable(Ddata.alldata[a][b] || '', td);
                    // }
                    if (parseFloat(Ddata.alldata[a][b]) > 1) {
                        _that.createtable(Ddata.alldata[a][b] || '', td, 'red');
                    } else {
                        _that.createtable(Ddata.alldata[a][b] || '', td);
                    }
                }
            }

            //小工程检 
            let row10 = tbody.insertRow();
            _that.createtablespan(17, '小工程检(抽检)', row10);
            //KPR
            let row11 = tbody.insertRow();
            _that.createtablespan(6, 'KPR(5抽1)', row11);
            for (let a = 0; a < 5; a++) {
                let td = tbody.insertRow();
                _that.createtable(_that.skpr[a], td);
                for (let b = 0; b < _that.maxlength; b++) {
                    _that.createtable('', td);
                }
            }
            //CPR
            let row12 = tbody.insertRow();
            _that.createtablespan(5, 'CPR(8抽1)', row12);
            for (let a = 0; a < 4; a++) {
                let td = tbody.insertRow();
                _that.createtable(_that.scpr[a], td);
                for (let b = 0; b < _that.maxlength; b++) {
                    _that.createtable('', td);
                }
            }
            //PIPR
            let row13 = tbody.insertRow();
            _that.createtablespan(5, 'PIPR(5抽1)', row13);
            for (let a = 0; a < 4; a++) {
                let td = tbody.insertRow();
                _that.createtable(_that.spipr[a], td);
                for (let b = 0; b < _that.maxlength; b++) {
                    _that.createtable('', td);
                }
            }
            //####################################################################################
            //F-CELL
            let row14 = tbody.insertRow();
            _that.createtablespan(9, 'F-Cell', row14);
            let row15 = tbody.insertRow();
            _that.createtablespanColRow(8, 2, 'VI检(含框胶检/全检)', row15);
            for (let a = 0; a < 7; a++) {
                let td = tbody.insertRow();
                _that.createtable(_that.vi[a], td);
                for (let b = 0; b < _that.maxlength; b++) {
                    _that.createtable('', td);
                }
            }
            //中试线
            let row16 = tbody.insertRow();
            _that.createtablespan(Zdata.oneVt.badPatterns.length + Zdata.twoVt.badPatterns.length + 3, '中试线', row16);
            let rowvt1 = tbody.insertRow();
            _that.createtablespanColRow(Zdata.oneVt.badPatterns.length + 1, 2, '1次VT', rowvt1);
            for (let a = 0; a < Zdata.oneVt.badPatterns.length; a++) {
                let td = tbody.insertRow();
                if (a == 0) {
                    td.style.backgroundColor = '#51b9ff'
                }
                _that.createtable(Zdata.oneVt.badPatterns[a], td);
                for (let b = 0; b < _that.maxlength; b++) {
                    // if (parseFloat(Zdata.oneVt.alldata[a][b]) > 5) {
                    //     _that.createtable(Zdata.oneVt.alldata[a][b] || '', td, 'red');
                    // } else {
                    _that.createtable(Zdata.oneVt.alldata[a][b] || '', td);

                }
            }
            let rowvt2 = tbody.insertRow();
            _that.createtablespanColRow(Zdata.twoVt.badPatterns.length + 1, 2, '2次VT', rowvt2);
            for (let a = 0; a < Zdata.twoVt.badPatterns.length; a++) {
                let td = tbody.insertRow();
                if (a == 0) {
                    td.style.backgroundColor = '#51b9ff'
                }
                _that.createtable(Zdata.twoVt.badPatterns[a], td);
                for (let b = 0; b < _that.maxlength; b++) {
                    // if (parseFloat(Zdata.twoVt.alldata[a][b]) > 5) {
                    //     _that.createtable(Zdata.twoVt.alldata[a][b] || '', td, 'red');
                    // } else {
                    _that.createtable(Zdata.twoVt.alldata[a][b] || '', td);

                }
            }
            //######################################################################################
            //模组
            let row18 = tbody.insertRow();
            _that.createtablespan(26, '模组', row18);
            //上线良率
            let row19 = tbody.insertRow();
            _that.createtablespanColRow(10, 2, '上线良率', row19);
            for (let a = 0; a < 9; a++) {
                let td = tbody.insertRow();
                _that.createtable(_that.sxlv[a], td);
                for (let b = 0; b < _that.maxlength; b++) {
                    _that.createtable('', td);
                }
            }
            //ET2
            let row20 = tbody.insertRow();
            _that.createtablespanColRow(5, 2, 'ET2', row20);
            for (let a = 0; a < 4; a++) {
                let td = tbody.insertRow();
                _that.createtable(_that.et2[a], td);
                for (let b = 0; b < _that.maxlength; b++) {
                    _that.createtable('', td);
                }
            }
            //Aging+ET3
            let row21 = tbody.insertRow();
            _that.createtablespanColRow(5, 2, 'Aging+ET3', row21);
            for (let a = 0; a < 4; a++) {
                let td = tbody.insertRow();
                _that.createtable(_that.et2[a], td);
                for (let b = 0; b < _that.maxlength; b++) {
                    _that.createtable('', td);
                }
            }
            //OQC
            let row22 = tbody.insertRow();
            _that.createtablespanColRow(5, 2, 'OQC', row22);
            for (let a = 0; a < 4; a++) {
                let td = tbody.insertRow();
                _that.createtable(_that.et2[a], td);
                for (let b = 0; b < _that.maxlength; b++) {
                    _that.createtable('', td);
                }
            }
            //##############################################################################################
            //外部
            let row23 = tbody.insertRow();
            _that.createtablespan(26, '外部', row23);
            //sorting
            let row24 = tbody.insertRow();
            _that.createtablespanColRow(5, 2, 'sorting', row24);
            for (let a = 0; a < 4; a++) {
                let td = tbody.insertRow();
                _that.createtable(_that.et2[a], td);
                for (let b = 0; b < _that.maxlength; b++) {
                    _that.createtable('', td);
                }
            }
            //线前(IOC)
            let row25 = tbody.insertRow();
            _that.createtablespanColRow(5, 2, '线前(IOC)', row25);
            for (let a = 0; a < 4; a++) {
                let td = tbody.insertRow();
                _that.createtable(_that.et2[a], td);
                for (let b = 0; b < _that.maxlength; b++) {
                    _that.createtable('', td);
                }
            }
            //VLRR
            let row26 = tbody.insertRow();
            _that.createtablespanColRow(5, 2, 'VLRR', row26);
            for (let a = 0; a < 4; a++) {
                let td = tbody.insertRow();
                _that.createtable(_that.et2[a], td);
                for (let b = 0; b < _that.maxlength; b++) {
                    _that.createtable('', td);
                }
            }
            //0KM(整机厂）
            let row27 = tbody.insertRow();
            _that.createtablespanColRow(5, 2, '0KM(整机厂）', row27);
            for (let a = 0; a < 4; a++) {
                let td = tbody.insertRow();
                _that.createtable(_that.et2[a], td);
                for (let b = 0; b < _that.maxlength; b++) {
                    _that.createtable('', td);
                }
            }
            //Field reject
            let row28 = tbody.insertRow();
            _that.createtablespanColRow(5, 2, 'Field reject', row28);
            for (let a = 0; a < 4; a++) {
                let td = tbody.insertRow();
                _that.createtable(_that.et2[a], td);
                for (let b = 0; b < _that.maxlength; b++) {
                    _that.createtable('', td);
                }
            }
            //展示
            _that.clonetable.style.display = 'block';
            let table1 = table.cloneNode(true);
            _that.clonetable.append(table);
            _that.displatyTable.appendChild(table1);
            // _that.clonetable.appendChild(table2);
            let tablewidth = _that.clonetable.offsetWidth;
            _that.displatyarea.style.width = tablewidth - 17 + 'px';
            _that.progressbar.style.display = 'none';
            let rows1 = document.getElementsByTagName('tr');
            let flag1;
            Array.from(rows1)
                .forEach(element => {
                    element.onclick = function () {
                        flag1 ? flag1.style.backgroundColor = '' : '';
                        element.style.backgroundColor = 'rgb(162, 213, 255)';
                        flag1 = element;
                    }
                });

        });

    }
    createtablespan(rowspan, text, rowname) {
        let tdname = document.createElement('td');
        tdname.setAttribute('rowspan', rowspan);
        tdname.innerHTML = text;
        rowname.appendChild(tdname);
    }
    createtablespanColRow(rowspan, colspan, text, rowname) {
        let tdname = document.createElement('td');
        tdname.setAttribute('rowspan', rowspan);
        tdname.setAttribute('colspan', colspan);
        tdname.innerHTML = text;
        rowname.appendChild(tdname);
    }
    createtable(text, rowname, color) {
        let tdname = document.createElement('td');
        tdname.style.backgroundColor = color;
        tdname.innerHTML = text;
        rowname.appendChild(tdname);
    }
    reset() {
        window.location.reload();
    }
    download() {
        // $("#tb").table2excel({
        //     exclude: ".noExl",
        //     name: 'Data'
        // });
        $('#tb').tableExport({
            type: 'excel',
            escape: 'true',
            fileName: "data"
        })
    }
    //     winScroll(e) {
    //             e = e || window.event;
    //             if (e.wheelDelta) {    
    //                 if (e.wheelDelta > 0) { 
    //                     console.log("滑轮向上滚动");
    //                 this.clonecol.style.float = 'left'
    //                 }
    //                 if (e.wheelDelta < 0) { 
    //                     console.log("滑轮向下滚动");
    //                 }
    //             }

    //     }
}


new LotRelease()