# Travel Guider - BSCH-WT Assignment 3

### By Jérémy ROBERT - 3131498

<img src="./docs/img/HomePage.png" alt="pixavox-logo" />

## Project description:

This school project has to be done in 3 weeks.  
The goal is to create a blog using Node.Js and Express.Js.

## Blog Requirement

- [x] The blog shall have a home page  
- [x] The blog shall feature an introduction  
- [x] The blog shall feature a navigation menu  
- [x] The blog shall have a navigation menu with links to all the other pages  
- [x] The home page shall feature a preview of the 10 latest blog posts.  
- [x] The blog / latest news section shall list blog articles  
- [x] The listed blog articles shall allow the user to click on one post and be presented with a details page.  
- [x] The details page of a post shall have a publish date.  
- [x] The details page of a post shall have a title.  
- [x] The details page of a post shall have subtitles where required.  
- [x] The details page of a post shall have an image.  
- [x] The details page of a post shall contain the main text of the blog post.  
- [x] All images used on site shall have image alt tags and image titles  
- [x] Include links to other posts on your site where appropriate  
- [x] Include relevant external links to third-party sites  
- [x] The details page of a post shall include author and contributing author info  
- [x] All pages/posts shall have a consistent, persistent header  
- [x] The header shall have a site title  
- [x] The header shall have a description/tagline  
- [ ] The app shall allow an admin user to create new users  
- [ ] The app shall allow an admin user to edit new users’ information  
- [ ] The app shall allow an admin user to delete new users’ information  
- [x] The app shall store new users’ information name, email address.  
- [x] Users can log in and log out by creating or destroying a token.

## Development Setup

### Prerequisites

You are required to have Node.Js installed if you'd like to run the app locally.  
Once you have Node.Js and npm installed, you can run the following command line instruction: `npm install`.  
This will install all the dependencies for the project.  
Once done, you must create a database. For this, run the corresponding script by executing the command: `npm run createDB`. This will create a sqlite3 database at the root of your project.  
Then run `npx prisma migrate deploy` to load the database migrations.  
Finally create a new Admin user by doing: `npm run create-admin`. Enter the required informations and you will be ready to go.

### Run localy

If you want to run the application localy, just type: `npm run dev`, in your terminal.  
You should have the following output: `Server is running on http://127.0.0.1:8080`.  

To write & compile scss files, please run `npm run compile`.

> **Tips:** you can execute the command above in a new terminal so you can run both compile & dev commands


## Credentials

This blog designed and the name "Travel Guider" has been created by woop studio, 
Special thanks to [woop studio](https://dribbble.com/woop-studio) for the name "Travel Guider" and for the design which totally belongs to them.
