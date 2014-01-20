var exit = state.getEntity('exit.bottom');

exit.on('contact.start', function(){
	console.log('Contact!')
	state.changeLevel('tech_demo_a', 'enter.top');
})