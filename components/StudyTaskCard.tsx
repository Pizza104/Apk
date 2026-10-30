import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { StudyTask, TaskCategory } from "@/types/task";

const categoryColors: Record<TaskCategory, { background: string; foreground: string }> = {
  Estudo: { background: "#E7F4EE", foreground: "#287653" },
  Pessoal: { background: "#F0EAF9", foreground: "#7654A5" },
  Trabalho: { background: "#E9F0FA", foreground: "#496B9C" },
};

type Props = {
  task: StudyTask;
  onToggle: () => void;
  onRemove: () => void;
};

export function StudyTaskCard({ task, onToggle, onRemove }: Props) {
  const category = categoryColors[task.category];
  return (
    <View style={[styles.card, task.completed && styles.cardCompleted]}>
      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked: task.completed }}
        accessibilityLabel={`${task.completed ? "Reabrir" : "Concluir"} tarefa: ${task.title}`}
        onPress={onToggle}
        style={({ pressed }) => [styles.checkButton, pressed && styles.pressed]}
      >
        <Ionicons
          name={task.completed ? "checkmark-circle" : "ellipse-outline"}
          size={27}
          color={task.completed ? "#21825D" : "#A6B2AD"}
        />
      </Pressable>
      <View style={styles.content}>
        <Text style={[styles.title, task.completed && styles.titleCompleted]}>{task.title}</Text>
        <View style={[styles.category, { backgroundColor: category.background }]}>
          <Text style={[styles.categoryText, { color: category.foreground }]}>{task.category}</Text>
        </View>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Excluir tarefa: ${task.title}`}
        onPress={onRemove}
        hitSlop={10}
        style={({ pressed }) => [styles.removeButton, pressed && styles.pressed]}
      >
        <Ionicons name="trash-outline" size={19} color="#8A9690" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 76,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#E8EEEA",
    borderRadius: 17,
    backgroundColor: "#FFFFFF",
  },
  cardCompleted: { backgroundColor: "#F8FBF9" },
  checkButton: { width: 34, height: 40, alignItems: "center", justifyContent: "center" },
  content: { flex: 1, gap: 7 },
  title: { color: "#26352E", fontSize: 15, fontWeight: "600", lineHeight: 21 },
  titleCompleted: { color: "#87938D", textDecorationLine: "line-through" },
  category: { alignSelf: "flex-start", borderRadius: 30, paddingHorizontal: 9, paddingVertical: 3 },
  categoryText: { fontSize: 10, fontWeight: "700", letterSpacing: 0.2 },
  removeButton: { width: 34, height: 40, alignItems: "center", justifyContent: "center", borderRadius: 10 },
  pressed: { opacity: 0.65 },
});
