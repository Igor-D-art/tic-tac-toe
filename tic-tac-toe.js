const view = (function(){

    const displayMove = (cell, marker)=> {
        let location = document.getElementById(cell);
        location.innerText = marker;
    };

    const displayMessage = (msg)=>{
        let msgBoard = document.querySelector('.message');
        msgBoard.innerText = msg;
    };

    return{displayMove, displayMessage}
})();


const model = (function(){
    
    let gameOver = false;

    const boardSize = 9;

    const combos = [{locations: [0, 1, 2], hits: ['', '', '']},
                    {locations: [3, 4, 5], hits: ['', '', '']},
                    {locations: [6, 7, 8], hits: ['', '', '']},
                    {locations: [0, 3, 6], hits: ['', '', '']},
                    {locations: [1, 4, 7], hits: ['', '', '']},
                    {locations: [2, 5, 8], hits: ['', '', '']},
                    {locations: [0, 4, 8], hits: ['', '', '']},
                    {locations: [2, 4, 6], hits: ['', '', '']}];

    let markIdent = 2; // needed to make sure that the playerX gets the marker X and the playerO gets the marker O
    // please look in the Player factory function

    let turn = 2;

    const Player = function(){
        let marker;
        if (markIdent % 2 == 0){
            marker = "X";
            markIdent += 1;
        } else {
            marker = "O"
            markIdent += 1;
        };

        const makeMove = function(cell){

            for(let i=0; i<combos.length; i++){
                let combo = combos[i];
                let hits = combo.hits;
                let locations = combo.locations;
                let index = locations.indexOf(cell);

                if(index >= 0){
                    hits[index] = this.marker;
                    view.displayMove(cell, this.marker);
                    if (checkStatus(hits)){
                        view.displayMessage (`Player ${this.marker} wins! Please restart the game!`);
                        model.gameOver=true;
                    };
                };
            };
           
        };
        return {marker, makeMove};
    };

    const checkStatus = function(hits){
      if (hits[0] === hits[1] && hits[1] === hits [2]) {
          return true;
      };
      return false;
    };

    const playerX = Player();
    const playerO = Player();

    return {playerX, playerO, gameOver, boardSize, combos}

})();


const controller = (()=>{
    let turn = 2;

    const selectCell = function(tdID){    
        if (!model.gameOver){ 
            if (turn % 2 === 0){
                view.displayMessage("Player O's turn!")
                model.playerX.makeMove(tdID);
                turn += 1;
                
            } else {
                view.displayMessage("Player X's turn!")
                model.playerO.makeMove(tdID);
                turn +=1;
            };
        } else {
            return false;
        }

    };

   const restart = function(){
        // alert('fucking restart');
        for(let i=0; i<model.boardSize; i++){
            let cell = document.getElementById(i);
            cell.innerHTML="";
        };
        for(let i=0; i<model.combos.length; i++){
            let combo = model.combos[i];
            let hits = combo.hits;
            for(let j=0; j<hits.length; j++){
                hits[j]='';
            };
        };

        model.gameOver = false;
   };


 return {selectCell, restart}
})();


function init (){
    const cells = document.querySelectorAll('td');
    cells.forEach((cell)=>{
                cell.addEventListener('click', ()=>{
                    let cellId = parseInt(cell.id);
                    controller.selectCell(cellId);
                });
     });

    const restartHandler = document.querySelector('#restart');
    restartHandler.addEventListener('click', ()=>{
        if (model.gameOver){ 
        controller.restart();
        };
    });
};

init();




