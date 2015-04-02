game.NewProfile = me.ScreenObject.extend({
	/**	
	 *  action to perform on state change
	 */
	onResetEvent: function() {	
		me.game.world.addChild(new me.Sprite(0, 0, me.loader.getImage("new-screen")),-10); // TODO
        document.getElementById("input").style.visibility ="visible";
        document.getElementById("register").style.visibility ="visible";
                
                me.input.unbindKey(me.input.KEY.B);
                me.input.unbindKey(me.input.KEY.Q);
                me.input.unbindKey(me.input.KEY.E);
                me.input.unbindKey(me.input.KEY.W);
                me.input.unbindKey(me.input.KEY.DOWN);
                
                me.game.world.addChild(new(me.Renderable.extend({
                    init: function(){
                        this._super(me.Renderable, "init",[10, 10, 300, 50]);
                        //This can make the text of the Exp screen either bigger or smaller
                        this.font = new me.Font("Arial", 26, "red");
                    //    me.input.registerPointerEvent('pointerdown', this, this.newGame.bind(this), true);
                    },
                    //If you click on start new game, your game will start from the start
                    draw: function(renderer){
                        this.font.draw(renderer.getContext(), "PICK A USERNAME AND PASSWORD", this.pos.x, this.pos.y);
                    }
                    
                    
                })));
               
	},
	
	
	/**	
	 *  action to perform when leaving this screen (state change)
	 */
	onDestroyEvent: function() {
        document.getElementById("input").style.visibility ="hidden";
        document.getElementById("register").style.visibility ="hidden";
	}
});