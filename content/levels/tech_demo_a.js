
var guard = state.getEntity('guard');
var door = state.getEntity('door.out');
var exit = state.getEntity('exit.top');

exit.on('contact.start', function(){
	state.changeLevel('tech_demo_b');
});

guard.on('interact', function(entity){
	/*
	var inv = entity.get('inventory.items');
	cutscene = state.game.getState('cutscene');
	if (inv.ident){
		cutscene.setDialog("Ok, you checkout. Welcome to Ganymede");
		door.trigger('interact');
		state.set('ganymede.enter', true);
	} else {
		cutscene.setDialog("Sorry you need an ident card to enter the station.");
	}
	*/
	state.startCutscene({
		dialog: "needIdent"
	});
});

console.log('Test:', state.get('ganymede'))

if (state.get('ganymede.enter')){
	door.trigger('interact');
}