function showTime(obj) {
    this.id = obj.id;
    this.type = obj.type || "yyyy-mm-dd";
}

showTime.prototype.init = function () {
//日历框结构
    let str = '<ul class="time_list"><li class="time_item"><span class="prev">&lt;</span><select class="current current_year"></select><select class="current current_month"><option value="01">01</option><option value="02">02</option><option value="03">03</option><option value="04">04</option><option value="05">05</option><option value="06">06</option><option value="07">07</option><option value="08">08</option><option value="09">09</option><option value="10">10</option><option value="11">11</option><option value="12">12</option></select><span class="next">&gt;</span><span class="today">今天</span></li><li class="time_item"><span class="day week">日</span><span class="day week">一</span><span class="day week">二</span><span class="day week">三</span><span class="day week">四</span><span class="day week">五</span><span class="day week">六</span></li><li class="time_item day_box"></li></ul>';
    //月份数组
    let month_num = new Array("01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12");
    //定义年列表 每月天列表
    let year_List, day_List;
    //获取当前时间（年、月、日）
    let nowDate = new Date();
    let nowYear = nowDate.getFullYear();
    let nowMonth = nowDate.getMonth();
    let nowDay = nowDate.getDate();
    //定义年份范围
    let start_year = nowYear - 50, end_year = nowYear + 50;
    //控制显隐参数
    let flag = 0;
    let id = document.getElementById(this.id);
    let type = this.type;
    id.onmouseover = function () {
        flag = 0;
    };
    id.onmouseout = function () {
        flag = 1;
    };
    let input = id.getElementsByTagName("input")[0];
    let time_box = document.createElement("div");
    time_box.className = 'time_box';
    let select_year = id.getElementsByClassName("current_year")[0];
    let select_month = id.getElementsByClassName("current_month")[0];
    let option_year = id.getElementsByClassName("option_year");
    let day_box = id.getElementsByClassName("day_box")[0];
    let span = id.getElementsByClassName("day");
    let today = id.getElementsByClassName("today")[0];
    let prev = id.getElementsByClassName("prev")[0];
    let next = id.getElementsByClassName("next")[0];
    input.onfocus = function () {
        if (time_box) {
            id.appendChild(time_box);
            time_box.innerHTML = str;
        }
        hideAll();
        time_box.style.display = 'block';
        chooseYear(start_year, end_year);
        select_year = id.getElementsByClassName("current_year")[0];
        select_month = id.getElementsByClassName("current_month")[0];
        if (option_year) {
            select_year.innerHTML = year_List;
        }
        if (input.value !== "") {
            select_year.value = parseInt(input.value.substring(0, 4));
            select_month.value = input.value.substring(5, 7);
        } else {
            select_year.value = nowYear;
            select_month.value = month_num[nowMonth];
        }
        setDays();
        //点击选择当前时间（天）
        for (let i = 0; i < span.length; i++) {
            span[i].onclick = function () {
                let day = this.getAttribute("value");
                if (!day) {
                    return;
                } else {
                    input.value = outPut(select_year.value, select_month.value, day, type);
                    hideAll();
                }
            };
        }
        ;
//        选框出现改变时变更对应时间
        select_year.onchange = function () {
            setDays();
        };
        select_month.onchange = function () {
            setDays();
        };
        today = id.getElementsByClassName("today")[0];
        prev = id.getElementsByClassName("prev")[0];
        next = id.getElementsByClassName("next")[0];
//点击今天铺设今天日期
        today.onclick = function () {
            input.value = outPut(nowYear, month_num[nowMonth], nowDay, type);
            hideAll();
        };
//点击<显示上一月
        prev.onclick = function () {
            if (select_month.value === "01") {
                select_month.value = month_num[month_num.length - 1];
                select_year.value = select_year.value-1;
            } else {
                select_month.value = month_num[parseInt(select_month.value) - 2];
            }
            ;
            setDays();
        };

//点击>显示下一月
        next.onclick = function () {
            if (select_month.value === "12") {
                select_month.value = month_num[0];
                select_year.value = parseInt(select_year.value) + 1;
            } else {
                select_month.value = month_num[parseInt(select_month.value)];
            }
            ;
            setDays();
        };
    };

//当前input失去焦点后隐藏其对应的时间框
    input.onblur = function () {
        if (flag === 1) {
            time_box.style.display = "none";
        }
    };

//生成年份列表
    function chooseYear(a, b) {
        year_List = "";
        for (var i = a; i <= b; i++) {
            year_List += '<option class="option_year" value=' + i + '>' + i + '</option>';
        }
    }
    ;
//生成日期列表
    function chooseDate(a, b) {
        day_List = "";
        for (var i = 0; i < b; i++) {
            day_List += '<span class="day" value=""></span>';
        }
        ;
        for (var i = 1; i <= a; i++) {
            let j = i < 10 ? "0" + i : i;
            day_List += '<span class="day " value=' + j + '>' + i + '</span>';
        }
        ;
    }
    ;
//根据年月获取对应的天数和星期
    function getDays(year, month) {
        year = parseInt(year);
        month = parseInt(month);
        let day = new Array();
        if (month === 0 || month === 2 || month === 4 || month === 6 || month === 7 || month === 9 || month === 11) {
            day[0] = 31;
        } else if (month === 3 || month === 5 || month === 8 || month === 10) {
            day[0] = 30;
        } else if (month === 1 && (year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0))) {
            day[0] = 29;
        } else {
            day[0] = 28;
        }
        ;
        let d = new Date();
        d.setFullYear(year);
        d.setMonth(month);
        d.setDate(1);
        day[1] = d.getDay();
        return day;
    }
    ;
    function setDays() {
        let this_year = select_year.value;
        let this_month = parseInt(select_month.value) - 1;
        let day_info = getDays(this_year, this_month);
        chooseDate(day_info[0], day_info[1]);
        day_box = id.getElementsByClassName("day_box")[0];
        day_box.innerHTML = "";
        if (span) {
            day_box.innerHTML = day_List;
        }
    }
//输出格式
    function outPut(year, month, day, type) {
        year = String(year);
        let result;
        switch (type) {
            case "yyyy-mm-dd":
                result = year + '-' + month + '-' + day;
                break;
            case 'yy-mm-dd':
                year = year.substring(2, 4);
                result = result = year + '-' + month + '-' + day;
                break;
            case "yy-mm":
                year = year.substring(2, 4);
                result = result = year + '-' + month;
                break;
            case "yyyy/mm/dd":
                result = year + '/' + month + '/' + day;
                break;
            case 'yy/mm/dd':
                year = year.substring(2, 4);
                result = result = year + '/' + month + '/' + day;
                break;
            case "yy/mm":
                year = year.substring(2, 4);
                result = result = year + '/' + month;
                break;
        }
        return result;
    }
    //隐藏所有时间框
    function hideAll() {
        for (let i = 0; i < document.getElementsByClassName("time_box").length; i++) {
            document.getElementsByClassName("time_box")[i].style.display = "none";
        }
    }
};


