import "./QuestionCards.css";
import { useState, useEffect } from "react";
import Monaco from "../../pages/monaco/Monaco";

const QuestionGenerator = () => {
  const [expandedEditor, setExpandedEditor] = useState(null);
  const [difficulty, setDifficulty] = useState("");
  const [totalMarks, setTotalMarks] = useState("");
  const [mcqPercentage, setMcqPercentage] = useState("");
  const [codingPercentage, setCodingPercentage] = useState("");
  const [questions, setQuestions] = useState(null);
  const [selectedQuestions, setSelectedQuestions] = useState({ mcq: [], coding2: [], coding5: [] });
  const [selectedOptions, setSelectedOptions] = useState({});
  const [codeResponses, setCodeResponses] = useState({});

  const data = useContext(UserContext)
  const  output  =  data

  useEffect(
    () => {
      console.log(output)
    },[output]
  )

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const response = await fetch("questions.json");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetched questions:", data);
        setQuestions(data);
      } catch (err) {
        console.error("Error loading questions:", err);
        alert("Failed to load questions. Check your questions.json file. See console for details.");
      }
    };

        loadQuestions();
    }, []);

    const generateQuestions = () => {
        if (!difficulty) {
            alert("Please select a difficulty level.");
            return;
        }
        if (!totalMarks || !mcqPercentage || !codingPercentage) {
            alert("Please fill in all fields.");
            return;
        }

        if (parseFloat(mcqPercentage) + parseFloat(codingPercentage) !== 100) {
            alert("Percentages must add up to 100.");
            return;
        }

        if (!questions || !questions[difficulty]) {
            alert(`Questions not available for the "${difficulty}" difficulty.`);
            return;
        }

        let mcqMarks = (parseFloat(mcqPercentage) / 100) * parseFloat(totalMarks);
        let codingMarks = (parseFloat(codingPercentage) / 100) * parseFloat(totalMarks);

        // Distribute coding marks: 40% for 2-mark, 60% for 5-mark
        let coding2Marks = codingMarks * 0.4;
        let coding5Marks = codingMarks * 0.6;

    let mcqCount = Math.floor(mcqMarks / 1);
    let coding2Count = 0;
    let coding5Count = 0;

    // Ensure correct distribution of marks (balanced 2-mark & 5-mark questions)
    if (codingMarks % 7 === 0) {
      coding5Count = Math.floor(codingMarks / 7);
      coding2Count = coding5Count;
    } else {
      coding5Count = Math.floor(codingMarks / 5);
      let remainingMarks = codingMarks - coding5Count * 5;
      coding2Count = Math.floor(remainingMarks / 2);
    }

    console.log("Calculated Counts:", { mcqCount, coding2Count, coding5Count });

    const mcqQuestions = (questions[difficulty]?.mcq || []).sort(() => 0.5 - Math.random()).slice(0, mcqCount);
    let coding2Questions = (questions[difficulty]?.coding_2mark || []).sort(() => 0.5 - Math.random()).slice(0, coding2Count);
    let coding5Questions = (questions[difficulty]?.coding_5mark || []).sort(() => 0.5 - Math.random()).slice(0, coding5Count);

        setSelectedQuestions({ mcq: mcqQuestions, coding2: coding2Questions, coding5: coding5Questions });
        setSelectedOptions({});

    console.log("Generated Questions:", { mcqQuestions, coding2Questions, coding5Questions });
  };

    const handleOptionChange = (questionIndex, optionKey) => {
        setSelectedOptions({
            ...selectedOptions,
            [questionIndex]: optionKey,
        });
    };

    const openQuestionInNewTab = (question) => {
        const questionString = JSON.stringify(question);
        const newTab = window.open(`/question?data=${encodeURIComponent(questionString)}`, "_blank");
        if (newTab) {
            newTab.focus();
        }
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

        {/* Marks Dropdown */}
        <select className="w-full p-2 border rounded" onChange={(e) => setTotalMarks(e.target.value)}>
          <option value="">Select Total Marks</option>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="75">75</option>
          <option value="100">100</option>
        </select>

        <input className="w-full p-2 border rounded" type="number" placeholder="MCQ Percentage" onChange={(e) => setMcqPercentage(e.target.value)} />
        <input className="w-full p-2 border rounded" type="number" placeholder="Coding Percentage" onChange={(e) => setCodingPercentage(e.target.value)} />

        <button className="w-full bg-blue-500 text-white p-2 rounded mt-2" onClick={generateQuestions} disabled={!questions}>
          Generate Questions
        </button>
      </div>

            {/* Display MCQ Questions */}
            {selectedQuestions.mcq.length > 0 && (
                <div className="mt-4">
                    <h3 className="text-lg font-semibold">MCQ Questions</h3>
                    {selectedQuestions.mcq.map((q, index) => (
                        <div key={`mcq-${index}`} className="p-2 border rounded mt-2 bg-white shadow-md">
                            <p className="font-medium">
                                {index + 1}. {q.question}
                            </p>
                            <ul className="list-none pl-0">
                                {q.options &&
                                    Object.entries(q.options).map(([key, value]) => (
                                        <li key={key} className="text-gray-700" style={{ listStyle: "none", display: "block", paddingLeft: "0", marginLeft: "0" }}>
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name={`mcq-${index}`}
                                                    value={key}
                                                    checked={selectedOptions[index] === key}
                                                    onChange={() => handleOptionChange(index, key)}
                                                    className="mr-2"
                                                />
                                                <b>{key.toUpperCase()}.</b> {value}
                                            </label>
                                        </li>
                                    ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}

            {/* Display 2-mark Coding Questions */}
            {selectedQuestions.coding2.length > 0 && (
                <div className="mt-4">
                    <h3 className="text-lg font-semibold">2 Marks</h3>
                    {selectedQuestions.coding2.map((q, index) => (
                        <div key={`coding2-${index}`} className="p-2 border rounded mt-2 bg-white shadow-md">
                            <p className="font-medium">
                                {index + 1}. {q.question}
                            </p>
                            <button
                                onClick={() => openQuestionInNewTab(q)}
                                className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
                            >
                                View
                            </button>
                        </div>
                    ))}
                </div>
            )}

      {/* Display Coding Questions */}
      {selectedQuestions.coding2.concat(selectedQuestions.coding5).length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Coding Questions</h3>
          {selectedQuestions.coding2.concat(selectedQuestions.coding5).map((q, index) => (
            <div key={`coding-${index}`} className="p-2 border rounded mt-2 bg-white shadow-md">
              <p className="font-medium">
                {index + 1}. <b>({q.marks} Marks - {q.marks === 2 ? "2-Mark Question" : "5-Mark Question"})</b> {q.question}
              </p>
              <button className="bg-blue-500 text-white p-1 rounded mt-2" onClick={() => handleViewEditor(index)}>
                {expandedEditor === index ? "Close Editor" : "View Editor"}
              </button>
              {expandedEditor === index && <Monaco value={codeResponses[index] || ""} onChange={(code) => handleCodeChange(index, code)} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuestionGenerator;
