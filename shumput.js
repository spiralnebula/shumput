define({
	// should add a way to recursivley call eloquent when verification passes
	define : {
		allow   : "*",
		require : [
			"morph",
			"transistor",
			"event_master",
			"transit",
			"body",
			"event",
			"listener",
		],
	},

	make : function ( define ) {
		
		var shumput_body, event_circle

		shumput_body = this.library.transistor.make(
			this.define_body( define ) 
		)
		event_circle = this.library.event_master.make({ 
			state  : this.define_state({
				body : shumput_body,
				with : define.with
			}),
			events : this.define_event({
				body : shumput_body,
				with : define.with
			})
		})
		event_circle.add_listener(
			this.define_listener( define )
		)

		if ( define.with.suggest.list.constructor === Object ) { 

			this.library.transit.to({
				url  : define.with.suggest.list.url,
				do   : define.with.suggest.list.do,
				flat : define.with.suggest.list.flat,
				with : define.with.suggest.list.with,
				when : {
					finished : function ( result ) {
						var list, state
						list               = define.with.suggest.list.when.finished.call( {}, result )
						
						state              = event_circle.get_state()
						state.suggest.list = list
						event_circle.set_state( state )
					}
				}
			})
		}

		return this.define_interface({
			body         : shumput_body,
			event_master : event_circle
		})
	},

	define_interface : function ( define ) { 
		return { 
			body      : define.body.body,
			append    : define.body.append,
			get_state : function () { 
				return define.event_master.get_state()
			},
			reset     : function () {
				define.event_master.stage_event({
					called : "reset",
					as     : function ( state ) { 
						return { 
							event : { 
								target : define.body.body
							},
							state : state
						}
					}
				})
			},
		}
	},

	define_state : function ( define ) {
		
		var default_value
		default_value = define.with.value || ""

		return {
			body           : {
				node : define.body.body,
				map  : this.library.body.define_body_map()
			},
			value          : default_value,
			original_value : default_value,
			valid          : ( !define.with.verify ),
			verify         : define.with.verify  || false,
			suggest        : define.with.suggest || false
		}
	},

	define_body : function ( define ) {
		return this.library.body.define_body( define )
	},

	define_listener : function ( define ) { 
		return this.library.listener.define_listener( define )
	},

	define_event : function ( define ) { 
		return this.library.event.define_event( define )
	}
})