import { useState } from "react";
import { useAuthenticator } from '@aws-amplify/ui-react';
import { useTodos } from "./hooks/useTodos";
import { TodoForm } from "./components/TodoForm";
import { TodoTable } from "./components/TodoTable";
import "./styles/App.css";

/**
 * Main application component for OWL (Online Web Library)
 * 
 * Features:
 * - User authentication with AWS Cognito
 * - Todo management (create, read, update, delete)
 * - Real-time data synchronization
 * - Responsive design
 * - Sortable table interface
 * - Inline editing capabilities
 * 
 * @returns {JSX.Element} Main application interface
 */
function App() {
  const { user, signOut } = useAuthenticator();
  const { todos, handleSort, getSortIcon, createTodo, updateTodo, deleteTodo } = useTodos();
  const [showForm, setShowForm] = useState(false);

  /**
   * Handles creating a new todo and hiding the form
   * @param {Object} todoData - New todo data
   */
  const handleCreateTodo = async (todoData: { name: string; type: string; url: string; creator: string }) => {
    await createTodo(todoData);
    setShowForm(false);
  };

  /**
   * Handles updating an existing todo
   * @param {string} id - Todo ID to update
   * @param {Object} todoData - Updated todo data
   */
  const handleUpdateTodo = async (id: string, todoData: { name: string; type: string; url: string; creator: string }) => {
    await updateTodo(id, todoData);
  };

  /**
   * Handles deleting a todo
   * @param {string} id - Todo ID to delete
   */
  const handleDeleteTodo = async (id: string) => {
    await deleteTodo(id);
  };

  return (
    <main className="app-container">
      <div className="app-header">
        <h1 className="app-title">{user?.signInDetails?.loginId}'s entries</h1>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="add-entry-button"
        >
          {showForm ? 'Cancel' : '+ Add New Entry'}
        </button>
      </div>
      
      {showForm && (
        <TodoForm 
          onSubmit={handleCreateTodo}
          onCancel={() => setShowForm(false)}
        />
      )}

      <TodoTable 
        todos={todos}
        onSort={handleSort}
        getSortIcon={getSortIcon}
        onUpdate={handleUpdateTodo}
        onDelete={handleDeleteTodo}
      />
      
      <button onClick={signOut} className="sign-out-button">
        Sign out
      </button>
    </main>
  );
}

export default App;