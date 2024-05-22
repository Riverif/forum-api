const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const pool = require("../../database/postgres/pool");

const CreateThread = require("../../../Domains/threads/entities/CreateThread");
const CreatedThread = require("../../../Domains/threads/entities/CreatedThread");
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
});
