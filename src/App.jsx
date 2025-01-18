import "./style.scss"
import { words } from "./data.js"
import { useEffect, useRef, useState } from "react";

export default function App() {


  const min = 0;
  const max = words.length;
  const selectTimerRef = useRef()
  const [bestScore, setBestScore] = useState(null)
  const [startDecompte, setStartDecompte] = useState(false)
  const [decompte, setDecompte] = useState(3)
  const [timer, setTimer] = useState([15,30,45,60])
  const [selectedTimer, setSelectedTimer] = useState(15)
  const [timerView, setTimerView] = useState(15)
  const [gameStarted, setGameStarted] = useState(false)
  const [score, setScore] = useState(0)
  const [visiblesWords, setVisibleWords] = useState([])
  const [userSentence, setUserSentence] = useState("")
  const [currentWord, setCurrentWord] = useState(null)
  const [trash, setTrash] = useState([])


  // Gère la récupération du localStorage du meilleur score effectuer
  useEffect(() => {
    const scoreStorage = localStorage.getItem("bestTypingScore")
    setBestScore(scoreStorage ? parseFloat(JSON.parse(scoreStorage)) : 0)
  }, [])

  // Gère la cohérence entre le timer qui restera pour jouer et le timer sélectionner
  useEffect(() => {
    setTimerView(selectedTimer)
  }, [selectedTimer])

  // Gère l'apparition du décompte avant le lancement du jeu
  useEffect(() => {
    let decompteInterval
    if(startDecompte){
      setScore(0)
      generateRandomLetter()
      setUserSentence("")
      setTrash([])
      let count = 3
      decompteInterval = setInterval(() => {
        if(count === 0){
          setGameStarted(true)
          clearInterval(decompteInterval)
        }else{
          count--
          setDecompte(current => current - 1)
        }
      }, 1000);
    }

    return() => {
      clearInterval(decompteInterval)
    }
  }, [startDecompte])

  // Gère la réaction lorsque l'utilisateur tape au clavier
  useEffect(() => {
    const detectTyping = (e) => {
      if(gameStarted){
        if(currentWord.startsWith(`${userSentence}${e.key}`)){
          setUserSentence(current => `${current}${e.key}`)
        }
      }
    }

    window.addEventListener("keypress", detectTyping)

    return() => {
      window.removeEventListener("keypress", detectTyping)
    }
  }, [userSentence, currentWord, gameStarted])


  // Gère le défilement du timer
  useEffect(() => {
    let timerInterval
    if(gameStarted){
      let count = selectedTimer
      timerInterval = setInterval(() => {
        if(count === 0){
          setDecompte(3)
          setStartDecompte(false)
          setGameStarted(false)
          clearInterval(timerInterval)
          setTimerView(selectedTimer)
        }else{
          count --
          setTimerView(current => current - 1)
        }
      }, 1000);
    }

    return() => {
      clearInterval(timerInterval)
    }
  }, [gameStarted, selectTimerRef, selectedTimer])

  useEffect(() => {
    if(!gameStarted){
      const bestTypingScore = (trash.length / timerView).toFixed(2)
      if(bestTypingScore > bestScore){
        setBestScore(bestTypingScore)
        localStorage.setItem("bestTypingScore", JSON.stringify(bestTypingScore))
      }
    }
  }, [gameStarted, score, bestScore])

  // Lorsque le typing de l'utilisateur évolue
  useEffect(() => {
    if(currentWord){
      if(userSentence === currentWord){
        const newTrash = trash
        newTrash.push({
          word:currentWord,
          ok:true
        })
        setTrash(newTrash)
        const newWords = visiblesWords.slice(1)
        let searchValidWord = true
        let newWordToAdd
        while(searchValidWord){
          newWordToAdd = words[genRandomIndex()]
          if(!visiblesWords.includes(newWordToAdd)){
            searchValidWord = false
          }
        }
        newWords.push(newWordToAdd)
        setCurrentWord(newWords[0])
        setUserSentence("")
        setVisibleWords(newWords)
        const newScore = score + 1
        setScore(newScore)
      }
    }
  }, [userSentence])

  // Etat de la lettre en cours
  const letterState = (word, letterIndex) => {
    if(currentWord === word){
      if(userSentence === "" && letterIndex === 0){
        return "waiting"
      }
      if(word.startsWith(userSentence) && letterIndex === userSentence.length){
        return "waiting"
      }else{
        return ""
      }
    }else{
      return ""
    }
    
  }

  // Génère un index aléatoire ( pour un mot aléatoire )
  const genRandomIndex = () => {
    return Math.floor(Math.random() * (max - min))
  }

  // Génère 5 mots aléatoires
  const generateRandomLetter = () => {
    const initialWords = new Set();

    if (words.length < 3) {
      console.error("Pas assez de mots pour générer une sélection unique.");
      return;
    }

    while (initialWords.size < 3) {
      const randomWord = words[genRandomIndex()];
      initialWords.add(randomWord);
    }

    setVisibleWords(Array.from(initialWords));
  }

  
  // Gère l'initialisation des 5 premiers mots
  useEffect(() => {
    generateRandomLetter()
  }, [])


  // Parmis la liste des mots proposé, sélectionne le mot du millieu comme mot en cours ( index 2 )
  useEffect(() => {
    if(visiblesWords.length === 3){
      setCurrentWord(visiblesWords[0])
    }
  }, [visiblesWords])


  return (
    <>
    <h3>Meilleur score : {bestScore} mot(s)/secondes</h3>
    <h2>{score} mot(s)</h2>
    <ul className="trash-container">
      {trash.map((word, index) => (
        <li key={`${word}${index}`} className={`${word.ok ? "green" : "red"}`}>
            {word.word}
        </li>
      ))}
    </ul>
    <div className="words-container">
      <div className="words">
        {visiblesWords.map((word, index) => (
          <div key={index} className={`word ${word === currentWord ? "active" : ""}`}>
            {word.split("").map((letter, index) => (
              <span key={index} className={`letter ${letterState(word, index)}`}>
                {letter}
              </span>
            ))}
          </div>
        ))}

      </div>
    </div>
      
    <div className="button-container">
        {(!gameStarted && !startDecompte) && (
          <button onClick={() => setStartDecompte(true)}>Commencer</button>
        )}
        {(startDecompte && !gameStarted) && (
          <p>Le jeu commence dans {decompte}</p>
        )}
    </div>

    <div className="option">
        {!gameStarted && (
          <>
            <label htmlFor="">Chronomètre</label>
            <div>
              <select value={selectedTimer} ref={selectTimerRef} onChange={(e) => {
                setSelectedTimer(e.target.value)
              }} name="" id="">
                {timer.map((possibility, index) => (
                  <option key={`possibility${index}`}  value={possibility}>{possibility}</option>
                ))}
              </select>
              <span>seconde(s).</span>
            </div>
          </>
        ) }
        {gameStarted && (
          <>
            <label htmlFor="">Temp restant</label>
            <div>
              {timerView}
            </div>
          </>
        )}
      </div>
    </>
  )
}
