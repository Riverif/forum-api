const RegisteredUser = require("../../../Domains/users/entities/RegisteredUser");
const DetailsThread = require("../../../Domains/threads/entities/DetailsThread");
const DetailsComments = require("../../../Domains/comments/entities/DetailsComments");

const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const UserRepository = require("../../../Domains/users/UserRepository");

const GetThreadUseCase = require("../GetThreadUseCase");

describe("GetThreadUseCase", () => {
  it("should orchestrating the add user action correctly", async () => {
    //Arrange
    const mockUser = new RegisteredUser({
      id: "user-123",
      username: "john",
      fullname: "dsd full",
    });
    const mockDetailsThread = new DetailsThread({
      id: "thread-123",
      owner: "user-123",
      title: "This is title",
      body: "This is body",
      date: "date",
    });
    const mockDetailsComments = new DetailsComments([
      {
        id: "comment-123",
        thread: "thread-123",
        owner: "user-123",
        date: "2021-08-08T07:22:33.555Z",
        content: "sebuah comment",
        isDelete: false,
      },
      {
        id: "comment-yksuCoxM2s4MMrZJO",
        thread: "thread-123",
        owner: "user-123",
        date: "2021-08-08T07:22:33.555Z",
        content: "sebuah komentar",
        isDelete: true,
      },
    ]);

    const useCaseThreadId = "thread-123";

    /** mock repository */
    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.checkAvailabilityThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.getThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockDetailsThread));

    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.getCommentsByThreadId = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockDetailsComments));

    const mockUserRepository = new UserRepository();
    mockUserRepository.getRegisteredUserById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockUser));

    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      userRepository: mockUserRepository,
    });

    //Action
    const thread = await getThreadUseCase.execute(useCaseThreadId);

    //Assert
    expect(mockThreadRepository.getThreadById).toBeCalledWith(useCaseThreadId);
    expect(mockThreadRepository.checkAvailabilityThread).toBeCalledWith(
      useCaseThreadId,
    );
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(
      mockDetailsThread.id,
    );
    expect(mockUserRepository.getRegisteredUserById).toHaveBeenCalledTimes(3);

    expect(thread).toEqual({
      id: "thread-123",
      title: "This is title",
      body: "This is body",
      date: "date",
      username: "john",
      comments: [
        {
          id: "comment-123",
          username: "john",
          date: "2021-08-08T07:22:33.555Z",
          content: "sebuah comment",
        },
        {
          id: "comment-yksuCoxM2s4MMrZJO",
          username: "john",
          date: "2021-08-08T07:22:33.555Z",
          content: "**komentar telah dihapus**",
        },
      ],
    });
  });
});
