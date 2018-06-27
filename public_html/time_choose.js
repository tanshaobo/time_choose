function show(selector, type) {
var obj = selector || $(".time_choose");
        var type = type || "yyyy-mm-dd";
//日历框结构
        var str = '<div class="time_box"><ul class="time_list"><li class="time_item"><span class="prev">&lt;</span><select class="current current_year"></select><select class="current current_month"><option value="01">01</option><option value="02">02</option><option value="03">03</option><option value="04">04</option><option value="05">05</option><option value="06">06</option><option value="07">07</option><option value="08">08</option><option value="09">09</option><option value="10">10</option><option value="11">11</option><option value="12">12</option></select><span class="next">&gt;</span><span class="today">今天</span></li><li class="time_item"><span class="day week">日</span><span class="day week">一</span><span class="day week">二</span><span class="day week">三</span><span class="day week">四</span><span class="day week">五</span><span class="day week">六</span></li><li class="time_item day_box"></li></ul></div>';
//月份数组
        var month_num = new Array("01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12");
//定义年列表 每月天列表
        var year_List, day_List;
//获取当前时间（年、月、日）
        var nowDate = new Date();
        var nowYear = nowDate.getFullYear();
        var nowMonth = nowDate.getMonth();
        var nowDay = nowDate.getDate();
//定义年份范围
        var start_year = nowYear - 50, end_year = nowYear + 50;
//控制显隐参数
        var flag = 0;
        obj.on("mouseenter", function () {
        flag = 0;
        });
        obj.on("mouseleave", function () {
        flag = 1;
        });
        obj.on("focus", ".times", function(){
//判断当前input是否有对应的时间框
        if ($(this).siblings(".time_box").length > 0) {
        } else {
        $(this).parent().append(str);
        }
        $(document).find(".time_box").hide();
                $(this).parent().find(".time_box").show();
                chooseYear(start_year, end_year);
//判断当前年份是否有对应的年份下拉框
                if ($(this).parent().find(".current_year option").length < 1) {
        $(this).parent().find(".current_year").append(year_List);
        }
//判断当前input是否有值 有值显示对应的时间，否则显示当前时间
        if ($(this).val() !== "") {
        let current_time = $(this).val();
                let current_year = parseInt(current_time.substring(0, 4));
                let current_month = current_time.substring(5, 7);
                $(this).parent().find(".current_year").val(current_year);
                $(this).parent().find(".current_month").val(current_month);
        } else {
        $(this).parent().find(".current_year").val(nowYear);
                $(this).parent().find(".current_month").val(month_num[nowMonth]);
        }
        let object = $(this);
                setDays(object);
        });
//选框出现改变时变更对应时间
        obj.on('change', 'select', function () {
        let object = $(this);
                setDays(object);
        });
//点击选择当前时间（天）
        obj.on("click", ".day_box span", function () {
        let day = $(this).attr("value");
                if (!day) {
        return;
        } else {
        let value_year = $(this).parents(".time_box").find(".current_year").val();
                let value_month = $(this).parents(".time_box").find(".current_month").val();
                $(this).parents(".time_choose").find("input").val(outPut(value_year, value_month, day, type));
                $(document).find(".time_box").hide();
        }
        });
//当前input失去焦点后隐藏其对应的时间框
        obj.on("blur", ".times", function(){
        if (flag === 1) {
        $(this).parent().find(".time_box").hide();
        }
        });
//点击今天铺设今天日期
        obj.on("click", ".today", function () {
        obj.find("input").val(outPut(nowYear, month_num[nowMonth], nowDay, type));
                $(document).find(".time_box").hide();
        })
//点击<显示上一月
        obj.on("click", ".prev", function () {
        let current_month = parseInt($(this).siblings('.current_month').val());
                let current_year = parseInt($(this).siblings('.current_year').val());
                if (current_month === 1) {
        $(this).siblings('.current_month').val(month_num[month_num.length - 1]);
                $(this).siblings('.current_year').val(current_year - 1);
        } else {
        $(this).siblings('.current_month').val(month_num[current_month - 2]);
        }
        ;
                let object = $(this);
                setDays(object);
        });
//点击>显示下一月
        obj.on("click", ".next", function () {
        let current_month = parseInt($(this).siblings('.current_month').val());
                let current_year = parseInt($(this).siblings('.current_year').val());
                if (current_month === 12) {
        $(this).siblings('.current_month').val(month_num[0]);
                $(this).siblings('.current_year').val(current_year + 1);
        } else {
        $(this).siblings('.current_month').val(month_num[current_month]);
        }
        ;
                let object = $(this);
                setDays(object);
        });
//生成年份列表
        function chooseYear(a, b) {
        year_List = "";
                for (var i = a; i <= b; i++) {
        year_List += '<option value=' + i + '>' + i + '</option>';
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
                day_List += '<span class="day" value=' + j + '>' + i + '</span>';
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
        function setDays(object) {
        let this_year = parseInt(obj.find(".current_year").val());
                let this_month = parseInt(obj.find(".current_month").val()) - 1;
                let day_info = getDays(this_year, this_month);
                chooseDate(day_info[0], day_info[1]);
                obj.find(".day_box").empty();
                if (obj.find(".day_box span").length < 1) {
        obj.find(".day_box").append(day_List);
        }
        }
//输出格式
function outPut(year, month, day, type){
year = String(year);
        let result;
        switch (type){
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
}
;