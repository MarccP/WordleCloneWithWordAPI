document.addEventListener("DOMContentLoaded", () => {
    createSquares();
    getNewWord();
   


    let guessedWords = [[]];
    let availableSpace = 1;

    let word;
    let guessedWordCount = 0;

    const keys = document.querySelectorAll(".keyboard-row button");

    

    function getNewWord() {
        fetch(
            `https://wordsapiv1.p.rapidapi.com/words/?random=true&lettersMin=5&lettersMax=5&partOfSpeech=noun`,
            {
                method: 'GET',
	            headers: {
		            'X-RapidAPI-Host': 'wordsapiv1.p.rapidapi.com',
		            'X-RapidAPI-Key': '2046d759a8msh0a284b87bec2c40p15a9f1jsn2d4aba4f6d4d'
	            },

            }
        )
        .then((response) => {
            return response.json();
        })
        .then((res) => {
            word = res.word;
        })
        .catch((err) => {
            console.error(err);
        });    
    }

    

   
   console.log(word)

    function getCurrentWordArr(){
        const numberOfGuessedWords = guessedWords.length
        return guessedWords[numberOfGuessedWords - 1]
    }

    function updateGuessedWords(letter){
        const currentWordArr = getCurrentWordArr()

        if(currentWordArr && currentWordArr.length < 5){
            currentWordArr.push(letter)

            const availableSpaceEl = document.getElementById(String(availableSpace))
            
            availableSpace = availableSpace + 1;
            availableSpaceEl.textContent = letter;
        }
    }

    

    function getTileColor(letter, index) {
        const isCorrectLetter = word.includes(letter)

        if(!isCorrectLetter){
            return "rgb(58, 58, 60)";
        }

        const letterInThatPosition = word.charAt(index)
        const isCorrectPosition = letter === letterInThatPosition

        if(isCorrectPosition){
            return "rgb(83, 141, 78)";
        }

        return "rgb(181, 159, 59)";
    }

    function handleSubmitWord(){
        const currentWordArr = getCurrentWordArr();
        if(currentWordArr.length !== 5){
            window.alert("Word must be 5 letters");
        }

        const currentWord = currentWordArr.join("");

        fetch(
            `https://wordsapiv1.p.rapidapi.com/words/${currentWord}`,
            {
                method: "GET",
                headers: {
		            'X-RapidAPI-Host': 'wordsapiv1.p.rapidapi.com',
		            'X-RapidAPI-Key': '2046d759a8msh0a284b87bec2c40p15a9f1jsn2d4aba4f6d4d'
	            },
            }
        ).then((res) =>{
            if(!res.ok){
                throw Error()
            }
            
            const firstLetterId = guessedWordCount * 5 + 1;
            const interval = 200;
            currentWordArr.forEach((letter, index) => {
            setTimeout(() => {
                const tileColor = getTileColor(letter, index);

                const letterId = firstLetterId + index;
                const letterEl = document.getElementById(letterId)
                letterEl.classList.add("animate__flipInX");
                letterEl.style = `background-color:${tileColor};border-color${tileColor}`

                const keyboardEl = document.querySelector(`[data-key=${letter}]`);
                keyboardEl.classList.add("anime__flipInX");
                keyboardEl.style = `background-color:${tileColor};border-color${tileColor}`

            }, interval * index)
        })

        guessedWordCount += 1;

        if(currentWord === word){
            setTimeout(() =>  {
                const okSelected = window.confirm("Well done!");
                if(okSelected){
                    showResult();
                    clearBoard();
                    

                }
                return;
                

            }, 1200);
        
        }
        
        if(guessedWords.length === 6){
            setTimeout(() =>  {
                const okSelected = window.confirm(`Sorry, you have no more guesses left. The Word is : "${word}`);
                if(okSelected){
                    showLosingResult();
                    clearBoard();
                    

                }
                return;
                

            }, 1200);
        }
        guessedWords.push([])

        }).catch(() =>{
            window.alert("Word is not recognised!")
        })

       


        

    }

 

    function createSquares(){
        const gameBoard = document.getElementById("board")

        for(let index = 0; index < 30; index++){
            let square = document.createElement("div")
            square.classList.add("square");
            square.classList.add("animate__animated");
            square.setAttribute("id", index + 1);
            gameBoard.appendChild(square)
        }
    }

    function handleDeleteLetter() {
        const currentWordArr = getCurrentWordArr()
        const removedLetter = currentWordArr.pop()

        guessedWords[guessedWords.length - 1] = currentWordArr

        const lastLetterEl = document.getElementById(String(availableSpace - 1))

        lastLetterEl.textContent = ''
        availableSpace = availableSpace - 1;
    }

    function showResult() {
        const finalResultEl = document.getElementById("final-score");
        finalResultEl.textContent = "WORDLE - You win! Try again?";

        
    
    
        const totalWins = window.localStorage.getItem("totalWins") || 0;
        window.localStorage.setItem("totalWins", Number(totalWins) + 1);
        document.getElementById("show-score").textContent = "Current Wins: "+totalWins;
    
        const currentStreak = window.localStorage.getItem("currentStreak") || 0;
        window.localStorage.setItem("currentStreak", Number(currentStreak) + 1);
        document.getElementById("show-streak").textContent = "Current Winning Streak: "+currentStreak;
    
        const currentDay = window.localStorage.getItem("currentDay") || 0;
        window.localStorage.setItem("currentDay", Number(currentDay) +1);
      }

      function showLosingResult() {
        const finalResultEl = document.getElementById("final-score");
        finalResultEl.textContent = `WORDLE - Better Luck Next Time! Try Again?`;

        const totalWins = window.localStorage.getItem("totalWins") || 0;
        window.localStorage.setItem("totalWins", Number(totalWins) + 1);
        document.getElementById("show-score").textContent = "Current Wins: "+totalWins;
        
        const currentStreak = window.localStorage.getItem("currentStreak") || 0;
        window.localStorage.setItem("currentStreak", 0);
        document.getElementById("show-streak").textContent = "Current Winning Streak: "+currentStreak;
    
        
      }

      function clearBoard() {
        for (let i = 0; i < 30; i++) {
          let square = document.getElementById(i + 1);
          square.textContent = "";
        }
    
        const keys = document.getElementsByClassName("keyboard-button");
    
        for (var key of keys) {
          key.disabled = true;
        }
      }

    

    function updateStatsModal() {
        const currentStreak = window.localStorage.getItem("currentStreak");
        const totalWins = window.localStorage.getItem("totalWins");
        const totalGames = window.localStorage.getItem("totalGames");
    
        document.getElementById("total-played").textContent = totalGames;
        document.getElementById("total-wins").textContent = totalWins;
        document.getElementById("current-streak").textContent = currentStreak;
    
        const winPct = Math.round((totalWins / totalGames) * 100) || 0;
        document.getElementById("win-pct").textContent = winPct;
      }

    function initStatsModal() {
        const modal = document.getElementById("stats-modal");
    
        // Get the button that opens the modal
        const btn = document.getElementById("stats");
    
        // Get the <span> element that closes the modal
        const span = document.getElementById("close-stats");
    
        // When the user clicks on the button, open the modal
        btn.addEventListener("click", function () {
          updateStatsModal();
          modal.style.display = "block";
        });
    
        // When the user clicks on <span> (x), close the modal
        span.addEventListener("click", function () {
          modal.style.display = "none";
        });
    
        // When the user clicks anywhere outside of the modal, close it
        window.addEventListener("click", function (event) {
          if (event.target == modal) {
            modal.style.display = "none";
          }
        });
      }

    for(let i=0; i< keys.length; i++){
        keys[i].onclick = ({target}) => {
            const letter = target.getAttribute("data-key");

            if(letter === 'enter'){
                handleSubmitWord()
                return;
            }

            if(letter === 'del'){
                handleDeleteLetter()
                return;
            }

            updateGuessedWords(letter);
        };
    }

    


});

