import { useEffect, useState } from "react";
import { useGuestAuth } from "../contexts/GuestAuthContext";

export interface GuestTodo {
  id: string;
  name: string;
  type: string;
  url: string;
  creator: string;
  createdAt: string;
  updatedAt: string;
}

export type SortField = 'name' | 'type' | 'url' | 'creator';
export type SortDirection = 'asc' | 'desc';

export const useGuestTodos = () => {
  const { user, isGuest } = useGuestAuth();
  const [todos, setTodos] = useState<GuestTodo[]>([]);
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Load todos from localStorage on mount
  useEffect(() => {
    if (isGuest && user) {
      const savedTodos = localStorage.getItem('guestTodos');
      if (savedTodos) {
        try {
          const parsedTodos = JSON.parse(savedTodos);
          setTodos(parsedTodos);
        } catch (error) {
          console.error('Error parsing guest todos:', error);
          setTodos([]);
        }
      }
    }
  }, [isGuest, user]);

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    if (isGuest && user) {
      localStorage.setItem('guestTodos', JSON.stringify(todos));
    }
  }, [todos, isGuest, user]);

  // Generate unique ID for guest todos
  const generateId = () => {
    return `todo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedTodos = [...todos].sort((a, b) => {
    const aValue = a[sortField] || '';
    const bValue = b[sortField] || '';
    
    if (sortDirection === 'asc') {
      return aValue.localeCompare(bValue);
    } else {
      return bValue.localeCompare(aValue);
    }
  });

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return ' ↕️';
    return sortDirection === 'asc' ? ' ↑' : ' ↓';
  };

  const createTodo = async (todoData: { name: string; type: string; url: string; creator: string }) => {
    const newTodo: GuestTodo = {
      id: generateId(),
      ...todoData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setTodos(prevTodos => [...prevTodos, newTodo]);
    return newTodo;
  };

  const updateTodo = async (id: string, todoData: { name: string; type: string; url: string; creator: string }) => {
    setTodos(prevTodos => 
      prevTodos.map(todo => 
        todo.id === id 
          ? { ...todo, ...todoData, updatedAt: new Date().toISOString() }
          : todo
      )
    );
  };

  const deleteTodo = async (id: string) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  };

  return {
    todos: sortedTodos,
    sortField,
    sortDirection,
    handleSort,
    getSortIcon,
    createTodo,
    updateTodo,
    deleteTodo,
  };
};