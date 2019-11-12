#!D:\Python36\python.exe

import pyodbc
import cgi
import io
import sys
import datetime

out_state = ""

out_data = ""

try:

    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

    print("Content-type:text/html")
    print()

    form = cgi.FieldStorage()

    LOT = ""

    if form.getvalue("LOT") is not None:

        LOT = str(form.getvalue("LOT"))


    # 数据查询

    if out_state == "":

        conn = pyodbc.connect(
            "DRIVER={SQL Server};SERVER=10.1.10.209,1433;DATABASE=异常处置系统;UID=MES;PWD=MES")

        cursor = conn.cursor()

        data_list = []

        查询 = "SELECT 编号,指示,指示人员,确认组,指示时间,状态,结果,确认人,确认时间 FROM T_面板厂_制品异常单_指示  where T_面板厂_制品异常单_指示.编号 " \
             "in (SELECT  T_面板厂_制品异常单_异常对象.编号  FROM T_面板厂_制品异常单_异常对象	where LOT='"+ LOT +"')"

        cursor.execute(查询)

        rows = cursor.fetchall()

        for i in rows:

            t_data = "\"编号\":\"" + str(i.编号) + "\","

            t_data = t_data + "\"指示\":\"" + str(i.指示) + "\","

            t_data = t_data + "\"指示人员\":\"" + str(i.指示人员) + "\","

            t_data = t_data + "\"确认组\":\"" + str(i.确认组) + "\","

            t_data = t_data + "\"指示时间\":\"" + str(i.指示时间) + "\","

            t_data = t_data + "\"状态\":\"" + str(i.状态) + "\","

            t_data = t_data + "\"结果\":\"" + str(i.结果) + "\","

            t_data = t_data + "\"确认人\":\"" + str(i.确认人) + "\","

            t_data = t_data + "\"确认时间\":\"" + str(i.确认时间) + "\""

            t_data = "{" + t_data + "}"

            data_list.append(t_data)

        out_data = ','.join(data_list)

        out_data = "[" + out_data + "]"

except Exception as e:

    out_state = str(e)

out = "{\"state\":\"" + out_state + "\",\"data\":" + out_data + "}"

print(out)
