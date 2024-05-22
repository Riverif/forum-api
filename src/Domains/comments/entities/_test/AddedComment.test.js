const AddedComment = require("../AddedComment");

describe("AddedComment entities", () => {
  it("should throw error when payload not contain needed property", () => {
    //Arrange
    const payload = {
      notcontent: "",
    };

    //Action Assert
    expect(() => new AddedComment(payload)).toThrowError(
      "NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY",
    );
  });
  it("should throw error when payload did not meet data type specification", () => {
    //Arrange
    const payload = {
      id: "test",
      content: {},
      owner: 123,
    };

    //Action Assert
    expect(() => new AddedComment(payload)).toThrowError(
      "NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION",
    );
  });
  it("should create thread object correctly", () => {
    //Arrange
    const payload = {
      id: "comment-123",
      content: "this is commment",
      owner: "user-123",
    };

    //Action
    const { id, content, owner } = new AddedComment(payload);

    expect(id).toEqual(payload.id);
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
  });
});
