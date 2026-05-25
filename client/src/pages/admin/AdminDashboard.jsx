import { useEffect, useState } from 'react';
import Sidebar from '../../components/admin/Sidebar';
import TasksTable from '../../components/admin/TasksTable';
import CreateTaskModal from '../../components/admin/CreateTaskModal';
import EditTaskModal from '../../components/admin/EditTaskModal';
import { fetchAllTasks } from '../../api/tasks';
import '../../styles/admin.css';

const AdminDashboard = () => {
  const [tasks, setTasks] = useState([]);
  // Intentional gap: no loading state — table flashes empty before data arrives
  const [showCreate, setShowCreate] = useState(false);
  const [editTask, setEditTask] = useState(null);

  const loadTasks = async () => {
    try {
      const { data } = await fetchAllTasks();
      setTasks(data);
    } catch (error) {
      alert('Failed to load tasks');
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const stats = {
    total: tasks.length,
    open: tasks.filter((t) => t.status === 'Open').length,
    submitted: tasks.filter((t) => t.status === 'Submitted').length,
    approved: tasks.filter((t) => t.status === 'Approved').length,
  };

  return (
    <div className="admin-layout">
      <Sidebar />

      <main className="admin-main">
        {/* Header */}
        <div className="admin-header">
          <div>
            <h1 className="page-title">Task Management</h1>
            <p className="page-subtitle">Create, assign, and track all tasks across your talent pool.</p>
          </div>
          <button className="btn-primary" onClick={() => setShowCreate(true)}>
            + Create Task
          </button>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-label">Total Tasks</span>
            <span className="stat-value">{stats.total}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Open</span>
            <span className="stat-value" style={{ color: '#6366f1' }}>{stats.open}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Submitted</span>
            <span className="stat-value" style={{ color: '#3b82f6' }}>{stats.submitted}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Approved</span>
            <span className="stat-value" style={{ color: '#10b981' }}>{stats.approved}</span>
          </div>
        </div>

        {/* Tasks Table */}
        <div className="section-card">
          <div className="section-header">
            <h2>All Tasks</h2>
            {/* Intentional gap: no search bar or filter controls */}
            <span className="task-count">{tasks.length} tasks</span>
          </div>
          <TasksTable
            tasks={tasks}
            onEdit={(task) => setEditTask(task)}
            onRefresh={loadTasks}
          />
        </div>
      </main>

      {/* Modals */}
      {showCreate && (
        <CreateTaskModal
          onClose={() => setShowCreate(false)}
          onCreated={() => loadTasks()}
        />
      )}
      {editTask && (
        <EditTaskModal
          task={editTask}
          onClose={() => setEditTask(null)}
          onUpdated={() => { loadTasks(); setEditTask(null); }}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
