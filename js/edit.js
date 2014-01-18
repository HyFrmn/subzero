require.config({
	baseUrl: 'src',
	packages: ['sge', 'editor'],

})
define(['sge','editor'], 
	function(sge, editor){
	
		console.log('Editor', sge, editor);
		var a = new editor.Node();
		var b = new editor.Node();
		b._group.x(640).y(120);
	}
)