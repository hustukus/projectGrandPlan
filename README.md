# projectGrandPlan
Website for submitting your ideas and contributing to others

The main idea of this app is to create a place, where one can submit their visions to work together with others. Aimed for life
changing visions but every vision and contribution is as important as the other.

Main features of the app:

Landing page
- roulette of five changing pictures

User functionalities
- registering new user
- login/logout functionality
  - message to the user when logged in/out succesfully, or when something went wrong
- own pages for user, where one see the GrandPlans they have started and are contributing to
- autentication for user action, e.g. only creator of Grandplans can edit or delete Grandplan (excluding admin rights)
  - done true middleware functionality
- admin rights with correct password when creating new user
- message to the user when new user is succesfully created
  
GrandPlan functionalities
- create new GP (GrandPlan)
- edit and delete GP (own GPs plus admin rights)
- show all GPs on the index page
  - pagination functionality for index page (max 8 GPs per page as default)
- search functionality for different GPs (search with empty search conditions to show all)
- message to the user when new GP has been succesfully created

Comment functionalities
- create new comment for GPs
- edit/delete functionality, can only be done by the user that submitted the comment (excluding admin)
- message to the user when a comment has been succesfully created or deleted

Contribution functionalities
- create new contribution for GPs (includes a role and description/message of submitters talents they are willing to contribute)
- edit/delete functionality, can only be done by the user that submitted the comment (excluding admin)
- message to the user when a contribution has been succesfully created or deleted

Header and footer
  - the menu bar, which works also with mobile sizwed screen

********************
Things not currently working properly:
  - the creation date of GPs and comments are not correct
  
*********************
Tech specs:
- Javascript with MEN stack:
  - MongoDB
  - Express.js
  - Nodejs
- Embedded Javascript
- Bootstrap 3 (CSS)
- npm
- some imported dependencies (look package.json)
