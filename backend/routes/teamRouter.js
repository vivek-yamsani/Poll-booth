const teamRouter = require('express').Router();
const controllers = require("../controllers/teamController");
const { checkTeamAdmin } = require("../middlewares/checkAccessLevel");

teamRouter.get('/', controllers.listUserTeams)

teamRouter.post('/new', controllers.createTeam)

teamRouter.get('/:teamId', controllers.getTeamById)

teamRouter.post('/:teamId/makeadmin',checkTeamAdmin, controllers.makeAdmin)

teamRouter.post('/:teamId/add', checkTeamAdmin, controllers.addMember)

teamRouter.post('/:teamId/remove',checkTeamAdmin, controllers.removeMember)


module.exports = teamRouter