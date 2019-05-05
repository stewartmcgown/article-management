/**
 * Schedule a task to run every n seconds
 * @param {Function} task
 * @param {Number} [time]
 */
const schedule = (task, time = 1000) => setInterval(task, time)

module.exports = { schedule }
