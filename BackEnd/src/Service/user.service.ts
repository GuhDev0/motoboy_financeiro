import { UserRepository } from "../Repository/user.repository.js";
import type { CreateUserDTO } from "../dto/UserDTO.js";

export class UserService {
  private userRepository = new UserRepository();

  createUser = async (userData: CreateUserDTO) => {
    return this.userRepository.create(userData);
  };

  getAllUsers = async () => {
    return this.userRepository.findAll();
  };

  getUserById = async (id: number) => {
    return this.userRepository.findById(id);
  };

  updateUser = async (id: number, userData: Partial<CreateUserDTO>) => {
    return this.userRepository.update(id, userData);
  };

  deleteUser = async (userId: number, id: number) => {
    if (userId !== id) {
      throw new Error("Usuário não autorizado");
    }

    return this.userRepository.delete(id);
  };
}

