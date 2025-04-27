import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { Box, Paper, Typography } from '@mui/material';
import TaskCard from './TaskCard';

const TaskColumn = ({ id, title, tasks, color }) => {
  return (
    <Paper
      elevation={3}
      sx={{
        minWidth: 300,
        p: 2,
        backgroundColor: color,
        borderRadius: 2,
      }}
    >
      <Typography variant="h6" align="center" gutterBottom>
        {title} ({tasks.length})
      </Typography>
      <Droppable droppableId={id}>
        {(provided) => (
          <Box
            ref={provided.innerRef}
            {...provided.droppableProps}
            sx={{ minHeight: 100 }}
          >
            {tasks.map((task, index) => (
              <TaskCard key={task._id} task={task} index={index} />
            ))}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>
    </Paper>
  );
};

export default TaskColumn;