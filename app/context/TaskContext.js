import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const TaskContext = createContext();

const TaskContextProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);

  // Load tasks from AsyncStorage on app load
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const storedTasks = await AsyncStorage.getItem('tasks');
        if (storedTasks) {
          setTasks(JSON.parse(storedTasks));
        }
      } catch (error) {
        console.error('Error loading tasks:', error);
      }
    };
    loadTasks();
  }, []);

  // Save tasks to AsyncStorage whenever they change
  useEffect(() => {
    AsyncStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // ✅ Updated to accept and store priority
  const addTask = (taskText, priority = 'Medium') => {
    if (taskText.trim() !== '') {
      const newTask = {
        id: Date.now().toString(),
        text: taskText,
        completed: false,
        priority,
      };
      setTasks((prev) => [newTask, ...prev]);
    }
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const editTask = (id, newText) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, text: newText } : task
      )
    );
  };

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        deleteTask,
        editTask,
        toggleTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export default TaskContextProvider;
