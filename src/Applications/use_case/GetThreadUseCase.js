class GetThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCaseThread) {
    await this._threadRepository.checkAvailabilityThread(useCaseThread);
    return this._threadRepository.getThreadById(useCaseThread);
  }
}

module.exports = GetThreadUseCase;
