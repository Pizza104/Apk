import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { StudyTaskCard } from "@/components/StudyTaskCard";
import { useTasks } from "@/contexts/TasksContext";
import { TASK_CATEGORIES, TaskCategory, TaskFilter } from "@/types/task";

const filters: TaskFilter[] = ["Todas", "Pendentes", "Concluídas"];
const suggestions = ["Revisar anotações", "Fazer exercícios", "Organizar materiais"];

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

export default function TasksScreen() {
  const { tasks, isLoading, storageError, addTask, toggleTask, removeTask } = useTasks();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<TaskCategory>("Estudo");
  const [filter, setFilter] = useState<TaskFilter>("Todas");
  const done = tasks.filter((task) => task.completed).length;
  const pending = tasks.length - done;
  const progress = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
  const dateLabel = new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "numeric", month: "long" }).format(
    new Date(),
  );
  const visibleTasks = useMemo(
    () =>
      tasks.filter((task) => {
        if (filter === "Pendentes") return !task.completed;
        if (filter === "Concluídas") return task.completed;
        return true;
      }),
    [filter, tasks],
  );

  const submitTask = () => {
    const cleanTitle = title.trim();
    if (!cleanTitle) return;
    addTask(cleanTitle, category);
    setTitle("");
  };

  const addSuggestion = (suggestion: string) => addTask(suggestion, "Estudo");

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.topBar}>
            <View style={styles.brandLockup}>
              <View style={styles.brandMark}>
                <Ionicons name="leaf" size={20} color="#FFFFFF" />
              </View>
              <Text style={styles.brandText}>
                rotina<Text style={styles.brandPlus}>+</Text>
              </Text>
            </View>
            <View style={styles.localBadge}>
              <View style={styles.onlineDot} />
              <Text style={styles.localBadgeText}>
                {isLoading ? "Carregando…" : storageError ? "Modo temporário" : "Salvo no aparelho"}
              </Text>
            </View>
          </View>

          <View style={styles.greetingBlock}>
            <Text style={styles.dateText}>{dateLabel.charAt(0).toUpperCase() + dateLabel.slice(1)}</Text>
            <Text style={styles.greeting}>{getGreeting()}, vamos avançar.</Text>
            <Text style={styles.greetingCopy}>Um passo de cada vez já é progresso.</Text>
          </View>

          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <View>
                <Text style={styles.progressEyebrow}>SEU PROGRESSO</Text>
                <Text style={styles.progressTitle}>Um passo de cada vez.</Text>
              </View>
              <View style={styles.progressPercent}>
                <Text style={styles.progressPercentText}>{progress}%</Text>
              </View>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
            <View style={styles.progressFooter}>
              <Text style={styles.progressCount}>
                {done} de {tasks.length} concluídas
              </Text>
              <Text style={styles.progressCount}>{pending} em aberto</Text>
            </View>
          </View>

          {storageError ? (
            <View style={styles.storageWarning}>
              <Ionicons name="alert-circle-outline" size={18} color="#9A6B17" />
              <Text style={styles.storageWarningText}>{storageError}</Text>
            </View>
          ) : null}

          <View style={styles.sectionHeading}>
            <View>
              <Text style={styles.sectionTitle}>Minha lista</Text>
              <Text style={styles.sectionSubtitle}>
                {tasks.length === 0
                  ? "Organize o que você quer fazer."
                  : `${tasks.length} ${tasks.length === 1 ? "tarefa" : "tarefas"} no total`}
              </Text>
            </View>
            <View style={styles.headingIcon}>
              <Ionicons name="checkmark-done" size={19} color="#277655" />
            </View>
          </View>

          <View style={styles.composerCard}>
            <Text style={styles.inputLabel}>O que você quer colocar em dia?</Text>
            <View style={styles.inputRow}>
              <TextInput
                accessibilityLabel="Nome da nova tarefa"
                value={title}
                onChangeText={setTitle}
                onSubmitEditing={submitTask}
                placeholder="Ex.: revisar o capítulo 2"
                placeholderTextColor="#9AA69F"
                returnKeyType="done"
                maxLength={80}
                style={styles.textInput}
              />
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Adicionar tarefa"
                onPress={submitTask}
                disabled={!title.trim()}
                style={({ pressed }) => [
                  styles.addButton,
                  !title.trim() && styles.addButtonDisabled,
                  pressed && styles.pressed,
                ]}
              >
                <Ionicons name="add" size={25} color="#FFFFFF" />
              </Pressable>
            </View>
            <Text style={styles.categoryLabel}>CATEGORIA</Text>
            <View style={styles.categoryRow}>
              {TASK_CATEGORIES.map((item) => {
                const selected = item === category;
                return (
                  <Pressable
                    key={item}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    onPress={() => setCategory(item)}
                    style={[styles.categoryChoice, selected && styles.categoryChoiceSelected]}
                  >
                    <Text style={[styles.categoryChoiceText, selected && styles.categoryChoiceTextSelected]}>
                      {item}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.filterRow}>
            {filters.map((item) => {
              const selected = item === filter;
              const count = item === "Todas" ? tasks.length : item === "Pendentes" ? pending : done;
              return (
                <Pressable
                  key={item}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  onPress={() => setFilter(item)}
                  style={[styles.filterChip, selected && styles.filterChipSelected]}
                >
                  <Text style={[styles.filterText, selected && styles.filterTextSelected]}>{item}</Text>
                  <Text style={[styles.filterCount, selected && styles.filterTextSelected]}>{count}</Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.taskList}>
            {isLoading ? (
              <View style={styles.loadingState}>
                <ActivityIndicator color="#21825D" />
                <Text style={styles.emptyCopy}>Carregando sua lista…</Text>
              </View>
            ) : visibleTasks.length > 0 ? (
              visibleTasks.map((task) => (
                <StudyTaskCard
                  key={task.id}
                  task={task}
                  onToggle={() => toggleTask(task.id)}
                  onRemove={() => removeTask(task.id)}
                />
              ))
            ) : (
              <View style={styles.emptyState}>
                <View style={styles.emptyIcon}>
                  <Ionicons
                    name={filter === "Concluídas" ? "sparkles-outline" : "clipboard-outline"}
                    size={28}
                    color="#43866A"
                  />
                </View>
                <Text style={styles.emptyTitle}>
                  {filter === "Concluídas" && tasks.length
                    ? "Ainda não tem nada concluído"
                    : filter === "Pendentes" && tasks.length
                      ? "Tudo em dia por aqui"
                      : "Comece com um próximo passo"}
                </Text>
                <Text style={styles.emptyCopy}>
                  {filter === "Todas" && tasks.length === 0
                    ? "Adicione uma tarefa acima ou escolha uma ideia rápida."
                    : "Quando a lista mudar, ela aparece aqui."}
                </Text>
                {filter === "Todas" && tasks.length === 0 ? (
                  <View style={styles.suggestionRow}>
                    {suggestions.map((suggestion) => (
                      <Pressable
                        key={suggestion}
                        onPress={() => addSuggestion(suggestion)}
                        style={({ pressed }) => [styles.suggestionChip, pressed && styles.pressed]}
                      >
                        <Ionicons name="add-circle-outline" size={16} color="#277655" />
                        <Text style={styles.suggestionText}>{suggestion}</Text>
                      </Pressable>
                    ))}
                  </View>
                ) : null}
              </View>
            )}
          </View>
          <Text style={styles.privacyNote}>
            <Ionicons name="lock-closed-outline" size={12} color="#819087" /> Seus dados ficam neste aparelho.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: "#F4F7F4" },
  content: {
    width: "100%",
    maxWidth: 760,
    alignSelf: "center",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 34,
  },
  topBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 30 },
  brandLockup: { flexDirection: "row", alignItems: "center", gap: 9 },
  brandMark: {
    width: 36,
    height: 36,
    borderRadius: 13,
    backgroundColor: "#227B57",
    alignItems: "center",
    justifyContent: "center",
  },
  brandText: { color: "#20372C", fontSize: 18, fontWeight: "800", letterSpacing: -0.6 },
  brandPlus: { color: "#2D9767" },
  localBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 30,
    backgroundColor: "#E9F3EC",
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  onlineDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: "#2D9767" },
  localBadgeText: { color: "#347352", fontSize: 10, fontWeight: "700" },
  greetingBlock: { marginBottom: 20 },
  dateText: { marginBottom: 7, color: "#75847A", fontSize: 12, fontWeight: "600", letterSpacing: 0.2 },
  greeting: { color: "#20372C", fontSize: 27, lineHeight: 34, fontWeight: "800", letterSpacing: -0.8 },
  greetingCopy: { marginTop: 5, color: "#77857C", fontSize: 14 },
  progressCard: { marginBottom: 25, padding: 19, borderRadius: 22, backgroundColor: "#1C684B" },
  progressHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 17 },
  progressEyebrow: { marginBottom: 5, color: "#B8DCC8", fontSize: 10, fontWeight: "800", letterSpacing: 1.25 },
  progressTitle: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
  progressPercent: {
    width: 47,
    height: 47,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF20",
    borderWidth: 1,
    borderColor: "#FFFFFF35",
  },
  progressPercentText: { color: "#FFFFFF", fontSize: 13, fontWeight: "800" },
  progressTrack: { height: 8, overflow: "hidden", borderRadius: 5, backgroundColor: "#FFFFFF35" },
  progressFill: { height: "100%", borderRadius: 5, backgroundColor: "#BDE2A5" },
  progressFooter: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  progressCount: { color: "#D9EDE0", fontSize: 11, fontWeight: "600" },
  storageWarning: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#FFF4DC",
  },
  storageWarningText: { flex: 1, color: "#77581C", fontSize: 12 },
  sectionHeading: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 13 },
  sectionTitle: { color: "#20372C", fontSize: 20, fontWeight: "800", letterSpacing: -0.45 },
  sectionSubtitle: { marginTop: 2, color: "#7B8980", fontSize: 12 },
  headingIcon: {
    width: 38,
    height: 38,
    borderRadius: 13,
    backgroundColor: "#E7F1E9",
    alignItems: "center",
    justifyContent: "center",
  },
  composerCard: {
    marginBottom: 18,
    padding: 15,
    borderWidth: 1,
    borderColor: "#E4EBE5",
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
  },
  inputLabel: { marginBottom: 9, color: "#34463A", fontSize: 12, fontWeight: "700" },
  inputRow: { flexDirection: "row", gap: 9 },
  textInput: {
    flex: 1,
    minHeight: 48,
    paddingHorizontal: 13,
    borderWidth: 1,
    borderColor: "#E2E9E3",
    borderRadius: 13,
    backgroundColor: "#FAFCFA",
    color: "#26372E",
    fontSize: 14,
  },
  addButton: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    backgroundColor: "#217A55",
  },
  addButtonDisabled: { opacity: 0.42 },
  pressed: { opacity: 0.72 },
  categoryLabel: { marginTop: 14, marginBottom: 8, color: "#87938A", fontSize: 9, fontWeight: "800", letterSpacing: 1 },
  categoryRow: { flexDirection: "row", gap: 8 },
  categoryChoice: {
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 30,
    backgroundColor: "#F1F4F1",
    borderWidth: 1,
    borderColor: "#F1F4F1",
  },
  categoryChoiceSelected: { backgroundColor: "#E8F4EC", borderColor: "#B8D8C4" },
  categoryChoiceText: { color: "#718078", fontSize: 11, fontWeight: "600" },
  categoryChoiceTextSelected: { color: "#26724F", fontWeight: "800" },
  filterRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 12 },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#E3E9E4",
    borderRadius: 30,
    backgroundColor: "#FFFFFF",
  },
  filterChipSelected: { borderColor: "#1F7753", backgroundColor: "#1F7753" },
  filterText: { color: "#68776E", fontSize: 11, fontWeight: "700" },
  filterTextSelected: { color: "#FFFFFF" },
  filterCount: { color: "#8B978F", fontSize: 10, fontWeight: "800" },
  taskList: { gap: 9 },
  loadingState: { alignItems: "center", gap: 9, paddingVertical: 30 },
  emptyState: {
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 25,
    borderWidth: 1,
    borderColor: "#E6ECE7",
    borderStyle: "dashed",
    borderRadius: 18,
    backgroundColor: "#FBFCFB",
  },
  emptyIcon: {
    width: 54,
    height: 54,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EAF3EC",
    marginBottom: 12,
  },
  emptyTitle: { color: "#304238", fontSize: 15, fontWeight: "700", textAlign: "center" },
  emptyCopy: { marginTop: 4, color: "#7C8980", fontSize: 12, textAlign: "center" },
  suggestionRow: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 7, marginTop: 15 },
  suggestionChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 30,
    backgroundColor: "#EEF5EF",
  },
  suggestionText: { color: "#3C6950", fontSize: 10, fontWeight: "600" },
  privacyNote: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    gap: 5,
    marginTop: 21,
    color: "#819087",
    fontSize: 10,
  },
});
