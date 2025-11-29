import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, removeTask } from '../redux/task/taskSlice';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import { Plus, CheckCircle2, Clock, ListTodo, Loader2, LayoutGrid, List } from 'lucide-react';

export default function Dashboard() {

  const dispatch = useDispatch();
  const { tasks, loading } = useSelector((state) => state.task);
  const { currentUser } = useSelector((state) => state.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [filter, setFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // grid or list

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const handleCreateTask = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleDeleteTask = (taskId) => {
    const task = tasks.find((t) => t.id === taskId);
    setTaskToDelete({ id: taskId, title: task?.title });
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if(taskToDelete) {
      dispatch(removeTask(taskToDelete.id));
      setIsDeleteModalOpen(false);
      setTaskToDelete(null);
    }
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setTaskToDelete(null);
  };

  const filteredTasks = filter === 'all' ? tasks : tasks.filter((task) => task.status === filter);
  const pendingCount = tasks.filter((task) => task.status === 'pending').length;
  const completedCount = tasks.filter((task) => task.status === 'completed').length;

  const filterButtons = [
    { value: 'all', label: 'All Tasks', icon: ListTodo, count: tasks.length },
    { value: 'pending', label: 'Pending', icon: Clock, count: pendingCount },
    { value: 'completed', label: 'Completed', icon: CheckCircle2, count: completedCount }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Welcome back, <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{currentUser?.username}</span>
              </h1>
              <p className="text-gray-600">Here's what you need to do today</p>
            </div>
            <button
              onClick={handleCreateTask}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-all duration-300 flex items-center gap-2 hover:-translate-y-0.5 cursor-pointer"
            >
              <Plus className="w-5 h-5" />
              New Task
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[
              { label: 'Total Tasks', value: tasks.length, icon: ListTodo, gradient: 'from-blue-500 to-cyan-500', bg: 'bg-blue-50' },
              { label: 'In Progress', value: pendingCount, icon: Clock, gradient: 'from-amber-500 to-orange-500', bg: 'bg-amber-50' },
              { label: 'Completed', value: completedCount, icon: CheckCircle2, gradient: 'from-emerald-500 to-teal-500', bg: 'bg-emerald-50' }
            ].map((stat, idx) => (
              <div key={idx} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`w-14 h-14 ${stat.bg} rounded-xl flex items-center justify-center`}>
                    <stat.icon className={`w-7 h-7 bg-gradient-to-br ${stat.gradient} bg-clip-text text-transparent`} style={{ WebkitTextFillColor: 'transparent', WebkitBackgroundClip: 'text' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Filters and View Mode */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {filterButtons.map((btn) => (
                <button
                  key={btn.value}
                  onClick={() => setFilter(btn.value)}
                  className={`px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                    filter === btn.value
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30'
                      : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50'
                  }`}
                >
                  <btn.icon className="w-4 h-4" />
                  {btn.label}
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    filter === btn.value ? 'bg-white/20' : 'bg-gray-100'
                  }`}>
                    {btn.count}
                  </span>
                </button>
              ))}
            </div>

            {/* View Mode Toggle */}
            <div className="flex gap-2 bg-white rounded-xl p-1 border border-gray-200">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all cursor-pointer ${viewMode === 'grid' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all cursor-pointer ${viewMode === 'list' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Tasks Grid/List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
            <p className="text-gray-600 font-medium">Loading your tasks...</p>
          </div>
        ) : filteredTasks.length > 0 ? (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-3'}>
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
                viewMode={viewMode}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-12 text-center border-2 border-dashed border-gray-300">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ListTodo className="w-10 h-10 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No {filter !== 'all' && filter} tasks yet</h3>
            <p className="text-gray-600 mb-6">
              {filter === 'all' ? 'Get started by creating your first task!' : `No ${filter} tasks at the moment.`}
            </p>
            {filter === 'all' && (
              <button
                onClick={handleCreateTask}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold inline-flex items-center gap-2 hover:shadow-lg transition-all cursor-pointer"
              >
                <Plus className="w-5 h-5" />
                Create Your First Task
              </button>
            )}
          </div>
        )}
      </div>

      {/* Task Modal */}
      {isModalOpen && (
        <TaskModal
          task={editingTask}
          onClose={handleCloseModal}
          onSuccess={handleCloseModal}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        taskTitle={taskToDelete?.title}
      />
    </div>
  );
}
