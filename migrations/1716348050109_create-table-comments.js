/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("comments", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    thread: {
      type: "VARCHAR(50)",
      notNull: true,
    },
    owner: {
      type: "VARCHAR(50)",
      notNull: true,
    },
    content: {
      type: "TEXT",
      notNull: true,
    },
    date: {
      type: "TEXT",
      notNull: true,
    },
    is_delete: {
      type: "BOOLEAN",
      notNull: true,
      default: false,
    },
  });

  //Memberikan constrain FK pada owner
  pgm.addConstraint(
    "comments",
    "fk_comments.owner_users.id",
    "FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE",
  );
  //Memberikan constrain FK pada thread
  pgm.addConstraint(
    "comments",
    "fk_comments.thread_threads.id",
    "FOREIGN KEY(thread) REFERENCES threads(id) ON DELETE CASCADE",
  );
};

exports.down = (pgm) => {
  pgm.dropTable("comments");
};
