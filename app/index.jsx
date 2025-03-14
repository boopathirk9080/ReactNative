import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet
} from "react-native";
import axios from "axios";
import { FontAwesome } from "@expo/vector-icons";

const API_URL = "https://678fcf3549875e5a1a93731f.mockapi.io/timingData/data";

export default function RoutineApp() {
  const [routines, setRoutines] = useState([]);
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchRoutines();
  }, []);

  const fetchRoutines = async () => {
    try {
      const response = await axios.get(API_URL);
      setRoutines(response.data);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const addRoutine = async () => {
    if (!content) return;
    try {
      const response = await axios.post(API_URL, { content, completed: false });
      setRoutines([...routines, response.data]);
      setContent("");
    } catch (error) {
      console.error("Error adding routine", error);
    }
  };

  const updateRoutine = async (id) => {
    if (!content) return;
    try {
      await axios.put(`${API_URL}/${id}`, { content });
      setRoutines(routines.map(item => (item.id === id ? { ...item, content } : item)));
      setEditingId(null);
      setContent("");
    } catch (error) {
      console.error("Error updating routine", error);
    }
  };

  const deleteRoutine = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setRoutines(routines.filter(item => item.id !== id));
    } catch (error) {
      console.error("Error deleting routine", error);
    }
  };

  const toggleComplete = async (id, completed) => {
    try {
      await axios.put(`${API_URL}/${id}`, { completed: !completed });
      setRoutines(routines.map(item => (item.id === id ? { ...item, completed: !completed } : item)));
    } catch (error) {
      console.error("Error toggling complete", error);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Routine App</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter routine..."
        value={content}
        onChangeText={setContent}
      />
      <Button
        title={editingId ? "Update Routine" : "Add Routine"}
        onPress={editingId ? () => updateRoutine(editingId) : addRoutine}
        color="blue"
      />
      <FlatList
        style={styles.list}
        data={routines}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <View style={styles.textContainer}>
              <TouchableOpacity onPress={() => toggleComplete(item.id, item.completed)}>
                <Text style={item.completed ? styles.itemTextCompleted : styles.itemText}>
                  {item.content}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteRoutine(item.id)}
              >
                <FontAwesome name="trash" size={20} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => { setEditingId(item.id); setContent(item.content); }}
              >
                <FontAwesome name="edit" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,                // Take full available space
    padding: 20,            // Equivalent to p-6
    backgroundColor: "#f3f4f6", // bg-gray-100
    alignItems: "center",   // Center items horizontally
  },

  // Title styles
  title: {
    fontSize: 24,           // text-2xl
    fontWeight: "bold",     // font-bold
    marginBottom: 24,       // mb-6
    color: "#2563eb",       // text-blue-600
  },

  // Input field styles
  input: {
    borderWidth: 1,
    fontSize: 18,         // border
    borderColor: "#d1d5db", // border-gray-300
    padding: 12,            // p-3
    marginBottom: 16,       // mb-4
    width: "100%",          // w-full
    borderRadius: 8,        // rounded-lg
    backgroundColor: "white", // bg-white
    // Shadow styles

  },

  // FlatList styles
  list: {
    flex: 1,                // Take remaining space
    width: "100%",          // Full width
    marginTop: 10,          // Space below the button
  },

  // Individual todo item container
  itemContainer: {
    flexDirection: "row",   // flex-row
    justifyContent: "space-between", // justify-between
    alignItems: "center",   // items-center
    borderWidth: 1,         // border
    borderColor: "#e5e7eb", // border-gray-200
    padding: 12,            // p-3
    marginTop: 12,          // mt-3
    borderRadius: 8,        // rounded-lg
    backgroundColor: "white", // bg-white
    // Shadow styles
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  // Todo text container
  textContainer: {
    flex: 1,                // Take available space
    marginRight: 16,        // Space before buttons
  },

  // Normal text style
  itemText: {
    fontSize: 18,           // text-lg
    fontWeight: "500",      // font-medium
    color: "#000",          // text-black
  },

  // Completed text style
  itemTextCompleted: {
    fontSize: 18,           // text-lg
    textDecorationLine: "line-through", // line-through
    color: "#9ca3af",       // text-gray-400
  },

  // Buttons container
  buttonsContainer: {
    flexDirection: "row",   // flex-row
    gap: 8,                 // gap-2
  },

  // Delete button style
  deleteButton: {
    backgroundColor: "#ef4444", // bg-red-500
    borderRadius: 20,        // rounded-full
    padding: 8,              // p-2
    width: 40,               // Fixed size for circle
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },

  // Edit button style
  editButton: {
    backgroundColor: "#3b82f6", // bg-blue-500
    borderRadius: 20,        // rounded-full
    padding: 8,              // p-2
    width: 40,               // Fixed size for circle
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});