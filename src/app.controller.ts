import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('/fullfillment')
export class AppController {
  constructor(private readonly appService: AppService) {}

}
