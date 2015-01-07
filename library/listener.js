(function ( window, module ) {

	if ( window.define && window.define.amd ) {
		define(module)
	} else { 

		var current_scripts, this_script, module_name

		current_scripts     = document.getElementsByTagName("script")
		this_script         = current_scripts[current_scripts.length-1]
		module_name         = this_script.getAttribute("data-module-name") || "listener"
		window[module_name] = module
	}
})( 
	window,
	{
		define : {
			allow   : "*",
			require : [
				"morph",
				"suggest",
				"transistor",
				"body",
				"bodymap",
			],
		},

		define_listener : function ( define ) {
			var self = this
			return [
				{ 
					for       : "reset",
					that_does : function ( heard ) {
						
						var body, input_node, option_state

						body               = self.library.bodymap.make({
							body : heard.state.body.node,
							map  : heard.state.body.map
						})
						body.text          = heard.event.target.firstChild
						option_state       = heard.state
						option_state.value = option_state.original_value
						body.text.value    = option_state.original_value
						body.text.setAttribute("value", option_state.original_value )

						if ( option_state.verify && option_state.verify.when ) {

							var verification, text_body

							text_body = body.text.nextSibling

							if ( option_state.verify.when( body.text.value ) ) {

								verification            = option_state.verify.with( body.text.value )
								option_state.valid      = verification.is_valid
								text_body.textContent   = verification.text
								text_body.style.display = "block"

							} else { 
								text_body.style.display = "none"
							}
						}
						
						return heard
					}
				},
				{ 
					for       : "choose suggestion",
					that_does : function ( heard ) {
						
						var body, new_value
						
						new_value = heard.event.target.getAttribute("data-shumput-choose-suggestion")
						body      = self.library.bodymap.make({
							body : heard.state.body.node,
							map  : heard.state.body.map
						})
						console.log( body )
						body.text.value   = new_value
						heard.state.value = new_value

						body.main.removeChild( body.suggestion_list )

						return heard
					}
				},
				{
					for       : "shumput input type",
					that_does : function ( heard ) {

						var body, option_state, input_node, input_container

						body               = self.library.bodymap.make({
							body : heard.state.body.node,
							map  : heard.state.body.map
						})
						option_state       = heard.state
						option_state.value = body.text.value
						
						if ( option_state.suggest.list.constructor === Array ) {

							if ( body.suggestion_list !== null ) { 
								body.main.removeChild( body.suggestion_list )
							}

							if ( body.text.value ) { 

								var matching_word_definition, suggested_body

								matching_word_definition = self.library.suggest.get_the_closest_matching_word_from_an_array({
									array         : option_state.suggest.list,
									searched_text : body.text.value
								})

								if ( matching_word_definition.length > 0 ) {
									suggested_body = self.library.transistor.make(
										self.library.body.define_suggest_list({
											class_name : define.class_name,
											list       : matching_word_definition
										})
									)
									suggested_body.append( body.main )
								}
							}
						}

						if ( option_state.verify ) {

							var verification, text_body

							text_body = input_node.nextSibling

							if ( option_state.verify.when( input_node.value ) ) {

								verification            = option_state.verify.with( input_node.value )
								option_state.valid      = verification.is_valid
								text_body.textContent   = verification.text
								text_body.style.display = "block"

								if ( option_state.valid ) {
									text_body.setAttribute( "class", define.class_name.text_valid )
								} else {
									text_body.setAttribute( "class", define.class_name.text_invalid )
								}

							} else {
								text_body.style.display = "none"
							}

						}

						return heard
					}
				}
			]
		},
	}
)