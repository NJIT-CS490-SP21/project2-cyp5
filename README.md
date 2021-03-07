# Project 2 Milestone 2
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
6. If one user is taking his/her turn then the other user won't be able to click on the board unless the opposite player takes his/her turn.

## Requirements
1. `npm install`
2. `pip install -r requirements.txt`
3. `pip install python-dotenv`

## Setup
1. Run `echo "DANGEROUSLY_DISABLE_HOST_CHECK=true" > .env.development.local` in the project directory

## Databases setup
1. Install PostGreSQL: `sudo yum install postgresql postgresql-server postgresql-devel postgresql-contrib postgresql-docs` Enter yes to all prompts.
2. Initialize PSQL database: `sudo service postgresql initdb`
3. Start PSQL: `sudo service postgresql start`
4. Make a new superuser: `sudo -u postgres createuser --superuser $USER` **If you get an error saying "could not change directory", that's okay! It worked!**
5. Make a new database: `sudo -u postgres createdb $USER` **If you get an error saying "could not change directory", that's okay! It worked!**
6. Make sure your user shows up:
- a) `psql`
- b) `\du` look for ec2-user as a user
- c) `\l` look for ec2-user as a database
7. Make a new user:
- a) `psql` (if you already quit out of psql)
- b) Type this with your username and password (DONT JUST COPY PASTE): `create user some_username_here superuser password 'some_unique_new_password_here';` e.g. `create user namanaman superuser password 'mysecretpassword123';`
- c) \q to quit out of sql
8. Save your username and password in a `sql.env` file with the format `SQL_USER=` and `SQL_PASSWORD=`.

### Create a new database on Heroku and connect to the code
1. In your terminal, go to the directory with `app.py`
2. Now set up a new remote Postgres database with Heroku and connect to it locally.
3. Login and fill creds: `heroku login -i`
4. Create a new Heroku app: `heroku create`
5. Create a new remote DB on your Heroku app: `heroku addons:create heroku-postgresql:hobby-dev` (If that doesn't work, add a `-a {your-app-name}` to the end of the command, no braces)
6. See the config vars set by Heroku for you: `heroku config`. Copy paste the value for DATABASE_URL.
7. Create .env file in your directory. Add value of `DATABASE_URL` by entering this in the .env file: `export DATABASE_URL='copy-paste-value-in-here'`

### Use Python code to update our newly created database
8. In the terminal, go to the directory with `app.py` and run the command `python` which opens up an interactive session.
9. Now intinalize a new database and add some dummy values in it using SQLAlchemy functions. Then type in these Python lines one by one:
```
>> from app import db
>> import models
>> db.create_all()
>> admin = models.Person(username='admin', score=100)
>> guest = models.Person(username='guest', score=100)
>> db.session.add(admin)
>> db.session.add(guest)
>> db.session.commit()
```
10. Now let us make sure that our data was added successfully by the queires we wrote above. In the same `python` session, type the following lines:
```
>> models.Person.query.all()
[<Person u'admin'>, <Person u'guest'>] # output
>> models.Person.query.filter_by(username='admin').first()
<Person u'admin'> # output
```
11. Now we have to make sure that this was written to our Heroku remote database.
12. We can connect to our Heroku remote database by typing: `heroku pg:psql`.
13. `\d` to list all our tables. `person` should be in there now.

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
created a new state called `const [error, setError] = useState("")` to  catch if details are actually correct and passed the error message in
setError to check if the input box is left empty or not.

* Another problem I had was while working on milestone 2. I was having issues when I was restarting the board. I was updating the board after a game using `const [board2,setBoard2] = useState(0);`
The problem was after the game was over it kept updating the useState whith the old game moves and because of that I was having issues with my database scores. I solved this issue by using
by adding global variables and functions.

* In milestone 2, I also at first forgot to `git remote rm heroku` to get rid  of the existing remote repo from milestone 1. To fix this problem first I did `git remote rm heroku`,
then I did `heroku create`. This steps gave me a new app and a new Database url for the app. Then I had to follow the above steps from `Use Python code to update our newly created database`.

## Known Problems
* Firstly, a current know problem that I have in my app is when a user logs in with the username, then the username gets appended to the names list that
I have made in my app.py. I have added a logout button on the UI when clicked it clears the names in the username list. If the logout button is 
not clicked by the user after a section then their names will remain in the users list and the next user will able to see the previous user. <b>User's 
using this app have to make sure to click the logout button after each section.</b>

* Secondly, It is taking more time to load the app when clicking on the heroku app link. So sometimes when Player X makes a move on one tab'
it might take some time to reflect that on Player's O tab or on the spectators tab.

* For future I wold like to add more CSS and add animation when a winner wins in my live board.

* Also, I want to add a feature where if a win is detected currently it prints out if PlayerX or PlayerO won. I want to print out the username
of the player on win it winner output.


## Link to my heroku app
[React-Tic Tac Toe](https://cryptic-peak-11823.herokuapp.com/)