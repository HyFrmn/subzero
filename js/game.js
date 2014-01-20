require.config({
	baseUrl: 'src',
	packages: ['sge', 'subzero'],

})
define([
		'sge','subzero'
	], function(sge, subzero){
		function getURLParameter(name) {
            return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
        }

		var options = {
            debug: {
                drawSocial: getURLParameter('debug-social') || false,
                map: getURLParameter('debug-map') || 'tech_demo_a',
            },
            persist: {
                
            },
            map: getURLParameter('debug-map') || 'tech_demo_a',
        }

		subzero.createGame(options);
	}
)