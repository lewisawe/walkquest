import { StyleSheet, View, Text, Pressable, ActivityIndicator } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { useEffect, useState, useRef } from 'react';

const DARK_MAP_STYLE = [
  { elementType: 'geometry', stylers: [{ color: '#1d2c4d' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#8ec3b9' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#1a3646' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#304a7d' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#255763' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#2c6675' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0e1626' }] },
  { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#283d6a' }] },
  { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#2f3948' }] },
];

interface Waypoint {
  id: string;
  lat: number;
  lng: number;
  order: number;
  reached: boolean;
}

type QuestState = 'idle' | 'loading' | 'active' | 'complete';

export default function MapScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [questState, setQuestState] = useState<QuestState>('idle');
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const [walkedPath, setWalkedPath] = useState<{ latitude: number; longitude: number }[]>([]);
  const mapRef = useRef<MapView>(null);
  const locationSubscription = useRef<Location.LocationSubscription | null>(null);

  useEffect(() => {
    requestLocationPermission();
    return () => {
      if (locationSubscription.current) {
        locationSubscription.current.remove();
      }
    };
  }, []);

  async function requestLocationPermission() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Location permission is required to play WalkQuest.');
      return;
    }

    const loc = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });
    setLocation(loc);
  }

  async function startGPSTracking() {
    locationSubscription.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 3000,
        distanceInterval: 5,
      },
      (newLocation) => {
        setLocation(newLocation);
        setWalkedPath((prev) => [
          ...prev,
          {
            latitude: newLocation.coords.latitude,
            longitude: newLocation.coords.longitude,
          },
        ]);
        checkWaypointProximity(newLocation);
      }
    );
  }

  function checkWaypointProximity(loc: Location.LocationObject) {
    const TRIGGER_RADIUS = 30; // meters

    setWaypoints((prev) => {
      const nextWaypoint = prev.find((wp) => !wp.reached);
      if (!nextWaypoint) return prev;

      const distance = getDistanceMeters(
        loc.coords.latitude,
        loc.coords.longitude,
        nextWaypoint.lat,
        nextWaypoint.lng
      );

      if (distance <= TRIGGER_RADIUS) {
        // Waypoint reached!
        const updated = prev.map((wp) =>
          wp.id === nextWaypoint.id ? { ...wp, reached: true } : wp
        );

        const allReached = updated.every((wp) => wp.reached);
        if (allReached) {
          setQuestState('complete');
          if (locationSubscription.current) {
            locationSubscription.current.remove();
          }
        }

        return updated;
      }
      return prev;
    });
  }

  async function fetchNearbyWaypoints(lat: number, lng: number): Promise<Waypoint[]> {
    const radius = 600; // meters
    const query = `
      [out:json][timeout:10];
      (
        node["highway"="crossing"](around:${radius},${lat},${lng});
        node["highway"="traffic_signals"](around:${radius},${lat},${lng});
        node["amenity"~"bench|fountain|post_box|telephone"](around:${radius},${lat},${lng});
      );
      out body 20;
    `;

    try {
      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: `data=${encodeURIComponent(query)}`,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });

      const data = await response.json();
      const nodes = data.elements || [];

      // Pick 3-5 waypoints that form a walkable route
      const selected = selectWaypoints(nodes, lat, lng, 3);

      return selected.map((node: any, index: number) => ({
        id: `wp-${node.id}`,
        lat: node.lat,
        lng: node.lon,
        order: index + 1,
        reached: false,
      }));
    } catch (error) {
      console.error('Overpass API error:', error);
      // Fallback: generate waypoints in cardinal directions
      return generateFallbackWaypoints(lat, lng);
    }
  }

  function selectWaypoints(
    nodes: any[],
    centerLat: number,
    centerLng: number,
    count: number
  ): any[] {
    if (nodes.length <= count) return nodes;

    // Sort by distance from center, pick spread-out points
    const withDistance = nodes.map((node) => ({
      ...node,
      distance: getDistanceMeters(centerLat, centerLng, node.lat, node.lon),
    }));

    // Filter to reasonable walking distance (100m - 600m)
    const inRange = withDistance.filter(
      (n) => n.distance >= 100 && n.distance <= 600
    );

    if (inRange.length < count) {
      return withDistance.slice(0, count);
    }

    // Pick evenly spaced points by angle from center
    const withAngle = inRange.map((node) => ({
      ...node,
      angle: Math.atan2(node.lat - centerLat, node.lon - centerLng),
    }));

    withAngle.sort((a, b) => a.angle - b.angle);

    const step = Math.floor(withAngle.length / count);
    const result: any[] = [];
    for (let i = 0; i < count; i++) {
      result.push(withAngle[i * step]);
    }

    return result;
  }

  function generateFallbackWaypoints(lat: number, lng: number): Waypoint[] {
    // Generate 3 waypoints ~200m away in different directions
    const offsets = [
      { dlat: 0.0018, dlng: 0.001 },
      { dlat: -0.001, dlng: 0.0018 },
      { dlat: 0.0005, dlng: -0.0018 },
    ];

    return offsets.map((offset, index) => ({
      id: `wp-fallback-${index}`,
      lat: lat + offset.dlat,
      lng: lng + offset.dlng,
      order: index + 1,
      reached: false,
    }));
  }

  async function startQuest() {
    if (!location) return;

    setQuestState('loading');
    setWalkedPath([]);

    const wps = await fetchNearbyWaypoints(
      location.coords.latitude,
      location.coords.longitude
    );

    setWaypoints(wps);
    setQuestState('active');
    startGPSTracking();
  }

  function getNextWaypoint(): Waypoint | undefined {
    return waypoints.find((wp) => !wp.reached);
  }

  function getDistanceToNext(): string {
    if (!location) return '—';
    const next = getNextWaypoint();
    if (!next) return '—';

    const dist = getDistanceMeters(
      location.coords.latitude,
      location.coords.longitude,
      next.lat,
      next.lng
    );

    return dist >= 1000 ? `${(dist / 1000).toFixed(1)} km` : `${Math.round(dist)} m`;
  }

  if (errorMsg) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{errorMsg}</Text>
      </View>
    );
  }

  if (!location) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#C5962B" />
        <Text style={styles.loadingText}>Finding your location...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        customMapStyle={DARK_MAP_STYLE}
        initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.008,
          longitudeDelta: 0.008,
        }}
        showsUserLocation
        showsMyLocationButton={false}
        followsUserLocation={questState === 'active'}
      >
        {/* Waypoint markers */}
        {waypoints.map((wp) => (
          <Marker
            key={wp.id}
            coordinate={{ latitude: wp.lat, longitude: wp.lng }}
            pinColor={wp.reached ? '#2B6B4F' : '#C5962B'}
            title={`Waypoint ${wp.order}`}
            description={wp.reached ? 'Reached!' : 'Walk here'}
          />
        ))}

        {/* Route line between waypoints */}
        {waypoints.length > 0 && (
          <Polyline
            coordinates={waypoints.map((wp) => ({
              latitude: wp.lat,
              longitude: wp.lng,
            }))}
            strokeColor="#C5962B"
            strokeWidth={3}
            lineDashPattern={[10, 5]}
          />
        )}

        {/* Walked path */}
        {walkedPath.length > 1 && (
          <Polyline
            coordinates={walkedPath}
            strokeColor="#2B6B4F"
            strokeWidth={4}
          />
        )}
      </MapView>

      {/* HUD Overlay */}
      <View style={styles.hud}>
        {questState === 'idle' && (
          <Pressable style={styles.startButton} onPress={startQuest}>
            <Text style={styles.startButtonText}>⚔️ START QUEST</Text>
          </Pressable>
        )}

        {questState === 'loading' && (
          <View style={styles.statusCard}>
            <ActivityIndicator color="#C5962B" />
            <Text style={styles.statusText}>Generating quest...</Text>
          </View>
        )}

        {questState === 'active' && (
          <View style={styles.statusCard}>
            <Text style={styles.questTitle}>THE NORTHERN PATROL</Text>
            <Text style={styles.distanceText}>
              Next waypoint: {getDistanceToNext()} →
            </Text>
            <Text style={styles.progressText}>
              {waypoints.filter((wp) => wp.reached).length} / {waypoints.length} waypoints
            </Text>
          </View>
        )}

        {questState === 'complete' && (
          <View style={styles.statusCard}>
            <Text style={styles.completeTitle}>🎉 QUEST COMPLETE!</Text>
            <Text style={styles.statusText}>
              {waypoints.length} waypoints cleared
            </Text>
            <Pressable
              style={styles.startButton}
              onPress={() => {
                setQuestState('idle');
                setWaypoints([]);
                setWalkedPath([]);
              }}
            >
              <Text style={styles.startButtonText}>NEW QUEST</Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}

// Haversine formula for distance between two GPS points
function getDistanceMeters(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2A2318',
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    flex: 1,
    width: '100%',
  },
  hud: {
    position: 'absolute',
    bottom: 40,
    left: 16,
    right: 16,
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: '#C5962B',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  startButtonText: {
    color: '#2A2318',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1,
  },
  statusCard: {
    backgroundColor: 'rgba(42, 35, 24, 0.92)',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#C5962B',
  },
  questTitle: {
    color: '#C5962B',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 8,
  },
  distanceText: {
    color: '#F5E6D3',
    fontSize: 20,
    fontWeight: '600',
  },
  progressText: {
    color: '#8ec3b9',
    fontSize: 14,
    marginTop: 4,
  },
  completeTitle: {
    color: '#C5962B',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  statusText: {
    color: '#F5E6D3',
    fontSize: 14,
    marginTop: 4,
  },
  loadingText: {
    color: '#F5E6D3',
    fontSize: 16,
    marginTop: 12,
  },
  errorText: {
    color: '#8B1A1A',
    fontSize: 16,
    textAlign: 'center',
    padding: 20,
  },
});
