var newEntity = state.factory.create('citizen', {
	sprite: {
		src: "man_d"
	},
	xform: {
		tx: 128,
		ty: 128
	}
});
newEntity.on('interact', function(){
	cutsceneState = state.game.getState('cutscene');
	cutsceneState.setDialog('This is a quick test of loading map events.');
	state.startCutscene();
})
state.addEntity(newEntity);
console.log(newEntity);