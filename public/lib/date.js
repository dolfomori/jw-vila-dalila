const getToday = () => {
    const today = new Date()
    let weekDay

    const getWeek = ["Domingo", "Segunda-Feira", "Terça-Feira", "Quarta-Feira", "Quinta-Feira", "Sexta-Feira", "Sábado"];
    const getMonth = ['Janeiro','Feveiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']

    const dayNumber = today.getDate() // Dia do mês
    const year = today.getFullYear() // Ano
    const dayString = getWeek[today.getDay()] // dia da semana (segunda,terça...)
    const month = getMonth[today.getMonth()] // mês em forma de string ( janeiro, fev...)

    // Cálculo do dia que a semana inicia
    if(dayString == "Domingo") weekDay = today.getDate() - 6
    if(dayString == "Segunda-Feira") weekDay = today.getDate()
    if(dayString == "Terça-Feira") weekDay = today.getDate() - 1
    if(dayString == "Quarta-Feira") weekDay = today.getDate() - 2
    if(dayString == "Quinta-Feira") weekDay = today.getDate() - 3
    if(dayString == "Sexta-Feira") weekDay = today.getDate() - 4
    if(dayString == "Sábado") weekDay = today.getDate() - 5
    
    return { dayNumber, dayString, year, month, weekDay } 
}

const goodMorning = () => {
    const today = new Date()
    if(today.getHours()>23 && today.getHours() < 12) return "Bom Dia" 
    if(today.getHours()>=12 && today.getHours() < 18) return "Boa Tarde" 
    if(today.getHours()>=18 && today.getHours() <= 23) return "Boa Noite" 
}

const getTime = () => {
    const today = new Date()
    return (`${today.getHours()} : ${today.getMinutes()} : ${today.getSeconds()}`)
}

module.exports = {
    getToday,
    goodMorning,
    getTime
}


