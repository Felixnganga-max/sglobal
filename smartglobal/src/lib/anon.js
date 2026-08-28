/**
 * Stable anonymous visitor identity — no accounts, no personal data.
 * Generated once per browser and cached in localStorage so a visitor's
 * actions (add to cart, read a blog, ...) can be grouped under one
 * friendly name in the activity dashboard.
 */

const ID_KEY = "sg_anon_id";
const NAME_KEY = "sg_anon_name";

const ADJECTIVES = [
  "Swift", "Curious", "Quiet", "Bold", "Clever", "Gentle", "Bright", "Calm",
  "Eager", "Witty", "Sunny", "Brave", "Sharp", "Kind", "Lively", "Nimble",
  "Wise", "Merry", "Cool", "Keen",
];

const ANIMALS = [
  "Falcon", "Otter", "Panther", "Sparrow", "Fox", "Heron", "Lynx", "Badger",
  "Wolf", "Hare", "Eagle", "Dolphin", "Tiger", "Panda", "Owl", "Rabbit",
  "Bear", "Crane", "Zebra", "Koala",
];

function randomId() {
  return `anon_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

function randomName() {
  const adjective = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const animal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
  const num = Math.floor(Math.random() * 90) + 10;
  return `${adjective} ${animal} ${num}`;
}

/** Returns { anonId, anonName } for this browser, creating and persisting it on first call. */
export function getAnonIdentity() {
  let anonId, anonName;
  try {
    anonId = localStorage.getItem(ID_KEY);
    anonName = localStorage.getItem(NAME_KEY);
    if (!anonId) {
      anonId = randomId();
      localStorage.setItem(ID_KEY, anonId);
    }
    if (!anonName) {
      anonName = randomName();
      localStorage.setItem(NAME_KEY, anonName);
    }
  } catch {
    // Storage unavailable (private mode, etc.) — fall back to an
    // ephemeral identity for this page load only.
    anonId = anonId || randomId();
    anonName = anonName || randomName();
  }
  return { anonId, anonName };
}
