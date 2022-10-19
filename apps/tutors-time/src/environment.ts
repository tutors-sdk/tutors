import dotenv from "dotenv";

const result = dotenv.config();
if (result.error) {
  console.log(result.error.message);
}

export const firebase = {
  apiKey: process.env.firebase_apiKey,
  databaseURL: process.env.firebase_databaseUrl,
  projectId: process.env.firebase_projectId,
  tutorsStoreId: process.env.tutors_store_id,
  tutorsStoreSecret: process.env.tutors_store_secret,
};
