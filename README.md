# Sude Academic Widgets

A small, self-contained widget dashboard designed to be embedded into Notion.

## Included
- Dynamic date / greeting
- Live clock
- Countdown
- Daily study progress
- Study time
- Deep work time
- Focus timer
- Weekly study overview

## Personalize
Open `script.js` and edit the `CONFIG` object:
- `name`
- `countdownDate`
- `dailyGoalHours`
- `studyTodayHours`
- `deepWorkTodayHours`
- `weekHours`

## Put it in Notion
The widget must be hosted at a public HTTPS URL. Once hosted:
1. Copy the URL.
2. In Notion type `/embed`.
3. Paste the URL.
4. Resize the embed.

## Next phase
The demo data can later be replaced by live Notion API data. That requires a small backend so the Notion secret is not exposed in the browser.
