/**
 * Jquery Modal Window
 *
 * @name		Modal Window
 * @package		jquery-1.10.1
 * @author		Aleksei Zhulitov (https://github.com/laosun)
 * @title		Модуль модальных окон.
 * @version		1.1 (alpha)
 * 
 * @link		https://github.com/milaxcom/modal_window
 * 
 * @todo		[в процессе]
 */
( function( $ ) {
	var CORE	= {
		/** ################################ */
		/** ########## Параметры ########### */
			/** Список селекторов. */
			$el				: {
				body		: "body",				// Селектор тела.
				modal_win	: ".modal-win",			// Селектор окон.
				shadow		: ".modal-win-shadow"	// Селектор теней.
			},
			
			/** Прочие параметры. */
			settings		: {
				start_zI	: 1000,					// Стартовый zIndex.
				step_zI		: 10,					// Шаг zIndex.
				
				once		: false,				// true - окно будет скрыто; false - окно будет удалено.
				
				close_class	: ".close-button",		// Имя класса элемента, при клике на котором запускается закрытие.
				close_shadow: true,					// true - закрыть окно при клике по тени (клик вне контэйнера для текста).
				
				ajax_url	: "sample_html.php",	// (string) - Адрес для запроса; false - не выполнять запрос;
				ajax_method	: "GET",				// Метод передачи данных ALAX.
				ajax_type	: false,				// Тип входящих данных (boolean - автоопределение).
				ajax_data	: {},					// Данные для передачи в виде объекта или строки; false - не отсылать.
				ajax_append	: false,				// true - добавить контент; false - заменить.
				ajax_cache	: "",					// false - браузер не будет кешировать производимый запрос.
				
				isLoad		: false,				// true - контент через AJAX загружен. (для использвания совместно с `once` )
			},

			// КЭШ
			CACHE			: [],
		/**#@-*/
		
		/** ##################################################### */
		/** ######### МЕТОДЫ ОЧЕРЕДНОСТИ (опционально). ######### */
			/**
			 * Область `this` следующих методов содержит объект-массив
			 * элементов jQuery:
			 * @ window		- контейнер модульного окна.
			 * @@ sep-top	- верхний сепаратор.
			 * @@ container	- контейнер для текста.
			 * @@ sep-down	- нижний сепаратор.
			 * @ shadow		- контейнер тени.
			 * 
			 * @ data		- (только в функции `after`) контент AJAX запроса.
			 * 
			 */
		
			/** Функция, которая срабатывает до вызова загрузчика.*/
			before			: function(){},
			
			/**
			 * Функция срабатывает после загрузки контента.
			 * ! Если функция возващает false, добавление срабатывать не будет.
			 */
			after			: function(){},
			
			/** Функция срабатывает каждый раз при открытии окна после after, даже если параметр load.once = true. */
			always			: function(){},
			
			/**
			 * Cрабатывает до закрытия окна, в ней можно анимировать исчезновение блока window и shadow.
			 * 
			 * После нее выполняется скрытие/удаление контейнера window,
			 * и если функция вернет false, то идущее после скрытие/удаление и разблокировка BODY не состоится.
			 * ! Если возвращается false, то следует перед этим постоянно выполнять .trigger("unlock") на элементе window,
			 * ! этот триггер автоматически разблокирует BODY, если это последнее активное окно.
			 * 
			 * @param	once	boolean	[булевое значение одноименного флага, false - сигнализирует о необходимости удалить.]
			 */
			close			: function( once ){},
		/**#@-*/
		
		/** ###################################### */
		/** ########## КАРТЫ ЭЛЕМЕНТОВ ########### */
		/** Контейнер всего окна (карта элемента). */
		window		: {
			"tag"		: "div",				// Название тэга
			"class"		: "modal-win",			// Имя класса (без точки)
			"style"		: {						// Список Стилей
				"border": "1px solid red"
			},
			"attr"		: {						// Список Аттрибутов
				
			},
			
			// Верхний и нижний сепараторы array( "елемент", "класс", "стиль" )
			"sep-top"		: [ "div", "modal-win-space-top", "height:20px;" ],
			"sep-down"		: [ "div", "modal-win-space-bottom", "height:10px"]
		},
		
		/** Контейнер для текста (карта элемента). */
		container	: {
			"tag"		: "div",				// Название тэга
			"id"		: false,				// Значение аттрибута id; false - без id;
			"class"		: "modal-win-container",// Имя класса (без точки)
			"html"		: "..load..",			// Контент до загрузки AJAX.
			"style"		: {						// Список Стилей
			},
			"attr"		: {						// Список Аттрибутов
			}
		},
		
		/** Контейнер тени (карта элемента). */
		shadow		: {
			"tag"		: "div",
			"class"		: "modal-win-shadow",
			"style"		: {								// Список Стилей
			},
			"attr"		: {								// Список Аттрибутов
				
			},
			/* Настройки анимации. */
			"animate"	: {
				"disable-any"	: true,					// Только эта тень @TODO
				"on-style"		: { "opacity" : 0.4 },	// Конечный стиль видимой тени.
				"off-style"		: { "opacity" : 0 },	// Конечный стиль скрытой тени. (начальный для созданной)
				"speed-show"	: 500,					// Скорость появления.		( 0/false - моментально )
				"speed-hide"	: 500					// Скорость исчезновения.	( 0/false - моментально )
			},
				
			
			/** Методы анимации тени.
			 * @ this 		- jQuery список элементов.
			 * @ animate	- объект-массив с частью карты объекта shadow, содержащий настройки анимации.
			 */
			/** Появление тени.  */
			"animateOn"			: function( animate ){
				// Если нет объект массива с настройками, моментально отобразить окно.
				if ( typeof animate != "object" || typeof animate["on-style"] != "object" )
					return this.window.show();

				// Моментальная анимация.
				if ( animate["speed-show"] == 0 || typeof animate["speed-show"] == "boolean" ) {
					this.shadow/**/.css( animate["on-style"] );		// Отобразить тень
					this.window/**/.show();							// Отобразить окно
					return;
				}
					
				var $window	= this.window;
				// Плавная анимация.
				this.shadow/**/.animate( animate["on-style"], animate["speed-show"], function(){ $window/**/.show(); } );
			},
			
			/** Исчезновение тени.  */
			"animateOff"			: function( animate ){
				// Если нет объект массива с настройками, моментально запустить триггер удаления/скрытия окна.
				if ( typeof animate != "object" || typeof animate["off-style"] != "object" )
					return this.window/**/.trigger( "remove" );

				// Моментальная анимация. (запуск тригера удаления/скрытия окна).
				if ( animate["speed-hide"] == 0 || typeof animate["speed-hide"] == "boolean" )
					return	this.window/**/.trigger( "remove" );
					
				var $window	= this.window;
				// Плавная анимация.
				this.shadow/**/.animate( animate["off-style"], animate["speed-hide"], function(){ $window/**/.trigger( "remove" ); } );
			}
		},
		
		
		
		/** ############################## */
		/** ############ AJAX ############ */
			ajax			: {
				/**
				 * Основной метод выполняющий запрос.
				 * @ e		- экземпляр ядра для этого окна. (из кэша)
				 * @ this	- объект-массив Jquery элементов ($elements). (из кэша)
				 */
				init	: function( e ) {
					var ModalWin	= e,
						$elements	= this,
						stop		= false;
						
					/* Если адрес не строка или false - stop. */
					if ( typeof e.settings["ajax_url"] != "string" || e.settings["ajax_url"] === false )
						stop	= true;
					
					/* Если блок помечен только одноразовой загрузкой и она уже состоялась - stop. */
					if ( e.settings.once == true && e.settings.isLoad == true )
						stop	= true;
					
					
					// stop - Остановить AJAX и выполнить только always.
					if ( stop ) {
						return ModalWin.always.call( $elements, false );
					}
					
					/**
					 * Параметры запроса.
					 */
						var	ajax_init	= {
								"url"		: e.settings["ajax_url"],
								"type"		: e.settings["ajax_method"]
							};
						
						// Определение что тип контента установлен вручную.
						if ( typeof e.settings["ajax_type"]	== "string" )
						{	ajax_init.dataType	= e.settings["ajax_type"]; }
						// Определение кэширования
						if ( typeof e.settings["ajax_cache"]	== "boolean" )
						{	ajax_init.cache		= e.settings["ajax_cache"];}
						// Определение отсылаемой информации
						if ( typeof e.settings["ajax_data"]	== "object" || typeof e.settings["ajax_data"] == "string" )
						{	ajax_init.data		= e.settings["ajax_data"]; }
						
						// Функция успешной загрузки контента.
						ajax_init.success		= e.ajax["onload"];
						
						// Передаем список элементов.
						ajax_init.e				= $elements;
						
						// Передаем функцию after.
						ajax_init.after			= e.after;
						
						// Передаем флаг типа добавления
						ajax_init.ajax_append	= e.settings.ajax_append;
					/**#@-*/
					
					/** Ajax запрос. */
					$.ajax( ajax_init )
						.done(function( e ){
							ModalWin.settings.isLoad	= true;
							ModalWin.always.call( $elements, e );
						});
				},

				/**
				 * Вызывается после загрузки контента.
				 * @ arguments[0] (e)	- полученный контент
				 * @ this.after			- after функция
				 * @ this.e				- список элементов
				 * @ this.ajax_append	- тип добавления контента
				 */
				onload	: function( e ) {
					this.e.data	= e;
					var after = this.after.call( this.e );
					
					/* ! Если результат запроса Объект, добавление срабатывать не будет.
					 * Поэтому в функцие `after`, так же следует проверять результат.
					 * 
					 * ! Если функция `after` возващает false, добавление срабатывать не будет.
					 */
					if ( typeof e == "object" )	return;
					if ( after === false )		return;
					
					if ( this.ajax_append == true )
						this.e.container.append( e );
					else			
						this.e.container.html( e );
				}
			},
		/**#@-*/
		
		/** ##################################### */
		/** ############ доп. МЕТОДЫ ############ */
			/** Набор методов для получения элементов. */
			_$				: {
				/** Возвращает список из элементов. */
				"elem_list"		: function() {
					return $( this.$el.body +", " +this.$el.modal_win );
				},
				/** Возвращает список всех теней. */
				"shadow_list"	: function() {},
				
				/** Создает по карте и возвращает новый елемент. */
				"create"		: function( map ) {
					if ( typeof map != "object" || typeof map["tag"] != "string" ) {
						return $( "<div>" );
					}
					
					var $new	= $( "<" + map["tag"] + ">" );
					
					// Установка аттрибутов.
					if ( typeof map["attr"] == "object" ){	$new.attr( map["attr"] );		}
					// Установка аттрибута class.
					if ( typeof map["class"] == "string" ){	$new.addClass( map["class"] );	}
					// Установка стилей.
					if ( typeof map["style"] == "object" ){	$new.css( map["style"] );		}
					// Установка аттрибута id.
					if ( typeof map["id"] == "string" ){	$new.attr( "id", map["id"] );	}
					// Установка содержимого.
					if ( typeof map["html"] == "string" ){	$new.html( map["html"] );		}
					return $new;
				}
			},
			
			/** Устанавливает и возващает следующий zIndex. */
			get_zIndex			: function() {
				return this.settings["start_zI"] += this.settings["step_zI"];
			},
			
			/** Метод устанавливает overflow:hidden на имеющиеся элементы. */
			set_all_overflow	: function() {
				this._$["elem_list"].call( this )/**/.css( "overflow", "hidden" );
			},
			
			/** Метод блокирует все элементы кроме последнего. */
			set_floor_overflow	: function() {
				this.set_all_overflow();
				var i	= (this.CACHE.length-1);
					
					if ( typeof this.CACHE[i] != "object" ) return;
					this.CACHE[i][0].window/**/.css( "overflow", "auto" );
			},
			/**
			 * Метод для клонирования объектов.
			 * @ C	- клонируемый объект.
			 */
			clone			: function( C ) {
				var i,O={},C=(typeof(C)!="object")?{}:C;
				for( i in C )if(C.hasOwnProperty(i))O[i]=C[i];
				if(C.hasOwnProperty("CACHE"))delete O["CACHE"];
				return O;
			},
		/**#@-*/
		
		/** ######################################### */
		/** ############ Основные МЕТОДЫ ############ */
		
		/**
		 * РЕВЕРСИВНЫЙ МЕТОД ВЫПОЛНЯЮЩИЙ УДАЛЕНИЕ/СКРЫТИЕ ОКНА.
		 */
		remove			: function() {
			var CACHE 		= [],
				remove		= new Function(),
				$next_window=false;
			/*
			 * Создание индекса окон в порядке появления.
			 * 
			 * Последнее созданное окно в конце массива,
			 * следовательно, массив надо перебирать с конца.
			 */
			for ( var i = (CORE.CACHE.length-1); i >= 0; i-- )
			{
				if ( typeof CORE.CACHE[i] != "object" ) continue;
				CACHE.push( i );
			}
			
			/*
			 * Удаление/скрытие первого активного окна (последнего из созданных).
			 */
			for ( var i = 0; i <= CACHE.length; i++ ) {
				if ( CORE.CACHE[ CACHE[i] ][0].window.css( "display" ) != "none" ) {
					// Выловим из массова нужные элементы.
					var	$elements	= CORE.CACHE[ CACHE[i] ][0],
						$window		= $elements.window,
						$shadow		= $elements.shadow,
						ModalWin	= CORE.CACHE[ CACHE[i] ][1];
					
							// once = true (скрыть)
					if ( ModalWin.settings.once ) {
						remove	= function( e ){
							// Опциональный close.
							var close	= ModalWin.close.call( $elements, true );
							if ( close === false )
								return;
								
							$( this ).hide();
							e.data["shadow"].hide();
							$( this ).trigger( "unlock" );
						};
					}else { // once = false (удалить)
						remove	= function( e ){
							// Опциональный close.
							var close	= ModalWin.close.call( $elements, false );
							if ( close === false )
								return;
							
							$( this ).detach();
							e.data["shadow"].remove();
							$( this ).trigger( "unlock" ).remove();
						};
						//Удалим элемент из КЭША.
						delete CORE.CACHE[ CACHE[i] ];
					}
					break;
				}
			}
			
			// Проверка и получение низлежащего окна.
			if ( typeof CACHE[i+1] != "undefined" )
				$next_window	= this.CACHE[ CACHE[i+1] ][0].window || false;
			
			// Метод автоматической разблокировки.
			var	body_unlock	= ( typeof $next_window != "object" )
					? function(){ $( ModalWin.$el.body ).css("overflow","auto"); }	//Разблокировка BODY
					: function(){ $next_window.css( "overflow","auto" ); };
			
			// Обработчик удаления/скрытия.
			$window/**/.on( "remove", {"shadow":$shadow}, remove);
			// Обработчик разблокировки
			$window/**/.on( "unlock", body_unlock );
			
			
			// Запуск анимации тени.
			ModalWin.shadow.animateOff.call( $elements, ModalWin.shadow.animate )
		},
		
		
		
		/**
		 * ЛОГИКА СОЗДАЮЩАЯ ОКНО.
		 * @ this	- экземпляр ядра для этого окна.
		 */
		init			: function( data ) {
			// Ограничить уже имеющиеся элементы.
			this["set_all_overflow"].call( this );
			
			
			this.container.html = data.html;
			/**#1
			 * Создание экземпляров
			 */
				var ModalWin	= this;
				var zIndex		= CORE.get_zIndex();
				var $window		= this._$.create( this.window )/**/.hide()/**/.css( "zIndex", zIndex ),
					$sep_top	= this._$.create({
						"tag" 	: this.window["sep-top"][0],
						"class" : this.window["sep-top"][1],
						"attr"	: {"style":this.window["sep-top"][2]}
					}),
					$sep_down	= this._$.create({
						"tag" 	: this.window["sep-down"][0],
						"class" : this.window["sep-down"][1],
						"attr"	: {"style":this.window["sep-down"][2]}
					}),
					$container	= this._$.create( this.container ),
					$shadow		= this._$.create( this.shadow )/**/.css( "zIndex", (zIndex-1) )
									/**/.css( this.shadow.animate["off-style"]  ),
									
					// Список элементов для передачи методам.
					$elements	= {
						"window"	: $window,
						"sep-top"	: $sep_top,
						"container"	: $container,
						"sep-down"	: $sep_down,
						"shadow"	: $shadow
					};
			/**#1-*/
			
			/**
			 * Расстановка экзеппляров по своим местам.
			 */ 
				$window/**/.append( $sep_top )/**/.append( $container )/**/.append( $sep_down );
				$( this.$el["body"] )/**/.prepend( $shadow )/**/.prepend( $window );
				
				// Добавляем в КЭШ, для удобства управления.
				CORE.CACHE[ CORE.CACHE.length ]	= Array( $elements, this );
			/**#@-*/
			
			/**#2
			 * Установка обработчиков
			 */
				// Закрытие окна.
				$shadow./**/on( "close", function( e ){	$window.trigger( "close" );		});

				// Закрытие окна.
				$window./**/on( "close", function( e ){	CORE.remove();					});
				
				// Обработчик отлавливающий клик вне контэйнера для текста.
				if ( this.settings.close_shadow == true )
					$window/**/.on( "click", function( e ){
						if ( $container.hasClass( e.target.className ) )
							return;
						$window.trigger( "close" );
					});
					
				// Вешаем обработчик закрытия на элемент с установленным классом "close_class".
				$( this.settings.close_class, $window )/**/.on( "click", function(){
					$window.trigger( "close" );
				});
			/**#2-*/
			
			/**#3
			 * Запуск обработчиков.
			 */
				// Запуск первой опциональной функции.
				this.before.call( $elements );
				
				// Старт AJAX запроса.
				this.ajax.init.call( $elements, this );
				
				// Старт анимации тени. (после блока тени появляется блок окна).
				this.shadow.animateOn.call( $elements, this.shadow.animate );
			/**#3-*/
		},
		
		/**
		 *  ЛОГИКА ВЫПОЛНЯЮЩАЯСЯ С ПОВТОРНО ЗАПРОШЕННЫМ СУЩЕСТВУЮЩИМ ОКНОМ.
		 * @ this	- экземпляр ядра для этого окна. (из кэша)
		 * @ e		- объект-массив Jquery элементов ($elements). (из кэша)
		 */
		re_init		: function( e ) {
			var
				zIndex		= CORE.get_zIndex(),
				$window		= e.window,
				$shadow		= e.shadow;
				
			// Переместим объект наверх.
			$window/**/.css( "zIndex", zIndex );
			$shadow/**/.css( "zIndex", (zIndex-1) );
			
			// Блокировать все элементы кроме этого. */
			CORE.set_floor_overflow();
			
			// Старт AJAX запроса.
			this.ajax.init.call( e, this );
			
			// Если элемент скрыт, отобразить.
			if( e.window.css( "display" ) == "none" ) {
				// Старт анимации тени. (после блока тени появляется блок окна).
				e.shadow/**/.show();
				this.shadow.animateOn.call( e, this.shadow.animate );
			}
		}
	};
	
	

	/** #############################################################
	 * Метод для jQuery запускающий создание/отображение окна.  
	 **/
		var ModalWin		= function ( map ) {
			var	ModalWin	= {},
				from_CACHE	= false;
			/**#1
			 * Поиск в КЭШЕ уже имеющегося окна.
			 * !(должен быть задан map.id)
			 */
				if ( typeof map	== "object" && typeof map.id == "string" )
				{
					var $elements,
						i			= 0,
						ID			= map.id.replace( /^#{1}/, "" );
					// Просмотр КЭША.
					for( i; i < CORE.CACHE.length; i++ ) {
						if ( typeof CORE.CACHE[i] == "object" && CORE.CACHE[i][0].container.attr( "id" ) == ID ) {
							from_CACHE	= true;
							$elements	= CORE.CACHE[i][0];
							ModalWin	= CORE.CACHE[i][1];
							
							// Переместим этот КЭШ наверх.
							CORE.CACHE[ CORE.CACHE.length ]	= Array( $elements, ModalWin );
							// Удалим уровень, с которого был перемещен КЭШ.
							delete CORE.CACHE[i];
							break;
						}
					}
				}
			/**#1-*/
			
			/**#2
			 * Если в КЭШЕ уже есть элемент, вызываем перезапуск "re_init",
			 * иначе клонируем ядро, инсталируем параметры и запускаем создание "init"
			 */
				if ( from_CACHE ) {
					CORE.re_init.call( ModalWin, $elements );
					return;
				} else {
					// Создаем клон ядра для будущего окна.
					ModalWin			= CORE.clone( CORE );
					ModalWin			= ModalWin_install( map, ModalWin );
					CORE.init.call( ModalWin, map );
				}
				
			/**#2-*/
		};
	
	
	/** #############################################################
	 * Метод для jQuery с логикой распределяющей карту по клону ядра.
	 **/
		var ModalWin_install= function ( map, core_clone ) {
			if( typeof map == "object" && typeof map.id == "string" )
				core_clone.container.id	= map.id;
			return core_clone;
		};
	
	/** ############################################################# */
	$.ModalWin			= ModalWin;
	$.ModalWin_CORE		= CORE;
	$.ModalWin_install	= ModalWin_install;
	
} )( jQuery );



