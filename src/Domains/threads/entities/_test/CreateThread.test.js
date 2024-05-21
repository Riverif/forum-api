const CreateThread = require("../CreateThread");

describe("CreateThread Entities", () => {
  it("should throw error when payload not contain needed property", () => {
    //Arrange
    const payload = {
      body: "BodyThread",
    };

    //Action & Assert
    expect(() => new CreateThread(payload)).toThrowError(
      "CREATE_THREAD.NOT_CONTAIN_NEEDED_PROPERTY",
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    //Arrange
    const payload = {
      title: 123,
      body: "BodyThread",
    };

    //Action & Assert
    expect(() => new CreateThread(payload)).toThrowError(
      "CREATE_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION",
    );
  });

  it("should create thread object correctly", () => {
    //Arrange
    const payload = {
      title: "Sebuah judul",
      body: "Sebuah body judul",
    };

    //Action & Assert
    const { title, body } = new CreateThread(payload);

    //Assert
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
  });
});
