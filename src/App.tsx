import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet, Alert } from "react-native";
import { StatusBar } from "expo-status-bar";

const API = process.env.API_BASE_URL || "http://10.0.2.2:8080";

export default function App() {
  const [passive, setPassive] = useState(true);
  const [transcript, setTranscript] = useState("");
  const [summary, setSummary] = useState("");

  const togglePassive = () => {
    setPassive(p => !p);
  };

  const recordAndSummarize = async () => {
    try {
      // MVP stub: call stub endpoints without actual mic
      const asr = await fetch(`${API}/api/asr`, { method: "POST" }).then(r => r.json());
      setTranscript(asr.transcript || "");
      const sum = await fetch(`${API}/api/summarize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: asr.transcript || "" })
      }).then(r => r.json());
      setSummary(sum.layman || "");
      await fetch(`${API}/api/tts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: sum.layman || "" })
      });
      Alert.alert("Playback", "TTS playback would start (stub).");
    } catch (e) {
      Alert.alert("Error", String(e));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Raynos MVP</Text>
      <View style={styles.toggleRow}>
        <Text style={styles.label}>Passive Listening</Text>
        <Pressable style={[styles.toggle, passive ? styles.on : styles.off]} onPress={togglePassive}>
          <Text style={styles.toggleText}>{passive ? "On" : "Off"}</Text>
        </Pressable>
      </View>
      <Pressable style={styles.button} onPress={recordAndSummarize}>
        <Text style={styles.buttonText}>Record & Summarize</Text>
      </Pressable>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Transcript</Text>
        <Text>{transcript || "—"}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Summary</Text>
        <Text>{summary || "—"}</Text>
      </View>
      <Text style={styles.footer}>SOS & Fall Detection always active.</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 16, backgroundColor: "#0b0f12" },
  title: { color: "white", fontSize: 24, fontWeight: "700", marginTop: 12 },
  toggleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  label: { color: "white", fontSize: 16 },
  toggle: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 999 },
  on: { backgroundColor: "#1db954" },
  off: { backgroundColor: "#555" },
  toggleText: { color: "white", fontWeight: "600" },
  button: { backgroundColor: "#2d6cdf", padding: 14, borderRadius: 12, alignItems: "center" },
  buttonText: { color: "white", fontWeight: "600" },
  card: { backgroundColor: "#12171c", padding: 12, borderRadius: 12 },
  cardTitle: { color: "white", fontWeight: "700", marginBottom: 6 },
  footer: { color: "#9aa4af", marginTop: "auto", textAlign: "center" }
});
