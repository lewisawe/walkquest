# WalkQuest — Game Design Document

## Core Fantasy

You are an adventurer. The streets around you are unexplored dungeon corridors. Every intersection is a room that might contain treasure, monsters, or allies. The more you explore, the more powerful you become.

---

## Design Pillars

1. **Real movement matters.** No spoofing, no shortcuts. You walk, you progress.
2. **New routes > same routes.** The game actively rewards deviation from habits.
3. **Sessions are short.** A quest takes 15-30 minutes. Fits a lunch break or commute detour.
4. **Progression is visible.** The fog-of-war map is your trophy case. Every explored street is permanent.
5. **Never punish for stopping.** If you pause or quit, the quest waits. No timers forcing you to rush.

---

## Game Loop

### Micro Loop (per waypoint, 3-5 min)
Walk → Reach waypoint → Encounter → Resolve → Get reward → Next waypoint

### Session Loop (per quest, 15-30 min)
Choose quest → Walk full route → Complete all waypoints → Big reward + level check

### Meta Loop (days/weeks)
Daily quest → Build streak → Level up → Unlock classes → Explore entire neighborhood → Share map

---

## Quest Templates

### 1. Dungeon Crawl
- Theme: Dark corridors, monsters lurking
- Encounters: Mostly COMBAT
- Final waypoint: Boss fight (harder enemy, better loot)
- Flavor: "A darkness spreads from the north. Clear the path."

### 2. Treasure Hunt
- Theme: Ancient map, hidden chest
- Encounters: Mostly LOOT + one TRAP
- Final waypoint: Legendary chest (guaranteed rare+ item)
- Flavor: "A worn map fragment shows gold buried nearby."

### 3. Patrol Mission
- Theme: Defend the area, check outposts
- Encounters: Mix of COMBAT and EVENT
- Final waypoint: Report back (bonus gold)
- Flavor: "Strange activity at the borders. Investigate."

### 4. Escort Quest
- Theme: Guide an NPC safely
- Encounters: COMBAT (protect NPC), EVENT (NPC tells story)
- Final waypoint: NPC arrives safely (bonus XP)
- Flavor: "A merchant needs safe passage through here."

### 5. Scavenger Hunt
- Theme: Collect items scattered along the route
- Encounters: LOOT at every waypoint
- Final waypoint: Combine items for a crafted reward
- Flavor: "The alchemist needs 4 ingredients. Find them."

---

## Encounter Design

### Combat

Simple and quick. Should take 10-30 seconds max.

```
Player Actions:
- TAP to attack (each tap = 1 hit dealing player.attack damage)
- TAP potion button to heal (uses inventory item)
- No dodge/block (keeps it simple)

Enemy Behavior:
- Attacks on a fixed timer (every 2s for weak, 1.5s for strong)
- Each attack deals enemy.attack - player.defense damage (min 1)
- Visual telegraph: enemy glows red 0.5s before attacking

Victory Condition: Enemy HP reaches 0
Defeat Condition: Player HP reaches 0

On Defeat:
- Offer revive: use token (IAP) or watch ad
- If decline: quest fails, keep XP earned so far, lose quest rewards
```

### Enemy Types (by biome/level)

| Level Range | Enemies | HP | Attack |
|-------------|---------|-----|--------|
| 1-3 | Street Rat, Stray Shadow, Gutter Slime | 30-60 | 5-8 |
| 4-7 | Alley Lurker, Fog Wraith, Cobble Golem | 70-120 | 10-15 |
| 8-12 | Road Warden, Iron Vagrant, Storm Hound | 130-200 | 18-25 |
| 13-20 | The Wanderer, Asphalt Drake, Night Sentinel | 220-400 | 30-45 |

### Loot

```
Rarity Tiers:
- Common (60%): +1-2 stat boost, basic consumables
- Uncommon (25%): +3-5 stat boost, named items
- Rare (12%): +6-10 stat boost, special effects
- Legendary (3%): +15+ stat boost, unique visuals

Item Types:
- Weapons: Increase attack stat
- Armor: Increase defense stat
- Accessories: Increase max HP or give bonus effects
- Potions: Restore HP (consumable, used in combat)
- Gold: Currency for shop purchases

Drop Bonuses:
- New street explored: +10% rare chance
- Quest streak (7+ days): +5% legendary chance
- Pro subscriber: +5% rare chance
```

### Events (NPC Interactions)

Short text with a binary choice. Each choice has a different reward.

```
Example:
"A hooded figure blocks the path. They offer a trade:
your oldest item for a mystery pouch."

[Accept] → Lose lowest-rarity item, gain random rare item
[Decline] → Gain 20 gold, figure vanishes

Design Rules:
- Never more than 2 choices
- Always show potential reward/risk
- Never lock progress behind a choice
- Keep text under 3 sentences
```

### Traps

Quick reaction event. Fail = lose HP or gold.

```
Example:
"The ground crumbles beneath you!"
[Tap 5 times in 3 seconds to escape]

Success: Avoid trap, find hidden gold
Failure: Lose 15% HP, continue quest
```

---

## Progression Curve

