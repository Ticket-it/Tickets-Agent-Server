const ticketAgentControllers = require("../controllers/ticketsAgent.controller");
const express = require('express');
const router = express.Router();
/**
 * Events routes
 */


// To get attendance 
router.route("/attendance/:eventId").get(ticketAgentControllers.getAttendenaceByEventId);

// To approve an attendant
router.route("/attendant-approve/:ticketId").post(ticketAgentControllers.approveAttendant);

router.route("/test").get(ticketAgentControllers.test);


module.exports = router;