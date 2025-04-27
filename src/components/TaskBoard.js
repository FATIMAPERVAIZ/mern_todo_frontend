import React, { useContext } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import { Box, Typography } from '@mui/material';
import TaskColumn from './TaskColumn';
import TaskContext from '../context/TaskContext';

const TaskBoard = () => {
  const { tasks, moveTask } = useContext(TaskContext);

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    let newStatus;
    switch (destination.droppableId) {
      case 'todo-column':
        newStatus = 'To Do';
        break;
      case 'progress-column':
        newStatus = 'In Progress';
        break;
      case 'done-column':
        newStatus = 'Done';
        break;
      default:
        return;
    }

    moveTask(draggableId, newStatus);
  };

  const todoTasks = tasks.filter(task => task.status === 'To Do');
  const progressTasks = tasks.filter(task => task.status === 'In Progress');
  const doneTasks = tasks.filter(task => task.status === 'Done');

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Task Board
      </Typography>
      <DragDropContext onDragEnd={onDragEnd}>
        <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto' }}>
          <TaskColumn
            id="todo-column"
            title="To Do"
            tasks={todoTasks}
            color="#ffebee"
          />
          <TaskColumn
            id="progress-column"
            title="In Progress"
            tasks={progressTasks}
            color="#e3f2fd"
          />
          <TaskColumn
            id="done-column"
            title="Done"
            tasks={doneTasks}
            color="#e8f5e9"
          />
        </Box>
      </DragDropContext>
    </Box>
  );
};

export default TaskBoard;