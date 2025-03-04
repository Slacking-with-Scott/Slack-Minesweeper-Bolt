import { JsonDB, Config } from 'node-json-db';

var game_db = new JsonDB(new Config("./data_files/game_db", true, true, '/'))

export const openingHomeView = async function(theuser) {

    await game_db.reload();

    const usergamedata = await game_db.getObjectDefault("/" + theuser + "/game_status", "nodata")

    let gamestatus_text = ""
    if (usergamedata !== "nodata") {
      switch (usergamedata) {
          case "active": {
            gamestatus_text = ":large_green_circle: _Active_ "
            break;
          };
          case "lost": {
            gamestatus_text = ":red_circle: _A mine has exploded!_ "
            break;
          };
          case "winner": {
            gamestatus_text = ":tada: _You cleared the board!_ "
            break;
          };
      }
    }
    console.log ("Game status: " + usergamedata)

    //Need to check for this... what to do if user has no game?
    const user_board_data = JSON.parse(await game_db.getData("/" + theuser + "/board_data"))
    const game_level = await game_db.getData("/" + theuser + "/game_level")

    let numRows = 0;
    let numColumns = 0;
    let numMines = 0;

    switch (game_level) {
      case "beginner": {
          numRows = 9;
          numColumns = 9;
          numMines = 10;
          break;
      };
      case "intermediate": {
          numRows = 16;
          numColumns = 16;
          numMines = 40;
          break;
      };
      case "expert": {
          numRows = 16;
          numColumns = 30;
          numMines = 99;
          break;
      };
    }

    let flag_count = 0
    //get the count of total mines and total user flagged
    for (let i = 0; i < numRows; i++) {
      for (let j = 0; j < numColumns; j++) {
        if (user_board_data[i][j].isFlagged) { flag_count++ }
      }
    }


    let toprow_text = ":blank_emoji: "

    const gameblocks = [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": ":blank_emoji: *Game status:* " + gamestatus_text
        }
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": " "
        }
      },
    ];
    

    if (usergamedata !== "nodata") {


      console.log ("Let's build the board...")
      const user_board = JSON.parse(await game_db.getData("/" + theuser + "/board_data"))
      console.log ('-----------------')

      for (let i=0; i < user_board[0].length; i++) {
          
        switch (i+1) {
          case (27):
            toprow_text = toprow_text + ":rainbow-circle-aa: ";
            break;
          case (28):
            toprow_text = toprow_text + ":rainbow-circle-bb: ";
            break;
          case (29):
            toprow_text = toprow_text + ":rainbow-circle-cc: ";
            break;
          case (30):
            toprow_text = toprow_text + ":rainbow-circle-dd: ";
            break;
          default:
            const theletter = ((String.fromCharCode((i+1) + 64)).toLowerCase());
            // console.log (theletter)
            toprow_text = toprow_text + ":rainbow-circle-" + theletter + ": "
            break;
        }
        
      }

      gameblocks.push (
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": toprow_text
          },
        },
      )


      let rowIndex = 1
      for (const gamerow of user_board ) {

        // console.log ('------GAMEROW----------')
        // console.log (gamerow)
        // console.log ('------GAMEROW DONE-----')

        let boardtext = ":rainbow-circle-" + rowIndex + ": "
        for (const cellData of gamerow) {

          if (cellData.isExploded == true) {
            boardtext = boardtext + ":minesweeper-mine_exploded: "
          } else if (cellData.misFlagged == true) {
            boardtext = boardtext + ":minesweeper-mine_misflagged: "
          } else if (cellData.isFlagged == true) {
            boardtext = boardtext + ":minesweeper-mine_flagged: "
          } else if (cellData.isQuestioned == true) {
            boardtext = boardtext + ":minesweeper-mine_question: "
          } else if (cellData.revealed == false) {
            boardtext = boardtext + ":minesweeper-blank: "
          } else if (cellData.isMine == true) {
            boardtext = boardtext + ":minesweeper-mine_revealed: "
          // } else if (cellData.isFlagged == true) {
          //   console.log ("Flagged?")
          //   boardtext = boardtext + ":minesweeper-mine_flagged: "
          // } else if (cellData.isQuestioned == true) {
          //   boardtext = boardtext + ":minesweeper-mine_question: "
          } else if (cellData.nextto_count == 0) {
            boardtext = boardtext + ":minesweeper-open_blank: "
          } else {
            boardtext = boardtext + ":minesweeper-" + cellData.nextto_count + ": "
          }
          // console.log (cellData.nextto_count)
          // boardtext = boardtext + ":one: "
        }
        gameblocks.push (
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": boardtext
            },
        },
        )
        // console.log (gamerow)
        rowIndex++;
      }

    }

    const topblocks = [
        // {
        //   "type": "divider"
        // },
        // {
        //   "type": "section",
        //   "text": {
        //     "type": "mrkdwn",
        //     "text": " "
        //   }
        // },
        {
          "type": "header",
          "text": {
            "type": "plain_text",
            "text": "Instructions:",
            "emoji": true
          }
        },
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": " "
          }
        },

        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": ":wave::skin-tone-3: Welcome <@" + theuser + ">!  Let's play a game of *Minesweeper for Slack!*"
          },
        },
        {
      "type": "context",
      "elements": [
            {
              "type": "mrkdwn",
              "text": "_If you can't see the entire board, you may need to expand the size of your Slack window._"
            }
          ]
        },
        {
          "type": "actions",
          "elements": [
            {
              "type": "button",
              "action_id": "new_game",
              "text": {
                  "type": "plain_text",
                  "text": "Start a New Game :new:",
                  "emoji": true
              },
              "value": "new_game",
              //Button style:
              // danger - red button, primary - green button, no style - transparent button
              "style": "danger"
            },
          //   {
          //     "type": "button",
          //     "action_id": "code_testing_button",
          //     "text": {
          //         "type": "plain_text",
          //         "text": "Code Testing :gear:",
          //         "emoji": true
          //     },
          //     "value": "code_testing",
          // },
          ]
        },
        {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": " "
            }
        },
        {
            "type": "divider"
        },
        {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": " "
            }
        },
    ]




    const bottomblocks = [
      // {
      //   "type": "section",
      //   "text": {
      //     "type": "mrkdwn",
      //     "text": ":blank_emoji: *Flagged mines:* `" + flag_count + "` of `" + numMines + "` "
      //   }
      // },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          // "text": ":blank_emoji: :blank_emoji: *Game status:* " + gamestatus_text
          "text": ":blank_emoji: *Flagged mines:* `" + flag_count + "` of `" + numMines + "` "
        }
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": " "
        }
      },
      {
        "type": "input",
        "block_id": "square_input_block",
        "label": {
          "type": "plain_text",
          "text": " ",
          "emoji": true
        },
        "element": {
          "type": "plain_text_input",
          "action_id": "donothing_action",
          "min_length": 3,
          "max_length": 5,
          "placeholder": {
            "type": "plain_text",
            "text": "Enter the column (letter) and row (number) for the square you want to pick (separated by a comma), then press one of the buttons below. Example: B,4"
          }
        },

      },
      {
        "type": "actions",
        "elements": [
          {
            "type": "button",
            "text": {
              "type": "plain_text",
              "text": "Pick Square :minesweeper-open_blank:",
              "emoji": true
            },
            "value": "clear_this_square",
            "style": "primary",
            "action_id": "square_action_button_clear"
          },
          {
            "type": "button",
            "text": {
              "type": "plain_text",
              "text": "Flag Square as Mine :minesweeper-mine_flagged:",
              "emoji": true
            },
            "value": "flag_this_square",
            "style": "primary",
            "action_id": "square_action_button_flag"
          },
          {
            "type": "button",
            "text": {
              "type": "plain_text",
              "text": "Question Square :minesweeper-mine_question:",
              "emoji": true
            },
            "value": "question_this_square",
            "style": "primary",
            "action_id": "square_action_button_question"
          },
          // {
          //   "type": "button",
          //   "action_id": "new_game",
          //   "text": {
          //       "type": "plain_text",
          //       "text": "Start a New Game :new:",
          //       "emoji": true
          //   },
          //   "value": "new_game",
          //   // "style": "danger"
          // },
        ]
      }

    ]

    // return (topblocks.concat(gameblocks, gameblocks))
    return (topblocks.concat(gameblocks, bottomblocks))
}

function cellEmoji (cellinfo) {

  const emojiArray = [

  ]

  
}