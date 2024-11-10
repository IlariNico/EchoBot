import { OnModuleInit } from '@nestjs/common';
import { Client, EmbedBuilder, GatewayIntentBits, TextChannel } from 'discord.js';
import * as dotenv from 'dotenv';
import { GameDto } from './game.dto';
import { translate } from '@vitalets/google-translate-api';


dotenv.config(); // Asegúrate de que las variables de entorno se carguen correctamente

export class DiscordService implements OnModuleInit {
    private client: Client;
    private channel: TextChannel;

    constructor() {
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
            ],
        });

        this.client.on('ready', async () => {
            console.log('Bot está listo.');

            const channelId = process.env.CHANNEL_ID;
            if (!channelId) {
                console.error('CHANNEL_ID no está definido en el archivo .env');
                return;
            }

            // Asegúrate de que el canal existe y es un TextChannel
            const channel = this.client.channels.cache.get(channelId);

            if (channel instanceof TextChannel) {
                this.channel = channel;
                //this.channel.send('Hello World');
            } else {
                console.error('El canal no se encontró o no es un canal de texto válido.');
            }
        });
    }

    sendMessage(message:string):void{
        this.channel.send(message);
    }

    async sendGameAlert(games:GameDto[]){
        games.forEach(async game=>{
            const embed = new EmbedBuilder()
            .setTitle(`${game.title} click para obtener!`)
            .setImage(game.image) 
            .setColor('#ff0000')
            .setURL(game.url);
            game.description = (await translate(game.description, { from: 'en', to: 'es' })).text;
            const msg = `¡Juego Gratis en ${game.platform}!\n${game.title}\n${game.description}`;
            this.channel.send({content:msg,embeds:[embed]});
        })
    }

    async onModuleInit() {
        const token = process.env.BOT_TOKEN;
        if (!token) {
            console.error('DISCORD_TOKEN no está definido en el archivo .env');
            return;
        }
        await this.client.login(token); // Usa el token cargado desde el archivo .env
    }
}
