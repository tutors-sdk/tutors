export const load = async ({ locals }) => {
  const session = await locals?.getSession();
  const loggedIn = !!session?.user;
  const user = session?.user;
  return {
    loggedIn,
    user
  };
};
