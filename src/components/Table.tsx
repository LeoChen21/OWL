import type { Schema } from "../../amplify/data/resource";
import { useEditTodo } from "../hooks/useEditTodo";
import type { SortField } from "../hooks/useTodos";
import { useState, useEffect } from "react";
import '../styles/Table.css';

/** Props for Table component */
interface TableProps {
  /** Array of todo items to display */
  todos: Array<Schema["Todo"]["type"]>;
  /** Callback function for sorting by field */
  onSort: (field: SortField) => void;
  /** Function to get sort icon for a field */
  getSortIcon: (field: SortField) => string;
  /** Callback function for updating a todo */
  onUpdate: (id: string, data: { name: string; type: string; url: string; creator: string }) => void;
  /** Callback function for deleting a todo */
  onDelete: (id: string) => void;
}

/**
 * Table component for displaying and managing entries
 * 
 * Features:
 * - Sortable columns with visual indicators
 * - Inline editing for all fields
 * - Delete functionality
 * - Responsive design
 * - URL links that open in new tabs
 * - Type dropdown for editing
 * 
 * @param {TodoTableProps} props - Component props
 * @returns {JSX.Element} Todo table with inline editing
 * 
 * @example
 * ```tsx
 * <TodoTable 
 *   todos={todos}
 *   onSort={handleSort}
 *   getSortIcon={getSortIcon}
 *   onUpdate={handleUpdate}
 *   onDelete={handleDelete}
 * />
 * ```
 */
export const Table: React.FC<TableProps> = ({ 
  todos, 
  onSort, 
  getSortIcon, 
  onUpdate, 
  onDelete 
}) => {
  const { editingId, editData, startEditing, cancelEditing, updateEditData } = useEditTodo();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openMenuId && !(event.target as Element).closest('.menu-container')) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [openMenuId]);

  /**
   * Handles updating a todo item after inline editing
   * Validates all fields before calling onUpdate callback
   */
  const handleUpdate = () => {
    if (editingId && editData.name && editData.type && editData.url && editData.creator) {
      onUpdate(editingId, editData);
      cancelEditing();
    }
  };

  return (
    <div className="table-wrapper">
      <table className="todo-table">
      <thead className="table-header">
        <tr>
          <th 
            className="table-header-cell"
            onClick={() => onSort('name')}
          >
            Name{getSortIcon('name')}
          </th>
          <th 
            className="table-header-cell"
            onClick={() => onSort('type')}
          >
            Type{getSortIcon('type')}
          </th>
          <th 
            className="table-header-cell"
            onClick={() => onSort('url')}
          >
            URL{getSortIcon('url')}
          </th>
          <th 
            className="table-header-cell"
            onClick={() => onSort('creator')}
          >
            Creator{getSortIcon('creator')}
          </th>
          <th className="table-header-cell menu-column"></th>
        </tr>
      </thead>
      <tbody>
        {todos.map(todo => (
          <tr key={todo.id} className="table-row">
            <td className="table-cell">
              {editingId === todo.id ? (
                <input 
                  type="text" 
                  value={editData.name}
                  onChange={(e) => updateEditData('name', e.target.value)}
                  className="table-input"
                />
              ) : (
                todo.name
              )}
            </td>
            <td className="table-cell">
              {editingId === todo.id ? (
                <select 
                  value={editData.type}
                  onChange={(e) => updateEditData('type', e.target.value)}
                  className="table-select"
                >
                  <option value="Written">Written</option>
                  <option value="Illustrated">Illustrated</option>
                  <option value="Video">Video</option>
                </select>
              ) : (
                todo.type
              )}
            </td>
            <td className="table-cell">
              {editingId === todo.id ? (
                <input 
                  type="url" 
                  value={editData.url}
                  onChange={(e) => updateEditData('url', e.target.value)}
                  className="table-input"
                />
              ) : (
                <a href={todo.url ?? undefined} target="_blank" rel="noopener noreferrer" className="table-link">
                  {todo.url}
                </a>
              )}
            </td>
            <td className="table-cell">
              {editingId === todo.id ? (
                <input 
                  type="text" 
                  value={editData.creator}
                  onChange={(e) => updateEditData('creator', e.target.value)}
                  className="table-input"
                />
              ) : (
                todo.creator
              )}
            </td>
            <td className="table-cell menu-cell">
              {editingId === todo.id ? (
                <div className="action-buttons">
                  <button onClick={handleUpdate} className="save-button">Save</button>
                  <button onClick={cancelEditing} className="cancel-button">Cancel</button>
                </div>
              ) : (
                <div className="menu-container">
                  <button 
                    className="menu-trigger"
                    onClick={() => setOpenMenuId(openMenuId === todo.id ? null : todo.id)}
                    aria-label="Menu"
                  >
                    <span className="menu-dots">⋮</span>
                  </button>
                  {openMenuId === todo.id && (
                    <div className="menu-dropdown">
                      <button 
                        className="menu-item"
                        onClick={() => {
                          startEditing(todo);
                          setOpenMenuId(null);
                        }}
                      >
                        Edit
                      </button>
                      <button 
                        className="menu-item delete-item"
                        onClick={() => {
                          onDelete(todo.id);
                          setOpenMenuId(null);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  );
};