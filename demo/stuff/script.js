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
		return;

	}

// Document ready
$(x);



















/* END */