class Game{
    constructor(){

    }

    getState() {
        var gameStateRef = database.ref('gameState');
        gameStateRef.on("value", function (data) {
            gameState = data.val();
        });
    }

    update(state) {
        database.ref('/').update({
            gameState: state
        });
    }

    async start() {
        if (gameState === 0) {
            player = new Player();
            var playerCountRef = await database.ref('playerCount').once("value");
            if (playerCountRef.exists()) {
                playerCount = playerCountRef.val();
                player.getCount();
            }
            form = new Form()
            form.display();
        }
        player1 = createSprite(200,500);
        player1.addImage("player1",player_img);
        
        player2 = createSprite(800,500);
        player2.addImage("player2", player_img);
        players=[player1,player2];
    }
    
    play(){
        form.hide();
        Player.getPlayerInfo();
        image(back_img, 0, 0, 1000, 800);
        var x =100;
        var y=200;
        var index =0;
        drawSprites();

        var player1ScoreRef = database.ref('players/player1/score');
        player1ScoreRef.on("value", (data) => {
            player1Score = data.val();
        });
        var player2ScoreRef = database.ref('players/player2/score');
        player2ScoreRef.on("value", (data) => {
            player2Score = data.val();
        });

        for(var plr in allPlayers){
            index = index+1;
            x = 500-allPlayers[plr].distance;
            y=500;
            
            players[index -1].x = x;
            players[index - 1].y = y;
            
            if(index === player.index){
                fill("black");
                textSize(25);
                text(allPlayers[plr].name ,x-25,y+25);
            }

            push();
            fill("white");
            text("PLAYER 1: "+player1Score, 100,100);
            text("PLAYER 2: "+player2Score, 100,150);
            pop();
        }   

        if (keyIsDown(RIGHT_ARROW) && player.index !== null) {
            player.distance -= 10
            if(player.index !== null){
                if(player.index==1){
                    player.update(player1Score);
                }else if(player.index==2){
                    player.update(player2Score);
                }
            }
        }
        
        if (keyIsDown(LEFT_ARROW) && player.index !== null) {
            player.distance += 10;
            if(player.index !== null){
                if(player.index==1){
                    player.update(player1Score);
                }else if(player.index==2){
                    player.update(player2Score);
                }
            }
        }

        if (frameCount % 20 === 0) {
            fruits = createSprite(random(100, 1000), 0, 100, 100);
            fruits.velocityY = 6;
            numberOfFruits += 1;
            var rand = Math.round(random(1,5));
            switch(rand){
                case 1: fruits.addImage("fruit1",fruit1_img);
                break;
                case 2: fruits.addImage("fruit1", fruit2_img);
                break;
                case 3: fruits.addImage("fruit1", fruit3_img);
                break;
                case 4: fruits.addImage("fruit1", fruit4_img);
                break;
                case 5: fruits.addImage("fruit1", fruit5_img);
                break;
            }
            fruits.lifetime = 110;
            fruitGroup.add(fruits);
            
        }
        
        console.log(player.index);
        if (player.index !== null) {
            for(var i=0;i<numberOfFruits;i++){
                if(fruitGroup[i]!==undefined){
                    if(player.index==1){
                        if(fruitGroup[i].collide(player1)){
                            fruitGroup[i].remove();
                            player1Score += 1;
                            database.ref('/players/player1').update({
                                score: player1Score
                            });
                        }else if(fruitGroup[i].collide(player2)){
                            fruitGroup[i].remove();
                            /*player2Score += 1;
                            database.ref('/players/player2').update({
                                score: player2Score
                            });*/
                        }
                    }
                    if(player.index == 2){
                        if(fruitGroup[i].collide(player1)){
                            fruitGroup[i].remove();
                            /*player1Score += 1;
                            database.ref('/players/player1').update({
                                score: player1Score
                            });*/
                        }else if(fruitGroup[i].collide(player2)){
                            fruitGroup[i].remove();
                            player2Score += 1;
                            database.ref('/players/player2').update({
                                score: player2Score
                            });
                        }
                    }
                }
            }
        }    
    }

    end(){
       console.log("Game Ended");
    }
}