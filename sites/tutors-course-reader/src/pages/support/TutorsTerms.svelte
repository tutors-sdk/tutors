<script lang="ts">
  export let authenticating = false;

  function acceptAuthenticate() {
    authenticating = false;
  }
</script>

<div class="flex h-screen justify-center items-center bg-neutral bg-opacity-90 backdrop-blur text-neutral-content">
  <div class="text-center max-w-screen-md">
    <div
      class="flex flex-wrap justify-items-center shadow-md rounded-lg px-4 py-2 bg-base-200 bg-opacity-90 backdrop-blur text-base-content m-8"
    >
      <div class="flex justify-between w-full border-gray-400 border-b-2 p-2">
        <div class="font-sm font-light text-xl text-center">TutorsTime</div>
      </div>

      <div class="font-sm font-light text-l text-left p-2">
        <p class="p-2">
          You have been authenticated via your GitHib credentials and are about to enter a Tutors course. Tutors will record how much time
          each view is active and send this to the TutorsTime data store. You can view this information via the TutorsTime feature on the
          course Navigator.
        </p>
        <p class="p-2">
          This data is available to you + the instructor of your course, but not to other students. No other data is gathered, nor is this
          data transmitted anywhere other than the TutorsTime data store.
        </p>
        <p class="p-2">
          TutorsLive also uses this data to display of panel of students currently online. You can opt out of this feature from the
          TutorsLive page.
        </p>
        <p class="p-2">To learn more about these features please consult:</p>
        <ul class="list-disc list-inside ml-4 underline text-blue-600 hover:text-blue-800 visited:text-purple-600">
          <li><a target="_blank" href="https://github.com/tutors-sdk/tutors-faqs/blob/main/tutors-time-faq.md"> Tutors Time FAQ </a></li>
          <li><a target="_blank" href="https://github.com/tutors-sdk/tutors-faqs/blob/main/tutors-live-faq.md">Tutors Live FAQ </a></li>
        </ul>
        <p class="p-2">
          Tutors is an open source application - the data collection component <a
            class="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
            href="https://github.com/tutors-sdk/tutors-readers/blob/main/tutors-course-reader/src/reader-lib/services/analytics-service.ts"
            target="_blank"
          >
            is here</a
          >.
        </p>
        <p class="p-2">You will be asked to authenticate again in seven days time.</p>
      </div>
      <button class="btn btn-rounded btn-info" on:click={acceptAuthenticate}>Proceed to Course </button>
    </div>
  </div>
</div>
