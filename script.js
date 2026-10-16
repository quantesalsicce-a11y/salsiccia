// Attivazione e interazione pulsanti carne/bevande
document.querySelectorAll('.meat-checkbox').forEach(btn => {
    btn.addEventListener('click', () => {
        btn.classList.toggle('active');
    });
});

// Attivazione e interazione pulsanti dei gruppi (Veggie e Alcol)
document.querySelectorAll('.btn-group').forEach(group => {
    group.querySelectorAll('.btn-select').forEach(btn => {
        btn.addEventListener('click', () => {
            group.querySelectorAll('.btn-select').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
});

let currentTextForWA = "";

function calculateGrill() {
    const people = parseInt(document.getElementById('peopleInput').value);
    if (!people || people <= 0) {
        alert("Inserisci quante persone siete!");
        return;
    }

    const activeMeats = Array.from(document.querySelectorAll('.meat-checkbox.active')).map(b => b.getAttribute('data-type'));
    if (activeMeats.length === 0) {
        alert("Seleziona almeno un ingrediente o bevanda!");
        return;
    }

    const vegStatus = document.querySelector('#vegGroup .active').getAttribute('data-value');
    const alcLevel = document.querySelector('#alcGroup .active').getAttribute('data-value');

    const meatTypes = ["salsiccia", "costine", "pancetta", "coppa", "fiorentina", "spiedini", "pollo"];
    const vegTypes = ["zucchine", "melanzane", "peperoni", "cipolla"];
    
    const chosenMeats = activeMeats.filter(t => meatTypes.includes(t));
    const chosenVeg = activeMeats.filter(t => vegTypes.includes(t));
    const vuoleBruschette = activeMeats.includes("bruschette");
        // CALCOLO REALE PESO CARNE (Media reale di 450g totali a persona)
    let pesoCarnePerPersona = 450; 
    let realMeatEaters = people;
    if (vegStatus === "1") { realMeatEaters = Math.max(0, people - 1); }
    if (vegStatus === "2") { realMeatEaters = Math.max(0, people - 2); }
    
    let pesoCarneTotaleGrammi = chosenMeats.length > 0 ? (realMeatEaters * pesoCarnePerPersona) : 0;
    let grammiPerTaglio = chosenMeats.length > 0 ? (pesoCarneTotaleGrammi / chosenMeats.length) : 0;

    let htmlMacelleria = "";
    if (chosenMeats.length > 0) {
        htmlMacelleria += "<h3>🥩 Ciccia e Proteine </h3>";
    }
    
    currentTextForWA = `🔥 *SPESA CALCOLATA SU QUANTESALSICCE.IT* 🔥\n\nPer ${people} grigliatori selvaggi:\n`;
        if (chosenMeats.length > 0) {
        currentTextForWA += `\n🥩 *MACELLERIA:*\n`;
        chosenMeats.forEach(meat => {
            let label = ""; let qtyString = "";
            let kgTaglio = (grammiPerTaglio / 1000).toFixed(1);

            if (meat === "salsiccia") { label = "Salsicce e Salamelle"; qtyString = `${Math.round(grammiPerTaglio / 100)} pezzi (~${kgTaglio} kg)`; } 
            else if (meat === "costine") { label = "Costine / Puntine (🐖)"; qtyString = `${Math.round(grammiPerTaglio / 140)} pezzi (~${kgTaglio} kg)`; } 
            else if (meat === "pancetta") { label = "Pancetta a fette spesse (🐖)"; qtyString = `${Math.round(grammiPerTaglio / 70)} fette (~${kgTaglio} kg)`; } 
            else if (meat === "coppa") { label = "Coppa / Braciole di coppa (🐖)"; qtyString = `${Math.round(grammiPerTaglio / 120)} fette (~${kgTaglio} kg)`; } 
            
            // === 🐂 CONTROLLO FIORENTINA FORZATO A MINIMO 0.8 KG ===
            else if (meat === "fiorentina") { 
                label = "Fiorentina (🐂)"; 
                let kgRealiFiorentina = grammiPerTaglio / 1000;
                
                // Se il calcolo matematico scende troppo, la blocchiamo a 0.8 kg
                if (kgRealiFiorentina < 0.8) {
                    kgRealiFiorentina = 0.8;
                }
                
                // Calcoliamo i pezzi arrotondando su base 800g a pezzo
                let pezziFiorentina = Math.max(1, Math.round((kgRealiFiorentina * 1000) / 800));
                qtyString = `${pezziFiorentina} pz grande (~${kgRealiFiorentina.toFixed(1)} kg)`; 
            } 
            
            else if (meat === "spiedini") { label = "spiedini (🐂/🐏)"; qtyString = `${Math.round(grammiPerTaglio / 150)} pezzi (~${kgTaglio} kg)`; } 
            else if (meat === "pollo") { label = "Ali / Cosce di Pollo (🐓)"; qtyString = `${Math.round(grammiPerTaglio / 90)} pezzi (~${kgTaglio} kg)`; }

            htmlMacelleria += createRow(label, qtyString);
            currentTextForWA += `• ${label}: ${qtyString}\n`;
        });
    }



    // CALCOLO STIMA PESO VERDURE (150g a pezzo intero per la carbonella)
    let pesoVerdureTotaleGrammi = 0;
    let htmlVerdure = "";
    if (chosenVeg.length > 0) {
        htmlVerdure += "<h3>🥗 Erba e Contorni (Giusto per fare colore)</h3>";
        currentTextForWA += `\n🥗 *ORTOFRUTTA:*\n`;
        chosenVeg.forEach(veg => {
            let label = ""; let pezziVerdura = 0;
            if (veg === "zucchine") { label = "Zucchine medie"; pezziVerdura = Math.ceil(people * 0.4); } 
            else if (veg === "melanzane") { label = "Melanzane tonde"; pezziVerdura = Math.ceil(people * 0.2); } 
            else if (veg === "peperoni") { label = "Peperoni"; pezziVerdura = Math.ceil(people * 0.3); }
            else if (veg === "cipolla") { label = "Cipolle intere"; pezziVerdura = Math.ceil(people * 0.4); }

            pesoVerdureTotaleGrammi += (pezziVerdura * 150);
            let qtyString = `${pezziVerdura} pezzi`;
            htmlVerdure += createRow(label, qtyString);
            currentTextForWA += `• ${label}: ${qtyString}\n`;
        });
    }

    let veggieTomini = 0; let veggieBurger = 0;
    if (vegStatus === "1") { veggieTomini = 2; veggieBurger = 1; }
    if (vegStatus === "2") { veggieTomini = 4; veggieBurger = 2; }

    let htmlVeggie = "";
    if (veggieTomini > 0) {
        htmlVeggie += "<h3>🌱 Reparto Veggie (Il Grigliatore sta piangendo)</h3>";
        htmlVeggie += createRow("Tomini da piastra", `${veggieTomini} pezzi`);
        htmlVeggie += createRow("Burger Vegetali", `${veggieBurger} pezzi`);
        currentTextForWA += `\n🌱 *ZONA VEGGIE:*\n• Tomini: ${veggieTomini} pz\n• Burger Veg: ${veggieBurger} pz\n`;
    }
    // ALGORITMO SCIENTIFICO DELLA CARBONELLA 🪵
// Formula ottimizzata: 1 kg di carbone per ogni kg di cibo totale + 0.5 kg fissi di partenza
let pesoCiboTotaleKg = (pesoCarneTotaleGrammi + pesoVerdureTotaleGrammi + (veggieTomini * 100) + (veggieBurger * 100)) / 1000;
let kgCarbonellaNecessari = Math.ceil((pesoCiboTotaleKg * 1.0) + 0.5);

let consiglioSacchi = "";
if (kgCarbonellaNecessari <= 3) {
    consiglioSacchi = `${kgCarbonellaNecessari} kg (1 sacco piccolo da 2.5/3kg)`;
} else if (kgCarbonellaNecessari <= 5) {
    consiglioSacchi = `${kgCarbonellaNecessari} kg (1 sacco grande da 5kg)`;
} else {
    let numSacchiCinqueKg = Math.ceil(kgCarbonellaNecessari / 5);
    consiglioSacchi = `${kgCarbonellaNecessari} kg (Consigliati: ${numSacchiCinqueKg} sacchi da 5kg)`;
}


    // CALCOLO LIQUIDI & ALCOLOMETRO
    let birre = 0; let vino = 0; let amaro = 0; let analcolici = 0; let fraseAlcol = "";
    if (alcLevel === "astemi") { 
        analcolici = Math.ceil(people * 1.5); 
        fraseAlcol = "⚠️ Attenzione: Grigliata ad alto rischio di sobrietà. Siete davvero sicuri di quello che state facendo?"; 
    } else if (alcLevel === "standard") {
        birre = activeMeats.includes("drink_birra") ? (people * 3) : 0; 
        vino = activeMeats.includes("drink_vino") ? Math.ceil(people / 3) : 0; 
        amaro = activeMeats.includes("drink_amaro") ? Math.ceil(people / 6) : 0; 
        analcolici = Math.ceil(people * 0.5);
        fraseAlcol = "🍻 Livello Standard: Ottimo bilanciamento. Abbastanza allegri per ridere, abbastanza lucidi per non bruciare le costine.";
    } else if (alcLevel === "alpini") {
        birre = activeMeats.includes("drink_birra") ? (people * 6) : 0; 
        vino = activeMeats.includes("drink_vino") ? Math.ceil(people / 2) : 0; 
        amaro = activeMeats.includes("drink_amaro") ? Math.ceil(people / 4) : 0; 
        analcolici = activeMeats.includes("drink_amaro") ? (people * 1) : Math.ceil(people * 0.5);
        fraseAlcol = "🚨 PERICOLO: Selezionato livello Alpini! Domani mattina la chat del gruppo sarà piena di rimorsi, mal di testa e messaggi vocali incomprensibili.";
    }
    const acqua = people * 1; 

    // EXTRA E CARBOIDRATI
    const patatine = Math.ceil(people / 4); const salse = Math.ceil(people / 7); const paniniNormali = Math.round(people * 1.5); const fetteBruschetta = Math.round(people * 1.3); 
        let htmlBevande = "<h3>🍻 Idratazione</h3>";
    htmlBevande += `<p style="color: #FF9800; font-size:0.85rem; margin-top:-5px; font-style:italic;">${fraseAlcol}</p>`;
    currentTextForWA += `\n🍻 *BEVANDE:*\n`;
    if (birre > 0) { htmlBevande += createRow("Birre fresche (33cl)", `${birre} bottiglie`); currentTextForWA += `• Birre: ${birre}\n`; }
    if (vino > 0) { htmlBevande += createRow("Vino", `${vino} bottiglie`); currentTextForWA += `• Vino: ${vino} bott.\n`; }
    if (amaro > 0) { htmlBevande += createRow("Amaro", `${amaro} bottiglie`); currentTextForWA += `• Amaro/Gin: ${amaro} bott.\n`; }
    htmlBevande += createRow("Bibite analcoliche (🤬)", `${analcolici} Litri`);
    htmlBevande += createRow("Acqua per i superstiti", `${acqua} Litri`);
    currentTextForWA += `• Bibite: ${analcolici}L\n• Acqua: ${acqua}L\n`;
    // === 🪵 KIT DI SOPRAVVIVENZA (CON NOTA IGNORANTE) ===
    let htmlExtra = "<h3>🪵 Kit di Sopravvivenza del Grigliatore</h3>";
    htmlExtra += `<p style="color: #FF9800; font-size:0.85rem; margin-top:-5px; font-style:italic;">⚠️ NOTA DI SICUREZZA: Accendere il fuoco lontano dagli astemi, tenere la carbonella all'asciutto e le birre tassativamente a portata di mano.</p>`;
    htmlExtra += createRow("Carbonella / Carbone", consiglioSacchi);
    
    currentTextForWA += `\n🪵 *KIT DI SOPRAVVIVENZA:*\n⚠️ _Nota: Fuoco acceso, carne sulla griglia e birre tassativamente in ghiaccio._\n• Carbonella necessaria: ${consiglioSacchi}\n`;

    // === 🍞 SEZIONE ISOLATA CARBOIDRATI & CONDIMENTI ===
    htmlExtra += "<h3>🍞 Extra e Carbo</h3>";
    htmlExtra += createRow("Panini per la ciccia", `${paniniNormali} pezzi`);
    currentTextForWA += `\n🍞 *Extra e Carbo:*\n• Panini per imbottire: ${paniniNormali}\n`;

    if (vuoleBruschette) { 
        htmlExtra += createRow("Fette di Filone (per Bruschette)", `${fetteBruschetta} fette grandi`); 
        currentTextForWA += `• Fette per bruschette: ${fetteBruschetta}\n`; 
    }
    htmlExtra += createRow("Sacchetti di Patatine", `${patatine} conf.`); 
    htmlExtra += createRow("Salse (Maionese/Ketchup)", `${salse} tubetti`);
    currentTextForWA += `• Patatine: ${patatine}\n• Salse: ${salse}\n`;

    // Chiusura del messaggio finale per WhatsApp
    currentTextForWA += `\n🚨 *ATTENZIONE: Chi si tira indietro all'ultimo momento paga la spesa a tutti!* 🚨\n🛒 Calcolato su QuanteSalsicce.it`;



    // VERDRETTI GOLIARDICI AGGIORNATI
    let fraseVerdetto = "";
    if (chosenMeats.length === 0 && chosenVeg.length > 0) {
        fraseVerdetto = "🟢 LIVELLO IGNORANZA: 0% (Pranzo Salutista). Il barbecue sta piangendo, ma il vostro fegato ringrazia.";
    } else if (alcLevel === "astemi" && chosenMeats.length > 0) {
        fraseVerdetto = "🟡 LIVELLO IGNORANZA: 20% (Grigliata da Oratorio). Tanta carne ma zero alcol. Finirete a giocare a briscola alle tre del pomeriggio.";
    } else if (chosenMeats.length <= 2 && alcLevel === "standard") {
        fraseVerdetto = "🟠 LIVELLO IGNORANZA: 50% (Dilettanti della domenica). Grigliata classica senza troppe pretese. Ci si diverte ma senza finire sui libri di storia.";
    } else if (chosenMeats.length >= 4 && alcLevel === "standard") {
        fraseVerdetto = "🔴 LIVELLO IGNORANZA: 85% (Furia Carnivora). C'è un intero zoo sulla griglia. Alle 16:30 scatterà l'abbiocco violento sulla sedia di plastica.";
    } else if (chosenMeats.length >= 4 && alcLevel === "alpini") {
        fraseVerdetto = " 🌋 LIVELLO IGNORANZA: 100% (APOCALISSE DELLA BRACE). Livello Alpini attivo. Qualcuno stasera perderà il telefono e domani non si ricorderà nulla. Leggende.";
    } else {
        fraseVerdetto = "🔥 LIVELLO IGNORANZA: 70% Bilanciamento perfetto tra ignoranza e sopravvivenza. Sarà un successo.";
    }

    let htmlVerdetto = `<div style="background: rgba(255, 87, 34, 0.15); border: 1px dashed #FF5722; padding: 14px; border-radius: 8px; margin-top: 25px; text-align: center; font-weight: bold; color: #FFF; font-size: 0.95rem;">${fraseVerdetto}</div>`;

    document.getElementById('sectionsContainer').innerHTML = htmlMacelleria + htmlVerdure + htmlVeggie + htmlBevande + htmlExtra + htmlVerdetto;
    document.getElementById('resultsCard').style.display = 'block'; 
    document.getElementById('waBtn').style.display = 'block'; 
    document.getElementById('resultsCard').scrollIntoView({ behavior: 'smooth' });
}

function createRow(name, qty) {
    return `<div class="item-row" onclick="this.classList.toggle('checked')"><span>${name} (<b>${qty}</b>)</span><div class="checkbox"></div></div>`;
}
function shareWhatsApp() {
    const people = document.getElementById('peopleInput').value || "10";
    
    // Intestazione principale del messaggio
    let testoWhatsApp = `🔥 *SPESA CALCOLATA SU QUANTESALSICCE.IT* 🔥\n\nEcco la spesa ufficiale per la nostra comitiva di ${people} grigliatori selvaggi:\n`;
    
    // Recuperiamo tutti i titoli di categoria e le righe della spesa generate a schermo
    const elementiScontrino = document.querySelectorAll('#sectionsContainer h3, .item-row');
    
    elementiScontrino.forEach(el => {
        if (el.tagName === 'H3') {
            // Se incontra un titolo (h3), lo formatta in MAIUSCOLO e in grassetto (*TITOLO*) per WhatsApp
            testoWhatsApp += `\n*${el.innerText.toUpperCase()}*\n`;
        } else {
            // Prende il testo reale dell'ingrediente, escludendo il quadratino grafico
            let testoRiga = el.querySelector('span') ? el.querySelector('span').innerText : el.innerText;
            testoWhatsApp += `${testoRiga.trim()}\n`;
        }
    });
    
    // Messaggio goliardico finale
    testoWhatsApp += `\n📝 *Nota:*la lista si basa sulle reali medie di consumo dei grigliatori italiani. \n`;
    testoWhatsApp += `\n🚨 *ATTENZIONE: Chi si tira indietro all'ultimo momento paga la spesa a tutti!* 🚨\n🛒 Calcolato su QuanteSalsicce.it`;

    // Il tuo metodo originale per aprire WhatsApp
    const base = "https" + ":" + "//" + "api" + "." + "whatsapp" + "." + "com" + "/send?text=";
    const url = base + encodeURIComponent(testoWhatsApp); 
    window.open(url, '_blank');
}

