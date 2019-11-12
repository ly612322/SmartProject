#!D:\Python36\python.exe

import pyodbc
import cgi
import io
import sys
import time


out_state = ""

out_data = ""

try:

    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

    print("Content-type:text/html")
    print()

    form = cgi.FieldStorage()

    开始日期 = ""

    结束日期 = ""

    工段 = ""

    工段1 = ""

    if form.getvalue("开始日期") is not None:
        开始日期 = str(form.getvalue("开始日期"))

        开始日期 = 开始日期.replace('T', ' ')

    if form.getvalue("结束日期") is not None:
        结束日期 = str(form.getvalue("结束日期"))

        结束日期 = 结束日期.replace('T', ' ')

    if form.getvalue("工段") is not None:

        工段 = str(form.getvalue("工段"))

    结束日期 = time.mktime(time.strptime(结束日期, "%Y-%m-%d"))

    结束日期 = 结束日期 + 86400

    结束日期 = time.strftime("%Y-%m-%d", time.localtime(结束日期))

    if out_state == "":

        if 工段 == "G":

            conn = pyodbc.connect("DRIVER={SQL Server};SERVER=10.1.10.209,1433;DATABASE=不良解析系统;UID=AVIC_READER;PWD=123456")

            cursor = conn.cursor()

            查询 = " select DISTINCT LOT FROM T_工程检 WHERE  UP_DATE BETWEEN CONVERT(DATETIME, '" + 开始日期 + "') AND CONVERT(DATETIME,'" + 结束日期 + "') AND 工段='G' ORDER BY LOT"

        elif 工段 == "D":

            conn = pyodbc.connect("DRIVER={SQL Server};SERVER=10.1.10.209,1433;DATABASE=不良解析系统;UID=AVIC_READER;PWD=123456")

            cursor = conn.cursor()

            查询 = " select DISTINCT LOT FROM T_工程检 WHERE  UP_DATE BETWEEN CONVERT(DATETIME, '" + 开始日期 + "') AND CONVERT(DATETIME,'" + 结束日期 + "') AND 工段='D' ORDER BY LOT"

        elif 工段 == "中试线":

            conn = pyodbc.connect("DRIVER={SQL Server};SERVER=10.1.10.209,1433;DATABASE=中试线;UID=AVIC_READER;PWD=123456")

            cursor = conn.cursor()

            查询 = "SELECT DISTINCT LOT from T_记录 WHERE 上传时间 BETWEEN CONVERT(DATETIME, '" + 开始日期 + "') AND CONVERT(DATETIME,'" + 结束日期 + "') ORDER BY LOT"

        cursor.execute(查询)

        rows = cursor.fetchall()

        # print(rows)

        LOT_list = ""

        for a in rows:

            if a.LOT not in LOT_list:

                LOT_list = LOT_list+"','"+a.LOT

        LOT_list = "'"+LOT_list+"'"

        # print(LOT_list)

        conn = pyodbc.connect("DRIVER={SQL Server};SERVER=10.1.10.209,1433;DATABASE=DMP;UID=AVIC_READER;PWD=123456")

        conn1 = pyodbc.connect("DRIVER={SQL Server};SERVER=10.1.10.209,1433;DATABASE=YMS;UID=AVIC_READER;PWD=123456")

        cursor = conn.cursor()

        cursor1 = conn1.cursor()

        data_list = []

        查询 = "SELECT  DISTINCT LOT_NO,MNF_PRDCT_NM collate Chinese_PRC_CI_AS as 品名,B.简称_上海G50 AS 简称,STR_PNL_QTY AS 作业PANEL数,STR_PNL_QTY/STR_SHT_QTY AS 面取数,STR_DATE AS 投入日期 FROM [DMP].[dbo].[TL_LOT_HISTORY] A left join [YMS].[dbo].[V_品名] B ON A.MNF_PRDCT_NM collate Chinese_PRC_CI_AS = B.品名 WHERE " \
             " LOT_NO in  (" + LOT_list + ") AND MAJOR_STEP+ MINOR_STEP ='000000' AND WORK_CNT='1' AND EQP_UNIT IS NOT NULL AND LOT_HIST_STS='Y01' AND STR_PNL_QTY IS NOT NULL and STR_PNL_QTY <> 0 ORDER BY LOT_NO"

        cursor.execute(查询)

        rows = cursor.fetchall()

        data_产出 = []

        for i in rows:

                t_data = "\"LOT\":\"" + str(i.LOT_NO) + "\","

                t_data = t_data + "\"品名\":\"" + str(i.品名) + "\","

                t_data = t_data + "\"简称\":\"" + str(i.简称) + "\","

                t_data = t_data + "\"面取数\":\"" + str(i.面取数) + "\","

                t_data = t_data + "\"投入日期\":\"" + str(i.投入日期) + "\""

                t_data = "{" + t_data + "}"

                data_list.append(t_data)

        out_data = ','.join(data_list)

        out_data = "[" + out_data + "]"

except Exception as e:

  out_state = str(e)

out = "{\"state\":\"" + out_state + "\",\"data\":" + out_data + "}"

print(out)
