const NewComment = require("../../Domains/comments/entities/NewComment");

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload, useCaseThread, useCaseCredential) {
    const newComment = new NewComment(useCasePayload);
    await this._threadRepository.checkAvailabilityThread(useCaseThread);

    return this._commentRepository.addComment(
      newComment,
      useCaseThread,
      useCaseCredential,
    );
  }
}

module.exports = AddCommentUseCase;
