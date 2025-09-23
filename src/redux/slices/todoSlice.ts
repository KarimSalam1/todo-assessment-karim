import { createSlice } from "@reduxjs/toolkit";

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

interface TodosState {
  list: Todo[];
}

const loadTodos = (): Todo[] => {
  try {
    const data = localStorage.getItem("todos");
    return data
      ? JSON.parse(data)
      : [
          {
            id: 1,
            text: "Complete presentation for team meeting on Friday",
            completed: false,
          },
          {
            id: 2,
            text: "Schedule dentist appointment for next month",
            completed: false,
          },
          {
            id: 3,
            text: "Buy groceries for the week",
            completed: false,
          },
          {
            id: 4,
            text: "Call utility company to resolve billing issue",
            completed: true,
          },
          {
            id: 5,
            text: "Finish reading chapter 3 of 'The Great Gatsby'",
            completed: true,
          },
          {
            id: 6,
            text: "Go for a 30-minute run in the park",
            completed: true,
          },
        ];
  } catch {
    return [];
  }
};

const saveTodos = (todos: Todo[]) => {
  localStorage.setItem("todos", JSON.stringify(todos));
};

const initialState: TodosState = {
  list: loadTodos(),
};

const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    addTodo: (state, action) => {
      const newTodo = {
        id: Date.now(),
        text: action.payload,
        completed: false,
      };
      state.list.push(newTodo);
      saveTodos(state.list);
    },
    toggleTodo: (state, action) => {
      const todo = state.list.find((t) => t.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
        saveTodos(state.list);
      }
    },
    deleteTodo: (state, action) => {
      state.list = state.list.filter((t) => t.id !== action.payload);
      saveTodos(state.list);
    },
  },
});

export const { addTodo, toggleTodo, deleteTodo } = todosSlice.actions;
export default todosSlice.reducer;
