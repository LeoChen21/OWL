import { useEffect, useState } from "react";
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

/** Valid fields for sorting todos */
export type SortField = 'name' | 'type' | 'url' | 'creator';

/** Sort direction options */
export type SortDirection = 'asc' | 'desc';

/**
 * Custom hook for managing todo data, sorting, and CRUD operations
 * 
 * @returns {Object} Todo management utilities
 * @returns {Array<Schema["Todo"]["type"]>} todos - Sorted array of todo items
 * @returns {SortField} sortField - Current sort field
 * @returns {SortDirection} sortDirection - Current sort direction
 * @returns {Function} handleSort - Function to change sorting
 * @returns {Function} getSortIcon - Function to get sort indicator icon
 * @returns {Function} createTodo - Function to create new todo
 * @returns {Function} updateTodo - Function to update existing todo
 * @returns {Function} deleteTodo - Function to delete todo
 * 
 * @example
 * ```typescript
 * const { todos, handleSort, createTodo } = useTodos();
 * 
 * // Create a new todo
 * await createTodo({
 *   name: "React Docs",
 *   type: "Written",
 *   url: "https://react.dev",
 *   creator: "React Team"
 * });
 * 
 * // Sort by name
 * handleSort('name');
 * ```
 */
export const useTodos = () => {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);

  /**
   * Handles sorting by field, toggling direction if same field clicked
   * @param {SortField} field - Field to sort by
   */
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  /** Sorted todos array based on current sort field and direction */
  const sortedTodos = [...todos].sort((a, b) => {
    const aValue = a[sortField] || '';
    const bValue = b[sortField] || '';
    
    if (sortDirection === 'asc') {
      return aValue.localeCompare(bValue);
    } else {
      return bValue.localeCompare(aValue);
    }
  });

  /**
   * Returns appropriate sort icon for table headers
   * @param {SortField} field - Field to get icon for
   * @returns {string} Sort icon (↑, ↓, or ↕️)
   */
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return ' ↕️';
    return sortDirection === 'asc' ? ' ↑' : ' ↓';
  };

  /**
   * Creates a new todo item
   * @param {Object} todoData - Todo data to create
   * @param {string} todoData.name - Todo name/title
   * @param {string} todoData.type - Todo type (Written, Illustrated, Video)
   * @param {string} todoData.url - Todo URL
   * @param {string} todoData.creator - Todo creator name
   * @returns {Promise} Promise resolving to created todo
   */
  const createTodo = (todoData: { name: string; type: string; url: string; creator: string }) => {
    return client.models.Todo.create(todoData);
  };

  /**
   * Updates an existing todo item
   * @param {string} id - Todo ID to update
   * @param {Object} todoData - Updated todo data
   * @param {string} todoData.name - Todo name/title
   * @param {string} todoData.type - Todo type (Written, Illustrated, Video)
   * @param {string} todoData.url - Todo URL
   * @param {string} todoData.creator - Todo creator name
   * @returns {Promise} Promise resolving to updated todo
   */
  const updateTodo = (id: string, todoData: { name: string; type: string; url: string; creator: string }) => {
    return client.models.Todo.update({ id, ...todoData });
  };

  /**
   * Deletes a todo item
   * @param {string} id - Todo ID to delete
   * @returns {Promise} Promise resolving to deleted todo
   */
  const deleteTodo = (id: string) => {
    return client.models.Todo.delete({ id });
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