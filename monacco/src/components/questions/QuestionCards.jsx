import "./QuestionCards.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  const [stdMark , setStdMark] = useState(0);

  const navigate = useNavigate()

  const handleQuestionClick = (question) => {
    const questionData = encodeURIComponent(JSON.stringify(question));
    navigate(`/question-detail?data=${questionData}`);
};


  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const response = await fetch("/questions.json"); // Ensure it's in 'public' folder
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        console.log("Fetched questions:", data);
        setQuestions(data);
      } catch (err) {
        console.error("Error loading questions:", err);
        alert("Failed to load questions. Check your JSON file.");
      }
    };

    loadQuestions();
  }, []);

  // Function to Generate Questions
  const generateQuestions = () => {
    if (!difficulty) return alert("Please select a difficulty level.");
    if (!totalMarks || !mcqPercentage || !codingPercentage) return alert("Fill all fields.");
    if (parseFloat(mcqPercentage) + parseFloat(codingPercentage) !== 100) return alert("Percentages must add up to 100.");
    if (!questions || !questions[difficulty]) return alert(`Questions not available for "${difficulty}" difficulty.`);

    let mcqMarks = (parseFloat(mcqPercentage) / 100) * parseFloat(totalMarks);
    let codingMarks = (parseFloat(codingPercentage) / 100) * parseFloat(totalMarks);


    let mcqCount = Math.floor(mcqMarks / 1);
    let coding2Count = 0;
    let coding5Count = 0;

    // Ensure correct distribution of marks (balanced 2-mark & 5-mark questions)
    if (codingMarks % 7 === 0) {
      coding5Count = Math.floor(codingMarks / 7);
      coding2Count = coding5Count;
    } else {
      coding2Count = Math.min(Math.floor(codingMarks / 2), questions[difficulty].coding_2mark.length);
    }

    const mcqQuestions = questions[difficulty].mcq.sort(() => Math.random() - 0.5).slice(0, mcqCount);
    const coding2Questions = questions[difficulty].coding_2mark.sort(() => Math.random() - 0.5).slice(0, coding2Count).map(q => ({ ...q, marks: 2 }));
    const coding5Questions = questions[difficulty].coding_5mark.sort(() => Math.random() - 0.5).slice(0, coding5Count).map(q => ({ ...q, marks: 5 }));

        setSelectedQuestions({ mcq: mcqQuestions, coding2: coding2Questions, coding5: coding5Questions });


    console.log("Generated Questions:", { mcqQuestions, coding2Questions, coding5Questions });
  };
//question with key varuthu
    const handleOptionChange = (questionIndex, optionKey , questionAns) => {
        setSelectedOptions({
            ...selectedOptions,
            [`${questionIndex}`]: optionKey
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

        
        <input className="w-full p-2 border rounded" type="number" placeholder="Total Mark" onChange={(e) => setTotalMarks(e.target.value)} />

        <input className="w-full p-2 border rounded" type="number" placeholder="MCQ Percentage" onChange={(e) => setMcqPercentage(e.target.value)} />
        <input className="w-full p-2 border rounded" type="number" placeholder="Coding Percentage" onChange={(e) => setCodingPercentage(e.target.value)} />

        <button className="w-full bg-blue-500 text-white p-2 rounded mt-2" onClick={generateQuestions} disabled={!questions}>
          Generate Questions
        </button>
      </div>

      {/* MCQ Questions */}
      {selectedQuestions.mcq.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">MCQ Questions</h3>
          {selectedQuestions.mcq.map((q, index) => (
            <div key={`mcq-${q.id}`} className="p-2 border rounded mt-2 bg-white shadow-md">
              <p className="font-medium">{index + 1}. {q.question}</p>
              <ul id="mcqul">
                {q.options && Object.entries(q.options).map(([key, value]) => (
                  <li key={key}>
                    <label>
                      <input type="radio" name={`mcq-${q.id}`} value={key} checked={selectedOptions[q.id] === key} onChange={() => handleOptionChange(q.id, key , q.answer)} />
                      {key.toUpperCase()}. {value}
                    </label>
                  </li>
                ))}
              </ul>
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
              <button 
  className="bg-blue-500 text-white p-2 rounded mt-2" 
  onClick={() => handleQuestionClick(q)}
>
  View Question
</button>


            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuestionGenerator;