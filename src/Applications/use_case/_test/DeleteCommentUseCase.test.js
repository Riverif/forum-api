const CommentRepository = require("../../../Domains/comments/CommentRepository");
const DeleteCommentUseCase = require("../DeleteCommentUseCase");

describe("DeleteCommentUseCase", () => {
  it("should orchestrating the delete user action correctly", async () => {
    //Arranger

    const useCaseCredential = "user-123";
    const useCaseCommentId = "comment-123";

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();

    mockCommentRepository.checkCommentById = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    //Action
    await deleteCommentUseCase.execute(useCaseCommentId, useCaseCredential);

    //Assert
    expect(mockCommentRepository.deleteComment).toBeCalledWith(
      useCaseCommentId,
    );
  });
});
