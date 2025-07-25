APK : https://expo.dev/accounts/durgabhuvana/projects/todo-task-manager/builds/49696cf6-0e51-4d0c-b4cc-0118dbdefe05

# Todo Task Manager (React Native + Firebase + Google Auth)

A modern, feature-rich Todo List App built with React Native, Expo, Firebase, and Google Authentication.

## ✨ Features
- Google Sign In & Logout
- Firebase Firestore-based task syncing
- Priority-based task sorting and filtering
- Due date with date picker
- Notifications for high-priority tasks
- Dark/Light mode support
- Beautiful, animated UI

## 🛠 Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/your-username/todo-task-manager.git
cd todo-task-manager


ARCHITECTURE DIAGRAM

+-------------------------------+
|         App Entry Point       |
|  (App.js or Root Navigator)   |
+---------------+---------------+
                |
                v
+---------------+---------------+
|           HomeScreen.js       |
|  - Handles UI & Task Actions  |
+---+-------------------------+-+
    |                         |
    v                         v
[TaskContext]           [useState Hooks]
(Context Provider)      (newTask, darkMode, etc.)
    |
    v
+--------------------------+
|     Task State Logic     |
| (addTask, deleteTask,    |
|  toggleTask, editTask)   |
+--------------------------+
                |
                v
+----------------------------------------+
|             TaskItem Component         |
| - Renders each task                    |
| - Handles Swipe-to-Delete, Edit, etc.  |
+----------------------------------------+
                |
                v
+----------------------------------------+
|         Gesture & Animation Layer      |
| - react-native-reanimated              |
| - react-native-gesture-handler         |
+----------------------------------------+

+----------------------------------------+
|          UI Enhancements Layer         |
| - Dark/Light Mode via useColorScheme   |
| - DateTimePicker for Due Date          |
| - Priority Filtering via Picker        |
| - Search bar filtering                 |
+----------------------------------------+

+----------------------------------------+
|       Notification Scheduler           |
| - Uses expo-notifications              |
| - Based on priority/due date           |
+----------------------------------------+
   
