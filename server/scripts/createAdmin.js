/**
 * Promote an existing account to admin, or create a new admin account.
 *
 * The public /register endpoint always creates plain "user" accounts (see
 * controllers/userController.js) — this script is the only way to grant
 * dashboard/admin access, and it must be run locally with access to the
 * production MONGO_URI in server/.env.
 *
 * Usage:
 *   node scripts/createAdmin.js you@example.com
 *   node scripts/createAdmin.js you@example.com "Your Name" "a-strong-password"
 *
 * With just an email: promotes that existing account to role "admin".
 * With name + password too: creates the account as admin if it doesn't exist yet.
 */
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/userModel");

async function main() {
  const [, , email, name, password] = process.argv;

  if (!email) {
    console.error("Usage: node scripts/createAdmin.js <email> [name] [password]");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);

  try {
    let user = await User.findOne({ email });

    if (user) {
      user.role = "admin";
      await user.save();
      console.log(`✅ ${email} is now an admin. Log out and back in to refresh your session.`);
      return;
    }

    if (!name || !password) {
      console.error(
        `No account found for ${email}. To create a new admin account, also pass a name and password:\n` +
          `  node scripts/createAdmin.js ${email} "Your Name" "a-strong-password"`,
      );
      process.exitCode = 1;
      return;
    }

    user = await User.create({ name, email, password, role: "admin" });
    console.log(`✅ Created admin account for ${email}.`);
  } finally {
    await mongoose.disconnect();
  }
}

main().catch((error) => {
  console.error("Failed:", error.message);
  process.exit(1);
});
