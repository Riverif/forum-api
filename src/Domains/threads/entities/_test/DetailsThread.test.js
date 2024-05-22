const DetailsThread = require("../DetailsThread");

describe("DetailsThread Entities", () => {
  it("should throw error when payload not contain needed property", () => {
    //Arrange
    const payload = {
      title: "BodyThread",
    };

    //Action & Assert
    expect(() => new DetailsThread(payload)).toThrowError(
      "DETAILS_THREAD.NOT_CONTAIN_NEEDED_PROPERTY",
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    //Arrange
    const payload = {
      id: 123,
      title: {},
      body: "BodyThread",
      date: "ds",
      username: 123,
      comments: [123, 123],
    };

    //Action & Assert
    expect(() => new DetailsThread(payload)).toThrowError(
      "DETAILS_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION",
    );
  });

  it("should create createdThread object correctly", () => {
    //Arrange
    const payload = {
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
    };

    //Action & Assert
    const { id, title, body, date, username, comments } = new DetailsThread(
      payload,
    );

    //Assert
    expect(id).toEqual(payload.id);
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(date).toEqual(payload.date);
    expect(username).toEqual(payload.username);
    expect(comments).toEqual(payload.comments);
  });
});
