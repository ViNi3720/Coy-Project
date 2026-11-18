import db from "../lib/db.js";
import profiles from "../lib/profilesData.js";

// purana data htana pdega aur order ko maintain krna pdega match, swipes, profile
db.exec(`
  DELETE FROM matches;
  DELETE FROM swipes;
  DELETE FROM profiles;
`);

db.exec(
  `DELETE FROM sqlite_sequence WHERE name IN ('matches', 'swipes', 'profiles');`,
);

const insertProfile = db.prepare(`
  INSERT INTO profiles (name, age, photo, bio, city, interests, likes_me)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

const seedAll = db.transaction((list) => {
  for (const p of list) {
    insertProfile.run(
      p.name,
      p.age,
      p.photo,
      p.bio,
      p.city,
      JSON.stringify(p.interests), // array ko text me badlo
      p.likes_me,
    );
  }
});

seedAll(profiles);

const total = db.prepare("SELECT COUNT(*) AS c FROM profiles").get().c;
const likers = db
  .prepare("SELECT COUNT(*) AS c FROM profiles WHERE likes_me = 1")
  .get().c;

console.log(`Seeded ${total} profiles (${likers} already like the user)`);
