import { test } from "node:test";
import assert from "node:assert/strict";
import Database from "better-sqlite3";
import { SCHEMA } from "../lib/schema.js";
import { getFeed, getMatches, processSwipe } from "../lib/swipeService.js";

// Har test ke liye fresh in-memory DB: 1 = liker, 2 = non-liker, 3 = liker
function makeDb() {
  const db = new Database(":memory:");
  db.pragma("foreign_keys = ON");
  db.exec(SCHEMA);
  const ins = db.prepare(
    "INSERT INTO profiles (name, age, photo, bio, city, interests, likes_me) VALUES (?, 20, 'p.jpg', 'bio', 'city', '[\"a\"]', ?)",
  );
  ins.run("Liker One", 1);
  ins.run("Not Liker", 0);
  ins.run("Liker Two", 1);
  return db;
}

test("feed never exposes likes_me", () => {
  const db = makeDb();
  for (const p of getFeed(db)) assert.equal("likes_me" in p, false);
});

test("like on a profile that liked me creates a match", () => {
  const db = makeDb();
  assert.equal(processSwipe(db, 1, "like").matched, true);
});

test("like on a profile that did not like me creates no match", () => {
  const db = makeDb();
  assert.equal(processSwipe(db, 2, "like").matched, false);
  assert.equal(getMatches(db).length, 0);
});

test("pass on a profile that liked me creates no match", () => {
  const db = makeDb();
  assert.equal(processSwipe(db, 1, "pass").matched, false);
  assert.equal(getMatches(db).length, 0);
});

test("swiped profile never appears in feed again", () => {
  const db = makeDb();
  processSwipe(db, 1, "pass");
  processSwipe(db, 2, "like");
  const ids = getFeed(db).map((p) => p.id);
  assert.deepEqual(ids, [3]);
});

test("duplicate swipe does not create duplicate rows", () => {
  const db = makeDb();
  processSwipe(db, 1, "like");
  const again = processSwipe(db, 1, "like");
  assert.equal(again.alreadySwiped, true);
  assert.equal(db.prepare("SELECT COUNT(*) c FROM swipes").get().c, 1);
  assert.equal(db.prepare("SELECT COUNT(*) c FROM matches").get().c, 1);
});

test("swipe response never exposes likes_me", () => {
  const db = makeDb();
  assert.equal("likes_me" in processSwipe(db, 1, "like").profile, false);
});

test("matches list has only mutual matches", () => {
  const db = makeDb();
  processSwipe(db, 1, "like"); // mutual
  processSwipe(db, 2, "like"); // one-sided
  processSwipe(db, 3, "pass"); // passed
  assert.deepEqual(
    getMatches(db).map((p) => p.id),
    [1],
  );
});

test("invalid direction returns 400", () => {
  const db = makeDb();
  assert.equal(processSwipe(db, 1, "love").status, 400);
});

test("unknown profile returns 404", () => {
  const db = makeDb();
  assert.equal(processSwipe(db, 999, "like").status, 404);
});
