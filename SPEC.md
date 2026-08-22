# WalkQuest — Technical Specification

## Overview

WalkQuest is a mobile RPG where your real-world walking generates quests, encounters, and progression. GPS movement is the core input. The game rewards exploring new streets, completing waypoint-based quests, and building a character over time.

**Tagline:** Your real world. Your dungeon.

**Platform:** Android (Google Play + Samsung Galaxy Store)
**Tech Stack:** React Native + Expo
**Timeline:** Aug 23 – Sep 30, 2026 (39 days)
**Team:** Solo developer

---

## Target Prize Categories

1. Best Game ($20k) — primary
2. Best App for Galaxy ($20k) — Samsung-specific features
3. Most Viral / Noise ($15k) — shareable content
4. Catvertising ($20k) — rewarded ads integration
5. Keep Them Coming Back / OneSignal ($25k) — retention via push

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React Native + Expo SDK 54 |
| Navigation | Expo Router (file-based) |
| Maps | react-native-maps (Google Maps provider) |
| GPS | expo-location (foreground + background task) |
| Local Storage | react-native-mmkv (fast key-value for game state) |
| Database | expo-sqlite (quest history, fog-of-war grid) |
| Monetization | react-native-purchases (RevenueCat) |
| Ads | RevenueCat Ads SDK |
| Push Notifications | OneSignal React Native SDK |
| Map Data | OpenStreetMap Overpass API (fetch nearby roads/POIs) |
| Audio | expo-av (sound effects, ambient) |
| Haptics | expo-haptics |
| Build | EAS Build (generates AAB for Play Store, APK for Galaxy Store) |

---

## Core Systems

### 1. GPS Tracking System

```
Responsibilities:
- Track user position in real-time (foreground)
- Record walked path segments
- Detect proximity to waypoints (30m trigger radius)
- Calculate distance walked per quest
- Handle GPS loss gracefully (pause quest, notify user)

Configuration:
- Accuracy: HIGH (GPS + network)
- Update interval: 3 seconds (walking speed)
- Distance filter: 5 meters (ignore micro-movements)
- Background: Foreground service notification ("Quest active")

Permissions:
- ACCESS_FINE_LOCATION
- ACCESS_COARSE_LOCATION
- FOREGROUND_SERVICE
```

### 2. Quest Generation System

```
Input: User's current lat/lng + fog-of-war data
Output: Quest object with 3-5 waypoints forming a walkable route

Algorithm:
1. Query Overpass API for road intersections within 300m-800m radius
2. Filter out waypoints on streets user has already explored (fog data)
3. Select 3-5 points that form a roughly circular route (return to start area)
4. Estimate total distance (target: 1-3 km, or 15-30 min walk)
5. Assign quest template (theme, narrative, encounter types)
6. If insufficient new streets, expand radius or mix 50% new / 50% known

Quest Object Schema:
{
  id: string,
  template: QuestTemplate,
  waypoints: Waypoint[],
  estimatedDistance: number (meters),
  estimatedTime: number (minutes),
  rewards: { xp: number, goldMin: number, goldMax: number },
  encounters: Encounter[],
  status: 'available' | 'active' | 'completed' | 'failed',
  startedAt: timestamp | null,
  completedAt: timestamp | null
}

Waypoint Schema:
{
  id: string,
  lat: number,
  lng: number,
  order: number,
  triggerRadius: 30 (meters),
  reached: boolean,
  encounter: Encounter | null
}
```

### 3. Encounter System

```
Trigger: Player enters waypoint trigger radius (30m)

Encounter Types:
- COMBAT (40%): Fight an enemy, tap-based
- LOOT (30%): Find treasure chest, get items
- EVENT (20%): NPC interaction, choice with consequences
- TRAP (10%): Lose HP or gold, avoidable with high stats

Combat Flow:
1. Enemy appears with HP bar and attack pattern
2. Player taps to attack (each tap = 1 hit)
3. Enemy attacks on a timer (every 2 seconds)
4. Player can use items (potions) from inventory
5. Victory: earn XP + loot drop (rarity roll)
6. Defeat: lose quest progress, offer revive (IAP or ad)

Enemy Scaling:
- Enemy level = quest level ± 1
- HP scales with level: base_hp * (1 + level * 0.3)
- Damage scales similarly
- Boss encounters at final waypoint of quest
```

