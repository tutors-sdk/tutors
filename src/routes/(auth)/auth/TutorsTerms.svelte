<script lang="ts">
  import { convertMdToHtml } from "$lib/services/content/utils/markdown-utils";

  const terms = `You are about to be authenticated via your Github credentials to Tutors. **For most courses,
you do not need to log in at all, so if you prefer you can go back to the course page and proceed through 
the course as for any public web site.** 

If you do sign up/log in, then you will need a github account first. Logging in will then make a simple 
convenient dashboard available of quick links to all recent Tutors courses you have accessed. 

For some courses, Tutors will always requre an account to gain access - and you will be landed here. 
Once logged in, Tutors may record how much time each view is active and send this to the TutorsTime data store. 
You can view this information via the Time feature on the profile menu. This data is available to you + 
the instructor of your course, but not to other students.
No other data is gathered, nor is this data transmitted anywhere other than the TutorsTime data store.  
    
The Live feature, available from the profile menu, may also use this data to display of panel of students currently online.  **You can opt out of these features by disabling the Share Presence option from the profile menu.** To learn more about TutorsTime please consult:
  
- [Tutors Time FAQ](https://github.com/tutors-sdk/tutors-faqs/blob/main/tutors-time-faq.md)
- [Tutors Live FAQ](https://github.com/tutors-sdk/tutors-faqs/blob/main/tutors-live-faq.md)
 
Tutors is an open source application - the data collection component 
[is here](https://github.com/tutors-sdk/tutors/blob/development/src/lib/services/analytics.ts).
`;

  const content = convertMdToHtml(terms);
</script>

{@html content}
