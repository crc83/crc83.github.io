
// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;(function ( $, window, document, undefined ) {

		// undefined is used here as the undefined global variable in ECMAScript 3 is
		// mutable (ie. it can be changed by someone else). undefined isn't really being
		// passed in so we can ensure the value of it is truly undefined. In ES5, undefined
		// can no longer be modified.

		// window and document are passed through as local variable rather than global
		// as this (slightly) quickens the resolution process and can be more efficiently
		// minified (especially when both are regularly referenced in your plugin).

		// Create the defaults once
		var pluginName = "jkeyboard",
			defaults = {
				layout: "english",
				input: $('#input')
		};
		

		var function_keys = {
			backspace: {
				text: '&nbsp;',
			},
			return: {
				text: 'Enter'
			},
			shift:{
				text: '&nbsp;'
			},
			space: {
				text: '&nbsp;'
			},
			numeric_switch:{
				text: '123',
				command: function(){
					this.createKeyboard('numeric');
					this.events();
				}
			},
			layout_switch:{
				text: '&nbsp;',
				command: function(){
					var l = this.toggleLayout();
					this.createKeyboard(l);
					this.events();
				}
			},
			character_switch:{
				text: 'ABC',
				command: function(){
					this.createKeyboard(layout);
					this.events();
				}
			},
			symbol_switch:{
				text: '#+=',
				command: function(){
					this.createKeyboard('symbolic');
					this.events();
				}
			}
		}



		var layouts = {
			selectable: ['azeri', 'english', 'russian','exersise'],
			azeri: [
				['q','ü','e','r','t','y','u','i','o','p', 'ö', 'ğ'],
				['a','s','d','f','g','h','j','k','l', 'ı', 'ə'],
				['shift','z','x','c','v','b','n','m', 'ç', 'ş','backspace'],
				['numeric_switch','layout_switch', 'space','return']
			],
			english: [
				['q','w','e','r','t','y','u','i','o','p', ],
				['a','s','d','f','g','h','j','k','l', ],
				['shift','z','x','c','v','b','n','m', 'backspace'],
				['numeric_switch','layout_switch', 'space','return']
			],
			russian: [
				['й','ц','у','к','е','н','г','ш','щ','з', 'х' ],
				['ф','ы','в','а','п','р','о','л','д','ж', 'э' ],
				['shift','я','ч','с','м','и','т','ь','б','ю', 'backspace'],
				['numeric_switch','layout_switch', 'space','return']
			],
			numeric: [
				['1','2','3','4','5','6','7','8','9','0'],
				['-','/',':',';','(',')','$','&','@','"'],
				['symbol_switch','.',',','?','!',"'",'backspace'],
				['character_switch','layout_switch','space','return'],
			],			
			exersise: [
				['*и','&#x049A;','&#x049B;',			'*а', 'о','&#x049B;',				'*А', '&#x049C;','&#x049D;','&#x049E;'],
				['*у','&#x049A;','&#x049F;',			'*У', '&#x04A0;','&#x04A1;',		'*л','&#x04A2','&#x049B;'],
				['*Л','&#x049C;','&#x049D;',			'*м','&#x04A2','&#x049A','&#x049B',	'*М','&#x049C','&#x04A3','&#x049D'],
				['*н','&#x04A4','&#x04A5','&#x04A6',	'*Н','&#x04A7','&#x04A8',			'*І','&#x04A9','&#x04AA'],
				['*в','&#x04AB','о',					'*В','&#x04AA','&#x04AC',			'*к','&#x04AD','&#x04AE','&#x04AF'],
				['*К','&#x04A7','&#x04B0','&#x04B1',	'*п','&#x04AD','&#x04B2',			'*П','&#x04B3','&#x04B4','&#x04B5'],
				['*т','&#x04AD','&#x04B6','&#x04B2',	'*Т','&#x04B3','&#x04B7','&#x04B4','&#x04B8'],
				['*р','&#x04B9','&#x04B2',				'*Р','&#x04B3','&#x04BA',			'*Е','&#x04BB','&#x04BC'],
				['*д','о','&#x049F',					'*Д','&#x04BD','&#x04BE',			'*з','&#x04C1','&#x04C2'],
				['*З','&#x04C3','&#x04C4',				'*б','о','&#x04BF',					'*Б','&#x04B3','&#x04B5','&#x04C0'],
				['*Г','&#x04B3','&#x04B5'],
				['symbol_switch','.',',','?','!',"'",'backspace'],
				['character_switch','layout_switch','space','return'],
			],
			numbers_only:[
				['1','2','3',],
				['4','5','6',],
				['7','8','9',],
				['0', 'return', 'backspace'],
			], 
			symbolic: [
				['[',']','{','}','#','%','^','*','+','='],
				['_','\\','|','~','<','>'],
				['numeric_switch','.',',','?','!',"'",'backspace'],
				['character_switch','layout_switch','space','return'],

			]
		}

		var shift = false, capslock=false, layout = 'english', layout_id=0;
		// The actual plugin constructor
		function Plugin ( element, options ) {
				this.element = element;
				// jQuery has an extend method which merges the contents of two or
				// more objects, storing the result in the first object. The first object
				// is generally empty as we don't want to alter the default options for
				// future instances of the plugin
				this.settings = $.extend( {}, defaults, options );
				this._defaults = defaults;
				this._name = pluginName;
				this.init();
		}

		Plugin.prototype = {
				init: function () {
					layout = this.settings.layout;
					this.createKeyboard(layout);
					this.events();
				},

				createKeyboard: function(layout){
					shift = false;
					capslock=false;
					
					var keyboard_container = $('<ul/>').addClass('jkeyboard'),
						me = this;

					layouts[layout].forEach(function(line, index){
						var line_container = $('<li/>').addClass('jline');
						line_container.append(me.createLine(line));
						keyboard_container.append(line_container)
					})

					$(this.element).html('').append(keyboard_container);
				},

				createLine: function(line){
					var line_container = $('<ul/>')

					line.forEach(function(key, index){
						var key_container = $('<li/>').addClass('jkey').data('command',key)

						if(function_keys[key]) {
							key_container.addClass(key).html(function_keys[key].text)
						}
						else if (key.indexOf('*') > -1) {
							key_container.addClass('letter red').html(key.replace('*',''))
						} else {
							key_container.addClass('letter').html(key)
						}

						line_container.append(key_container);
					})

					return line_container;
				},

				events: function(){
					var letters = $(this.element).find('.letter'),
						shift_key = $(this.element).find('.shift'),
						space_key = $(this.element).find('.space'),
						backspace_key = $(this.element).find('.backspace'),
						return_key = $(this.element).find('.return'),

						me = this, 
						fkeys = Object.keys(function_keys).map(function(k){
							return '.' + k;
						}).join(',');

					letters.on('click', function(){
						me.type((shift || capslock) ? $(this).text().toUpperCase() : $(this).text());
					})

					space_key.on('click', function(){
						me.type(' ');
					})

					return_key.on('click', function(){
						me.type("\n");
						me.settings.input.parents('form').submit();
					})

					backspace_key.on('click', function(){
						me.backspace();
					})

					shift_key.on('click', function(){

						if(capslock){
							me.toggleShiftOff();
							capslock = false;
						}else{
							me.toggleShiftOn();
						}
					}).on('dblclick', function(){
						capslock = true;
					})


					$(fkeys).on('click', function(){
						var command = function_keys[$(this).data('command')].command;
						if(!command) return;

						command.call(me)

					})

				},
				


				type: function(key){
					var input = this.settings.input,
						  val = input.val(),
						  input_node = input.get(0),
						  start = input_node.selectionStart,
        			end = input_node.selectionEnd,
        			new_string = '';

					
					// caretPosition = this.caretPosition(input.get(0));
					// console.log(caretPosition)
					if(start == end && end == val.length){
						input.val(val+key);
					}else{
						var new_string = this.insertToString(start, end, val, key)
						input.val(new_string);
						start++
						end=start
						input_node.setSelectionRange(start, end);
					}


					
					
					input.trigger('focus')
					

					if(shift && !capslock) {
						this.toggleShiftOff()
					}

				},
				backspace: function(){
					var input = this.settings.input,
						val = input.val();
      
    				input.val(val.substr(0, val.length - 1));  
				},
				toggleShiftOn: function(){
					var letters = $(this.element).find('.letter'),
					 	shift_key  = $(this.element).find('.shift')


					letters.addClass('uppercase');  
					shift_key.addClass('active')
					shift = true;  
				},

				toggleShiftOff: function(){
					var letters = $(this.element).find('.letter'),
					 	shift_key  = $(this.element).find('.shift')

					letters.removeClass('uppercase');  
					shift_key.removeClass('active')
					shift = false;  
				},

				toggleLayout: function(){
					layout_id = layout_id || 0;
					var plain_layouts = layouts.selectable
					layout_id++;

					var current_id = layout_id % plain_layouts.length;
					return plain_layouts[current_id]

				},

				insertToString: function (start, end, string, insert_string) {

				  return string.substring(0, start) + insert_string + string.substring(end, string.length);
				}

		};

		// A really lightweight plugin wrapper around the constructor,
		// preventing against multiple instantiations
		$.fn[ pluginName ] = function ( options ) {
				return this.each(function() {
						if ( !$.data( this, "plugin_" + pluginName ) ) {
								$.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
						}
				});
		};

})( jQuery, window, document );
