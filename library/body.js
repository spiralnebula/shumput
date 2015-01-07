(function ( window, module ) {

	if ( window.define && window.define.amd ) {
		define(module)
	} else { 

		var current_scripts, this_script, module_name

		current_scripts     = document.getElementsByTagName("script")
		this_script         = current_scripts[current_scripts.length-1]
		module_name         = this_script.getAttribute("data-module-name") || "body"
		window[module_name] = module
	}
})( 
	window,
	{
		define : {
			allow   : "*",
			require : [
				"morph"
			],
		},

		define_body_map : function () { 
			return { 
				text            : "first",
				suggestion_list : "first:next",
			}
		},

		define_body : function ( define ) {
			return {
				"class" : define.class_name.wrap,
				"child" : [
					( define.with.size === "large" ? 
						this.define_large( define ) : 
						this.define_small( define ) 
					)
				].concat(
					( define.with.verify ? 
						this.define_text( define ) : 
						[] 
					)
				)
			}
		},

		define_text : function ( define ) {

			var verification, default_value, to_be_shown

			default_value = define.with.value || ""
			to_be_shown   = define.with.verify.when( default_value )
			verification  = { 
				is_valud : false,
				text     : ""
			}

			if ( to_be_shown ) { 
				verification = define.with.verify.with( default_value )
			} 

			return {
				"class"   : (
					verification.is_valid ? 
						define.class_name.text_valid : 
						define.class_name.text_invalid
				),
				"text"    : verification.text,
				"display" : ( to_be_shown ? "block" : "none" )
			}
		},

		define_small : function ( define ) {
			
			var definition

			definition = {
				"type"         : "input",
				"class"        : define.class_name.small,
				"value"        : define.with.value || "",
				"data-shumput" : "true"
			}
			
			if ( define.with.placeholder ) { 
				definition.placeholder = define.with.placeholder
			}

			return definition
		},

		define_large : function ( define ) { 
			
			var definition
			
			definition = {
				"type"         : "textarea",
				"data-shumput" : "true",
				"class"        : define.class_name.large,
				"text"         : define.with.value || ""
			}

			if ( define.with.placeholder ) { 
				definition.placeholder = define.with.placeholder
			}

			return definition
		},

		define_suggest_list : function ( define ) { 
			return {
				"class" : define.class_name.suggest_container,
				"child" : this.library.morph.index_loop({
					subject : define.list,
					else_do : function ( loop ) {
						return loop.into.concat({
							"class"                          : define.class_name.suggest,
							"data-shumput-choose-suggestion" : loop.indexed.matching.word,
							"child" : [
								{ 
									"class"                          : define.class_name.suggest_text,
									"text"                           : loop.indexed.matching.leftover.before,
									"data-shumput-choose-suggestion" : loop.indexed.matching.word,
								},
								{ 
									"class"                          : define.class_name.suggest_text_match,
									"text"                           : loop.indexed.matching.text,
									"data-shumput-choose-suggestion" : loop.indexed.matching.word,
								},
								{ 
									"class"                          : define.class_name.suggest_text,
									"text"                           : loop.indexed.matching.leftover.after,
									"data-shumput-choose-suggestion" : loop.indexed.matching.word,
								}
							]
						})
					}
				})
			}
		},
	}
)