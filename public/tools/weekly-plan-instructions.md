# Weekly Plan JSON — Schema & Instructions

Use these instructions in a Claude project to generate valid JSON for the [Rovani Family Week Planner](/tools/weekly-plan).

## Claude Project Instructions

**Output Format**: When the weekly plan is finalized, output a single JSON code block matching the schema below. Do not output HTML.

**Rules**:
- `weekdays` array must have exactly 5 entries (Monday–Friday), in order
- `saturday` and `sunday` are separate top-level fields
- Use string arrays for multi-line content (each line is an array element)
- Emojis go directly in content strings
- `bedtime` pairs use lowercase family member names: `"david"`, `"katie"`, `"alex"`, `"sebastian"`, `"evangeline"`
- `banner` is optional per day — use for travel, arrivals/departures, special events
- `weekendBanner` is optional — use for multi-day events like "Alex Weekend"
- Section titles should be short labels: "Morning", "Workouts", "After School", "Dinner", "Evening", "Appointments", "School", "Activity", etc.
- Sections are ordered as they should display on the card
- `lunchSnacks` and `lookAhead` are arrays of strings (each line is an element)

The JSON will be pasted into rovani.net/tools/weekly-plan which renders and prints the schedule.

## JSON Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["weekDates", "weekdays", "saturday", "sunday", "lunchSnacks", "lookAhead"],
  "properties": {
    "weekDates": { "type": "string", "description": "Display string, e.g. 'March 2–8, 2026'" },
    "weekdays": {
      "type": "array",
      "items": { "$ref": "#/$defs/DayPlan" },
      "minItems": 5,
      "maxItems": 5,
      "description": "Monday through Friday, in order"
    },
    "weekendBanner": { "$ref": "#/$defs/DayBanner", "description": "Optional banner spanning both weekend days (e.g. 'Alex Weekend')" },
    "saturday": { "$ref": "#/$defs/DayPlan" },
    "sunday": { "$ref": "#/$defs/DayPlan" },
    "lunchSnacks": {
      "type": "array",
      "items": { "type": "string" },
      "description": "Content for Lunch & Snack Options card. Each element is one line."
    },
    "lookAhead": {
      "type": "array",
      "items": { "type": "string" },
      "description": "Content for Look Ahead card. Each element is one line."
    }
  },
  "$defs": {
    "FamilyMember": {
      "type": "string",
      "enum": ["david", "katie", "alex", "sebastian", "evangeline"]
    },
    "DayBanner": {
      "type": "object",
      "required": ["text", "familyMember"],
      "properties": {
        "text": { "type": "string" },
        "familyMember": { "$ref": "#/$defs/FamilyMember" }
      }
    },
    "DaySection": {
      "type": "object",
      "required": ["title", "content"],
      "properties": {
        "title": { "type": "string", "description": "Section heading, e.g. 'Morning', 'Dinner', 'After School'" },
        "content": {
          "type": "array",
          "items": { "type": "string" },
          "description": "Section body. Each element is one line."
        }
      }
    },
    "BedtimePair": {
      "type": "object",
      "required": ["child", "parent"],
      "properties": {
        "child": { "type": "string", "enum": ["alex", "sebastian", "evangeline"] },
        "parent": { "type": "string", "enum": ["david", "katie"] }
      }
    },
    "DayPlan": {
      "type": "object",
      "required": ["dayName", "date", "sections"],
      "properties": {
        "dayName": { "type": "string", "description": "e.g. 'Monday', 'Saturday'" },
        "date": { "type": "string", "description": "e.g. 'Mar 2', 'Jan 26'" },
        "banner": { "$ref": "#/$defs/DayBanner" },
        "sections": {
          "type": "array",
          "items": { "$ref": "#/$defs/DaySection" },
          "description": "Flexible sections in display order"
        },
        "bedtime": {
          "type": "array",
          "items": { "$ref": "#/$defs/BedtimePair" },
          "description": "Bedtime child-to-parent assignments. Rendered as color-coded chips."
        }
      }
    }
  }
}
```

## Example JSON

```json
{
  "weekDates": "March 2–8, 2026",
  "weekdays": [
    {
      "dayName": "Monday",
      "date": "Mar 2",
      "sections": [
        { "title": "Workouts", "content": ["David: Peloton"] },
        { "title": "Morning", "content": ["S & E wake: 6:45am"] },
        { "title": "After School", "content": ["🤸 Altitude Trampoline"] },
        { "title": "Dinner", "content": ["Skillet chicken, green beans, penne pasta"] }
      ],
      "bedtime": [
        { "child": "evangeline", "parent": "david" },
        { "child": "sebastian", "parent": "katie" }
      ]
    },
    {
      "dayName": "Tuesday",
      "date": "Mar 3",
      "banner": { "text": "✈️ Katie departs for Denver", "familyMember": "katie" },
      "sections": [
        { "title": "Morning", "content": ["S & E wake: 6:45am"] },
        { "title": "Appointments", "content": ["Sebastian ENT 11:15am"] },
        { "title": "After School", "content": ["🎯 Kids' choice"] },
        { "title": "Dinner", "content": ["🌮 Taco Tuesday"] },
        { "title": "Evening", "content": ["🦐 Defrost shrimp for Wednesday"] }
      ],
      "bedtime": [
        { "child": "sebastian", "parent": "david" },
        { "child": "evangeline", "parent": "david" }
      ]
    },
    {
      "dayName": "Wednesday",
      "date": "Mar 4",
      "banner": { "text": "🏡 Katie returns from Denver", "familyMember": "katie" },
      "sections": [
        { "title": "Morning", "content": ["S & E wake: 6:45am"] },
        { "title": "After School", "content": ["🎯 Kids' choice"] },
        { "title": "Evening", "content": ["Alex arrives 4pm"] },
        { "title": "Dinner", "content": ["Charcuterie board", "(defrost shrimp tonight)"] }
      ],
      "bedtime": [
        { "child": "sebastian", "parent": "david" },
        { "child": "evangeline", "parent": "david" }
      ]
    },
    {
      "dayName": "Thursday",
      "date": "Mar 5",
      "sections": [
        { "title": "Morning", "content": ["All wake: 6:45am", "Take Alex to school 7:15am"] },
        { "title": "School", "content": ["CM PTC", "Evangeline 2–2:30pm", "Sebastian 2:30–3pm"] },
        { "title": "Dinner", "content": ["Homemade burgers, sautéed onions, homemade fries"] }
      ],
      "bedtime": [
        { "child": "sebastian", "parent": "david" },
        { "child": "evangeline", "parent": "katie" }
      ]
    },
    {
      "dayName": "Friday",
      "date": "Mar 6",
      "sections": [
        { "title": "Workouts", "content": ["David: Peloton"] },
        { "title": "Morning", "content": ["S & E wake: 6:45am", "Alex departs 9am"] },
        { "title": "After School", "content": ["🤸 Altitude Trampoline"] },
        { "title": "Dinner", "content": ["🍽️ Chipotle"] },
        { "title": "Evening", "content": ["✨ Evangeline: Daisy 6:30pm", "at Pilgrim Lutheran"] }
      ],
      "bedtime": [
        { "child": "evangeline", "parent": "david" },
        { "child": "sebastian", "parent": "katie" }
      ]
    }
  ],
  "saturday": {
    "dayName": "Saturday",
    "date": "Mar 7",
    "sections": [
      { "title": "Activity", "content": ["🥁 Sebastian: Drum Kit 3–4pm", "at Old Town School of Folk Music"] },
      { "title": "Dinner", "content": ["Baked ziti & salad", "(making extras for Hardy & Benusa families)"] }
    ],
    "bedtime": [
      { "child": "sebastian", "parent": "david" },
      { "child": "evangeline", "parent": "katie" }
    ]
  },
  "sunday": {
    "dayName": "Sunday",
    "date": "Mar 8",
    "sections": [
      { "title": "Dinner", "content": ["🍲 Pot roast", "(longer prep, open day)"] }
    ],
    "bedtime": [
      { "child": "evangeline", "parent": "david" },
      { "child": "sebastian", "parent": "katie" }
    ]
  },
  "lunchSnacks": [
    "Lunch:",
    "🫐 Blueberries & 🍓 strawberries",
    "🍕 Salami slices",
    "🧀 Cheese slices",
    "🍘 Ritz & Club crackers",
    "🥣 Honey Nut Cheerios & milk",
    "",
    "Snacks:",
    "🍎 Apples & 🥜 peanut butter",
    "🥩 Chomps meat sticks",
    "🫘 Kirkland granola bars",
    "🍘 Ritz & Club crackers",
    "🍕 Salami slices",
    "🧀 Cheese slices"
  ],
  "lookAhead": [
    "Key dates & patterns:",
    "• Alex: Standard schedule (Wed dinner–Thurs morning)",
    "• CM School Days: M–F (8:20am–3:30pm)",
    "• Tuesday (Mar 11): CARA River Rats at 6:30pm (quick dinner)",
    "• Friday (Mar 13): Evangeline Daisy (bi-weekly, alternate week off)",
    "• Saturday (Mar 14): Sebastian Drum Kit 3–4pm (continues weekly)",
    "",
    "Upcoming events to plan:",
    "• Spring break timing (check CM calendar)",
    "• Any CM parent education meetings?",
    "• Katie's work travel plans",
    "",
    "Meal ideas for next week:",
    "Consider protein variety: fish, pork, beef, pasta, or vegetarian options to rotate through the week."
  ]
}
```

## Family Member Colors

| Member | Color | Hex |
|--------|-------|-----|
| David | Gold | #d4af37 |
| Katie | Green | #2d7d46 |
| Alex | Orange | #e67e22 |
| Sebastian | Red | #c1292e |
| Evangeline | Purple | #7b2d8f |

## Notes

- Katie appears as "M" (Mom) on bedtime chips
- Bedtime `child` can only be: alex, sebastian, evangeline
- Bedtime `parent` can only be: david, katie
- Empty strings in arrays create blank lines (useful for visual spacing in lunchSnacks and lookAhead)
