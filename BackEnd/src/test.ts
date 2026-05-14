import dotenv from "dotenv";
 dotenv.config();   


import { AnaliseService } from "./src/Service/analise.service.js";
const analiseService = new AnaliseService();
analiseService.analise(2);