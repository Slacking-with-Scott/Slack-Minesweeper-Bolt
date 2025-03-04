export const invalidSquareSelection = async function () {

    return ({
        "type": "modal",
        "callback_id": "invalid_square",
        "notify_on_close": false,
        "title": {
          "type": "plain_text",
          "text": "Invalid Square",
          "emoji": true,
        },
        "close": {
          "type": "plain_text",
          "text": "Close",
          "emoji": true
        },
        "blocks": [
            {
                "type": "divider",
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text":
                    ":no_entry: *Your selection must be in the format of \"Column, Row\",*\n:blank_emoji: *separated by a comma.*",
                },
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": " ",
                },
            },
            {
                "type": "context",
                "elements": [
                  {
                    "type": "mrkdwn",
                    "text": ":blank_emoji: _*Examples:* \"B,4\" or \"S,17\" or \"O,25\"_"
                  }
                ]
            }
        ],
      });
    
}

export const squareNotInRange = async function (pick_text, maxRowText, maxColumnText ) {

  return ({
      "type": "modal",
      "callback_id": "invalid_square",
      "notify_on_close": false,
      "title": {
        "type": "plain_text",
        "text": "Invalid Square Selection",
        "emoji": true,
      },
      "close": {
        "type": "plain_text",
        "text": "Close",
        "emoji": true
      },
      "blocks": [
          {
              "type": "divider",
          },
          {
              "type": "section",
              "text": {
                  "type": "mrkdwn",
                  "text":
                  ":no_entry: *Your selection of* " + pick_text + " *is not in a valid range.*",
              },
          },
          {
              "type": "section",
              "text": {
                  "type": "mrkdwn",
                  "text": " ",
              },
          },
          {
            "type": "context",
            "elements": [
              {
                "type": "mrkdwn",
                "text": ":blank_emoji: _The column must be between_ " + maxRowText + " _and the row must be between_ " + maxColumnText + " _._"
              }
            ]
        }
        
      ],
    });
  
}

export const gameWinner = async function (timeResult) {

  return ({
      "type": "modal",
      "callback_id": "game_winner",
      "notify_on_close": false,
      "title": {
        "type": "plain_text",
        "text": "Game Winner",
        "emoji": true,
      },
      "close": {
        "type": "plain_text",
        "text": "Close",
        "emoji": true
      },
      "blocks": [
          {
              "type": "divider",
          },
          {
              "type": "section",
              "text": {
                  "type": "mrkdwn",
                  "text":
                  ":tada: *Congratulations! You have cleared all the mines!*" ,
              },
          },
          {
              "type": "section",
              "text": {
                  "type": "mrkdwn",
                  "text": " ",
              },
          },
          {
            "type": "context",
            "elements": [
              {
                "type": "mrkdwn",
                "text": ":blank_emoji: You completed the board in: `" + timeResult + "`"
              }
            ]
        }
        
      ],
    });
  
}

export const gameLost = async function () {

  return ({
      "type": "modal",
      "callback_id": "game_winner",
      "notify_on_close": false,
      "title": {
        "type": "plain_text",
        "text": "Mine Exploded",
        "emoji": true,
      },
      "close": {
        "type": "plain_text",
        "text": "Close",
        "emoji": true
      },
      "blocks": [
          {
              "type": "divider",
          },
          {
              "type": "section",
              "text": {
                  "type": "mrkdwn",
                  "text":
                  ":minesweeper-mine_exploded:   *Oh no!  A mine has exploded!* :collision:" ,
              },
          },
          {
              "type": "section",
              "text": {
                  "type": "mrkdwn",
                  "text": " ",
              },
          },
          {
            "type": "context",
            "elements": [
              {
                "type": "mrkdwn",
                "text": ":blank_emoji: You can start a new game using the button at the top of the screen."
              }
            ]
          }
        
      ],
    });
  
}