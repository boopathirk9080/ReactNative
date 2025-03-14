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
      setRoutines(routines.map(
        item => (item.id === id ? { ...item, content } : item)));
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
    flex: 1,
    padding: 20,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    color: "#2563eb",
  },

  input: {
    borderWidth: 1,
    fontSize: 18,
    borderColor: "#d1d5db",
    padding: 12,
    marginBottom: 16,
    width: "100%",
    borderRadius: 8,
    backgroundColor: "white",
  },

  list: {
    flex: 1,
    width: "100%",
    marginTop: 10,
  },

  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 12,
    marginTop: 12,
    borderRadius: 8,
    backgroundColor: "white",
    elevation: 1,
    shadowColor: "#000",
  },

  textContainer: {
    flex: 1,
    marginRight: 16,
  },


  itemText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#000",
  },


  itemTextCompleted: {
    fontSize: 18,
    textDecorationLine: "line-through",
    color: "#9ca3af",
  },

  buttonsContainer: {
    flexDirection: "row",
    gap: 8,
  },



  deleteButton: {
    backgroundColor: "#ef4444",
    borderRadius: 20,
    padding: 8,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },

  editButton: {
    backgroundColor: "#3b82f6",
    borderRadius: 20,
    padding: 8,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});