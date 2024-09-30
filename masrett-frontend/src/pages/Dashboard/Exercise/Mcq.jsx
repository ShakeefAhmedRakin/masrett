import { useState, useEffect } from "react";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";
import { toast } from "sonner";

// Fisher-Yates shuffle function to randomize array order
const shuffleArray = (array) => {
  let shuffledArray = [...array]; // Create a copy of the array to avoid mutating the original
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};

const Mcq = () => {
  const [exercises, setExercises] = useState([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [testComplete, setTestComplete] = useState(false);
  const [shuffledOptions, setShuffledOptions] = useState([]);
  const { user } = useAuth();

  // Fetch all MCQ exercises on component mount
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await axios.get(
          "https://masrett-backend.vercel.app/get-mcq-exercises"
        );
        setExercises(response.data.exercises);
      } catch (error) {
        console.error("Error fetching MCQ exercises:", error);
      }
    };

    fetchExercises();
  }, []);

  // Shuffle the options when the current exercise changes
  useEffect(() => {
    if (exercises.length > 0) {
      setShuffledOptions(shuffleArray(exercises[currentExerciseIndex].options));
    }
  }, [currentExerciseIndex, exercises]);

  // Handle answer selection
  const handleAnswerSelection = (option) => {
    setSelectedAnswer(option);
  };

  // Handle submit answer
  const handleSubmitAnswer = () => {
    const currentExercise = exercises[currentExerciseIndex];

    if (selectedAnswer === currentExercise.correctAnswer) {
      setScore(score + 1);
      toast.success("Correct answer! 🎉"); // Show success toast
    } else {
      toast.error("Incorrect answer! 😞"); // Show error toast
    }

    setShowAnswer(true);
  };

  // Handle going to the next question
  const handleNextQuestion = async () => {
    setShowAnswer(false);
    setSelectedAnswer(null);

    if (currentExerciseIndex + 1 < exercises.length) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    } else {
      setTestComplete(true);
      await updateHighestScore();
    }
  };

  // Function to update the highest score
  const updateHighestScore = async () => {
    try {
      const response = await axios.put(
        "https://masrett-backend.vercel.app/update-highest-score",
        {
          email: user.email,
          score,
        }
      );
      console.log(response.data);
    } catch (error) {
      console.error("Error updating highest score:", error);
    }
  };

  // Function to reset the quiz
  const resetQuiz = () => {
    setCurrentExerciseIndex(0);
    setSelectedAnswer(null);
    setShowAnswer(false);
    setScore(0);
    setTestComplete(false);
  };

  if (testComplete) {
    return (
      <div className="h-[90vh] flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold mb-4">Test Complete!</h2>
          <p className="text-xl">
            Your total score is: {score} out of {exercises.length}
          </p>
          <button
            onClick={resetQuiz}
            className="btn bg-primary hover:bg-primary text-white border-none w-full mt-4"
          >
            Reattempt Quiz
          </button>
        </div>
      </div>
    );
  }

  if (exercises.length === 0) {
    return (
      <div className="h-[90vh] flex items-center justify-center">
        <span className="loading loading-bars loading-lg text-black"></span>
      </div>
    );
  }

  const currentExercise = exercises[currentExerciseIndex];

  return (
    <div className="pt-5">
      <div className="bg-white p-6 rounded-lg w-full">
        <h2 className="text-2xl font-bold mb-4 text-center">
          {currentExerciseIndex + 1}/5
        </h2>
        <div className="flex justify-center flex-col items-center gap-4">
          <progress
            className="progress w-full max-w-[50%]"
            value={currentExerciseIndex + 1}
            max="5"
          ></progress>
          <img
            src={currentExercise.imageUrl}
            alt="Sign"
            draggable={false}
            className="w-full xl:max-w-[50%] mx-auto object-cover mb-4"
          />
        </div>
        <div className="mb-4">
          <div className="grid grid-cols-2 gap-3">
            {shuffledOptions.map((option, index) => (
              <div
                key={index}
                onClick={() => handleAnswerSelection(option)}
                className={`p-2 border-2 font-bold rounded hover:bg-primary hover:text-white hover:border-primary cursor-pointer btn bg-none border-primary ${
                  showAnswer
                    ? option === currentExercise.correctAnswer
                      ? "bg-green-500 text-white border-green-500"
                      : option === selectedAnswer
                      ? "bg-red-500 text-white border-red-500"
                      : "bg-transparent"
                    : selectedAnswer === option
                    ? "bg-blue-200"
                    : "bg-transparent"
                }`}
                style={{ pointerEvents: showAnswer ? "none" : "auto" }}
              >
                {option}
              </div>
            ))}
          </div>
        </div>
        <div className="max-w-4xl mx-auto">
          {showAnswer ? (
            <button
              onClick={handleNextQuestion}
              className="btn bg-primary hover:bg-primary text-white border-none w-full"
            >
              {currentExerciseIndex + 1 < exercises.length
                ? "Next Question"
                : "Finish Test"}
            </button>
          ) : (
            <button
              onClick={handleSubmitAnswer}
              className="btn bg-secondary hover:bg-secondary text-white border-none w-full"
              disabled={!selectedAnswer}
            >
              Submit Answer
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Mcq;
