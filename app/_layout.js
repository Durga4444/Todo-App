import { Slot } from 'expo-router';
import TaskContextProvider from './context/TaskContext'

export default function Layout() {
  return (
    <TaskContextProvider>
      <Slot />
    </TaskContextProvider>
  );
}
