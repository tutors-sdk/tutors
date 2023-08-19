export const handleSignIn = async () => {
  await supabase.auth.signInWithPassword({
    email,
    password
  });
};

export async function handleSignInWithGitHub() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github"
  });
}

export const handleSignUp = async () => {
  await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${location.origin}/auth/callback`
    }
  });
};

export const handleSignOut = async () => {
  await supabase.auth.signOut();
};
