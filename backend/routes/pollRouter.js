const pollRouter = require("express").Router();
const controllers = require("../controllers/pollController");
const {
  checkTeamAdmin,
  checkTeamMember,
  checkPollisOfTeam,
  isTeamAdmin,
} = require("../middlewares/checkAccessLevel");

pollRouter.post("/:teamId/polls/new", checkTeamAdmin, controllers.createPoll);

pollRouter.post("/:teamId/polls/:pollId/edit", checkTeamAdmin, controllers.EditPoll);

pollRouter.post(
  "/:teamId/polls/:pollId/addOption",
  checkTeamAdmin,
  checkPollisOfTeam,
  controllers.addOptionsToPoll
);

pollRouter.delete(
  "/:teamId/polls/:pollId/deleteOption",
  checkTeamAdmin,
  checkPollisOfTeam,
  controllers.deleteOptions
);


pollRouter.get(
  "/:teamId/polls/:pollId/getOptions",
  checkTeamMember,
  checkPollisOfTeam,
  controllers.getOptionsOfthePoll
);

pollRouter.post("/:teamId/polls/:pollId/isAdmin", async (req, res) => {
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
    res.json(!!isAlreadyPresent);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Server Error" + err.message,
    });
  }
});

pollRouter.post("/:teamId/polls/:pollId/isVoted", controllers.isVoted);

pollRouter.post(
  "/:teamId/polls/:pollId/vote",
  checkTeamMember,
  checkPollisOfTeam,
  controllers.vote
);

pollRouter.get(
  "/:teamId/polls/:pollId/results",
  checkTeamAdmin,
  checkPollisOfTeam,
  controllers.getResults
);

module.exports = pollRouter;
