import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  useColorScheme,
  Dimensions,
  Platform,
  Switch,
  Picker,
} from 'react-native';
import { TaskContext } from './context/TaskContext';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';
import Animated, {
  FadeInDown,
  ZoomIn,
  ZoomOut,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';

const SCREEN_WIDTH = Dimensions.get('window').width;

const PRIORITY_OPTIONS = ['All', 'High', 'Medium', 'Low'];

const TaskItem = ({
  item,
  darkMode,
  editingId,
  setEditingId,
  editedText,
  setEditedText,
  toggleTask,
  deleteTask,
  editTask,
}) => {
  const theme = darkMode ? darkStyles : lightStyles;
  const translateX = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const onGestureEvent = (event) => {
    translateX.value = withTiming(event.nativeEvent.translationX);
  };

  const onGestureEnd = (event) => {
    if (event.nativeEvent.translationX < -SCREEN_WIDTH * 0.3) {
      translateX.value = withTiming(-SCREEN_WIDTH, {}, () => {
        runOnJS(deleteTask)(item.id);
      });
    } else {
      translateX.value = withTiming(0);
    }
  };

  const handleEditToggle = () => {
    if (editingId === item.id) {
      editTask(item.id, editedText);
      setEditingId(null);
      setEditedText('');
    } else {
      setEditingId(item.id);
      setEditedText(item.text);
    }
  };

  return (
    <PanGestureHandler onGestureEvent={onGestureEvent} onEnded={onGestureEnd}>
      <Animated.View
        entering={ZoomIn.delay(100)}
        exiting={ZoomOut}
        style={[theme.taskItem, animatedStyle]}
      >
        <TouchableOpacity onPress={() => toggleTask(item.id)}>
          <Text style={[theme.check, item.completed && theme.checked]}>
            {item.completed ? '✅' : '⬜️'}
          </Text>
        </TouchableOpacity>

        {editingId === item.id ? (
          <TextInput
            style={[theme.input, { flex: 1, marginRight: 10, paddingVertical: 4 }]}
            value={editedText}
            onChangeText={setEditedText}
          />
        ) : (
          <View style={{ flex: 1 }}>
            <Text style={[theme.taskText, item.completed && theme.taskCompleted]}>
              {item.text}
            </Text>
            <Text style={{ fontSize: 12, color: theme.muted }}>
              Priority: {item.priority || 'None'}
            </Text>
          </View>
        )}

        <TouchableOpacity onPress={handleEditToggle}>
          <Text style={theme.edit}>{editingId === item.id ? '✅' : '✏️'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => deleteTask(item.id)}>
          <Text style={theme.delete}>🗑️</Text>
        </TouchableOpacity>
      </Animated.View>
    </PanGestureHandler>
  );
};

const HomeScreen = () => {
  const { tasks, addTask, deleteTask, editTask, toggleTask } = useContext(TaskContext);
  const [newTask, setNewTask] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [filterPriority, setFilterPriority] = useState('All');
  const [editingId, setEditingId] = useState(null);
  const [editedText, setEditedText] = useState('');
  const [darkMode, setDarkMode] = useState(useColorScheme() === 'dark');
  const [searchQuery, setSearchQuery] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const theme = darkMode ? darkStyles : lightStyles;

  const handleAdd = async () => {
    if (newTask.trim()) {
      const taskPriority = priority;
      addTask(newTask, taskPriority); // include priority

      setNewTask('');
      setPriority('Medium');

    {Platform.OS !== 'web' && (
  <DateTimePickerModal
    isVisible={isDatePickerVisible}
    mode="datetime"
    date={dueDate}
    onConfirm={(date) => {
      setDueDate(date);
      setDatePickerVisibility(false);
    }}
    onCancel={() => setDatePickerVisibility(false)}
  />
)}

    }
  };

  const scheduleNotification = async (taskPriority) => {
    const trigger =
      taskPriority === 'High'
        ? new Date(Date.now() + 10 * 60 * 1000) // ⏰ 10 minutes for high
        : dueDate.getTime() > Date.now()
        ? dueDate
        : new Date(Date.now() + 60 * 1000);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: '📌 Task Reminder',
        body: `Reminder: ${newTask}`,
      },
      trigger,
    });
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.text.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority =
      filterPriority === 'All' || task.priority === filterPriority;
    return matchesSearch && matchesPriority;
  });

  return (
    <View style={theme.container}>
      <View style={theme.header}>
        <Text style={theme.title}>📝 Your Tasks</Text>
        <Switch
          value={darkMode}
          onValueChange={setDarkMode}
          thumbColor={darkMode ? '#4CAF50' : '#888'}
        />
      </View>

      <TextInput
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search tasks"
        placeholderTextColor={darkMode ? '#aaa' : '#666'}
        style={[theme.input, { marginBottom: 10, paddingVertical: 4 }]}
      />

      <View style={theme.inputContainer}>
        <TextInput
          value={newTask}
          onChangeText={setNewTask}
          placeholder="Add new task"
          placeholderTextColor={darkMode ? '#aaa' : '#666'}
          style={theme.input}
        />
    <TouchableOpacity onPress={handleAdd} style={[theme.fab, { marginRight: 5 }]}>
      <Feather name="plus" size={24} color="white" />
    </TouchableOpacity>

        <Picker
          selectedValue={priority}
          style={{ width: 100, color: darkMode ? '#fff' : '#000' }}
          onValueChange={(itemValue) => setPriority(itemValue)}
        >
          <Picker.Item label="High" value="High" />
          <Picker.Item label="Medium" value="Medium" />
          <Picker.Item label="Low" value="Low" />
        </Picker>
      </View>

      <View style={{ flexDirection: 'row', marginBottom: 10 }}>
        <Text style={{ color: theme.taskText.color, marginRight: 10 }}>Filter:</Text>
        <Picker
          selectedValue={filterPriority}
          style={{ flex: 1, color: theme.taskText.color }}
          onValueChange={(value) => setFilterPriority(value)}
        >
          {PRIORITY_OPTIONS.map((p) => (
            <Picker.Item key={p} label={p} value={p} />
          ))}
        </Picker>
      </View>

      <View style={{ flexDirection: 'row', gap: 10, marginBottom: 10 }}>
     
         
        

       
      </View>

      {Platform.OS === 'web' && showPicker && (
        <DateTimePicker
          value={dueDate}
          mode="datetime"
          display="default"
          onChange={(event, selectedDate) => {
            setShowPicker(false);
            if (selectedDate) {
              setDueDate(new Date(selectedDate));
            }
          }}
        />
      )}

      {!Platform.OS === 'web' && (
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="datetime"
          date={dueDate}
          onConfirm={(date) => {
            setDueDate(date);
            setDatePickerVisibility(false);
          }}
          onCancel={() => setDatePickerVisibility(false)}
        />
      )}

      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskItem
            item={item}
            darkMode={darkMode}
            editingId={editingId}
            setEditingId={setEditingId}
            editedText={editedText}
            setEditedText={setEditedText}
            toggleTask={toggleTask}
            deleteTask={deleteTask}
            editTask={editTask}
          />
        )}
        ListEmptyComponent={<Text style={theme.empty}>No tasks yet. Add one 👆</Text>}
        contentContainerStyle={{ paddingBottom: 50 }}
      />
    </View>
  );
};

