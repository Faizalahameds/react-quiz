import useQuestionStore from "../../store/zustand";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AnimateProvider from "../../components/AnimateProvider/AnimateProvider";

function SingleQuestion() {
  const { question: SingleQuestion, addAnswer } = useQuestionStore();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // To track user's answers
  const [timeRemaining, setTimeRemaining] = useState(40); // 10 minutes in seconds
  const [extraTimeAdded, setExtraTimeAdded] = useState(false); // To track if extra time was added
  const navigate = useNavigate();

  const handleClick = (index) => {
    setCurrentQuestionIndex(index);
  };

  const handleAnswer = (selectedOption) => {
    const currentQuestion = SingleQuestion[currentQuestionIndex];
  
    // Update the answer tracking state
    setAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: selectedOption,
    }));
  
    // Store the answer in Zustand
    addAnswer({
      question: currentQuestion,
      answer: selectedOption,
    });
  };
  
  const handleFinish = () => {
    navigate("/success"); // Redirect to the score page
  };

  const currentQuestion = SingleQuestion?.[currentQuestionIndex];
  const allAttempted = Object.keys(answers).length === SingleQuestion.length;

  // Timer countdown effect
  useEffect(() => {
    if (timeRemaining === 0) {
      handleFinish(); // Automatically finish the quiz when time is up
      return;
    }

    const timerInterval = setInterval(() => {
      setTimeRemaining((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timerInterval); // Cleanup on unmount or timer reach 0
  }, [timeRemaining]);

  // Handle adding extra time
  const handleAddExtraTime = () => {
    if (timeRemaining <= 30 && !extraTimeAdded) {
      setTimeRemaining((prev) => prev + 180); // Add 3 minutes (180 seconds)
      setExtraTimeAdded(true); // Prevent adding extra time again
    }
  };

  // Convert timeRemaining to minutes and seconds
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  // Show the "Add Extra Time" button if there's less than 30 seconds
  const showAddExtraTimeButton = timeRemaining <= 30 && !extraTimeAdded;

  if (!SingleQuestion || SingleQuestion.length === 0) {
    return <p>Loading questions...</p>;
  }

  return (
    <AnimateProvider className="max-w-4xl mx-auto p-5">
      <h1 className="text-lg font-semibold mb-5 text-orange-900">
        Exam Questions
      </h1>

      {/* Timer Display */}
      <div className="text-center text-xl font-bold mb-5">
        Time Remaining: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
      </div>

      {/* Show Add Extra Time Button */}
      {showAddExtraTimeButton && (
        <div className="text-center mb-5">
          <button
            onClick={handleAddExtraTime}
            className="bg-orange-500 text-white font-bold p-2 rounded-lg hover:bg-blue-600"
          >
             Do You Want To Add Extra 3 Minutes ?
          </button>
        </div>
      )}

      {/* Question Navigation */}
      <div className="flex flex-wrap gap-2 mb-5">
        {SingleQuestion.map((_, index) => (
          <button
            key={index}
            onClick={() => handleClick(index)}
            className={`w-10 h-10 flex items-center justify-center rounded-full ${
              answers[index]
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            } ${
              currentQuestionIndex === index
                ? "ring-2 ring-orange-500"
                : "hover:ring-2 hover:ring-gray-300"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* Question Display */}
      <div className="p-5 border rounded-lg shadow-lg bg-white">
        <h2 className="text-base font-bold mb-2 text-gray-800">
          Question {currentQuestionIndex + 1}
        </h2>
        <p className="mb-4 text-gray-700">{currentQuestion?.question}</p>

        {/* Multiple-Choice Options */}
        <div className="flex flex-col space-y-2">
          {currentQuestion?.incorrect_answers
            ?.concat(currentQuestion?.correct_answer)
            .sort() // Randomize order (optional)
            .map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(option)}
                className={`w-full p-2 rounded-md text-left ${
                  answers[currentQuestionIndex] === option
                    ? "bg-lime-500 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {option}
              </button>
            ))}
        </div>
      </div>

      {/* Finish Button */}
      {allAttempted && (
        <div className="mt-5">
          <button
            onClick={handleFinish}
            className="w-full bg-red-500 text-white font-bold p-3 rounded-lg hover:bg-red-600"
          >
            Finish
          </button>
        </div>
      )}
    </AnimateProvider>
  );
}

export default SingleQuestion;
