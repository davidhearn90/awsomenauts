/* Game namespace */
var game = {

    // an object where to store game information
    data : {
        // score
        score : 0,
                option1: "",
                option2: "",
                enemyBaseHealth: 3,
                playerBaseHealth: 1,
                enemyCreepHealth: 3,
                playerHealth: 7,
                enemyCreepAttack: 1,
                playerAttack: 1,
//                orcBaseDamage: 10,
//                orcBaseHealth: 100,
//                orcBaseSpeed: 3,
//                orcBaseDefense: 0,
                playerAttackTimer: 1000,
                enemyCreepAttackTimer: 1000,
                playerMoveSpeed: 5,
                creepMoveSpeed: 5,
                gameTimerManager: "",
                heroDeathManager:"",
                spearTimer: 15,
                player: "",
                exp: 0,
                gold: 0,
                ability1: 0,
                ability2: 0,
                ability3: 0,
                skill1: 0,
                skill2: 0,
                skill3: 0,
                exp1: 0,
                exp2: 0,
                exp3: 0,
                exp4: 0,
                exp5: 0,
                exp6: 0,
                win: "",
                pausePos: "",
                buyscreen: "",
                buytext: ""
                
    },
    
    // Run on page load.
    "onload" : function () {
    // Initialize the video.
    if (!me.video.init("screen",  me.video.CANVAS, 1067, 600, true, 'auto')) {
        alert("Your browser does not support HTML5 canvas.");
        return;
    }

    // add "#debug" to the URL to enable the debug Panel
    if (document.location.hash === "#debug") {
        window.onReady(function () {
            me.plugin.register.defer(this, debugPanel, "debug");
        });
    }
        
        
        me.state.SPENDEXP = 112;
        me.state.LOAD = 113;
        me.state.NEW = 114;
        
        console.log(game.data.exp);
        console.log(game.data.exp2);
        
        
    // Initialize the audio.
    me.audio.init("mp3,ogg");

    // Set a callback to run when loading is complete.
    me.loader.onload = this.loaded.bind(this);

    // Load the resources.
    me.loader.preload(game.resources);

    // Initialize melonJS and display a loading screen.
    me.state.change(me.state.LOADING);
},


    // Run on game resources loaded.
    "loaded" : function () {
            //make a pool register that adds the player in the game
            //We set to ture if there is more than one of them
            me.pool.register("player", game.PlayerEntity, true);
            me.pool.register("PlayerBase", game.PlayerBaseEntity);
            me.pool.register("EnemyBase", game.EnemyBaseEntity);
            me.pool.register("EnemyCreep", game.EnemyCreep, true);
            me.pool.register("GameManager", game.GameManager);
            me.pool.register("levelTrigger", game.LevelTrigger);
            me.pool.register("GameTimerManager", game.GameTimerManager);
            me.pool.register("HeroDeathManager", game.HeroDeathManager);
            me.pool.register("ExperienceManager", game.ExperienceManager);
            me.pool.register("SpendGold", game.SpendGold);
            
        me.state.set(me.state.MENU, new game.TitleScreen());
        me.state.set(me.state.PLAY, new game.PlayScreen());
                me.state.set(me.state.SPENDEXP, new game.SpendExp());
                 me.state.set(me.state.LOAD, new game.LoadProfile());
                 me.state.set(me.state.NEW, new game.NewProfile());

        // Start the game from the title screen
        me.state.change(me.state.MENU);
    }
};
