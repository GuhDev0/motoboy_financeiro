import { ca } from "zod/locales";
import { AnaliseService } from "../Service/analise.service.js";

export class AnaliseController {
    constructor(
        private analiseService: AnaliseService = new AnaliseService()
    ) {}
    analise = async (req: any, res: any) => {
        const userId = req.user.id;
        if(!userId) {
            return res.status(401).json({ error: "Token not provided" });
        }

        try {
            const resultado = await this.analiseService.analise(userId);
            res.json(resultado);
        }catch (error: any) {
            console.error(error);
            res.status(500).json({ error: error.message || "Erro ao realizar análise" });
        }
    }
}