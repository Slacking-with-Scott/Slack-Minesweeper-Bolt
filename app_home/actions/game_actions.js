import { JsonDB, Config } from 'node-json-db';
import * as updateWindows from '../views/success_error_windows.js';
import { topbuttons } from '../views/button_blocks.js';
import { openingHomeView } from '../views/opening_view.js';
import { elapsedTime } from './datetime_functions.js';

var game_db = new JsonDB(new Config("./data_files/game_db", true, true, '/'))


// https://www.geeksforgeeks.org/create-a-minesweeper-game-using-html-css-javascript/
// https://github.com/urluur/minesweeper-js/blob/main/js/game.js
export const newGameBoard = async function (gamelevel, theuser) {

    await game_db.reload();


    let numRows = 0;
    let numColumns = 0;
    let numMines = 0;
    let board = [];

    switch (gamelevel) {
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

    // console.log ("Number of row: %s, Number of Columns: %s, Number of mines: %s", numRows, numColumns, numMines)

    //make the array for the board
    for (let i = 0; i < numRows; i++) {
        board[i] = [];
        for ( let j = 0; j < numColumns; j++ ) {
            board[i][j] = {
                isMine: false,
                revealed: false,
                nextto_count: 0,
                isFlagged: false,
                isQuestioned: false,
            };
        }
    }

    //Place the mines randomly on the board
    let minesPlaced = 0;
    while (minesPlaced < numMines) {
        const row = Math.floor(
            Math.random() * numRows
        );
        const col = Math.floor(
            Math.random() * numColumns
        );
        if (!board[row][col].isMine) {
            board[row][col].isMine = true;
            minesPlaced++;
        }
    }

    //Set the nextto counts (the numbers) ... I'm not 100% sure how the logic works, but i don't want to spend the time figuring it out
    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numColumns; j++) {

            if (!board[i][j].isMine) {
                let count = 0;
                for (let dx = -1; dx <= 1; dx++) {
                    for (let dy = -1; dy <= 1; dy++) {
                        const ni = i + dx;
                        const nj = j + dy;
                        if ( (ni >= 0) && 
                            (ni < numRows) && 
                            (nj >= 0) && 
                            (nj < numColumns) &&
                            (board[ni][nj].isMine)) {

                            count++;
                        }
                    }
                }
                board[i][j].nextto_count = count;
            }
        }
    }
    
    const usergamedata = await game_db.getObjectDefault("/" + theuser + "/board_data", "nodata")

    // console.log ("Game status: " + usergamedata)

    if (usergamedata !== "nodata") {
        await game_db.delete("/" + theuser + "/board_data")
        await game_db.reload();
    }

    const board_start_time = Date.now();

    await game_db.push ("/" + theuser,
        {
            "game_status": "active",
            "game_level": gamelevel,
            "board_start_time": board_start_time,
            "board_data": JSON.stringify(board),
            // "board_data": board
        }, false
    )

    return (board)
}

export const validate_game_size = async function (theuser) {

    await game_db.reload();

    const usergamedata = await game_db.getObjectDefault("/" + theuser + "/board_data", "nodata")

    if (usergamedata !== "nodata") {
        return (await game_db.getData("/" + theuser + "/game_level"))
    } else { 
        return ("No game")
    }
}

