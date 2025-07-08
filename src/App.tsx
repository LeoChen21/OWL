import { useState } from "react";
import { useTodos } from "./hooks/useTodos";
import { useGuestTodos } from "./hooks/useGuestTodos";
import { useGuestAuth } from "./contexts/GuestAuthContext";
import { EntryForm } from "./components/EntryForm";
import { Table } from "./components/Table";
import "./styles/App.css";

/**
 * Main application component for OWL (Online Web Library)
 * 
 * Features:
 * - User authentication with AWS Cognito and Guest mode
 * - Todo management (create, read, update, delete)
 * - Real-time data synchronization for authenticated users
 * - Local storage for guest users
 * - Responsive design
 * - Sortable table interface
 * - Inline editing capabilities
 * 
 * @returns {JSX.Element} Main application interface
 */
interface AppProps {
  authUser?: any;
  signOut?: () => void;
}

function App({ authUser, signOut }: AppProps = {}) {
  const { isGuest, logout: guestLogout } = useGuestAuth();
  
  // Always call hooks - React requirement
  const authenticatedTodos = useTodos();
  const guestTodos = useGuestTodos();
  
  // Use appropriate hook data based on authentication state
  const { todos, handleSort, getSortIcon, createTodo, updateTodo, deleteTodo } = 
    isGuest ? guestTodos : authenticatedTodos;
  const [showForm, setShowForm] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>('all');

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

  // Filter todos based on active filter
  const filteredTodos = todos.filter(todo => {
    if (activeFilter === 'all') return true;
    return todo.type.toLowerCase() === activeFilter;
  });

  // Get display name based on authentication state
  const displayName = isGuest 
    ? "Guest User" 
    : (authUser?.signInDetails?.loginId || "User");

  // Handle logout for both guest and authenticated users
  const handleLogout = () => {
    if (isGuest) {
      guestLogout();
    } else if (signOut) {
      signOut();
    }
  };

  return (
    <main className="app-container">
      <div className="app-header">
        <div className="header-left">
          <h1 className="app-title">{displayName}'s entries</h1>
          {isGuest && (
            <div className="guest-badge">
              <span>Guest Mode</span>
              <span className="guest-info">Data stored temporarily</span>
            </div>
          )}
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="add-entry-button"
        >
          {showForm ? 'Cancel' : '+ Add New Entry'}
        </button>
      </div>
      
      <div className="filter-controls">
        <div className="filter-buttons">
          <button 
            className={`filter-button ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            All ({todos.length})
          </button>
          <button 
            className={`filter-button ${activeFilter === 'written' ? 'active' : ''}`}
            onClick={() => setActiveFilter('written')}
          >
            Written ({todos.filter(t => t.type.toLowerCase() === 'written').length})
          </button>
          <button 
            className={`filter-button ${activeFilter === 'illustrated' ? 'active' : ''}`}
            onClick={() => setActiveFilter('illustrated')}
          >
            Illustrated ({todos.filter(t => t.type.toLowerCase() === 'illustrated').length})
          </button>
          <button 
            className={`filter-button ${activeFilter === 'video' ? 'active' : ''}`}
            onClick={() => setActiveFilter('video')}
          >
            Video ({todos.filter(t => t.type.toLowerCase() === 'video').length})
          </button>
        </div>
      </div>
      
      {showForm && (
        <EntryForm 
          onSubmit={handleCreateTodo}
          onCancel={() => setShowForm(false)}
        />
      )}

      <Table 
        todos={filteredTodos}
        onSort={handleSort}
        getSortIcon={getSortIcon}
        onUpdate={handleUpdateTodo}
        onDelete={handleDeleteTodo}
      />
      
      <button onClick={handleLogout} className="sign-out-button">
        {isGuest ? 'Exit Guest Mode' : 'Sign out'}
      </button>
    </main>
  );
}

export default App;