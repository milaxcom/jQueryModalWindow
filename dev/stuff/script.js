x = function () {
	
	x.viewCode();

	x.codeEval();

	$.ajaxSetup({
		cache : false
	});

}


x.viewCode = function () {

	// По клику показываем/скрываем блок с кодом.
	$(".view_code").on("click", function () {
		$(this).next().toggle();
		return false;
	});

}

/**
 * Загружает контент из указанной страницы и препендит в body
 * @return void
 */
x.loadurl = function (url) {
	$.ajax({
		"dataType" : "html",
		"method" : "get",
		"cache" : false,
		"url" : url,
		"success" : function (data) {
			$("body")
			.css({"position" : "relative", "overflow" : "hidden"})
			.prepend(data);
		}
	});
}

x.aloaderstart = function (load_url) {
	aLoader.exec({
		id : "testwindow",
	    elementCSS : {
			"padding" : "0",
			"width" : "534px",
			"border-radius" : "2px",
			"background-color" : "#ffffff"
	    },
	    shadowCSS : {
	    	"background-color" : "#000"
	    },
	    shadowDuration : 500,
	    shadowOpacity : 0.4,
	    once : true,
	    closeButton : false,
	    content : '123',
		callback : function () {
			$this = $(this);
			$.ajax({
				url : load_url,
				dataType : "html",
				success : function (data) {
					$this.html(data);
				}
			});
		}
	});
	// aLoader.exec({
	// 	id : "aloader-test",
	// 	shadowOpacity : "0.4",
	// 	shadowCSS : {
	// 		"display" : "block",
	// 		"background-color" : "#000",
	// 		"opacity" : 0
	// 	},
	// 	elementCSS : {
	// 		"width" : "600px",
	// 		"background-color" : "#fff",
	// 		"padding" : 0
	// 	},
	//     closeButton : false,
	// 	callback : function () {
	// 		$this = $(this);
	// 		$.ajax({
	// 			url : load_url,
	// 			dataType : "html",
	// 			success : function (data) {
	// 				$this.html(data);
	// 			}
	// 		});
	// 	}
	// });
}
//x.aloaderstart("/dev/stuff/ex1.html");

/**
 * Стартует код, содержит ряд внутренних методов.
 * Требуется чтобы у кнопки на которую стартует код соответствовала
 * a.demo-button. А так же в атрибуте href кнопки должен содержаться
 * идентификатор тега, который содержит запускаемый код. 
 * 
 * @example
 * <code id="code_1">alert("GO!");</code>
 * <a href="#code_1" class="demo-button">Say «GO!»</a>
 * 
 * @return void
 */
x.codeEval = function () {

	// Демо кнопки (jq)
	$demoButtons = $(".demo-button");
	
	// Стартуем скрипт по клику
	$demoButtons.on("click", x.codeEval.exec);

}

	/**
	 * Запускаем скрипт (eval) 
	 * @return void
	 */
	x.codeEval.exec = function () {
		
		// Получаем селектор блока с кодом
		var stringSelector = $(this).attr("href"); 

		// Получаем строку со скриптом
		var scriptString = $(stringSelector).text();

		// Стартуем скрипт
		$.globalEval(scriptString);
		
		// Требуется в случае, если кнопка является ссылкой.
		return false;

	}

// Document ready
$(x);



















/* END */