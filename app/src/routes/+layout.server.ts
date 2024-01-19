import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals: { getSession } }) => {
  if (getSession) {
    return {
      session: await getSession()
    };
  }
};
