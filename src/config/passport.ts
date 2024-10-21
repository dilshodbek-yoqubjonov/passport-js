import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: process.env.GOOGLE_REDIRECT_URL,
    },
    (access_token, refresh_token, profile, done) => {
      // console.log(profile);

      done(null, { tokens: { access_token, refresh_token }, profile });
    }
  )
);

passport.serializeUser((user: any, done): void => {
  done(null, user);
});

passport.deserializeUser((user: any, done): void => {
  done(null, user);
});
