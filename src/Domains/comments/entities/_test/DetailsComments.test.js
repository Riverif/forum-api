const DetailsComment = require("../DetailsComments");

describe("DetailsComment Entities", () => {
  it("should throw error when payload not contain needed property", () => {
    //Arrange
    const payload = [
      {
        thread: "thread-123",
      },
    ];

    //Action & Assert
    expect(() => new DetailsComment(payload)).toThrowError(
      "DETAILS_COMMENTS.NOT_CONTAIN_NEEDED_PROPERTY",
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    //Arrange
    const payload = [
      {
        id: 123,
        thread: "thread-123",
        owner: "john",
        content: "sebuah comment",
        date: "2021-08-08T07:22:33.555Z",
        isDelete: false,
      },
    ];

    //Action & Assert
    expect(() => new DetailsComment(payload)).toThrowError(
      "DETAILS_COMMENTS.NOT_MEET_DATA_TYPE_SPECIFICATION",
    );
  });

  it("should create createdThread object correctly", () => {
    //Arrange
    const payload = [
      {
        id: "comment-123",
        thread: "thread-123",
        owner: "john",
        date: "2021-08-08T07:22:33.555Z",
        content: "sebuah comment",
        isDelete: false,
      },
      {
        id: "comment-124",
        thread: "thread-123",
        owner: "john",
        date: "2021-08-08T07:22:33.555Z",
        content: "sebuah comment",
        isDelete: false,
      },
    ];

    //Action & Assert
    const { comments } = new DetailsComment(payload);

    //Assert
    expect(comments).toEqual(payload);
  });
});
