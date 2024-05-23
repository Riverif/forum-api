class CreatedThread {
  constructor(payload) {
    this._verifyPayload(payload);
    const checkedComments = this._commentsDeleteCheck(payload.comments);

    this.id = payload.id;
    this.title = payload.title;
    this.body = payload.body;
    this.date = payload.date;
    this.username = payload.username;
    this.comments = checkedComments;
  }

  _verifyPayload({ id, title, body, date, username, comments }) {
    if (!title || !id || !body || !date || !username || !comments) {
      throw new Error("DETAILS_THREAD.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    const commentCheck = comments.every(
      (comment) =>
        typeof comment === "object" &&
        comment.hasOwnProperty("id") &&
        comment.hasOwnProperty("username") &&
        comment.hasOwnProperty("date") &&
        comment.hasOwnProperty("content") &&
        comment.hasOwnProperty("isDelete"),
    );

    if (
      typeof title !== "string" ||
      typeof id !== "string" ||
      typeof body !== "string" ||
      typeof date !== "string" ||
      typeof username !== "string" ||
      !commentCheck
    ) {
      throw new Error("DETAILS_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }

  _commentsDeleteCheck(comments) {
    return comments.map((comment) => {
      if (comment.isDelete === true) {
        return {
          id: comment.id,
          username: comment.username,
          date: comment.date,
          content: "**komentar telah dihapus**",
        };
      }
      return {
        id: comment.id,
        username: comment.username,
        date: comment.date,
        content: comment.content,
      };
    });
  }
}

module.exports = CreatedThread;
