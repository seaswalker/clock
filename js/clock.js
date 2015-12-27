(function() {

    //缓存
    var cache = {
        alarm : document.getElementById("alarm"),
        timeShow : document.getElementById('time-show'),
        hourSelect : document.getElementById('hour-select'),
        minSelect : document.getElementById('min-select'),
        alarmList : document.getElementById("alarm-list"),
        musicList : document.getElementById("music-list").querySelectorAll("li")
    };

    //闹钟图片路径
    var imgSrcs = {
        noAlarm : "images/alarm_no.png",
        alarm : "images/alarm.png"
    };

    //存在的闹钟id
    var alarms = {};
    
    //html模板
    var templates = {
        alarmListTemplate :
            "<li><img class='alarm-icon' src='images/alarm_icon.png' alt='闹钟'/><span class='alarm-item'>{time}</span><img src='images/delete.png' alt='取消设定' class='del_alarm' id='{id}'/></li>"
    };

    //正则表达式
    var patterns = {
        alarmListPattern : /\{time\}/,
        alarmListIdPattern : /\{id\}/
    };

    //正在响的闹钟/定时器的id
    var curID = 0;

    //铃声
    var musics = {
        1 : "music/海阔天空.mp3",
        2 : "music/a place nearby.mp3",
        3 : "music/wish you were here.mp3",
        4 : "music/far away from home.mp3",
        5 : "music/pretty boy.mp3"
    };

    //当前使用的铃声id
    var curMusic = 2;

    //当前正在播放的歌曲
    var curAudio = null;

    /**
     * 获取当前时间
     */
    function time() {
        var date = new Date();
        var hour = date.getHours();
        var min = date.getMinutes();
        cache.timeShow.innerHTML = timeText(hour, min);
    }

    time();
    //一秒钟调用一次
    setInterval(time, 1000);

    /**
     * 初始化小时选择列表
     */
    function initHourSelect() {
        var hour = new Date().getHours();
        var options = '';
        for (hour; hour < 24; hour++) {
            options += '<option>' + hour + '</option>';
        }
        cache.hourSelect.innerHTML = options;
    }
    initHourSelect();

    /**
     * 初始化事件监听器
     * @param reset 是否是重置
     */
    function initListerners(reset) {
        if (!reset) {
            //添加闹钟按钮
            var addAlarmBtn = document.getElementById('set-alarm');
            addEvent(addAlarmBtn, 'click', addAlaram);
        }
        //取消设定
        var btns = document.querySelectorAll("img[class=del_alarm]");
        for (var l = btns.length, i = reset ? l - 1 : 0;i < l; i++) {
            addEvent(btns[i], "click", removeAlaram);
        }
        var list = cache.musicList;
        //铃声切换
        for (i = 0, l = list.length;i < l; i++) {
            addEvent(list[i], "click", swithMusic);
        }
    }
    initListerners(false);

    /**
     * 添加一个闹钟(set-alram按钮触发)
     */
    function addAlaram() {
        //获取选中的小时和分钟
        var selectedHour = +cache.hourSelect.value;
        var selectedMin = +cache.minSelect.value;
        var date = new Date();
        var curHour = date.getHours()
            , curMin = date.getMinutes();
        if (selectedHour < curHour || (selectedHour == curHour && selectedMin <= curMin)) {
            Tips.showError("所选时间不能早于当前时间!");
            return;
        }
        //计算延时
        var delay = 0;
        delay += (selectedMin - curMin) * 60000;
        delay += (selectedHour - curHour) * 3600000;
        delay -= date.getSeconds() * 1000;
        var id = setTimeout(function() {
            activate(id);
        }, delay);
        alarms[id] = 1;
        toAlarmList(selectedHour, selectedMin, id);
    }

    /**
     * 取消闹钟
     * this即为按钮dom对象
     */
    function removeAlaram() {
        if (curID != null && curID > 0) {
            stopAlarm();
            return;
        }
        var id = this.getAttribute("id");
        delete alarms[id];
        clearTimeout(+id);
        var li = this.parentNode;
        var ul = li.parentNode;
        ul.removeChild(li);
    }

    /**
     * 向闹钟列表添加一个记录
     * @param hour 闹钟的时间
     * @param min
     * @param id 定时器id
     */
    function toAlarmList(hour, min, id) {
        cache.alarmList.innerHTML += templates.alarmListTemplate.replace(patterns.alarmListPattern, timeText(hour, min))
            .replace(patterns.alarmListIdPattern, id);
        initListerners(true);
    }

    /**
     * 生成时间字符串，示例: 09:07 AM
     * @param hour 小时
     * @param min 分钟
     * @return String
     */
    function timeText(hour, min) {
        var hourStr = (hour > 9 ? hour : '0' + hour);
        var minStr = (min > 9 ? min : '0' + min);
        return hourStr + ':' + minStr + ' ' + (hour > 11 ? 'PM' : 'AM');
    }

    /**
     * 闹钟到时
     * @param id 定时器id
     */
    function activate(id) {
        //改为红色闹钟图标
        cache.alarm.setAttribute("src", imgSrcs.alarm);
        addEvent(cache.alarm, "click", stopAlarm);
        curID = id;
        cache.alarm.style.cursor = "pointer";
        if (curAudio == null)
            playMusic(musics[curMusic]);
    }

    /**
     * 播放铃声
     * @param url 铃声url
     */
    function playMusic(url) {
        var audio = new Audio(url);
        audio.loop = true;
        curAudio = audio;
        audio.play();
    }

    /**
     * 停止正在响的闹钟
     */
    function stopAlarm() {
        var id = curID;
        curID = 0;
        cache.alarm.setAttribute("src", imgSrcs.noAlarm);
        removeEvent(cache.alarm, "click", stopAlarm);
        cache.alarm.style.cursor = "default";
        removeAlaram.call(document.getElementById(id));
        stopMusic();
    }

    /**
     * 停止铃声播放
     */
    function stopMusic() {
        if (curAudio != null) {
            curAudio.pause();
            curAudio = null;
        }
    }

    /**
     * 切换铃声
     */
    function swithMusic() {
        var list = cache.musicList, li;
        for (var i = 0, l = list.length;i < l; i++) {
            if ((li = list[i]) !== this) {
                li.className = "li-unchosed";
                li.querySelectorAll("span")[1].className = "music-icon-unchosed";
            } else {
                li.className = "";
                li.querySelectorAll("span")[1].className = "music-icon";
                curMusic = li.getAttribute("name");
            }
        }
    }

    /**
     * 添加事件监听函数
     * @param  element 添加监听的dom元素 
     * @param  name 事件名称，没有on前缀
     * @param callback 回调函数
     */
    function addEvent(element, name, callback) {
        if (window.addEventListener) {
            element.addEventListener(name, callback);
        } else if (window.attachEvent) {
            element.attachEvent('on' + name, callback);
        }
    }

    /**
     * 删除事件监听函数
     * @param element 同上
     * @param name
     * @param callback
     */
    function removeEvent(element, name, callback) {
        if (window.removeEventListener) {
            element.removeEventListener(name, callback);
        } else if (window.detachEvent) {
            element.detachEvent("on" + name, callback);
        }
    }

})();