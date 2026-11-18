import { toPublicProfile } from "./publicProfile.js";

export function getFeed(db) {
  const rows = db
    .prepare(
      `SELECT id, name, age, photo, bio, city, interests
       FROM profiles
       WHERE id NOT IN (SELECT profile_id FROM swipes)
       ORDER BY id`,
    )
    .all();
  return rows.map(toPublicProfile);
}

export function getMatches(db) {
  const rows = db
    .prepare(
      `SELECT p.id, p.name, p.age, p.photo, p.bio, p.city, p.interests
       FROM matches m
       JOIN profiles p ON p.id = m.profile_id
       ORDER BY m.created_at DESC, m.id DESC`,
    )
    .all();
  return rows.map(toPublicProfile);
}

export function processSwipe(db, profileId, direction) {
  // Validation
  if (!Number.isInteger(profileId) || !["like", "pass"].includes(direction)) {
    return {
      error: "profileId (number) and direction ('like' | 'pass') required",
      status: 400,
    };
  }

  const profile = db
    .prepare("SELECT * FROM profiles WHERE id = ?")
    .get(profileId);
  if (!profile) return { error: "Profile not found", status: 404 };

  // Pehle se swipe ho chuka hai to dobara save nahi krna hai
  const existing = db
    .prepare("SELECT id FROM swipes WHERE profile_id = ?")
    .get(profileId);
  if (existing) {
    const matched = !!db
      .prepare("SELECT id FROM matches WHERE profile_id = ?")
      .get(profileId);
    return { matched, alreadySwiped: true, profile: toPublicProfile(profile) };
  }

  const save = db.transaction(() => {
    db.prepare("INSERT INTO swipes (profile_id, direction) VALUES (?, ?)").run(
      profileId,
      direction,
    );
    if (direction === "like" && profile.likes_me === 1) {
      db.prepare("INSERT INTO matches (profile_id) VALUES (?)").run(profileId);
      return true;
    }
    return false;
  });

  return { matched: save(), profile: toPublicProfile(profile) };
}
