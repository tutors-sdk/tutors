import type { RealtimeChannel, SupabaseClient } from "@supabase/supabase-js";
import { studentsOnline, studentsOnlineList } from "$lib/stores";
import type { Presence, PresenceObject } from "$lib/services/types/presence";

let presenceChannel: RealtimeChannel;

export function setupPresence(supabase: SupabaseClient, courseid: string) {
  presenceChannel = supabase.channel("online-users", {
    config: {
      presence: {
        key: courseid
      }
    }
  });
}

export function updatePresence(presence: Presence) {
  presenceChannel.track({
    online_at: new Date().toISOString(),
    studentName: presence.studentName,
    studentEmail: presence.studentEmail,
    studentImg: presence.studentImg,
    courseTitle: presence.courseTitle,
    loTitle: presence.loTitle,
    loImage: presence.loImage,
    loRoute: presence.loRoute,
    loIcon: presence.loIcon
  });
}

export function subscribePresence(presence: Presence, courseid: string) {
  try {
    presenceChannel.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        await presenceChannel.track({
          online_at: new Date().toISOString(),
          studentName: presence.studentName,
          studentEmail: presence.studentEmail,
          studentImg: presence.studentImg,
          courseTitle: presence.courseTitle,
          loTitle: presence.loTitle,
          loImage: presence.loImage,
          loRoute: presence.loRoute,
          loIcon: presence.loIcon
        });
      }
    });
  } catch (error) {
    return error;
  }

  presenceChannel.on("presence", { event: "sync" }, () => {
    const presenceState = presenceChannel.presenceState();

    const courseIDWithoutNetlify = courseid.replace(".netlify.app", "");
    const courseIDWithNetlify = `${courseIDWithoutNetlify}.netlify.app`;

    const onlineUsersObj: PresenceObject[] = [];
    for (const [key, value] of Object.entries(presenceState)) {
      if (key === courseIDWithoutNetlify || key === courseIDWithNetlify) {
        onlineUsersObj.push(...value);
      }
    }

    const uniqueUsers = new Set();

    const filteredUniquePresences: PresenceObject[] = onlineUsersObj.filter((presence) => {
      if (!uniqueUsers.has(presence.studentEmail)) {
        uniqueUsers.add(presence.studentEmail);
        return true;
      }
      return false;
    });

    studentsOnline.set(filteredUniquePresences.length);
    studentsOnlineList.set(filteredUniquePresences);
  });

  presenceChannel.on("presence", { event: "join" }, ({ newPresences }) => {
    const courseIDWithoutNetlify = courseid.replace(".netlify.app", "");
    const courseIDWithNetlify = `${courseIDWithoutNetlify}.netlify.app`;

    const filteredNewPresences = newPresences.filter((presence) => presence.channel === courseIDWithoutNetlify || presence.channel === courseIDWithNetlify);

    const uniqueUsers = new Set();

    const filteredUniquePresences = filteredNewPresences.filter((presence) => {
      if (!uniqueUsers.has(presence.studentEmail)) {
        uniqueUsers.add(presence.studentEmail);
        return true;
      }
      return false;
    });

    studentsOnline.update((count) => count + filteredUniquePresences.length);
    studentsOnlineList.update((list) => [...list, ...filteredUniquePresences]);
  });

  presenceChannel.on("presence", { event: "leave" }, ({ leftPresences }) => {
    const courseIDWithoutNetlify = courseid.replace(".netlify.app", "");
    const courseIDWithNetlify = `${courseIDWithoutNetlify}.netlify.app`;

    const filteredLeftPresences = leftPresences.filter((presence) => presence.channel === courseIDWithoutNetlify || presence.channel === courseIDWithNetlify);

    studentsOnline.update((count) => count - filteredLeftPresences.length);
    studentsOnlineList.update((list) => list.filter((item) => !filteredLeftPresences.some((presence) => presence.user_id === item.studentEmail)));
  });
}

export function unsubscribePresence() {
  presenceChannel.untrack().then(() => {
    console.log("untrack");
  });
}
