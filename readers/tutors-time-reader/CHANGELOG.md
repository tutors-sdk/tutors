# Tutors Changelog

## [4.4.3] - 2021-11-13

- added: custom tailwind components

## [4.4.2] - 2021-11-12

- changed: videocard full width backround
- changed: videocard card descriptioon bottom center
- removed: additional videocard title on all videos page

## [4.4.1] - 2021-11-12

- added: whitelist support introduced

## [4.4] - 2021-11-09

- changed: logo to new tutors logo
- changed: favicon to new tutors logo
- changed: reader landing page design

## [4.3.3] - 2021-11-02

- changed: Tutors-dyslexia theme colours

## [4.3.2] - 2021-11-01

- added: support video start/end
- changed: larger card video playback
- fixed: title card image for units set to parent

## [4.3.1] - 2021-10-12

- enable course to have icon, loaded from properties.yaml

## [4.3] - 2021-09-28

- added: card top & bottom border colour
- added: wireframe theme
- changed: resize talk card on larger screens
- removed: pastel theme
- fixed: prose overflow on lab view
- fixed: breadcrumb positioning

## [4.2.8] - 2021-09-21

- added: labStepsAutoNumber property enables numbers in labs

## [4.2.7] - 2021-09-16

- fixed: lab code overflow issue
- changed: calendar button now colour coded
- fixed: numerous UX tweaks

## [4.2.6] - 2021-09-09

- added: each theme can not have a tailored icon set

## [4.2.5] - 2021-09-05

- changed: icons loaded from properties.yaml additive to default set]()

## [4.2.4] - 2021-09-03

- changed: remove sickey header
- fixed: title image for video now icon

## [4.2.3] - 2021-08-31

- added: support for iconify icons via frontmatter in md files

## [4.2.2] - 2021-08-30

- changed: load icons from iconify
- changed: adjustments to lab ux
- changed: upgraded dependencies

## [4.2.1] - 2021-08-17

- fixed: hide/show topics fixed
- fixed: margin between units set to 2
- fixed: avoid overflow caused by tooltips
- changed: animation/transition delay tweaks

## [4.2.0] - 2021-08-16

- added: new compact/expanded layout toggle
- changed: remove narrower margins throughout
- fixed: numerous layout fixes and improvements

## [4.1.0] - 2021-08-06

- added: changed talk card layout + spinner
- fixed: wall breadcrumb bug
- modified: internal changes to how pages are fetched simplifying structure considerably

## [4.0.3] - 2021-07-14

- added: convert sidebar to use accordion
- changed: remove toolbars when displaying portfolio
- changed: hide sidebar when navigating to learning object

## [4.0.2] - 2021-07-06

- fixed: wall cards now work correctly

## [4.0.1] - 2021-07-04

- new: fade/scale transitions on cards
- changed: hide companion, wall and profile bars on mobile

## [4.0.0] - 2021-07-03

- new: major redesign incuding new UX, navigation + themes support

## [3.4.4] - 2021-06-04

- fixed: blockquote in dark mode

## [3.4.3] - 2021-04-23

- margin tweek on unit card

## [3.4.2] - 2021-04-12

- added: particle animation on TutorsLive
- changed: theme options for code highlight: agate

## [3.4.1] - 2021-04-01

- fixed: support for heanet video
- added: make heanet poster more context specific

## [3.4.0] - 2021-03-25

- changed: switch from webpack to vite

## [3.3.1] - 2021-03-22

- changed: adjust youtube icon

## [3.3.0] - 2021-03-12

- added: Latex support in labs via Katex component

## [3.2.4] - 2021-03-03

- added: switch to webpack for build system
- changed: remove horizontal bars on card
- changed: card hover behaviour for cards

## [3.2.3] - 2021-03-01

- added: simplify analytics to TutorsTime only. Display T&C panel for same

## [3.2.2] - 2021-02-21

- added: in live view, show topic + lab image

## [3.2.1] - 2021-02-05

- added: no longer show step number on lab breadcrumbs
- changed: use native youtube player for youtube videos, vime for others..

## [3.2.0] - 2021-01-30

- added: allow users to go offline in live view
- added: live view opens in separate window
- added: live view includes analog clock
- changed: upgrade all dependencies
- changed: responsive layout for live title bar
- fix: analytics bug cleanup - first lab time data incorrect in some cases
- fix: pin code no longer extends profile bar with duplicates


## [3.1.3] - 2021-01-29

- changed: live view based on card layout
- changed: clamp all card summaries to 3 lines

## [3.1.2] - 2021-01-27

- fix: bug when new course with auth but no users yet.
- fix: use https for github image profile
- fix: load grid stylesheets globally to prevent screen flicker
- fix: dark mode style for students online count
- changed: improve title/subtitle choice on various pages

## [3.1.1] - 2021-01-27

- fix: remove inactive student after 5 mins from live view

## [3.1.0] - 2021-01-26

- added: new live view in profile menu

## [3.0.4] - 2021-01-18

- fix: correct layout for tutors time live view
- added: number of students live count
- fix: reset online count correctly

## [3.0.3] - 2021-01-15

- fix: open external links in blank tabs
- change: change icon for unit

## [3.0.2] - 2021-01-07

- change calendar button style in dark mode
- fix: lab navigation from table of contents now works if lab already active

## [3.0.1] - 2021-01-06

- reset scroll position on each lab step change
- border around tooltip
- support global video hide
- introduce horizontal menu on labs
- fix: video (without pdf) link

## [3.0.0] - 2021-01-04

- First port of new version - Replace UIKit with Tailwind
