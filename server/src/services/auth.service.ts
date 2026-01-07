import mongoose from "mongoose";

export async function googleAccountService(data: {
  provider: string;
  displayName: string;
  providerId: string;
  picture?: string;
  email?: string;
}) {
  const { provider, displayName, providerId, picture, email } = data;

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
  } catch (error) {}
}
