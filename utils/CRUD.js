// Important requires
const { database } = require("../src/config/firebaseConfig");
const { ref, set, get, update, remove } = require("firebase/database");

// Function to create a new record
async function createRecord(path, data) {
    return await set(ref(database, path), data);
}

// Function to read a record
async function readRecord(path) {
    const snapshot = await get(ref(database, path));
    if (snapshot.exists()) {
        return snapshot.val();
    } else {
        return null;
    }
}

// Function to update a record
async function updateRecord(path, data) {
    await update(ref(database, path), data);
}

// Function to delete a record
async function deleteRecord(path) {
    await remove(ref(database, path));
}

// Function to get all records
async function getAllRecords(path) {
    const myRef = ref(database, path);
    const refSnapshot = await get(myRef);

    const myArr = [];
    if (refSnapshot.exists()) {
        refSnapshot.forEach((refChild) => {
            myArr.push(refChild.val());
        });
    }

    return myArr;
}


// Function to get all approved tickets by event Id
async function getAttendanceWithEventId(paramsEventId) {

    const ticketsRef = ref(database, "Tickets");

    const ticketsSnapshot = await get(ticketsRef);




    const tickets = [];

    if (ticketsSnapshot.exists()) {
        const ticketPromises = [];
        ticketsSnapshot.forEach((ticketChild) => {
            const ticketData = ticketChild.val();
            const eventId = ticketData.eventId;
            if (paramsEventId === eventId && ticketData.status === "Approved") {
                const eventPromise = readRecord(`Events/${eventId}`).then(async (eventRecord) => {
                    if (eventRecord) {
                        ticketData.eventDetails = eventRecord;
                        const userId = ticketData.userId;
                        const userPromise = await readRecord(`Users/${userId}`).then(async (userRecord) => {
                            if (userRecord) {
                                ticketData.userName = userRecord.fullName;
                            }
                        });
                        ticketPromises.push(userPromise);
                        tickets.push(ticketData);
                    }
                });
                ticketPromises.push(eventPromise);
            }
        });
        await Promise.all(ticketPromises);
    }
    return tickets;

}




module.exports = {
    createRecord,
    readRecord,
    updateRecord,
    deleteRecord,
    getAllRecords,
    getAttendanceWithEventId
};