# WalkQuest — Devpost Submission Draft

## App Name
WalkQuest

## Tagline
Your real world. Your dungeon.

## Short Description (80 chars)
A walking RPG that turns your neighborhood into a procedurally generated dungeon.

## Full Description

### What it does

WalkQuest turns every walk into an RPG quest. Open the app, start a quest, and waypoints drop on real streets around you, prioritizing roads you've never explored. Walk to each waypoint to trigger encounters: fight monsters, find treasure, dodge traps, and meet NPCs. Earn XP, level up your character, collect loot, and watch the fog-of-war lift as you explore your neighborhood one street at a time.

### How it works

- **Quest Generation**: Real map data from OpenStreetMap creates waypoints on actual intersections and landmarks near you. The algorithm prioritizes streets you haven't walked before.
- **Fog-of-War**: Every street you walk permanently reveals on your map. Your explored territory is your trophy.
- **Combat**: Simple tap-based battles against enemies scaled to your level. Quick and satisfying, never interrupting your walking flow.
- **Progression**: XP, levels, character classes, equipment, and a streak system that rewards daily play.
- **Daily Quests**: One free quest per day. Pro subscribers get unlimited.

### How we built it

- React Native + Expo for cross-platform development
- expo-location for GPS tracking with foreground service
- react-native-maps with custom styling for the fantasy map aesthetic
- OpenStreetMap Overpass API for real-world map data
- RevenueCat for subscriptions, consumables, and ad monetization
- RevenueCat Ads for rewarded ad placements
- OneSignal for personalized push notifications and retention
- Samsung Flex Mode support for foldable devices
- Published on both Google Play and Samsung Galaxy Store

### Monetization Strategy

- **Free tier**: 1 daily quest, basic Walker class, ads between encounters
- **Pro subscription ($4.99/mo)**: Unlimited quests, all character classes, ad-free experience, exclusive map themes
- **Consumable IAP**: Revive tokens ($0.99 for 5) used when your character falls in battle
- **Rewarded ads**: Watch an ad for bonus loot or a free revive (player-initiated, never forced)

### Samsung Galaxy Optimization

- **Flex Mode**: On Galaxy Z Fold/Flip devices, the app splits into map (top) and controls (bottom) when half-folded, enabling hands-free use on a bench or table.
- **Galaxy Store**: Published natively with Samsung IAP through RevenueCat.
- **Galaxy Watch** [stretch]: Compass + distance to next waypoint on wrist.

### OneSignal Integration

- Daily quest notifications with personalized route info
- Streak-at-risk reminders to drive retention
- Level-up celebration pushes
- Re-engagement campaigns for lapsed players
- Segment-based messaging (active, at-risk, lapsed, pro subscribers)

### Challenges we ran into

[Fill in during/after build]

### What we learned

[Fill in during/after build]

### What's next

- Multiplayer: see friends' fog-of-war on your map, compete for territory
- Guilds: weekly challenges with group rewards
- Seasonal events: time-limited quest themes with exclusive loot
- More character classes and skill trees
- Integration with Samsung Health for step-based bonuses

---

## Categories to Submit To

1. Best Game Award
2. Best App for Galaxy (Samsung)
3. Most Viral App (Noise)
4. Catvertising Award
5. Keep Them Coming Back Award (OneSignal)
6. HAMM Award

---

## Demo Video Outline (2 minutes)

See SPEC.md for full script.

Key moments to capture:
1. Hook: character leveling up, loot dropping
2. Problem: walking apps are boring
3. Solution: live quest gameplay (outdoor footage)
4. Monetization: paywall + rewarded ads
5. Samsung: Flex Mode demo
6. Traction: user numbers + revenue
7. Close: logo + tagline
