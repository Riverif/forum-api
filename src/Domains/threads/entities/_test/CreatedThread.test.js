const CreatedThread = require("../CreatedThread");

describe("CreatedThread Entities", () => {
  it("should throw error when payload not contain needed property", () => {
    //Arrange
    const payload = {
      title: "BodyThread",
    };

    //Action & Assert
    expect(() => new CreatedThread(payload)).toThrowError(
      "CREATE_THREAD.NOT_CONTAIN_NEEDED_PROPERTY",
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    //Arrange
    const payload = {
      id: 123,
      title: {},
      owner: "BodyThread",
    };

    //Action & Assert
    expect(() => new CreatedThread(payload)).toThrowError(
      "CREATE_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION",
    );
  });

  it("should create createdThread object correctly", () => {
    //Arrange
    const payload = {
      id: "thread-123",
      title: "Sebuah judul",
      owner: "user-123",
    };

    //Action & Assert
    const { title, id, owner } = new CreatedThread(payload);

    //Assert
    expect(id).toEqual(payload.id);
    expect(title).toEqual(payload.title);
    expect(owner).toEqual(payload.owner);
  });
});
