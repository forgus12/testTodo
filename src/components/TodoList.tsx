import React, { useState, useEffect } from "react";
import CheckBox from "@react-native-community/checkbox";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  addTask,
  toggleTask,
  deleteTask,
  setFilter,
  editTask,
} from "../actions/todoActions";
import { Task, Filter } from "../types";
import {
  loadTasksFromStorage,
  saveTaskToStorage,
  deleteTaskFromStorage,
} from "../helpers/asyncStorageUtils";

const TodoList: React.FC = () => {
  const [taskText, setTaskText] = useState("");
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [editText, setEditText] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const dispatch = useDispatch();
  const { filter, tasks } = useSelector((state: any) => state.todo);

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    handleToggleCheckBoxChange();
  }, [toggleCheckBox]);

  const loadTasks = async () => {
    const savedTasks = await loadTasksFromStorage();
    savedTasks.forEach((task) => {
      dispatch(addTask(task));
    });
  };

  const handleToggleCheckBoxChange = () => {
    if (toggleCheckBox) {
      handleFilterChange("uncompleted");
    } else {
      handleFilterChange("all");
    }
  };

  const handleAddTask = async () => {
    if (taskText.trim() !== "") {
      const newTask = {
        id: Math.random().toString(),
        text: taskText,
        completed: false,
      };
      dispatch(addTask(newTask));
      setTaskText("");
      saveUpdatedTasks([...tasks, newTask]);
    }
  };

  const handleToggleTask = async (id: string) => {
    dispatch(toggleTask(id));
    saveUpdatedTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleDeleteTask = async (id: string) => {
    dispatch(deleteTask(id));
    deleteTaskFromStorage(id);
  };

  const handleFilterChange = (filter: Filter) => {
    dispatch(setFilter(filter));
  };

  const handleEditTask = async () => {
    if (editText.trim() !== "") {
      const updatedTasks = tasks.map((task) => {
        if (task.id === editId) {
          return {
            ...task,
            text: editText,
            completed: task.completed,
          };
        }
        return task;
      });

      saveUpdatedTasks(updatedTasks);
      dispatch(
        editTask({
          id: editId!,
          text: editText,
          completed: tasks.find((task) => task.id === editId)!.completed,
        })
      );
      setEditId(null);
      setEditText("");
    }
  };

  const saveUpdatedTasks = async (updatedTasks: Task[]) => {
    saveTaskToStorage(updatedTasks);
  };

  const renderTaskItem = ({ item }: { item: Task }) => (
    <TouchableOpacity
      onPress={() => handleToggleTask(item.id)}
      onLongPress={() => handleDeleteTask(item.id)}
    >
      <View style={styles.taskContainer}>
        {editId === item.id ? (
          <TextInput
            style={[
              styles.taskText,
              { textDecorationLine: item.completed ? "line-through" : "none" },
            ]}
            value={editText}
            onChangeText={setEditText}
            autoFocus={true}
            onBlur={handleEditTask}
            multiline={false}
            onSubmitEditing={handleEditTask}
          />
        ) : (
          <Text
            style={[
              styles.taskText,
              { textDecorationLine: item.completed ? "line-through" : "none" },
            ]}
          >
            {item.text}
          </Text>
        )}
        <TouchableOpacity
          onPress={() => {
            setEditId(item.id);
            setEditText(item.text);
          }}
          style={styles.buttonEdit}
        >
          <Text style={styles.buttonText}>Изменить</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const filteredTasks = tasks.filter((task) => {
    if (filter === "uncompleted") {
      return !task.completed;
    } else if (filter === "all") {
      return task;
    }
    return true;
  });

  return (
    <View style={styles.container}>
      <View>
        <TextInput
          style={styles.input}
          value={taskText}
          onChangeText={setTaskText}
        />
        <TouchableOpacity onPress={handleAddTask} style={styles.button}>
          <Text style={styles.buttonText}>Добавить задачу</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.checkBox}>
        <CheckBox
          disabled={false}
          value={toggleCheckBox}
          onValueChange={setToggleCheckBox}
        />
        <Text style={{ fontSize: 18, color: "black" }}>
          Невыполненные задачи
        </Text>
      </View>

      <FlatList
        data={filteredTasks}
        renderItem={renderTaskItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default TodoList;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  input: { borderWidth: 1, borderColor: "black", padding: 10 },
  taskContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "grey",
    paddingVertical: 5,
    justifyContent: "space-between",
    alignItems: "center",
  },
  checkBox: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 20,
    color: "black",
  },
  taskText: {
    textDecorationLine: "none",
    marginLeft: 10,
    fontSize: 16,
    color: "black",
    fontWeight: "bold",
    height: 40,
    textAlignVertical: "center",
  },
  button: {
    backgroundColor: "black",
    borderRadius: 5,
    padding: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  buttonEdit: {
    backgroundColor: "grey",
    borderRadius: 5,
    padding: 5,
  },
});
