const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const AuthenticationsTableTestHelper = require("../../../../tests/AuthenticationsTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");

const pool = require("../../database/postgres/pool");
const container = require("../../container");
const createServer = require("../createServer");

describe("/threads endpoint", () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  describe("when POST /threads/{threadId}/comments", () => {
    it("should response 201 and persisted comment", async () => {
      //Arrange
      const server = await createServer(container);
      const requestPayload = {
        content: "This is comment",
      };

      // Add user account
      await server.inject({
        method: "POST",
        url: "/users",
        payload: {
          username: "dicoding",
          password: "secret",
          fullname: "Dicoding Indonesia",
        },
      });

      // login
      const auth = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: {
          username: "dicoding",
          password: "secret",
        },
      });

      const {
        data: { accessToken },
      } = JSON.parse(auth.payload);

      const thread = await server.inject({
        method: "POST",
        url: "/threads",
        payload: {
          title: "First Thread",
          body: "This is first thread",
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const {
        data: { addedThread },
      } = JSON.parse(thread.payload);

      //Action
      const response = await server.inject({
        method: "POST",
        url: `/threads/${addedThread.id}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      //Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data.addedComment).toBeDefined();
    });

    it("should response 401 when user not login", async () => {
      //Arrange
      const server = await createServer(container);
      const requestPayload = {
        content: "This is comment",
      };

      // Add user account
      await server.inject({
        method: "POST",
        url: "/users",
        payload: {
          username: "dicoding",
          password: "secret",
          fullname: "Dicoding Indonesia",
        },
      });

      // login
      const auth = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: {
          username: "dicoding",
          password: "secret",
        },
      });

      const {
        data: { accessToken, refreshToken },
      } = JSON.parse(auth.payload);

      const thread = await server.inject({
        method: "POST",
        url: "/threads",
        payload: {
          title: "First Thread",
          body: "This is first thread",
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const {
        data: { addedThread },
      } = JSON.parse(thread.payload);

      //Logout
      await server.inject({
        method: "DELETE",
        url: "/authentications",
        payload: {
          refreshToken,
        },
      });

      //Action
      const response = await server.inject({
        method: "POST",
        url: `/threads/${addedThread.id}/comments`,
        payload: requestPayload,
      });

      //Assert
      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(401);
      expect(responseJson.message).toEqual("Missing authentication");
    });

    it("should response 400 when request payload not contain needed property", async () => {
      //Arrange
      const server = await createServer(container);
      const requestPayload = {
        notcontent: "This is comment",
      };

      // Add user account
      await server.inject({
        method: "POST",
        url: "/users",
        payload: {
          username: "dicoding",
          password: "secret",
          fullname: "Dicoding Indonesia",
        },
      });

      // login
      const auth = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: {
          username: "dicoding",
          password: "secret",
        },
      });

      const {
        data: { accessToken },
      } = JSON.parse(auth.payload);

      const thread = await server.inject({
        method: "POST",
        url: "/threads",
        payload: {
          title: "First Thread",
          body: "This is first thread",
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const {
        data: { addedThread },
      } = JSON.parse(thread.payload);

      //Action
      const response = await server.inject({
        method: "POST",
        url: `/threads/${addedThread.id}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      //Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual(
        "tidak dapat membuat comment baru karena properti yang dibutuhkan tidak ada",
      );
    });

    it("should response 400 when request payload not meet data specification", async () => {
      //Arrange
      const server = await createServer(container);
      const requestPayload = {
        content: 123,
      };

      // Add user account
      await server.inject({
        method: "POST",
        url: "/users",
        payload: {
          username: "dicoding",
          password: "secret",
          fullname: "Dicoding Indonesia",
        },
      });

      // login
      const auth = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: {
          username: "dicoding",
          password: "secret",
        },
      });

      const {
        data: { accessToken },
      } = JSON.parse(auth.payload);

      const thread = await server.inject({
        method: "POST",
        url: "/threads",
        payload: {
          title: "First Thread",
          body: "This is first thread",
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const {
        data: { addedThread },
      } = JSON.parse(thread.payload);

      //Action
      const response = await server.inject({
        method: "POST",
        url: `/threads/${addedThread.id}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      //Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual(
        "tidak dapat membuat comment baru karena tipe data tidak sesuai",
      );
    });

    it("should response 404 when comment not found", async () => {
      //Arrange
      const server = await createServer(container);
      const requestPayload = {
        content: "This is comment",
      };

      // Add user account
      await server.inject({
        method: "POST",
        url: "/users",
        payload: {
          username: "dicoding",
          password: "secret",
          fullname: "Dicoding Indonesia",
        },
      });

      // login
      const auth = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: {
          username: "dicoding",
          password: "secret",
        },
      });

      const {
        data: { accessToken },
      } = JSON.parse(auth.payload);

      //Action
      const response = await server.inject({
        method: "POST",
        url: `/threads/xxx/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      //Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual("thread tidak ditemukan");
    });
  });

  describe("when POST /threads/{threadId}/comments/{commentId}", () => {
    it("should response 200", async () => {
      //Arrange
      const server = await createServer(container);

      // Add user account
      await server.inject({
        method: "POST",
        url: "/users",
        payload: {
          username: "dicoding",
          password: "secret",
          fullname: "Dicoding Indonesia",
        },
      });

      // login
      const auth = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: {
          username: "dicoding",
          password: "secret",
        },
      });

      const {
        data: { accessToken },
      } = JSON.parse(auth.payload);

      const thread = await server.inject({
        method: "POST",
        url: "/threads",
        payload: {
          title: "First Thread",
          body: "This is first thread",
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const {
        data: { addedThread },
      } = JSON.parse(thread.payload);

      const comment = await server.inject({
        method: "POST",
        url: `/threads/${addedThread.id}/comments`,
        payload: { content: "This is comment" },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const {
        data: { addedComment },
      } = JSON.parse(comment.payload);

      //Action
      const response = await server.inject({
        method: "DELETE",
        url: `/threads/${addedThread.id}/comments/${addedComment.id}`,
        payload: { content: "This is comment" },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      //Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
    });

    it("should response 404 when comment not found", async () => {
      //Arrange
      const server = await createServer(container);

      // Add user account
      await server.inject({
        method: "POST",
        url: "/users",
        payload: {
          username: "dicoding",
          password: "secret",
          fullname: "Dicoding Indonesia",
        },
      });

      // login
      const auth = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: {
          username: "dicoding",
          password: "secret",
        },
      });

      const {
        data: { accessToken },
      } = JSON.parse(auth.payload);

      const thread = await server.inject({
        method: "POST",
        url: "/threads",
        payload: {
          title: "First Thread",
          body: "This is first thread",
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const {
        data: { addedThread },
      } = JSON.parse(thread.payload);

      const comment = await server.inject({
        method: "POST",
        url: `/threads/${addedThread.id}/comments`,
        payload: { content: "This is comment" },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const {
        data: { addedComment },
      } = JSON.parse(comment.payload);

      //Action
      const response = await server.inject({
        method: "DELETE",
        url: `/threads/${addedThread.id}/comments/xxx`,
        payload: { content: "This is comment" },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      //Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual("comment tidak ditemukan");
    });
  });
});