export default HomeScreen;

// You can keep lightStyles / darkStyles and baseStyles as is, or slightly adjust if needed.

const baseStyles = {
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  fab: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
  },
  check: {
    fontSize: 18,
    marginRight: 10,
  },
  checked: {
    color: '#4CAF50',
  },
  taskText: {
    flex: 1,
    fontSize: 16,
  },
  taskCompleted: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  edit: {
    fontSize: 18,
    marginHorizontal: 8,
  },
  delete: {
    fontSize: 18,
    color: '#ff5252',
  },
  empty: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
};

const lightStyles = StyleSheet.create({
  ...baseStyles,
  container: { ...baseStyles.container, backgroundColor: '#fff' },
  input: { ...baseStyles.input, borderColor: '#ccc', color: '#000' },
  taskItem: { ...baseStyles.taskItem, backgroundColor: '#f1f1f1' },
  taskText: { ...baseStyles.taskText, color: '#000' },
  empty: { ...baseStyles.empty, color: '#888' },
});

const darkStyles = StyleSheet.create({
  ...baseStyles,
  container: { ...baseStyles.container, backgroundColor: '#9fdc69ff' },
  input: { ...baseStyles.input, borderColor: 'green', color: '#000' },
  taskItem: { ...baseStyles.taskItem, backgroundColor: '#f1f1f1' },
  taskText: { ...baseStyles.taskText, color: '#000' },
  empty: { ...baseStyles.empty, color: '#888' },
});
