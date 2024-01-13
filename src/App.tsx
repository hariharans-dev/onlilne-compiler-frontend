import React, { useState, ChangeEvent } from "react";
import "./App.css";
import request from "./Request";

function App() {
  const [code, setCode] = useState<string>("");
  const [input, setInput] = useState<string>("");
  const [output, setOutput] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("python");

  const handleCodeChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setCode(event.target.value);
  };

  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
  };

  const handleTabKeyPress = (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (event.key === "Tab") {
      event.preventDefault();
      const { selectionStart, selectionEnd } = event.currentTarget;
      const newCode =
        code.substring(0, selectionStart) + "\t" + code.substring(selectionEnd);
      const newCursorPos = selectionStart + 1;
      setCode(newCode);
      setTimeout(() => {
        if (event.currentTarget) {
          event.currentTarget.setSelectionRange(newCursorPos, newCursorPos);
        }
      }, 0);
    }
  };

  const errorFunction = () => {
    setOutput("Internal server error");
  };

  const language_route = () => {
    if (selectedLanguage === "python") {
      return process.env.REACT_APP_API_PYTHON;
    }
  };

  const runCode = async () => {
    if (code === "") {
      setOutput("");
    } else {
      try {
        const data = { code, input };
        const url = language_route() + "";
        console.log(url);
        const headers = {
          "Content-Type": "application/json",
        };
        const response = await request(url, data, headers, errorFunction);

        setOutput(response.data.output);
      } catch (error) {
        setOutput("Error occurred during code execution");
      }
    }
  };

  return (
    <div className="body">
      <header>
        <h1>Online Compiler</h1>
      </header>
      <label className="language">
        Select Language:
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
        >
          <option value="python">Python</option>
        </select>
      </label>
      <main>
        <textarea
          className="codeEditor"
          placeholder="Enter your code here..."
          value={code}
          onChange={handleCodeChange}
          onKeyDown={handleTabKeyPress}
        ></textarea>
        <textarea
          className="input"
          placeholder="Enter input here..."
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleTabKeyPress}
        ></textarea>
        <div className="output">
          {output.split("\r\n").map((line, index) => (
            <React.Fragment key={index}>
              {line}
              <br />
            </React.Fragment>
          ))}
        </div>
      </main>

      <button className="compile" onClick={runCode}>
        Run Code
      </button>
    </div>
  );
}

export default App;
