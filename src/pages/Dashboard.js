import React, { useContext } from 'react';
import { Container, Button, Box } from '@mui/material';
import TaskBoard from '../components/TaskBoard';
import AddTaskModal from '../components/AddTaskModal';
import TaskContext from '../context/TaskContext';

const Dashboard = () => {
  const [modalOpen, setModalOpen] = React.useState(false);
  const { loading, error } = useContext(TaskContext);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 2 }}>
        <Button
          variant="contained"
          onClick={() => setModalOpen(true)}
        >
          Add Task
        </Button>
      </Box>
      <TaskBoard />
      <AddTaskModal
        open={modalOpen}
        handleClose={() => setModalOpen(false)}
      />
    </Container>
  );
};

export default Dashboard;