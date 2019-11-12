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

    开始日期 = "2019-10-07"

    结束日期 = "2019-10-08"

    # LOT = ""

    # 工号 = ""

    # 不良模式 = ""

    工段 = "VI"

    if form.getvalue("开始日期") is not None:
        开始日期 = str(form.getvalue("开始日期"))

    if form.getvalue("结束日期") is not None:
        结束日期 = str(form.getvalue("结束日期"))

    # if form.getvalue("LOT") is not None:
    #     LOT = str(form.getvalue("LOT"))

    # if form.getvalue("工号") is not None:
    #     工号 = str(form.getvalue("工号"))

    # if form.getvalue("不良模式") is not None:
    #     不良模式 = str(form.getvalue("不良模式"))

    if form.getvalue("工段") is not None:
        工段 = str(form.getvalue("工段"))

    # 有效性判断

    if 开始日期 == "":
        out_state = "开始日期不能为空"

    if 结束日期 == "":
        out_state = "结束日期不能为空"

    结束日期 = time.mktime(time.strptime(结束日期, "%Y-%m-%d"))

    结束日期 = 结束日期 + 86400

    结束日期 = time.strftime("%Y-%m-%d", time.localtime(结束日期))

    # 数据查询

    if out_state == "":

        if 工段 == "G":

            conn = pyodbc.connect("DRIVER={SQL Server};SERVER=10.1.10.209,1433;DATABASE=不良解析系统;UID=AVIC_READER;PWD=123456")

            cursor = conn.cursor()

            查询 = " select isnull(LOT,'')LOT FROM T_工程检 WHERE  UP_DATE BETWEEN CONVERT(DATETIME, '" + 开始日期 + "') AND CONVERT(DATETIME,'" + 结束日期 + "') AND 工段='G' ORDER BY LOT"

        elif 工段 == "D":

            conn = pyodbc.connect("DRIVER={SQL Server};SERVER=10.1.10.209,1433;DATABASE=不良解析系统;UID=AVIC_READER;PWD=123456")

            cursor = conn.cursor()

            查询 = " select isnull(LOT,'')LOT FROM T_工程检 WHERE  UP_DATE BETWEEN CONVERT(DATETIME, '" + 开始日期 + "') AND CONVERT(DATETIME,'" + 结束日期 + "') AND 工段='D' ORDER BY LOT"

        elif 工段 == "中试线":
    
            conn = pyodbc.connect("DRIVER={SQL Server};SERVER=10.1.10.209,1433;DATABASE=中试线;UID=AVIC_READER;PWD=123456")

            cursor = conn.cursor()

            查询 = " select isnull(LOT,'')LOT from T_记录 WHERE 上传时间 BETWEEN CONVERT(DATETIME, '" + 开始日期 + "') AND CONVERT(DATETIME,'" + 结束日期 + "') ORDER BY LOT"
       
        elif 工段 == "VI":

            conn = pyodbc.connect("DRIVER={SQL Server};SERVER=10.1.10.209,1433;DATABASE=VI系统;UID=AVIC_READER;PWD=123456")

            cursor = conn.cursor()

            查询 = "SELECT DISTINCT LOT_ID from T_MASTER WHERE START_DATE_TIME BETWEEN CONVERT(DATETIME, '" + 开始日期 + "') AND CONVERT(DATETIME,'" + 结束日期 + "') ORDER BY LOT_ID"

        cursor.execute(查询)

        rows = cursor.fetchall()

        LOT_list = ""

        for a in rows:

           if a.LOT not in LOT_list:

               LOT_list=LOT_list+"','"+a.LOT

        LOT_list = "'"+LOT_list+"'"

        print(LOT_list)

        conn = pyodbc.connect("DRIVER={SQL Server};SERVER=10.1.10.209,1433;DATABASE=不良解析系统;UID=AVIC_READER;PWD=123456")

        cursor = conn.cursor()

        查询 = " select LOT,不良模式,count(*)数量 FROM T_工程检 WHERE  1=1 AND LOT in  (" + LOT_list + ") AND 工段='D' GROUP BY LOT,不良模式 ORDER BY LOT"

        # 查询 = 查询 + " AND 工段='D'"
        #
        # 查询 = 查询 + " GROUP BY LOT,不良模式 ORDER BY LOT"

        # print(查询)

        cursor.execute(查询)

        rows = cursor.fetchall()

        # print(rows)

        data_list = []

        LOT = []

        不良 = []

        品名 = []

        面取数 = []

        面取数 = []

        作业PANEL = []

        for i in rows:
            if i.LOT not in LOT:
                LOT.append(i.LOT)
            if i.不良模式 not in 不良:
                不良.append(i.不良模式)

        不良_乱 = set(不良)

        不良_正 = []

        for i in 不良_乱:
            不良_正.append(i)

        不良_正.sort()

        question = []

        for inx,i in enumerate(LOT):

            conn = pyodbc.connect("DRIVER={SQL Server};SERVER=10.1.10.213,1433;DATABASE=DATAMART;UID=AVIC_READER;PWD=123456")

            cursor = conn.cursor()

            # print(i)

            查询 = "SELECT DISTINCT LOT_NO,MNF_PRDCT_NM as 品名,STR_PNL_QTY AS 作业PANEL数,STR_PNL_QTY/STR_SHT_QTY AS 面取数,STR_DATE AS 投入日期 FROM DM_FAB_DM_HT_LOT_HISTORY WHERE  LOT_NO='" + str(i) + "' AND MAJOR_STEP+ MINOR_STEP ='" + 工序1 + "' AND (EQP_UNIT IS NOT NULL ) AND  LOT_HIST_STS='000' AND STR_PNL_QTY IS NOT NULL ORDER BY STR_PNL_QTY desc"

            cursor.execute(查询)

            rows2 = cursor.fetchall()

            # print(rows2)

            if len(rows2):

                # 品名.append(rows2[0].品名)

                作业PANEL.append(rows2[0].作业PANEL数)

                面取数.append(rows2[0].作业PANEL数/20)

            else:

                question.append(inx)


        question = reversed(question)

        for i in question:

            del LOT[i]

        for inx,i in enumerate(LOT):

            t_data = "\"LOT\":\"" + i + "\","

            # t_data = t_data +

            times2 = 作业PANEL[inx]

            for j in 不良_正:

                t_data = t_data + "\"" + str(j) + "\":\""

                times1 = 0

                for k in rows:

                    if (k.LOT == i):

                        if (j == k.不良模式):

                            times1 = times1 + k.数量

                t_data = t_data + str(round(times1 / times2 * 100, 2)) + "%\","

            t_data = "{" + t_data[0:-1] + "}"

            data_list.append(t_data)

        out_data = ','.join(data_list)

        out_data = "[" + out_data + "]"


except Exception as e:

    out_state = str(e)

out = "{\"state\":\"" + out_state + "\",\"data\":" + out_data + "}"

print(out)