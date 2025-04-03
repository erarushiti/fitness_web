# Fitness Web App README 

## Project Structure (Key Files/Folders)

- **config/**  
  Holds settings for the app.  
  - \`db.js\`: How to connect to the MySQL database.  
  - \`env.js\`: Environment variables (e.g., passwords, ports).

- **models/**  
  Defines how data is stored in the database.  
  - \`user.js\`: Details about users (e.g., name, email).  
  - \`workout.js\`: Details about workouts (e.g., exercises, duration).  
  - \`progress.js\`: Tracking user progress (e.g., results, dates).

- **controllers/**  
  Handles what the app does (logic).  
  - \`authController.js\`: Manages user login and registration.  
  - \`workoutController.js\`: Manages workout features.  
  - \`progressController.js\`: Manages progress tracking.

- **routes/**  
  Paths users can access (like URLs).  
  - \`authRoutes.js\`: Routes for logging in and signing up.  
  - \`workoutRoutes.js\`: Routes for workout features.  
  - \`progressRoutes.js\`: Routes for progress tracking.  
  - \`index.js\`: Combines all routes together.

- **.env**  
  Secret settings (e.g., database password) – don’t share this!

- **app.js**  
  Main file to start the app.

## How to Use

1. Install Node.js and MySQL.  
2. Set up your \`.env\` file with database details.  
3. Run \`npm install\` to get dependencies.  
4. Use \`node app.js\` or \`npm start\` to start the app.