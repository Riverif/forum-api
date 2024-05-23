class GetThreadUseCase {
  constructor({ threadRepository, commentRepository, userRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._userRepository = userRepository;
  }

  async execute(useCaseThread) {
    await this._threadRepository.checkAvailabilityThread(useCaseThread);
    const thread = await this._threadRepository.getThreadById(useCaseThread);
    const { username: threadOwner } =
      await this._userRepository.getRegisteredUserById(thread.owner);
    const { comments } = await this._commentRepository.getCommentsByThreadId(
      useCaseThread,
    );

    const result = {
      id: thread.id,
      title: thread.title,
      body: thread.body,
      date: thread.date,
      username: threadOwner,
      comments: await this.formattedComments(comments),
    };

    return result;
  }

  async formattedComments(comments) {
    return await Promise.all(
      comments.map(async (comment) => {
        const { username } = await this._userRepository.getRegisteredUserById(
          comment.owner,
        );
        if (comment.isDelete === true) {
          return {
            id: comment.id,
            username,
            date: comment.date,
            content: "**komentar telah dihapus**",
          };
        }
        return {
          id: comment.id,
          username,
          date: comment.date,
          content: comment.content,
        };
      }),
    );
  }
}

module.exports = GetThreadUseCase;
