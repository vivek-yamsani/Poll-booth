const { json } = require("express");
const prisma = require("../config/prisma");

const isTeamMember = async (userId, teamId) => {
  try {
    const isAlreadyPresent = await prisma.teams.findMany({
      where: {
        id: teamId,
        OR: [
          {
            members: {
              some: {
                id: userId,
              },
            },
          },
          {
            admins: {
              some: {
                id: userId,
              },
            },
          },
        ],
      },
    });
    console.log(isAlreadyPresent);
    if (isAlreadyPresent.length == 0) {
      return 0;
    }
    return 1;
  } catch (err) {
    // console.log(err);
    return Error(err.message);
  }
};

const isTeamAdmin = async (userId, teamId) => {
  try {
    const isAlreadyPresent = await prisma.teams.findMany({
      where: {
        id: teamId,
        admins: {
          some: {
            id: userId,
          },
        },
      },
    });
    if (isAlreadyPresent.length != 1) {
      return false;
    }
    return true;
  } catch (err) {
    console.log(err);
    return Error("Something went wrong");
  }
};

const checkTeamMember = async (req, res, next) => {
  try {
    const userId = req.userId;
    let teamId =
      req.params["teamId"] == null ? req.body.teamId : req.params["teamId"];
    teamId = parseInt(teamId);
    console.log(teamId, userId);
    if (!teamId || isNaN(teamId)) {
      return res.status(401).json({
        message: "Invalid Request",
      });
    }
    const isAlreadyPresent = await isTeamMember(userId, teamId);
    if (!isAlreadyPresent) {
      return res.status(401).json({
        message: "User is not a part of team",
      });
    }
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Server Error" + err.message,
    });
  }
};

const checkTeamAdmin = async (req, res, next) => {
  try {
    const userId = req.userId;
    let teamId =
      req.params["teamId"] == null ? req.body.teamId : req.params["teamId"];
    teamId = parseInt(teamId);
    console.log(teamId, isNaN(teamId));
    if (!teamId || isNaN(teamId)) {
      return res.status(401).json({
        message: "Invalid Request",
      });
    }
    // console.log(teamId);
    const isAlreadyPresent = await isTeamAdmin(userId, teamId);

    if (!isAlreadyPresent) {
      return res.status(401).json({
        message: "User is not a part of team or not an admin of the team",
      });
    }
    if (!next) {
      return res.json(true);
    }
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Server Error" + err.message,
    });
  }
};

const checkPollisOfTeam = async (req, res, next) => {
  try {
    let { teamId, pollId } = req.body;
    if (!pollId) {
      console.log(req.params["pollId"], req.params.pollId);
      pollId = req.params["pollId"];
      pollId = parseInt(pollId);
    }
    console.log(pollId);
    if (!pollId) {
      return res.status(400).json({
        message: "Invalid Request",
      });
    }
    const teams = await prisma.teams.findMany({
      where: { id: teamId, polls: { some: { id: pollId } } },
    });
    console.log(teams);
    if (teams.length == 0) {
      return res.status(403).json({
        message: "Invalid pollId or poll is not a part of team",
      });
    }

    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Server Error " + err.message,
    });
  }
};

module.exports = {
  checkTeamAdmin,
  checkTeamMember,
  isTeamAdmin,
  isTeamMember,
  checkPollisOfTeam,
};
