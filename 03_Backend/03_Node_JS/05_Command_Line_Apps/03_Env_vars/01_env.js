// ✅ Import the dotenv package to load environment variables from a .env file
import dotenv from 'dotenv';

// Access variable using built-in method make sure the env is accessible in this case it isn't configured directly
console.log(process.env.UK);

// ✅ Optionally load a .env file from a custom path
// This is useful when your .env file is not in the root directory
// Uncomment the line below to use a specific .env file location
dotenv.config({ path: `G:\\Technologies\\03_Backend\\03_Node_JS\\05_Command_Line_Apps\\03_Env_vars\\.env` });

// ✅ Load environment variables from the default .env file
// By default, dotenv looks for a .env file in the root folder (same level as package.json)
// dotenv.config();

// ✅ Access an environment variable named "US"
// If it's not defined, fallback to the string "Not found"
const mycountry = process.env.US || "Not found";

// ✅ Print the value of the environment variable to the console
console.log(mycountry);
console.log(process.env.UK);


/*
🌱 What Are Environment Variables?
    Environment variables are key-value pairs used to configure how software behaves without changing its code. 
    They act like invisible settings that your app can read at runtime.
    They’re stored outside your code — in the operating system, .env files, or cloud settings.

    You access them in Node.js using process.env.
        const dbPassword = process.env.DB_PASSWORD;

🎯 Why Use Environment Variables?
    ✅ 1. Security
        Keep sensitive data like API keys, passwords, and tokens out of your codebase.
            .env file
            API_KEY=abc123xyz


    ✅ 2. Flexibility
        Switch between environments (development, testing, production) without rewriting code.
            .env file
            NODE_ENV=production


    ✅ 3. Portability
        Deploy the same code to different machines or platforms with different settings.
            .env file
            PORT=3000


    ✅ 4. Separation of Concerns
        Your code focuses on logic, while configuration lives elsewhere — cleaner and easier to maintain.


🧠 Quick Notes:
    .env files contain key-value pairs like US=India.
    dotenv.config() reads those pairs and injects them into process.env.
    process.env is a global object in Node.js that holds all environment variables.
    Always keep .env files out of version control by adding them to .gitignore.
*/