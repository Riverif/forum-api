const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const CreatedThread = require("../../Domains/threads/entities/CreatedThread");
const DetailsThread = require("../../Domains/threads/entities/DetailsThread");
const ThreadRepository = require("../../Domains/threads/ThreadRepository");

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(createThread, ownerId) {
    const { title, body } = createThread;
    const id = `thread-${this._idGenerator()}`;
    const date = new Date();
    const dateStr = date.toISOString();

    const query = {
      text: "INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id, title, owner",
      values: [id, ownerId, title, body, dateStr],
    };

    const result = await this._pool.query(query);

    return new CreatedThread({ ...result.rows[0] });
  }

  async checkAvailabilityThread(threadId) {
    const query = {
      text: "SELECT * FROM threads WHERE id = $1",
      values: [threadId],
    };

    const result = await this._pool.query(query);
    if (result.rows.length === 0) {
      throw new NotFoundError("thread tidak ditemukan");
    }
  }

  async getThreadById(threadId) {
    const query = {
      text: `
      SELECT t.id, t.title, t.body, t.date, u.username,
          array_to_json(array_agg(json_build_object(
            'id', c.id,
            'username', uc.username,
            'date', c.date,
            'content', c.content,
            'isDelete', c.is_delete
          ))) AS comments
      FROM threads t
      LEFT JOIN users u ON u.id = t.owner
      LEFT JOIN comments c ON c.thread = t.id
      LEFT JOIN users uc ON uc.id = c.owner
      WHERE t.id = $1
      GROUP BY t.id, u.id
      `,
      values: [threadId],
    };

    const result = await this._pool.query(query);

    return new DetailsThread(result.rows[0]);
  }
}

module.exports = ThreadRepositoryPostgres;
