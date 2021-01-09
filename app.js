const {Telegraf}  = require('telegraf');
const axios  = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.start((ctx) => ctx.reply('Welcome! this is IMDB bot. type any movie name for details.'))
bot.help((ctx) => ctx.reply('type movie name for details.'))
bot.on('sticker', (ctx) => ctx.reply('👍'))
bot.on('text',async(ctx)=>{
    let query = ctx.update.message.text;
    console.log()
    try {

        const data = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=d4f4bbc8b9595d0a2dff68a77515c33f&query=${query}`)
        const result = data.data.results;
     if(result.length>0){
         result.forEach((x)=>{
             
             ctx.replyWithPhoto(x.poster_path?`https://image.tmdb.org/t/p/w600_and_h900_bestv2${x.poster_path}`:'https://unsplash.com/photos/_7HU079sGNw',
             {caption: "Title : "  + x.title + "\n" + "Original Language : "  + x.original_language + "\n" + "Description : "  + x.overview + "\n" + "Release : " + x.release_date,parse_mode:"Markdown"})
         })
     }else{
         ctx.reply(`No movie with name ${query} found ${ctx.update.message.from.first_name}!!`);
         //ctx.replyWithDice();
         ctx.reply('🙀')
     }
        
    } catch (error) {
        console.log(error)
    }
     
})


bot.launch()


// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

console.log('app started')
