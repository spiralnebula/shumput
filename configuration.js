define({
	name    : "shumput",
	main    : "shumput",
	// start   : { 
	// 	with : {
	// 		test : {}
	// 	}
	// },
	module  : [
		"library/event_master",
		"library/morphism",
		"library/suggest",
		"library/event",
		"library/listener",
		"library/body",
		"library/bodymap",
	],
	package : [
		"library/morph",
		"library/transistor",
		"library/transit",
	]
})