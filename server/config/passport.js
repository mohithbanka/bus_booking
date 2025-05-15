const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const bcrypt = require("bcrypt");
const User = require("../models/User");
const logger = require("../utils/logger");

console.log("Initializing Passport strategies");

// Local Strategy
passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
          // logger.warn(`Local strategy: User not found for email ${email}`);
          return done(null, false, { message: "Invalid email or password" });
        }

        // Check if user has a password (local account)
        if (!user.password) {
          logger.warn(`Local strategy: No password set for email ${email} (likely OAuth user)`);
          return done(null, false, {
            message: "This account uses Google login. Please use Google to sign in.",
          });
        }

        // Debug logs to verify inputs
        console.log("Password from request:", password);
        console.log("Password from DB:", user.password);

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          logger.warn(`Local strategy: Incorrect password for email ${email}`);
          return done(null, false, { message: "Invalid email or password" });
        }

        logger.info(`Local strategy: User ${email} authenticated successfully`);
        return done(null, user);
      } catch (error) {
        logger.error("Local strategy error", { error });
        return done(error);
      }
    }
  )
);

// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });
        if (user) {
          logger.info("Google user found", { email: user.email });
          return done(null, user);
        }

        user = await User.findOne({ email: profile.emails[0].value });
        if (user) {
          user.googleId = profile.id;
          await user.save();
          logger.info("Google ID linked to existing user", { email: user.email });
        } else {
          user = new User({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
          });
          await user.save();
          logger.info("Google user created", { email: user.email });
        }
        return done(null, user);
      } catch (error) {
        logger.error("Google OAuth error", { error });
        return done(error);
      }
    }
  )
);

// Serialize and deserialize user
passport.serializeUser((user, done) => {
  logger.info(`Serializing user ${user.email}`);
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    logger.info(`Deserializing user ${user ? user.email : "not found"}`);
    done(null, user);
  } catch (error) {
    logger.error("Deserialize user error", { error });
    done(error);
  }
});

console.log("Passport strategies initialized successfully");