var Tips = (function() {
    var tips = {
        /**
         * 显示提示信息窗口(蓝色)
         * @param message 提示信息
         * @param config 配置，可选，可设置显示的时间
         */ 
        showMessage: function(message, config) {
            if (config != null && typeof config === "object") {
                util._showWindow(message, util.constants.messageClassName, config.time);
            } else {
                util._showWindow(message, util.constants.messageClassName);
            }
        },
        /**
         * 成功提示窗口(绿色)
         * @param message 提示信息
         */ 
        showSuccess: function(message, config) {
            if (config != null && typeof config === "object") {
                util._showWindow(message, util.constants.successClassName, config.time);
            } else {
                util._showWindow(message, util.constants.successClassName);
            }
        },
        /**
         * 错误提示窗口(红色)
         * @param message 提示信息
         */ 
        showError: function(message, config) {
            if (config != null && typeof config === "object") {
                util._showWindow(message, util.constants.errorClassName, config.time);
            } else {
                util._showWindow(message, util.constants.errorClassName);
            }
        }
    };
    //辅助
    var util = {
        constants: {
            //模态窗体的id
            windowID: "window-div",
            //默认显示时间(秒)
            defaultTime: 3,
            //窗体的样式名称
            messageClassName: "message-window",
            successClassName: "success-window",
            errorClassName: "error-window"
        },
        //初始化Tips对象，引入css
        init: function() {
            util.requireCSS("css/tips.css");
        },
        /**
         * 引入css文件
         * @param url css路径
         */ 
        requireCSS: function(url) {
            var css = document.createElement("link");
			css.rel = "stylesheet";
			css.href = url;
			var head = document.getElementsByTagName("head")[0];
			head.appendChild(css);
        },
        /**
         * 窗体显示的真正实现
         * @param message 提示信息
         * @param className 窗口的样式
         * @param time 显示的时间
         */ 
        _showWindow: function(message, className, time) {
            var div = util._getDiv();
			div.innerHTML = message;
			//动态根据文本长度计算信息条宽度
			var width = util.getWidth(message);
			div.style.width = width + "px";
			div.style.marginLeft = "-" + width / 2 + "px";
			div.className = className;
			div.style.display = "block";
			util._close(div, time || util.constants.defaultTime);
        },
        /**
         * 获取窗体div，如果已经存在于页面中，那么无需再次创建
         * @return dom
         */
        _getDiv: function() {
            var div = document.getElementById(util.constants.windowID);
			if (div == null) {
                div = document.createElement("div");
                div.id = util.constants.windowID;
                document.body.appendChild(div);
            }
            return div;
        },
        /**
         * 根据消息的长度计算窗体的宽度
         * @param message 消息
         */
        getWidth: function(message) {
            return 300 / 12 * message.length;
        },
         /**
         * 关闭窗体
         * @param div 窗体
         * @param seconds 显示的时间
         */
        _close: function(div, seconds) {
            setTimeout(function() {
                div.style.display = "none";
            }, seconds * 1000);
        }
    };
    util.init();
    return tips;
})();