
var guard = state.getEntity('guard');
var door = state.getEntity('door.out');
var exit = state.getEntity('exit.top');

exit.on('contact.start', function(){
	state.changeLevel('tech_demo_b');
});

guard.on('interact', function(entity){
	state.startCutscene({dialog: 'needIdent'});
});

console.log('Test:', state.get('ganymede'))

if (state.get('ganymede.enter')){
	door.trigger('interact');
}