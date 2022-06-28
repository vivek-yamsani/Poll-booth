const prisma = require("../config/prisma");
const {
  isTeamMember,
  isTeamAdmin,
} = require("../middlewares/checkAccessLevel");

const createTeam = async (req, res) => {
  try {
    const { userId } = req;
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({
        message: "Invalid Request",
      });
    }
    const isAlreadyPresent = await prisma.teams.findUnique({
      where: {
        name: name,
      },
    });
    if (isAlreadyPresent) {
      return res.status(400).json({
        message: `${name} is already taken`,
      });
    }
    const newTeam = await prisma.teams.create({
      data: {
        name,
        admins: {
          connect: {
            id: userId,
          },
        },
      },
    });
    console.log(newTeam);
    res.json({
      message: "Successfully created the team...",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Something went wrong...!",
    });
  }
};

const addMember = async (req, res) => {
  try {
    const teamId = parseInt(req.params["teamId"]);
    const { email } = req.body;
    const user = await prisma.users.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) {
      return res.status(400).json({
        message: "No user is present with email " + email,
      });
    }
    const updated_team = await prisma.teams.update({
      where: {
        id: teamId,
      },
      data: {
        members: {
          connect: {
            email: email,
          },
        },
      },
    });
    console.log(updated_team);
    res.json({ message: "Successfully added ...!" });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: "Something went wrong...!",
    });
  }
};

const removeMember = async (req, res) => {
  try {
    const teamId = parseInt(req.params["teamId"]);
    const { userId } = req.body;
    const isAlreadyPresent =
      (await isTeamMember(userId, teamId)) ||
      (await isTeamAdmin(userId, teamId));
    if (!isAlreadyPresent) {
      return res.status(401).json({
        message: "The user is not a part of the team..",
      });
    }
    const updatedTeam = await prisma.teams.update({
      where: {
        id: teamId,
      },
      data: {
        members: {
          disconnect: {
            id: userId,
          },
        },
        admins: {
          disconnect: {
            id: userId,
          },
        },
      },
    });
    res.json({
      message: "Successfully removed ...!",
    });
  } catch (err) {
    console.log(err);
    res
      .json({
        message: "Something went wrong ...!",
      })
      .status(400);
  }
};

const getTeamById = async (req, res) => {
  try {
    const teamId = parseInt(req.params["teamId"]);
    const { userId } = req;
    const isAdmin = await isTeamAdmin(userId, teamId);
    const team = await prisma.teams.findUnique({
      where: {
        id: teamId,
      },
      include: {
        polls: {
          include: {
            author: {
              select: {
                name: true,
              },
            },
          },
        },
        members: {
          select: {
            id: true,
            name: true,
          },
        },
        admins: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    console.log(team,isAdmin);
    res.json({ isAdmin: isAdmin, team: team });
  } catch (err) {
    console.log(err);
    res
      .json({
        message: "Something went wrong ...!",
      })
      .status(500);
  }
};

const makeAdmin = async (req, res) => {
  try {
    const teamId = parseInt(req.params["teamId"]);
    let newUserId = req.body.userId;
    newUserId = parseInt(newUserId);
    console.log(teamId, newUserId);
    if (isNaN(teamId) || isNaN(newUserId)) {
      return res.status(400).json({
        message: "Invalid Request",
      });
    }
    const isAlreadyPresent = await isTeamMember(newUserId, teamId);
    if (!isAlreadyPresent) {
      return res.status(401).json({
        message: "The given id is not part of the team",
      });
    }
    const updated_team = await prisma.teams.update({
      where: {
        id: teamId,
      },
      data: {
        admins: {
          connect: {
            id: newUserId,
          },
        },
        members: {
          disconnect: {
            id: newUserId,
          },
        },
      },
    });
    res.json({
      message: "successfully made admin ...!",
    });
  } catch (err) {
    res
      .json({
        message: "Something went wrong ...!",
      })
      .status(500);
  }
};

const listUserTeams = async (req, res) => {
  try {
    const { userId } = req;
    const teams = await prisma.teams.findMany({
      where: {
        OR: [
          {
            admins: {
              some: {
                id: userId,
              },
            },
          },
          {
            members: {
              some: {
                id: userId,
              },
            },
          },
        ],
      },
    });
    console.log(teams);
    res.json(teams).status(200);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server Error\n",
    });
  }
};

module.exports = {
  listUserTeams,
  addMember,
  createTeam,
  removeMember,
  getTeamById,
  makeAdmin,
};