export const processSquare = async function (thebody, client, square_action) {

    await game_db.reload();
    
    console.log ("Processing the square with the action of: " + square_action.toUpperCase())
    // console.log (thebody)
    const theuser = thebody.user.id;
    const usergame = await game_db.getData("/" + theuser)
    const the_board = JSON.parse(usergame.board_data)

    const squareInput = thebody.view.state.values.square_input_block.donothing_action.value

    let maxRows = 0;
    let maxColumns = 0;
    let maxRowText = "";
    let maxColumnText = "";

    //determine the number and letter...
    let userColumn = ""
    let userRow = ""
    let temp = true
    let validinput = false

    if (squareInput == null) {
        const errorwindow = await client.views.open ({
            trigger_id: thebody.trigger_id,
            view: await updateWindows.invalidSquareSelection()
        })
    } else {

        const commaindex = squareInput.indexOf(",");

        if ((commaindex == 1) || (commaindex == 2)) {

            userColumn = squareInput.substring(0,(commaindex)).toUpperCase();
            userRow = squareInput.substring((commaindex+1)).toUpperCase();

            /* debugging the input
            console.log ("User column: %s (%s), User Row: %s (%s)", userColumn, parseInt(userColumn), userRow, parseInt(userRow))

            if (!parseInt(userColumn)) {
                console.log ("column is a string")
            } else {
                console.log ("column is a number")
            }
            if (parseInt(userRow)) {
                console.log ("Row is a number")
            } else {
                console.log ("Row is a string")
            }
            */

            if ((!parseInt(userColumn)) && (parseInt(userRow)))  {
                validinput = true;

                //convert the values to array values
                const real_userRow = (parseInt(userRow) - 1)
                const pick_text = "`" + userColumn.toUpperCase() + "," + (real_userRow + 1) + "`"
                let real_userColumn = null;

                if (userColumn.length == 1) {
                    //letters A-Z
                    real_userColumn = (userColumn.toLowerCase().charCodeAt(0) - 97 + 1) - 1  //subtracting one becuase array starts at 0
                } else {
                    //check for letters AA, BB, CC, DD
                    switch (userColumn.toUpperCase()) {
                        case "AA":
                            real_userColumn = 26;
                            break;
                        case "BB":
                            real_userColumn = 27;
                            break;
                        case "CC":
                            real_userColumn = 28;
                            break;
                        case "DD":
                            real_userColumn = 29;
                            break;
                        default:
                            real_userColumn = 99;
                            break;
                    }
                }

                // console.log ("Real User column: %s, Real User Row: %s", real_userColumn, real_userRow)

                switch (usergame.game_level) {
                    case "beginner":
                        maxRows = 9;
                        maxColumns = 9;
                        maxRowText = "`1-9`"
                        maxColumnText = "`A-I`"
                        if ((real_userRow < 0) || ((real_userRow + 1) > maxRows) || ((real_userColumn + 1) > maxColumns)) {
                            validinput = false;
                        }
                        break;
                    case "intermediate":
                        maxRows = 16;
                        maxColumns = 16;
                        maxRowText = "`1-16`"
                        maxColumnText = "`A-S`"
                        if ((real_userRow < 0) || ((real_userRow + 1) > maxRows) || ((real_userColumn + 1) > maxColumns)) {
                            validinput = false;
                        }
                        break;      
                    case "expert":
                        maxRows = 16;
                        maxColumns = 30;
                        maxRowText = "`1-16`"
                        maxColumnText = "`A-DD`"
                        if ((real_userRow < 0) || ((real_userRow + 1) > maxRows) || ((real_userColumn + 1) > maxColumns)) {
                            validinput = false;
                        }
                        break;
                }


                if (!validinput) {
                    const errorwindow = await client.views.open ({
                        trigger_id: thebody.trigger_id,
                        view: await updateWindows.squareNotInRange(pick_text, maxRowText, maxColumnText)
                    })
                    return;
                }
                
                if (square_action.toUpperCase() == "FLAG") {

                    if (the_board[real_userRow][real_userColumn].revealed !== true) {
                        the_board[real_userRow][real_userColumn].isQuestioned = false;
                        if (the_board[real_userRow][real_userColumn].isFlagged == false) {
                            the_board[real_userRow][real_userColumn].isFlagged = true;
                        } else {
                            the_board[real_userRow][real_userColumn].isFlagged = false;
                        }
                    }

                    
                } else if (square_action.toUpperCase() == "QUESTION") {

                    if (the_board[real_userRow][real_userColumn].revealed !== true) {
                        the_board[real_userRow][real_userColumn].isFlagged = false;
                        if (the_board[real_userRow][real_userColumn].isQuestioned == false) {
                            the_board[real_userRow][real_userColumn].isQuestioned = true;
                        } else {
                            the_board[real_userRow][real_userColumn].isQuestioned = false;
                        }
                    } 

                } else {
                    //user wants to reveal the square, so let's clear these flags if they are set
                    the_board[real_userRow][real_userColumn].isQuestioned = false;
                    the_board[real_userRow][real_userColumn].isFlagged = false;

                    const squareResult = await revealSquare(the_board, real_userRow, real_userColumn, maxRows, maxColumns, theuser)


                    if (squareResult == "winner winner") {
                        //chicken dinner

                        const nowTime = Date.now()
                        const beginTime = await game_db.getData("/" + theuser + "/board_start_time")
                        const timeResult = await elapsedTime(beginTime, nowTime)

                        const successwindow = await client.views.open ({
                            trigger_id: thebody.trigger_id,
                            view: await updateWindows.gameWinner(timeResult)
                        })
                    }

                    if (squareResult == "explosion") {
                        const successwindow = await client.views.open ({
                            trigger_id: thebody.trigger_id,
                            view: await updateWindows.gameLost()
                        })
                    }

                }

                await game_db.push("/" + theuser + "/board_data", JSON.stringify(the_board))


                //refresh app home

                const msgblocks = await topbuttons();

                const result = await client.views.publish ({
                    user_id: theuser,
                    view: {
                        type: "home",
                        // blocks: await topbuttons("none", theuser)
                        blocks: await msgblocks.concat( await openingHomeView(theuser) )
                    }
    
                })

            }

        } else {
            console.log ("Comma in an invalid location or not found")
            // const errorwindow = await client.views.open ({
            //     trigger_id: thebody.trigger_id,
            //     view: await invalidSquareSelection()
            // })
        }

        if (!validinput) {
            const errorwindow = await client.views.open ({
                trigger_id: thebody.trigger_id,
                view: await updateWindows.invalidSquareSelection()
            })
        }

    }

    

return
    // code below was me trying to think of a way to do without the comma...  
    // too many variables to figure out, so I gave up
    // I'll leave it here in case I want to come back to this as a future enhancement
    if (squareInput.length == 2) {
        userColumn = squareInput.substring(0,1)
        userRow = squareInput.substring(1,2)
    } else if (squareInput.length == 4) {
        userColumn = squareInput.substring(0,2)
        userRow = squareInput.substring(2,4)
    } else {
        console.log ("three...let's think about it")
        temp = false;

        //let's test for a string in first or second
        userColumn = squareInput.substring(0,2) //check the first two letters
        if (!parseInt(userColumn)) {
            console.log ("3-column-2 is a string")
        } else {
            console.log ("3-column-2 is not a string")
        }
    }

    if (temp) {
        console.log ("User column: %s (%s), User Row: %s (%s)", userColumn, parseInt(userColumn), userRow, parseInt(userRow))
        if (!parseInt(userColumn)) {
            console.log ("column is a string")
        }
        if (parseInt(userRow)) {
            console.log ("Row is a number")
            //console.log (typeof(userColumn))
        }
    }
 
}


