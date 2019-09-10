class Project {
  constructor() {
    this.index = 0; //图片切换
    this.tip = false;
    this.files = [];
    this.lotName = ''; //图片名字
    this.pmName = ''; //品名
    this.uploadImg = '';
    this.UID = window.top.SS_UID; // 外层工号
    this.workname = '';
    //元素
    this.queryform = document.forms["queryForm"];
    this.File_Name = document.getElementById("File_Name");
    this.Lot_Name = document.getElementById("Lot_Name");
    this.Sheet_Name = document.getElementById("Sheet_Name");
    this.Panel_Name = document.getElementById("Panel_Name");
    this.picNum = document.getElementById("picNum");
    this.displayImg = document.getElementById("showImg");
    this.selectPic = document.getElementById("inputFile");
    this.reset = document.getElementById("reset");
    this.upPic = document.getElementById("upImg");
    this.downPic = document.getElementById("downImg");
    this.proSeat = document.getElementById("selectSeat");
    // this.badKind = document.getElementById("badKind");
    this.shortcutKey = document.getElementById("quickBtn");
    this.remark = document.getElementById("remark");
    this.submit = document.getElementById("update");
    //方法绑定
    this.fileInput = this.fileInput.bind(this);
    this.lastImg = this.lastImg.bind(this);
    this.nextImg = this.nextImg.bind(this);
    // this.selectSeat = this.selectSeat.bind(this);
    this.shortcut = this.shortcut.bind(this);
    this.resetImg = this.resetImg.bind(this);
    this.update = this.update.bind(this);
    this.queryname = this.queryname.bind(this);
    this.compare = this.compare.bind(this);

    //事件
    this.selectPic.addEventListener("change", this.fileInput, false);
    this.reset.addEventListener("click", this.resetImg);
    this.upPic.addEventListener("click", this.lastImg);
    this.downPic.addEventListener("click", this.nextImg);
    this.proSeat.addEventListener("change", this.selectSeat);
    this.shortcutKey.addEventListener("input", this.shortcut);
    this.queryform.addEventListener("submit", this.update);
    window.addEventListener('load', this.queryname)

  }
  //用户信息查询
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

  fileInput(event) {
    let inputfiles = event.target.files;
    Array.from(inputfiles).forEach((element) => {
      //过滤非图片类型      
      if (element.type != "image/jpeg") {
        return;
      }
      this.files.push(element);
      // this.lotName.add(element.name.slice(0, 8));
    })
    this.files = this.files.sort(this.compare('lastModifiedDate'))    
    //展示第一张图片
    let reader = new FileReader();
    reader.readAsDataURL(this.files[0]);
    reader.onload = () => {
      let firstpic = reader.result
      this.displayImg.src = firstpic;
      this.uploadImg = this.files[0];
      this.File_Name.value = this.files[0].name;
      this.Lot_Name.value = this.files[0].name.slice(0, 8);
      this.Sheet_Name.value = this.files[0].name.slice(8, 10);
      this.Panel_Name.value = this.files[0].name.slice(10, 12);
      this.picNum.innerHTML = 1 + "/" + this.files.length;
    }
    this.lotName = this.files[0].name.slice(0, 8);
    let ajax = new XMLHttpRequest;
    ajax.open("post", "../API/DFS/工程检上传_查品名.py", true);
    ajax.setRequestHeader(
      "Content-Type",
      "application/x-www-form-urlencoded;charset=UTF-8"
    );
    ajax.send("LOT=" + this.lotName);
    ajax.onload = () => {
      let response = JSON.parse(ajax.response);
      let data = response.data;
      this.pmName = data;
    }

  }
  //重置
  resetImg() {
    window.location.reload();
  }
  lastImg() {
    this.index--;
    if (this.index < 0) {
      this.index = 0;
      alert("已经是第一张");
      return;
    };
    this.shortcutKey.value = '';
    this.remark.value = '';
    this.shortcutKey.focus();
    this.uploadImg = this.files[this.index];
    let reader = new FileReader();
    reader.readAsDataURL(this.files[this.index]);
    reader.onload = () => {
      let picsrc = reader.result
      this.displayImg.src = picsrc;
      this.File_Name.value = this.files[this.index].name;
      this.Lot_Name.value = this.files[this.index].name.slice(0, 8);
      this.Sheet_Name.value = this.files[this.index].name.slice(8, 10);
      this.Panel_Name.value = this.files[this.index].name.slice(10, 12);
      this.picNum.innerHTML = this.index + 1 + "/" + this.files.length;
    }
  }
  nextImg() {
    this.index++;
    if (this.index > this.files.length - 1) {
      this.index = this.files.length - 1;
      alert("已经是最后一张");
      return;
    }
    this.uploadImg = this.files[this.index];
    let reader = new FileReader();
    reader.readAsDataURL(this.files[this.index]);
    reader.onload = () => {
      let picsrc = reader.result
      this.displayImg.src = picsrc;
      this.File_Name.value = this.files[this.index].name;
      this.Lot_Name.value = this.files[this.index].name.slice(0, 8);
      this.Sheet_Name.value = this.files[this.index].name.slice(8, 10);
      this.Panel_Name.value = this.files[this.index].name.slice(10, 12);
      this.picNum.innerHTML = this.index + 1 + "/" + this.files.length;
      this.shortcutKey.focus();
      this.shortcutKey.select();
      this.remark.value = '';
    }
  }
  // selectSeat() {
  //   let ajax = new XMLHttpRequest();
  //   ajax.open("post", "../API/DFS/工程检_不良模式.py", true);
  //   ajax.setRequestHeader(
  //     "Content-Type",
  //     "application/x-www-form-urlencoded;charset=UTF-8"
  //   );
  //   ajax.send("工段=" + this.proSeat.value);
  //   ajax.onload = () => {
  //     let response = JSON.parse(ajax.response);
  //     let data = response.data;
  //     data = data.split(",");
  //     let list = `<option value=''></option>`;
  //     Array.from(data).forEach(Element => {
  //       list = list + `<option>${Element}</option>`;
  //     });
  //     this.badKind.innerHTML = list;
  //   };
  // }
  shortcut() {
    if (this.shortcutKey.value == ' ') {
      this.nextImg();
      return
    };
    // let ajax = new XMLHttpRequest();
    // ajax.open("post", "../API/DFS/工程检上传_不良模式查询.py", true);
    // ajax.setRequestHeader(
    //   "Content-Type",
    //   "application/x-www-form-urlencoded;charset=UTF-8"
    // );
    // ajax.send("快捷键=" + this.shortcutKey.value + "&工程=" + this.proSeat.value);
    // ajax.onload = () => {
    //   let response = JSON.parse(ajax.response);
    //   let data = response.data;
    //   this.badKind.value = data;
    // };
    this.submit.click();
  };

  update(event) {
    event.preventDefault();
    if (this.shortcutKey.value == '') {
      alert('请输入快捷键')
      return
    }
    let uploadState = document.getElementById('uploadState');
    if (this.files[this.index].name.slice(0, 8) == this.lotName) {
      let ajax = new XMLHttpRequest();
      let formData = new FormData(this.queryform);
      formData.append("Img", this.uploadImg);
      formData.set('FILE_NAME', this.files[this.index].name.replace('.Jpg', ''));
      formData.set('file_name', this.files[this.index].name);
      formData.set('快捷键', this.shortcutKey.value);
      formData.set('品名', this.pmName);
      formData.set('工号', this.UID);
      formData.set('姓名', this.workname);
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
      formData.append('UP_DATE', time)
      formData.append('图片', `ftp://10.1.10.102/不良解析系统/工程检/${this.proSeat.value}/${YEAR2}/${this.files[this.index].name}`)
      ajax.open("post", "../API/DFS/工程检上传_不良数据.py", true);
      ajax.send(formData);
      ajax.onload = () => {
        let response = JSON.parse(ajax.response);
        let state = response.state;
        uploadState.innerHTML = `${this.files[this.index].name}${state}`;
        this.nextImg();
      }
    } else {
      this.lotName = this.files[this.index].name.slice(0, 8);
      let ajax1 = new XMLHttpRequest;
      ajax1.open("post", "../API/DFS/工程检上传_查品名.py", true);
      ajax1.setRequestHeader(
        "Content-Type",
        "application/x-www-form-urlencoded;charset=UTF-8"
      );
      ajax1.send("LOT=" + this.lotName);
      ajax1.onload = () => {
        let response = JSON.parse(ajax1.response);
        let data = response.data;
        this.pmName = data;
        let ajax2 = new XMLHttpRequest();
        let formData = new FormData(this.queryform);
        formData.append("Img", this.uploadImg);
        formData.set('FILE_NAME', this.files[this.index].name.replace('.Jpg', ''));
        formData.set('file_name', this.files[this.index].name);
        formData.set('品名', this.pmName);
        formData.set('快捷键', this.shortcutKey.value);
        formData.set('工号', this.UID);
        formData.set('姓名', this.workname);
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
        if (SEC < 10) MIN = "0" + SEC;
        let time = YEAR2 + "-" + MONTH2 + "-" + DAY2 + " " + HOUR + ":" + MIN + ":" + SEC;
        formData.append('UP_DATE', time)
        formData.append('图片', `ftp://10.1.10.102/不良解析系统/工程检/${this.proSeat.value}/${YEAR2}/${this.files[this.index].name}`)
        ajax2.open("post", "../API/DFS/工程检上传_不良数据.py", true);
        ajax2.send(formData);
        ajax2.onload = () => {
          let response = JSON.parse(ajax2.response);
          let state = response.state;
          uploadState.innerHTML = `${this.files[this.index].name}${state}`;
          this.nextImg();
        }
      }
    }
  }
  compare(property) {
    return function (a, b) {
      var value1 = a[property];
      var value2 = b[property];
      return value1 - value2;
    }
  }
}
new Project();