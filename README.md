# API for  Q&A platform
A RESTful API for a Q&A platform where users can Create, Update, Delete and Vote on questions and answers.

## Table of Contents
- [Features](#features)
- [Requirements](#requirements)
- [Setup](#setup)
- [๊Using](#Using)


## Features
- **CRUD Operations**: Create, read, update, and delete questions and answers.
- **Voting System**: Allows users to upvote or downvote questions and answers.
- **Data Validation**: Uses middleware for validating requests to ensure data integrity.
- **Error Handling**: Provides clear error messages for invalid requests.

## Requirements
- **Node.js** (version 20 or higher)
- **PostgreSQL** (for database management)
- **npm** (for managing dependencies)

## Setup
1. **Clone the repository**:
   
   ```git clone https://github.com/Thammaruthai/backend-skill-checkpoint-express-server.git ```
   ```cd qa-platform-api```
   

2. **Install dependencies**:

   ```npm install ```

3. **Set up the database**:
   install ProgreSQL
   SQL scipt [here](https://gist.githubusercontent.com/napatwongchr/811ef7071003602b94482b3d8c0f32e0/raw/ecd17b04554026fdd8dad0cd24d7b08d3b684fe5/quora-mock.sql)
   
4. **Configure environment variables**:
   Config .env file for port and Database URL
   PORT=4000
   DATABASE_URL=your_database_connection_string
   
5. **Run the server**:
   ```npm start```

6. **Access the API**:
   Once the server is running, you can access the API at http://localhost:4000


## Using
use PostMan or other RESTFUL API software to CRUD operation
API Doc is [here](https://docs.google.com/spreadsheets/d/1M68YgfcJ5LqxASjxxIAmaFz3x7CjrfUt5sh1a8KAe2A/edit?gid=0#gid=0)
