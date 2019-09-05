class LotRelease {
    constructor() {
        //表头数据
        this.arrTitle = ['型号', '面取数', 'LOT NO'];
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
        this.data = '';
        this.lot = [];
        this.pm = [];
        this.mqs = [];
        //模拟数据
        // this.data = [
        //     // { '型号': '45623', '面取数': '785', 'LOTNO': '132456' },
        //     // { '型号': '654987', '面取数': '159', 'LOTNO': '289223' },
        //     // { '型号': '987654', '面取数': '753', 'LOTNO': '486211' },
        // ]

        //元素
        this.badkind = document.getElementById('kind');
        this.submitBtn = document.getElementById('submitbtn');
        this.resetBtn = document.getElementById('resetbtn');
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
        this.querybadkind = this.querybadkind.bind(this);
        this.reset = this.reset.bind(this);
        this.download = this.download.bind(this);
        //事件
        this.queryform.addEventListener('submit', this.querytable);
        this.resetBtn.addEventListener('click', this.reset);
        this.downloadBtn.addEventListener('click', this.download);
        this.gongduan.addEventListener('change', this.querybadkind);
        // window.addEventListener('mousewheel', this.winScroll)
    }

    querybadkind() {
        let ajax = new XMLHttpRequest();
        ajax.open("post", "../API/DFS/工程检_不良模式.py", true);
        ajax.setRequestHeader(
            "Content-Type",
            "application/x-www-form-urlencoded;charset=UTF-8"
        );
        ajax.send("工段=" + this.gongduan.value);
        ajax.onload = () => {
            let response = JSON.parse(ajax.response);
            let data = response.data;
            data = data.split(",");
            let list = `<option value=''></option>`;
            Array.from(data).forEach(Element => {
                list = list + `<option>${Element}</option>`;
            })
            this.badkind.innerHTML = list;
        }
    }

    querytable(event) {
        let inputdate = new Array();
        let badPatterns = new Array();
        let alldate = [];
        let target = [];
        event.preventDefault();
        this.progressbar.style.display = 'block';
        this.displatyTable.innerHTML = '';
        this.clonetable.innerHTML = '';
        // this.clonetable.innerHTML = '';
        let ajax = new XMLHttpRequest;
        let formData = new FormData(this.queryform);
        ajax.open("post", "../API/LOT RELEASE/LOTRELEASE_LOT发生率.py", true);
        ajax.send(formData);
        ajax.onload = () => {
            this.clonetable.style.display = 'block';
            let response = JSON.parse(ajax.response);
            this.data = response.data;
            for (let key in this.data[0]) {
                badPatterns.push(key)
            }
            for (let i = 0;i < badPatterns.length - 4;i++) {
                let arr = [];
                alldate.push(arr);
            }
            badPatterns = badPatterns.splice(4, badPatterns.length);
            for (let i = 0;i < this.data.length;i++) {
                this.lot.push(this.data[i].LOT);
                this.pm.push(this.data[i].品名);
                this.mqs.push(parseInt(this.data[i].面取数));
                inputdate.push((this.data[i].投入日期).slice(0, 10));
            }
            for (let j = 0;j < badPatterns.length;j++) {
                let temp = alldate[j]
                for (let i = 0;i < this.data.length;i++) {
                    target.push('0.5%');
                    temp.push(this.data[i][Object.keys(this.data[i])[j + 4]])
                }
            }
            target.length = alldate[0].length;
            alldate.unshift(inputdate, target)
            badPatterns.unshift('投入日期', '目标');
            let titledata = [this.pm, this.mqs, this.lot]; // 头部三行数据
            let table = document.createElement('table')
            table.id = 'tb';
            //开始三行
            let thead = table.createTHead();
            for (let j = 0;j < 3;j++) {
                let row = thead.insertRow();
                let firsttd = document.createElement('td');
                firsttd.setAttribute('colspan', '4');
                firsttd.innerHTML = this.arrTitle[j];
                row.appendChild(firsttd)
                for (let i = 0;i < this.data.length;i++) {
                    //开始三行数据
                    if (j == 2) {
                        let tdname = document.createElement('td');
                        tdname.innerHTML = titledata[j][i];
                        tdname.onclick = function () {
                            alert(1)
                        }
                        row.appendChild(tdname)
                    }
                    else {
                        let tdname = document.createElement('td');
                        tdname.innerHTML = titledata[j][i];
                        row.appendChild(tdname)
                    }

                    // this.createtable(titledata[j][i], row)
                }
            }
            // let theaddiv = document.createElement('div');
            // theaddiv.id = 'clonethead';
            // theaddiv.innerHTML = thead;
            let tbody = table.createTBody();
            //#############################################################################
            //array段表格
            let row = tbody.insertRow();
            this.createtablespan(40 + badPatterns.length + 2, 'Array', row);
            //Array-G检
            let row0 = tbody.insertRow();
            this.createtablespanColRow(badPatterns.length + 2, 2, 'G检(全检)', row0);
            let row1 = tbody.insertRow();
            //G-PR
            // this.createtablespan(6, 'PR', row1);
            for (let a = 0;a < badPatterns.length;a++) {
                let td = tbody.insertRow();
                this.createtable(badPatterns[a], td);
                for (let b = 0;b < this.data.length;b++) {
                    this.createtable(alldate[a][b], td);
                }
            }
            //G-PVD
            // let row2 = tbody.insertRow();
            // // this.createtablespan(5, 'PVD', row2);
            // for (let c = 0;c < 4;c++) {
            //     let td = tbody.insertRow();
            //     this.createtable(this.gpvd[c], td);
            //     for (let d = 0;d < 25;d++) {
            //         this.createtable('', td);
            //     }
            // }
            //D检
            let row3 = tbody.insertRow();
            this.createtablespan(22, 'D检(全检)', row3);
            let row4 = tbody.insertRow();
            //D-PR
            this.createtablespan(7, 'PR', row4);
            for (let a = 0;a < 6;a++) {
                let td = tbody.insertRow();
                this.createtable(this.dpr[a], td);
                for (let b = 0;b < 25;b++) {
                    this.createtable('', td);
                }
            }
            //D-PVD
            let row5 = tbody.insertRow();
            this.createtablespan(6, 'PVD', row5);
            for (let c = 0;c < 5;c++) {
                let td = tbody.insertRow();
                this.createtable(this.dpvd[c], td);
                for (let d = 0;d < 25;d++) {
                    this.createtable('', td);
                }
            }
            //D-DET
            let row6 = tbody.insertRow();
            this.createtablespan(4, 'DET', row6);
            for (let c = 0;c < 3;c++) {
                let td = tbody.insertRow();
                this.createtable(this.ddet[c], td);
                for (let d = 0;d < 25;d++) {
                    this.createtable('', td);
                }
            }
            //D-CVD
            let row7 = tbody.insertRow();
            this.createtablespan(4, 'CVD', row7);
            for (let c = 0;c < 3;c++) {
                let td = tbody.insertRow();
                this.createtable(this.ddet[c], td);
                for (let d = 0;d < 25;d++) {
                    this.createtable('', td);
                }
            }
            //小工程检 
            let row10 = tbody.insertRow();
            this.createtablespan(17, '小工程检(抽检)', row10);
            //KPR
            let row11 = tbody.insertRow();
            this.createtablespan(6, 'KPR(5抽1)', row11);
            for (let a = 0;a < 5;a++) {
                let td = tbody.insertRow();
                this.createtable(this.skpr[a], td);
                for (let b = 0;b < 25;b++) {
                    this.createtable('', td);
                }
            }
            //CPR
            let row12 = tbody.insertRow();
            this.createtablespan(5, 'CPR(8抽1)', row12);
            for (let a = 0;a < 4;a++) {
                let td = tbody.insertRow();
                this.createtable(this.scpr[a], td);
                for (let b = 0;b < 25;b++) {
                    this.createtable('', td);
                }
            }
            //PIPR
            let row13 = tbody.insertRow();
            this.createtablespan(5, 'PIPR(5抽1)', row13);
            for (let a = 0;a < 4;a++) {
                let td = tbody.insertRow();
                this.createtable(this.spipr[a], td);
                for (let b = 0;b < 25;b++) {
                    this.createtable('', td);
                }
            }
            //####################################################################################
            //F-CELL
            let row14 = tbody.insertRow();
            this.createtablespan(9, 'F-Cell', row14);
            let row15 = tbody.insertRow();
            this.createtablespanColRow(8, 2, 'VI检(含框胶检/全检)', row15);
            for (let a = 0;a < 7;a++) {
                let td = tbody.insertRow();
                this.createtable(this.vi[a], td);
                for (let b = 0;b < 25;b++) {
                    this.createtable('', td);
                }
            }
            //中试线
            let row16 = tbody.insertRow();
            this.createtablespan(11, '中试线', row16);
            let row17 = tbody.insertRow();
            this.createtablespanColRow(10, 2, 'VT(抽检)', row17);
            for (let a = 0;a < 9;a++) {
                let td = tbody.insertRow();
                this.createtable(this.vt[a], td);
                for (let b = 0;b < 25;b++) {
                    this.createtable('', td);
                }
            }
            //######################################################################################
            //模组
            let row18 = tbody.insertRow();
            this.createtablespan(26, '模组', row18);
            //上线良率
            let row19 = tbody.insertRow();
            this.createtablespanColRow(10, 2, '上线良率', row19);
            for (let a = 0;a < 9;a++) {
                let td = tbody.insertRow();
                this.createtable(this.sxlv[a], td);
                for (let b = 0;b < 25;b++) {
                    this.createtable('', td);
                }
            }
            //ET2
            let row20 = tbody.insertRow();
            this.createtablespanColRow(5, 2, 'ET2', row20);
            for (let a = 0;a < 4;a++) {
                let td = tbody.insertRow();
                this.createtable(this.et2[a], td);
                for (let b = 0;b < 25;b++) {
                    this.createtable('', td);
                }
            }
            //Aging+ET3
            let row21 = tbody.insertRow();
            this.createtablespanColRow(5, 2, 'Aging+ET3', row21);
            for (let a = 0;a < 4;a++) {
                let td = tbody.insertRow();
                this.createtable(this.et2[a], td);
                for (let b = 0;b < 25;b++) {
                    this.createtable('', td);
                }
            }
            //OQC
            let row22 = tbody.insertRow();
            this.createtablespanColRow(5, 2, 'OQC', row22);
            for (let a = 0;a < 4;a++) {
                let td = tbody.insertRow();
                this.createtable(this.et2[a], td);
                for (let b = 0;b < 25;b++) {
                    this.createtable('', td);
                }
            }
            //##############################################################################################
            //外部
            let row23 = tbody.insertRow();
            this.createtablespan(26, '外部', row23);
            //sorting
            let row24 = tbody.insertRow();
            this.createtablespanColRow(5, 2, 'sorting', row24);
            for (let a = 0;a < 4;a++) {
                let td = tbody.insertRow();
                this.createtable(this.et2[a], td);
                for (let b = 0;b < 25;b++) {
                    this.createtable('', td);
                }
            }
            //线前(IOC)
            let row25 = tbody.insertRow();
            this.createtablespanColRow(5, 2, '线前(IOC)', row25);
            for (let a = 0;a < 4;a++) {
                let td = tbody.insertRow();
                this.createtable(this.et2[a], td);
                for (let b = 0;b < 25;b++) {
                    this.createtable('', td);
                }
            }
            //VLRR
            let row26 = tbody.insertRow();
            this.createtablespanColRow(5, 2, 'VLRR', row26);
            for (let a = 0;a < 4;a++) {
                let td = tbody.insertRow();
                this.createtable(this.et2[a], td);
                for (let b = 0;b < 25;b++) {
                    this.createtable('', td);
                }
            }
            //0KM(整机厂）
            let row27 = tbody.insertRow();
            this.createtablespanColRow(5, 2, '0KM(整机厂）', row27);
            for (let a = 0;a < 4;a++) {
                let td = tbody.insertRow();
                this.createtable(this.et2[a], td);
                for (let b = 0;b < 25;b++) {
                    this.createtable('', td);
                }
            }
            //Field reject
            let row28 = tbody.insertRow();
            this.createtablespanColRow(5, 2, 'Field reject', row28);
            for (let a = 0;a < 4;a++) {
                let td = tbody.insertRow();
                this.createtable(this.et2[a], td);
                for (let b = 0;b < 25;b++) {
                    this.createtable('', td);
                }
            }
            //展示
            let table1 = table.cloneNode(true);
            // this.clonecol.appendChild(table1);
            let table2 = table.cloneNode(true);
            this.clonetable.appendChild(table2);
            let tablewidth = this.clonetable.offsetWidth;
            this.displatyarea.style.width = tablewidth + 'px';
            this.displatyTable.appendChild(table);
            this.progressbar.style.display = 'none';
        }

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
    createtable(text, rowname) {
        let tdname = document.createElement('td');
        tdname.innerHTML = text;
        rowname.appendChild(tdname);
    }
    reset() {
        this.FormData.reset()
    }
    download() {
        $("#tb").table2excel({
            exclude: ".noExl",
            name: 'Data'
        });
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