### 4. Character System

```
Character Schema:
{
  name: string,
  class: 'walker' | 'scout' | 'ranger' | 'knight',
  level: number,
  xp: number,
  xpToNext: number,
  hp: number,
  maxHp: number,
  attack: number,
  defense: number,
  gold: number,
  inventory: Item[],
  equipment: { weapon: Item, armor: Item, accessory: Item },
  stats: {
    totalDistanceKm: number,
    totalQuests: number,
    totalEncounters: number,
    streakDays: number,
    uniqueStreetsExplored: number
  }
}

Classes (unlock at milestones):
- Walker (default): Balanced stats
- Scout (level 5): Higher speed = faster encounter cooldowns
- Ranger (level 10): Better loot drop rates
- Knight (level 15): Higher HP and defense [Pro only]

Leveling:
- XP per waypoint reached: 20-50
- XP bonus for new street: +25
- XP per enemy defeated: 30-80
- XP per quest completed: 100-300
- Level formula: xpToNext = 100 * level^1.5
```

### 5. Fog-of-War System

```
Implementation:
- Divide the world into a grid (cell size: ~50m x 50m)
- Each cell has state: 'hidden' | 'explored'
- When user walks through a cell, mark as 'explored'
- Store explored cells in SQLite (lat_grid, lng_grid, explored_at)
- Render fog as semi-transparent dark overlay on unexplored cells

Grid Calculation:
- lat_grid = floor(lat * 2000) (gives ~50m cells)
- lng_grid = floor(lng * 2000 * cos(lat)) (adjust for longitude distortion)

Visual:
- Explored: full color map
- Unexplored: dark overlay with slight transparency
- Boundary: gradient fade between explored/unexplored
```

### 6. Monetization System (RevenueCat)

```
Products:
1. walkquest_pro_monthly ($4.99/month)
   - Unlimited quests per day (free = 1)
   - All character classes
   - No ads
   - Exclusive cosmetic map themes
   - Priority quest generation (more interesting routes)

2. walkquest_revive_5 ($0.99, consumable)
   - 5 revive tokens
   - Use when character dies to continue quest

3. walkquest_revive_15 ($1.99, consumable)
   - 15 revive tokens (better value)

Rewarded Ads (RevenueCat Ads):
- Placement 1: Quest complete → watch ad → bonus loot item
- Placement 2: Character dies → watch ad → free revive (no token needed)
- Placement 3: Daily bonus → watch ad → double XP for next quest
- Never interrupt gameplay. Always player-initiated.

Entitlements:
- "pro": Grants unlimited quests, all classes, ad-free
- Check on app launch and before quest generation
```

### 7. Push Notification System (OneSignal)

```
Notification Types:
1. Daily Quest Ready (8:00 AM local)
   "Your daily quest awaits! Today's route explores [street name]."

2. Streak Reminder (7:00 PM local, if no quest today)
   "Day [N] streak at risk! Complete a quest before midnight."

3. Level Up Available (triggered by XP threshold)
   "You have enough XP to reach Level [N]! Open WalkQuest to level up."

4. New Area Discovered (weekly digest)
   "This week you explored [N] new streets and cleared [M]% more fog."

5. Re-engagement (3 days inactive)
   "Your character misses the road. A rare quest appeared near [location]."

Segments:
- active_today: completed quest in last 24h
- streak_active: streak > 0
- pro_subscriber: has pro entitlement
- lapsed: no activity in 3+ days

Journeys:
- Day 1: Welcome + first quest nudge
- Day 3: "Try a new route" suggestion
- Day 7: Streak celebration + Pro upsell
- Day 14: Achievement unlocked notification
```

### 8. Samsung Galaxy Features

