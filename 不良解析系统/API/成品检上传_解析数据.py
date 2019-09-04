#!D:\Python36\python.exe

import pyodbc
import cgi
import io
import sys
import datetime
import os
from io import StringIO
from ftplib import FTP

out_state = ""

out_data = ""

try:

    sys.stdout = io.TextIOWrapper(sys.stdout.buffer,encoding='utf-8')

    print("Content-type:text/html")  
    print()

    form = cgi.FieldStorage()

    ftp_host = "10.1.10.102"  # 上传文件FTP地址

    ftp_port = 21  # 上传文件FTP端口

    ftp_user = "MES"  # 上传文件FTP用户名

    ftp_passwd = "MES"  # 上传文件FTP密码

    ftp = FTP()
    ftp.connect(host=ftp_host, port=ftp_port, timeout=None, source_address=None)  # 设置FTP链接属性
    ftp.login(user=ftp_user, passwd=ftp_passwd, acct='')  # FTP登入
   
    LOT = ""

    SHEET = ""

    PANEL = ""

    来源 = ""

    PANEL状态 = ""

    简称 = ""

    品名简称 = ""

    不良代码 = ""

    不良模式 = ""

    分责 = ""

    图一 = ""

    file_name1 = ""

    图二 = ""

    file_name2 = ""

    图三 = ""

    file_name3 = ""

    图四 = ""

    file_name4 = ""

    图五 = ""

    file_name5 = ""

    图六 = ""

    file_name6 = ""

    姓名 = ""

    工号 = ""

    备注 = ""

    UP_DATE = ""

    创建时间 = ""


    if form.getvalue("LOT") is not None:
        LOT = str(form.getvalue("LOT"))

    if form.getvalue("SHEET") is not None:
        SHEET = str(form.getvalue("SHEET"))

    if form.getvalue("PANEL") is not None:
        PANEL = str(form.getvalue("PANEL"))

    if form.getvalue("来源") is not None:
        来源 = str(form.getvalue("来源"))

    if form.getvalue("PANEL状态") is not None:
        PANEL状态 = str(form.getvalue("PANEL状态"))

    if form.getvalue("简称") is not None:
        简称 = str(form.getvalue("简称"))

    if form.getvalue("品名简称") is not None:
        品名简称 = str(form.getvalue("品名简称"))

    if form.getvalue("不良代码") is not None:
        不良代码 = str(form.getvalue("不良代码"))

    if form.getvalue("不良模式") is not None:
        不良模式 = str(form.getvalue("不良模式"))

    if form.getvalue("分责") is not None:
        分责 = str(form.getvalue("分责"))

    if form.getvalue("姓名") is not None:
        姓名 = str(form.getvalue("姓名"))

    if form.getvalue("图一") is not None:
        图一 = form['图一']

    if form.getvalue("file_name1") is not None:
        file_name1 = str(form.getvalue("file_name1"))

    if form.getvalue("图二") is not None:
        图二 = form['图二']

    if form.getvalue("file_name2") is not None:
        file_name2 = str(form.getvalue("file_name2"))

    if form.getvalue("图三") is not None:
        图三 = form['图三']

    if form.getvalue("file_name3") is not None:
        file_name3 = str(form.getvalue("file_name3"))

    if form.getvalue("图四") is not None:
        图四 = form['图四']

    if form.getvalue("file_name4") is not None:
        file_name4 = str(form.getvalue("file_name4"))

    if form.getvalue("图五") is not None:
        图五 = form['图五']

    if form.getvalue("file_name5") is not None:
        file_name5 = str(form.getvalue("file_name5"))

    if form.getvalue("图六") is not None:
        图六 = form['图六']

    if form.getvalue("file_name6") is not None:
        file_name6 = str(form.getvalue("file_name6"))

    if form.getvalue("工号") is not None:
        工号 = str(form.getvalue("工号"))

    if form.getvalue("备注") is not None:
        备注 = str(form.getvalue("备注"))

    if form.getvalue("UP_DATE") is not None:
        UP_DATE = str(form.getvalue("UP_DATE"))

    if form.getvalue("创建时间") is not None:
        创建时间 = str(form.getvalue("创建时间"))

  #数据查询

    if out_state == "":

        conn = pyodbc.connect("DRIVER={SQL Server};SERVER=10.1.10.209,1433;DATABASE=不良解析系统;UID=MES;PWD=MES")

        cursor = conn.cursor()

        查询 = "SELECT IDENT_CURRENT('T_成品检') AS ID"

        cursor.execute(查询)

        rows = cursor.fetchall()

        for i in rows:

            ID = i.ID + 1

        FILE_NAME = str(ID) + "-" + 不良代码 + "-" + str(LOT) + "-" + str(SHEET) + "-" + str(PANEL)

        图1 = ""

        图2 = ""

        图3 = ""

        图4 = ""

        图5 = ""

        图6 = ""

        if file_name1 != "":

            图1 = "ftp://10.1.10.102/不良解析系统/成品检/" + 来源 + "/" + FILE_NAME + "-1.Jpg"

            file_name1 = FILE_NAME + "-1.Jpg"

        if file_name2 != "":
            图2 = "ftp://10.1.10.102/不良解析系统/成品检/" + 来源 + "/" + FILE_NAME + "-2.Jpg"

            file_name2 = FILE_NAME + "-2.Jpg"

        if file_name3 != "":
            图3 = "ftp://10.1.10.102/不良解析系统/成品检/" + 来源 + "/" + FILE_NAME + "-3.Jpg"

            file_name3 = FILE_NAME + "-3.Jpg"

        if file_name4 != "":
            图4 = "ftp://10.1.10.102/不良解析系统/成品检/" + 来源 + "/" + FILE_NAME + "-4.Jpg"

            file_name4 = FILE_NAME + "-4.Jpg"

        if file_name5 != "":
            图5 = "ftp://10.1.10.102/不良解析系统/成品检/" + 来源 + "/" + FILE_NAME + "-5.Jpg"

            file_name5 = FILE_NAME + "-5.Jpg"

        if file_name6 != "":
            图6 = "ftp://10.1.10.102/不良解析系统/成品检/" + 来源 + "/" + FILE_NAME + "-6.Jpg"

            file_name6 = FILE_NAME + "-6.Jpg"


        插入更新 = "INSERT INTO T_成品检 (来源,简称,品名简称 ,LOT ,SHEET ,PANEL ,PANEL状态 ,不良代码 ,不良模式 ,分责 ,图片_1 ,图片_2 ,图片_3 ,图片_4 ,图片_5 ,图片_6 ,备注 ,工号 ,姓名 ,创建时间 ,UP_DATE ) VALUES " \
           "('" + 来源 + "','" + 简称 + "','" + 品名简称 + "','" + LOT + "','" + SHEET + "','" + PANEL + "','" + PANEL状态 + "','" + 不良代码 + "','" + 不良模式 + "'," \
           "'" + 分责 + "','" + 图1 + "','" + 图2 + "','" + 图3 + "','" + 图4 + "','" + 图5 + "','" + 图6 + "','" + 备注 + "','" + 工号 + "','" + 姓名 + "','" + 创建时间 + "','" + UP_DATE + "') "

        # elif len(rows) > 0:
        #
        #     插入更新 = "UPDATE T_工程检 SET 工段 = '" + 工段 + "',FILE_NAME = '" + FILE_NAME + "',LOT = '" + LOT + "',SHEET = '" + SHEET + "',PANEL = '" + PANEL +"',品名 = '" + 品名 + "'," \
        #             "不良模式 = '" + 不良模式 + "',图片 = '" + 图片 + "',备注 = '" + 备注 + "',工号 = '" + 工号 + "',姓名 = '" + 姓名 + "',UP_DATE = '" + UP_DATE + "' " \
        #             "WHERE FILE_NAME='" + FILE_NAME + "' AND 工段 = '" + 工段 + "'"

        if FILE_NAME != "":

            URL = "不良解析系统/成品检/" + 来源

            URL = URL.encode("GB2312").decode("latin1")

            ftp.cwd(URL)

            if file_name1 != "":

                fileitem1 = 图一

                filename_file = fileitem1.filename.encode("GB2312").decode("latin1")

                judge1 = ftp.storbinary('STOR ' + file_name1, fileitem1.file)

            if file_name2 != "":
                fileitem2 = 图二
                filename_file = fileitem2.filename.encode("GB2312").decode("latin1")

                judge2 = ftp.storbinary('STOR ' + file_name2, fileitem2.file)

            if file_name3 != "":
                fileitem3 = 图三
                filename_file = fileitem3.filename.encode("GB2312").decode("latin1")

                judge3 = ftp.storbinary('STOR ' + file_name3, fileitem3.file)

            if file_name4 != "":
                fileitem4 = 图四
                filename_file = fileitem4.filename.encode("GB2312").decode("latin1")

                judge4 = ftp.storbinary('STOR ' + file_name4, fileitem4.file)

            if file_name5 != "":
                fileitem5 = 图五
                filename_file = fileitem5.filename.encode("GB2312").decode("latin1")

                judge5 = ftp.storbinary('STOR ' + file_name5, fileitem5.file)

            if file_name6 != "":
                fileitem6 = 图六
                filename_file = fileitem6.filename.encode("GB2312").decode("latin1")

                judge6 = ftp.storbinary('STOR ' + file_name6, fileitem6.file)

            if judge1 or judge2 or judge3 or judge4 or judge5 or judge6 == "226 Transfer complete.":

                cursor.execute(插入更新)

                conn.commit()

                out_state = "上传成功！"

except Exception as e:

    out_state = str(e)

out = "{\"state\":\"" + out_state + "\"}"

print(out)



    













