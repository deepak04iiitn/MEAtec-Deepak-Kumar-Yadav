import { CheckCircle2, Circle, Edit2, Trash2, Calendar, MoreVertical } from 'lucide-react';
import { format } from 'date-fns';
import { useState } from 'react';

export default function TaskCard({ task, onEdit, onDelete, viewMode = 'grid' }) {

  const [showMenu, setShowMenu] = useState(false);
  const isCompleted = task.status === 'completed';

  if(viewMode === 'list') {
    return (
      <div className={`group bg-white/80 backdrop-blur-sm rounded-xl p-4 border-2 transition-all duration-300 hover:shadow-md ${
        isCompleted ? 'border-emerald-200 bg-emerald-50/50' : 'border-gray-200 hover:border-indigo-200'
      }`}>
        <div className="flex items-center gap-4">
          <button
            onClick={() => onEdit(task)}
            className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
              isCompleted 
                ? 'bg-emerald-100 text-emerald-600' 
                : 'bg-gray-100 text-gray-400 group-hover:bg-indigo-100 group-hover:text-indigo-600'
            }`}
          >
            {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
          </button>
          
          <div className="flex-1 min-w-0">
            <h3 className={`font-semibold text-gray-900 ${isCompleted ? 'line-through text-gray-500' : ''}`}>
              {task.title}
            </h3>
            {task.description && (
              <p className="text-sm text-gray-600 truncate">{task.description}</p>
            )}
          </div>

          {task.dueDate && (
            <div className="flex items-center gap-1.5 text-sm text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg">
              <Calendar className="w-4 h-4" />
              {format(new Date(task.dueDate), 'MMM dd')}
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(task)}
              className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all cursor-pointer"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className={`group bg-white/80 backdrop-blur-sm rounded-2xl p-6 border-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
      isCompleted ? 'border-emerald-200 bg-emerald-50/30' : 'border-gray-200 hover:border-indigo-200'
    }`}>

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <button
          onClick={() => onEdit(task)}
          className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
            isCompleted 
              ? 'bg-emerald-100 text-emerald-600' 
              : 'bg-gray-100 text-gray-400 group-hover:bg-indigo-100 group-hover:text-indigo-600'
          }`}
        >
          {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
        </button>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all cursor-pointer"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-xl border border-gray-200 py-1 z-10">
              <button
                onClick={() => {
                  onEdit(task);
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-indigo-50 flex items-center gap-2 cursor-pointer"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={() => {
                  onDelete(task.id);
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          )}
        </div>
        
      </div>

      {/* Content */}
      <div className="mb-4">
        <h3 className={`text-lg font-bold text-gray-900 mb-2 ${isCompleted ? 'line-through text-gray-500' : ''}`}>
          {task.title}
        </h3>
        {task.description && (
          <p className={`text-sm text-gray-600 line-clamp-2 ${isCompleted ? 'text-gray-400' : ''}`}>
            {task.description}
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        {task.dueDate ? (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            {format(new Date(task.dueDate), 'MMM dd, yyyy')}
          </div>
        ) : (
          <div className="text-sm text-gray-400">No due date</div>
        )}

        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          isCompleted 
            ? 'bg-emerald-100 text-emerald-700' 
            : 'bg-amber-100 text-amber-700'
        }`}>
          {isCompleted ? 'Completed' : 'Pending'}
        </span>
      </div>
    </div>
  );
}
