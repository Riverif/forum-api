const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const AuthorizationError = require("../../Commons/exceptions/AuthorizationError");

const AddedComment = require("../../Domains/comments/entities/AddedComment");
const DetailsComments = require("../../Domains/comments/entities/DetailsComments");
const CommentRepository = require("../../Domains/comments/CommentRepository");

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();

    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(newComment, threadId, ownerId) {
    const { content } = newComment;
    const id = `comment-${this._idGenerator()}`;
    const date = new Date();
    const dateStr = date.toISOString();

    const query = {
      text: "INSERT INTO comments VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner",
      values: [id, threadId, ownerId, content, dateStr],
    };

    const result = await this._pool.query(query);

    return new AddedComment({ ...result.rows[0] });
  }

  async checkCommentById(commentId, ownerId) {
    const query = {
      text: "SELECT * FROM comments WHERE id = $1",
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (result.rows.length === 0) {
      throw new NotFoundError("comment tidak ditemukan");
    }
  }

  async checkCommentOwnership(commentId, ownerId) {
    const query = {
      text: "SELECT * FROM comments WHERE id = $1",
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (result.rows[0].owner !== ownerId) {
      throw new AuthorizationError("anda bukan pemilik comment");
    }
  }

  async deleteComment(commentId) {
    const query = {
      text: "UPDATE comments SET is_delete = true WHERE id = $1",
      values: [commentId],
    };
    await this._pool.query(query);
  }

  async getCommentsByThreadId(threadId) {
    const query = {
      text: `SELECT array_agg(json_build_object(
            'id', id,
            'thread', thread,
            'owner', owner,
            'content', content,
            'date', date,
            'isDelete', is_delete
          )) AS comments FROM comments WHERE thread = $1`,
      values: [threadId],
    };

    const result = await this._pool.query(query);

    return new DetailsComments(result.rows[0].comments);
  }
}

module.exports = CommentRepositoryPostgres;
