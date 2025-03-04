import { home_opened } from "./actions/app_home_opened.js";
import { buildNewGameModal } from "./views/game_actions_views.js";
import * as gameActions from "./actions/game_actions.js";
import { topbuttons } from "./views/button_blocks.js";
import { openingHomeView } from "./views/opening_view.js";

import { elapsedTime } from "./actions/datetime_functions.js";

export const registerAppHomeStuff = (app) => {

    app.event ('app_home_opened', home_opened);

    app.action('donothing_action', async ({ ack }) => {
        ack()
        });


    app.action(/\bsquare_action_button_\w+\b/, async ({ ack, body, payload, client }) => {
        ack()

        // console.log (payload)
        const square_action = (payload.action_id).substring(21)
        await gameActions.processSquare(body, client, square_action)

    });

    
    app.action('code_testing_button', async ({ ack, body, client, payload }) => {

        ack()
        // console.log (body)
        console.log ("Let's do some quick code testing...")
        console.log ('----------------')

        const othertime = 1740575422945
        const nowtime = Date.now()
        console.log ("Then: %s -- Now; %s", othertime, nowtime)
        const theresult = await elapsedTime(othertime, nowtime)
        console.log ("Our final result: " + theresult)

        
    });

    app.action ('new_game', async ({ ack, body, client, payload }) => {
    
        ack()

        const newgamewindow = await client.views.open ({
            trigger_id: body.trigger_id,
            view: await buildNewGameModal()
        })
    });


    app.view ('new_game_modal', async ({ack, body, client, payload }) => {

        ack()
        let selectedBoardType = ""

        if (body.view.state.values.gametype_block.donothing_action.selected_option) {
            selectedBoardType = (body.view.state.values.gametype_block.donothing_action.selected_option.value)
        } else {
            // console.log ("No selection")
        }

        //make the new board
        const gameboard = await gameActions.newGameBoard(selectedBoardType, body.user.id)
        
        //refresh app home
        const msgblocks = await topbuttons();

        const result = await client.views.publish ({
            user_id: body.user.id,
            view: {
                type: "home",
                blocks: await msgblocks.concat( await openingHomeView(body.user.id) )
            }

        })

    });
}