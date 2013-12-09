// Start the main app logic.

// Global Game Object
var SGEGame = null;

requirejs.config({  
    baseUrl: "src/",
    packages: ['sge','subzero'],
    shim: {
        'sge/vendor/caat' : {
            exports: 'CAAT'
        },
        'sge/vendor/underscore' : {
            exports: '_'
        }
    },
})
requirejs(['sge','subzero'],
    function   (sge, subzero) {

        function getURLParameter(name) {
            return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
        }

        //Setup Canvas Ratio
        var idealWidth = parseInt(getURLParameter('width') || 640);
        var idealHeight = parseInt(getURLParameter('height') || 360);
        var idealFPS = parseInt(getURLParameter('fps') || 60);
        canvasElem = document.getElementById('game');
        
        //Create a resize screen callback.
        var resizeCallback = function(){
            var innerWidth = window.innerWidth;
            var innerHeight = window.innerHeight;
            var pixelWidth, pixelHeight;
            if ((innerWidth / innerHeight) < 1.7777){
                pixelWidth = innerWidth;
                pixelHeight = Math.round(innerWidth / 1.77777);
            } else {
                pixelHeight = innerHeight;
                pixelWidth = Math.round(innerHeight * 1.7777);
            }
            canvasElem.style.width = pixelWidth + 'px';
            canvasElem.style.height = pixelHeight + 'px';
            canvasElem.style['margin-left'] = (innerWidth - pixelWidth)/2 + 'px';
            canvasElem.style['margin-top'] = (innerHeight - pixelHeight)/2 + 'px';
        }
        window.onresize = resizeCallback;
        resizeCallback();
        
        //Enable Caat Debug widget with url param.
        CAAT.DEBUG=Boolean(getURLParameter('caat-debug'));

        SGEGame = subzero.CreateGame(idealWidth, idealHeight, idealFPS);
        SGEGame.start();
});
