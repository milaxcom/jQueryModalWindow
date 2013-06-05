x = function () {
	
	x.viewCode();

	x.codeEval();

}


x.viewCode = function () {

	// По клику показываем/скрываем блок с кодом.
	$(".view_code").on("click", function () {
		$(this).next().toggle();
		return false;
	});

}

/**
 * Стартует код, содержит ряд внутренних методов
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
		
		// Получаем ID
		var id = x.codeEval.getId($(this));

		// Получаем строку со скриптом
		var scriptString = $("#" + id).text();

		// Стартуем скрипт
		$.globalEval(scriptString);
		
		// Требуется в случае, если кнопка является ссылкой.
		return;

	}

	/**
	 * Получаем ID тега в котором хранится код из href кнопки. 
	 * @return string,boolean
	 */
	x.codeEval.getId = function ($this) {
		
		// Получаем значение атрибута href
		var href = $this.attr("href");

		// Режем первый символ решетки и возвращаем результат
		return href.substr(1);

	}

// Document ready
$(x);



















/* END */