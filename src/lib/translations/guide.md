# Developer Guide: Adding a New Section to JSON Translation Files and Adjusting Svelte Pages

This guide explains how to add a new section to your JSON translation files and adjust any Svelte page to use these translations. We'll use an example from the `DeveloperExperience` component.

## 1. Adding a New Section to JSON Translation Files

1. **Open the JSON Translation Files**:
   Your translation files are located in `src/lib/translations`. You should have separate JSON files for each language, e.g., `en/common.json`, `fr/common.json`, etc.

2. **Add the New Section**:
   A section is a segment of our UI that we want to apply i18n principles to. In our JSON file it should be a standalone element. Let's add a new section called `newSection` with `title` and `description` keys in each JSON file -- you can add any unique key you wish. Here's an example.

   **`src/lib/translations/en/common.json`**:
   ```json
   {
     "developerExperience": {
       "title": "Developer Experience",
       "description": "The <b>Developer Experience</b> prioritizes the specification and implementation of <b>robust, well-documented, loosely coupled components & services</b>, integrated into a <b>coherent toolkit</b> open to contributions from <b>diverse skill sets</b>."
     },
     "newSection": {
       "title": "New Section",
       "description": "This is the description for the new section."
     }
   }


   This newSection and it's equivilent keys need to be added to all relevant localisations that you are trying to cater for.

## Adjusting a Svelte Page to Use the New Section

We now need to find the appropriate Svelte page that currently serves up the text. In this example, let's adjust the DeveloperExperience.svelte component to include the new section.

1. Open the Svelte Component:
Open src/routes/(home)/values/DeveloperExperience.svelte.

2. Import the Translation Function:
Ensure you import the t function from your translations module.

3. Use the translation keys

For ease of use declare a variable to match each key and dynamically pull the value from the relevant dictionary
 ```js
let newSectionTitle = '';
let newSectionDescription = '';

newSectionTitle = $t('common.newSection.title');
newSectionDescription = $t('common.newSection.description');
```

4. Style and Test:
Ensure the new section is styled appropriately in your CSS, and test the page to ensure the translations appear correctly. Note that in the JSON file you can use HTML tags as the project converts JSON to HTML meaning we can use <b>bold</b> by using the relevant tags


# Adding a new language

This guide explains how to add a new language to your JSON translation files and adjust your Svelte pages to support this new language. We will use an example of adding the Irish language (`ie`) to our project.

## 1. Adding a New Language to JSON Translation Files

1. **Create the New JSON Translation File**:
   Create a new JSON file for the Italian translations in the `src/lib/translations` directory. Name the file `ie/common.json`.

2. **Populate the New JSON File**:
   Add the necessary translations for your application and match the expected keys that exist in the other languages you are implementing.

3. Update the Translation Loader:
Ensure your translation configuration includes the new language. Open src/lib/translations/index.ts and add the loader for Irish

```js
{
      locale: 'ie',
      key: 'common',
      loader: async () => {
        console.log('Loading Irish translations');
        const module = await import('./ie/common.json');
        return module.default as Translation;
      },
```