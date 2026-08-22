# WalkQuest — Build Plan

## Timeline: Aug 23 – Sep 30, 2026 (39 days)

**Strategy:** Ship to stores by Sep 19. That gives 11 days for store review + post-launch traction before the Sep 30 deadline.

---

## Week 1: Core GPS + Walk Loop (Aug 23–29)

### Goal
You can start a quest, walk to real waypoints, and complete it.

### Daily Breakdown

**Sat Aug 23 — Project Setup + GPS**
- [ ] `npx create-expo-app WalkQuest --template tabs`
- [ ] Install: expo-location, react-native-maps, react-native-mmkv
- [ ] Configure app.json (permissions, Google Maps API key)
- [ ] Get GPS position displaying on screen
- [ ] Show user dot on a map

**Sun Aug 24 — Overpass API Integration**
- [ ] Write Overpass API query fetcher (intersections within radius)
- [ ] Parse response into waypoint candidates [{lat, lng, type}]
- [ ] Display fetched points on map as markers
- [ ] Test: see real intersections near your location on map

**Mon Aug 25 — Quest Generation Algorithm**
- [ ] Waypoint selection: pick 3-5 points forming a walkable loop
- [ ] Route ordering: nearest-neighbor or simple circular sort
- [ ] Distance estimation: sum straight-line distances between waypoints
- [ ] Quest object creation with schema from SPEC.md
- [ ] Test: generate a quest and see waypoints numbered on map

**Tue Aug 26 — Walk State Machine**
- [ ] States: IDLE → QUEST_ACTIVE → APPROACHING → WAYPOINT_REACHED → QUEST_COMPLETE
- [ ] GPS watcher: calculate distance to next waypoint every update
- [ ] Proximity detection: when distance < 30m, trigger WAYPOINT_REACHED
- [ ] UI updates: show distance to next waypoint, update on each GPS tick
- [ ] Test: walk to a waypoint and see state change

**Wed Aug 27 — Map UI**
- [ ] Style map (dark theme or parchment overlay)
- [ ] Draw route line between waypoints (polyline)
- [ ] Custom waypoint markers (numbered, color-coded)
- [ ] User position marker (distinct from waypoints)
- [ ] Auto-center camera on user with heading
- [ ] Test: visually follow your route on the map as you walk

**Thu Aug 28 — Fog-of-War (Basic)**
- [ ] Grid system: divide world into 50m cells
- [ ] Track which cells user has walked through
- [ ] Store in MMKV or SQLite
- [ ] Render explored vs unexplored (overlay circles or grid)
- [ ] Test: walk a route, see fog clear behind you

**Fri Aug 29 — Polish + End-to-End Test**
- [ ] Haptic buzz when waypoint reached (expo-haptics)
- [ ] "Quest Complete" screen with basic stats
- [ ] Full walkthrough: start quest → walk all waypoints → complete
- [ ] Fix any GPS issues found during real walk test
- [ ] Commit clean codebase to git

### Week 1 Deliverable
Open app → see map → start quest → walk to 3 waypoints → quest completes. Core loop works.

---

## Week 2: Game Layer (Aug 30 – Sep 5)

### Goal
Walking has consequences. Encounters, loot, levels, and a reason to come back tomorrow.

### Daily Breakdown

**Sat Aug 30 — Character + Data Model**
- [ ] Character schema in MMKV (level, xp, hp, gold, attack, defense)
- [ ] Initial character creation (name input, default class)
- [ ] Character screen UI (stats display, portrait placeholder)
- [ ] XP bar showing progress to next level

**Sun Aug 31 — Encounter System**
- [ ] Assign random encounter type to each waypoint on quest creation
- [ ] When waypoint reached, route to encounter screen
- [ ] Encounter screen shell: different UI per type (combat, loot, event)
- [ ] After encounter resolves, return to quest walk view

**Mon Sep 1 — Combat**
- [ ] Combat screen: enemy HP bar, player HP bar, tap area
- [ ] Tap to attack: each tap reduces enemy HP by player.attack
- [ ] Enemy attacks on timer: reduce player HP every 2 seconds
- [ ] Victory: enemy HP hits 0 → show loot
- [ ] Defeat: player HP hits 0 → offer revive or fail quest

**Tue Sep 2 — Loot System**
- [ ] Item schema: {name, type, rarity, statBonus, value}
- [ ] Item generation: random item from pool based on rarity roll
- [ ] Loot screen: show item with rarity glow + "Equip" / "Keep" buttons
- [ ] Inventory: list of owned items, equip/sell actions
- [ ] Gold drops alongside items

**Wed Sep 3 — XP + Leveling**
- [ ] Award XP on: waypoint reached, enemy defeated, quest completed
- [ ] Bonus XP for new streets (check fog-of-war)
- [ ] Level up detection: when xp >= xpToNext
- [ ] Level up screen: stat increases, celebration
- [ ] Update character stats on level up

