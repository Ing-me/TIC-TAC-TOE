
let createPlayer = () => {
    
    document.querySelector('.board').style.pointerEvents = "auto";
    for (let i = 0; i < 4; i++) {
     if(gameBoardModule.playerArray.length >= 4){
      gameBoardModule.makePlayerMove();
      break;
     } 
     else if(gameBoardModule.playerArray.length == 0) { 
          let playerNumber = 1;
          let assignedXO = "X";
          
          gameBoardModule.playerArray.push(playerNumber, assignedXO);
          console.log("content playerarray: ", gameBoardModule.playerArray);
     }
     else if (gameBoardModule.playerArray !== 0) {
          let playerNumber = 2;
          let assignedXO = "O";
         
          gameBoardModule.playerArray.push(playerNumber, assignedXO)
          console.log("Content player array: ",gameBoardModule.playerArray );
     }
      
    }
    document.querySelector('.input-text').textContent = `You're ${gameBoardModule.playerArray[1]} and the computer is ${gameBoardModule.playerArray[3]}`

  };



//GameBoard module
let gameBoardModule = (function(){
    let gameBoard = [];
    let playerArray = [];

    //publicly function to invoke next player move
    let makePlayerMove = () => {
        if(playerArray.length == 4 && gameBoard.length < 9){
            if (gameBoard.length == 0) {                
                gameBoard.push(playerArray[1]);
                console.log("Current gameBoard array: ", gameBoard);
            } else if (gameBoard[gameBoard.length - 1] == "X") {                
                gameBoard.push(playerArray[3]);
                console.log("current gameBoard...", gameBoard)
            } else if (gameBoard[gameBoard.length - 1] == "O") {                
                gameBoard.push(playerArray[1]);
                console.log("Current gameBoard array: ", gameBoard);
            }
        };
    } 

    return { gameBoard, playerArray, makePlayerMove };
})();

// displayController module
let displayControllerModule = (function() {
    const winArray = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ]
    let origBoard = Array.from(Array(9).keys());
   
    const cells = document.querySelectorAll('.cell');

    for (let i = 0; i < cells.length; i++) {
        cells[i].innerText = '';
        cells[i].addEventListener('click', turnClick, false);        
    }


    function turnClick(square){       
        if (typeof origBoard[square.target.id] == 'number') {
            turn(square.target.id, gameBoardModule.playerArray[1]); 
            if(!checkTie()) turn(bestSpot(), gameBoardModule.playerArray[3])
        }
         
    }

    function turn(squareId, player){
        origBoard[squareId] = player;
        document.getElementById(squareId).innerText = player;
        gameBoardModule.gameBoard[gameBoardModule.gameBoard.length - 1];
        
        let winner = checkWin(origBoard, player);
        if (winner) gameOver(winner);
        
    }

    function checkWin(board,player){
        let plays = board.reduce((a, e, i) => (e === player) ? a.concat(i) : a, []);
        let gameWon = null;
        for(let [index, win] of winArray.entries()){
            if(win.every(elem => plays.indexOf(elem) > -1)){
                gameWon = { index: index, player:player };
                break;
            }
        }
        return gameWon;
    }

    function gameOver(over){
        for(let index of winArray[over.index]){
            const winnerMessage = document.querySelector('#winnerMessage');
                winnerMessage.classList.add("show");
                const winner = document.querySelector('#winner');
                winner.textContent = over.player === gameBoardModule.playerArray[1]  ?  gameBoardModule.playerArray[1] +" wins" : gameBoardModule.playerArray[3] +" wins";
        }
        for(let i = 0; i < cells.length; i++){
            cells[i].removeEventListener('click', turnClick, false);
        }
    }
    function  declareWinner(who){
        const winnerMessage = document.querySelector('#winnerMessage');
        winnerMessage.classList.add("show");
        const winner = document.querySelector('#winner');
        winner.textContent = who
    }

    function emptySquares(){
        return origBoard.filter(s => typeof s == 'number');
    }

    function bestSpot(){
        return minimax(origBoard, gameBoardModule.playerArray[3]).index;
    }

    function checkTie(){
        if(emptySquares().length == 0){
           
            for (let i = 0; i < cells.length; i++) {
                
               cells[i].removeEventListener('click', turnClick, false)                
            }
            declareWinner("Tie Game!");
            return true;
        }
        return false;
    }

    function minimax(newBoard, player){
        let availSpot = emptySquares(newBoard);
        if(checkWin(newBoard, player)){
            return {score: -10};
        }
        else if(checkWin(newBoard, gameBoardModule.playerArray[3])){
            return { score: 20};
        }
        else if(availSpot.length === 0){
            return {score: 0};
        }
        let moves = [];
        for (let i = 0; i < availSpot.length; i++) {
            let move = {};
            move.index = newBoard[availSpot[i]];
            newBoard[availSpot[i]] = player;

            if(player == gameBoardModule.playerArray[3]){
                let result = minimax(newBoard, gameBoardModule.playerArray[1]);
                move.score = result.score;
            }
            else{
                let result = minimax(newBoard, gameBoardModule.playerArray[3]);
                move.score = result.score;
            }

            newBoard[availSpot[i]] = move.index;
            moves.push(move);        
        }

        let bestMove = 0;

        if(player === gameBoardModule.playerArray[3]){
            let bestScore = -10000;
            for (let i = 0; i < moves.length; i++) {
                if(moves[i].score > bestScore){
                    bestScore = moves[i].score;
                    bestMove = i;
                }
                
            }
        }
        else{
            let bestScore = 10000;
            for (let i = 0; i < moves.length; i++) {
                if(moves[i].score < bestScore){
                    bestScore = moves[i].score;
                    bestMove = i;
                }
                
            }
        }
        return moves[bestMove];

    }




    const start = document.querySelector('#start');
    start.addEventListener('click', createPlayer);
    
    const restart = document.querySelector('#restart-button');
    restart.addEventListener('click', reload);
    
})();

function reload(){
    location.reload();
}





 












