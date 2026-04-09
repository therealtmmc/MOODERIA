import React, { useState } from 'react';
import { useStore, RoutineTask } from '@/context/StoreContext';
import { Plus, Check, Calendar as CalendarIcon, Repeat, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function Routine() {
  const { state, dispatch } = useStore();
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'one-time' | 'repetitive'>('repetitive');
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const todayDayOfWeek = new Date().getDay();

  const handleSave = () => {
    if (title.trim()) {
      const newTask: RoutineTask = {
        id: Date.now().toString(),
        title,
        type,
        daysOfWeek: type === 'repetitive' ? selectedDays : [],
        date: type === 'one-time' ? date : undefined,
        time: time || undefined,
        completedDates: []
      };
      dispatch({ type: 'ADD_ROUTINE', payload: newTask });
      setTitle('');
      setIsAdding(false);
      setSelectedDays([]);
      setDate('');
      setTime('');
    }
  };

  const toggleDay = (day: number) => {
    setSelectedDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const todaysTasks = state.routines.filter(r => {
    if (r.type === 'one-time') return r.date === todayStr;
    return r.daysOfWeek.includes(todayDayOfWeek) || r.daysOfWeek.length === 7; // all day
  });

  // Sort by time
  todaysTasks.sort((a, b) => (a.time || '24:00').localeCompare(b.time || '24:00'));

  const pendingTasks = todaysTasks.filter(t => !t.completedDates.includes(todayStr));
  const completedTasks = todaysTasks.filter(t => t.completedDates.includes(todayStr));

  const renderTask = (task: RoutineTask, isCompleted: boolean) => (
    <div key={task.id} className={cn("clay-card p-4 flex items-center gap-4 transition-all", isCompleted && "opacity-60 bg-gray-50")}>
      <button
        onClick={() => dispatch({ type: 'TOGGLE_ROUTINE', payload: { id: task.id, dateStr: todayStr } })}
        className={cn(
          "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors shrink-0",
          isCompleted ? "bg-green-500 border-green-500 text-white" : "border-gray-300 text-transparent"
        )}
      >
        <Check className="w-5 h-5" />
      </button>
      <div className="flex-1 min-w-0">
        <h4 className={cn("font-bold text-lg truncate", isCompleted && "line-through text-gray-500")}>{task.title}</h4>
        <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
          <span className="flex items-center gap-1">
            {task.type === 'repetitive' ? <Repeat className="w-3 h-3" /> : <CalendarIcon className="w-3 h-3" />}
            {task.type === 'repetitive' ? 'Repeating' : 'One-time'}
          </span>
          {task.time && (
            <span className="text-primary bg-primary/10 px-2 py-0.5 rounded-md">{task.time}</span>
          )}
        </div>
      </div>
      <button 
        onClick={() => dispatch({ type: 'DELETE_ROUTINE', payload: task.id })}
        className="p-2 bg-red-50 text-red-500 hover:bg-red-100 rounded-xl transition-colors shrink-0"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Routine</h1>
          <p className="text-gray-500 font-bold">What are we doing today?</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg active:scale-95 transition-transform"
        >
          <Plus className={cn("w-6 h-6 transition-transform", isAdding && "rotate-45")} />
        </button>
      </header>

      {isAdding && (
        <div className="clay-card p-6 space-y-4 animate-in fade-in slide-in-from-top-4">
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Task name..."
            className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-gray-200 focus:border-primary focus:outline-none font-bold"
          />
          
          <div className="flex gap-2 p-1 bg-gray-100 rounded-2xl">
            <button
              onClick={() => setType('repetitive')}
              className={cn("flex-1 py-2 rounded-xl font-bold text-sm transition-colors", type === 'repetitive' ? "bg-white shadow text-primary" : "text-gray-500")}
            >
              Repetitive
            </button>
            <button
              onClick={() => setType('one-time')}
              className={cn("flex-1 py-2 rounded-xl font-bold text-sm transition-colors", type === 'one-time' ? "bg-white shadow text-primary" : "text-gray-500")}
            >
              One-Time
            </button>
          </div>

          {type === 'repetitive' ? (
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-xs font-bold text-gray-500 uppercase">Days of Week</span>
                <button onClick={() => setSelectedDays([0,1,2,3,4,5,6])} className="text-xs font-bold text-primary">All Days</button>
              </div>
              <div className="flex gap-1 justify-between">
                {DAYS.map((day, i) => (
                  <button
                    key={day}
                    onClick={() => toggleDay(i)}
                    className={cn(
                      "w-10 h-10 rounded-full font-bold text-xs flex items-center justify-center transition-colors",
                      selectedDays.includes(i) ? "bg-primary text-white" : "bg-gray-100 text-gray-500"
                    )}
                  >
                    {day[0]}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Specific Date</label>
              <input 
                type="date" 
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-gray-200 focus:border-primary focus:outline-none font-bold"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Time (Optional)</label>
            <input 
              type="time" 
              value={time}
              onChange={e => setTime(e.target.value)}
              className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-gray-200 focus:border-primary focus:outline-none font-bold"
            />
          </div>

          <button 
            onClick={handleSave}
            disabled={!title.trim() || (type === 'repetitive' && selectedDays.length === 0) || (type === 'one-time' && !date)}
            className="btn-primary w-full disabled:opacity-50"
          >
            Add Task
          </button>
        </div>
      )}

      <div className="space-y-6">
        {todaysTasks.length === 0 ? (
          <div className="text-center py-8 text-gray-400 font-bold">
            <p>No tasks scheduled for today.</p>
          </div>
        ) : (
          <>
            {pendingTasks.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-black text-gray-800">To Do</h2>
                {pendingTasks.map(task => renderTask(task, false))}
              </div>
            )}
            
            {completedTasks.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-black text-gray-800">Completed</h2>
                {completedTasks.map(task => renderTask(task, true))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