**Thu Sep 4 — Quest Templates**
- [ ] Create 3 quest templates (Dungeon Crawl, Treasure Hunt, Patrol)
- [ ] Each template defines encounter type distribution
- [ ] Template determines flavor text on quest start/complete
- [ ] Random template selection on quest generation

**Fri Sep 5 — Daily Quest + Streak**
- [ ] Track "last quest completed" date in MMKV
- [ ] Daily quest available: reset at midnight local time
- [ ] Streak counter: increment on consecutive days, reset on miss
- [ ] Show streak on main screen
- [ ] Test full game loop: quest → combat → loot → level → next day → new quest

### Week 2 Deliverable
Full game loop. Walk → fight enemies → get loot → level up → come back tomorrow for daily quest.

---

## Week 3: Monetization + Samsung (Sep 6–12)

### Goal
Money flows. Samsung features work. Push notifications fire.

### Daily Breakdown

**Sat Sep 6 — RevenueCat Setup**
- [ ] Create RevenueCat account + project
- [ ] Set up Google Play Console (app listing, internal testing track)
- [ ] Set up Samsung Seller Portal (register as seller)
- [ ] Create products: Pro monthly ($4.99), Revive 5-pack ($0.99), Revive 15-pack ($1.99)
- [ ] Configure entitlements in RevenueCat dashboard

**Sun Sep 7 — Paywall Implementation**
- [ ] Install react-native-purchases
- [ ] Initialize RevenueCat SDK on app launch
- [ ] Check "pro" entitlement before allowing 2nd quest
- [ ] Paywall screen: show Pro benefits, purchase button
- [ ] Handle purchase success/failure
- [ ] Restore purchases button

**Mon Sep 8 — RevenueCat Ads**
- [ ] Integrate RevenueCat Ads SDK
- [ ] Rewarded ad placement: quest complete → "Watch ad for bonus loot"
- [ ] Rewarded ad placement: character dies → "Watch ad to revive"
- [ ] Test ad display and reward callback
- [ ] Track: user chose ad vs user chose IAP

**Tue Sep 9 — Consumable IAP**
- [ ] Revive token purchase flow
- [ ] Token balance stored in MMKV (server truth via RevenueCat)
- [ ] Consume token on use (revive in combat)
- [ ] Show token count in combat defeat screen
- [ ] Test: buy tokens, use tokens, verify balance

**Wed Sep 10 — Samsung Flex Mode**
- [ ] Detect screen fold angle / aspect ratio change
- [ ] When in Flex Mode: split layout
  - Top half: map view (full width, half height)
  - Bottom half: quest controls + character mini-stats
- [ ] Test with Samsung emulator or responsive layout testing
- [ ] Fallback: normal layout on non-foldable devices

**Thu Sep 11 — OneSignal**
- [ ] Create OneSignal account + app
- [ ] Install OneSignal React Native SDK
- [ ] Register device on app launch
- [ ] Set user tags: level, streak, last_quest_date, is_pro
- [ ] Create segments: active_today, streak_at_risk, lapsed
- [ ] Schedule: daily quest reminder (8 AM), streak warning (7 PM)
- [ ] Test: receive push, tap opens app

**Fri Sep 12 — Integration Testing**
- [ ] Full flow test: free user hits paywall on 2nd quest
- [ ] Full flow test: purchase Pro, verify unlimited quests
- [ ] Full flow test: watch ad, receive bonus loot
- [ ] Full flow test: buy revives, use in combat
- [ ] Full flow test: receive OneSignal push, open app to quest
- [ ] Full flow test: Flex Mode activates on fold

### Week 3 Deliverable
Revenue works end-to-end. Samsung demo-ready. Push notifications firing.

---

## Week 4: Polish + Ship (Sep 13–19)

### Goal
App looks professional. Submitted to both stores.

### Daily Breakdown

**Sat Sep 13 — Visual Overhaul**
- [ ] Map style: parchment/fantasy theme (custom map style JSON)
- [ ] Waypoint markers: custom icons (rune symbols)
- [ ] Quest card redesign: themed backgrounds per template
- [ ] Color palette applied consistently
- [ ] Fonts installed (Cinzel headers, Inter body)

**Sun Sep 14 — Animations + Polish**
- [ ] Waypoint reached: marker pulse animation
- [ ] Loot reveal: item slides up with rarity glow
- [ ] Level up: XP bar fills + flash + confetti
- [ ] Combat: enemy shake on hit, red flash on player hit
- [ ] Screen transitions: smooth fades

**Mon Sep 15 — Onboarding**
- [ ] Screen 1: "Your neighborhood is a dungeon" (map visual)
- [ ] Screen 2: "Walk to waypoints, fight monsters, find loot" (gameplay)
- [ ] Screen 3: "Explore new streets for rare rewards" (fog visual)
- [ ] Character creation: name input + class picker
- [ ] Permission request: location (explain why)
- [ ] First quest auto-starts after onboarding

**Tue Sep 16 — Sound + Haptics**
- [ ] Source 5-10 royalty-free sound effects
- [ ] Implement audio playback on key events
- [ ] Haptic patterns: light (waypoint), medium (combat hit), heavy (level up)
- [ ] Mute toggle in settings

