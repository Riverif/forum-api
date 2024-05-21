class CreatedThread {
  constructor(payload) {
    this._verifyPayload(payload);

    this.id = payload.id;
    this.title = payload.title;
    this.owner = payload.owner;
  }

  _verifyPayload({ id, title, owner }) {
    if (!title || !id || !owner) {
      throw new Error("CREATE_THREAD.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (
      typeof title !== "string" ||
      typeof id !== "string" ||
      typeof owner !== "string"
    ) {
      throw new Error("CREATE_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}

module.exports = CreatedThread;
