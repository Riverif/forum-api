class DeleteCommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute(useCaseCommentId, useCaseCredential) {
    await this._commentRepository.checkCommentById(
      useCaseCommentId,
      useCaseCredential,
    );
    return this._commentRepository.deleteComment(useCaseCommentId);
  }
}

module.exports = DeleteCommentUseCase;
