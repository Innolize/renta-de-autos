function fechaMinimaCalendariosDefault() {
    let minInicio
    let minTermina

    let date = new Date()
    fechaMinimaInicio = date.toISOString().split("T")[0];

    date.setDate(date.getDate() + 1)
    fechaMinimaTermina = date.toISOString().split("T")[0]

    return { minInicio, minTermina }
}

module.exports = {
    fechaMinimaCalendariosDefault
}