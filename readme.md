
# Minesweeper for Slack

The old Minesweeper game, in your Slack!

You can play three different levels:


| Level | Grid Size | Mines |
| :---: | :---: | :---: |
| Beginner | `9x9` | 10 |
| Intermediate | `16x16` | 40 |
| Expert | `16x30` | 99 |


## Prerequisites

This game is built on Slack's Javascript Bolt SDK framework, so you will need the following:

* Ability to create a Slack application
* A server or some location to host the files and run NodeJS.  This cannot be a stateless server, as the application uses `node-json-db` as a quick little database to store data related to the game.  That means your server must be able to write to a persistent file.


## Installation

The game uses several custom emojis.   In order for the game to display properly, these emojis must be installed into your workspace.

**Step 1:** _Install the emojis_
* From the `graphics/emojis` folder, install all emojis (62) into your Slack workspace. If you need a quick way to do this, I recommend using [Neutral Face Emoji Tools](https://github.com/Fauntleroy/neutral-face-emoji-tools).

**Step 2:** _Create the Slack application from http://api.slack.com/apps_
* You can use the manifest from `slack_app_manifest.json` when creating the app, as it contains all the necessary settings.
* Under the **Basic Information** tab:
  * Create your App-Level token (with `connections:write`) 
  * Add the descriptions and app icon (located under `graphics/misc`)
* Under the **Install App** tab, install the app to your workspace

**Step 3:** _Code setup_
* Copy your app token and bot token (after installing the app to Slack) to the `.env` file.
* Install the necessary packages by running `npm install`

**Step 4:** _Launch application_
* Run the application and begin sweeping by running `node app.js`


    
## Instructions - How to Play

The basic instructions to play the game are to clear all the mines without exploding anything.  To do this, every square that does not contain a mine must be revealed.  For more information, see the content at [Wikipedia](https://en.wikipedia.org/wiki/Minesweeper_(video_game)).

In this Slack application, the entirety of the game is played in the "App Home" section.  To get there, you must first open the App.  The application only needs to be installed **ONCE** on your workspace.  Once installed, any user can simply use the app by opening a conversation with it, namely be searching for the app in the Search bar at the top.

You can even send users a link to the App using the following URL:  https://slack.com/app_redirect?app=A1234567890, where `A1234567890` is the App ID of your app that you just installed, which will be different for every workspace.

At any time, a user can start a new game by pressing the red **Start A New Game button.**

To select a square to pick/reveal, type in the column/row into the text box, separated by a comma.  For instance, to pick the top left square type `A,1`.
* To reveal the square, press the **PICK SQUARE** button.
* To flag the square as a mine, press the **THIS SQUARE** button.  If the square already has a flag, then pressing this button will CLEAR the flag.
* If you are questioning the square as a possible mine, press the **QUESTION** button.  If the square already has a flag, then pressing this button will CLEAR the question mark.

Once you have made your selection, the game will reveal the square, just like the original game.  If you have successfully cleared all squares or incorrectly picked a mine, a window will pop up letting you know.

Have fun!
## Future enhancements

- Tracking of high scores for each level

- Additional board sizes?


    
      





## License

[GNU General Public License v3.0](https://choosealicense.com/licenses/gpl-3.0/)


## Acknowledgements

Always give credit where credit is due.  I used some code and ideas for the game from the following:

 - [1000mines.com - Classic](https://www.1000mines.com/#classic)
 - [urluur/minesweeper-js](https://github.com/urluur/minesweeper-js)
 - [Create a Minesweeper Game using HTML CSS & JavaScript](https://www.geeksforgeeks.org/create-a-minesweeper-game-using-html-css-javascript/)
 - [Accurate Human Logical Time Difference Javascript Function](https://gist.github.com/spoeken/4705863)

