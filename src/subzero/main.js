define([
        'sge',
        './config',
        './subzerostate',
        './paused',
        './load',
        './mainmenu',
        './cutscene',
        './states',
        './inventory',
        './factory',
        './dialog'
    ], function(sge, config, SubzeroState, PausedState, LoadState, MenuState, CutsceneState, states, inventory, Factory, Dialog){
       
        var createGame = function(options){

            var loader = new sge.Loader();
            var promises = [];
            promises.push(loader.loadFont('content/font/standard_white.fnt'));
            sge.When.all(promises).then(function(){

                game = new sge.Game();
                game.loader = loader;
                game.setStateClass('load', LoadState);
                game.createState('load');
                game.start(options);
                game.changeState('load');

                loader.loadJSON('content/manifest.json').then(function(manifest){
                    console.log('Loaded Manifest')
                    var promises = [];
                    if (manifest.sprites){
                        manifest.sprites.forEach(function(data){
                            promises.push(loader.loadSpriteFrames('content/sprites/' + data[0] +'.png',data[0], data[1][0],data[1][1]));
                        })
                    }
                    if (manifest.fonts){
                        manifest.fonts.forEach(function(data){
                            promises.push(loader.loadFont('content/font/' + data + '.fnt'));
                        })
                    }
                    if (manifest.images){
                        manifest.images.forEach(function(data){
                            promises.push(loader.loadTexture('content/' + data + '.png', data));
                        })
                    }
                    if (manifest.entities){
                        manifest.entities.forEach(function(data){
                            promises.push(loader.loadJSON('content/entities/' + data +'.json').then(Factory.load.bind(Factory)));
                        })
                    }
                    if (manifest.dialog){
                        manifest.dialog.forEach(function(data){
                            promises.push(loader.loadJSON('content/dialog/' + data +'.json').then(Dialog.load.bind(Dialog)));
                        }.bind(this))
                    }
                    if (manifest.audio){
                        createjs.Sound.removeAllSounds()
                        manifest.audio.forEach(function(data){
                            promises.push(loader.loadAudio('content/audio/' + data +'.wav', data));
                        })
                    }

                    sge.When.all(promises).then(function(){
                        console.log('Loaded Assets');
                        game.setStateClass('paused', PausedState);
                        game.createState('paused');
                        
                        game.setStateClass('menu', MenuState);
                        game.createState('menu');

                        game.setStateClass('win', states.WinState);
                        game.createState('win');
                        
                        game.setStateClass('lose', states.LoseState);
                        game.createState('lose');
                        
                        game.setStateClass('cutscene', CutsceneState);
                        game.createState('cutscene');

                        game.setStateClass('inventory', inventory.InventoryState);
                        game.createState('inventory');

                        game.setStateClass('swap', inventory.InventorySwapState);
                        game.createState('swap');

                        game.setStateClass('game', SubzeroState);
                        game.getState('load').ready('menu');
                    }.bind(this));
                });
            })
            
        }

        return {
            createGame : createGame
        }
    }
)