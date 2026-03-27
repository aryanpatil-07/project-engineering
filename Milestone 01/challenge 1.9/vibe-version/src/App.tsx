/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, type FormEvent } from 'react';
import { Plus, Check, Trash2, Circle } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
}

type FilterType = 'all' | 'active' | 'completed';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');

  const addTask = (e?: FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;

    const newTask: Task = {
      id: crypto.randomUUID(),
      title: inputValue.trim(),
      completed: false,
      createdAt: Date.now(),
    };

    setTasks(prev => [newTask, ...prev]);
    setInputValue('');
  };

  const toggleTask = (id: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const filteredTasks = useMemo(() => {
    switch (filter) {
      case 'active':
        return tasks.filter(t => !t.completed);
      case 'completed':
        return tasks.filter(t => t.completed);
      default:
        return tasks;
    }
  }, [tasks, filter]);

  const activeCount = tasks.filter(t => !t.completed).length;

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans p-4 md:p-8">
      <div className="max-w-md mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Tasks</h1>
          <p className="text-zinc-500 text-sm">
            {activeCount} {activeCount === 1 ? 'task' : 'tasks'} remaining
          </p>
        </header>

        <form onSubmit={addTask} className="relative mb-6 group">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Add a new task..."
            className="w-full bg-white border border-zinc-200 rounded-xl py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-zinc-200 transition-all shadow-sm"
          />
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-zinc-900 text-white rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
          >
            <Plus size={20} />
          </button>
        </form>

        <div className="flex gap-1 mb-6 p-1 bg-zinc-100 rounded-lg w-fit">
          {(['all', 'active', 'completed'] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 text-sm font-medium rounded-md capitalize transition-all ${
                filter === f
                  ? 'bg-white text-zinc-900 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-700'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className="group flex items-center gap-3 p-4 bg-white border border-zinc-200 rounded-xl shadow-sm hover:border-zinc-300 transition-all"
              >
                <button
                  onClick={() => toggleTask(task.id)}
                  className={`flex-shrink-0 transition-colors ${
                    task.completed ? 'text-emerald-500' : 'text-zinc-300 hover:text-zinc-400'
                  }`}
                >
                  {task.completed ? <Check size={20} /> : <Circle size={20} />}
                </button>
                
                <span
                  className={`flex-grow text-sm transition-all ${
                    task.completed ? 'text-zinc-400 line-through' : 'text-zinc-700'
                  }`}
                >
                  {task.title}
                </span>

                <button
                  onClick={() => deleteTask(task.id)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  title="Delete task"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-12 border-2 border-dashed border-zinc-200 rounded-2xl">
              <p className="text-zinc-400 text-sm">No tasks found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
