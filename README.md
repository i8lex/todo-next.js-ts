
## Description

The client-side of the project is a web application developed for organizing and managing various events. The user interface is intuitive and offers a wide range of functional capabilities for users.

The application is built using the NextJS framework. The following libraries were utilized in the project:

### Functionalities:

#### 1. Registration and Authentication:

* Users can register using their email address and verify it.
* Authentication is performed using JSON Web Tokens (JWT).
#### 2. User Profile:
* Users can edit their personal information, including name, surname, and contact details.
* There is an option to upload and modify the user's avatar.
#### 3. Social Interactions:

* Users can send friend requests and manage their friends' list.
* Privacy settings allow users to control the visibility of personal information (available to all, only to contacts, or nobody).
#### 4. Chat:

* A chat system is implemented for real-time communication between connected users.
* Message status tracking, including delivery and read receipts, is supported.
#### 5. Events:

* Users can create, edit, and delete events.
* They can upload event-related images with automatic thumbnail generation.
#### 6. User Presence Tracking:

* User status (online/offline) is tracked and displayed.



### Technologies Used:

The client-side of the project was developed using the following technologies and libraries:

* `@headlessui/react`: Library for creating accessible and customizable components.
* `@heroicons/react`: SVG icons for web applications.
* `@react-email/components`: Library for creating email templates in React.
* `@react-email/render`: Rendering of email templates in React.
* `@react-email/tailwind`: Tailwind CSS integration for creating email templates in React.
* `@reduxjs/toolkit`: Simplified state management with Redux.
* `@svgr/webpack`: Webpack plugin for SVG icon integration.
* `@tailwindcss/forms`: Tailwind CSS extension for simplified form styling.
* `autoprefixer`: Plugin for automatic CSS prefixing.
* `browser-image-compression`: Library for in-browser image compression.
* `clsx`: Utility for generating CSS classes in JavaScript.
* `date-fns`: Library for working with dates and times in JavaScript.
* `handlebars`: Templating engine for generating text, including email templates.
* `mime-types`: Determining MIME types of files.
* `next-auth`: Authentication and session management for Next.js.
* `next-redux-wrapper`: Integrating Redux in Next.js applications.
* `react-email`: Library for creating email templates in React.
* `react-hook-form`: Library for form management in React.
* `react-image-crop`: Component for image cropping in React.
* `react-scroll`: Library for smooth scrolling on web pages.
* `redux`: Library for state management in applications.
* `socket.io-client`: Client-side implementation for real-time message exchange.
* `swiper`: Modern component for slideshows and carousels in web applications.
* `tailwindcss`: Powerful CSS framework.
* `tailwindcss-animate`: Tailwind CSS extension for animations.
## Installation

```bash
$ npm install
```
#### Create a `.env` file end fill it, following the example in the `.env.example` file

## Running the app

```bash
# development server for local development
$ npm run dev

# development server and allows access from a specific network address.
$ npm run dev_network

# compiles the project for production
$ npm run build

# launches the production-ready application.
$ npm run start

# runs a linter to identify and fix code issues
$ npm run lint
```




## Stay in touch

- Author - Oleksii Medvediev
- Linkedin - https://www.linkedin.com/in/link-oleksii-medvediev/

#
