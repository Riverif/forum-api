/* istanbul ignore file */
const pool = require("../src/Infrastructures/database/postgres/pool");

const CommentsTableTestHelper = {
  async addComment({
    id = "comment-123",
    thread = "thread-123",
    owner = "user-123",
    content = "This is comment",
    date = "2024-05-21T12:25:49.169Z",
  }) {
    const query = {
      text: "INSERT INTO comments VALUES($1, $2, $3, $4, $5)",
      values: [id, thread, owner, content, date],
    };

    await pool.query(query);
  },

  async findCommentById(id) {
    const query = {
      text: "SELECT * FROM comments WHERE id = $1",
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query("DELETE FROM comments WHERE 1=1");
  },
};

module.exports = CommentsTableTestHelper;
