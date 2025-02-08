import "./QuestionCards.css";
import { useState, useEffect } from "react";
import Monaco from "../../pages/monaco/Monaco";

const QuestionGenerator = () => {
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const [difficulty, setDifficulty] = useState("");
  const [totalMarks, setTotalMarks] = useState("");
  const [mcqPercentage, setMcqPercentage] = useState("");
  const [codingPercentage, setCodingPercentage] = useState("");
  const [questions, setQuestions] = useState(null);
  const [selectedQuestions, setSelectedQuestions] = useState({ mcq: [], coding2: [], coding5: [] });

  useEffect(() => {
    fetch("questions.json")
      .then((res) => res.json())
      .then((data) => setQuestions(data))
      .catch((err) => console.error("Error loading questions:", err));
  }, []);

  const generateQuestions = () => {
    if (!difficulty || !totalMarks || !mcqPercentage || !codingPercentage) {
      alert("Please fill in all fields.");
      return;
    }

    if (parseFloat(mcqPercentage) + parseFloat(codingPercentage) !== 100) {
      alert("Percentages must add up to 100.");
      return;
    }

    const mcqMarks = (parseFloat(mcqPercentage) / 100) * parseFloat(totalMarks);
    const codingMarks = (parseFloat(codingPercentage) / 100) * parseFloat(totalMarks);

    const mcqCount = Math.floor(mcqMarks / 1);
    const coding2Count = Math.floor((codingMarks * 0.4) / 2);
    const coding5Count = Math.floor((codingMarks * 0.6) / 5);

    if (!questions || !questions[difficulty]) {
      alert("Questions not available for this difficulty.");
      return;
    }

    const mcqQuestions = questions[difficulty].mcq.sort(() => 0.5 - Math.random()).slice(0, mcqCount);
    const coding2Questions = questions[difficulty].coding_2mark.sort(() => 0.5 - Math.random()).slice(0, coding2Count);
    const coding5Questions = questions[difficulty].coding_5mark.sort(() => 0.5 - Math.random()).slice(0, coding5Count);

    setSelectedQuestions({ mcq: mcqQuestions, coding2: coding2Questions, coding5: coding5Questions });
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Question Generator</h2>
      <div className="space-y-2">
        <select className="w-full p-2 border rounded" onChange={(e) => setDifficulty(e.target.value)}>
          <option value="">Select Difficulty</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <input className="w-full p-2 border rounded" type="number" placeholder="Total Marks" onChange={(e) => setTotalMarks(e.target.value)} />
        <input className="w-full p-2 border rounded" type="number" placeholder="MCQ Percentage" onChange={(e) => setMcqPercentage(e.target.value)} />
        <input className="w-full p-2 border rounded" type="number" placeholder="Coding Percentage" onChange={(e) => setCodingPercentage(e.target.value)} />
        <button className="w-full bg-blue-500 text-white p-2 rounded mt-2" onClick={generateQuestions}>Generate Questions</button>
      </div>

      {selectedQuestions.coding2.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Coding Questions (2 Marks)</h3>
          {selectedQuestions.coding2.map((q, index) => (
            <div key={index} className="p-2 border rounded mt-2 bg-white shadow-md">
              <p className="font-medium">{index + 1}. {q.question}</p>
              <button
                onClick={() => setExpandedQuestion(expandedQuestion === index ? null : index)}
                className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
              >
                {expandedQuestion === index ? "Close" : "View"}
              </button>

              {expandedQuestion === index && (
                <div className="mt-2 p-4 border rounded bg-gray-100 shadow-inner">
                  <p><b>Question Details:</b></p>
                  <p>{q.description}</p>
                  <br />

                  <b>Test Cases:</b>
                  {q.test_cases.map((t, caseIndex) => (
                    <p key={caseIndex} className="text-sm text-gray-700">
                      <b>Input:</b> {JSON.stringify(t.input, null, 2)} <br />
                      <b>Output:</b> {JSON.stringify(t.output, null, 2)}
                    </p>
                  ))}
                  <br />

                  {/* Open Monaco editor directly inside the expanded question */}
                  <div className="mt-4">
                    <Monaco key={`monaco-${index}`} />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuestionGenerator;
