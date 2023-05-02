/**
 * Requires
 */
const express = require('express')
require("dotenv").config();
const morgan = require('morgan')
var cors = require("cors");
const ticektAgentRouter = require("./routes/ticketsAgent.router")
const errorHandler = require("./middlewares/errorHandler");

/**
 * Instances
 */
const app = express()
const TICKET_AGENT_ROUTER = "/api/ticket-agent"
const port = process.env.PORT || 3002;

/**
 * Middlewares
 */

//app.use(morgan('combined'))
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
// Error Handler
app.use(errorHandler)


/**
 * Routes
 */
app.use(TICKET_AGENT_ROUTER,ticektAgentRouter)


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Ticket Agent' Server listening on port ${port}`)
})