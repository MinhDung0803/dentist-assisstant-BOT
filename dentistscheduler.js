class DentistScheduler {
    constructor(endpoint) {
        this.getAvailability = async () => {
            console.log(endpoint + "availability");
            const response = await fetch(endpoint + "availability")
            const times = await response.json()
            let responseText = `Current time slots available: `
            times.map(time => {
                responseText += `
${time}`
            })
            return responseText
        }

        this.scheduleAppointment = async (time) => {
            const response = await fetch(endpoint + "schedule", { method: "post", body: { time: time } })
            let responseText = `An appointment is set for ${time}.`
            return responseText
        }
    }
}

module.exports = DentistScheduler