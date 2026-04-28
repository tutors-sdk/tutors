export const load = async ({ locals }) => {
  // Auth may not be configured in dev; degrade to anonymous if anything throws.
  try {
    const session = await locals?.auth?.();
    const user = session?.user;
    return { loggedIn: !!user, user };
  } catch {
    return { loggedIn: false, user: undefined };
  }
};
