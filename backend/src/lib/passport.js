import dotenv from "dotenv";
dotenv.config(); // Load env variables early

import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/user.model.js"; // Ensure this exports via `export default`

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user exists
        let user = await User.findOne({ googleId: profile.id });

        // If not, create new user
        if (!user) {
          user = await User.create({
            googleId: profile.id,
            fullName: `${profile.name.givenName} ${profile.name.familyName}`,
            email: profile.emails?.[0]?.value || "", // fallback safety
          });
        }

        return done(null, user);
      } catch (error) {
        console.error("Error in GoogleStrategy:", error);
        return done(error, null);
      }
    }
  )
);

// Serialize user into session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export default passport;