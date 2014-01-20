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
    ], function(sge, config, SubzeroState, PausedState, LoadState, MenuState, CutsceneState, states, inventory){
        
        var createGame = function(options){

            var loader = new sge.Loader();
            var promises = [];
            promises.push(loader.loadFont('content/font/standard_white.fnt'))
            promises.push(loader.loadTexture('content/backgrounds/space_a.png', 'backgrounds/space_a'))
            promises.push(loader.loadTexture('content/backgrounds/space_b.png', 'backgrounds/space_b'))
            promises.push(loader.loadTexture('content/backgrounds/space_c.png', 'backgrounds/space_c'))
            promises.push(loader.loadTexture('content/backgrounds/space_d.png', 'backgrounds/space_d'))
            promises.push(loader.loadTexture('content/backgrounds/space_e.png', 'backgrounds/space_e'))
            sge.When.all(promises).then(function(){

                game = new sge.Game();
                game.loader = loader;
                game.setStateClass('paused', PausedState);
                game.createState('paused');
                
                game.setStateClass('menu', MenuState);
                game.createState('menu');

                game.setStateClass('load', MenuState);
                game.createState('load');
                
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
                game.start(options);
                game.changeState('menu')
                window.onblur = function(){
                    game.changeState('paused')
                }

            })
            
        }

        return {
            createGame : createGame
        }
    }
)