import "./QuestionCards.css";
import { useState, useEffect } from "react";
import Monaco from '../../pages/monaco/Monaco';

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

  const toggleExpandedView = (id) => {
    setExpandedQuestion(expandedQuestion === id ? null : id);
  };

  const generateQuestions = () => {
    if (!difficulty || !totalMarks || !mcqPercentage || !codingPercentage) {
      alert("Please fill in all fields.");
      return;
    }

    if (parseFloat(mcqPercentage) + parseFloat(codingPercentage) !== 100) {
      alert("Percentages must add up to 100.");
      return;
    }

    const mcqMarks = Math.round((parseFloat(mcqPercentage) / 100) * parseFloat(totalMarks));
    const codingMarks = Math.round((parseFloat(codingPercentage) / 100) * parseFloat(totalMarks));

    if (!questions || !questions[difficulty]) {
      alert("Questions not available for this difficulty.");
      return;
    }

    const mcqQuestions = selectExactMarks(questions[difficulty].mcq, mcqMarks, 1);
    const coding2Questions = selectExactMarks(questions[difficulty].coding_2mark, Math.floor(codingMarks * 0.4), 2);
    const coding5Questions = selectExactMarks(questions[difficulty].coding_5mark, Math.ceil(codingMarks * 0.6), 5);

    const totalSelectedMarks = (mcqQuestions.length * 1) + (coding2Questions.length * 2) + (coding5Questions.length * 5);
    
    if (totalSelectedMarks !== parseFloat(totalMarks)) {
      alert("Unable to generate exact total marks. Adjusting question selection.");
      return;
    }
    
    setSelectedQuestions({ mcq: mcqQuestions, coding2: coding2Questions, coding5: coding5Questions });
  };

  const selectExactMarks = (questionPool, targetMarks, markPerQuestion) => {
    let selected = [];
    let total = 0;
    
    const shuffled = questionPool.sort(() => 0.5 - Math.random());
    for (let q of shuffled) {
      if (total + markPerQuestion <= targetMarks) {
        selected.push(q);
        total += markPerQuestion;
      }
      if (total === targetMarks) break;
    }
    return selected;
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
      <div className="mt-4">
        <h3 className="text-lg font-semibold">Selected Questions</h3>
        {selectedQuestions.mcq.map((q, index) => (
          <div key={index} className="p-2 border rounded mt-2">
            <p>{index + 1}. {q.question}</p>
          </div>
        ))}
        {selectedQuestions.coding2.map((q, index) => (
          <div key={index} className="p-2 border rounded mt-2">
            <p>{index + 1}. {q.question}</p>
          </div>
        ))}
        {selectedQuestions.coding5.map((q, index) => (
          <div key={index} className="p-2 border rounded mt-2">
            <p>{index + 1}. {q.question}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionGenerator;
 