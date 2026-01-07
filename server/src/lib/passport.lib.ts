import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import type { Request } from "express";
import config from "@/config/env.config.js";
import { APIError } from "./error-handler.lib.js";
import { ProviderEnum } from "@/enums/index.enum.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
      callbackURL: config.GOOGLE_CALLBACK_URL,
      scope: ["profile", "email"],
      passReqToCallback: true,
    },
    async (req: Request, _accessToken, _refreshToken, profile, done) => {
      try {
        const { email, sub: googleId, picture } = profile._json;
        if (!googleId) {
          return done(
            new APIError(400, "Google ID not found in profile"),
            false
          );
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