**Wed Sep 17 — Store Assets**
- [ ] App icon: 1024x1024 (fantasy compass/map theme)
- [ ] Screenshots: 1179x2556 (map view, combat, loot, character, quest complete)
- [ ] Feature graphic: 1024x500 (for Play Store)
- [ ] Short description (80 chars)
- [ ] Full description (4000 chars)
- [ ] Privacy policy page (simple hosted page)

**Thu Sep 18 — Build + Submit**
- [ ] EAS Build: generate AAB for Google Play
- [ ] Upload to Google Play Console (internal → production)
- [ ] EAS Build: generate APK for Samsung Galaxy Store
- [ ] Upload to Samsung Seller Portal
- [ ] Set pricing: Free (with IAP)
- [ ] Submit both for review

**Fri Sep 19 — Fix Review Issues**
- [ ] Monitor review status
- [ ] Fix any rejection reasons immediately
- [ ] Prepare promo code for judges (RevenueCat promotional entitlement)
- [ ] Test production build on real device

### Week 4 Deliverable
App live on Google Play + Samsung Galaxy Store. Looks professional.

---

## Week 5: Growth + Submit (Sep 20–30)

### Goal
Get real users. Create content. Submit to Devpost.

### Daily Breakdown

**Sat Sep 20 — Demo Video**
- [ ] Record 2-minute demo video following script in SPEC
- [ ] Film real outdoor walking footage with app visible
- [ ] Screen-record gameplay moments (combat, loot, level up)
- [ ] Edit together with voiceover
- [ ] Upload to YouTube (unlisted or public)

**Sun Sep 21 — Launch Content**
- [ ] First #BuildInPublic post: "I built a walking RPG for Shipaton"
- [ ] Record short TikTok/Reels: walk outside, show quest appearing
- [ ] Post in Shipaton Discord #post-engagement-boost channel
- [ ] Share app store link

**Mon Sep 22 — Distribution**
- [ ] Post on r/AndroidGaming, r/IndieGaming, r/incremental_games
- [ ] Post on X/Twitter with gameplay GIF
- [ ] Cross-post in any relevant walking/fitness communities
- [ ] Ask friends to download and leave reviews

**Tue Sep 23 — Noise Content**
- [ ] Create 3 short video clips for Noise (Most Viral category)
- [ ] Format: vertical video, show real quest gameplay in different locations
- [ ] Add captions + hook text
- [ ] Upload via Noise platform

**Wed Sep 24 — Monitor + Iterate**
- [ ] Check RevenueCat dashboard: any revenue?
- [ ] Check OneSignal: notification delivery rates
- [ ] Check Play Console: downloads, ratings, crashes
- [ ] Fix top crash/bug if any
- [ ] Push update to stores if needed

**Thu Sep 25 — Devpost Submission Draft**
- [ ] Write project description (features, tech, story)
- [ ] Add demo video link
- [ ] Add store links (Play Store + Galaxy Store)
- [ ] Upload app icon + screenshots
- [ ] Select prize categories

**Fri Sep 26 — Devpost Submit**
- [ ] Final review of submission
- [ ] Submit to Devpost
- [ ] Verify all links work
- [ ] Generate promo code / free trial for judges

**Sat-Tue Sep 27-30 — Keep Growing**
- [ ] Daily #BuildInPublic posts showing traction
- [ ] Respond to any user feedback
- [ ] Post engagement numbers (downloads, quests completed, km walked)
- [ ] Final Devpost edits if needed before deadline (Sep 30 11:45 PM PDT)

### Week 5 Deliverable
Devpost submitted. Real users. Revenue on dashboard. Growth content live.

---

## Backup: Switch to Clerk

**Trigger to switch:** If by end of Week 1 (Aug 29) the GPS + map core is fundamentally broken or the walk loop doesn't feel right, pivot to Clerk.

**Clerk timeline if pivoting Aug 30:**
- Week 2: Camera + LLM integration + field cards UI
- Week 3: Monetization + Samsung Flex Mode
- Week 4: Polish + ship
- Week 5: Growth + submit

You'd still have 32 days, which is plenty for Clerk's simpler scope.

---

## Key Risks + Mitigations

| Risk | Mitigation |
|------|-----------|
| GPS inaccurate in dense areas | Increase waypoint trigger radius to 50m; use network location as fallback |
| Overpass API slow/down | Cache nearby map data on first query; have 2 fallback servers |
| Game isn't fun | Playtest by day 5 of Week 2. If combat feels bad, simplify to "tap X times to win" |
| Store review rejection | Submit early (Sep 18). Common issues: location permission justification, ad disclosure |
| No traction post-launch | Lean on #BuildInPublic content + Shipaton Discord. The game's shareability should help. |
| Samsung device not available for testing | Use Samsung Remote Test Lab (free for registered devs) |
| RevenueCat Ads slow to set up | Fall back to AdMob with RevenueCat tracking if Ads SDK has issues |
