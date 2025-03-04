import { openingHomeView } from "../views/opening_view.js";
import { topbuttons } from "../views/button_blocks.js";

import { JsonDB, Config } from 'node-json-db';

var game_db = new JsonDB(new Config("./data_files/game_db", true, true, '/'))

export const home_opened = async function (app, view, client) {


    await game_db.reload();

    // console.log (app.event)

    const theuser = app.event.user;

    if (app.event.tab === "home") {

        console.log ("App Home home tab opened")
        console.log ('-----------------------------')
        // console.log (app.client)
        // console.log ('-----------------------------')
        // console.log (app.event)

        // console.log (event.payload.user)
        const userId = app.event.user


        const msgblocks = await topbuttons();

        try {

            const result = await app.client.views.publish ({
                user_id: theuser,
                view: {
                    type: "home",
                    blocks: await msgblocks.concat( await openingHomeView(userId) )
                }

            })

        } catch (error) {
            console.error ("Error opening an app home view:")
            console.error (error)
        }

        return
      } else if (app.event.tab === "messages") {
          console.log ("Opened messages tab");
        return
      }

}