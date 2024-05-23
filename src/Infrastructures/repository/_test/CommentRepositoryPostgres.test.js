const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const pool = require("../../database/postgres/pool");

const NewComment = require("../../../Domains/comments/entities/NewComment");
const AddedComment = require("../../../Domains/comments/entities/AddedComment");
const CommentRepositoryPostgres = require("../CommentRepositoryPostgres");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const AuthorizationError = require("../../../Commons/exceptions/AuthorizationError");

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

  describe("checkCommentById function", () => {
    it("should throw NotFoundError if comment not available", async () => {
      //Arrange
      const commentRepository = new CommentRepositoryPostgres(pool);

      //Action & Assert
      await expect(
        commentRepository.checkCommentById("user-123", "xxx"),
      ).rejects.toThrow(NotFoundError);
    });

    it("should not throw NotFoundError if comment available", async () => {
      //Arrange
      const newComment = new NewComment({
        content: "This is comment",
      });

      await UsersTableTestHelper.addUser({ username: "dicoding" });
      await ThreadsTableTestHelper.addThread({ id: "thread-123" });

      const fakeIdGenerator = () => 123;
      const thread = "thread-123";
      const owner = "user-123";

      const commentRepository = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );
      const addedComment = await commentRepository.addComment(
        newComment,
        thread,
        owner,
      );

      //Action & Assert
      await expect(
        commentRepository.checkCommentById(addedComment.id, addedComment.owner),
      ).resolves.not.toThrow(NotFoundError);
    });
  });

  describe("checkCommentOwnership function", () => {
    it("should throw AuthorizationError if not the owner of comment", async () => {
      //Arrange
      const newComment = new NewComment({
        content: "This is comment",
      });

      await UsersTableTestHelper.addUser({ username: "dicoding" });
      await ThreadsTableTestHelper.addThread({ id: "thread-123" });

      const fakeIdGenerator = () => 123;
      const thread = "thread-123";
      const owner = "user-123";

      const commentRepository = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );
      const addedComment = await commentRepository.addComment(
        newComment,
        thread,
        owner,
      );

      //Action & Assert
      await expect(
        commentRepository.checkCommentOwnership(addedComment.id, "xxx"),
      ).rejects.toThrow(AuthorizationError);
    });
  });

  describe("deleteComment function", () => {
    it("should throw AuthorizationError if not the owner of comment", async () => {
      //Arrange
      const newComment = new NewComment({
        content: "This is comment",
      });

      await UsersTableTestHelper.addUser({ username: "dicoding" });
      await ThreadsTableTestHelper.addThread({ id: "thread-123" });

      const fakeIdGenerator = () => 123;
      const thread = "thread-123";
      const owner = "user-123";

      const commentRepository = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );
      const addedComment = await commentRepository.addComment(
        newComment,
        thread,
        owner,
      );

      //Action
      await commentRepository.deleteComment(addedComment.id);

      //Assert
      const comment = await CommentsTableTestHelper.findCommentById(
        addedComment.id,
      );

      expect(comment[0].is_delete).toEqual(true);
    });
  });
});
