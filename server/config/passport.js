const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const User = require("../models/User");

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
          return done(null, false, { message: "Invalid email or password" });
        }
        if (user.provider !== "local") {
          return done(null, false, {
            message: `Account registered with ${user.provider} provider`,
          });
        }
        if (!user.password) {
          return done(null, false, { message: "No password set for this account" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: "Invalid email or password" });
        }
        return done(null, user);
      } catch (error) {
        console.error("Local Strategy error:", error);
        return done(error);
      }
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/auth/google/callback`,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        console.log("Google Strategy: Processing profile", {
          id: profile.id,
          email: profile.emails[0].value,
          name: profile.displayName,
        });

        let user = await User.findOne({
          $or: [
            { googleId: profile.id },
            { email: profile.emails[0].value.toLowerCase() },
          ],
        });

        if (user) {
          console.log("Google Strategy: Found user", { email: user.email, provider: user.provider });
          if (user.provider !== "google") {
            console.log("Google Strategy: Email registered with different provider");
            return done(null, false, {
              message: `Email is registered with ${user.provider} provider`,
            });
          }
          if (!user.googleId) {
            console.log("Google Strategy: Linking googleId to existing user");
            user.googleId = profile.id;
            user.provider = "google";
            await user.save();
          }
          return done(null, user);
        }

        console.log("Google Strategy: Creating new user");
        user = new User({
          googleId: profile.id,
          email: profile.emails[0].value.toLowerCase(),
          name: profile.displayName,
          provider: "google",
          role: "user",
        });
        await user.save();
        return done(null, user);
      } catch (error) {
        console.error("Google Strategy error:", error);
        return done(error, null);
      }
    }
  )
);