```
Flex Mode (Foldable):
- Detect fold state using Dimensions API + screen aspect ratio change
- When folded at ~90°:
  - Top half: Full map view with quest route
  - Bottom half: Controls (start quest, inventory, character)
- Use case: Phone propped on bench/table, glance at map hands-free

Galaxy Store Optimization:
- Publish to Samsung Galaxy Store via Seller Portal
- Use Samsung IAP through RevenueCat (native support)
- Add Galaxy Store badge to app
- Test on Galaxy S/Z series if possible

Stretch Goals (if time):
- Galaxy Watch: Wear OS companion showing compass + distance
- Cover Screen (Z Flip): Quest progress widget
- Samsung Health: Pull step count as backup to GPS distance
```

---

## Screen Map

```
app/
├── (tabs)/
│   ├── index.tsx          — Quest Map (main screen)
│   ├── character.tsx      — Character sheet + inventory
│   ├── history.tsx        — Past quests + stats
│   └── shop.tsx           — Pro upgrade + revive tokens
├── quest/
│   ├── [id].tsx           — Active quest view
│   ├── encounter.tsx      — Combat / loot / event screen
│   └── complete.tsx       — Quest complete summary
├── onboarding/
│   ├── index.tsx          — Welcome + permissions
│   ├── tutorial.tsx       — How quests work (3 slides)
│   └── character.tsx      — Name your character + pick class
└── settings.tsx           — Account, notifications, restore purchases
```

---

## Data Flow

```
1. App Launch
   → Check location permission
   → Load character from MMKV
   → Check RevenueCat entitlements
   → Show main map with fog-of-war

2. Start Quest
   → Get current GPS position
   → Query Overpass API for nearby intersections
   → Filter with fog-of-war data
   → Generate quest (waypoints + encounters)
   → Switch to active quest view
   → Start GPS tracking (foreground service)

3. Walking
   → GPS updates every 3 seconds
   → Update position on map
   → Check proximity to next waypoint
   → Update fog-of-war cells
   → Track distance walked

4. Waypoint Reached
   → Haptic buzz + sound effect
   → Mark waypoint as reached
   → Trigger encounter
   → Resolve encounter (combat/loot/event)
   → Award XP + items
   → If last waypoint: quest complete

5. Quest Complete
   → Stop GPS tracking
   → Calculate total rewards
   → Show summary screen
   → Offer: watch ad for bonus loot
   → Save quest to history
   → Update character stats
   → Check level up
   → Schedule OneSignal notification for tomorrow
```

---

## API Dependencies

### OpenStreetMap Overpass API

```
Endpoint: https://overpass-api.de/api/interpreter
Rate limit: ~10,000 requests/day (free, no key needed)
Fallback: https://overpass.kumi.systems/api/interpreter

Query (fetch intersections within radius):
[out:json][timeout:10];
(
  node["highway"="traffic_signals"](around:800,{lat},{lng});
  node["highway"="crossing"](around:800,{lat},{lng});
  node["amenity"](around:800,{lat},{lng});
);
out body;
```

### OpenRouter API (optional, for quest narrative)

```
Used for: Generating quest flavor text and NPC dialogue
Fallback: Template-based text (no API needed)
Model: cheapest available (e.g., llama-3.1-8b)
Ship Kit: OpenRouter is a sponsor, likely free credits
```

---

## File Size Budget

Target APK: < 30 MB

| Component | Estimate |
|-----------|----------|
| React Native runtime | ~8 MB |
| Maps SDK | ~5 MB |
| App code + assets | ~5 MB |
| Sound effects (10 clips) | ~2 MB |
| UI assets (icons, sprites) | ~3 MB |
| Fonts | ~1 MB |
| **Total** | **~24 MB** |

---

## Testing Strategy

- GPS simulation: Use Expo's location mock for development
- Real-device testing: Walk around block with dev build
- Combat balance: Test that average quest takes 15-30 min
- Paywall: Test purchase flow with RevenueCat sandbox
- Samsung: Test Flex Mode detection on emulator / real device if available
- Edge cases: GPS loss, no nearby streets, app backgrounded during quest
