// import dependencies
import bolt from '@slack/bolt'
import "dotenv/config"
import { registerAppHomeStuff } from './app_home/index.js';

const { App, LogLevel } = bolt;

// Initializes your app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true,
  // logLevel: LogLevel.DEBUG
});


//register the listeners, then start the app
registerAppHomeStuff(app);


(async () => {
  // Start your app
  await app.start();
  console.log ('\n\n     ------------------------------------------')
  console.log('     -       ⚡️ Bolt app is running!          -');
  console.log ('     -                                        -')
  console.log ('     -  💣💥💣  Go sweep some mines! 💣💥💣   -')
  console.log ('     ------------------------------------------\n\n')

})();

