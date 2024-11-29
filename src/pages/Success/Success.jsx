import useQuestionStore from "../../store/zustand";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import AnimateProvider from "../../components/AnimateProvider/AnimateProvider";

function Success() {
  const {
    trueAnswer,
    falseAnswer,
    resetQuestion,
    setTimeStamp,
    question: allQuestion,
    userAnswer = [], // Default to an empty array if userAnswer is undefined
  } = useQuestionStore();

  const navigate = useNavigate();
  const totalQuestions = allQuestion.length; // Use dynamic length
  const score = (trueAnswer * 100) / totalQuestions; // Correct score calculation
  const indxColor =
    score >= 80 ? "#10b981" : score >= 60 ? "#F59E0B" : "#dc2626";

  useEffect(() => {
    setTimeStamp(0); // Reset timestamp or perform any cleanup
  }, []);

  const handleClick = () => {
    resetQuestion();
    navigate("/"); // Navigate back to the home page or dashboard
  };

  return (
    <AnimateProvider className="flex flex-col space-y-10 md:max-w-xl md:mx-auto">
      <h3 className="text-lg text-center text-neutral-900 font-bold md:text-xl">
        Your Final score is
      </h3>

      <h1
        style={{
          background: indxColor,
        }}
        className={`text-5xl font-bold mx-auto p-5 rounded-full bg-red-500 md:text-6xl text-neutral-100`}
      >
        {score} %
      </h1>

      <div className="text-xs md:text-sm text-neutral-600 font-medium flex flex-col space-y-1">
        <p className="flex justify-between">
          Correct Answer <span className="text-green-600">{trueAnswer}</span>
        </p>
        <p className="flex justify-between">
          Wrong Answer <span className="text-red-600">{falseAnswer}</span>
        </p>
        <p className="flex justify-between">
          Answer Submitted{" "}
          <span className="text-purple-600">{trueAnswer + falseAnswer}</span>
        </p>
      </div>

      <button
        onClick={handleClick}
        className="grid place-items-center text-neutral-50 bg-orange-500 rounded-full py-2 hover:text-neutral-50 text-sm font-semibold"
      >
        Back to dashboard
      </button>

      {/* Answer Summary
      <h3 className="text-center text-neutral-600 font-semibold md:text-lg pt-[100px]">
        Answer Summary
      </h3>

      {/* Render Summary of Answers */}
      {/* {userAnswer.length > 0 ? (
        userAnswer.map((answerItem, index) => (
          <div key={index} className="mb-4">
            <p><strong>Question:</strong> {answerItem.question?.question}</p>
            <p><strong>Your answer:</strong> {answerItem.answer}</p>
            <p><strong>Correct answer:</strong> {answerItem.question?.correct_answer}</p>
            <p className={answerItem.isCorrect ? "text-green-500" : "text-red-500"}>
              {answerItem.isCorrect ? "Correct" : "Incorrect"}
            </p>
          </div>
        ))
      ) : (
        <p>No answers submitted yet.</p>
      )} */} 
    </AnimateProvider>
  );
}

export default Success;
