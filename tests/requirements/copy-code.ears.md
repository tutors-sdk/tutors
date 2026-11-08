# Copy Code Requirements

- WHEN a code copy succeeds, the button shall display copied feedback for two seconds.
- WHILE a clipboard write is pending, the button shall not display success feedback.
- IF clipboard access is denied or unavailable, the action shall handle the failure without displaying success feedback.
- WHEN the action is destroyed, pending writes and timers shall not change the button feedback.
