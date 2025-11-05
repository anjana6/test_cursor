import React from 'react';
import { CheckCircle, Clock, AlertCircle, BarChart3, TrendingUp } from 'lucide-react';
import { useTasks } from '../hooks/useTasks';
import { TaskStatus } from '../types';

const DashboardPage: React.FC = () => {
  const { tasks, stats, isLoading, error } = useTasks();

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">Error: {error}</div>
        <button 
          onClick={() => window.location.reload()} 
          className="btn btn-primary"
        >
          Retry
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  const completionRate = stats?.total ? Math.round((stats.done / stats.total) * 100) : 0;
  const inProgressRate = stats?.total ? Math.round((stats.inProgress / stats.total) * 100) : 0;

  const recentTasks = tasks
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const overdueTasks = tasks.filter(task => {
    if (!task.dueDate || task.status === TaskStatus.DONE) return false;
    return new Date(task.dueDate) < new Date();
  });

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    color, 
    subtitle 
  }: { 
    title: string; 
    value: number; 
    icon: React.ComponentType<{ className?: string }>; 
    color: string; 
    subtitle?: string; 
  }) => (
    <div className="card p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Overview of your task management</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Tasks"
          value={stats?.total || 0}
          icon={BarChart3}
          color="bg-blue-500"
        />
        <StatCard
          title="Completed"
          value={stats?.done || 0}
          icon={CheckCircle}
          color="bg-green-500"
          subtitle={`${completionRate}% completion rate`}
        />
        <StatCard
          title="In Progress"
          value={stats?.inProgress || 0}
          icon={Clock}
          color="bg-yellow-500"
          subtitle={`${inProgressRate}% of total tasks`}
        />
        <StatCard
          title="Overdue"
          value={overdueTasks.length}
          icon={AlertCircle}
          color="bg-red-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Tasks */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Tasks</h2>
          {recentTasks.length > 0 ? (
            <div className="space-y-3">
              {recentTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{task.title}</p>
                    <p className="text-sm text-gray-500">
                      {task.status.replace('_', ' ').toUpperCase()} • {task.priority.toUpperCase()}
                    </p>
                  </div>
                  <div className={`badge ${
                    task.status === TaskStatus.DONE ? 'badge-done' :
                    task.status === TaskStatus.IN_PROGRESS ? 'badge-in-progress' :
                    task.status === TaskStatus.CANCELLED ? 'badge-cancelled' :
                    'badge-todo'
                  }`}>
                    {task.status.replace('_', ' ').toUpperCase()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No tasks yet</p>
          )}
        </div>

        {/* Overdue Tasks */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Overdue Tasks</h2>
          {overdueTasks.length > 0 ? (
            <div className="space-y-3">
              {overdueTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{task.title}</p>
                    <p className="text-sm text-red-600">
                      Due: {new Date(task.dueDate!).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="badge badge-urgent">
                    OVERDUE
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No overdue tasks</p>
          )}
        </div>
      </div>

      {/* Progress Overview */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Progress Overview</h2>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Completion Rate</span>
              <span>{completionRate}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${completionRate}%` }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>In Progress</span>
              <span>{inProgressRate}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${inProgressRate}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
