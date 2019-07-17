const getToday = () => {
    const today = new Date()
    const weekSabString = 'Sábado', weekTerString ='Terça-Feia'
    let weekDay, weekTer, weekSab

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

    //Cálculo para insercao no banco terca
    if(dayString == "Segunda-Feira") weekTer = today.getDate() +1
    if(dayString == "Terça-Feira") weekTer = today.getDate() 
    if(dayString == "Quarta-Feira") weekTer = today.getDate() - 1
    if(dayString == "Quinta-Feira") weekTer = today.getDate() - 2
    if(dayString == "Sexta-Feira") weekTer = today.getDate() - 3
    if(dayString == "Sábado") weekTer = today.getDate() - 4
    if(dayString == "Domingo") weekTer = today.getDate() - 5

    //Cálculo para insercao no banco sabado // 
    if(dayString == "Segunda-Feira") weekSab = today.getDate() + 5
    if(dayString == "Terça-Feira") weekSab = today.getDate() + 4
    if(dayString == "Quarta-Feira") weekSab = today.getDate() + 3
    if(dayString == "Quinta-Feira") weekSab = today.getDate() + 2
    if(dayString == "Sexta-Feira") weekSab = today.getDate() +1
    if(dayString == "Sábado") weekSab = today.getDate() 
    if(dayString == "Domingo") weekSab = today.getDate() - 1

    const getTerDB = `${weekTerString} ${weekTer} de ${month} de ${year}` //Terça-Feia 18 de Junho de 2019
    const getSabDB = `${weekSabString} ${weekSab} de ${month} de ${year}`

    const getTerTab = `${month}${weekTer}Ter${year}` //Junho18Ter2019
    const getSabTab = `${month}${weekSab}Sab${year}`

    //dia por extenso
    const totalDate = `${dayString} ${dayNumber} de ${month} de ${year}`

    return { dayNumber, 
        dayString, 
        year, 
        month, 
        weekDay, 
        totalDate, 
        getTerDB, 
        getSabDB,
        getTerTab,
        getSabTab} 

        
}

// Dar bom dia, tarde ou noite.
const goodMorning = () => {
    const today = new Date()
    if(today.getHours()>23 && today.getHours() < 12) return "Bom Dia" 
    if(today.getHours()>=12 && today.getHours() < 18) return "Boa Tarde" 
    if(today.getHours()>=18 && today.getHours() <= 23) return "Boa Noite" 
}

// hora atual
const getTime = () => {
    const today = new Date()
    return (`${today.getHours()} : ${today.getMinutes()} : ${today.getSeconds()}`)
}



module.exports = {
    getToday,
    goodMorning,
    getTime
}

    const today = new Date()
    var theBigDay = new Date();
    theBigDay.setMonth(6);
    
    //Watch out for end of month transitions
    var endOfMonth = new Date(2016, 7, 31);
    endOfMonth.setMonth(1);







