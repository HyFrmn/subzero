define([
		'./class',
		'./when'
	], function(Class, when){
		var ajax = function(url, callback){
			var xmlHttp = new XMLHttpRequest();
			xmlHttp.open('get', url, true);
			xmlHttp.send(null);
			xmlHttp.onreadystatechange = function() {
				if (xmlHttp.readyState === 4) {
			  	    if (xmlHttp.status === 200) {
				        callback(xmlHttp.responseText, xmlHttp);
				    } else {
				        console.error('Error: ' + xmlHttp.responseText);
				    }
				} else {
				  //still loading
				}
			}
		}

		var Loader = Class.extend({
			init: function(){},
			loadJSON: function(url){
				var defered = new when.defer();
				ajax(url, function(text){
					var data = JSON.parse(text);
					defered.resolve(data);
				});
				return defered.promise;
			},
			loadFont: function(url){
				var defered = new when.defer();
				var loader = new PIXI.AssetLoader([url]);
				loader.onComplete = function(){
					defered.resolve();
				}
				loader.load();
				return defered.promise;
			},
			loadTexture: function(url){
				var defered = new when.defer();
				var tex = new PIXI.ImageLoader(url);
				tex.addEventListener("loaded", function(event){
					console.log('Loading', tex)
					defered.resolve(tex);
				});
				tex.load();
				return defered.promise;
			},
			loadSpriteFrames: function(url, textureName, width, height){
				var defered = new when.defer();
				var tex = new PIXI.ImageLoader(url);
				tex.addEventListener("loaded", function(event){
					var xcount = Math.floor(tex.texture.width/width);
					var ycount = Math.floor(tex.texture.height/height);
					var frame = 0;
					var texture;
					for (var y=0;y<ycount;y++){
						for(var x=0;x<xcount;x++){
							texture = new PIXI.Texture(tex.texture, {x: x*width, y: y*height, width: width, height: height});
							PIXI.TextureCache[textureName+'-'+frame] = texture;
							frame++;
							
						}
					}
					defered.resolve(tex);
				});
				tex.load();
				return defered.promise;
			}
		})

		return Loader
	}
)