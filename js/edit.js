require.config({
	baseUrl: 'src',
	packages: ['editor'],

})
define(['editor'], 
	function(editor){
		console.log('Editor', editor);
		var a = new editor.Node();
		var b = new editor.Node();
		b._group.x(640).y(120);
	}
)