| Level | XP Required | Quests to Level (approx) | Unlocks |
|-------|-------------|--------------------------|---------|
| 1→2 | 150 | 1 quest | — |
| 2→3 | 260 | 1-2 quests | — |
| 3→4 | 390 | 2 quests | — |
| 4→5 | 530 | 2 quests | Scout class |
| 5→6 | 690 | 3 quests | — |
| 6→7 | 860 | 3 quests | — |
| 7→8 | 1050 | 3-4 quests | — |
| 8→9 | 1260 | 4 quests | — |
| 9→10 | 1490 | 4-5 quests | Ranger class |
| 10→15 | ~2000-3500 | 5-7 quests each | — |
| 15 | — | — | Knight class [Pro] |

A daily player should reach level 5 in about a week, level 10 in 2-3 weeks.

---

## Economy

### Gold Sources
- Quest completion: 50-200 gold
- Loot drops: 10-50 gold
- Selling items: 25-75% of value
- Daily login bonus: 25 gold

### Gold Sinks
- Potions (shop): 30-100 gold
- Equipment (shop): 200-1000 gold
- Cosmetic map themes: 500 gold [stretch goal]

### Balance Principle
A free player should never feel stuck. Gold should flow enough to buy potions. Premium items give advantage but aren't required.

---

## Retention Mechanics

### Daily Quest
- One free quest generated each day at midnight local time
- Includes a unique daily modifier (+25% XP, double gold, rare enemy, etc.)
- Pro users get unlimited quests but daily modifier applies to first quest only

### Streak System
- Complete at least 1 quest per day to maintain streak
- Streak bonuses:
  - Day 3: +50 bonus gold
  - Day 7: Guaranteed rare loot drop
  - Day 14: Legendary loot drop chance doubled
  - Day 30: Exclusive title + cosmetic [stretch]
- Missing a day resets streak to 0
- OneSignal reminder at 7 PM if no quest completed today

### Fog Completion
- Show percentage of local area explored
- Milestones at 25%, 50%, 75%, 100%
- Each milestone = achievement + reward
- Shareable map image at each milestone

---

## Shareability (for Most Viral / Noise)

### Share Triggers
1. **Quest Complete**: Generate image card with route map + stats
2. **Level Up**: Character card with level, class, and total distance
3. **Fog Milestone**: Map showing explored area percentage
4. **Streak Achievement**: "7 day streak!" badge image
5. **Legendary Loot**: Item card with rarity glow

### Share Format
- Branded card image (WalkQuest logo + stats)
- One-tap share to social media via system share sheet
- Include app store link in share text
- "My neighborhood is 34% explored. What's yours?"

---

## Audio Design

### Sound Effects (10 clips needed)
1. Quest start (horn/adventure fanfare)
2. Waypoint reached (magical chime)
3. Combat start (sword unsheathe)
4. Player attack (quick hit)
5. Enemy attack (impact)
6. Enemy defeated (explosion/dissolve)
7. Loot found (chest open + coins)
8. Level up (ascending triumphant)
9. Quest complete (victory fanfare)
10. Trap triggered (rumble/crack)

### Ambient (optional stretch)
- Walking: gentle footstep rhythm on map screen
- Combat: tense loop
- Victory: calm resolution

### Sources
- freesound.org (CC0 clips)
- ElevenLabs sound effects (Ship Kit sponsor)
- Expo-av for playback

---

## Art Direction

### Visual Style
- Map: Parchment/aged paper aesthetic overlaid on real map
- Waypoints: Glowing rune markers (color by encounter type)
- Fog: Dark watercolor wash over unexplored areas
- UI: Medieval-modern hybrid. Clean panels with parchment texture borders.
- Character: Simple 2D portrait (class-based silhouette), not animated

### Color Palette
- Primary: Deep gold (#C5962B)
- Secondary: Forest green (#2B6B4F)
- Danger: Crimson (#8B1A1A)
- Background: Dark parchment (#2A2318)
- Text: Warm white (#F5E6D3)
- Fog: Charcoal (#1A1A1A) at 70% opacity

### Typography
- Headers: Serif (medieval feel) — e.g., Cinzel or similar Google Font
- Body: Clean sans-serif — e.g., Inter
- Numbers/Stats: Monospace — e.g., JetBrains Mono

---

## Scope Tiers

### Must Have (v1.0 — ship by Sep 19)
- [ ] GPS tracking + waypoint proximity detection
- [ ] Quest generation from real map data
- [ ] 3 waypoints per quest minimum
- [ ] Combat encounters (tap to attack)
- [ ] Loot drops with rarity
- [ ] Character with level/XP/gold
- [ ] Inventory screen
- [ ] Fog-of-war (track explored areas)
- [ ] Daily quest system
- [ ] RevenueCat paywall (Pro subscription)
- [ ] Rewarded ads (RevenueCat Ads)
- [ ] OneSignal daily push notification
- [ ] Basic sound effects (3-5 clips)
- [ ] Samsung Flex Mode support
- [ ] Published on Google Play + Galaxy Store

### Should Have (if time after v1.0)
- [ ] 5 quest templates with different encounter mixes
- [ ] Events (NPC choices)
- [ ] Traps (quick-time events)
- [ ] Streak system with visual counter
- [ ] Share cards (quest complete image)
- [ ] All 10 sound effects
- [ ] Polished onboarding (3 screens)
- [ ] Multiple character classes

### Nice to Have (stretch)
- [ ] Galaxy Watch companion
- [ ] Cover Screen widget (Z Flip)
- [ ] Samsung Health step count integration
- [ ] Ambient audio during walks
- [ ] Cosmetic map themes (purchasable)
- [ ] Weekly fog exploration digest
- [ ] Leaderboard (local area)
