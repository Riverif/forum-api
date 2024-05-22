const NewComment = require("../NewComment");

describe("NewComment entities", () => {
  it("should throw error when payload not contain needed property", () => {
    //Arrange
    const payload = {
      notcontent: "",
    };

    //Action Assert
    expect(() => new NewComment(payload)).toThrowError(
      "NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY",
    );
  });
  it("should throw error when payload did not meet data type specification", () => {
    //Arrange
    const payload = {
      content: {},
    };

    //Action Assert
    expect(() => new NewComment(payload)).toThrowError(
      "NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION",
    );
  });
  it("should create thread object correctly", () => {
    //Arrange
    const payload = {
      content: "this is comment",
    };

    //Action
    const { content } = new NewComment(payload);

    expect(content).toEqual(payload.content);
  });
});
