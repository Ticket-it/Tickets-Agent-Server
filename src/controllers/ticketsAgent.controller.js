// Important requires
const createError = require("http-errors");
const { database } = require("../config/firebaseConfig");


const {
    readRecord,
    getAttendanceWithEventId,
    getAttendantDetails,
    updateRecord
} = require('../../utils/CRUD')

/**
 * Function to get Attendance by event ID
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const getAttendenaceByEventId = async (req, res, next) => {

    try {
        const eventId = req.params.eventId;

        /**
         * Check if event does not exists
         */
        const event = `Events/${eventId}`;
        const eventRecord = await readRecord(event);

        if (!eventRecord) {
            return res.status(404).json({
                status: 404,
                message: "Event not found"
            });
        }

        const tickets = await getAttendanceWithEventId(eventId);

        res.status(200).send(tickets);
    } catch (error) {
        console.error(error);
        next(error);
    }
};


/**
 * Function to get Attendant Details by ticket ID
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const getAttendantDetailsByTicketId = async (req, res, next) => {

    try {
        const ticketId = req.params.ticketId;

        /**
         * Check if ticket does not exists
         */
        const ticket = `Tickets/${ticketId}`;
        const ticketRecord = await readRecord(ticket);

        if (!ticketRecord) {
            throw new createError[404]("Ticket is not found");
        }

        const ticketDetails = await getAttendantDetails(ticketId);

        res.status(200).send(ticketDetails);
    } catch (error) {
        console.error(error);
        next(error);
    }
};


/**
 * Function to approve Attendant by ticket ID
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const approveAttendant = async (req, res, next) => {

    try {

        const ticketId = req.params.ticketId;

        const ticketPath = `Tickets/${ticketId}`;

        /**
         * Check if ticket exists
         */
        const ticketRecord = await readRecord(ticketPath);

        if (!ticketRecord) {
            return res.status(404).json({
                status: 404,
                message: "Ticket not found"
            });
        }

        /**
         * Update ticket status "Attended"
         */
        const recordData = {
            status: req.body.status
        };
        await updateRecord(ticketPath, recordData);

        return res.status(200).send({
            message: "true",
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

/**
 * Test Function
 * @param {*} req
 * @param {*} res
 * @returns
 */
const test = async (req, res,next) => {

    try {
        if (0) {
            return res.status(422).json({
                status: 422,
                message: "Error no userId/userDetails not found!"
            });
        }

        const response = {
            sub:"123",
            name:"Test"
        }

        // Insert the user
        set(ref(database, "Users/" + response.sub), {
            userId: response.sub,
            name: response.name,
        });

        return res.status(200).send({
            message: "true",
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

module.exports = {
    test,
    getAttendenaceByEventId,
    getAttendantDetailsByTicketId,
    approveAttendant
};
