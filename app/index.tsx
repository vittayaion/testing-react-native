import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

interface Todo {
  id: string;
  name: string;
  status: boolean;
}
export default function Index() {
  const [todo, setTodo] = useState<Todo[]>([
    { id: "1", name: "test", status: true },
  ]);
  const [input, setInput] = useState<string>("");

  const addTodoList = () => {
    if (input.trim() === "") return;
    const newInput = {
      id: Date.now().toString(),
      name: input,
      status: false,
    };
    setTodo([...todo, newInput]);
    setInput("");
  };

  const deleteTodoList = (id: string) => {
    setTodo(todo.filter((item) => item.id !== id));
  };

  const handleInput = (text: string) => {
    setInput(text);
  };

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem("KEY");
        if (jsonValue != null) {
          setTodo(JSON.parse(jsonValue));
        }
      } catch (e) {
        console.error("Failed to load todos", e);
      }
    };
    loadTodos();
  }, []);

  useEffect(() => {
    const saveTodos = async () => {
      try {
        await AsyncStorage.setItem("KEY", JSON.stringify(todo));
        console.log(JSON.stringify(todo));
      } catch (e) {
        console.error("Failed to save todos", e);
      }
    };
    saveTodos();
  }, [todo]);

  return (
    <View style={styles.contrainer}>
      <Text style={styles.header}>To-Do List</Text>
      <View style={styles.contrainerAddItem}>
        <TextInput
          style={styles.textInput}
          value={input}
          onChangeText={(text) => handleInput(text)}
        ></TextInput>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText} onPress={addTodoList}>
            Add
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        style={styles.FlatListContainer}
        data={todo}
        renderItem={({ item }) => (
          <View style={styles.FlatListViewContainer}>
            {/* <CheckBox
              value={item.status}
              onValueChange={() => toggleTodoStatus(item.id)}
            /> */}
            <Text>{item.name}</Text>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteTodoList(item.id)}
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  contrainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  header: {
    fontSize: 24,
  },
  contrainerAddItem: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "black",
    backgroundColor: "white",
    flex: 1,
    height: 30,
  },
  FlatListContainer: {
    backgroundColor: "white",
    width: "100%",
    padding: 40,
  },
  addButton: {
    backgroundColor: "#A03",
    width: 80,
    height: 30,
    borderRadius: 8,
    marginLeft: 10,
  },
  addButtonText: {
    fontSize: 20,
    color: "white",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
  FlatListViewContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    textAlign: "center",
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    padding: 3,
  },
  deleteButton: {
    backgroundColor: "#009688",
    width: 80,
    height: 30,
    borderRadius: 8,
    marginLeft: 10,
    color: "white",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
  deleteButtonText: {
    fontSize: 20,
    color: "white",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
});
