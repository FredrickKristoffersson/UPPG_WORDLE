import { useEffect, useState } from "react";
import "./slutgiltiga.css";

export default function GAME() {
  // Nedanför är test med att få in komponent i denna funktion

  // Här slutar detta försök

  const [currentGuess, setCurrentGuess] = useState(""); // senast gissat ord
  const [guesses, setGuesses] = useState([]); // gissningar samlat
  const [secretWord, setSecretWord] = useState(""); // fetchade hemliga ordet
  const [wordLength, setWordLength] = useState(5); // välja ordlängd
  const [startTime, setStartTime] = useState(null); // starttid för spelet
  const [endTime, setEndTime] = useState(null); // sluttid för spelet
  const [inputValue, setInputValue] = useState(""); // värde i input-element
  const [allowDuplicates, setAllowDuplicates] = useState(true); //dubletter
  const [name, setName] = useState(""); // namn-variabel vid inskick

  // Denna sektion hanterar fetcningen av "hemliga" ordet
  const fetchSecretWord = async () => {
    await fetch(`http://localhost:5080/api/word/${wordLength}`)
      .then((response) => response.text())
      .then((word) => {
        setSecretWord(word);
        setInputValue("");
        setStartTime(new Date());
        controlDuplicates(word);
      });
  };

  // Denna del kontrollerar om det fetchade ordet innehåller dubletter
  function controlDuplicates(word) {
    if (gotDuplicates(word)) {
      fetchSecretWord();
    } else {
      return;
    }
  }

  function gotDuplicates(word) {
    if (allowDuplicates !== true) return new Set(word).size !== word.length;
  }

  // useEffect gör att det fetchade ordet inte släpar efter
  useEffect(() => {
    fetchSecretWord();
  }, [wordLength]);

  // denna sektion kontrollerar om ordet stämmer med "hemligt" ord samt visar färg om index för bokstav stämmer eller står på annan plats, eller inget
  const compareWords = (currentGuess, secretWord) => {
    if (currentGuess.length !== secretWord.length) {
      return [];
    }
    return currentGuess.split("").map((letter, index) => {
      if (letter === secretWord[index]) {
        return "correct";
      } else if (secretWord.includes(letter)) {
        return "almost";
      } else {
        return "incorrect";
      }
    });
  };

  // denna sektion hanterar submit-funktion vid gissning av ord
  const handleSubmit = (event) => {
    if (currentGuess.length == secretWord.length) {
      event.preventDefault();
      const colorClasses = compareWords(currentGuess, secretWord);
      setGuesses([
        ...guesses,
        { guess: currentGuess.toUpperCase(), colorClasses },
      ]);
      setInputValue("");
      setEndTime(new Date());
    } else {
      event.preventDefault();
    }
  };

  // denna kod presenterar vinst-sidan när korrekt ord är gissat
  const checkIfCorrect = () => {
    if (currentGuess === secretWord) {
      return (
        <div className="winSection">
          <p className="winText">Du vann!</p>
          <label>
            Skriv in ditt namn för att skicka in till highscore-listan
          </label>
          <input
            type="text"
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <button
            className="winButton"
            onClick={() => {
              submitHIGHSCORE();
              // window.location.reload();
            }}
          >
            skicka info
          </button>
          <button
            className="winButton"
            onClick={() => {
              window.location.reload();
            }}
          >
            Spela mer
          </button>
        </div>
      );
    } else {
      return;
    }
  };

  // denna kod ändrar styligen på div-element så detta element poppar fram vid vinst eller förlust
  const changeStyling = currentGuess === secretWord ? "Winning" : "";
  const changeLosingGame = guesses.length > 6 ? "Winning" : "";

  // denna kod submittar info vid vinst och inskick av spelomgång
  const submitHIGHSCORE = async () => {
    const timeTaken = Math.round((endTime - startTime) / 1000);
    const allTheGuesses = guesses.map((item) => item.guess);
    const highscore = {
      secretWord,
      allTheGuesses,
      name,
      timeTaken,
      wordLength,
      allowDuplicates,
    };
    await fetch("http://localhost:5080/api/mongSkicka2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(highscore),
    });
  };

  // här skapar vi logik för att hantera förlust
  const lostTheGame = () => {
    if (guesses.length > 6) {
      return (
        <div className="winSection">
          <p className="winText">Du förlorade!</p>
          <button
            className="winButton"
            onClick={() => {
              window.location.reload();
            }}
          >
            Försök igen
          </button>
        </div>
      );
    } else {
      return;
    }
  };

  // här returneras html-element och deras logik
  return (
    <div className="WORDLE_Section">
      <h1>WORDLE</h1>
      <h4>{wordLength} bokstäver är valt.</h4>
      <h4>Gissningar läggs enbart till om ordlängden är korrekt.</h4>
      <h5>Spelet nollställs vid byte av ordlängd</h5>
      <div>
        <div className="length_Section">
          <button
            className="lengthButton"
            value="5"
            onClick={(e) => {
              setWordLength(e.target.value);
              setGuesses([]);
              setCurrentGuess("");
            }}
          >
            5
          </button>
          <button
            className="lengthButton"
            value="6"
            onClick={(e) => {
              setWordLength(e.target.value);
              setGuesses([]);
              setCurrentGuess("");
            }}
          >
            6
          </button>
          <button
            className="lengthButton"
            value="7"
            onClick={(e) => {
              setWordLength(e.target.value);
              setGuesses([]);
              setCurrentGuess("");
            }}
          >
            7
          </button>

          <label>
            <input
              type="checkbox"
              checked={allowDuplicates}
              onChange={(e) => (
                setAllowDuplicates(e.target.checked), setGuesses([])
              )}
            />
            Tillåt upprepade bokstäver
          </label>
        </div>
        <form className="FORM_Section" onSubmit={handleSubmit}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value.toUpperCase())}
            maxLength={wordLength}
          />
          <button
            type="submit"
            onClick={() => {
              setCurrentGuess(inputValue);
              handleSubmit();
            }}
          >
            Gissa
          </button>
        </form>
        <div className="guesses_Section">
          <ul className="letters">
            {guesses.map((guess, index) => (
              <li key={index}>
                <span></span>
                {guess.guess.split("").map((letter, index) => (
                  <span
                    key={index}
                    className={`letter ${guess.colorClasses[index]}`}
                  >
                    {letter}
                  </span>
                ))}
              </li>
            ))}
          </ul>
          <p className="secret">{`HEMLIGT ORD: ${secretWord}`}</p>
        </div>
      </div>
      <div className={changeStyling}>{checkIfCorrect()}</div>
      <div className={changeLosingGame}>{lostTheGame()}</div>
    </div>
  );
}
