This project is a Front-End Exhibition Curation Platform that allows users to browse artifacts/artworks from two different museum APIs:
The Cleveland Museum of Art: (https://www.clevelandart.org/open-access-api)
Art Institute of Chicago: (https://www.artic.edu/open-access/public-api)

Features of this application include [Appendix A]:
1) Browsing artifacts/artworks from two different museum APIs
2) Alphanumerical sorting for titles for each loaded page
3) Toggle for if the museum is currently showing the artifact/artwork at the physical museum
4) Search function allowing users to do custom searches
5) Next/Previous buttons for pages
6) Click on an artifact/artwork to view more information about it
7) Save artifacts/artworks temporarily
8) View all their saved artifacts/artworks

To fork and clone this repository, fork a copy of the original repository and copy the unique link to your dashboard, and run $git clone.

To run this locally, ensure to install all the required packages and dependencies by running $npm i and then running $npm run dev to launch the website, or to access the app, please follow: (https://james-lau2001-se-exhibition-curation.vercel.app/). Note: Node v22.5.1 will be required to run this repository.

Once the app is launched, the user will be directed to the home page, where the user is welcomed to the app and is prompted to select which museum API they would like to browse. After this, the user will be directed to another page, where the user will see the first page of artifacts/artworks that are linked to the chosen API. From here, the user can perform several actions, which are features 1-6 from Appendix A:
. To perform feature 2, the user will be able to select from a drop-down list: 'A-Z' for A-Z sorting for title, and 'Z-A' for Z-A sorting for title. 
. To perform feature 3, the user can press a button to toggle between showing artifacts/artworks currently within the museum, or to view all regardless of whether it's at the museum or not
. To perform feature 4, the user can type into the input box, such as an artwork name, author, creation date, etc.
- Should this be done, the user will then see all the results of their search if available, from there, they can perform features 2-6
. To perform feature 5, the user can click the buttons Previous/Next
- Should this be done, the user will then see a new set of artworks/artifacts separate from the current page
. To perform feature 6, the user can click on an artifact/artwork to view more information about it
- Should this be done, the user will be directed to another page to view further details of said artifact/artwork
Should the user choose to perform feature 6, they will be able to perform feature 7, which can be done by pressing the button, "Save Artifact", note that this is also the method to remove from saved artifacts.
Now that the user has saved an artifact, they can click on "Saved Artifacts" on the navigation bar to perform feature 8, and should be able to see their saved exhibits. Should no artifacts be saved, the user will see "No saved artifacts found".
The user may also navigate back to the home page by clicking "Home" on the navigation bar, or the header at the top of the screen "The Exhibition Curation Platform", from here, they may browse another API.

This portfolio project was created in partnership with Tech Returners Launchpad Programme. 
