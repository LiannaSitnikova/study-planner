import { TaskProvider } from './context/TaskContext';
import { Header } from './components/Header';
import { TaskForm } from './components/TaskForm';
import { TaskStats } from './components/TaskStats';
import { TaskFilters } from './components/TaskFilters';
import { TaskList } from './components/TaskList';
import { ToastContainer } from './components/ToastContainer';

export function App() {
  return (
    <TaskProvider>
      <div className="min-h-screen bg-gray-100 py-8 px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6">
          <Header />
          <TaskForm />
          <TaskStats />
          <TaskFilters />
          <TaskList />
        </div>
      </div>
      <ToastContainer />
    </TaskProvider>
  );
}

export default App;