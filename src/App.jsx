import { useState } from "react";
import "./App.css";

function countWords(s) {
  let count = 0;
  let readingWord = false;

  for (let i = 0; i < s.length; i++) {
    if (s[i] === " " || s[i] === "\n" || s[i] === "\t") {
      readingWord = false;
    } else if (readingWord === false) {
      count++;
      readingWord = true;
    }
  }

  return count;
}

function App() {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [oldresult, setOldResult] = useState(null);
  const [message, setMessage] = useState("");

  const [spaceBox, setSpaceBox] = useState(false);
  const [lineBox, setLineBox] = useState(false);
  const [lowerBox, setLowerBox] = useState(false);
  const [punctBox, setPunctBox] = useState(false);

  function changeText() {
    let newtext = text;

    if (spaceBox) {
      newtext = newtext.replaceAll("\t", " ");

      while (newtext.includes("  ")) {
        newtext = newtext.replaceAll("  ", " ");
      }

      newtext = newtext.trim();
    }

    if (lineBox) {
      let lines = newtext.split("\n");
      let goodlines = [];

      for (let i = 0; i < lines.length; i++) {
        if (lines[i].trim() !== "") {
          goodlines.push(lines[i]);
        }
      }

      newtext = goodlines.join("\n");
    }

    if (lowerBox) {
      newtext = newtext.toLowerCase();
    }

    if (punctBox) {
      let punctuation = ".,!?;:'\"()-[]{}<>/\\|@#$%^&*_+=~`•…–—“”‘’©®™�";
      let fixed = "";

      for (let i = 0; i < newtext.length; i++) {
        if (punctuation.includes(newtext[i]) === false) {
          fixed += newtext[i];
        }
      }

      newtext = fixed;
    }

    setOldResult(result);
    setResult(newtext);
    setMessage("");
  }

  function undo() {
    if (oldresult !== null) {
      setResult(oldresult);
      setOldResult(null);
    }
  }

  function reset() {
    setText("");
    setResult("");
    setOldResult(null);
    setMessage("");
    setSpaceBox(false);
    setLineBox(false);
    setLowerBox(false);
    setPunctBox(false);
  }

  async function copyText() {
    try {
      await navigator.clipboard.writeText(result);
      setMessage("Copied!");
    } catch {
      setMessage("Could not copy the text.");
    }
  }

  return (
    <div className="app">
      <h1>Text Deformatter</h1>
      <p>Paste text below and choose which changes to apply.</p>

      <label htmlFor="inputText">Your text</label>
      <textarea
        id="inputText"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Paste your text here..."
      />

      <h2>Choose changes</h2>

      <div className="check-options">
        <label>
          <input
            type="checkbox"
            checked={spaceBox}
            onChange={(event) => setSpaceBox(event.target.checked)}
          />
          Remove extra spaces
        </label>

        <label>
          <input
            type="checkbox"
            checked={lineBox}
            onChange={(event) => setLineBox(event.target.checked)}
          />
          Remove blank lines
        </label>

        <label>
          <input
            type="checkbox"
            checked={lowerBox}
            onChange={(event) => setLowerBox(event.target.checked)}
          />
          Make lowercase
        </label>

        <label>
          <input
            type="checkbox"
            checked={punctBox}
            onChange={(event) => setPunctBox(event.target.checked)}
          />
          Remove punctuation and symbols
        </label>
      </div>

      <div className="buttons">
        <button onClick={changeText}>Apply changes</button>
        <button onClick={undo} disabled={oldresult === null}>
          Undo
        </button>
        <button onClick={reset}>Reset</button>
      </div>

      <label htmlFor="outputText">Result</label>
      <textarea
        id="outputText"
        value={result}
        readOnly
        placeholder="Your changed text will show here..."
      />

      <p>
        Original: {text.length} characters, {countWords(text)} words
      </p>
      <p>
        Result: {result.length} characters, {countWords(result)} words
      </p>

      <button onClick={copyText} disabled={result === ""}>
        Copy result
      </button>
      <p>{message}</p>
    </div>
  );
}

export default App;