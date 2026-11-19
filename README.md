# Coy-pro

This is my submission for the Coy SDE Intern assignment. I built a swipe-based Discover tab (think Tinder or Bumble) as a standalone app, with a blank Home tab next to it as asked.

The one rule I kept in mind the whole time is Coy's core promise: nobody finds out who liked them unless it's mutual. Most of the decisions below come from that.

## Running it

You need Node 20.9+ or newer.

```bash
npm install
npm run seed
npm run dev
```

Then open http://localhost:3000. On a desktop it shows up as a phone-sized frame, but it's built mobile-first, so it's best tried on a phone-sized screen.

`npm run seed` creates the SQLite database with 30 mock profiles. You can run it again anytime to reset everything. To run the tests:

```bash
npm test
```

## What I used

- Next.js (App Router) with plain JavaScript, and Tailwind for styling
- Framer Motion for the drag and swipe animations
- Next.js API routes for the backend, so frontend and backend live in one project
- SQLite through better-sqlite3

I picked SQLite because there is nothing to install or configure. Whoever clones the repo can run it in three commands, and I still get real SQL features like unique constraints, which I rely on.

## How it works

**Swiping.** One card at a time. On mobile you drag it, on desktop you can use the two buttons or the left and right arrow keys. While dragging, a LIKE or NOPE stamp fades in so you know what will happen when you let go. A profile you have swiped on never comes back.

**Matching.** A match is created only when you like someone who had already liked you. Then you get the "It's a match!" screen. The Matches page lists all mutual matches.

**Empty state.** When you run out of profiles, you see a "you're all caught up" screen instead of a blank page.

**Demo reset.** There is a small "Reset demo" link on the Matches page that clears all swipes and matches. I added it so the demo can be repeated without touching the database by hand.

The seed data has 30 profiles, and 9 of them have already liked the logged-in user. These are Rohan, Kavya, Vikram, Tanvi, Siddharth, Ishita, Rahul, Simran and Shreya. Liking any of them will trigger a match. Liking the other 21 won't, which is useful for checking that one-sided likes never leak.

## API

| Endpoint           | What it does                                                                                         |
| ------------------ | ---------------------------------------------------------------------------------------------------- |
| `GET /api/feed`    | Returns profiles you haven't swiped on yet                                                           |
| `POST /api/swipe`  | Takes `{ profileId, direction }` where direction is `like` or `pass`. Returns `{ matched, profile }` |
| `GET /api/matches` | Returns your mutual matches                                                                          |
| `POST /api/reset`  | Clears swipes and matches (for demo only)                                                            |

## Keeping the "who liked you" promise

Each profile has a private `likes_me` column in the database. The backend uses it to decide if a like becomes a match, but it never goes to the browser.

Every response goes through one small function, `toPublicProfile`, which returns only the safe fields (name, age, photo, bio, city, interests). The feed query doesn't even select `likes_me`. I wanted this enforced on the server, because hiding it in the UI wouldn't help: anyone could open the Network tab and read it.

The swipe response only says `matched: true` or `false`. The Matches page reads only from the matches table, so a one-sided like can never show up there.

## A few decisions worth mentioning

- **No profile twice.** The swipes table has a unique constraint on the profile id. Even if someone double-clicks fast, or replays a request, the second one is ignored.
- **Swipe and match are saved together.** They happen in one database transaction, so there's no half-saved state.
- **The UI feels instant, but stays honest.** The card leaves the screen right away and the API call happens in the background. If the call fails, the card comes back and an error is shown, so the screen never disagrees with the database.
- **Logic is separate from routes.** The matching logic lives in `lib/swipeService.js` and receives the database as an argument. That lets my tests run on an in-memory database without ever touching the real data file.

## Tests

The tests are in `tests/matchLogic.test.js` and use Node's built-in test runner, so there's nothing extra to install. They check things like:

- the feed and swipe responses never contain `likes_me`
- a like on someone who liked me makes a match
- a like on someone who didn't, or a pass on someone who did, makes no match
- a swiped profile never shows up in the feed again
- swiping the same profile twice doesn't create duplicate rows
- bad input gets a 400 and an unknown profile gets a 404

## Folder layout

```
app/           pages and API routes
components/    TabBar, SwipeCard, CardStack, MatchModal, MatchesList, EmptyState
lib/           database, schema, swipe logic, mock profile data
scripts/       seed script
tests/         backend tests
```

## What I'd do with more time

- Add an undo for the last pass
- Add real photo uploads instead of placeholder images
- Run the swipe logic against a proper multi-user setup instead of one fixed user
- Add a few end-to-end tests that drive the UI

Thanks for taking a look!
