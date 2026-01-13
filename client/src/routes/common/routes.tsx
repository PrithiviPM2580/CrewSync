import SignIn from "@/pages/auth/SignIn";
import { AUTH_ROUTES } from "./routePaths";
import SignUp from "@/pages/auth/SignUp";
import GoogleAuthFailure from "@/pages/auth/GoogleAuthFailure";

export const authenticationRoutePaths = [
  { path: AUTH_ROUTES.SIGN_IN, element: <SignIn /> },
  { path: AUTH_ROUTES.SIGN_UP, element: <SignUp /> },
  { path: AUTH_ROUTES.GOOGLE_OAUTH_CALLBACK, element: <GoogleAuthFailure /> },
];
