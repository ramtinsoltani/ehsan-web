# Ehsan Web App

This is an Angular 7 SPA made to display a portfolio of a colorization artist.

This project uses Firebase Authentication (anonymous only), Firebase Cloud Storage, Firestore Database, and Firebase hosting.

# Building

  1. `npm install`
  2. Create a Firebase project and place web credentials in `src/app/config/firebase.cert.json`
  3. Configure the Firebase project:
    - Enable anonymous authentication
    - Enable Firestore with the rules `rules/firebase-firestore.rules`
    - Enable Cloud Storage with rules `rules/firebase-storage.rules`
    - **OPTIONAL:** You can setup Firebase Hosting in project root (using `firebase-tools`) with files directory `dist/ehsan-web`
  4. Add content in the database and storage ([Refer to Adding Content](#adding-content)).
  5. `ng serve` or `ng build --prod`

# Adding Content

Posts should be added inside the Firestore database. `metadata/posts` is a document with `count` field which has the number of documents inside the `posts` collection, and `posts/*` are documents with the following structure:

| Field | Type | Description |
|:------|:----:|:------------|
| title | string | The title of the post. |
| description | string | The description of the post. |
| beforeName | string | The filename of the before image inside the Cloud Storage. |
| afterName | string | The filename of the after image inside the Cloud Storage. |
| timestamp | number | A unix timestamp (creation date) for ordering the posts. |

All images (one before and one after per post) should be uploaded to the storage with `cacheControl: 'public, max-age:31536000'` to enable caching. Remember that the filename of each photo should match with its post's `afterName` and `beforeName`.
