import { create } from "zustand";
import { persist } from "zustand/middleware";

const useQuestionStore = create(
  persist(
    (set) => ({
      question: [],
      userAnswer: [],
      error: null,
      totalTime: 0,
      trueAnswer: 0,
      falseAnswer: 0,
      auth: {},
      page: 1,

      fetchQuestion: async (query) => {
        try {
          const cachedQuestions = sessionStorage.getItem(query);
          if (cachedQuestions) {
            return set((state) => ({
              ...state,
              question: JSON.parse(cachedQuestions),
              error: null,
            }));
          }

          const response = await fetch(`https://opentdb.com/api.php${query}`);
          if (response.status === 429) {
            throw new Error("Too Many Requests. Please wait a moment and try again.");
          }

          if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
          }

          const data = await response.json();

          // Cache questions
          sessionStorage.setItem(query, JSON.stringify(data.results));

          return set((state) => ({
            ...state,
            question: data.results,
            error: null,
          }));
        } catch (error) {
          console.error("Error fetching questions:", error.message);
          return set((state) => ({
            ...state,
            error: error.message,
          }));
        }
      },

      authUser: (auth) => set((state) => ({ ...state, auth })),
      
      // Update this action to count correct and incorrect answers
      addAnswer: ({ question, answer }) =>
        set((state) => {
          const isCorrect = question.correct_answer === answer;
          
          return {
            ...state,
            userAnswer: [
              ...state.userAnswer,
              { question, answer, isCorrect },
            ],
            trueAnswer: isCorrect ? state.trueAnswer + 1 : state.trueAnswer,
            falseAnswer: isCorrect ? state.falseAnswer : state.falseAnswer + 1,
          };
        }),
      

      logoutUser: () =>
        set({
          question: [],
          userAnswer: [],
          error: null,
          totalTime: 0,
          trueAnswer: 0,
          falseAnswer: 0,
          auth: {},
          page: 1,
        }),

      resetQuestion: () =>
        set((state) => ({
          ...state,
          question: [],
          trueAnswer: 0,
          falseAnswer: 0,
          error: null,
          page: 1,
        })),

      setTimeStamp: (time) =>
        set((state) => ({
          ...state,
          totalTime: time,
        })),

      nextPage: () =>
        set((state) => ({
          ...state,
          page: state.page + 1,
        })),
    }),
    {
      name: "question-storage",
    }
  )
);


export default useQuestionStore;
