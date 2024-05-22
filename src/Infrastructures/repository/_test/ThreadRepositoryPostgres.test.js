const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const pool = require("../../database/postgres/pool");

const CreateThread = require("../../../Domains/threads/entities/CreateThread");
const CreatedThread = require("../../../Domains/threads/entities/CreatedThread");
const DetailsThread = require("../../../Domains/threads/entities/DetailsThread");
const ThreadRepositoryPostgres = require("../ThreadRepositoryPostgres");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");

describe("ThreadRepositoryPostgres", () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("addThread function", () => {
    it("should persist create thread and return created thread correctly", async () => {
      //Arrange
      const createThread = new CreateThread({
        title: "Ini judul thread",
        body: "Ini body thread",
      });

      await UsersTableTestHelper.addUser({ username: "dicoding" });

      const fakeIdGenerator = () => "123";
      const owner = "user-123";

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      //Action
      await threadRepositoryPostgres.addThread(createThread, owner);

      //Assert
      const threads = await ThreadsTableTestHelper.findThreadById("thread-123");
      expect(threads).toHaveLength(1);
    });

    it("should return created thread correctly", async () => {
      //Arrange
      const createThread = new CreateThread({
        title: "Ini judul thread",
        body: "Ini body thread",
      });

      await UsersTableTestHelper.addUser({ username: "dicoding" });

      const fakeIdGenerator = () => "123";
      const owner = "user-123";

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      //Action
      const createdThread = await threadRepositoryPostgres.addThread(
        createThread,
        owner,
      );

      //Assert
      expect(createdThread).toStrictEqual(
        new CreatedThread({
          id: "thread-123",
          title: "Ini judul thread",
          owner: "user-123",
        }),
      );
    });
  });

  describe("checkAvailabilityThread function", () => {
    it("should throw NotFoundError if thread not available", async () => {
      // Arrange
      const threadRepository = new ThreadRepositoryPostgres(pool);
      // Action & Assert
      await expect(
        threadRepository.checkAvailabilityThread("xxx"),
      ).rejects.toThrow(NotFoundError);
    });

    it("should not throw NotFoundError if Thread available", async () => {
      // Arrange
      const createThread = new CreateThread({
        title: "Ini judul thread",
        body: "Ini body thread",
      });

      await UsersTableTestHelper.addUser({ username: "dicoding" });

      const fakeIdGenerator = () => "123";
      const owner = "user-123";

      const threadRepository = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      const createdThread = await threadRepository.addThread(
        createThread,
        owner,
      );

      // Action & Assert
      await expect(
        threadRepository.checkAvailabilityThread(createdThread.id),
      ).resolves.not.toThrow(NotFoundError);
    });
  });

  describe("getThreadById function", () => {
    it("should return details thread correctly", async () => {
      //Arrange
      /** add new user */
      await UsersTableTestHelper.addUser({ username: "dicoding" });
      await UsersTableTestHelper.addUser({ id: "user-124", username: "john" });
      /** add new thread */
      await ThreadsTableTestHelper.addThread({ id: "thread-123" });
      /** add new comment */
      await CommentsTableTestHelper.addComment({
        id: "comment-123",
        content: "komentar 1",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-124",
        owner: "user-124",
        content: "komentar 2",
      });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool);

      //Action
      const thread = await threadRepositoryPostgres.getThreadById("thread-123");

      //Assert
      expect(thread).toStrictEqual(
        new DetailsThread({
          id: "thread-123",
          title: "Ini judul thread",
          body: "Ini body thread",
          date: "2024-05-21T12:25:49.169Z",
          username: "dicoding",
          comments: [
            {
              id: "comment-123",
              username: "dicoding",
              date: "2024-05-21T12:25:49.169Z",
              content: "komentar 1",
            },
            {
              id: "comment-124",
              username: "john",
              date: "2024-05-21T12:25:49.169Z",
              content: "komentar 2",
            },
          ],
        }),
      );
    });
  });
});
