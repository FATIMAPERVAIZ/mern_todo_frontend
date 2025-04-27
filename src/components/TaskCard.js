import React, { useContext, useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Box,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import TaskContext from '../context/TaskContext';
import AddTaskModal from './AddTaskModal';

const TaskCard = ({ task, index }) => {
  const { deleteTask, moveTask } = useContext(TaskContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    setEditModalOpen(true);
    handleMenuClose();
  };

  const handleDelete = async () => {
    await deleteTask(task._id);
    handleMenuClose();
  };

  const handleMove = async (status) => {
    await moveTask(task._id, status);
    handleMenuClose();
  };

  return (
    <>
      <Draggable draggableId={task._id} index={index}>
        {(provided) => (
          <Card
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            sx={{ mb: 2 }}
          >
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography variant="h6">{task.title}</Typography>
                <IconButton onClick={handleMenuOpen} size="small">
                  <MoreVertIcon />
                </IconButton>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {task.description}
              </Typography>
              {/* <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                Assigned to: {task.assignedTo?.username || 'Unassigned'}
              </Typography> */}
            </CardContent>
          </Card>
        )}
      </Draggable>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>Edit</MenuItem>
        {task.status !== 'In Progress' && (
          <MenuItem onClick={() => handleMove('In Progress')}>
            Move to In Progress
          </MenuItem>
        )}
        {task.status !== 'Done' && (
          <MenuItem onClick={() => handleMove('Done')}>Move to Done</MenuItem>
        )}
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          Delete
        </MenuItem>
      </Menu>

      <AddTaskModal
        open={editModalOpen}
        handleClose={() => setEditModalOpen(false)}
        task={task}
        isEdit
      />
    </>
  );
};

export default TaskCard;