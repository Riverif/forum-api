class DeleteCommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute(useCaseCommentId, useCaseCredential) {
    //check availability of comment
    await this._commentRepository.checkCommentById(
      useCaseCommentId,
      useCaseCredential,
    );
    //check ownership of comment
    await this._commentRepository.checkCommentOwnership(
      useCaseCommentId,
      useCaseCredential,
    );
    return this._commentRepository.deleteComment(useCaseCommentId);
  }
}

module.exports = DeleteCommentUseCase;
