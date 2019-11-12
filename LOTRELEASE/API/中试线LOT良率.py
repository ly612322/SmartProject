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

    LOTID = ""

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

            查询 = " select isnull(LOT,'')LOT FROM T_工程检 WHERE  UP_DATE BETWEEN CONVERT(DATETIME, '" + 开始日期 + "') AND CONVERT(DATETIME,'" + 结束日期 + "') AND 工段='G' ORDER BY LOT"

        elif 工段 == "D":

            conn = pyodbc.connect("DRIVER={SQL Server};SERVER=10.1.10.209,1433;DATABASE=不良解析系统;UID=AVIC_READER;PWD=123456")

            cursor = conn.cursor()

            查询 = " select isnull(LOT,'')LOT FROM T_工程检 WHERE  UP_DATE BETWEEN CONVERT(DATETIME, '" + 开始日期 + "') AND CONVERT(DATETIME,'" + 结束日期 + "') AND 工段='D' ORDER BY LOT"

        elif 工段 == "中试线":

            conn = pyodbc.connect("DRIVER={SQL Server};SERVER=10.1.10.209,1433;DATABASE=中试线;UID=AVIC_READER;PWD=123456")

            cursor = conn.cursor()

            查询 = "SELECT DISTINCT LOT from T_记录 WHERE 上传时间 BETWEEN CONVERT(DATETIME, '" + 开始日期 + "') AND CONVERT(DATETIME,'" + 结束日期 + "') ORDER BY LOT "

        cursor.execute(查询)

        rows = cursor.fetchall()

        # print(rows)

        LOT_list = ""

        for a in rows:

            if a.LOT not in LOT_list:

                LOT_list = LOT_list+"','"+a.LOT

        LOT_list = "'"+LOT_list+"'"

        # print(LOT_list)

        conn = pyodbc.connect("DRIVER={SQL Server};SERVER=10.1.10.209,1433;DATABASE=中试线;UID=AVIC_READER;PWD=123456")

        conn1 = pyodbc.connect("DRIVER={SQL Server};SERVER=10.1.10.209,1433;DATABASE=YMS;UID=AVIC_READER;PWD=123456")

        cursor = conn.cursor()

        cursor1 = conn1.cursor()

        data_list = []

        品名查询 = "SELECT 品名,简称_上海G50 from V_品名 WHERE 原产地='上海G50' AND 生产地='上海G50'"

        查询 = "SELECT 验证目的,验证内容,作业工序,LOT,LEFT(PANEL,10) AS SHEET,T1品名,C1品名,代码,描述,等级,数量,序号,上传时间 from T_记录 where LOT in  (" + LOT_list + ") "

        # print(查询)
        #
        # print(品名查询)

        cursor.execute(查询)

        rows = cursor.fetchall()

        cursor1.execute(品名查询)

        rows_品名查询 = cursor1.fetchall()

        # print(rows)
        #
        # print(rows_品名查询)

        data_产出 = []

        for i in rows:

            T_品名 = ""

            T_品名简称 = ""

            tuple1 = i

            for j in rows_品名查询:

                if j.品名 == i.C1品名:

                    T_品名简称 = j.简称_上海G50

            tuple1 = tuple1[:6] + tuple([T_品名简称]) + tuple1[6:]

            data_产出.append(tuple1)

        # print(data_产出)

        arr_简称 = []

        arr_不良代码 = []

        for k in data_产出:

            t_简称 = k[6]

            t_验证目的 = k[0]

            t_验证内容 = k[1].strip()

            t_作业工序 = k[2]

            t_SHEET = k[4]

            t_代码 = k[8]

            t_描述 = k[9]

            arr_简称.append(t_简称+","+t_SHEET+","+t_验证目的+","+t_验证内容+","+t_作业工序)

            arr_不良代码.append(t_代码+","+t_描述)

        arr_简称 = set(arr_简称)

        arr_简称 = sorted(arr_简称)

        arr_不良代码 = set(arr_不良代码)

        arr_不良代码 = sorted(arr_不良代码)

        # print(arr_不良代码)

        # print(arr_简称)

        for x in arr_简称:

            temp = x.split(",")

            temp_简称 = temp[0]

            temp_SHEET = temp[1]

            temp_目的 = temp[2]

            temp_内容 = temp[3].strip()

            temp_工序 = temp[4]

            t_作业总数 = ''

            # t_作业总数 = sum([z[11] for z in data_产出 if
            #               temp_工序 == z[2] and temp_简称 == z[6] and temp_SHEET == z[4] and temp_目的 == z[
            #                   0] and temp_内容 == z[1] and z[12] == 0])

            t_作业总数 = sum([z[11] for z in data_产出 if
                          temp_工序 == z[2] and temp_简称 == z[6] and z[12] == 0])

            t_良品数 = ''

            # t_良品数 = sum([z[11] for z in data_产出 if
            #              temp_工序 == z[2] and temp_简称 == z[6] and temp_SHEET == z[4] and temp_目的 == z[
            #                  0] and temp_内容 == z[1] and z[12] == 0 and z[10] in ('S', 'A', 'B')])

            t_良品数 = sum([z[11] for z in data_产出 if
                         temp_工序 == z[2] and temp_简称 == z[6] and z[12] == 0 and z[10] in ('S', 'A', 'B')])

            t_良率 = '%.2f' % (t_良品数/t_作业总数*100)+'%'

            temp_代码 = ''

            temp_不良数 = ''

            for y in arr_不良代码:

                y = y.split(",")

                temp1_代码 = y[0]

                temp1_描述 = y[1]

                temp1_等级 = 'S'

                temp2_等级 = 'A'

                temp3_等级 = 'B'

                temp4_等级 = 'C'

                temp5_等级 = 'D'

                # t_S级不良数 = sum([z[11] for z in data_产出 if
                #                temp_工序 == z[2] and temp_简称 == z[6] and temp_SHEET == z[4] and temp_目的 == z[0] and temp_内容 == z[
                #                    1] and temp1_代码 == z[8] and temp1_等级 == z[10]])
                #
                # t_A级不良数 = sum([z[11] for z in data_产出 if
                #                temp_工序 == z[2] and temp_简称 == z[6] and temp_SHEET == z[4] and temp_目的 == z[0] and temp_内容 == z[
                #                    1] and temp1_代码 == z[8] and temp2_等级 == z[10]])
                #
                # t_B级不良数 = sum([z[11] for z in data_产出 if
                #                temp_工序 == z[2] and temp_简称 == z[6] and temp_SHEET == z[4] and temp_目的 == z[0] and temp_内容 == z[
                #                    1] and temp1_代码 == z[8] and temp3_等级 == z[10]])
                #
                # t_C级不良数 = sum([z[11] for z in data_产出 if
                #                temp_工序 == z[2] and temp_简称 == z[6] and temp_SHEET == z[4] and temp_目的 == z[0] and temp_内容 == z[
                #                    1] and temp1_代码 == z[8] and temp4_等级 == z[10]])
                #
                # t_D级不良数 = sum([z[11] for z in data_产出 if
                #                temp_工序 == z[2] and temp_简称 == z[6] and temp_SHEET == z[4] and temp_目的 == z[0] and temp_内容 == z[
                #                    1] and temp1_代码 == z[8] and temp5_等级 == z[10]])

                t_S级不良数 = sum([z[11] for z in data_产出 if
                               temp_工序 == z[2] and temp_简称 == z[6] and temp1_代码 == z[8] and temp1_等级 == z[10]])

                t_A级不良数 = sum([z[11] for z in data_产出 if
                               temp_工序 == z[2] and temp_简称 == z[6] and temp1_代码 == z[8] and temp2_等级 == z[10]])

                t_B级不良数 = sum([z[11] for z in data_产出 if
                               temp_工序 == z[2] and temp_简称 == z[6] and temp1_代码 == z[8] and temp3_等级 == z[10]])

                t_C级不良数 = sum([z[11] for z in data_产出 if
                               temp_工序 == z[2] and temp_简称 == z[6] and temp1_代码 == z[8] and temp4_等级 == z[10]])

                t_D级不良数 = sum([z[11] for z in data_产出 if
                               temp_工序 == z[2] and temp_简称 == z[6] and temp1_代码 == z[8] and temp5_等级 == z[10]])

                temp_代码 = temp1_代码

                temp_不良数 = t_S级不良数 + t_A级不良数 + t_B级不良数 + t_C级不良数 + t_D级不良数

                temp_不良率 = '%.2f' % (temp_不良数/t_作业总数*100) + '%'

                if temp_不良率 == "0.00":

                    continue

                temp_解析不良数 = t_C级不良数 + t_D级不良数

                temp_解析不良率 = '%.2f' % (temp_解析不良数 / t_作业总数 * 100) + '%'

                # t_S级不良率 = '%.2f' % (t_S级不良数/t_作业总数*100)+'%'
                #
                # t_A级不良率 = '%.2f' % (t_A级不良数/t_作业总数*100)+'%'
                #
                # t_B级不良率 = '%.2f' % (t_B级不良数/t_作业总数*100)+'%'

                t_C级不良率 = '%.2f' % (t_C级不良数/t_作业总数*100)+'%'

                t_D级不良率 = '%.2f' % (t_D级不良数/t_作业总数*100)+'%'

                t_data = "\"LOT\":\"" + str(temp_SHEET[0:8]) + "\","

                # t_data = t_data + "\"验证目的\":\"" + str(temp_目的) + "\","
                #
                # t_data = t_data + "\"验证内容\":\"" + str(temp_内容) + "\","

                t_data = t_data + "\"作业工序\":\"" + str(temp_工序) + "\","

                t_data = t_data + "\"作业总数\":\"" + str(t_作业总数) + "\","

                t_data = t_data + "\"良率\":\"" + str(t_良率) + "\","

                t_data = t_data + "\"不良代码\":\"" + str(temp_代码)+"\\\\"+str(temp1_描述) + "\","

                t_data = t_data + "\"不良率\":\"" + str(temp_不良率) + "\","

                t_data = t_data + "\"解析不良率\":\"" + str(temp_解析不良率) + "\""

                # t_data = t_data + "\"S级\":\"" + str(t_S级不良率) + "\","
                #
                # t_data = t_data + "\"A级\":\"" + str(t_A级不良率) + "\","
                #
                # t_data = t_data + "\"B级\":\"" + str(t_B级不良率) + "\","

                # t_data = t_data + "\"C级\":\"" + str(t_C级不良率) + "\","
                #
                # t_data = t_data + "\"D级\":\"" + str(t_D级不良率) + "\""

                t_data = "{" + t_data + "}"

                data_list.append(t_data)

        out_data = ','.join(data_list)

        out_data = "[" + out_data + "]"

except Exception as e:

  out_state = str(e)

out = "{\"state\":\"" + out_state + "\",\"data\":" + out_data + "}"

print(out)
