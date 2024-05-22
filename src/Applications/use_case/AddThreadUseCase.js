const CreateThread = require("../../Domains/threads/entities/CreateThread");

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload, useCaseCredential) {
    const createThread = new CreateThread(useCasePayload);
    return this._threadRepository.addThread(createThread, useCaseCredential);
  }
}

module.exports = AddThreadUseCase;
