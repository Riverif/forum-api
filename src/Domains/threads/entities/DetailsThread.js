class DetailsThread {
  constructor(payload) {
    this._verifyPayload(payload);

    this.id = payload.id;
    this.owner = payload.owner;
    this.title = payload.title;
    this.body = payload.body;
    this.date = payload.date;
  }

  _verifyPayload({ id, owner, title, body, date }) {
    if (!title || !id || !body || !date || !owner) {
      throw new Error("DETAILS_THREAD.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (
      typeof id !== "string" ||
      typeof owner !== "string" ||
      typeof title !== "string" ||
      typeof body !== "string" ||
      typeof date !== "string"
    ) {
      throw new Error("DETAILS_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}

module.exports = DetailsThread;
