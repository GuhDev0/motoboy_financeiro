import jwt from "jsonwebtoken";
import { UserRepository } from "../Repository/user.repository.js";
import type { LoginDTO } from "../dto/AuthDTO.js";
import dotenv from "dotenv";

dotenv.config();
export class AuthService {
  private userRepository = new UserRepository();

  login = async ({ email, password }: LoginDTO) => {
    const user = await this.userRepository.findByEmail(email);

    if (!user || user.password !== password) {
      throw new Error("Credenciais inválidas");
    }

    const token = jwt.sign(
      {
        id: user.id,
        nomeCompleto: user.nameComplete,
        email: user.email,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1h",
      }
    );

    return token;
  };
}
