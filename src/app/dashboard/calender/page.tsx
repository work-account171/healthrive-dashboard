'use client'
import React, { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, Circle, AlertCircle, Calendar as CalendarIcon } from 'lucide-react'

type Task = {
  _id: string;
  title: string;
  patientName: string;
  description: string;
  dueDate: Date;
  services: string[];
  categories: string[];
  assignee: string;
  priority: "high" | "normal";
  updatedAt: Date;
};

function Calendar() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  // async function fetchTasks() {
  //   const res = await fetch(
  //     `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tasks/get-tasks?completed=false`
  //   );
  //   const data = await res.json();
  //   setTasks(data)
  //   setLoading(false);
  // }
  async function fetchTasks() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tasks/get-tasks?completed=false&limit=0`
  );
  const data = await res.json();
  setTasks(data.tasks)
  setLoading(false);
}

  useEffect(() => {
    fetchTasks();
  }, [])

  // Get current month and year
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()

  // Get days in month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()

  // Get first day of month
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()

  // Generate days array
  const days = []
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  // Add empty days for the first week
  const emptyDays = Array(firstDayOfMonth).fill(null)

  // Navigate to previous month
  const prevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1))
  }

  // Navigate to next month
  const nextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1))
  }

  // Get tasks for a specific date
  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => {
      const taskDate = new Date(task.dueDate)
      return taskDate.getDate() === date.getDate() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getFullYear() === date.getFullYear()
    })
  }

  // Format date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  // Month names
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Calendar Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {monthNames[currentMonth]} {currentYear}
        </h2>
        <div className="flex space-x-2">
          <button 
            onClick={prevMonth}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          <button 
            onClick={() => setCurrentDate(new Date())}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
          >
            Today
          </button>
          <button 
            onClick={nextMonth}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
        
        {emptyDays.map((_, index) => (
          <div key={`empty-${index}`} className="h-24 border rounded-lg bg-gray-50"></div>
        ))}
        
        {days.map(day => {
          const date = new Date(currentYear, currentMonth, day)
          const dateTasks = getTasksForDate(date)
          const isToday = new Date().toDateString() === date.toDateString()
          const isSelected = selectedDate && selectedDate.toDateString() === date.toDateString()
          
          return (
            <div 
              key={day} 
              className={`h-24 border rounded-lg p-2 overflow-y-auto cursor-pointer transition-colors ${
                isToday ? 'bg-blue-50 border-blue-200' : 
                isSelected ? 'bg-gray-100 border-gray-300' : 
                'bg-white border-gray-200 hover:bg-gray-50'
              }`}
              onClick={() => setSelectedDate(date)}
            >
              <div className={`flex justify-between items-center mb-1 ${
                isToday ? 'text-blue-600 font-medium' : ''
              }`}>
                <span>{day}</span>
                {dateTasks.length > 0 && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    dateTasks.some(t => t.priority === 'high') 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {dateTasks.length}
                  </span>
                )}
              </div>
              <div className="space-y-1">
                {dateTasks.slice(0, 2).map(task => (
                  <div 
                    key={task._id} 
                    className={`text-xs p-1 rounded truncate ${
                      task.priority === 'high' 
                        ? 'bg-red-50 text-red-800 border-l-2 border-red-500' 
                        : 'bg-blue-50 text-blue-800 border-l-2 border-blue-500'
                    }`}
                    title={task.title}
                  >
                    <div className="flex items-center">
                      {task.priority === 'high' ? (
                        <AlertCircle className="h-3 w-3 mr-1" />
                      ) : (
                        <Circle className="h-3 w-3 mr-1" />
                      )}
                      {task.title}
                    </div>
                  </div>
                ))}
                {dateTasks.length > 2 && (
                  <div className="text-xs text-gray-500">
                    +{dateTasks.length - 2} more
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Selected Date Tasks */}
      {selectedDate && (
        <div className="mt-8 border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <CalendarIcon className="h-5 w-5 mr-2 text-blue-500" />
            Tasks for {formatDate(selectedDate)}
          </h3>
          
          {getTasksForDate(selectedDate).length === 0 ? (
            <p className="text-gray-500 text-center py-4">No tasks for this date</p>
          ) : (
            <div className="space-y-3">
              {getTasksForDate(selectedDate).map(task => (
                <div key={task._id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-gray-800">{task.title}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      task.priority === 'high' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                  <div className="flex items-center mt-3 text-sm text-gray-500">
                    <span>Patient: {task.patientName}</span>
                    <span className="mx-2">•</span>
                    <span>Assignee: {task.assignee}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {task.services.map(service => (
                      <span key={service} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Calendar