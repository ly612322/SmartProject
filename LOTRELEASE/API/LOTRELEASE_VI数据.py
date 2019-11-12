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

    开始日期 = "2019-10-07"

    结束日期 = "2019-10-08"

    if form.getvalue("开始日期") is not None:
        开始日期 = str(form.getvalue("开始日期"))

    if form.getvalue("结束日期") is not None:
        结束日期 = str(form.getvalue("结束日期"))

    # 有效性判断

    if 开始日期 == "":
        out_state = "开始日期不能为空"

    if 结束日期 == "":
        out_state = "结束日期不能为空"

    # 结束日期 = datetime.datetime.strftime(datetime.datetime.strptime(结束日期, '%Y-%m-%d') + datetime.timedelta(days=1),"%Y-%m-%d")

    # 数据查询

    if out_state == "":

        # conn = pyodbc.connect(
        #     "DRIVER={SQL Server};SERVER=10.1.10.209,1433;DATABASE=VI系统;UID=AVIC_READER;PWD=123456")

        # cursor = conn.cursor()

        # 查询 = "SELECT [LOT_ID] FROM V_MASTER  WHERE END_DATE_TIME BETWEEN CONVERT(DATETIME, '" + 开始日期 + "') AND CONVERT(DATETIME,'" + 结束日期 + "')"

        # cursor.execute(查询)

        # rows = cursor.fetchall()

        # lot_list = []

        # for i in rows:

        #     lot_list.append(i.LOT_ID)

        # lot_list = list(set(lot_list))

        # print(lot_list)

        conn = pyodbc.connect(
            "DRIVER={SQL Server};SERVER=10.1.10.209,1433;DATABASE=VI系统;UID=AVIC_READER;PWD=123456")

        cursor = conn.cursor()

        查询 = "SELECT [LOT_ID],[TOTAL_PANEL_COUNT],[PINFO] FROM V_MASTER WHERE END_DATE_TIME BETWEEN CONVERT(DATETIME, '" + \
            开始日期 + "') AND CONVERT(DATETIME,'" + 结束日期 + "')"

        cursor.execute(查询)

        rows = cursor.fetchall()

        lot_list = []

        pinfo = []

        total = []

        for a in rows:

            lot_list.append(a.LOT_ID)

            pinfo.append(a.PINFO)

        lot_list = list(set(lot_list))

        pinfo = list(set(pinfo))

        # print(lot_list)

        data_list = []

        set_lot = []

        count = 0

        for index in range(len(lot_list)):

            t_data = "\"LOT\":\"" + lot_list[index] + "\","

            for index1 in range(len(rows)):

                set_lot = []

                sel_lot = []

                if (lot_list[index] == rows[index1].LOT_ID):

                    set_lot.append(rows[index1])

                    print(sel_lot)

                    for index5 in range(len(set_lot)):

                        sel_lot.append(sel_lot[index5])

                    print(sel_lot)
                    
            for index2 in range(len(pinfo)):

                t_data = t_data + "\"" + str(pinfo[index2]) + "\":\""

                for index3 in range(len(set_lot)):

                    count = 0

                    if(pinfo[index2] not in sel_lot):

                        t_data = t_data + "\" 0.00%\",\""

                    if(pinfo[index2] == set_lot[index3].PINFO):

                        count = count + 1

                        t_data = t_data + str(round(count / rows[index1].TOTAL_PANEL_COUNT*100, 2)) + "%\","

            t_data = "{" + t_data + "}"

            data_list.append(t_data)

        print(data_list)

        # for index in range(len(lot_list)):

        #     t_data = "\"LOT\":\"" + lot_list[index] + "\","

        #     for index1 in range(len(pinfo)):

        #         t_data = t_data + "\"" + str(pinfo[index1]) + "\":\""

        #         for index2 in range(len(rows)):

        #             set_lot = []

        #             if(rows[index2].LOT_ID == lot_list[index]):

        #                 set_lot.append(rows[index2])

        #         for index3 in range(len(set_lot)):

        #             count = 0

        #             if(pinfo[index1] not in set_lot.PINFO):

        #                 t_data = t_data + "\" 0.00%\","

        #             if(pinfo[index1] == set_lot[index3].PINFO):

        #                 count = count + 1

        #                 t_data = t_data + str(round(count / set_lot[index3].TOTAL_PANEL_COUNT * 100, 2)) + "%\","

        for i in temp:

            t_data = "\"LOT\":\"" + str(i).strip() + "\""

            t_data = "{" + t_data + "}"

            data_list.append(t_data)

        out_data = ','.join(data_list)

        out_data = "[" + out_data + "]"

except Exception as e:

    out_state = str(e)

out = "{\"state\":\"" + out_state + "\",\"data\":" + out_data + "}"

# print(out)
