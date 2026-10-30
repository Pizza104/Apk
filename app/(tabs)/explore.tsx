import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useTasks } from "@/contexts/TasksContext";
import { TASK_CATEGORIES } from "@/types/task";

function dayKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function SummaryScreen() {
  const { tasks } = useTasks();
  const completed = tasks.filter((task) => task.completed).length;
  const pending = tasks.length - completed;
  const progress = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;
  const categories = TASK_CATEGORIES.map((category) => {
    const group = tasks.filter((task) => task.category === category);
    return { category, total: group.length, done: group.filter((task) => task.completed).length };
  });
  const week = useMemo(() => {
    const today = new Date();
    const items = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - (6 - index));
      const key = dayKey(date);
      const count = tasks.filter((task) => task.completedAt && dayKey(new Date(task.completedAt)) === key).length;
      const label = new Intl.DateTimeFormat("pt-BR", { weekday: "short" }).format(date).replace(".", "");
      return { key, label, count, today: index === 6 };
    });
    return { items, max: Math.max(1, ...items.map((item) => item.count)) };
  }, [tasks]);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.brandLockup}>
          <View style={styles.brandMark}>
            <Ionicons name="leaf" size={20} color="#FFFFFF" />
          </View>
          <Text style={styles.brandText}>
            rotina<Text style={styles.brandPlus}>+</Text>
          </Text>
        </View>
        <View style={styles.heading}>
          <Text style={styles.kicker}>VISÃO GERAL</Text>
          <Text style={styles.title}>Seu caminho até aqui.</Text>
          <Text style={styles.subtitle}>Um retrato simples do que você já colocou em prática.</Text>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryCardTop}>
            <View>
              <Text style={styles.summaryEyebrow}>PROGRESSO GERAL</Text>
              <Text style={styles.summaryTitle}>
                {progress === 100 && tasks.length > 0 ? "Tudo concluído. Que orgulho!" : "Cada tarefa conta."}
              </Text>
            </View>
            <View style={styles.summaryIcon}>
              <Ionicons name="trending-up" size={21} color="#D9F2DE" />
            </View>
          </View>
          <View style={styles.bigProgress}>
            <Text style={styles.bigProgressText}>
              {progress}
              <Text style={styles.bigProgressPercent}>%</Text>
            </Text>
            <Text style={styles.bigProgressCaption}>das tarefas concluídas</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
        </View>

        <View style={styles.statRow}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: "#E9F1FB" }]}>
              <Ionicons name="list-outline" size={18} color="#5475A0" />
            </View>
            <Text style={styles.statNumber}>{tasks.length}</Text>
            <Text style={styles.statLabel}>No total</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: "#E8F4EC" }]}>
              <Ionicons name="checkmark-done-outline" size={18} color="#2B8058" />
            </View>
            <Text style={styles.statNumber}>{completed}</Text>
            <Text style={styles.statLabel}>Concluídas</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: "#FFF2DF" }]}>
              <Ionicons name="time-outline" size={18} color="#A87825" />
            </View>
            <Text style={styles.statNumber}>{pending}</Text>
            <Text style={styles.statLabel}>Em aberto</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Últimos 7 dias</Text>
            <Text style={styles.sectionCopy}>Tarefas concluídas por dia</Text>
          </View>
          <View style={styles.weekBadge}>
            <Ionicons name="calendar-outline" size={14} color="#43805E" />
            <Text style={styles.weekBadgeText}>Últimos 7 dias</Text>
          </View>
        </View>
        <View style={styles.chartCard}>
          {week.items.map((item) => (
            <View key={item.key} style={styles.barColumn}>
              <Text style={styles.barCount}>{item.count || ""}</Text>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.bar,
                    { height: item.count ? `${Math.max(12, (item.count / week.max) * 100)}%` : 5 },
                    item.today && styles.barToday,
                    item.count === 0 && styles.barEmpty,
                  ]}
                />
              </View>
              <Text style={[styles.barLabel, item.today && styles.barLabelToday]}>
                {item.today ? "hoje" : item.label}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Por categoria</Text>
            <Text style={styles.sectionCopy}>Como suas tarefas estão distribuídas</Text>
          </View>
        </View>
        <View style={styles.categoryCard}>
          {categories.map((item, index) => {
            const rate = item.total ? Math.round((item.done / item.total) * 100) : 0;
            const icon =
              item.category === "Estudo"
                ? "book-outline"
                : item.category === "Pessoal"
                  ? "heart-outline"
                  : "briefcase-outline";
            return (
              <View
                key={item.category}
                style={[styles.categoryRow, index < categories.length - 1 && styles.categoryBorder]}
              >
                <View style={styles.categorySymbol}>
                  <Ionicons name={icon} size={17} color="#43805E" />
                </View>
                <View style={styles.categoryInfo}>
                  <View style={styles.categoryTop}>
                    <Text style={styles.categoryName}>{item.category}</Text>
                    <Text style={styles.categoryCount}>
                      {item.done}/{item.total}
                    </Text>
                  </View>
                  <View style={styles.categoryTrack}>
                    <View style={[styles.categoryFill, { width: `${rate}%` }]} />
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {tasks.length === 0 ? (
          <View style={styles.emptyHint}>
            <Ionicons name="bulb-outline" size={19} color="#A87825" />
            <Text style={styles.emptyHintText}>
              Adicione sua primeira tarefa na aba Tarefas para começar a acompanhar o progresso.
            </Text>
          </View>
        ) : (
          <Text style={styles.privacyNote}>
            <Ionicons name="lock-closed-outline" size={12} color="#819087" /> Resumo calculado a partir dos seus dados
            locais.
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F4F7F4" },
  content: {
    width: "100%",
    maxWidth: 760,
    alignSelf: "center",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 34,
  },
  brandLockup: { flexDirection: "row", alignItems: "center", gap: 9, marginBottom: 28 },
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
  heading: { marginBottom: 20 },
  kicker: { marginBottom: 6, color: "#43805E", fontSize: 10, fontWeight: "800", letterSpacing: 1.2 },
  title: { color: "#20372C", fontSize: 27, lineHeight: 34, fontWeight: "800", letterSpacing: -0.8 },
  subtitle: { marginTop: 5, color: "#77857C", fontSize: 13, lineHeight: 20 },
  summaryCard: { marginBottom: 15, padding: 19, borderRadius: 22, backgroundColor: "#1C684B" },
  summaryCardTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  summaryEyebrow: { color: "#B8DCC8", fontSize: 10, fontWeight: "800", letterSpacing: 1.2 },
  summaryTitle: { marginTop: 5, color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
  summaryIcon: {
    width: 39,
    height: 39,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF20",
  },
  bigProgress: { flexDirection: "row", alignItems: "baseline", gap: 8, marginTop: 18, marginBottom: 12 },
  bigProgressText: { color: "#FFFFFF", fontSize: 37, lineHeight: 42, fontWeight: "800", letterSpacing: -1.5 },
  bigProgressPercent: { fontSize: 21, letterSpacing: 0 },
  bigProgressCaption: { color: "#D9EDE0", fontSize: 12 },
  progressTrack: { height: 8, overflow: "hidden", borderRadius: 5, backgroundColor: "#FFFFFF35" },
  progressFill: { height: "100%", borderRadius: 5, backgroundColor: "#BDE2A5" },
  statRow: { flexDirection: "row", gap: 9, marginBottom: 25 },
  statCard: {
    flex: 1,
    minHeight: 110,
    padding: 13,
    borderWidth: 1,
    borderColor: "#E6ECE7",
    borderRadius: 17,
    backgroundColor: "#FFFFFF",
  },
  statIcon: {
    width: 31,
    height: 31,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  statNumber: { color: "#26372E", fontSize: 21, fontWeight: "800" },
  statLabel: { marginTop: 1, color: "#7B8980", fontSize: 10, fontWeight: "600" },
  sectionHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 11 },
  sectionTitle: { color: "#283A30", fontSize: 17, fontWeight: "800", letterSpacing: -0.3 },
  sectionCopy: { marginTop: 3, color: "#87938A", fontSize: 11 },
  weekBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 30,
    backgroundColor: "#EAF3EC",
  },
  weekBadgeText: { color: "#43805E", fontSize: 9, fontWeight: "700" },
  chartCard: {
    height: 142,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
    gap: 8,
    marginBottom: 25,
    paddingHorizontal: 13,
    paddingTop: 12,
    paddingBottom: 12,
    borderWidth: 1,
    borderColor: "#E6ECE7",
    borderRadius: 17,
    backgroundColor: "#FFFFFF",
  },
  barColumn: { flex: 1, alignItems: "center", justifyContent: "flex-end", height: "100%", gap: 5 },
  barCount: { height: 12, color: "#557065", fontSize: 9, fontWeight: "700" },
  barTrack: {
    width: "65%",
    height: 78,
    alignItems: "center",
    justifyContent: "flex-end",
    borderRadius: 7,
    backgroundColor: "#F0F4F1",
    overflow: "hidden",
  },
  bar: { width: "100%", borderRadius: 7, backgroundColor: "#A8D0B5" },
  barToday: { backgroundColor: "#217A55" },
  barEmpty: { backgroundColor: "#DEE7E0" },
  barLabel: { color: "#859188", fontSize: 9, textTransform: "capitalize" },
  barLabelToday: { color: "#26724F", fontWeight: "800" },
  categoryCard: {
    marginBottom: 17,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#E6ECE7",
    borderRadius: 17,
    backgroundColor: "#FFFFFF",
  },
  categoryRow: { flexDirection: "row", alignItems: "center", gap: 11, paddingVertical: 13 },
  categoryBorder: { borderBottomWidth: 1, borderBottomColor: "#EEF1EE" },
  categorySymbol: {
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EAF3EC",
  },
  categoryInfo: { flex: 1, gap: 7 },
  categoryTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  categoryName: { color: "#405248", fontSize: 12, fontWeight: "700" },
  categoryCount: { color: "#7B8980", fontSize: 10, fontWeight: "700" },
  categoryTrack: { height: 5, overflow: "hidden", borderRadius: 3, backgroundColor: "#EEF2EF" },
  categoryFill: { height: "100%", borderRadius: 3, backgroundColor: "#58A77B" },
  emptyHint: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 9,
    padding: 13,
    borderRadius: 14,
    backgroundColor: "#FFF5E3",
  },
  emptyHintText: { flex: 1, color: "#725B33", fontSize: 11, lineHeight: 17 },
  privacyNote: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    gap: 5,
    marginTop: 3,
    color: "#819087",
    fontSize: 10,
  },
});
