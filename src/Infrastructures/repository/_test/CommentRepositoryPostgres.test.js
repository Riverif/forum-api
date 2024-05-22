const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const pool = require("../../database/postgres/pool");

const NewComment = require("../../../Domains/comments/entities/NewComment");
const AddedComment = require("../../../Domains/comments/entities/AddedComment");
const CommentRepositoryPostgres = require("../CommentRepositoryPostgres");

describe("CommentRepositoryPostgres", () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("addComment function", () => {
    it("should persist creaate new comment and return added comment correctly", async () => {
      //Arrange
      const newComment = new NewComment({
        content: "This is comment",
      });

      await UsersTableTestHelper.addUser({ username: "dicoding" });
      await ThreadsTableTestHelper.addThread({ id: "thread-123" });

      const fakeIdGenerator = () => 123;
      const thread = "thread-123";
      const owner = "user-123";

      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      //Action
      await commentRepositoryPostgres.addComment(newComment, thread, owner);

      //Assert
      const comments = await CommentsTableTestHelper.findCommentById(
        "comment-123",
      );
      expect(comments).toHaveLength(1);
    });

    it("should return added comment correctly", async () => {
      //Arrange
      const newComment = new NewComment({
        content: "This is comment",
      });

      await UsersTableTestHelper.addUser({ username: "dicoding" });
      await ThreadsTableTestHelper.addThread({ id: "thread-123" });

      const fakeIdGenerator = () => 123;
      const thread = "thread-123";
      const owner = "user-123";

      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      //Action
      const addedComment = await commentRepositoryPostgres.addComment(
        newComment,
        thread,
        owner,
      );

      //Assert
      expect(addedComment).toStrictEqual(
        new AddedComment({
          id: "comment-123",
          content: "This is comment",
          owner: "user-123",
        }),
      );
    });
  });
});
