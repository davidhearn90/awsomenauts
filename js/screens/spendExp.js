game.SpendExp = me.ScreenObject.extend({
  /** 
   *  action to perform on state change
   */
  onResetEvent: function() {  
    me.game.world.addChild(new me.Sprite(0, 0, me.loader.getImage("exp-screen")),-10); // TODO
              //  me.input.bindKey(me.input.KEY.ENTER,"start");
                me.game.world.addChild(new(me.Renderable.extend({
                    init: function(){
                        this._super(me.Renderable, "init",[270, 240, 300, 50]);
                        this.font = new me.Font("Arial", 46, "white");
                    },
                    //If you click on start new game, your game will start from the start
                    draw: function(renderer){
                        this.font.draw(renderer.getContext(), "SPEND", this.pos.x, this.pos.y);
//                        this.font.draw(renderer.getContext(), "Press ENTER to play!", 250, 530);
                    },
                    
                    update: function(dt){
                      return true;  
                    },
                    
                })));
                
  },
  
  
  /** 
   *  action to perform when leaving this screen (state change)
   */
  onDestroyEvent: function() {
//    me.input.unbindKey(me.input.KEY.ENTER); // TODO
//                me.event.unsubscribe(this.handler);
  }
});