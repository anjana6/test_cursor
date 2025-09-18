import React from 'react';
import { Task, TaskStatus, TaskPriority } from '../types';
import { Calendar, Edit2, Trash2, CheckCircle, Clock, XCircle } from 'lucide-react';
import { format } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onStatusChange: (id: number, status: TaskStatus) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete, onStatusChange }) => {
  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.DONE:
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case TaskStatus.IN_PROGRESS:
        return <Clock className="h-4 w-4 text-blue-600" />;
      case TaskStatus.CANCELLED:
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadgeClass = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.TODO:
        return 'badge badge-todo';
      case TaskStatus.IN_PROGRESS:
        return 'badge badge-in-progress';
      case TaskStatus.DONE:
        return 'badge badge-done';
      case TaskStatus.CANCELLED:
        return 'badge badge-cancelled';
      default:
        return 'badge badge-todo';
    }
  };

  const getPriorityBadgeClass = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.LOW:
        return 'badge badge-low';
      case TaskPriority.MEDIUM:
        return 'badge badge-medium';
      case TaskPriority.HIGH:
        return 'badge badge-high';
      case TaskPriority.URGENT:
        return 'badge badge-urgent';
      default:
        return 'badge badge-medium';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return 'Invalid date';
    }
  };

  // ISSUE: Missing type annotation for parameter
  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date() && task.status !== TaskStatus.DONE;
  };

  return (
    <div className="card p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{task.title}</h3>
          {task.description && (
            <p className="text-gray-600 text-sm mb-3">{task.description}</p>
          )}
        </div>
        
        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={() => onEdit(task)}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            title="Edit task"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
            title="Delete task"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          {getStatusIcon(task.status)}
          <span className={getStatusBadgeClass(task.status)}>
            {task.status.replace('_', ' ').toUpperCase()}
          </span>
        </div>
        
        <span className={getPriorityBadgeClass(task.priority)}>
          {task.priority.toUpperCase()}
        </span>
      </div>

      {task.dueDate && (
        <div className="flex items-center space-x-2 text-sm">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span className={`text-gray-600 ${isOverdue(task.dueDate) ? 'text-red-600 font-medium' : ''}`}>
            Due: {formatDate(task.dueDate)}
            {/* ISSUE: Potential null reference - task.dueDate could be undefined */}
            {isOverdue(task.dueDate!) && ' (Overdue)'}
          </span>
        </div>
      )}

      <div className="mt-4 flex space-x-2">
        {task.status !== TaskStatus.DONE && (
          <button
            onClick={() => onStatusChange(task.id, TaskStatus.DONE)}
            className="btn btn-sm btn-primary"
          >
            Mark as Done
          </button>
        )}
        
        {task.status === TaskStatus.TODO && (
          <button
            onClick={() => onStatusChange(task.id, TaskStatus.IN_PROGRESS)}
            className="btn btn-sm btn-secondary"
          >
            Start Task
          </button>
        )}
        
        {task.status === TaskStatus.IN_PROGRESS && (
          <button
            onClick={() => onStatusChange(task.id, TaskStatus.TODO)}
            className="btn btn-sm btn-secondary"
          >
            Back to Todo
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
