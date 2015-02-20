game.PlayerEntity = me.Entity.extend({
    //our player entity is going to have a height and width of 64
   init: function(x, y, settings) {
       //call the constructor
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
   this.type = "PlayerEntity";
   this.health = game.data.playerHealth;
   //you can change height of how high you want to jump
   this.body.setVelocity(game.data.playerMoveSpeed, 21);
   this.facing = "right";
   this.now = new Date().getTime();
   this.lastHit = this.now;
   this.dead = false;
   this.lastAttack = new Date().getTime();
   //make the characcter walk normally
   this.renderable.addAnimation("idle", [78]);
   this.renderable.addAnimation("walk", [117, 118, 119, 120, 121, 122, 123, 124, 125], 80);
   this.renderable.addAnimation("attack",[65, 66, 67, 68, 69, 70, 71, 72], 80);
   //If the player stops running, he will stop at the idle image of the player
   this.renderable.setCurrentAnimation("idle");
   
   //get the camera to follow the player for more than one screen
   me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
   
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
               console.log(!this.renderable.isCurrentAnimation("attack"));
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
     console.log(this.health);
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
               console.log("tower Hit");
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
               response.b.loseHealth(game.data.playerAttack);
               
           }
       }
   }
});

game.PlayerBaseEntity = me.Entity.extend({
    init: function (x, y, settings) {
        this._super(me.Entity, 'init', [x, y, {
                image: "tower",
                width: 100,
                height: 100,
                spritewidth: "100",
                spriteheight: "100",
                getShape: function() {
                    return (new me.Rect(0, 0, 100, 70)).toPolygon();
                }
        }]);
    this.broken = false;
    this.health = game.data.playerBaseHealth;
    this.alwaysUpdate = true;
    this.body.onCollision = this.onCollision.bind(this);
    this.type = "PlayerBase";
    
    this.renderable.addAnimation("idle", [0]);
    this.renderable.addAnimation("broken", [1]);
    this.renderable.setCurrentAnimation("idle");
        
    },
    
    update: function(delta) {
        if(this.health<=0){
            this.broken = true;
            this.renderable.setCurrentAnimation("broken");
        }
        this.body.update(delta);
        
        this._super(me.Entity, "update", [delta]);
        return true;
    },
    
    loseHealth: function(damage){
      this.health = this.health - damage;  
    },
    
    onCollision: function(){
        
    }
});

game.EnemyBaseEntity = me.Entity.extend({
    init: function (x, y, settings) {
        this._super(me.Entity, 'init', [x, y, {
                image: "tower",
                width: 100,
                height: 100,
                spritewidth: "100",
                spriteheight: "100",
                getShape: function() {
                    return (new me.Rect(0, 0, 100, 70)).toPolygon();
                }
        }]);
    this.broken = false;
    this.health = game.data.enemyBaseHealth;
    this.alwaysUpdate = true;
    this.body.onCollision = this.onCollision.bind(this);
    
    this.type = "EnemyBaseEntity";
    
    this.renderable.addAnimation("idle", [0]);
    this.renderable.addAnimation("broken", [1]);
    this.renderable.setCurrentAnimation("idle");
        
    },
    
    update: function(delta) {
        if(this.health<=0){
            this.broken = true;
            this.renderable.setCurrentAnimation("broken");
        }
        this.body.update(delta);
        
        this._super(me.Entity, "update", [delta]);
        return true;
    },
    
    onCollision: function(){
        
    },
    
    loseHealth: function() {
        this.health--;
    },
   collideHandler: function(response){
       
   }
}); 

game.LevelTrigger = me.Entity.extend({
    init: function(x, y, settings){
        this._super(me.Entity, "init", [x, y, settings]);
        this.body.onCollison = this.onCollision.bind(this);
      this.level = settings.Level;
    },
    onCollision: function(){
        this.body.setCollisionMask(me.collision.types.NO_OBJECT);
        me.levelDirector.loadLevel(this.level);
    }
});

game.EnemyCreep = me.Entity.extend({
    init: function(x, y, settings) {
        this._super(me.Entity, "init", [x, y, {
            image: "creep1",
                    width: 32,
                    height: 64,
                    spritewidth:  "32",
                    spriteheight: "64",
                    getShape: function(){
                        return (new me.Rect(0, 0, 32, 64)).toPolygon();
                    }
            
        }]);
    this.health = game.data.enemyCreepHealth;
    this.alwaysUpdate = true;
    //lets us know if the enemy is currently attacking
    this.attacking = false;
    //keeps track of when our creep last attacked
    this.lastAttacking = new Date().getTime();
    this.lastHit = new Date().getTime();
    //keep track of the last time our creep hit anything
    this.now = new Date().getTime();
    this.body.setVelocity(3, 20);
    
    this.type = "EnemyCreep";
    this.renderable.addAnimation("walk", [3, 4, 5], 80);
        this.renderable.setCurrentAnimation("walk");
    
    },
    
    loseHealth: function(damage){
        this.health = this.health - damage;
    },
    
    update: function (delta){
        console.log(this.health);
        if(this.health <= 0){
            me.game.world.removeChild(this);
        }
        
        this.now = new Date().getTime();
        
        this.body.vel.x -= this.body.accel.x * me.timer.tick;
        me.collision.check(this, true, this.collideHandler.bind(this), true);
        this.body.update(delta);
        
        
        this._super(me.Entity,"update", [delta]);
        return true;
    }, 
    
    
    collideHandler: function(response){
        if(response.b.type === "PlayerBase"){
            this.attacking = true;
           // this.lastAttacking = this.now;
            this.body.vel.x = 0;
            //keeps moving the creep to the right to maintain its position
            this.pos.x = this.pos.x +1;
            //check that it has been at leats one second since this creep hit a base
            if((this.now-this.lastHit >= 1000)){
                //updates the last hit timer
                this.lastHit = this.now;
                //makes the player base call its loseHealth fucntion and passes it a damage of one
                response.b.loseHealth(game.data.enemyCreepAttack);
            }
        }else if(response.b.type==="PlayerEntity"){
            var xdif = this.pos.x - response.b.pos.x;
            
            this.attacking = true;
           // this.lastAttacking = this.now;
           
            
            if(xdif>0){
                //keeps moving the creep to the right to maintain its position
            this.pos.x = this.pos.x + 1;
             this.body.vel.x = 0;
        }
            //check that it has been at leats one second since this creep hit something
            if((this.now-this.lastHit >= 1000) && xdif>0){
                //updates the last hit timer
                this.lastHit = this.now;
                //makes the player call its loseHealth fucntion and passes it a damage of one
              response.b.loseHealth(game.data.enemyCreepAttack);
            }
        }
    }
    
});

game.GameManager = Object.extend({
    init: function(x, y, settings) {
        this.now = new Date().getTime();
        this.lastCreep = new Date().getTime();
        
        this.alwaysUpdate = true;
    },
    
    
    update: function(){
        this.now = new Date().getTime();

        if (game.data.player.dead) {
            me.game.world.removeChild(game.data.player);
          me.state.current().resetPlayer(10, 0);


        }
        
        if(Math.round(this.now/1000)%10 === 0 && (this.now - this.lastCreep >= 1000 )){
            this.lastCreep = this.now;
            var creepe = me.pool.pull("EnemyCreep", 1000, 0, {});
            me.game.world.addChild(creepe, 5);
        }
        return true;
    }
});
