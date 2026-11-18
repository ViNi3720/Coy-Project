export function toPublicProfile(row) {
  // whi feild return krenge jo fronted ko need hai
  return {
    id: row.id,
    name: row.name,
    age: row.age,
    photo: row.photo,
    bio: row.bio,
    city: row.city,
    // text ko array bna do
    interests: JSON.parse(row.interests || "[]"),
  };
}
