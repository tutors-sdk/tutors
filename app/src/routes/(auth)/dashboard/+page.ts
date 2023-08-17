import { redirect } from "@sveltejs/kit";

export const load = async ({ parent }) => {
  const data = await parent();
  const session = data.session;

  if (!session) {
    throw redirect(303, "/auth");
  }

  const { data: courses } = await data.supabase
    .from("accessed_courses")
    .select(`course_list`)
    .eq("id", session.user.id);

  return { session, courses };
};
