import { Body, Controller, Get, HttpException, HttpStatus, Post } from '@nestjs/common';
import { DiscordService } from './discord.service';
import { MessageDto } from './message.dto';
import { GameDto } from './game.dto';

@Controller('discord')
export class DiscordController {
  constructor(private readonly discordService: DiscordService) {}

  @Get('send')
  sendMessage(@Body()message:MessageDto){
    if(!message || !message.message)
      return new HttpException('Mensaje vacio',HttpStatus.BAD_REQUEST)
    try {
      return this.discordService.sendMessage(message.message);
    } catch (error) {
      return new HttpException('Error al enviar mensaje',HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('gameAlert')
  sendGameAlert(@Body()games:GameDto[]){
    if(!games || games.length==0)
      return new HttpException('No hay juegos', HttpStatus.BAD_GATEWAY)
    return this.discordService.sendGameAlert(games);
  }
}
