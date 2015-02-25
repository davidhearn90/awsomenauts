game.PlayerEntity = me.Entity.extend({
    //our player entity is going to have a height and width of 64
   init: function(x, y, settings) {
       this.setSuper();
       this.setPlayerTimers();
       this.setAttributes();
       this.type = "PlayerEntity";
       this.setFlags();

    //get the camera to follow the player for more than one screen
   me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);

   this.addAnimation();
   //If the player stops running, he will stop at the idle image of the player
   this.renderable.setCurrentAnimation("idle");
   
   
   
   },

   setSuper: function(){
    this._super(me.Entity, 'init', [x, y, {
               image: "player", 
               width: 64,
               height: 64,
               spritewidth: "64",
               spriteheight: "64",
               getShape: function() {
                   return(new me.Rect(0, 0, 64, 64)).toPolygon();
               }
       }]);

   },

 setPlayerTimers: function(){
      this.now = new Date().getTime();
      this.lastHit = this.now;
      this.lastAttack = new Date().getTime();

 },

 setAttributes: function(){
   this.health = game.data.playerHealth;
   //you can change height of how high you want to jump
   this.body.setVelocity(game.data.playerMoveSpeed, 21);
   this.attack = game.data.playerAttack;
 
 },

 setFlags: function(){
   this.facing = "right";
   this.dead = false;
  
 },

 addAnimation: function(){
  
   //make the characcter walk normally
   this.renderable.addAnimation("idle", [78]);
   this.renderable.addAnimation("walk", [117, 118, 119, 120, 121, 122, 123, 124, 125], 80);
   this.renderable.addAnimation("attack",[65, 66, 67, 68, 69, 70, 71, 72], 80);
 },

   
   update: function(delta){
       this.now = new Date().getTime();
       
       if(this.health <= 0){
           this.dead = true;
         
       }
       
       if(me.input.isKeyPressed("right")) {
           //adds to the position of my x by the velocity defined above in
           //setVelocity() and multiplying it by me.timer.tick.
           //me.timer.tick makes the movement look smooth
           //flip the sprite on the horzontal axis
           this.renderable.flipX(true);
           this.body.vel.x += this.body.accel.x * me.timer.tick;
           this.facing = "right";
           
       }
       else if (me.input.isKeyPressed("left")) {
           //now we unflip the sprite
           this.renderable.flipX(false);
           //make an if else statement of what happens when ever you press left
           this.body.vel.x -= this.body.accel.x * me.timer.tick;
           this.facing = "left";
       }
       //make the velocity for the x-axis be 0, otherwise the characher will move on its own
        else {
           this.body.vel.x = 0;
       }
         
       if(me.input.isKeyPressed("attack")) {
           if(!this.renderable.isCurrentAnimation("attack")) {
               //sets the current animation to attack and once that is over
               //goes back to the idle animation
               this.renderable.setCurrentAnimation("attack", "idle");
               //Makes it so that the nest time we start this sequence we begin
               //from the first animation, not wherever we left off when we switched
               //to another animation
               me.audio.play("slash");
               this.renderable.setAnimationFrame();
           }
       }
       
       //make the character stand normally facing us and set that as current animation
       else if(this.body.vel.x !==0 && !this.renderable.isCurrentAnimation("attack")) {
           //when you attack, don't stay in that animation
       if(!this.renderable.isCurrentAnimation("walk")) {
           this.renderable.setCurrentAnimation("walk");
       }
       }else if(!this.renderable.isCurrentAnimation("attack")){
           //don't forget to leave your currnet animation idle
           this.renderable.setCurrentAnimation("idle");
       }   
       
     
       
       //make an if statement and input the player whenever he can jump
       //I can also add funny audio
       if(me.input.isKeyPressed("jump")) {
           //maek the player fall whenever he jumps into the air
           if(!this.body.jumping && !this.body.falling) {
               //gravity will cause the player to fall
               this.body.vel.y = -this.body.maxVel.y * me.timer.tick;
               this.body.jumping = true;
               me.audio.play("21");
           }
       }
       //This can pause the game, but hard to resume
if (me.input.isKeyPressed("pause")) {
    me.state.pause();
this.body.pausing = true;
    var resume_loop = setInterval(function check_resume() {
        if (me.input.isKeyPressed("pause")) {
            clearInterval(resume_loop);
            me.state.resume();
        }
    }, 100);
}
       me.collision.check(this, true, this.collideHandler.bind(this), true);
       this.body.update(delta);
       this._super(me.Entity, "update", [delta]);
       return true;
   },
   
   loseHealth: function(damage){
     this.health = this.health - damage; 
   },

   collideHandler: function(response){
       //This makes the tower solid and also on the top
       if(response.b.type === "EnemyBaseEntity"){
           var ydif = this.pos.y - response.b.pos.y;
           var xdif = this.pos.x - response.b.pos.x;
           
           console.log("xdif" + xdif + " ydif " +ydif);
           
            if(ydif<-40 && xdif< 70 && xdif>-35){
               this.body.falling = false;
               this.body.vel.y = -1;
           }
           
           else if(xdif>-35 && this.facing === "right" && (xdif<0)){
               this.body.vel.x = 0;
               //this.pos.x = this.pos.x -1;
           } else if(xdif<70 && this.facing === "left" && (xdif>0)){
               this.body.vel.x = 0;
               //this.pos.x = this.pos.x +1;
           }
        
           if(this.renderable.isCurrentAnimation("attack") && this.now-this.lastHit >= game.data.playerAttackTimer){
               this.lastHit = this.now;
               response.b.loseHealth(game.data.playerAttack);
           }
       }else if(response.b.type === "EnemyCreep"){
           var xdif = this.pos.x - response.b.pos.x; 
           var ydif = this.pos.y - response.b.pos.y;
           
           if(xdif>0){
               //this.pos.x = this.pos.x + 1;
               if(this.facing === "left"){
                   this.body.vel.x = 0;
               }
           }else{
               //this.pos.x = this.pos.x - 1;
               if(this.facing === "right"){
                   this.body.vel.x = 0;
               }
           }

           if(this.renderable.isCurrentAnimation("attack") && this.now-this.lastHit >= game.data.playerAttackTimer
                  && (Math.abs(ydif) <= 40) && 
                  (((xdif>0) && this.facing === "left") || ((xdif<0) && this.facing === "right")) 
                  ){
               this.lastHit = this.now;
              if (response.b.health <= game.data.playerAttack) {
                  game.data.gold += 1;
                  console.log("Current gold" + game.data.gold);
                }
               response.b.loseHealth(game.data.playerAttack);
               
           }
       }
   }
});




