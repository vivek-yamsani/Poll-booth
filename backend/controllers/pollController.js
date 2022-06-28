const prisma = require("../config/prisma");
const {
  isTeamAdmin,
  isTeamMember,
} = require("../middlewares/checkAccessLevel");

const createPoll = async (req, res) => {
  try {
    const { userId } = req;
    const { title, description, expiresAt } = req.body;
    const teamId = parseInt(req.params["teamId"]);
    if (!userId || !title || !description || !expiresAt) {
      return res.status(402).json({
        message: "Invalid Request",
      });
    }
    const createdPoll = await prisma.polls.create({
      data: {
        authorId: userId,
        title,
        description,
        teamId: Number(teamId),
        expiresAt: new Date(expiresAt),
      },
    });
    res.json({
      message: "Successfully created the poll",
      poll: createdPoll,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

const EditPoll = async (req, res) => {
  try {
    const { userId } = req;
    const { title, description, expiresAt } = req.body;
    req.body.authorId = userId;
    const pollId = parseInt(req.params["pollId"]);
    if (!title || !description || !expiresAt) {
      return res.status(402).json({
        message: "Invalid Request",
      });
    }
    const EditedPoll = await prisma.polls.update({
      where: {
        id: pollId,
      },
      data: req.body,
    });
    if (!EditedPoll)
      return res.status(400).json({
        message: "Invalid Request",
      });

    res.json({
      message: "Successfully Edited the poll",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

const addOptionsToPoll = async (req, res) => {
  try {
    const { content } = req.body;
    const { userId } = req;
    let pollId = parseInt(req.params["pollId"]);
    // console.log(pollId, content);
    if (!pollId || !content) {
      return res.status(402).json({
        message: "Invalid Request",
      });
    }
    const isAlreadyPresent = await prisma.options.findUnique({
      where: {
        content_pollId: { content, pollId },
      },
    });
    if (isAlreadyPresent) {
      return res.status(402).json({
        message: "Option is already present",
      });
    }
    await prisma.options.create({
      data: {
        content,
        pollId,
      },
    });
    await prisma.polls.update({
      where: {
        id: pollId,
      },
      data: {
        authorId: userId,
      },
    });
    res.json({
      message: "Successfully added the option",
    });
  } catch (err) {
    console.log(err.message);
    res.json({
      message: "Server Error" + err.message,
    });
  }
};

const isVoted = async (req, res) => {
  try {
    const teamId = req.params["teamId"];
    const pollId = req.params["pollId"];
    const { userId } = req;
    if (!pollId || !teamId) {
      return res.status(400).json({
        message: "Invalid Request",
      });
    }
    const voted = await prisma.polls.findMany({
      where: {
        id: parseInt(pollId),
        votedUsers: {
          some: {
            id: userId,
          },
        },
      },
    });

    if (voted.length == 0) {
      return res.json(false);
    }
    res.json(true);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

const getOptionsOfthePoll = async (req, res) => {
  try {
    const pollId = parseInt(req.params["pollId"]);
    const teamId = parseInt(req.params["teamId"]);
    const { userId } = req;
    console.log(pollId, teamId);
    if (!pollId || !pollId) {
      return res.status(400).json({
        message: "Invalid Request",
      });
    }

    const poll = await prisma.polls.findUnique({
      where: {
        id: pollId,
      },
      include: {
        team: {
          select: {
            name: true,
          },
        },
        author: {
          select: {
            name: true,
          },
        },
      },
    });
    const options = await prisma.options.findMany({
      where: {
        pollId: parseInt(pollId),
      },
      select: {
        content: true,
      },
    });
    console.log({
      poll,
      options,
    });
    res.json({
      poll,
      options,
    });
  } catch (err) {
    console.log(err.message);
    res.json({
      message: "Server Error" + err.message,
    });
  }
};

const deleteOptions = async (req, res) => {
  try {
    let pollId = req.params["pollId"];
    pollId = parseInt(pollId);
    const { content } = req.body;
    if (!pollId || !content) {
      return res.status(403).json({
        message: "Invalid Request",
      });
    }
    pollId = parseInt(pollId);
    const option = await prisma.options.findUnique({
      where: {
        content_pollId: { content, pollId },
      },
    });
    if (!option) {
      return res.status(403).json({
        message: "Invalid content",
      });
    }
    await prisma.options.delete({
      where: {
        content_pollId: { content, pollId },
      },
    });

    await prisma.polls.update({
      where: {
        id: pollId,
      },
      data: {
        authorId: req.userId,
      },
    });
    res.json({
      message: `Successfully deleted the ${content}`,
    });
  } catch (err) {
    console.log(err.message);
    res.json({
      message: "Server Error" + err.message,
    });
  }
};

const vote = async (req, res) => {
  try {
    let pollId = req.params["pollId"];
    const { userId } = req;
    const { content } = req.body;
    if (!pollId || !content) {
      return res.status(402).json({
        message: "Invalid Request",
      });
    }
    pollId = parseInt(pollId);
    const userVoted = await prisma.polls.findMany({
      where: {
        id: pollId,
        votedUsers: {
          some: {
            id: userId,
          },
        },
      },
      select: {
        id: true,
      },
    });
    if (userVoted.length) {
      return res.status(402).json({
        message: "user already voted",
      });
    }
    const count = await prisma.options.update({
      where: {
        content_pollId: { content, pollId },
      },
      data: {
        count: {
          increment: 1,
        },
      },
    });
    await prisma.polls.update({
      where: {
        id: pollId,
      },
      data: {
        votedUsers: {
          connect: {
            id: userId,
          },
        },
      },
    });
    if (!count) {
      return res.status(402).json({
        message: "Invalid pollId or content",
      });
    }
    res.json({
      message: "Successfully Voted",
    });
  } catch (err) {
    console.log(err);
    res.json({
      message: "Server Error" + err.message,
    });
  }
};

const getResults = async (req, res) => {
  try {
    let pollId = parseInt(req.params["pollId"]);
    const options = await prisma.options.findMany({
      where: {
        pollId,
      },
      select: {
        content: true,
        count: true,
      },
    });

    res.json(options);
  } catch (err) {
    console.log(err);
    res.json({
      message: "Server Error" + err.message,
    });
  }
};

module.exports = {
  createPoll,
  addOptionsToPoll,
  getOptionsOfthePoll,
  deleteOptions,
  vote,
  getResults,
  isVoted,
  EditPoll,
};
