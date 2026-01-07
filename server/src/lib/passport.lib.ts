import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import type { Request } from "express";
import config from "@/config/env.config.js";
import { APIError } from "./error-handler.lib.js";
import { ProviderEnum } from "@/enums/index.enum.js";
import { googleAccountService } from "@/services/auth.service.js";
import logger from "./logger.lib.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
      callbackURL: config.GOOGLE_CALLBACK_URL,
      scope: ["profile", "email"],
      passReqToCallback: true,
    },
    async (_req: Request, _accessToken, _refreshToken, profile, done) => {
      try {
        const { email, sub: googleId, picture } = profile._json;

        console.log("Google profile:", profile);
        console.log("GoogleId:", googleId);
        if (!googleId) {
          logger.error("Google ID not found in profile");
          return done(
            new APIError(400, "Google ID not found in profile"),
            false
          );
        }

        if (!email) {
          logger.error("Google email not found in profile");
          return done(new APIError(400, "Google email not found"), false);
        }

        const { user } = await googleAccountService({
          provider: ProviderEnum.GOOGLE,
          displayName: profile.displayName,
          providerId: googleId,
          picture: picture,
          email: email,
        });

        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  )
);

passport.serializeUser((user: any, done) => done(null, user));
passport.deserializeUser((user: any, done) => done(null, user));

export default passport;
