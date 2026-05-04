import { GainRepository } from "../Repository/gain.repository.js";
import type { CreateGainDTO, UpdateGainDTO } from "../dto/GainDTO.js";

export class GainService {
  private gainRepository = new GainRepository();

  createGain = async (userId: number, gainData: CreateGainDTO) => {
    return this.gainRepository.create(userId, gainData);
  };

  getAllGains = async (userId: number) => {
    return this.gainRepository.findAll(userId);
  };

  getGainById = async (userId: number, id: number) => {
    return this.gainRepository.findById(userId, id);
  };

  updateGain = async (userId: number, id: number, gainData: UpdateGainDTO) => {
    return this.gainRepository.update(userId, id, gainData);
  };

  deleteGain = async (userId: number, id: number) => {
    return this.gainRepository.delete(userId, id);
  };
}
