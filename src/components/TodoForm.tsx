import { useState } from 'react';
import '../styles/TodoForm.css';

/** Props for TodoForm component */
interface TodoFormProps {
  /** Callback function called when form is submitted with valid data */
  onSubmit: (data: { name: string; type: string; url: string; creator: string }) => void;
  /** Callback function called when form is cancelled */
  onCancel: () => void;
}

/**
 * Form component for creating new todo entries
 * 
 * Features:
 * - Input validation for all fields
 * - Dropdown for content type selection
 * - URL format validation
 * - Form reset after submission
 * - Cancel functionality
 * 
 * @param {TodoFormProps} props - Component props
 * @returns {JSX.Element} Todo creation form
 * 
 * @example
 * ```tsx
 * <TodoForm 
 *   onSubmit={(data) => createTodo(data)}
 *   onCancel={() => setShowForm(false)}
 * />
 * ```
 */
export const TodoForm: React.FC<TodoFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({ name: '', type: 'Written', url: '', creator: '' });

  /**
   * Handles form submission with validation
   * @param {React.FormEvent} e - Form submission event
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.type && formData.url && formData.creator) {
      onSubmit(formData);
      setFormData({ name: '', type: 'Written', url: '', creator: '' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <div className="form-group">
        <label className="form-label">Name: </label>
        <input 
          type="text" 
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          className="form-input"
          required
        />
      </div>
      <div className="form-group">
        <label className="form-label">Type: </label>
        <select 
          value={formData.type}
          onChange={(e) => setFormData({...formData, type: e.target.value})}
          className="form-select"
          required
        >
          <option value="Written">Written</option>
          <option value="Illustrated">Illustrated</option>
          <option value="Video">Video</option>
        </select>
      </div>
      <div className="form-group">
        <label className="form-label">URL: </label>
        <input 
          type="url" 
          value={formData.url}
          onChange={(e) => setFormData({...formData, url: e.target.value})}
          className="form-input"
          required
        />
      </div>
      <div className="form-group">
        <label className="form-label">Creator: </label>
        <input 
          type="text" 
          value={formData.creator}
          onChange={(e) => setFormData({...formData, creator: e.target.value})}
          className="form-input"
          required
        />
      </div>
      <button type="submit" className="submit-button">Add Entry</button>
    </form>
  );
};