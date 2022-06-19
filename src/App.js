import React, { useState, useEffect } from 'react';

function App() {

  const levels = {
    "Easy": 7,
    "Normal": 5,
    "Hard": 3
  }

  const [words, setWords] = useState([]);
  const [difficulity, setDifficulity] = useState("Easy");
  const [theWord, setTheWord] = useState("");
  const [winState, setWinState] = useState("")
  const [loseState, setLoseState] = useState("");

  let input = document.querySelector(".input");
  let timeLeftSpan = document.querySelector(".time span");
  let levelSpan = document.querySelector(".lvl");
  let scoreGot = document.querySelector(".score .got")
  let upcomingWords = document.querySelector(".upcoming-words")
  
  function Count() {
    let count = 15
    if (difficulity === "Easy")
      count = 15
    else if (difficulity === "Normal")
      count = 20
    else
      count = 30
    return count
  }
  let count = Count();

  function GenerateWord () {
    let randomWord = words[Math.floor(Math.random() * words.length)];
    setTheWord(randomWord);
    let wordIndex = words.indexOf(randomWord);
    words.splice(wordIndex, 1)
    upcomingWords.innerHTML = '';
    for (let i = 0; i < words.length; i++) {
      // Create Div Element
      let div = document.createElement("div");
      let text = document.createTextNode(words[i]);
      div.appendChild(text);
      upcomingWords.appendChild(div);
    }
    let levelTime = levels[difficulity]
    timeLeftSpan.innerHTML = levelTime;
    let start = setInterval(() => {
      timeLeftSpan.innerHTML = levelTime;
      levelTime--;
      if (levelTime === -1) {
        clearInterval(start)
        if (randomWord.toLowerCase() === input.value.toLowerCase()) {
            input.value = '';
            scoreGot.innerHTML++;
            if (words.length > 0)
              GenerateWord()
            else
              setWinState("You Won");
        } else {
          setLoseState("You Lost");
        }
      }
  }, 1000);
  }
    
 
  
  // let timeLeftSpan = document.querySelector(".time span")

  // let LevelTime = levels[difficulity];
  // timeLeftSpan.innerHTML = LevelTime;
  
  

  const startHandler = () => {
    document.querySelector(".start").remove()
    document.querySelector("select").remove()
    levelSpan.innerHTML = difficulity;
    input.focus();
    GenerateWord();
  }


  useEffect(() => {
    fetch("https://random-word-api.herokuapp.com/word?number="+Count())
    .then(response => response.json())
    .then(words =>{
      setWords(words);
    });
  },[difficulity]);
  
  return (
    <div className="root">
      <div className="game">
        <div className="name">Type Master</div>
        <div className="wrapper">
            <div className="container">
                <div className="message">
                    You Are Playing on
                    <span className="lvl">
                        <select id="select" value={difficulity} onChange={(event) => {
                          setDifficulity(event.target.value)
                        }}>
                            <option value="Easy">Easy</option>
                            <option value="Normal">Normal</option>
                            <option value="Hard">Hard</option>
                        </select>
                    </span>
                    Level & You Have <span className="seconds">
                      {levels[difficulity]}</span> Seconds To Type The Word
                </div>
                <div className="btn">
                    <button className="start" onClick={startHandler}>Start Playing</button>
                </div>
                <div className="the-word">{theWord}</div>
                <input type="text" className="input"/>
                <div className="upcoming-words">
                    <div className="instructions">Words will appear here</div>
                </div>
                <div className="control">
                    <div className="time">Time Left: <span>{levels[difficulity]}</span> Seconds</div>
                    <div className="score">Score: <span className="got">0</span> From <span className="total">{count}</span></div>
                </div>
                <div className="finish"><p className='pass'>{winState}</p><p className='fail'>{loseState}</p></div>
            </div>
        </div>     
  </div>
    </div>
  );
}

export default App;
