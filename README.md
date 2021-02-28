# Project 2 Milestone 1
## React - Tic Tac Toe
This project is to build a live multiplayer game in the browser. This is a project based on the famous Tic Tac Toe game!. The goal of this project is to build 
a complex web app with more client-server interaction and database persistence.

## Features
1. Multiple users can enter this  game page from different browser tabs and view the same live game!
2. Users will first be prompted to input their username without any required passwords and click “Login”. Upon clicking, 
they will have officially “logged in” and will be able to view the actual Tic Tac Toe game.
3. The first Player that logs in using the link will be assigned as Player 'X' who plays the first turn. The second Player who joins
will be assigned as Player 'O' who plays the second turn. Any subsequent users will be Spectators who can only watch and can't play any moves.
4. The user interface page currently shows the following information and will update them live:
    1. Player X's username
    2. Player O's username
    3. Spectator's username
    4. Winner of the game if any (Player X or Player O)
5. When the game ends, Player X and Player O will have the option to click a button to play again which will reset the board for all players
in the session. 

## Requirements
1. `npm install`
2. `pip install -r requirements.txt`

## Setup
1. Run `echo "DANGEROUSLY_DISABLE_HOST_CHECK=true" > .env.development.local` in the project directory

## Run Application
1. Run command in terminal (in your project directory): `python app.py`
2. Run command in another terminal, `cd` into the project directory, and run `npm run start`
3. Preview web page in browser '/'

## Deploy to Heroku
1. Create a Heroku app: `heroku create --buildpack heroku/python`
2. Add nodejs buildpack: `heroku buildpacks:add --index 1 heroku/nodejs`
3. Push to Heroku: `git push heroku main`

## Technical Problems
What are the technical issues you encountered with your project? How did you fix them?
* In the begining, I was having a hard time understanding the Hooks since this project was to be written only using functional 
components instead of class components. I used different online resources such as [Hooks](https://reactjs.org/docs/hooks-overview.html) which
helped me understand on how to use the state hook, effect hook and the rules of the hooks.

* I was also having trouble where if a user just leaves the username blank and tries to login then it would go through. To solve this problem I 
created a new state called ` const [error, setError] = useState("")` to  catch if details are actually correct and passed the error message in
setError to check if the input box is left empty or not. 

## Known Problems
* A current know problem that I have in my app is when a user logs in with the username, then the username gets appended to the names list that
I have made in my app.py. I have added a logout button on the UI when clicked it clears the names in the username list. If the logout button is 
not clicked by the user after a section then their names will remain in the users list and the next user will able to see the previous user. <b>User 
using this app have to make sure to click the logout button after each section.</b>

* For future I want to add a feature where if a win is detected currently it prints out if PlayerX or PlayerO won. I want to print out the username
of the player on win it winner output.

## Attempted extra credits
1. Added a Logout button where if a user chicks it, then the user gets removed from the user's list displayed on the User Interface.
2. Also, did a bit of CSS styling on the board.