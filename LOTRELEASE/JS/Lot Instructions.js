class lotrelease {
    constructor() {
        this.data = []
        this.query = this.query.bind(this)
        window.addEventListener('load', this.query)
    }
    query() {
        let str = '';
        let url = location.search;
        if (url.indexOf("?") != -1) {
            str = url.substring(url.indexOf("?") + 1);
            str = decodeURI(str);
        }
        let ajax = new XMLHttpRequest;
        ajax.open("post", "../API/LOT RELEASE/制品指示.py", true);
        ajax.setRequestHeader(
            "Content-Type",
            "application/x-www-form-urlencoded;charset=UTF-8"
        );
        ajax.send("LOT=" + str);
        ajax.onload = () => {
            let response = JSON.parse(ajax.response);
            this.data = response.data;
            if (this.data.length == 0) {
                document.write('暂无数据')
                return
            }
            console.log(this.data);
            let table = document.createElement("table");
            table.style.width = '1100px';
            table.id = "tb";
            let th = table.insertRow();
            this.data.forEach((object, index) => {
                var row = table.insertRow();
                for (const key in object) {
                    if (object.hasOwnProperty(key)) {
                        const element = object[key];
                        if (index === 0) {
                            th.insertCell().innerHTML = key;
                        }
                        row.insertCell().innerHTML = element;
                    }
                }
            });
            document.getElementById('lot').innerHTML = `<h3>LOT:${str}</h3>`;
            document.getElementById('display').appendChild(table);
        }
    }
}
new lotrelease()