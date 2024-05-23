class DetailsComments {
  constructor(payload) {
    this._verifyPayload(payload);

    this.comments = payload;
  }

  _verifyPayload(comments) {
    const containNeededPropertyCheck = comments.every(
      (comment) =>
        typeof comment === "object" &&
        comment.hasOwnProperty("id") &&
        comment.hasOwnProperty("thread") &&
        comment.hasOwnProperty("owner") &&
        comment.hasOwnProperty("date") &&
        comment.hasOwnProperty("content") &&
        comment.hasOwnProperty("isDelete"),
    );
    if (!containNeededPropertyCheck) {
      throw new Error("DETAILS_COMMENTS.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    const someDataTypeWrong = comments.every(
      (comment) =>
        typeof comment !== "object" ||
        typeof comment.id !== "string" ||
        typeof comment.thread !== "string" ||
        typeof comment.owner !== "string" ||
        typeof comment.date !== "string" ||
        typeof comment.content !== "string" ||
        typeof comment.isDelete !== "boolean",
    );

    if (someDataTypeWrong) {
      throw new Error("DETAILS_COMMENTS.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}

module.exports = DetailsComments;
