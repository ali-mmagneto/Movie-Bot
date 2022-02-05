const {Telegraf}  = require('telegraf');
const express = require('express');
const app = express();
const PORT = process.env.PORT|| 4000;
const axios  = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.start((ctx) =>{
    try {
        ctx.reply('Hoş geldin! Bu IMDB botuna. ayrıntılar için herhangi bir film adı yazın.').catch((err)=>{
            if(err){
                console.log("err")
                console.log(err)
                bot.stop('SIGINT');
                bot.stop('SIGTERM')
            }
        })
    } catch (error) {
        console.log("blocked")
        console.log(error)
    }
})
bot.help((ctx) => ctx.reply('ayrıntılar için film adı yazın.'))
bot.on('sticker', (ctx) => ctx.reply('👍'))
bot.on('text',async(ctx)=>{
    let query = ctx.update.message.text;
    
    try {

        const data = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=d4f4bbc8b9595d0a2dff68a77515c33f&query=${query}`)
        const result = data.data.results;
     if(result.length>0){
         result.forEach((x)=>{
             let desc = x.overview.substring(0,900);
             ctx.replyWithPhoto(x.poster_path?`https://image.tmdb.org/t/p/w600_and_h900_bestv2${x.poster_path}`:'https://unsplash.com/photos/_7HU079sGNw',
             {caption: "*Adı* : "  + x.title + "\n" + "*Orjinal Dili* : "  + x.original_language + "\n" + "*TMDB Puanı*: "  + x.vote_average + "\n" + "*Yayınlanma Zamanı* : " + x.release_date,parse_mode:"Markdown"})
         })
     }else{
         ctx.reply(`${query} İsimli Film Bulunamadı ${ctx.update.message.from.first_name}!!`);
         //ctx.replyWithDice();
         ctx.reply('🙀')
     }
        
    } catch (error) {
        console.log('error: ')
        console.log(error)
    }
     
})


bot.launch()


// Enable graceful stop
//process.once('SIGINT', () => bot.stop('SIGINT'))
//process.once('SIGTERM', () => bot.stop('SIGTERM'))

console.log('app started')

app.get('/',(req,res)=>{
   
    res.redirect('http://www.khushnoodahmed.in/')
});

app.listen(PORT,()=>{
    console.log(`running on ${PORT}`);
})
