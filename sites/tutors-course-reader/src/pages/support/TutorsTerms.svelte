<script lang="ts">
  export let authenticating = false;

  function acceptAuthenticate() {
    authenticating = false;
  }
</script>

<div class="bg-surface-600 min-h-screen flex items-center justify-center overflow-auto">
    <div
      class="card m-8 flex flex-wrap justify-items-center p-4 shadow-xl"
    >
      <div class="flex w-full justify-between border-b-2 border-surface-300 p-2">
        <div class="font-sm text-center text-xl font-light">TutorsTime</div>
      </div>

      <div class="font-sm text-l p-2 text-left font-light">
        <p class="p-2">
          You have been authenticated via your GitHub credentials and are about to enter a Tutors course. Tutors will record how much time
          each view is active and send this to the TutorsTime data store. You can view this information via the TutorsTime feature on the
          course Navigator.<br /><br />
          This data is available to you + the instructor of your course, but not to other students. No other data is gathered, nor is this
          data transmitted anywhere other than the TutorsTime data store.<br /><br />
          TutorsLive also uses this data to display of panel of students currently online. You can opt out of this feature from the
          TutorsLive page.
        </p>
        <p class="p-2">To learn more about these features please consult:</p>
        <ul class="ml-4 list-inside list-disc text-blue-600 underline visited:text-purple-600 hover:text-blue-800">
          <li><a target="_blank" href="https://github.com/tutors-sdk/tutors-faqs/blob/main/tutors-time-faq.md"> Tutors Time FAQ </a></li>
          <li><a target="_blank" href="https://github.com/tutors-sdk/tutors-faqs/blob/main/tutors-live-faq.md">Tutors Live FAQ </a></li>
        </ul>
        <p class="p-2">
          Tutors is an open source application - the data collection component <a
            class="text-blue-600 underline visited:text-purple-600 hover:text-blue-800"
            href="https://github.com/tutors-sdk/tutors-readers/blob/main/tutors-course-reader/src/reader-lib/services/analytics-service.ts"
            target="_blank"
          >
            is here</a
          >.
        </p>
        <p class="p-2">You will be asked to authenticate again in seven days time.</p>
      </div>
      <button class="btn bg-primary-500 text-white" on:click={acceptAuthenticate}>Proceed to Course </button>
  </div>
</div>
