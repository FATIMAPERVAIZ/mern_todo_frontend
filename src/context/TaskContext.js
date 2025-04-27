
import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkAuth = useCallback(() => {
    return !!localStorage.getItem('token');
  }, []);

  const getAuthConfig = useCallback(() => {
    if (!checkAuth()) {
      throw new Error('No authentication token found');
    }
    return {
      headers: {
        'token': localStorage.getItem('token'),
        'Content-Type': 'application/json'
      }
    };
  }, [checkAuth]);

  const handleAuthError = useCallback((err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
    }
    return err;
  }, []);

  const fetchTasks = useCallback(async () => {
    try {
      const config = getAuthConfig();
      const res = await axios.get('http://localhost:8080/api/tasks', config);
      setTasks(res.data.data);
      setLoading(false);
    } catch (err) {
      handleAuthError(err);
      setError(err.response?.data?.message || 'Error fetching tasks');
      setLoading(false);
    }
  }, [getAuthConfig, handleAuthError]);

  const createTask = useCallback(async (taskData) => {
    try {
      const config = getAuthConfig();
      const res = await axios.post('http://localhost:8080/api/tasks', taskData, config);
      setTasks(prev => [...prev, res.data.data]);
      return { success: true };
    } catch (err) {
      handleAuthError(err);
      return { 
        success: false, 
        error: err.response?.data?.message || 'Error creating task' 
      };
    }
  }, [getAuthConfig, handleAuthError]);

  const updateTask = useCallback(async (id, taskData) => {
    try {
      const config = getAuthConfig();
      const res = await axios.put(`http://localhost:8080/api/tasks/${id}`, taskData, config);
      setTasks(prev => prev.map(task => task._id === id ? res.data.data : task));
      return { success: true };
    } catch (err) {
      handleAuthError(err);
      return { 
        success: false, 
        error: err.response?.data?.message || 'Error updating task' 
      };
    }
  }, [getAuthConfig, handleAuthError]);

  const deleteTask = useCallback(async (id) => {
    try {
      const config = getAuthConfig();
      await axios.delete(`http://localhost:8080/api/tasks/${id}`, config);
      setTasks(prev => prev.filter(task => task._id !== id));
      return { success: true };
    } catch (err) {
      handleAuthError(err);
      return { 
        success: false, 
        error: err.response?.data?.message || 'Error deleting task' 
      };
    }
  }, [getAuthConfig, handleAuthError]);

  const moveTask = useCallback(async (id, status) => {
    try {
      const config = getAuthConfig();
      const res = await axios.put(`http://localhost:8080/api/tasks/${id}/move`, { status }, config);
      setTasks(prev => prev.map(task => task._id === id ? res.data.data : task));
      return { success: true };
    } catch (err) {
      handleAuthError(err);
      return { 
        success: false, 
        error: err.response?.data?.message || 'Error moving task' 
      };
    }
  }, [getAuthConfig, handleAuthError]);

  useEffect(() => {
    if (checkAuth()) {
      fetchTasks();
    }
  }, [checkAuth, fetchTasks]);

  return (
    <TaskContext.Provider value={{
      tasks,
      loading,
      error,
      checkAuth,
      fetchTasks,
      createTask,
      updateTask,
      deleteTask,
      moveTask
    }}>
      {children}
    </TaskContext.Provider>
  );
};

export default TaskContext;