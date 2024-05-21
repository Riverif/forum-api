const CreateThread = require("../../../Domains/threads/entities/CreateThread");
const CreatedThread = require("../../../Domains/threads/entities/CreatedThread");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const AddThreadUseCase = require("../AddThreadUseCase");

describe("AddUserUseCase", () => {
  it("should orchestrating the add user action correctly", async () => {
    //Arrange
    const useCasePayload = {
      title: "Ini judul thread",
      body: "Ini isi body",
    };

    const mockCreatedThread = new CreatedThread({
      id: "thread-123",
      title: useCasePayload.title,
      owner: "owner-123",
    });

    /** creating dependency of use case*/
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.addThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockCreatedThread));

    /** creating use case instance*/
    const getThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    //Action
    const createdThread = await getThreadUseCase.execute(useCasePayload);

    //Assert
    expect(createdThread).toStrictEqual(
      new CreatedThread({
        id: "thread-123",
        title: useCasePayload.title,
        owner: "owner-123",
      }),
    );

    expect(mockThreadRepository.addThread).toBeCalledWith(
      new CreateThread({
        title: useCasePayload.title,
        body: useCasePayload.body,
      }),
    );
  });
});