async function revealSquare (the_board, therow, thecolumn, maxRows, maxColumns, theuser) {

    if ((therow < 0) || (therow >= maxRows) || (thecolumn < 0) || (thecolumn >= maxColumns) || (the_board[therow][thecolumn].revealed)) {
        // console.log ("One of these is true %s, %s", therow, thecolumn)
        return ("no action")
    }

    the_board[therow][thecolumn].revealed = true;

    if (the_board[therow][thecolumn].isMine) {
        console.log ("Game over!  You chose a mine!")
        the_board[therow][thecolumn].isExploded = true;

        await game_db.push ("/" + theuser,
            {
                "game_status": "lost",
            }, false
        )

        //Reveal all mines
        for (let i = 0; i < maxRows; i++) {
            for (let j = 0; j < maxColumns; j++) {
                if (the_board[i][j].isMine) {
                    the_board[i][j].isFlagged = false
                    the_board[i][j].revealed= true
                } else if ((the_board[i][j].isFlagged) && (!the_board[i][j].revealed)) {
                    the_board[i][j].misFlagged = true;
                    the_board[i][j].isFlagged = false
                }
            }
        }

        return ("explosion")

    } else if (the_board[therow][thecolumn].nextto_count === 0) {
        // recursively check all the offsets to determine if there is a blank
        for (let x_offset = -1; x_offset <= 1; x_offset++) {
            for (let y_offset = -1; y_offset <= 1; y_offset++) {
                await revealSquare(the_board, (therow + x_offset), (thecolumn + y_offset), maxRows, maxColumns, theuser)
            }
        }
    } else {
        //check to see if we have won
        const test_for_win = await checkForWin (the_board, maxRows, maxColumns, theuser)
        return (test_for_win)
    }

}

async function checkForWin (the_board, maxRows, maxColumns, theuser) {

    //Reveal all mines
    for (let i = 0; i < maxRows; i++) {
        for (let j = 0; j < maxColumns; j++) {
            if ((!the_board[i][j].isMine) && (!the_board[i][j].revealed)) {
                return (false)
            }
        }
    }

    //set to win!
    console.log ("You win!")
    await game_db.push ("/" + theuser,
        {
            "game_status": "winner",
        }, false
    )

    return ("winner winner")
    
}
