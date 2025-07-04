import { useState } from "react";
import type { Schema } from "../../amplify/data/resource";

/**
 * Custom hook for managing inline todo editing state
 * 
 * @returns {Object} Edit management utilities
 * @returns {string | null} editingId - ID of currently editing todo
 * @returns {Object} editData - Current edit form data
 * @returns {Function} startEditing - Function to start editing a todo
 * @returns {Function} cancelEditing - Function to cancel editing
 * @returns {Function} updateEditData - Function to update edit form data
 * @returns {Function} setEditingId - Function to set editing ID
 * @returns {Function} setEditData - Function to set edit data
 * 
 * @example
 * ```typescript
 * const { editingId, editData, startEditing, cancelEditing } = useEditTodo();
 * 
 * // Start editing a todo
 * startEditing(todoItem);
 * 
 * // Update a field
 * updateEditData('name', 'New Name');
 * 
 * // Cancel editing
 * cancelEditing();
 * ```
 */
export const useEditTodo = () => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState({ name: '', type: 'Written', url: '', creator: '' });

  /**
   * Starts editing a todo item by setting edit state
   * @param {Schema["Todo"]["type"]} todo - Todo item to edit
   */
  const startEditing = (todo: Schema["Todo"]["type"]) => {
    setEditingId(todo.id);
    setEditData({ 
      name: todo.name || '', 
      type: todo.type || 'Written', 
      url: todo.url || '',
      creator: todo.creator || ''
    });
  };

  /**
   * Cancels editing and resets edit state
   */
  const cancelEditing = () => {
    setEditingId(null);
    setEditData({ name: '', type: 'Written', url: '', creator: '' });
  };

  /**
   * Updates a specific field in the edit data
   * @param {string} field - Field name to update
   * @param {string} value - New value for the field
   */
  const updateEditData = (field: string, value: string) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  return {
    editingId,
    editData,
    startEditing,
    cancelEditing,
    updateEditData,
    setEditingId,
    setEditData,
  };
};