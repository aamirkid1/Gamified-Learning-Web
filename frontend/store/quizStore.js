import { create } from "zustand";

const useQuizStore = create((set) => ({
  quizzes: [],
  setQuizzes: (quizzes) => set({ quizzes }),
}));

export default useQuizStore;