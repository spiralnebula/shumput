define({
	// should add a way to recursivley call eloquent when verification passes
	define : {
		allow   : "*",
		require : [
			"morph",
			"transistor",
			"event_master"
		],
	},

	make : function ( define ) {
		
		var shumput_body, event_circle
		shumput_body = this.library.transistor.make(
			this.define_body( define ) 
		)
		event_circle = this.library.event_master.make({
			state  : this.define_state( define ),
			events : this.define_event({
				body : shumput_body,
				with : define.with
			})
		})
		return this.define_interface({
			body         : shumput_body,
			event_master : event_circle
		})
	},

	define_interface : function ( define ) { 
		return { 
			body      : define.body.body,
			append    : define.body.append,
			// get_state : get_state : function () { 
			// 	return define.event_master.get_state()
			// },
			// reset     : function () {
			// 	define.event_master.stage_event({
			// 		called : "reset",
			// 		as     : function ( state ) { 
			// 			return { 
			// 				event : { 
			// 					target : define.body.body
			// 				},
			// 				state : state
			// 			}
			// 		}
			// 	})
			// },
		}
	},

	define_state : function ( define ) {
		return {
			value  : define.with.value || "",
			valid  : ( !define.with.verify ),
			verify : define.with.verify || {}
		}
	},

	define_event : function ( define ) {
		return [
			{ 
				called : "reset"
			},
			{ 
				called       : "shumput input type",
				that_happens : [
					{
						on : define.body.body,
						is : [ "keyup" ]
					}
				],
				only_if      : function ( heard ) {
					console.log(heard.event.target)
					return heard.event.target.hasAttribute("data-shumput")
				}
			}
		]
	},

	define_listener : function ( define ) {
		var self = this
		return [ 
			{
				for       : "shumput input type",
				that_does : function ( heard ) {
					console.log(" yer are typing boyo ")
					return self.input_type_listener({
						data_name  : "data-shumput",
						class_name : define.class_name,
						state      : heard.state,
						event      : heard.event,
					})
				}
			}
		]
	},

	input_type_listener : function ( input ) {
		
		var value, option_state
		
		option_state       = input.state.option[input.event.target.getAttribute( input.data_name )]
		value              = input.event.target.value
		option_state.value = value
		
		if ( option_state.verify && option_state.verify.when ) {

			var verification, text_body

			text_body = input.event.target.nextSibling

			if ( option_state.verify.when( value ) ) {

				verification            = option_state.verify.with( value )
				option_state.valid      = verification.is_valid
				text_body.textContent   = verification.text
				text_body.style.display = "block"

				if ( option_state.valid ) { 
					text_body.setAttribute("class", input.class_name.text_valid )
				} else { 
					text_body.setAttribute("class", input.class_name.text_invalid )
				}

			} else {
				text_body.style.display = "none"
			}
		}

		return { 
			state : input.state,
			event : input.event
		}
	},

	define_body : function ( define ) {
		return {
			"class" : define.class_name.wrap,
			"child" : [
				( define.with.size === "large" ? this.define_large( define ) : this.define_small( define ) )
			].concat(
				( define.with.verify ? this.define_text( define ) : [] )
			)
		}
	},

	define_text : function ( define ) { 
		return {
			"class"   : define.class_name.text,
			"display" : "none",
			"text"    : "Some Text"
		}
	},

	define_small : function ( define ) {
		
		var definition, name
		name       = ( define.option_name ? "data-"+ define.option_name : "data-shumput" )
		definition = {
			"type"  : "input",
			"class" : define.class_name.small,
			"value" : define.with.value || ""
		}
		definition[name] = define.name
		
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
	}
})