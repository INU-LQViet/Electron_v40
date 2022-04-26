function game(socket){
    const gap               = 85    ;
    const gravity           = 1.5   ;
    const framesPerSecond   = 40    ;
    var constant                    ;
    var bX                  = 10    ;
    var bY                  = 150   ;   
    var score               = 0     ;
    var cvs                 = document.getElementById('game');
    var ctx                 = cvs.getContext("2d");
    var bird                = new Image();
    var bg                  = new Image();
    var fg                  = new Image();
    var pipeNorth           = new Image();
    var pipeSouth           = new Image();
    var intervalID;
    // var fly         = new Audio();
    // var scor        = new Audio();

    bird.src        = "./img/bird.png";
    bg.src          = "./img/bg.png";
    fg.src          = "./img/fg.png";
    pipeNorth.src   = "./img/pipeNorth.png";
    pipeSouth.src   = "./img/pipeSouth.png";
    // fly.src         = "sounds/fly.mp3";
    // scor.src        = "sounds/score.mp3";
    var pipe_x = [cvs.width];
    var pipe_y = [0];  

    var starGame = document.getElementById('startGame');
   
    function fuzzy_control(){
        socket.on('signal',(data)=>{
            if(data.signal>=2.5){
                bY -= 0.02; 
            }else if(data.signal>=2){
                bY -= 0.01;
            }else if(data.signal>=1.7){
                bY -= 0.005;
            }else{
                bY -= 0;
            }
        });
        // console.log(bY)  ;
    }
        
    function boundary(input, min, max){
        if(input > max){
            input = max;
        }else if(input < min){
            input = min;
        };
        return input;
    };

    starGame.addEventListener('click',()=>{
        starGame.style.display = "none";  
        intervalID = setInterval(function (){
            fuzzy_control();
            render();
        },1000/framesPerSecond);
        console.log('load canvas!')
    });

    function render(){
        ctx.drawImage(bg,0,0);
        for(let i = 0; i < pipe_x.length; i++){
            constant = pipeNorth.height+gap;
            ctx.drawImage(pipeNorth,pipe_x[i],pipe_y[i]);
            ctx.drawImage(pipeSouth,pipe_x[i],pipe_y[i]+constant);  
            pipe_x[i]--;
            //125//
            if( pipe_x[i] == 50 ){
                pipe_x.push(cvs.width);
                pipe_y.push(Math.floor(Math.random()*pipeNorth.height)-pipeNorth.height); 
            };

            if( bX + bird.width >= pipe_x[i] && bX <= pipe_x[i] + pipeNorth.width && (bY <= pipe_y[i] + pipeNorth.height || bY+bird.height >= pipe_y[i]+constant) || bY + bird.height >=  cvs.height - fg.height){
                // starGame = false;
                while(pipe_x.length > 0){
                    pipe_x.pop();
                    pipe_y.pop();
                };
                // initial screen
                bY= 150;
                pipe_x = [cvs.width];
                pipe_y = [0];
                starGame.style.display='block';  
                score = 0;
                clearInterval(intervalID);
                intervalID = null;
            };
            
            if(pipe_x[i] == 5){
                score++;
                // score.play();
            };
        };
        ctx.drawImage(fg,0,cvs.height - fg.height);
        ctx.drawImage(bird,bX,boundary(bY,0,cvs.height));
        // ctx.drawImage(bird,bX,bY);
        bY += gravity;

        ctx.fillStyle = "#000";
        ctx.font = "20px Verdana";
        ctx.fillText("Score : "+score,10,cvs.height-20);
    }; 
}