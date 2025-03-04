export const buildNewGameModal = async function () {

    return ({
        "type": "modal",
        "callback_id": "new_game_modal",
        "notify_on_close": false,
        "title": {
          "type": "plain_text",
          "text": "Start New Game",
          "emoji": true,
        },
        "submit": {
          "type": "plain_text",
          "text": "Sweep!",
          "emoji": true
        },
        "close": {
          "type": "plain_text",
          "text": "Cancel",
          "emoji": true
        },
        "blocks": [
          {
            "type": "divider"
          },
          {
            "type": "section",
            "block_id": "firl",
            "text": {
              "type": "mrkdwn",
              "text": " "
            }
          },
          {
            "type": "input",
            "block_id": "gametype_block",
            "label": {
              "type": "plain_text",
              "text": "Select the level of game you would like to start:"
            },
            "element": {
              "action_id": "donothing_action",
              "type": "static_select",
              "placeholder": {
                "type": "plain_text",
                "text": " "
              },
              "options": [
                {
                  "text": {
                    "type": "plain_text",
                    "text": "Beginner - 9x9, 10 mines"
                  },
                  "value": "beginner"
                },
                {
                  "text": {
                    "type": "plain_text",
                    "text": "Intermediate - 16x16, 40 mines"
                  },
                  "value": "intermediate"
                },
                {
                  "text": {
                    "type": "plain_text",
                    "text": "Expert - 16x30, 99 mines"
                  },
                  "value": "expert"
                }
              ]
            }
          },
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": " "
            }
          },
        ],
      });
    
}