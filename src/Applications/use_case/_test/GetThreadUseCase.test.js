const DetailsThread = require("../../../Domains/threads/entities/DetailsThread");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const GetThreadUseCase = require("../GetThreadUseCase");

describe("GetThreadUseCase", () => {
  it("should orchestrating the add user action correctly", async () => {
    //Arrange
    const mockDetailsThread = new DetailsThread({
      id: "thread-123",
      title: "This is title",
      body: "This is body",
      date: "date",
      username: "dicoding",
      comments: [
        {
          id: "comment-123",
          username: "john",
          date: "2021-08-08T07:22:33.555Z",
          content: "sebuah comment",
        },
        {
          id: "comment-yksuCoxM2s4MMrZJO-qVD",
          username: "dicoding",
          date: "2021-08-08T07:26:21.338Z",
          content: "**komentar telah dihapus**",
        },
      ],
    });
    const useCaseThreadId = "thread-123";

    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.checkAvailabilityThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.getThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockDetailsThread));

    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    //Action
    const thread = await getThreadUseCase.execute(useCaseThreadId);

    //Assert
    expect(thread).toStrictEqual(
      new DetailsThread({
        id: "thread-123",
        title: "This is title",
        body: "This is body",
        date: "date",
        username: "dicoding",
        comments: [
          {
            id: "comment-123",
            username: "john",
            date: "2021-08-08T07:22:33.555Z",
            content: "sebuah comment",
          },
          {
            id: "comment-yksuCoxM2s4MMrZJO-qVD",
            username: "dicoding",
            date: "2021-08-08T07:26:21.338Z",
            content: "**komentar telah dihapus**",
          },
        ],
      }),
    );

    expect(mockThreadRepository.getThreadById).toBeCalledWith(useCaseThreadId);
  });
});
