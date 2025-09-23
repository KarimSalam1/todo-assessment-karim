import { useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import { addTodo, toggleTodo, deleteTodo } from "../redux/slices/todoSlice";
import type { Todo } from "../redux/slices/todoSlice";

function Todos() {
  const todos = useSelector(
    (state: { todos: { list: Todo[] } }) => state.todos.list
  );
  const dispatch = useDispatch();
  const [newNote, setNewNote] = useState("");
  const [filter, setFilter] = useState("all");

  const handleToggle = (id: number) => {
    dispatch(toggleTodo(id));
  };

  const handleDelete = (id: number) => {
    dispatch(deleteTodo(id));
  };

  const handleAdd = () => {
    if (newNote.trim()) {
      dispatch(addTodo(newNote.trim()));
      setNewNote("");
    }
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "completed") return todo.completed;
    if (filter === "active") return !todo.completed;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#23262C] flex items-start justify-center px-20">
      <div className="bg-[#23262C] rounded-[32px] w-full flex flex-col gap-8">
        <div className="w-full flex flex-col mb-8">
          <h1 className="text-[40px] font-Poppins font-normal text-white/50 text-center mb-4">
            To Do List
          </h1>
          <div className="flex justify-end items-center gap-2 w-full">
            <span className="text-[20px] font-Poppins font-normal text-white/50">
              Filter
            </span>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-[#23262C] border border-gray-600 text-white rounded-md px-4 py-2"
            >
              <option value="all">All</option>
              <option value="active">Non-completed</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
        <ul className="flex flex-col gap-4">
          {filteredTodos.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleToggle(todo.id)}
                  aria-label={
                    todo.completed
                      ? "Mark as not completed"
                      : "Mark as completed"
                  }
                  className="flex items-center justify-center focus:outline-none cursor-pointer transition"
                >
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    readOnly
                    className="cursor-pointer h-6 w-6 appearance-none rounded-md border border-gray-300 checked:bg-blue-400 checked:border-blue-400 checked:after:content-['✓'] checked:after:text-white checked:after:text-sm checked:after:font-bold checked:after:flex checked:after:items-center checked:after:justify-center checked:after:w-full checked:after:h-full"
                  />
                </button>

                <span
                  className={`text-white text-lg font-Poppins ${
                    todo.completed ? "line-through text-white/50" : ""
                  }`}
                >
                  {todo.text}
                </span>
              </div>
              <button
                onClick={() => handleDelete(todo.id)}
                className="text-white/50 hover:text-red-400 transition cursor-pointer"
                aria-label="Delete"
              >
                <FiTrash2 size={22} />
              </button>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4 mt-8 bg-[#2E3239] rounded-xl p-4">
          <input
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="flex-1 bg-transparent border-none text-white placeholder-white/40 font-Poppins focus:outline-none"
            placeholder="New Note"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd();
            }}
          />
          <button
            onClick={handleAdd}
            disabled={!newNote.trim()}
            className="bg-[#F4F6FA] text-[#23262C] rounded-[9px] px-6 py-2 font-Poppins font-normal text-[16px] hover:bg-gray-200 transition cursor-pointer"
          >
            Add New Note
          </button>
        </div>
      </div>
    </div>
  );
}

export default Todos;
