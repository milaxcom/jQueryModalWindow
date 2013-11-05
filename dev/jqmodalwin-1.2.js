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
				
				ajax_url	: false,				// (string) - Адрес для запроса; false - не выполнять запрос;
				ajax_method	: "GET",				// Метод передачи данных ALAX.
				ajax_type	: false,				// Тип входящих данных (boolean - автоопределение).
				ajax_data	: false,				// Данные для передачи в виде объекта или строки; false - не отсылать.
				ajax_append	: false,				// true - добавить контент; false - заменить.
				ajax_cache	: false,				// false - браузер не будет кешировать производимый запрос.
				
				isLoad		: false,				// true - контент через AJAX загружен. (для использвания совместно с `once` )
				CACHE_index	: 0						// Номер элемента в КЭШЕ.
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
				"position"	: "fixed",
				"top"		: "0",
				"left"		: "0",
				"width"		: "100%",
				"height"	: "100%",
				"text-align": "center",
				"overflow"	: "auto"
			},
			"attr"		: {						// Список Аттрибутов
			},
			
			// Верхний и нижний сепараторы array( "елемент", "класс", "стиль" )
			"sep-top"		: [ "div", "modal-win-space-top", "position:relative;width:100%;height:50px;" ],
			"sep-down"		: [ "div", "modal-win-space-bottom", "position:relative;width:100%;height:40px;"]
		},
		
		/** Контейнер для текста (карта элемента). */
		container	: {
			"tag"		: "div",				// Название тэга
			"id"		: false,				// Значение аттрибута id; false - без id;
			"class"		: "modal-win-container",// Имя класса (без точки)
			"html"		: "",					// Контент до загрузки AJAX.
			"style"		: {						// Список Стилей
				"position"	: "relative",
				"text-align": "left",
				"margin"	: "0 auto",
				"width"		: "700px",
				"background": "#fff",
				"z-index"	: "5",
				"min-height": "16px"
			},
			"attr"		: {						// Список Аттрибутов
			}
		},
		
		/** Контейнер тени (карта элемента). */
		shadow		: {
			"tag"		: "div",
			"class"		: "modal-win-shadow",
			"style"		: {								// Список Стилей
				"position"	: "fixed",
				"top"		: "0",
				"left"		: "0",
				"width"		: "100%",
				"height"	: "100%",
				"background": "#000"
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
					return this.window/**/.trigger( "Remove" );

				// Моментальная анимация. (запуск тригера удаления/скрытия окна).
				if ( animate["speed-hide"] == 0 || typeof animate["speed-hide"] == "boolean" )
					return	this.window/**/.trigger( "Remove" );
					
				var $window	= this.window;
				// Плавная анимация.
				this.shadow/**/.animate( animate["off-style"], animate["speed-hide"], function(){ $window/**/.trigger( "Remove" ); } );
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
			clone			: function( O ) {
				var i,C={},O=(typeof(O)!="object")?{}:O;
				for( i in O ) {
					if (i=="CACHE")continue;
					if(O.hasOwnProperty(i))
						C[i]=(typeof(O[i])=="object")?CORE.clone(O[i]):O[i];
				}
				return C;
			},
		/**#@-*/
		
		/** ######################################### */
		/** ############ Основные МЕТОДЫ ############ */
		/**
		 * РЕВЕРСИВНЫЙ МЕТОД ВЫПОЛНЯЮЩИЙ УДАЛЕНИЕ/СКРЫТИЕ ОКНА.
		 */
		Remove			: function() {
			var CACHE 		= [],
				Remove		= new Function(),
				$next_window= false;
			/*
			 * Создание индекса окон в порядке появления.
			 */
			for ( var i in CORE.CACHE )
				if ( typeof CORE.CACHE[i] == "object" )
					CACHE.push(i);
			CACHE.reverse();
			
			/*
			 * Удаление/скрытие первого активного окна (последнего из созданных).
			 */
			for ( var i in CACHE ) {
				if ( CORE.CACHE[ CACHE[i] ][0].window.css( "display" ) != "none" ) {
					// Выловим из массива нужные элементы.
					var	$elements	= CORE.CACHE[ CACHE[i] ][0],
						$window		= $elements.window,
						$shadow		= $elements.shadow,
						ModalWin	= CORE.CACHE[ CACHE[i] ][1];
					
							// once = true (скрыть)
					if ( ModalWin.settings.once) {
						Remove	= function( e ){
							// Опциональный close.
							var close	= ModalWin.close.call( $elements, true );
							if ( close === false )
								return;
							
							$( this ).hide();
							e.data["shadow"].hide();
							$( this ).trigger( "unlock" );
						};
					}else { // once = false (удалить)
						Remove	= function( e ){
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
			
			if( typeof $window != "object" ) return;
			
			// Обработчик удаления/скрытия.
			$window/**/.on( "Remove", {"shadow":$shadow}, Remove);
			// Обработчик разблокировки
			$window/**/.on( "unlock", body_unlock );
			
			// Запуск анимации тени.
			ModalWin.shadow.animateOff.call( $elements, ModalWin.shadow.animate )
		},
		
		
		/**
		 * Удаление текущего окна (без анимации).
		 **/
		kill			: function(ModalWin) {
			var index	= ModalWin.settings.CACHE_index;
			if ( typeof CORE.CACHE[index] != "object" ) return;
			var Map		= CORE.CACHE[index][0];
				Map.window.remove();
				Map.shadow.remove();
			delete CORE.CACHE[index];
		},
		
		
		/**
		 * Удаление всех окон (без анимации).
		 **/
		killAll			: function() {
			var	i, index = [];
			for ( i in CORE.CACHE )
				if ( typeof CORE.CACHE[i] == "object" )
					index.push(i);
			index.reverse();
			for ( var i in index )
				CORE.CACHE[ index[i] ][0].window.trigger("kill");
			CORE.CACHE	= new Array;
		},
		
		
		/**
		 * ЛОГИКА СОЗДАЮЩАЯ ОКНО.
		 * @ this	- экземпляр ядра для этого окна.
		 */
		init			: function( ) {
			// Ограничить уже имеющиеся элементы.
			this["set_all_overflow"].call( this );

			/**#1
			 * Создание экземпляров
			 */
				var ModalWin	= this,
					zIndex		= CORE.get_zIndex(),
					CACHE_index	= CORE.CACHE.length,
					$window		= this._$.create( this.window )/**/.hide()/**/.css( "zIndex", zIndex ),
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
			
			/** Обновление в списке параметров номера элемента в КЭШЕ. */
			this.settings.CACHE_index		= CACHE_index;
			
			/**
			 * Расстановка экзеппляров по своим местам.
			 */ 
				$window/**/.append( $sep_top )/**/.append( $container )/**/.append( $sep_down );
				$( this.$el["body"] )/**/.prepend( $shadow )/**/.prepend( $window );
				
				// Добавляем в КЭШ, для удобства управления.
				CORE.CACHE[ CACHE_index ]	= Array( $elements, this );
			/**#@-*/
			
			/**#2
			 * Установка обработчиков
			 */
				// Закрытие окна.
				$shadow./**/on( "close", function(){	$window.trigger( "close" );						});

				// Закрытие окна.
				$window./**/on( "close", function(){	CORE.Remove();									});
				
				// Удалить окно, несмотря на once = true;
				$window./**/on( "kill", function(){		CORE.kill( ModalWin );							});
				
				// Позволяет обновить контент.
				$window./**/on( "reload", function(){
					ModalWin.settings.isLoad	= false;
					ModalWin.ajax.init.call( $elements, ModalWin );
				});
				
				// Обработчик отлавливающий клик вне контэйнера для текста.
				if ( this.settings.close_shadow == true )
					$window/**/.on( "click", function( e ){
						// Был ли клик по самому контейнеру
						if ( $( e.target ).is( $container ) )
							return;
						// Является ли этот элемент потомком контейнера
						if( $(e.target).parents().is( $container ) )
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
						ID			= map.id.replace( /^#{1}/, "" );
					// Просмотр КЭША.
					for( var i in CORE.CACHE ) {
						if ( typeof CORE.CACHE[i] == "object" && CORE.CACHE[i][0].container.attr( "id" ) == ID ) {
							from_CACHE								= true;
							CACHE_index								= CORE.CACHE.length;
							CORE.CACHE[i][1].settings.CACHE_index	= CACHE_index;	
							$elements								= CORE.CACHE[i][0];
							ModalWin								= CORE.CACHE[i][1];
							
							// Переместим этот КЭШ наверх.
							CORE.CACHE[ CACHE_index ]	= Array( $elements, ModalWin );
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
				} else {
					// Создаем клон ядра для будущего окна.
					ModalWin			= CORE.clone( CORE );
					ModalWin			= ModalWin_install( map, ModalWin );
					CORE.init.call( ModalWin );
				}
			/**#2-*/
			return ModalWin;
		};
	
	
	/** #############################################################
	 * Метод для jQuery с логикой распределяющей карту по ModalWin (клону ядра для этого экземпляра окна).
	 **/
		var ModalWin_install= function ( map, ModalWin ) {
			if( typeof map != "object" )
				return ModalWin;
			// id
			ModalWin.container.id	= (typeof map.id == "string")		? map.id	: false;
			
			// once
			ModalWin.settings.once	= (typeof map.once == "boolean")	? map.once	: false;
			
			// html
			ModalWin.container.html	= (typeof map.html == "string")		? map.html	: ModalWin.container.html;
			
			// top-space
			if ( typeof map["top-space"] == "string" )
				ModalWin.window["sep-top"][2] = ModalWin.window["sep-top"][2].replace( /height:\d*.*;/, "height:" + map["top-space"] + ";" );
			
			// bottom-space
			if ( typeof map["bottom-space"] == "string" )
				ModalWin.window["sep-down"][2] = ModalWin.window["sep-down"][2].replace( /height:\d*.*;/, "height:" + map["bottom-space"] + ";" );
				
			// shadow
			if ( typeof map.shadow == "string" )
				ModalWin.shadow.style.background	= map.shadow;
			
			// append
			ModalWin.settings.ajax_append	= (typeof map.append == "boolean")	? map.append : ModalWin.settings.ajax_append;
			
			// close
			ModalWin.settings.close_class	= (typeof map.close	== "string" )	? map.close	: ModalWin.settings.close_class;
			
			// url
			ModalWin.settings.ajax_url		= (typeof map.url  == "string")		? map.url	: ModalWin.settings.ajax_url;
			ModalWin.settings.ajax_url		= (typeof map.url  == "boolean")	? map.url	: ModalWin.settings.ajax_url;
			
			// load
			ModalWin.settings.ajax_url		= (typeof map.load == "string")		? map.load	: ModalWin.settings.ajax_url;
			ModalWin.settings.ajax_url		= (typeof map.load == "boolean")	? map.load	: ModalWin.settings.ajax_url;
			
			// ajax_method
			ModalWin.settings.ajax_method	= (typeof map.ajax_method == "string") ? map.ajax_method : "GET";
			
			// ajax_data
			ModalWin.settings.ajax_data		= (typeof map.ajax_data == "string")	? map.ajax_data  : ModalWin.settings.ajax_data;
			ModalWin.settings.ajax_data		= (typeof map.ajax_data == "object")	? map.ajax_data  : ModalWin.settings.ajax_data;
			ModalWin.settings.ajax_data		= (typeof map.ajax_data == "boolean")	? map.ajax_data  : ModalWin.settings.ajax_data;
			
			// html
			ModalWin.container.html	= (typeof map.container == "string")			? map.container	 : ModalWin.container.html;
			
			/** container - object */
				if ( typeof map.container == "object" ) {
					var key,type,value,attr;
					for ( key in map.container ) {
						value= map.container[key];
						type = typeof value;
						if ( type == "object" ) {
							for ( attr in value )
								ModalWin.container[key][attr]= value[attr];
						}
						else
							ModalWin.container[key]			= value;
					}
				}
			/**#- **/
			
			/** window - object*/
				if ( typeof map.window == "object" ) {
					var key,type,value,attr;
					for ( key in map.window ) {
						value= map.window[key];
						type = typeof value;
						if ( type == "object" ) {
							for ( attr in value )
								ModalWin.window[key][attr]	= value[attr];
						}
						else
							ModalWin.window[key]			= value;
					}
				}
			/**#- **/
						
			/** shadow - object */
				if ( typeof map.shadow == "object" ) {
					var key,type,value,attr;
					for ( key in map.shadow ) {
						value= map.shadow[key];
						type = typeof value;
						if ( type == "object" ) {
							for ( attr in value )
								ModalWin.shadow[key][attr]		= value[attr];
						}
						else {
							/** Мульти инструкции. */
							switch( key ) {
								case "opacity":
										ModalWin.shadow.animate["on-style"]["opacity"]	= value;
									break;
								case "animate-opacity":
										ModalWin.shadow.animate["off-style"]["opacity"]	= value;
									break;
								case "animate-show":
										ModalWin.shadow.animate["speed-show"]			= value;
									break;
								case "animate-hide":
										ModalWin.shadow.animate["speed-hide"]			= value;
									break;
								case "background":
										ModalWin.shadow.style["background"]				= value;
									break;
								case "close":
										ModalWin.settings.close_shadow	= ( typeof value == "boolean" ) ? value : ModalWin.settings.close_shadow;
									break;
								case "animateOn":
										ModalWin.shadow.animateOn	= ( typeof value == "function" ) ? value : ModalWin.settings.close_shadow;
									break;
								case "animateOff":
										ModalWin.shadow.animateOff	= ( typeof value == "function" ) ? value : ModalWin.settings.close_shadow;
									break;
								default:
										ModalWin.shadow[key]				= map.shadow[key];
									break;
							}
						}/* END else */
					}/* END for */
				}
			/**#- **/
			
			/** close - object */
				if ( typeof map.close == "object" ) {
					//class
					ModalWin.settings.close_class	= (typeof map.close["class"]=="string")   ? map.close["class"]  : ModalWin.settings.close_class;
					//shadow
					ModalWin.settings.close_shadow	= (typeof map.close["shadow"]=="boolean") ? map.close["shadow"] : ModalWin.settings.close_shadow;
				}
			/**#- **/
			
			/** load - object */
				if ( typeof map.load == "object" ) {
					// url
					ModalWin.settings.ajax_url		= (typeof map.load.url  == "string")	? map.load.url	: ModalWin.settings.ajax_url;
					ModalWin.settings.ajax_url		= (typeof map.load.url  == "boolean")	? map.load.url	: ModalWin.settings.ajax_url;
					// ajax_method
					ModalWin.settings.ajax_method	= (typeof map.load.method == "string")	? map.load.method : "GET";
					// ajax_data
					ModalWin.settings.ajax_data		= (typeof map.load.data == "string")	? map.load.data  : ModalWin.settings.ajax_data;
					ModalWin.settings.ajax_data		= (typeof map.load.data == "object")	? map.load.data  : ModalWin.settings.ajax_data;
					ModalWin.settings.ajax_data		= (typeof map.load.data == "boolean")	? map.load.data  : ModalWin.settings.ajax_data;
					// append
					ModalWin.settings.ajax_append	= (typeof map.load.append == "boolean")	? map.load.append : ModalWin.settings.ajax_append;
					// ajax_cache
					ModalWin.settings.ajax_cache	= (typeof map.load.ajax_cache == "boolean")	? map.load.ajax_cache : ModalWin.settings.ajax_append;
				}
			/**#- **/
			
			/** call - object */
				if ( typeof map.call == "object" ) {
					ModalWin.before	= ( typeof map.call.before	== "function" ) ? map.call.before	: ModalWin.before;
					ModalWin.after	= ( typeof map.call.after	== "function" ) ? map.call.after	: ModalWin.after;
					ModalWin.always	= ( typeof map.call.always	== "function" ) ? map.call.always	: ModalWin.always;
					ModalWin.close	= ( typeof map.call.close	== "function" ) ? map.call.close	: ModalWin.close;
				}
			/**#- **/
			return ModalWin;
		};
	
	/** ############################################################# */
	$.ModalWin			= ModalWin;
	$.ModalWin_CORE		= CORE;
	$.ModalWin_install	= ModalWin_install;
	$.ModalWin_KillAll	= CORE.killAll;
	
} )( jQuery );