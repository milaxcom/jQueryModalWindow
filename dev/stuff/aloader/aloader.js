aLoader = {

	prop : {
		prefix : "aLoader",
		bodyTrigger : function (_bool) {
			if (_bool) {
				//if (!($.browser.msie&&$.browser.version<=7)) aLoader.s_body.css({"overflow" : "auto"});
				aLoader.s_body.removeAttr('style');
				aLoader.s_body.css({"overflow" : "visible"});
			} else {
				aLoader.s_body.css({"overflow" : "hidden", "position" : "relative"});
			}
		},
		containerConfig : function () {
			var _element = $(aLoader.data.elementContainer);
			var pxToNum = function (_str) {
				return _str.substr(_str, _str.indexOf("px"));
			}
			_element.attr("id", aLoader.data.id);
			_element.css(aLoader.data.elementCSS);
			//if ($.browser.msie) { var _width = pxToNum(_element.css("padding-left"))*1 + pxToNum(_element.css("padding-right"))*1 + pxToNum(aLoader.data.elementCSS.width)*1; _element.css("width", _width); }
			aLoader.s_container.prepend(_element);
			_element.prepend(aLoader.data.content);
		},
		closeHover : function () {
			var _defaultCloseOpacity = "0.3";

			var seeClose = function (_status) {
				if (_status) aLoader.s_close.stop().animate({opacity : 1}, 200, 'linear');
				else aLoader.s_close.stop().animate({opacity : _defaultCloseOpacity}, 200, 'linear');
			}

			aLoader.s_close.css({"opacity" : _defaultCloseOpacity});

			aLoader.inhover = false;

			aLoader.s_close.hover(function () {
				seeClose(true);
				aLoader.inhover = false;
			}, function () {
				seeClose(false);
			});

			var _hoverTimeout = 0;

			aLoader.s_box.mousemove(function (e) {
				clearTimeout(_hoverTimeout);
				_hoverTimeout = setTimeout(function () {
					var _element = aLoader.s_container.find("> div:visible");
					if (_element.length) {
						var _offset = _element.offset();
						if ((e.pageX > _offset.left) && (e.pageX < _offset.left+_element.outerWidth()) && (e.pageY > _offset.top) && (e.pageY < _offset.top+_element.outerHeight(true))) {
							seeClose(false);
							aLoader.inhover = true;
						}
						else {
							aLoader.inhover = false;
							seeClose(true);
						}
					}
				}, 20);
			}).mouseleave(function () {
				seeClose(false);
			});
		}
	},

	defaultData : {
		once : false,
		shadowCSS : {
			"display" : "block",
			"background-color" : "#000",
			//"background" : "url(data/bg-win.gif) repeat",
			"opacity" : 0
		},
		containerCSS : {

		},
		closeButton : true,
		elementContainer : "<div class='aLoaderStandart'/>",
		elementCSS : {
			"width" : "540px",
			"padding" : "20px 30px",
			"text-align" : "left",
			"margin" : "0 auto",
			"background-color" : "none",
			"z-index" : "999",
			"position" : "relative",
			"display" : "none"
		},
		shadowDuration : 400,
		shadowOpacity : "0.5",
		callback : function () {

		},
		content : ""
	},

	set : function () {
		if (!aLoader.prepend) {
			aLoader.s_box = $("<div class='" + aLoader.prop.prefix + "Box'><div class='" + aLoader.prop.prefix + "BoxTopSepp'/><div class='" + aLoader.prop.prefix + "Container'/><div class='" + aLoader.prop.prefix + "BoxBottomSepp'/></div>");
			aLoader.s_shadow = $("<div class='" + aLoader.prop.prefix + "Shadow'/>");
			aLoader.s_close = $("<div class='" + aLoader.prop.prefix + "Close'/>");
			aLoader.s_container = aLoader.s_box.find("." + aLoader.prop.prefix + "Container");

			aLoader.prop.closeHover();
			aLoader.setClose();

			aLoader.s_body.prepend(aLoader.s_box).prepend(aLoader.s_shadow).prepend(aLoader.s_close);

			aLoader.prepend = true;
		}

		aLoader.s_container.css(aLoader.data.containerCSS);
		aLoader.prop.bodyTrigger(false);

		aLoader.s_shadow.css(aLoader.data.shadowCSS);
		if (aLoader.data.shadowOpacity) aLoader.s_shadow.animate({opacity : aLoader.data.shadowOpacity}, aLoader.data.shadowDuration, 'linear');
		else aLoader.s_shadow.css({opacity : aLoader.data.shadowOpacity});
	},

	close : function () {

		if (aLoader.data.once) {
			aLoader.s_container.find("> div:visible").hide();
		} else {
			aLoader.s_container.find("> div:visible").remove();
		}
		aLoader.s_box.hide();
		aLoader.s_close.hide();
		aLoader.s_shadow.animate({opacity : 0}, aLoader.data.shadowDuration, 'linear', function () {
			$(this).hide();
			aLoader.prop.bodyTrigger(true);
		});

		return false;
	},

	setClose : function () {
		var _els = [aLoader.s_close, aLoader.s_box];

		for (var _i=0;_i<_els.length;_i++) {
			_els[_i].bind("click", function () {
				if ((!aLoader.inhover) && (aLoader.data.closeButton)) {
					aLoader.close();
				}
			});
		}
	},

	exec : function (_personalData) {

		aLoader.s_body = $("body");
		aLoader.s_window = $(window);

		var _combinedData = new Object();
		var _firstStart = false;

		if ((_personalData.once && _personalData.id) || (!_personalData.once)) {

			_personalData.id = _personalData.id || aLoader.prop.prefix + "WindowId" + Math.floor(Math.random()*1000000000);

			delete(aLoader.data);
			aLoader.data = {}
			$.extend(true, aLoader.data, aLoader.defaultData, _personalData);

			aLoader.set();

			if (!$("#" + aLoader.data.id).length) { _firstStart = true; aLoader.prop.containerConfig();}

			var start = function () {
				if (_firstStart) $("#" + aLoader.data.id).each(aLoader.data.callback);
				if (aLoader.data.closeButton) aLoader.s_close.show();
				aLoader.s_box.show();
				$("#" + aLoader.data.id).show();
			}

			if (aLoader.data.shadowDuration) setTimeout(start, aLoader.data.shadowDuration); else start();

		}

	}

}
