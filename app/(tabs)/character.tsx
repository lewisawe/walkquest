import { StyleSheet, View, Text } from 'react-native';

export default function CharacterScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛡️ YOUR HERO</Text>

      <View style={styles.card}>
        <Text style={styles.name}>Adventurer</Text>
        <Text style={styles.class}>Level 1 Walker</Text>

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>30</Text>
            <Text style={styles.statLabel}>❤️ HP</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>10</Text>
            <Text style={styles.statLabel}>⚔️ ATK</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>5</Text>
            <Text style={styles.statLabel}>🛡️ DEF</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>💰 Gold</Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>📊 Stats</Text>
        <Text style={styles.statLine}>📍 0.0 km walked</Text>
        <Text style={styles.statLine}>🗺️ 0% area explored</Text>
        <Text style={styles.statLine}>⚔️ 0 enemies defeated</Text>
        <Text style={styles.statLine}>🔥 0 day streak</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>🎒 Inventory</Text>
        <Text style={styles.emptyText}>No items yet. Complete a quest!</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2A2318',
    padding: 16,
    paddingTop: 60,
  },
  title: {
    color: '#C5962B',
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: 1,
  },
  card: {
    backgroundColor: 'rgba(26, 21, 16, 0.8)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#3d3425',
  },
  name: {
    color: '#F5E6D3',
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  class: {
    color: '#8ec3b9',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    color: '#F5E6D3',
    fontSize: 20,
    fontWeight: '700',
  },
  statLabel: {
    color: '#8ec3b9',
    fontSize: 12,
    marginTop: 4,
  },
  sectionTitle: {
    color: '#C5962B',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  statLine: {
    color: '#F5E6D3',
    fontSize: 14,
    marginBottom: 6,
  },
  emptyText: {
    color: '#666',
    fontSize: 14,
    fontStyle: 'italic',
  },
});
