import { useState, useMemo, useEffect, useRef } from "react";

// Base data: ratios only — point values derived from weights at runtime
const BASE_GROUPS = [
  {
    id: "oskused", name: "Oskused", nameEn: "Skills", color: "#1a4a6b",
    minWeight: 25, maxWeight: 40, defaultWeight: 33,
    description: "Suhtlemis- ja empaatiaoskused laste, patsientide ja teiste tundlike sihtrühmadega töötamiseks. Oskus kohandada suhtlust ja töövõtteid erinevate sihtrühmade (nt lapsed, eakad, erivajadustega inimesed, ärritunud kliendid) vajadustele.\n\nKäeline osavus erinevate masinate kasutamisel ja tegevuste käigus (süstide tegemine, osade kokkupanemine, massaažid või ravimeetodid, õmblemine).\n\nKirjade, lepingute, dokumentide, juhendite jms koostamine. Keeleline täpsus ja vastutus ametlikes või tundlikes olukordades (nt valeinfo vältimine, korrektne sõnastus).\n\nArhiivi- ja failisüsteemide loomine ning haldamine. Aruannete ja esitlusmaterjalide vormindamine.\n\nOskus töötada kehtestatud reeglite ja protseduuride piires olukordades, kus eksimisruum on väga väike (nt tervishoid, sotsiaalhoolekanne).\n\nPikaajaline keskendumine arvutiekraanile. Töö mitme inimese või osakonna jaoks korraga ja eri tähtaegadega. Töö tempo hoidmine olukorras, kus töökoormus on ebaregulaarselt jaotunud või raskesti prognoositav.\n\nPsühholoogiline ja emotsionaalne tugi klientidele, patsientidele või lastele. Suhtlemine agressiivsete või ebastabiilsete inimestega. Pidev vajadus emotsioone kontrollida ja professionaalset hoiakut säilitada ka pingelistes või ebameeldivates olukordades.\n\nKoostöö eri osapooltega ilma otsese juhtimisõiguseta. Mitme ülesande täitmine samaaegselt. Vastutus reageerida kiiresti ootamatutele olukordadele ilma täiendava ettevalmistuseta.\n\nFüüsiline koormus (nt laste või patsientide tõstmine, sundasendites töötamine).",
    factors: [
      { id: "teadmised",       name: "Teadmised ja kogemus",          nameEn: "Knowledge & Experience",      factorRatio: 200/330, levelRatios: [33/200,67/200,100/200,122/200,167/200,1], descriptions: ["Vajalikud on vaid põhiteadmised, mida saab kiiresti omandada lühikese väljaõppe või konkreetse tööalase juhendamise käigus.\nPõhiharidus või üldine kutsealane ettevalmistus; tööülesanded õpitakse kiiresti selgeks juhendaja toel.\nNäited ametikohtadest: Postiljon, andmesisestaja, laoassistent, klienditeenindaja, abitööline, abikokk, pakendaja", "Vajalikud on põhilised kutsealased või erialased teadmised, mida rakendatakse kehtestatud töökorra raames.\nKutsekeskharidus või erialane täiendusõpe ning kuni aasta varasemat töökogemust.\nNäited ametikohtadest: Kontoriassistent, laborant, müügispetsialist, värbaja, kasutajatoe spetsialist, juhilubadega kuller, tõstukijuht, turvatöötaja tootmisoperaator, abiõpetaja", "Vajalikud on põhjalikud teoreetilised teadmised valdkonnas, mis võimaldavad iseseisvalt rakendada erialaseid meetodeid ja töövahendeid.\nBakalaureusekraad (BSc/BA) või sellega võrreldav töökogemus.\nNäited ametikohtadest: Tarkvaraarendaja, raamatupidaja, personali- või turundusspetsialist, analüütik, insener, projektijuht, haiglaõde, jurist, lasteaia- ja huvikooliõpetaja, kvaliteedispetsialist", "Vajalikud on edasijõudnud või spetsialiseeritud teadmised, mis eeldavad pidevat täiendamist ja professionaalselt iseseisvat otsustusvõimet.\nMagistrikraad (MSc/MA) või tunnustatud erialane kutsekvalifikatsioon.\nNäited ametikohtadest: Kohtujurist, audiitor, vaneminsener, psühholoog, finantskontroller, füsioterapeut, üldhariduskooli ja kutseõppeasutuse õpetaja", "Vajalikud on kõrgtasemel teadmised ja asjatundlikkus koos laia valdkondliku vaatega, mida rakendatakse uute meetodite väljatöötamisel või kohandamisel.\nDoktorikraad või pikk ja põhjalik erialane kogemus; tunnustatud ekspert oma valdkonnas.\nNäited ametikohtadest: Teadur, arst, andmeteadlane, uurimisinsener, tootearenduse juht", "Vajalikud on distsipliine ühendavad ja muutust loovad teadmised, mis kujundavad ümber valdkonna seniseid mõisteid ja määravad selle strateegilise suuna.\nValdkonda kujundav sügav ja tunnustatud asjatundlikkus; mõju ja eestvedamine mitmel erialal.\nNäited ametikohtadest: Meditsiinijuht, peaarst, professor"], factorDescription: "Hindab tööga seotud teadmiste taset, ulatust ja ajakohasust, mis on vajalikud rolli nõuete täitmiseks – sõltumata sellest, kas need on omandatud hariduse, väljaõppe, töö- või elukogemuse kaudu.", levelCodes: ["OT1", "OT2", "OT3", "OT4", "OT5", "OT6"] },
      { id: "fuusiline_voime", name: "Füüsiline võimekus",            nameEn: "Physical Capability",         factorRatio: 10/330,  levelRatios: [2/10,3/10,5/10,7/10,8/10,1],             descriptions: ["Vajalikud on vaid tavapärased füüsilised oskused; töö ei eelda erilist koordinatsiooni ega täpsust.\nVead on lihtsasti parandatavad ning töö tulemused ei sõltu suurel määral täpsusest.\nNäited ametikohtadest: Arhivaar, postiljon, abitööline, kauba väljapanija, pakendaja", "Vajalikud on korrektne käte ja silmade koostöö ning täpne sensoorne taju; töö nõuab vähest kuni mõõdukat täpsust.\nTöö sisaldab lihtsate tööriistade, klaviatuuri või kontoritehnika korduvat kasutamist, mis ei nõua jõudu.\nNäited ametikohtadest: Kassapidaja, klienditeenindaja, laotöötaja, liinioperaator, erinevad kontoris töötavad ametikohad", "Vajalikud on head peenmotoorikaoskused ja püsiv täpsus väikeste tööriistade, instrumentide või seadmete kasutamisel.\nTäpsust tuleb hoida ühtlases tempos; lubatud on väikesed hälbed töö tulemuses.\nNäited ametikohtadest: Laborant, treial, töötlemise operaator, elektroonikaseadmete koostaja, hambatehnik, õmbleja, maaler, küünetehnik, keraamik", "Vajalikud on kõrgetasemelised käelised oskused või täpne sensoorne taju, mida tuleb rakendada kiirelt ja täpselt, sest täpsus on töö tulemuse seisukohalt määrav.\nVead on keerukamad parandada ning täpsus mõjutab otseselt töö kvaliteeti ja ohutust.\nNäited ametikohtadest: Rätsep, optometrist, haiglaõde, elektrik, mehaanik, ehitaja, keevitaja", "Vajalikud on väga täpsed ja kiired liigutused muutuvates töötingimustes.\nTöö eeldab kiiret ja täpset kohanemist ning lubatud veamäär on minimaalne.\nNäited ametikohtadest: Hambaarst, kirurgiaõde, anestesioloog, keemialabori operaator", "Vajalikud on pidev, kõrgtasemel täpsus ja täpne koordinatsioon keerukates töötingimustes, kus vead ei ole lubatud.\nTöö nõuab püsivat kontrolli oma tegevuse üle, kus eksimused võivad põhjustada tõsiseid tagajärgi.\nNäited ametikohtadest: Kirurg, intensiivravi eriarst, lennujuht, piloot"], factorDescription: "Hindab tööks vajalikku peenmotoorikat, käe-silma koostööd ja sensoorset tajutäpsust, mis on olulised kiiruse ja/või täpsuse saavutamiseks ning erinevad füüsilisest pingutusest.", levelCodes: ["OF1", "OF2", "OF3", "OF4", "OF5", "OF6"] },
      { id: "koostoo",         name: "Koostöö ja suhtlemisoskused",   nameEn: "Cooperation & Communication", factorRatio: 50/330,  levelRatios: [8/50,17/50,25/50,33/50,42/50,1],         descriptions: ["Vajalikud on tavapärased suhtlemisoskused, mis võimaldavad teavet edastada ja vastu võtta ilma vajaduseta sõnumit iseseisvalt kohandada.\nSuhtlus on peamiselt rutiinne ja etteaimatav ning toimub enamasti organisatsiooni sees.\nNäited ametikohtadest: Andmesisestaja, postiljon, arhivaar, kauba väljapanija, puhastusteenindaja, pakendaja", "Vajalikud on oskused teabe täpsustamiseks ja ühtlustamiseks, et tagada ühine arusaam.\nSuhtlus ulatub üle üksuste piiride, kuid sõnumid on endiselt lihtsad ja selged.\nNäited ametikohtadest: Sekretär, assistent, müügitugi, laborant, kuller, abiõpetaja, laotöötaja", "Vajalikud on head suhtlemisoskused, mis võimaldavad erinevate osapooltega suheldes sõnumeid kohandada vastavalt olukorrale.\nSuhtlus on sage ning nõuab väljendusviisi ja sisu kohandamist vastavalt sihtrühmale ja kontekstile, sealhulgas väljaspoole organisatsiooni.\nNäited ametikohtadest: Projektijuht, klienditeenindaja, kõnekeskuse agent, õpetaja, juhtkonna abi, ürituskorraldaja, konsultant, värbaja", "Vajalikud on edasijõudnud suhtlemisoskused, mis hõlmavad veenmist, läbirääkimisi ja nõustamist keerukatel teemadel.\nSuhtlus mõjutab otsuseid ning arusaamatused võivad tuua kaasa olulisi tagajärgi (materiaalne- või mainekahju).\nNäited ametikohtadest: Personalijuht, müügiesindaja, kliendihaldur, hanke­spetsialist, logistik-­planeerija, hooldusõde, kommunikatsioonispetsialist", "Vajalikud on kõrgtasemel suhtlemisoskused keerukates või tundlikes olukordades, kus tuleb arvestada vastuoluliste huvidega või suhelda vastumeelsete väliste osapooltega.\nTöö eeldab pingeliste teemade lahendamist ja mitme osapoole huvide ühtlustamist.\nNäited ametikohtadest: Müügijuht, partnerlus- või investorsuhete juht, turunduse- või kommunikatsioonijuht, arst, sotsiaaltöötaja, psühholoog, kohtujurist", "Vajalikud on strateegilisel tasandil suhtlemisoskused, kus edukus sõltub otseselt võimest mõjutada teisi otsustajaid ja suhelda kõrgel juhtimistasandil vastaspooltega.\nTöö nõuab keeruka ja tundliku teabe koondamist ning edastamist juhtidele, järelvalveasutustele (inspektsioonid ja ametid), koostööpartneritele või meediale.\nNäited ametikohtadest: Avalike suhete direktor, tippjuhtkonna liige, vanemnõunik, kantsler, regulatiivsuhete juht"], factorDescription: "Hindab suhtlemise iseloomu ja intensiivsust, mis on vajalik teabe edastamiseks, kohandamiseks, veenmiseks, läbirääkimiste pidamiseks ning suhete loomiseks erinevate sise- ja välisosapooltega.", levelCodes: ["OK1", "OK2", "OK3", "OK4", "OK5", "OK6"] },
      { id: "probleemid",      name: "Probleemide lahendamine",       nameEn: "Problem Solving",             factorRatio: 70/330,  levelRatios: [12/70,23/70,35/70,47/70,58/70,1],        descriptions: ["Vajalik on oskus rakendada kindlaksmääratud töövõtteid ja juhiseid selgelt piiritletud ülesannete täitmisel, vähese vajadusega iseseisvaid otsuseid langetada.\nTöö tugineb selgetele suunistele, varasematele praktikatele ja eeskujudele; kõik tavapärasest erinev edastatakse juhile või spetsialistile.\nNäited ametikohtadest: Assistent, esmatasandi kasutajatugi, puhastusteenindaja, pakkija, tootmise abitöötaja", "Vajalik on oskus valida olemasolevate võimaluste seast sobivaim lahendus tuttavatele probleemidele.\nTöö eeldab erandolukordade äratundmist ja parima lahenduskäigu valimist juba teadaolevate meetodite hulgast.\nNäited ametikohtadest: Klienditeenindaja, raamatupidaja, laborant, personalispetsialist, operaator, tootmistööline", "Vajalikud on analüütilised oskused ning võime kohandada olemasolevaid meetodeid uute probleemide lahendamiseks.\nTöö nõuab erinevate teguritega arvestamist, kompromisside leidmist, seoste nägemist ja prioriteetide seadmist.\nNäited ametikohtadest: Tarkvaarendaja, insener, analüütik, esmatasandijuhid, vahetuse vanem, tehnoloog, hooldustöötaja", "Vajalik on oskus lahendada mitmest tegurist koosnevaid probleeme, kus tuleb toime tulla vastandlike piirangutega ning arendada või täiustada tööprotsesse või tooteid.\nTöö sisaldab ebaselgeid olukordi ja hõlmab koostööd eri tiimidega, kus tuleb pakkuda välja põhjendatud tegutsemisviise.\nNäited ametikohtadest: Projektijuht, vaneminsener, haiglaõde, tootmise protsessijuht, erinevate valdkondade tippspetsialistid, kesktaseme juhid", "Vajalik on oskus luua uusi lähenemisviise mitmetahuliste probleemide lahendamiseks, ühendades teadmisi eri valdkondadest ja funktsioonidest.\nTöö toimub suure ebamäärasuse tingimustes ning hõlmab võimalike stsenaariumite modelleerimist ja poliitikate, protsesside, teenuste või toodete muutmise ettepanekute tegemist.\nNäited ametikohtadest: Tootejuht, strateegiajuht, ärisuuna juht, riskijuht, arst, arhitekt, protfellijuht", "Vajalikud on strateegilised ja muutust loovad probleemilahendusoskused, mis võimaldavad kujundada uusi meetodeid ja strateegiaid kogu organisatsiooni mõjutavas ulatuses.\nTöö eeldab suuna seadmist ebakindlates oludes ning pikaajaliste ja süsteemsete valikute vahel tasakaalu leidmist ja prioriteetide seadmist.\nNäited ametikohtadest: Tegevjuht, juhatuse liige, kantsler, meditsiinijuht"], factorDescription: "Hindab analüüsi- ja otsustusvõimet ning loovust, mida kasutatakse uute või keerukate probleemide lahendamisel – alates olemasolevate lahendusvariantide valikust kuni uute, laiemat mõju omavate lähenemisviiside kujundamiseni.", levelCodes: ["OP1", "OP2", "OP3", "OP4", "OP5", "OP6"] },
    ],
  },
  {
    id: "pingutus", name: "Pingutus", nameEn: "Effort", color: "#2d6a4f",
    minWeight: 15, maxWeight: 30, defaultWeight: 24,
    description: "Müra ja rahvarohkuse tekitatud stress.\n\nKokku puutumine haiguste ja nakkustega.\n\nTöö keskkondades, kus privaatsus ja taastumisvõimalused on piiratud.\n\nKlientide kaebustest või pingelistest teenindussituatsioonidest tulenev stress.\n\nMonotoonsed ülesanded, ebaregulaarsed tööajad, öötöö.\n\nMitmekesised ja ettearvamatud tööülesanded.\n\nPiiratud võimalus tööpäeva jooksul pause teha või töötempot reguleerida.\n\nKokkupuude kahjulike ainetega (nt puhastusvahendid, kemikaalid) ning nende potentsiaalne mõju töötaja tervisele.",
    factors: [
      { id: "vaimne",         name: "Vaimne pingutus",     nameEn: "Mental Effort",   factorRatio: 120/240, levelRatios: [20/120,40/120,60/120,80/120,100/120,1], descriptions: ["Töö nõuab lühiajalist ja lihtsat keskendumist koos rutiinsete kontrolltoimingutega, kus tähelepanu hajumise mõju on hõlpsasti parandatav.\nTöötempo on etteaimatav, katkestusi on vähe ning mitme ülesande korraga täitmine on piiratud.\nNäited ametikohtadest: Laotöötaja, postiljon, puhastusteenindaja", "Töö nõuab keskendumisvõimet, mida katkestavad aeg-ajalt kõrvalülesanded või vajadus tööd kontrollida.\nTöös kasutatakse mitut süsteemi või ekraani, töötempo on mõõdukas ning vead on tavaliselt lihtsasti parandatavad.\nNäited ametikohtadest: Sekretär, klienditeenindaja, klienditoe spetsialist, turvatöötaja", "Töö nõuab pikaajalist keskendumist detailsele teabele ning sagedast ülesannete ja süsteemide vahetamist.\nKeskendumisperioodid kestavad tavaliselt pausideta umbes 60 minutit ning töö eeldab seoste jälgimist mõõduka ajasurve tingimustes.\nNäited ametikohtadest: Raamatupidaja, laborant, andmeanalüütik, tarkvaraarendaja, dispetšer, kvaliteediinsener, logistik", "Töö nõuab pikaajalist ja sügavat keskendumist ajasurve ning keeruka teabevoo tingimustes.\nTöö hõlmab pidevat jälgimist ja erinevatest allikatest tuleva info koondamist ja kasutamist, kus vead võivad kaasa tuua olulisi tagajärgi.\nNäited ametikohtadest: Projektijuht, vanemanalüütik, kvaliteedijuht, haiglaõde, häirekeskuse dispetšer", "Töö nõuab peaaegu pidevat ja intensiivset keskendumist keerukate sisendite ning kiiresti muutuvate olukordade tingimustes.\nTöö toimub kõrge vastutuse ja riskitasemega keskkonnas ning eeldab püsivat tähelepanelikkust ja valvel olekut.\nNäited ametikohtadest: Juhtivinsener, operatiivjuht, riskianalüütik, finantsjuht, arst, päästja", "Töö nõuab pidevat ja intensiivset keskendumist, mitme sisendi samaaegset töötlemist ning ajakriitiliste otsuste tegemist.\nTöö toimub olukordades, kus vead ei ole lubatud ja otsuseid tuleb langetada reaalajas.\nNäited ametikohtadest: Kirurg, lennujuht, piloot"], factorDescription: "Hindab tööks vajalikku püsivat keskendumisvõimet, tähelepanelikkust, visuaalset fookust ja vaimse pingutuse intensiivsust, sealhulgas kõrge keskendumise perioodide kestust ja sagedust.", levelCodes: ["PV1", "PV2", "PV3", "PV4", "PV5", "PV6"] },
      { id: "fuusiline_ping", name: "Füüsiline pingutus",  nameEn: "Physical Effort", factorRatio: 70/240,  levelRatios: [12/70,23/70,35/70,47/70,58/70,1],       descriptions: ["Töö nõuab minimaalset füüsilist pingutust ja toimub peamiselt istuvas või seisvas asendis, hõlmates kergete esemete käsitsemist.\nAeg-ajalt tuleb tõsta kuni 5 kg raskuseid esemeid; tööasendid on tavapärased ja mugavad.\nNäited ametikohtadest: Tavapärases kontorikeskkonnas töötavad ametikohad", "Töö nõuab kerget füüsilist pingutust, mis hõlmab seismist, liikumist ja lihtsat esemete käsitsemist.\nLiikumine on sage ning töö käigus tuleb tõsta või kanda üle 5 kg raskuseid esemeid.\nNäited ametikohtadest: Poetöötaja, toitlustusasutuse või hotellitöötaja, puhastusteenindaja", "Töö nõuab mõõdukat füüsilist pingutust, mis hõlmab korduvaid liigutusi või ebamugavaid tööasendeid.\nTöö sisaldab regulaarselt raskete esemete tõstmist või käsitsemist ning manuaalselt juhitavata tööriistade kasutamist.\nNäited ametikohtadest: Laotöötaja, mehaanik, tehnik, maaler, õmbleja, maaler", "Töö nõuab sagedast tugevat füüsilist pingutust või pikalt kestvate füüsiliste ülesannete täitmist.\nTöö hõlmab korduvat väga raskete raskuste tõstmist, koormate lükkamist või tõmbamist ning töötamist piiratud liikumisruumiga keskkonnas.\nNäited ametikohtadest: Ehitustööline, tõstukijuht, kraanajuht, keevitaja, tööstuslik pesutöötaja", "Töö nõuab pidevat rasket füüsilist pingutust ning toimub nõudlikes või potentsiaalselt ohtlikes töötingimustes.\nTöö hõlmab regulaarselt üle 30 kg raskuste käsitsemist või sellega võrreldavat koormust ning intensiivset inimeste või seadmete füüsilist käsitsemist.\nNäited ametikohtadest: Kiirabitehnik, parameedik, hooldaja, rasketehnika mehaanik, raskete toodete laotöötaja", "Töö nõuab erakordset füüsilist pingutust vahetu ohu või äärmuslike töötingimuste korral.\nTöö eeldab ulatuslikku isikukaitsevahendite kasutamist ning hõlmab pääste-, tulekahju- või muu kõrge füüsilise koormusega reageerimistegevust.\nNäited ametikohtadest: Tuletõrjuja, päästja, sõjaväelane"], factorDescription: "Hindab tööks vajalikku füüsilist pingutust, jõudu, koordinatsiooni ja kehahoiu koormust, mis ületavad tavapärase istumise, seismise või kõndimise taseme. Arvesse võetakse ka korduvad liigutused ja käsitsitöö nõuded, mida sageli alahinnatakse sooliselt kujunenud ametites.", levelCodes: ["PF1", "PF2", "PF3", "PF4", "PF5", "PF6"] },
      { id: "emotsionaalne",  name: "Emotsionaalne pingutus", nameEn: "Emotional Effort", factorRatio: 50/240, levelRatios: [8/50,17/50,25/50,33/50,42/50,1],    descriptions: ["Töö nõuab viisakat ja sõbralikku suhtlemist tavapärastes olukordades, ilma kokkupuuteta pingeliste või keeruliste olukordadega.\nHarva tuleb suhelda ärritunud inimestega ning sellistel juhtudel on olukord madala pingega.\nNäited ametikohtadest: Tavapärases kontorikeskkonnas töötavad ametikohad, kes suhtlevad eelkõige oma kolleegidega", "Töö nõuab aeg-ajalt keerukate suhtlusolukordadega toimetulekut, mis eeldab rahulikuks jäämist ja taktitunnet.\nTöö hõlmab lihtsamate kaebuste lahendamist ning konflikte esineb üldiselt vähe.\nNäited ametikohtadest: Klienditeenindaja, sekretär, klienditoe spetsialist, müügitöötaja, ettekandja, vastuvõtutöötaja", "Töö nõuab regulaarset toimetulekut pingeliste, konfliktsete või keeruliste olukordade ja osapooltega.\nTöö hõlmab olukordade rahustamist ning haavatavate või abivajavate inimestega suhtlemist ja toetamist.\nNäited ametikohtadest: Õpetaja, sotsiaaltöötaja, personalispetsialist, teenindusjuht, politseiametnik", "Töö nõuab sagedast toimetulekut suure pingega olukordades, kus tuleb tegutseda tundlike teemadega.\nTöö hõlmab agressiooni, trauma või leinaga tegelemist ning tehtavad otsused mõjutavad otseselt inimeste heaolu.\nNäited ametikohtadest: Haiglaõde, operatiivpolitseinik, psühholoog, kriisinõustaja, lastekaitsetöötaja, erivajadustega laste õpetaja", "Töö nõuab pikaajalist toimetulekut traumaatiliste või emotsionaalselt väga raskete olukordadega.\nTöö eeldab pidevat eneseregulatsiooni ning ilma toe või järelevalveta kaasneb sellega suur läbipõlemise oht.\nNäited ametikohtadest: Kiirabitehnik, psühhiaater, vanglaametnik, lähisuhtevägivalla nõustaja, ohvriabi töötaja", "Töö nõuab pidevat toimetulekut kriitiliste juhtumite või korduva traumaga kokkupuutumisega.\nTöö eeldab regulaarset juhendamist ja järelarutelusid ning sellega kaasneb kõrge teisese trauma risk.\nNäited ametikohtadest: Päästja, traumakirurg, katastroofipsühholoog, kriisiohjamiskeskuse juht"], factorDescription: "Hindab kokkupuudet emotsionaalselt pingeliste olukordadega ning pidevat eneseregulatsiooni, mida need nõuavad (nt kriisis kliendid, elulõpuhooldus, konfliktide leevendamine), tunnistades läbipõlemise riski piisava toe või järelevalve puudumisel.", levelCodes: ["PE1", "PE2", "PE3", "PE4", "PE5", "PE6"] },
    ],
  },
  {
    id: "vastutus", name: "Vastutus", nameEn: "Responsibility", color: "#6b1a1a",
    minWeight: 25, maxWeight: 40, defaultWeight: 33,
    description: "Tundliku info (nt töötajate kohta käiv teave, ärisaladused, koondamised) konfidentsiaalsuse tagamine.\n\nOtsuste tegemine olukordades, kus puuduvad selged juhised ja kus eksimustel võivad olla pikaajalised tagajärjed.\n\nKoosolekute ja konverentside logistika korraldamine.\n\nEakate hooldamine ja laste õpetamine, uute töötajate väljaõpe ja juhendamine.\n\nVastutus teiste inimeste turvalisuse, heaolu või arenguvõimaluste eest, ka ilma ametliku juhistaatuseta.\n\nTöö koordineerimine; ajakavade, protsesside ja varude haldus.\n\nVastutus organisatsiooni maine ja usaldusväärsuse eest klientide, patsientide või avalikkuse ees.",
    factors: [
      { id: "otsused",   name: "Vastutus otsuste eest",    nameEn: "Decision Responsibility",   factorRatio: 140/330, levelRatios: [23/140,47/140,70/140,93/140,117/140,1], descriptions: ["Otsused mõjutavad peamiselt enda tööülesandeid ning vead on hõlpsasti parandatavad, põhjustades vähe häireid.\nOtsustusõigus on piiratud ja mõju jääb oma otseste tööülesannete piiresse.\nNäited ametikohtadest: Assistent, klienditeenindaja, turvatöötaja, puhastusteenindaja, pakendaja", "Otsused on rutiinsed ja töökorralduslikud, mõjutades peamiselt enda ning lähikolleegide tööd ja omades väheseid tagajärgi.\nTöös järgitakse kindlaksmääratud protseduure ja juhiseid ning otsustel on mõju tiimi töövoole.\nNäited ametikohtadest: Klienditugi, sekretär, liinioperaator, tootmistööline, laotöötaja", "Otsustel on otsene mõju kohalikele eesmärkidele ning neid saab mõõta ressursi- või ajakulu kaudu.\nTöös on teatav otsustusvabadus ning otsuste tagajärjed ulatuvad üle erinevate ülesannete ja tiimide.\nNäited ametikohtadest: Erinevate valdkondade spetsialistid ja tiimijuhid, õpetaja, kliendihaldur, tootejuht", "Otsustel on oluline mõju üksuse, programmi, toote või teenuse tulemustele ning need kujundavad tegevuse või osakonna edasist suunda.\nTöö annab laia otsustusvabaduse kehtestatud põhimõtete raames ning otsustel võib olla mõju organisatsiooni mainele ja ohutusele.\nNäited ametikohtadest: Osakonnajuht, projektijuht, valdkonnajuht, tootmisjuht", "Otsustel on ulatuslik mõju suurele osale organisatsioonist ning nende tagajärgede parandamine võib olla kulukas.\nTöö eeldab vastandlike prioriteetide tasakaalustamist ning finantsiliste ja strateegiliste kompromisside tegemist.\nNäited ametikohtadest: Ärisuuna juht, divisjoni juht, direktor", "Otsused on strateegilised ja olulisi muutusi loovad, määrates organisatsiooni pikaajalise suuna ja riskivalmiduse.\nTegutsetakse kõrgeimal otsustus- või mõjutasandil, kus vead võivad ohustada organisatsiooni jätkusuutlikkust.\nNäited ametikohtadest: Tegevjuht, juhatuse liige, kantsler, meditsiinijuht, peadirektor"], factorDescription: "Hindab tehtud või oluliselt mõjutatud otsuste ulatust ja tagajärgi – sealhulgas nende pööratavust, parandamiseks vajalikku kulu ja pingutust ning mõju eesmärkidele, ohutusele, mainele või vastavusele nõuetele.", levelCodes: ["VO1", "VO2", "VO3", "VO4", "VO5", "VO6"] },
      { id: "inimesed",  name: "Vastutus inimeste eest",   nameEn: "Responsibility for People", factorRatio: 110/330, levelRatios: [18/110,37/110,55/110,73/110,92/110,1],  descriptions: ["Töö on valdavalt iseseisev ning sisaldab vajaduspõhiselt nõu või toetuse pakkumist teistele.\nOtsest juhtimisvastutust ei ole. Teadmiste jagamine kolleegidele toimub aeg-ajalt ja mitteametlikult.\nNäited ametikohtadest: Erinevad tugitööd, assistent, koordinaator, abiõpetaja, liinioperaator", "Töö hõlmab kolleegide juhendamist, väljaõpet või nõustamist ilma otsese alluvussuhteta.\nMõju on nõuandev – erialased teadmised ja kogemused aitavad suunata teiste tööülesandeid.\nNäited ametikohtadest: Spetsialistid, eksperdid, personalispetsialist, õde, õpetaja", "Töö eeldab väikese tiimi või projektitiimi otsest juhtimist, töö planeerimist, ülesannete jaotamist ning tulemuste kontrolli. Juht vastutab tiimi tulemuste ja soorituse eest.\nSama tase võib esineda ka rollides, kus otsest alluvussuhet ei ole, kuid kus töötaja juhib sisuliselt valdkonda, nõustab juhte või tiime ning vastutab oma valdkonna lahenduste kvaliteedi ja tulemuste eest.\nNäited ametikohtadest: Tiimijuhid, projektijuhtid, teenindusjuht, vahetuse vanem, personalipartner", "Töö hõlmab suure tiimi või mitme üksuse juhtimist, vastutades nende arengu ja tulemuste eest.\nJuht kujundab tööprotsesse ja -standardeid ning tagab koostöö teiste üksustega.\nNäited ametikohtadest: Mitme tiimiga osakonna juhid, tootmisjuht", "Töö eeldab mitme tiimi või osakonna juhtimist läbi alluvate juhtide.\nJuht määrab struktuurid ja põhimõtted ning tema otsused mõjutavad töötajate heaolu, tootlikkust ja püsimist organisatsioonis.\nNäited ametikohtadest: Osakondade ja divisjonijuhid, piirkonnajuht, tarneahela juht, programmidirektor, kliiniku juht", "Töö hõlmab kogu organisatsiooni tööjõu juhtimist ja vastutust strateegilisel, juhtkonna tasandil.\nJuht vastutab organisatsioonikultuuri ja töövõimekuse kujundamise eest.\nNäited ametikohtadest: Tegevjuht, personalijuht, peadirektor, kantsler"], factorDescription: "Hindab vastutust teiste juhendamise, koordineerimise, mentorluse, arendamise, järelevalve või juhtimise eest, arvestades nii ametlikku alluvussuhet kui ka mitteametlikku mõju üksikisikute, tiimide või funktsioonide tasandil.", levelCodes: ["VI1", "VI2", "VI3", "VI4", "VI5", "VI6"] },
      { id: "ressursid", name: "Vastutus ressursside eest",nameEn: "Resource Responsibility",   factorRatio: 80/330,  levelRatios: [13/80,27/80,40/80,53/80,67/80,1],      descriptions: ["Töö eeldab tavapäraste töövahendite, seadmete või andmete kasutamist, mille väärtus on väike ja väärkasutuse risk madal.\nOtsustusõigus ressursside kasutamisel on piiratud.\nNäited ametikohtadest: Assistent, kõnekeskuse töötaja", "Töö hõlmab varade või väikese rahaliste väärtusega vahendite igapäevast käsitlemist ning tavalist ligipääsu andmetele.\nVead põhjustavad ebamugavusi või vähese rahalise kahju.\nNäited ametikohtadest: Klienditeenindaja, spetsialistid, laotöötaja, tootmistööline", "Töö eeldab vastutust väärtusliku varustuse, vahendite, andmekogumite või mõõduka eelarve kasutamise eest.\nTöö nõuab teadlikkust vigade vältimiseks, kuna väärkasutusel on märgatav rahaline mõju.\nNäited ametikohtadest: IT-administraator, raamatupidaja, tiimijuht", "Töö hõlmab olulist vastutust finants-, andme- või materiaalse vara kasutamise ja järelevalve eest, sealhulgas teiste juhendamist nende kasutamisel.\nOtsustel on mõju töö efektiivsusele ja organisatsiooni riskitasemele.\nNäited ametikohtadest: Hankespetsialist, osakonna juht", "Töö hõlmab ulatuslikku vastutust organisatsiooni poliitikate ja süsteemide eest, mis juhivad olulisi ressursse.\nOtsustel on mõju suurtele eelarvetele või tundlikele ja konfidentsiaalsetele andmetele.\nNäited ametikohtadest: Personalijuht, tootmisjuht, ärisuuna juht", "Töö eeldab strateegilist kontrolli kõrge väärtuse ja riskitasemega ressursside üle kogu organisatsioonis.\nVead võivad põhjustada tõsiseid õiguslikke, rahalisi või mainekahjusid.\nNäited ametikohtadest: Tegevjuht, finantsjuht, IT juht, tarneahela juht"], factorDescription: "Hindab vastutust finants-, materiaalse ja teabevara kasutamise, kaitsmise, poliitikate ja protseduuride kujundamise, järelevalve ning riskijuhtimise (sh konfidentsiaalsuse ja regulatiivsete riskide) eest, kas otsese kontrolli või otsustava mõju kaudu.", levelCodes: ["VR1", "VR2", "VR3", "VR4", "VR5", "VR6"] },
    ],
  },
  {
    id: "tootingimused", name: "Töötingimused", nameEn: "Working Conditions", color: "#4a3728",
    minWeight: 5, maxWeight: 15, defaultWeight: 10,
    description: "Müra ja rahvarohkuse tekitatud stress.\n\nKokku puutumine haiguste ja nakkustega.\n\nTöö keskkondades, kus privaatsus ja taastumisvõimalused on piiratud.\n\nKlientide kaebustest või pingelistest teenindussituatsioonidest tulenev stress.\n\nMonotoonsed ülesanded, ebaregulaarsed tööajad, öötöö.\n\nMitmekesised ja ettearvamatud tööülesanded.\n\nPiiratud võimalus tööpäeva jooksul pause teha või töötempot reguleerida.\n\nKokkupuude kahjulike ainetega (nt puhastusvahendid, kemikaalid) ning nende potentsiaalne mõju töötaja tervisele.",
    factors: [
      { id: "fuusiline_kesk",  name: "Füüsiline keskkond",      nameEn: "Physical Environment",     factorRatio: 0.5, levelRatios: [8/50,17/50,25/50,33/50,42/50,1], descriptions: ["Töö toimub kontrollitud ja madala riskitasemega turvalises keskkonnas.\nTöökoht on tavaliselt kontoris ning ebasoodsad tingimused on minimaalsed.\nNäited ametikohtadest: Tavapärases kontorikeskkonnas töötavad ametikohad", "Töö toimub üldiselt ohutus keskkonnas, kuid võib aeg-ajalt hõlmata kokkupuudet väheste ebamugavate teguritega või madala riskitasemega olukordadega.\nKeskkonnas võib esineda müra, tolmu või kergete esemete tõstmist.\nNäited ametikohtadest: Jaekaubanduse töötaja, klienditeenindaja, vastuvõtutöötaja", "Töö hõlmab regulaarset kokkupuudet ebamugavust tekitavate tingimustega.\nKeskkonnas võib esineda temperatuurikõikumisi, mõõdukat müra või ohutuid kemikaale.\nNäited ametikohtadest: Laotöötaja, laborant, tehnik", "Töö eeldab sagedast kokkupuudet tingimustega, mis kujutavad endast mõõdukat tervise- või ohutusrisk​i, kus kaitsemeetmed vähendavad, kuid ei välista kokkupuudet täielikult.\nTöö võib hõlmata müra, heitgaase, kemikaale, jahedas töötamist või osaliselt kontrollimatuid tegureid ning nõuab sageli isikukaitsevahendite kasutamist.\nNäited ametikohtadest: Ehitustööline, tootmistöötaja, haiglatöötaja", "Töö nõuab väga sagedast kokkupuudet ohtlike tingimustega, kus kaitsemeetmetest hoolimata jääb alles märkimisväärne risk.\nTöö eeldab ulatuslike isikukaitsevahendite kasutamist ning juhtumitel võivad olla tõsised tagajärjed.\nNäited ametikohtadest: Rasketööstuse operaator, keevitaja välitööde hooldustehnik äärmuslikes ilmastikutingimustes", "Töö nõuab pikaajalist või pidevat tegutsemist kõrge ohutasemega keskkonnas, kus esineb kriitiline turva- või terviserisk.\nTöö eeldab rangete ohutusprotseduuride järgimist ja pidevat valmisolekut võimalike ohuolukordade ennetamiseks.\nNäited ametikohtadest: Keemiatehase operaator, tuletõrjuja"], factorDescription: "Hindab kokkupuudet ebamugavate või ohtlike töötingimustega (nt müra ja vibratsioon, kemikaalid, tolm, äärmuslikud temperatuurid, ebasoodsad ilmastikuolud) ning seda, mil määral saab riske maandada.", levelCodes: ["TF1", "TF2", "TF3", "TF4", "TF5", "TF6"] },
      { id: "psyhholoogiline", name: "Psühholoogiline keskkond",nameEn: "Psychological Environment",factorRatio: 0.5, levelRatios: [8/50,17/50,25/50,33/50,42/50,1], descriptions: ["Töö toimub stabiilses ja madala pingetasemega keskkonnas, kus töökoormus on etteaimatav.\nÜlesanded on rutiinsed, tähtajad etteplaneeritavad ja realistlikud ning ennustamatuid stressitegureid on vähe.\nNäited ametikohtadest: Tavapärases kontorikeskkonnas töötavad ametikohad", "Töö hõlmab aeg-ajalt katkestusi, mõõdukat pinget või regulaarseid lühiajalisi tähtaegade surveid.\nTöökoormus võib ajutiselt suureneda ning aeg-ajalt esineb keerukamaid suhtlusolukordi.\nNäited ametikohtadest: Kõnekeskuse töötaja, raamatupidaja", "Töö eeldab toimetulekut vastuoluliste prioriteetide, emotsionaalselt pingeliste olukordade ja vahelduva töötempoga.\nTöö sisaldab mõõdukat stressitaset, mis nõuab professionaalset hoiakut. Töö tulemused mõjutavad teiste inimeste tulemusi ja heaolu.\nNäited ametikohtadest: Klienditeenindaja, õpetaja, personalitöötaja", "Töö hõlmab sagedast tegutsemist kõrge pingetasemega olukordades või kokkupuudet emotsionaalselt raskete teemadega.\nTöö eeldab püsivat vastupidavust, vaimset tugevust ning sagedast toimetulekut vastuoluliste tähtaegadega.\nNäited ametikohtadest: Sotsiaaltöötaja, erakorralise meditsiini osakonna töötaja, politseiametnik", "Töö nõuab pikaajalist toimetulekut tugeva psühholoogilise pinge või vaenuliku töökeskkonnaga.\nTöö eeldab pidevat eneseregulatsiooni ning ilma toe ja järelevalveta kaasneb sellega märkimisväärne läbipõlemise oht.\nNäited ametikohtadest: Intensiivravi õde, kriisitelefoni nõustaja, lastekaitsetöötaja", "Töö eeldab pidevat kokkupuudet äärmusliku psühholoogilise pinge või kestva vaenulikkusega olukordades, kus tagajärjed võivad olla kriitilised.\nTöö nõuab struktureeritud järelevalvet ja järelanalüüse ning ilma toetavate meetmeteta kaasneb kõrge vaimse kahju risk.\nNäited ametikohtadest: Kriisinõustaja, missioonil sõjaväelane"], factorDescription: "Hindab stressitegurite sagedust ja intensiivsust (nt vastuolulised nõudmised, vaenulikud või pinges osapooled, eraldatus, ebaühtlane töötempo) ning nendest tulenevat pinget ja mõju töö- ja eraelu tasakaalule.", levelCodes: ["TP1", "TP2", "TP3", "TP4", "TP5", "TP6"] },
    ],
  },
];

// Grade thresholds are computed dynamically from scale type
// Linear: equal-width bands. Geometric: each band ~1.45x wider than previous.
function computeGradeThresholds(scaleType: string, numGrades: number = 6, geoRatio: number = 1.1) {
  if (scaleType === "geometric") {
    // Start at 163 (theoretical minimum score — all factors at L1)
    // First band width = 163 * (ratio - 1), so PA1 max = 163 * ratio
    // Each subsequent band *= ratio. Number of grades emerges from ratio.
    const MIN_SCORE = 163;
    const thresholds = [];
    let cur = MIN_SCORE;
    let grade = 0;
    let width = MIN_SCORE * (geoRatio - 1);
    while (cur <= 1000) {
      grade++;
      const mn = cur;
      const nextStart = cur + Math.round(width);
      const mx = nextStart > 1000 ? 1000 : nextStart - 1;
      thresholds.push({ grade, min: mn, max: mx, label: "PA" + grade });
      if (mx >= 1000) break;
      cur = nextStart;
      width *= geoRatio;
    }
    return thresholds;
  }
  // Linear: equal bands
  const labels = ["PA1","PA2","PA3","PA4","PA5","PA6","PA7","PA8","PA9","PA10"].slice(0, numGrades);
  const bandSize = Math.floor(1000 / numGrades);
  return Array.from({ length: numGrades }, (_, i) => ({
    grade: i + 1,
    min: i * bandSize,
    max: i === numGrades - 1 ? 1000 : (i + 1) * bandSize - 1,
    label: labels[i],
  }));
}
const GRADE_COLORS = { 1:"#7a9e7e",2:"#5b8ca8",3:"#8a6a3a",4:"#6b4a8a",5:"#8a3a3a",6:"#3a6a5a",7:"#4a7a6a",8:"#7a5a2a",9:"#3a5a8a",10:"#6a3a6a",11:"#5a7a3a",12:"#8a4a5a",13:"#3a7a7a",14:"#7a6a3a",15:"#4a4a8a",16:"#6a5a3a",17:"#3a6a4a",18:"#8a5a3a",19:"#5a3a7a",20:"#4a6a5a" };

const SESSION_KEY = "job-eval-session-v1";

function loadSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch { return null; }
}

function saveSession(data: any) {
  try { localStorage.setItem(SESSION_KEY, JSON.stringify(data)); } catch {}
}

function getDefaultWeights() {
  return Object.fromEntries(BASE_GROUPS.map(g => [g.id, g.defaultWeight]));
}

function getGrade(total: number, thresholds: {grade:number,min:number,max:number,label:string}[]) {
  return (thresholds || computeGradeThresholds("linear")).find(g => total >= g.min && total <= g.max);
}

// Derive fully computed groups from base + weights
// selections store level indices (0-5)
function computeGroups(baseGroups: typeof BASE_GROUPS, weights: any) {
  return baseGroups.map(g => {
    const w = weights[g.id] ?? g.defaultWeight;
    const groupMax = w * 10; // weight% * 10 = max points (100% = 1000pts)
    return {
      ...g,
      weight: w,
      maxPoints: groupMax,
      factors: g.factors.map((f, fi) => {
        const fMax = Math.round(f.factorRatio * groupMax);
        const levels = f.levelRatios.map(r => Math.round(r * fMax));
        return {
          ...f,
          maxPoints: fMax,
          levels,
          descriptions: f.descriptions,
          factorDescription: f.factorDescription ?? "",
        };
      }),
    };
  });
}

// Recompute a saved job's points from its stored level indices using current groups
function recomputeJob(job: any, groups: any, gradeThresholds: any) {
  let total = 0;
  const groupBreakdown = groups.map(g => {
    let groupEarned = 0;
    const factors = g.factors.map(f => {
      const li = job.levelSelections?.[f.id] ?? 0;
      const pts = f.levels[li] ?? 0;
      groupEarned += pts;
      total += pts;
      return { name: f.name, points: pts, maxPoints: f.maxPoints, level: li + 1, levelCode: f.levelCodes?.[li] ?? `T${li + 1}` };
    });
    return { name: g.name, color: g.color, maxPoints: g.maxPoints, earned: groupEarned, factors };
  });
  const gradeObj = getGrade(total, gradeThresholds);
  return { ...job, totalPoints: total, grade: gradeObj?.label, gradeNum: gradeObj?.grade, groupBreakdown };
}

function MiniBar({ value, max = 1000, color = "#1c2b3a" }: { value: number; max?: number; color?: string }) {
  return (
    <div style={{ flex: 1, height: 5, background: "#ede8e0", borderRadius: 3, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${Math.min(100, (value/max)*100)}%`, background: color, borderRadius: 3 }} />
    </div>
  );
}

export default function JobEvaluationTool() {
  const [weights, setWeights] = useState(() => {
    const s = loadSession(); return s?.weights ?? getDefaultWeights();
  });

  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState(() => {
    const s = loadSession(); return s?.companyName ?? "";
  });
  const [evalDate, setEvalDate] = useState(() => new Date().toISOString().split("T")[0]);
  // selections: { factorId: levelIndex (0-5) }
  const [selections, setSelections] = useState({});
  const [activeTab, setActiveTab] = useState("evaluate");

  const [lang, setLang] = useState(() => {
    const s = loadSession(); return s?.lang ?? "et";
  });
  const [savedJobs, setSavedJobs] = useState(() => {
    const s = loadSession(); return s?.savedJobs ?? [];
  });
  const [expandedJob, setExpandedJob] = useState(null);
  const [editingJobId, setEditingJobId] = useState(null);
  const [openGroupDescs, setOpenGroupDescs] = useState({});
  const [openFactorDescs, setOpenFactorDescs] = useState({});
  const [importError, setImportError] = useState(null);
  const [justSaved, setJustSaved] = useState(false);
  const [scaleType, setScaleType] = useState(() => { const s = loadSession(); return s?.scaleType ?? "linear"; });
  const [linearNumGrades, setLinearNumGrades] = useState(() => { const s = loadSession(); return s?.linearNumGrades ?? 6; });
  const [geoRatio, setGeoRatio] = useState(() => { const s = loadSession(); return s?.geoRatio ?? 1.1; });
  const gradeThresholds = useMemo(() => computeGradeThresholds(scaleType, linearNumGrades, geoRatio), [scaleType, linearNumGrades, geoRatio]);

  // Recompute saved job grades when scale type changes
  useEffect(() => {
    setSavedJobs(prev => prev.map(job => {
      const g = getGrade(job.totalPoints, gradeThresholds);
      return { ...job, grade: g?.label, gradeNum: g?.grade };
    }));
  }, [scaleType, linearNumGrades, geoRatio]); // eslint-disable-line
  const fileInputRef = useRef(null);
  const [evaluatorName, setEvaluatorName] = useState(() => { const s = loadSession(); return s?.evaluatorName ?? ""; });
  const [jobComment, setJobComment] = useState("");

  const t = (et, en) => lang === "et" ? et : en;

  // Auto-save to localStorage whenever key state changes
  useEffect(() => {
    saveSession({ savedJobs, weights, companyName, lang, evaluatorName, scaleType, linearNumGrades, geoRatio });
  }, [savedJobs, weights, companyName, lang, evaluatorName, scaleType, linearNumGrades, geoRatio]);

  function exportSession() {
    const session = { savedJobs, weights, companyName, lang, evaluatorName, scaleType, linearNumGrades, geoRatio, exportedAt: new Date().toISOString(), version: 1 };
    const blob = new Blob([JSON.stringify(session, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `hindamine-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2000);
  }

  function importSession(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target!.result as string);
        if (!data.version || !Array.isArray(data.savedJobs)) throw new Error("invalid");
        if (data.weights) setWeights(data.weights);

        if (data.companyName) setCompanyName(data.companyName);
        if (data.lang) setLang(data.lang);
        if (data.evaluatorName) setEvaluatorName(data.evaluatorName);
        if (data.scaleType) setScaleType(data.scaleType);
        if (data.linearNumGrades) setLinearNumGrades(data.linearNumGrades);
        if (data.geoRatio) setGeoRatio(data.geoRatio);
        // Recompute saved jobs with imported weights
        const importedGroups = computeGroups(BASE_GROUPS, data.weights ?? getDefaultWeights());
        setSavedJobs((data.savedJobs ?? []).map(job => recomputeJob(job, importedGroups, computeGradeThresholds(data.scaleType ?? 'linear', data.linearNumGrades ?? 6, data.geoRatio ?? 1.1))));
        clearForm();
        setImportError(null);
      } catch {
        setImportError(lang === "et" ? "Vigane fail — import ebaõnnestus." : "Invalid file — import failed.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  function clearSession() {
    if (!window.confirm(lang === "et" ? "Kustuta kõik andmed ja alusta otsast? Seda ei saa tagasi võtta." : "Clear all data and start fresh? This cannot be undone.")) return;
    setWeights(getDefaultWeights());

    setCompanyName("");
    setEvaluatorName("");
    setSavedJobs([]);
    clearForm();
    try { localStorage.removeItem(SESSION_KEY); } catch {}
  }

  // All computed groups (reactive to weights + desc overrides)
  const factorGroups = useMemo(() => computeGroups(BASE_GROUPS, weights), [weights]);

  // Current form: compute point totals from level index selections
  const totalPoints = useMemo(() => {
    return factorGroups.reduce((sum, g) =>
      sum + g.factors.reduce((s, f) => {
        const li = selections[f.id];
        return s + (li !== undefined ? (f.levels[li] ?? 0) : 0);
      }, 0), 0);
  }, [selections, factorGroups]);

  const grade = getGrade(totalPoints, gradeThresholds);
  const progressPct = Math.round((totalPoints / 1000) * 100);

  const groupTotals = factorGroups.map(g => ({
    ...g,
    earned: g.factors.reduce((s, f) => s + (selections[f.id] !== undefined ? (f.levels[selections[f.id]] ?? 0) : 0), 0),
    allSelected: g.factors.every(f => selections[f.id] !== undefined),
  }));

  const allSelected = factorGroups.every(g => g.factors.every(f => selections[f.id] !== undefined));

  function handleSelect(factorId, levelIndex) {
    setSelections(prev => ({ ...prev, [factorId]: levelIndex }));
  }

  function buildJobSnapshot(id) {
    const gradeObj = getGrade(totalPoints, gradeThresholds);
    return {
      id: id ?? Date.now(),
      jobTitle, companyName, evalDate, evaluatorName,
      comment: jobComment,
      totalPoints,
      grade: gradeObj?.label,
      gradeNum: gradeObj?.grade,
      levelSelections: { ...selections }, // store indices
      groupBreakdown: factorGroups.map(g => ({
        name: g.name, color: g.color, maxPoints: g.maxPoints,
        earned: g.factors.reduce((s, f) => s + (selections[f.id] !== undefined ? (f.levels[selections[f.id]] ?? 0) : 0), 0),
        factors: g.factors.map(f => ({
          name: f.name,
          points: selections[f.id] !== undefined ? f.levels[selections[f.id]] : 0,
          maxPoints: f.maxPoints,
          level: (selections[f.id] ?? 0) + 1,
          levelCode: f.levelCodes?.[(selections[f.id] ?? 0)] ?? `T${(selections[f.id] ?? 0) + 1}`,
        })),
      })),
    };
  }

  function clearForm() {
    setSelections({});
    setJobTitle("");
    setEvalDate(new Date().toISOString().split("T")[0]);
    setEditingJobId(null);
    setJobComment("");
  }

  function saveAndNext() {
    if (!allSelected) return;
    setSavedJobs(prev => [...prev, buildJobSnapshot(null)]);
    clearForm();
  }

  function saveEdits() {
    if (!allSelected) return;
    setSavedJobs(prev => prev.map(j => j.id === editingJobId ? buildJobSnapshot(editingJobId) : j));
    clearForm();
  }

  function loadJobForEditing(job) {
    setJobTitle(job.jobTitle);
    setCompanyName(job.companyName);
    setEvalDate(job.evalDate);
    setSelections(job.levelSelections ?? {});
    setJobComment(job.comment ?? "");
    setEditingJobId(job.id);
    setExpandedJob(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function removeJob(id) {
    setSavedJobs(prev => prev.filter(j => j.id !== id));
    if (expandedJob === id) setExpandedJob(null);
    if (editingJobId === id) clearForm();
  }

  // When weights change: update factorGroups (via state) AND recompute all saved jobs
  function handleWeightChange(groupId, newWeight) {
    const newWeights = { ...weights, [groupId]: newWeight };
    setWeights(newWeights);
    if (savedJobs.length > 0) {
      const newGroups = computeGroups(BASE_GROUPS, newWeights);
      setSavedJobs(prev => prev.map(job => recomputeJob(job, newGroups, gradeThresholds)));
    }
  }

  function resetWeights() {
    const defaults = Object.fromEntries(BASE_GROUPS.map(g => [g.id, g.defaultWeight]));
    setWeights(defaults);
    if (savedJobs.length > 0) {
      const newGroups = computeGroups(BASE_GROUPS, defaults);
      setSavedJobs(prev => prev.map(job => recomputeJob(job, newGroups, gradeThresholds)));
    }
  }





  function toggleGroupDesc(groupId) {
    setOpenGroupDescs(prev => ({ ...prev, [groupId]: !prev[groupId] }));
  }
  function toggleFactorDesc(factorId) {
    setOpenFactorDescs(prev => ({ ...prev, [factorId]: !prev[factorId] }));
  }

  function exportAllCSV() {
    if (savedJobs.length === 0) return;
    const allFactors = factorGroups.flatMap(g => g.factors);
    const header = ["Company","Date","Job Title","Total Points","Grade",
      ...allFactors.map(f => `${f.name} (pts)`),
      ...allFactors.map(f => `${f.name} (level)`)];
    const rows = [header, ...savedJobs.map(job => {
      const pts = job.groupBreakdown.flatMap(g => g.factors.map(f => f.points ?? "—"));
      const lvls = job.groupBreakdown.flatMap(g => g.factors.map(f => f.level ?? "—"));
      return [job.companyName, job.evalDate, job.jobTitle, job.totalPoints, job.grade, ...pts, ...lvls];
    })];
    const csv = rows.map(r => r.map(c => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `job-evaluations-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
  }

  // ── PDF EXPORT ──
  async function loadJsPDF() {
    if ((window as any).jspdf) return (window as any).jspdf.jsPDF;
    return new Promise<any>((resolve, reject) => {
      const s = document.createElement("script");
      s.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
      s.onload = () => resolve((window as any).jspdf.jsPDF);
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  async function exportPDF(jobsToExport) {
    const JsPDF = await loadJsPDF();
    const doc = new JsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const W = 210; const MARGIN = 18; const CW = W - MARGIN * 2;
    const blue = [28, 43, 58]; const green = [154, 170, 138]; const light = [245, 240, 235];

    // helper: hex color string to [r,g,b]
    function hexRgb(hex) {
      const h = hex.replace("#","");
      return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)];
    }

    function drawBar(x, y, w, h, pct, color) {
      doc.setFillColor(230,224,215); doc.roundedRect(x, y, w, h, 1, 1, "F");
      if (pct > 0) {
        doc.setFillColor(...color);
        doc.roundedRect(x, y, Math.max(2, w * pct), h, 1, 1, "F");
      }
    }

    function addPageHeader(pageNum) {
      doc.setFillColor(...blue);
      doc.rect(0, 0, W, 14, "F");
      doc.setFontSize(7); doc.setTextColor(...green);
      doc.setFont("helvetica","normal");
      doc.text("TÖÖTASUDE VÕRDSUSTATAVUSE DIREKTIIV · TÖÖ HINDAMISE ARUANNE", MARGIN, 8.5);
      doc.text(`${new Date().toLocaleDateString("et-EE")}`, W - MARGIN, 8.5, { align: "right" });
      doc.setTextColor(150,150,150);
      doc.text(`${pageNum}`, W/2, 8.5, { align: "center" });
    }

    let pageNum = 1;
    let y = 0;

    function newPage() {
      doc.addPage(); pageNum++;
      addPageHeader(pageNum); y = 22;
    }

    function checkY(needed) { if (y + needed > 278) newPage(); }

    // ── COVER / SUMMARY PAGE ──
    addPageHeader(pageNum);
    // Big header block
    doc.setFillColor(...light);
    doc.rect(MARGIN, 18, CW, 28, "F");
    doc.setFontSize(16); doc.setTextColor(...blue); doc.setFont("helvetica","bold");
    doc.text("Töö hindamise aruanne", MARGIN + 6, 30);
    doc.setFontSize(9); doc.setFont("helvetica","normal"); doc.setTextColor(80,80,80);
    const headerDetails = [
      companyName && `Ettevõte: ${companyName}`,
      evaluatorName && `Hindaja: ${evaluatorName}`,
      `Kuupäev: ${new Date().toLocaleDateString("et-EE")}`,
      `Ametikohti hinnatud: ${jobsToExport.length}`,
    ].filter(Boolean);
    headerDetails.forEach((d, i) => doc.text(d, MARGIN + 6, 37 + i * 5));

    y = 52;

    // Weight summary strip
    doc.setFillColor(...blue);
    doc.rect(MARGIN, y, CW, 6, "F");
    doc.setFontSize(6.5); doc.setTextColor(...green); doc.setFont("helvetica","bold");
    doc.text("FAKTORITE KAALUD", MARGIN + 2, y + 4.2);
    y += 9;
    factorGroups.forEach((g, gi) => {
      const [r,gb,b] = hexRgb(g.color);
      const colW = CW / factorGroups.length - 2;
      const x = MARGIN + gi * (colW + 2);
      doc.setFontSize(7); doc.setTextColor(r,gb,b); doc.setFont("helvetica","bold");
      doc.text(g.name, x, y);
      doc.setTextColor(80,80,80); doc.setFont("helvetica","normal");
      doc.text(`${g.weight}% · max ${g.maxPoints}p`, x, y + 4);
      drawBar(x, y + 6, colW, 3, g.weight / 100, [r,gb,b]);
    });
    y += 16;

    if (jobsToExport.length > 1) {
      // Summary comparison table
      doc.setFillColor(...blue);
      doc.rect(MARGIN, y, CW, 6, "F");
      doc.setFontSize(6.5); doc.setTextColor(...green); doc.setFont("helvetica","bold");
      doc.text("KOKKUVÕTE — KÕIK HINNATUD AMETIKOHAD", MARGIN + 2, y + 4.2);
      y += 8;

      const sorted = [...jobsToExport].sort((a,b) => b.totalPoints - a.totalPoints);
      const cols = [8, 70, 22, 22, CW - 8 - 70 - 22 - 22 - 4];
      const headers = ["#","Ametikoht","Punktid","Palgaaste","Skoor"];
      doc.setFontSize(7); doc.setFont("helvetica","bold"); doc.setTextColor(...blue);
      let cx = MARGIN;
      headers.forEach((h, i) => { doc.text(h, cx, y); cx += cols[i]; });
      y += 1;
      doc.setDrawColor(200,195,185); doc.setLineWidth(0.3);
      doc.line(MARGIN, y, MARGIN + CW, y); y += 3;

      sorted.forEach((job, i) => {
        checkY(8);
        const gc = hexRgb(GRADE_COLORS[job.gradeNum] || "#888888");
        const rowBg = i % 2 === 0;
        if (rowBg) { doc.setFillColor(250,248,245); doc.rect(MARGIN, y-3, CW, 7, "F"); }
        doc.setFontSize(7); doc.setFont("helvetica","normal"); doc.setTextColor(80,80,80);
        cx = MARGIN;
        doc.text(`${i+1}`, cx, y); cx += cols[0];
        doc.text((job.jobTitle || "—").slice(0,35), cx, y); cx += cols[1];
        doc.setFont("helvetica","bold"); doc.setTextColor(...blue);
        doc.text(`${job.totalPoints}`, cx, y); cx += cols[2];
        doc.setFillColor(...gc); doc.roundedRect(cx, y-3.5, 18, 5, 1.5, 1.5, "F");
        doc.setTextColor(255,255,255); doc.setFontSize(6.5);
        doc.text(job.grade || "—", cx + 9, y - 0.2, { align: "center" }); cx += cols[3];
        drawBar(cx, y - 3, cols[4], 4, job.totalPoints / 1000, hexRgb(GRADE_COLORS[job.gradeNum] || "#888888"));
        doc.setDrawColor(220,215,205); doc.line(MARGIN, y + 3.5, MARGIN + CW, y + 3.5);
        y += 8;
      });
    }

    // ── PER-JOB DETAIL PAGES ──
    jobsToExport.forEach((job) => {
      newPage();
      const gc = hexRgb(GRADE_COLORS[job.gradeNum] || "#888888");

      // Job header
      doc.setFillColor(...light); doc.rect(MARGIN, y, CW, 22, "F");
      doc.setFontSize(13); doc.setFont("helvetica","bold"); doc.setTextColor(...blue);
      doc.text(job.jobTitle || "—", MARGIN + 5, y + 8);
      doc.setFontSize(8); doc.setFont("helvetica","normal"); doc.setTextColor(100,100,100);
      const meta = [job.companyName, job.evalDate, job.evaluatorName && `Hindaja: ${job.evaluatorName}`].filter(Boolean).join("  ·  ");
      doc.text(meta, MARGIN + 5, y + 14);

      // Score badge
      doc.setFillColor(...gc); doc.roundedRect(MARGIN + CW - 36, y + 3, 34, 16, 3, 3, "F");
      doc.setFontSize(18); doc.setFont("helvetica","bold"); doc.setTextColor(255,255,255);
      doc.text(`${job.totalPoints}`, MARGIN + CW - 19, y + 13, { align: "center" });
      doc.setFontSize(7); doc.setFont("helvetica","normal");
      doc.text(job.grade || "", MARGIN + CW - 19, y + 18, { align: "center" });
      y += 26;

      // Overall bar
      doc.setFontSize(7); doc.setTextColor(120,120,120);
      doc.text(`${job.totalPoints} / 1000 punkti`, MARGIN, y);
      drawBar(MARGIN, y + 2, CW, 5, job.totalPoints / 1000, gc);
      y += 12;

      // Group breakdown
      job.groupBreakdown.forEach(g => {
        checkY(40);
        const gc2 = hexRgb(g.color);
        // Group header bar
        doc.setFillColor(...gc2);
        doc.rect(MARGIN, y, 3, 18 + g.factors.length * 8, "F");
        doc.setFontSize(8); doc.setFont("helvetica","bold"); doc.setTextColor(...gc2);
        doc.text(g.name, MARGIN + 6, y + 5);
        doc.setFontSize(7); doc.setFont("helvetica","normal"); doc.setTextColor(120,120,120);
        doc.text(`${g.earned} / ${g.maxPoints}p`, MARGIN + CW, y + 5, { align: "right" });
        drawBar(MARGIN + 6, y + 7, CW - 6, 3.5, g.earned / g.maxPoints, gc2);
        y += 14;

        // Factors
        g.factors.forEach(f => {
          checkY(9);
          doc.setFontSize(7); doc.setFont("helvetica","normal"); doc.setTextColor(60,60,60);
          doc.text(f.name.slice(0,42), MARGIN + 8, y);
          doc.setFont("helvetica","bold"); doc.setTextColor(...gc2);
          doc.text(`T${f.level}  ${f.points}p`, MARGIN + CW, y, { align: "right" });
          // Mini 6-segment level indicator
          const segW = 22; const segStart = MARGIN + CW - 24 - segW;
          for (let li = 0; li < 6; li++) {
            const sx = segStart + li * (segW/6 + 0.3);
            if (li < f.level) { doc.setFillColor(...gc2); } else { doc.setFillColor(220,215,205); }
            doc.rect(sx, y - 3.2, segW/6, 2.5, "F");
          }
          doc.setTextColor(150,150,150); doc.setFont("helvetica","normal");
          doc.text(`/ ${f.maxPoints}p`, MARGIN + CW, y + 4, { align: "right" });
          drawBar(MARGIN + 8, y + 1.5, segStart - MARGIN - 10, 2, f.points / f.maxPoints, gc2);
          y += 9;
        });
        y += 3;
      });

      // Comment
      if (job.comment?.trim()) {
        checkY(16);
        doc.setFillColor(248,246,242);
        doc.roundedRect(MARGIN, y, CW, 6, 1, 1, "F");
        doc.setFontSize(6.5); doc.setTextColor(...green); doc.setFont("helvetica","bold");
        doc.text("KOMMENTAAR", MARGIN + 3, y + 4); y += 8;
        doc.setFont("helvetica","normal"); doc.setTextColor(60,60,60); doc.setFontSize(8);
        const lines = doc.splitTextToSize(job.comment, CW - 4);
        lines.forEach(line => { checkY(6); doc.text(line, MARGIN + 2, y); y += 5.5; });
        y += 4;
      }
    });

    const filename = `toohinne-${companyName ? companyName.replace(/\s+/g,"-").toLowerCase() + "-" : ""}${new Date().toISOString().slice(0,10)}.pdf`;
    doc.save(filename);
  }

  const totalWeight = (Object.values(weights) as number[]).reduce((s, w) => s + w, 0);
  const weightsChanged = BASE_GROUPS.some(g => weights[g.id] !== g.defaultWeight);

  return (
    <div style={{ fontFamily: "'Georgia','Times New Roman',serif", minHeight: "100vh", background: "#f5f0eb", color: "#1c1c1c" }}>

      {/* HEADER */}
      <div style={{ background: "#1c2b3a", color: "#e8e0d4" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto", padding: "26px 28px 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
            <div>
              <div style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "#9aaa8a", marginBottom: 5, fontFamily: "sans-serif" }}>
                {t("Töö hindamise meetod","Job Evaluation Method")} · EU Pay Equity Directive
              </div>
              <h1 style={{ margin: 0, fontSize: 24, fontWeight: "normal" }}>{t("Tööde hindamise tööriist","Job Evaluation Tool")}</h1>
              <div style={{ fontSize: 11, color: "#607070", marginTop: 3, fontFamily: "sans-serif" }}>
                {t("Vastab Majandus- ja Kommunikatsiooniministeeriumi poolt projektis PALK väljatöötatud hindamismudelile.","Complies with the evaluation model developed by the Estonian Ministry of Economic Affairs in the PALK project.")}
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", justifyContent: "flex-end" }}>
              {/* Session controls */}
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <button onClick={exportSession}
                  style={{ padding: "5px 12px", background: justSaved?"#9aaa8a":"transparent", color: justSaved?"#1c2b3a":"#9aaa8a", border: "1px solid #9aaa8a", borderRadius: 3, cursor: "pointer", fontSize: 11, fontFamily: "sans-serif", transition: "all 0.3s", whiteSpace: "nowrap" }}>
                  {justSaved ? "✓ " : "↓ "}{t("Salvesta seanss","Save Session")}
                </button>
                <button onClick={() => fileInputRef.current?.click()}
                  style={{ padding: "5px 12px", background: "transparent", color: "#9aaa8a", border: "1px solid #9aaa8a", borderRadius: 3, cursor: "pointer", fontSize: 11, fontFamily: "sans-serif", whiteSpace: "nowrap" }}>
                  ↑ {t("Ava seanss","Open Session")}
                </button>
                <input ref={fileInputRef} type="file" accept=".json" onChange={importSession} style={{ display: "none" }} />
                {savedJobs.length > 0 && (
                  <button onClick={clearSession}
                    style={{ padding: "5px 10px", background: "transparent", color: "#8a6060", border: "1px solid #8a6060", borderRadius: 3, cursor: "pointer", fontSize: 11, fontFamily: "sans-serif" }}
                    title={t("Kustuta kõik andmed","Clear all data")}>✕</button>
                )}
              </div>
              <div style={{ width: 1, height: 18, background: "#2d3f50" }} />
              {/* Lang toggle */}
              <div style={{ display: "flex", gap: 4 }}>
                {["et","en"].map(l => (
                  <button key={l} onClick={() => setLang(l)}
                    style={{ padding: "4px 11px", background: lang===l?"#9aaa8a":"transparent", color: lang===l?"#1c2b3a":"#9aaa8a", border: "1px solid #9aaa8a", borderRadius: 3, cursor: "pointer", fontSize: 11, fontFamily: "sans-serif", textTransform: "uppercase" }}>{l}</button>
                ))}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", marginTop: 20, borderBottom: "1px solid #2d3f50" }}>
            {[
              { id: "evaluate",     label: t("Hindamine","Evaluate") },
              { id: "weights",      label: t("Faktorite kaalud","Factor Weights") + (weightsChanged ? " ●" : "") },
              { id: "descriptions", label: t("Tasemete kirjeldused","Level Descriptions") },
              { id: "grades",       label: t("Palgaastmed","Grade Scale") },
            ].map(tab => (
              <button key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{ padding: "9px 18px", background: "none", border: "none", borderBottom: activeTab===tab.id?"2px solid #9aaa8a":"2px solid transparent", color: activeTab===tab.id?"#e8e0d4":"#7a8a9a", cursor: "pointer", fontSize: 12, fontFamily: "sans-serif", letterSpacing: "0.04em", marginBottom: -1, whiteSpace: "nowrap" }}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Session status bar */}
      {importError && (
        <div style={{ background: "#fdf0ee", borderBottom: "1px solid #e0b0a0", padding: "8px 28px", fontSize: 12, fontFamily: "sans-serif", color: "#a04030", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>⚠ {importError}</span>
          <button onClick={() => setImportError(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#a04030", fontSize: 14 }}>×</button>
        </div>
      )}
      {savedJobs.length > 0 && (
        <div style={{ background: "#1c2b3a", borderBottom: "1px solid #2d3f50", padding: "5px 28px", fontSize: 10, fontFamily: "sans-serif", color: "#607070", display: "flex", gap: 16, alignItems: "center" }}>
          <span>💾 {t("Automaatselt salvestatud","Auto-saved")} · {savedJobs.length} {t("ametikohta","job(s)")}</span>
          <span style={{ color: "#3d5060" }}>|</span>
          <span>{t("Andmed säilivad selles brauseris","Data persists in this browser")} · {t("Ekspordi JSON-fail varundamiseks","Export JSON to back up or share")}</span>
        </div>
      )}
      <div style={{ maxWidth: 1140, margin: "0 auto", padding: "28px 28px" }}>

        {/* EVALUATE TAB */}
        {activeTab === "evaluate" && (
          <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
            {/* LEFT: form */}
            <div style={{ flex: "1 1 0", minWidth: 0 }}>
              {weightsChanged && (
                <div style={{ marginBottom: 14, padding: "8px 14px", background: "#fff8e6", border: "1px solid #e8d48a", borderRadius: 5, fontSize: 11, fontFamily: "sans-serif", color: "#7a6010", display: "flex", alignItems: "center", gap: 8 }}>
                  <span>⚖️</span>
                  <span>{t("Kasutatakse kohandatud faktorikaalusid.","Using custom factor weights.")} <button onClick={() => { setActiveTab("weights"); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#7a6010", textDecoration: "underline", fontSize: 11, fontFamily: "sans-serif", padding: 0 }}>{t("Vaata kaalusid →","View weights →")}</button></span>
                </div>
              )}
              {/* Meta fields */}
              <div style={{ display: "flex", gap: 12, marginBottom: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
                <div style={{ flex: "1 1 150px" }}>
                  <label style={{ display: "block", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "#777", fontFamily: "sans-serif", marginBottom: 4 }}>{t("Ettevõte","Company")}</label>
                  <input value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder={t("Ettevõtte nimi...","Company name...")}
                    style={{ width: "100%", padding: "8px 11px", border: "1px solid #c8bfb0", borderRadius: 4, fontSize: 13, fontFamily: "Georgia,serif", background: "#fff", boxSizing: "border-box" }} />
                </div>
                <div style={{ flex: "1 1 150px" }}>
                  <label style={{ display: "block", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "#777", fontFamily: "sans-serif", marginBottom: 4 }}>{t("Ametikoht","Job Title")}</label>
                  <input value={jobTitle} onChange={e => setJobTitle(e.target.value)} placeholder={t("Ametikoha nimetus...","Job title...")}
                    style={{ width: "100%", padding: "8px 11px", border: "1px solid #c8bfb0", borderRadius: 4, fontSize: 13, fontFamily: "Georgia,serif", background: "#fff", boxSizing: "border-box" }} />
                </div>
                <div style={{ flex: "1 1 150px" }}>
                  <label style={{ display: "block", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "#777", fontFamily: "sans-serif", marginBottom: 4 }}>{t("Hindaja","Evaluator")}</label>
                  <input value={evaluatorName} onChange={e => setEvaluatorName(e.target.value)} placeholder={t("Hindaja nimi...","Evaluator name...")}
                    style={{ width: "100%", padding: "8px 11px", border: "1px solid #c8bfb0", borderRadius: 4, fontSize: 13, fontFamily: "Georgia,serif", background: "#fff", boxSizing: "border-box" }} />
                </div>
                <div style={{ flex: "0 0 130px" }}>
                  <label style={{ display: "block", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "#777", fontFamily: "sans-serif", marginBottom: 4 }}>{t("Kuupäev","Date")}</label>
                  <input type="date" value={evalDate} onChange={e => setEvalDate(e.target.value)}
                    style={{ width: "100%", padding: "8px 11px", border: "1px solid #c8bfb0", borderRadius: 4, fontSize: 12, fontFamily: "sans-serif", background: "#fff", boxSizing: "border-box" }} />
                </div>
              </div>
              {/* Comment field */}
              <div style={{ marginBottom: 18 }}>
                <label style={{ display: "block", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "#777", fontFamily: "sans-serif", marginBottom: 4 }}>{t("Kommentaar","Comment")} <span style={{ textTransform: "none", letterSpacing: 0, color: "#bbb" }}>({t("valikuline","optional")})</span></label>
                <textarea value={jobComment} onChange={e => setJobComment(e.target.value)}
                  placeholder={t("Märkused, põhjendused, kontekst...","Notes, justifications, context...")}
                  rows={2}
                  style={{ width: "100%", padding: "8px 11px", border: "1px solid #c8bfb0", borderRadius: 4, fontSize: 12, fontFamily: "Georgia,serif", background: "#fff", boxSizing: "border-box", resize: "vertical", lineHeight: 1.5 }} />
              </div>

              {/* Live score bar */}
              <div style={{ background: "#fff", border: "1px solid #d8cfC0", borderRadius: 5, padding: "12px 16px", marginBottom: 20, display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap" }}>
                <div>
                  <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.12em", color: "#999", fontFamily: "sans-serif" }}>{t("Punktid","Points")}</div>
                  <div style={{ fontSize: 26, fontWeight: "bold", color: "#1c2b3a", lineHeight: 1.1 }}>{totalPoints} <span style={{ fontSize: 13, color: "#bbb", fontWeight: "normal" }}>/ 1000</span></div>
                </div>
                <div style={{ flex: 1, minWidth: 100 }}>
                  <div style={{ height: 6, background: "#ede8e0", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${progressPct}%`, background: "#1c2b3a", borderRadius: 3, transition: "width 0.3s" }} />
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.12em", color: "#999", fontFamily: "sans-serif" }}>{t("Palgaaste","Grade")}</div>
                  <div style={{ fontSize: 20, fontWeight: "bold", color: allSelected?"#1c2b3a":"#ccc" }}>{allSelected ? grade?.label : "—"}</div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  {groupTotals.map(g => (
                    <div key={g.id} style={{ textAlign: "center" }}>
                      <div style={{ width: 34, height: 34, borderRadius: "50%", background: g.allSelected?g.color:"#ede8e0", color: g.allSelected?"#fff":"#ccc", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: "bold", margin: "0 auto 2px", transition: "background 0.3s" }}>{g.earned}</div>
                      <div style={{ fontSize: 7, textTransform: "uppercase", letterSpacing: "0.1em", color: "#aaa", fontFamily: "sans-serif" }}>{g.name.slice(0,4)}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Factor groups */}
              {factorGroups.map(group => (
                <div key={group.id} style={{ marginBottom: 20 }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 9, paddingBottom: 6, borderBottom: `2px solid ${group.color}` }}>
                    <h2 style={{ margin: 0, fontSize: 15, fontWeight: "normal", color: group.color }}>{group.name}</h2>
                    <span style={{ fontSize: 10, color: "#bbb", fontFamily: "sans-serif" }}>{lang==="et"?group.nameEn:group.name}</span>
                    <span style={{ marginLeft: "auto", fontSize: 10, fontFamily: "sans-serif", color: "#999" }}>{group.weight}% · max {group.maxPoints}p</span>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {group.factors.map(factor => {
                      const selectedLi = selections[factor.id];
                      const selectedPts = selectedLi !== undefined ? factor.levels[selectedLi] : undefined;
                      return (
                        <div key={factor.id} style={{ background: "#fff", border: "1px solid #e0d8ce", borderRadius: 5, overflow: "hidden" }}>
                          <div style={{ padding: "8px 13px", background: selectedLi!==undefined?`${group.color}07`:"transparent", borderBottom: "1px solid #e0d8ce", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontSize: 12, fontWeight: "500" }}>{factor.name}</span>
                            <span style={{ fontSize: 10, fontFamily: "sans-serif", color: selectedLi!==undefined?group.color:"#ccc", fontWeight: selectedLi!==undefined?"bold":"normal" }}>
                              {selectedLi !== undefined ? `${selectedPts} / ${factor.maxPoints}p` : t("Valimata","—")}
                            </span>
                          </div>
                          {factor.factorDescription && (
                            <div>
                              <button onClick={() => toggleFactorDesc(factor.id)}
                                style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "none", cursor: "pointer", padding: "4px 13px", fontSize: 10, fontFamily: "sans-serif", color: "#999", width: "100%", textAlign: "left", borderBottom: "1px solid #e0d8ce" }}>
                                <span style={{ fontSize: 9, display: "inline-block", transform: openFactorDescs[factor.id] ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>&#9654;</span>
                                {openFactorDescs[factor.id] ? t("Peida kirjeldus","Hide description") : t("Näita kirjeldust","Show description")}
                              </button>
                              {openFactorDescs[factor.id] && (
                                <div style={{ padding: "10px 14px", background: `${group.color}06`, borderBottom: "1px solid #e0d8ce", fontSize: 11, color: "#555", lineHeight: 1.65, fontFamily: "Georgia,serif", fontStyle: "italic" }}>
                                  {factor.factorDescription}
                                </div>
                              )}
                            </div>
                          )}
                          <div style={{ display: "flex" }}>
                            {factor.levels.map((pts, li) => {
                              const isSel = selectedLi === li;
                              const hasDesc = factor.descriptions[li]?.trim().length > 0;
                              return (
                                <button key={li} onClick={() => handleSelect(factor.id, li)}
                                  title={hasDesc ? factor.descriptions[li].replace(/\\n/g, '\n') : `${t("Tase","Level")} ${li+1}: ${pts}p`}
                                  style={{ flex: 1, padding: "8px 2px", background: isSel?group.color:"transparent", border: "none", borderRight: li<5?"1px solid #e0d8ce":"none", cursor: "pointer", transition: "background 0.12s", display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                                  <span style={{ fontSize: 7, textTransform: "uppercase", letterSpacing: "0.08em", color: isSel?"rgba(255,255,255,0.7)":"#ccc", fontFamily: "sans-serif" }}>{factor.levelCodes?.[li] ?? `T${li+1}`}</span>
                                  <span style={{ fontSize: 12, fontWeight: "bold", color: isSel?"#fff":"#444" }}>{pts}</span>
                                  {hasDesc && <span style={{ width: 3, height: 3, borderRadius: "50%", background: isSel?"rgba(255,255,255,0.5)":group.color }} />}
                                </button>
                              );
                            })}
                          </div>
                          {selectedLi !== undefined && factor.descriptions[selectedLi]?.trim() && (
                            <div style={{ padding: "8px 13px", background: `${group.color}05`, borderTop: "1px solid #e0d8ce", fontSize: 11, color: "#555", lineHeight: 1.55 }}>
                              {factor.descriptions[selectedLi].split('\n').map((line, li2) =>
                                line.startsWith('Näited ametikohtadest:')
                                  ? <div key={li2} style={{ marginTop: 5, color: group.color, fontStyle: "normal", fontWeight: "500" }}>
                                      <span style={{ opacity: 0.7 }}>Näited: </span>
                                      <span style={{ fontWeight: "normal", color: "#555" }}>{line.replace('Näited ametikohtadest: ', '')}</span>
                                    </div>
                                  : <div key={li2} style={{ fontStyle: "italic" }}>{line}</div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Action buttons */}
              {editingJobId && (
                <div style={{ marginTop: 6, padding: "10px 14px", background: "#fffbe6", border: "1px solid #e8d88a", borderRadius: 5, fontSize: 11, fontFamily: "sans-serif", color: "#7a6010", display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 14 }}>✏️</span>
                  <span>{t("Muutad salvestatud ametikohta","Editing a saved job")} — <strong>{savedJobs.find(j=>j.id===editingJobId)?.jobTitle||"—"}</strong></span>
                  <button onClick={clearForm} style={{ marginLeft: "auto", padding: "3px 9px", background: "none", border: "1px solid #c8b860", borderRadius: 3, cursor: "pointer", fontSize: 10, color: "#7a6010" }}>{t("Tühista muutmine","Cancel edit")}</button>
                </div>
              )}
              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
                {!editingJobId && (
                  <button onClick={clearForm} style={{ padding: "9px 16px", background: "#fff", border: "1px solid #c8bfb0", borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: "sans-serif", color: "#666" }}>{t("Lähtesta","Reset")}</button>
                )}
                {editingJobId ? (
                  <button onClick={saveEdits} disabled={!allSelected}
                    style={{ padding: "9px 20px", background: allSelected?"#5a7a3a":"#ddd", border: "none", borderRadius: 4, cursor: allSelected?"pointer":"not-allowed", fontSize: 12, fontFamily: "sans-serif", color: allSelected?"#fff":"#aaa", fontWeight: "500" }}>
                    {t("Salvesta muudatused ✓","Save Changes ✓")}
                  </button>
                ) : (
                  <button onClick={saveAndNext} disabled={!allSelected}
                    style={{ padding: "9px 20px", background: allSelected?"#1c2b3a":"#ddd", border: "none", borderRadius: 4, cursor: allSelected?"pointer":"not-allowed", fontSize: 12, fontFamily: "sans-serif", color: allSelected?"#e8e0d4":"#aaa", fontWeight: "500" }}>
                    {t("Salvesta ja hinda järgmist →","Save & Evaluate Next →")}
                  </button>
                )}
              </div>
            </div>

            {/* RIGHT: saved jobs panel */}
            <div style={{ flex: "0 0 300px", minWidth: 260 }}>
              <div style={{ position: "sticky", top: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <div>
                    <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.14em", color: "#999", fontFamily: "sans-serif" }}>{t("Hinnatud ametikohad","Evaluated Jobs")}</div>
                    <div style={{ fontSize: 22, fontWeight: "bold", color: "#1c2b3a" }}>{savedJobs.length}</div>
                  </div>
                  {savedJobs.length > 0 && (
                    <div style={{ display: "flex", gap: 5 }}>
                      <button onClick={() => exportPDF(savedJobs)} style={{ padding: "7px 11px", background: "#6b1a1a", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 11, fontFamily: "sans-serif", color: "#f5e8e8" }}>
                        PDF
                      </button>
                      <button onClick={exportAllCSV} style={{ padding: "7px 11px", background: "#1c2b3a", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 11, fontFamily: "sans-serif", color: "#e8e0d4" }}>
                        ↓ CSV
                      </button>
                    </div>
                  )}
                </div>
                {savedJobs.length === 0 ? (
                  <div style={{ background: "#fff", border: "1px dashed #d8d0c8", borderRadius: 6, padding: "28px 16px", textAlign: "center" }}>
                    <div style={{ fontSize: 28, marginBottom: 8, opacity: 0.2 }}>📋</div>
                    <div style={{ fontSize: 12, color: "#bbb", fontFamily: "sans-serif", lineHeight: 1.5 }}>
                      {t("Hinda ametikoht ja vajuta\n\"Salvesta ja hinda järgmist\"","Complete an evaluation and click\n\"Save & Evaluate Next\"")}
                    </div>
                  </div>
                ) : (
                  <>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: "55vh", overflowY: "auto", paddingRight: 2 }}>
                      {savedJobs.map(job => {
                        const isExp = expandedJob === job.id;
                        const gc = GRADE_COLORS[job.gradeNum] || "#888";
                        return (
                          <div key={job.id} style={{ background: "#fff", border: editingJobId===job.id?"2px solid #8ab870":"1px solid #e0d8ce", borderRadius: 5, overflow: "hidden" }}>
                            <div style={{ padding: "10px 12px", cursor: "pointer", display: "flex", gap: 9, alignItems: "flex-start" }}
                              onClick={() => setExpandedJob(isExp ? null : job.id)}>
                              <div style={{ width: 34, height: 34, borderRadius: 4, background: gc, color: "#fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: "bold", fontFamily: "sans-serif", flexShrink: 0, lineHeight: 1 }}>
                                <span style={{ fontSize: 7, opacity: 0.75 }}>G</span>
                                <span>{job.gradeNum}</span>
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: 12, fontWeight: "600", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{job.jobTitle || <span style={{ color: "#bbb" }}>—</span>}</div>
                                <div style={{ fontSize: 10, color: "#999", fontFamily: "sans-serif", marginTop: 1 }}>{job.companyName}{job.companyName&&" · "}{job.evalDate}</div>
                                <div style={{ marginTop: 4, display: "flex", alignItems: "center", gap: 6 }}>
                                  <MiniBar value={job.totalPoints} color={gc} />
                                </div>
                              </div>
                              <div style={{ flexShrink: 0, textAlign: "right" }}>
                                <div style={{ fontSize: 15, fontWeight: "bold", color: "#1c2b3a" }}>{job.totalPoints}</div>
                                <div style={{ fontSize: 8, color: "#bbb", fontFamily: "sans-serif" }}>/ 1000</div>
                              </div>
                            </div>
                            {isExp && (
                              <div style={{ borderTop: "1px solid #e0d8ce", padding: "10px 12px", background: "#faf8f5" }}>
                                {job.groupBreakdown.map(g => (
                                  <div key={g.name} style={{ marginBottom: 7 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, fontFamily: "sans-serif", marginBottom: 2 }}>
                                      <span style={{ color: g.color, fontWeight: "700" }}>{g.name}</span>
                                      <span style={{ color: "#888" }}>{g.earned}/{g.maxPoints}p</span>
                                    </div>
                                    {g.factors.map(f => (
                                      <div key={f.name} style={{ display: "flex", justifyContent: "space-between", fontSize: 10, fontFamily: "sans-serif", color: "#666", padding: "1px 0 1px 8px" }}>
                                        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 145 }}>{f.name}</span>
                                        <span style={{ flexShrink: 0, marginLeft: 4, color: "#444" }}>{f.levelCode ?? `T${f.level}`} · {f.points}p</span>
                                      </div>
                                    ))}
                                  </div>
                                ))}
                                {job.comment?.trim() && (
                                  <div style={{ margin: "6px 0", padding: "7px 10px", background: "#f5f0e8", border: "1px solid #e0d8ce", borderRadius: 4, fontSize: 10, fontFamily: "Georgia,serif", color: "#555", fontStyle: "italic", lineHeight: 1.5 }}>
                                    {job.comment}
                                  </div>
                                )}
                                {job.evaluatorName && (
                                  <div style={{ fontSize: 9, fontFamily: "sans-serif", color: "#aaa", marginBottom: 4 }}>
                                    {t("Hindaja","Evaluator")}: {job.evaluatorName}
                                  </div>
                                )}
                                <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
                                  <button onClick={() => exportPDF([job])}
                                    style={{ padding: "4px 9px", background: "#6b1a1a", border: "none", borderRadius: 3, cursor: "pointer", fontSize: 10, fontFamily: "sans-serif", color: "#f5e8e8" }}>
                                    PDF
                                  </button>
                                  <button onClick={() => loadJobForEditing(job)}
                                    style={{ padding: "4px 9px", background: editingJobId===job.id?"#e8f0e0":"none", border: "1px solid #b0c8a0", borderRadius: 3, cursor: "pointer", fontSize: 10, fontFamily: "sans-serif", color: "#4a7a30", fontWeight: editingJobId===job.id?"700":"normal" }}>
                                    {editingJobId===job.id ? t("✏ Muutmisel...","✏ Editing...") : t("✏ Muuda","✏ Edit")}
                                  </button>
                                  <button onClick={() => removeJob(job.id)}
                                    style={{ padding: "4px 9px", background: "none", border: "1px solid #e0c0c0", borderRadius: 3, cursor: "pointer", fontSize: 10, fontFamily: "sans-serif", color: "#a05050" }}>
                                    {t("Kustuta","Remove")}
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    {savedJobs.length >= 2 && (
                      <div style={{ marginTop: 12, background: "#fff", border: "1px solid #e0d8ce", borderRadius: 5, overflow: "hidden" }}>
                        <div style={{ padding: "8px 12px", background: "#1c2b3a", color: "#9aaa8a", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.14em", fontFamily: "sans-serif" }}>
                          {t("Võrdlus — kõrgeimast madalaimani","Ranking — highest to lowest")}
                        </div>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, fontFamily: "sans-serif" }}>
                          <thead>
                            <tr style={{ background: "#f5f0eb" }}>
                              <th style={{ padding: "6px 10px", textAlign: "left", fontWeight: "600", color: "#666", borderBottom: "1px solid #e0d8ce", fontSize: 10 }}>#</th>
                              <th style={{ padding: "6px 10px", textAlign: "left", fontWeight: "600", color: "#666", borderBottom: "1px solid #e0d8ce", fontSize: 10 }}>{t("Ametikoht","Job")}</th>
                              <th style={{ padding: "6px 10px", textAlign: "center", fontWeight: "600", color: "#666", borderBottom: "1px solid #e0d8ce", fontSize: 10 }}>{t("P","Pts")}</th>
                              <th style={{ padding: "6px 10px", textAlign: "center", fontWeight: "600", color: "#666", borderBottom: "1px solid #e0d8ce", fontSize: 10 }}>{t("Aste","Grade")}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {[...savedJobs].sort((a,b) => b.totalPoints-a.totalPoints).map((job,i) => {
                              const gc = GRADE_COLORS[job.gradeNum]||"#888";
                              return (
                                <tr key={job.id} style={{ borderBottom: "1px solid #ede8e0", background: i%2===0?"#fff":"#faf8f5" }}>
                                  <td style={{ padding: "5px 10px", color: "#bbb", fontSize: 10 }}>{i+1}</td>
                                  <td style={{ padding: "5px 10px", color: "#333", maxWidth: 110, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 11 }}>{job.jobTitle||"—"}</td>
                                  <td style={{ padding: "5px 10px", textAlign: "center", fontWeight: "bold", color: "#1c2b3a", fontSize: 12 }}>{job.totalPoints}</td>
                                  <td style={{ padding: "5px 10px", textAlign: "center" }}>
                                    <span style={{ display: "inline-block", padding: "2px 7px", background: gc, color: "#fff", borderRadius: 3, fontSize: 10, fontFamily: "sans-serif", fontWeight: "600" }}>{job.grade}</span>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* WEIGHTS TAB */}
        {activeTab === "weights" && (
          <div style={{ maxWidth: 700 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: "normal", margin: 0 }}>{t("Faktorite kaalud","Factor Weights")}</h2>
                <p style={{ fontSize: 12, color: "#888", fontFamily: "sans-serif", margin: "6px 0 0" }}>
                  {t("Ametikohtade hindamise meetod lubab soovi korral kohandada iga faktorite grupi (oskused, pingutus, vastutus, töötingimused) osakaalu etteantud vahemikus. Kokku peavad grupid moodustama 100%. Kohandamine mõjutab kõiki töid — nii juba hinnatuid kui alles hinnatavaid.","The job evaluation method allows you to optionally adjust the weight of each factor group (skills, effort, responsibility, working conditions) within a set range. Together the groups must add up to 100%. Changes affect all jobs — both already evaluated and those yet to be evaluated.")}
                </p>
              </div>
              {weightsChanged && (
                <button onClick={resetWeights}
                  style={{ padding: "7px 14px", background: "#fff", border: "1px solid #c8bfb0", borderRadius: 4, cursor: "pointer", fontSize: 11, fontFamily: "sans-serif", color: "#666", flexShrink: 0, marginLeft: 16 }}>
                  {t("Lähtesta vaikimisi","Reset to Default")}
                </button>
              )}
            </div>

            {/* Total weight indicator */}
            <div style={{ margin: "18px 0 24px", padding: "12px 18px", background: "#fff", border: `1px solid ${Math.abs(totalWeight-100)>2?"#e0a070":"#c8d8b0"}`, borderRadius: 6, display: "flex", alignItems: "center", gap: 16, fontFamily: "sans-serif" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", color: "#888", marginBottom: 4 }}>{t("Kaalude summa","Total Weight")}</div>
                <div style={{ height: 8, background: "#ede8e0", borderRadius: 4, overflow: "hidden", position: "relative" }}>
                  <div style={{ position: "absolute", left: "100%", top: -2, bottom: -2, width: 1, background: "#aaa" }} />
                  {BASE_GROUPS.map((g, i) => {
                    const left = BASE_GROUPS.slice(0,i).reduce((s,bg) => s+(weights[bg.id]??bg.defaultWeight), 0);
                    const w = weights[g.id]??g.defaultWeight;
                    return <div key={g.id} style={{ position: "absolute", left: `${left}%`, width: `${w}%`, height: "100%", background: g.color, opacity: 0.85 }} />;
                  })}
                </div>
              </div>
              <div style={{ fontSize: 24, fontWeight: "bold", color: Math.abs(totalWeight-100)>2?"#c05020":"#2a5a1a", minWidth: 60, textAlign: "right" }}>
                {totalWeight}%
              </div>
              {Math.abs(totalWeight-100) > 2 && (
                <div style={{ fontSize: 11, color: "#c05020", maxWidth: 140 }}>
                  {t("Summa peaks olema 100%","Sum should be 100%")}
                </div>
              )}
            </div>

            {savedJobs.length > 0 && (
              <div style={{ marginBottom: 20, padding: "9px 14px", background: "#f0f5e8", border: "1px solid #b8d0a0", borderRadius: 5, fontSize: 11, fontFamily: "sans-serif", color: "#3a6020" }}>
                ℹ️ {t(`Kaalude muutmisel arvutatakse ${savedJobs.length} salvestatud ametikoha tulemus automaatselt ümber.`,`Changing weights will automatically recalculate scores for ${savedJobs.length} saved job(s).`)}
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {BASE_GROUPS.map(g => {
                const currentW = weights[g.id] ?? g.defaultWeight;
                const isChanged = currentW !== g.defaultWeight;
                const groupMax = currentW * 10;
                return (
                  <div key={g.id} style={{ background: "#fff", border: `1px solid ${isChanged?g.color+"60":"#e0d8ce"}`, borderRadius: 6, padding: "18px 20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: "500", color: g.color }}>{g.name}</div>
                        <div style={{ fontSize: 11, color: "#aaa", fontFamily: "sans-serif", marginTop: 2 }}>{g.nameEn} · {t("max","max")} {groupMax} {t("punkti","pts")}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 26, fontWeight: "bold", color: isChanged?g.color:"#1c2b3a", lineHeight: 1 }}>{currentW}%</div>
                        {isChanged && (
                          <div style={{ fontSize: 10, color: "#888", fontFamily: "sans-serif" }}>
                            {t("vaikimisi","default")}: {g.defaultWeight}%
                            <button onClick={() => handleWeightChange(g.id, g.defaultWeight)}
                              style={{ marginLeft: 6, background: "none", border: "none", cursor: "pointer", color: g.color, fontSize: 10, fontFamily: "sans-serif", textDecoration: "underline", padding: 0 }}>
                              {t("lähtesta","reset")}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 10, color: "#aaa", fontFamily: "sans-serif", width: 28, textAlign: "right" }}>{g.minWeight}%</span>
                      <input type="range"
                        min={g.minWeight} max={g.maxWeight} step={1} value={currentW}
                        onChange={e => handleWeightChange(g.id, parseInt(e.target.value))}
                        style={{ flex: 1, cursor: "pointer", accentColor: g.color, height: 4 }}
                      />
                      <span style={{ fontSize: 10, color: "#aaa", fontFamily: "sans-serif", width: 28 }}>{g.maxWeight}%</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 10, color: "#bbb", fontFamily: "sans-serif" }}>
                      <span>{t("lubatud miinimum","allowed min")}: {g.minWeight}%</span>
                      <span>{t("lubatud maksimum","allowed max")}: {g.maxWeight}%</span>
                    </div>
                    {/* Factor sub-breakdown */}
                    <div style={{ marginTop: 12, paddingTop: 10, borderTop: "1px solid #ede8e0" }}>
                      <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: "#bbb", fontFamily: "sans-serif", marginBottom: 6 }}>{t("Alamfaktorid","Sub-factors")}</div>
                      {g.factors.map(f => {
                        const fMax = Math.round(f.factorRatio * groupMax);
                        return (
                          <div key={f.id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                            <div style={{ width: 160, fontSize: 11, color: "#555", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</div>
                            <div style={{ flex: 1, height: 4, background: "#ede8e0", borderRadius: 2, overflow: "hidden" }}>
                              <div style={{ height: "100%", width: `${(fMax/groupMax)*100}%`, background: g.color, opacity: 0.5, borderRadius: 2 }} />
                            </div>
                            <div style={{ width: 48, fontSize: 10, color: "#888", fontFamily: "sans-serif", textAlign: "right" }}>{fMax}p</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

                {/* DESCRIPTIONS TAB */}
        {activeTab === "descriptions" && (
          <div>
            <div style={{ marginBottom: 22 }}>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: "normal" }}>{t("Tasemete kirjeldused","Level Descriptions")}</h2>
              <p style={{ margin: "5px 0 0", fontSize: 12, color: "#888", fontFamily: "sans-serif" }}>
                {t("Iga faktori tasemete kirjeldused koos näidisametikohtadega.","Descriptions for each factor level with example job titles.")}
              </p>
            </div>
            {factorGroups.map(group => (
              <div key={group.id} style={{ marginBottom: 28 }}>
                <h3 style={{ fontSize: 15, fontWeight: "normal", color: group.color, borderBottom: `2px solid ${group.color}`, paddingBottom: 7, marginBottom: 14 }}>{group.name}</h3>
                {group.factors.map(factor => (
                  <div key={factor.id} style={{ marginBottom: 14, background: "#fff", border: "1px solid #e0d8ce", borderRadius: 5, overflow: "hidden" }}>
                    <div style={{ padding: "9px 14px", background: `${group.color}07`, borderBottom: "1px solid #e0d8ce", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 13, fontWeight: "500" }}>{factor.name}</span>
                      <span style={{ fontSize: 10, color: "#aaa", fontFamily: "sans-serif" }}>max {factor.maxPoints}p</span>
                    </div>
                    <div style={{ padding: "10px 14px", display: "flex", flexDirection: "column", gap: 0 }}>
                      {factor.levels.map((pts, li) => (
                        <div key={li} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "9px 0", borderBottom: li < 5 ? "1px solid #f0ebe4" : "none" }}>
                          <div style={{ width: 52, flexShrink: 0, textAlign: "center", paddingTop: 2 }}>
                            <div style={{ display: "inline-block", padding: "2px 7px", background: group.color, color: "#fff", borderRadius: 3, fontSize: 10, fontFamily: "sans-serif", fontWeight: "600", marginBottom: 3 }}>{factor.levelCodes?.[li] ?? `T${li+1}`}</div>
                            <div style={{ fontSize: 12, fontWeight: "bold", color: group.color }}>{pts}p</div>
                          </div>
                          <div style={{ flex: 1, fontSize: 12, color: "#444", lineHeight: 1.6, fontFamily: "Georgia,serif" }}>
                            {factor.descriptions[li] ? factor.descriptions[li].split("\n").map((line, lni) =>
                              line.startsWith("Näited ametikohtadest:")
                                ? <div key={lni} style={{ marginTop: 6, fontSize: 11, fontFamily: "sans-serif", color: "#666" }}>
                                    <span style={{ color: group.color, fontWeight: "600" }}>Näited: </span>
                                    {line.replace("Näited ametikohtadest: ", "")}
                                  </div>
                                : <div key={lni}>{line}</div>
                            ) : <span style={{ color: "#ccc", fontStyle: "italic" }}>—</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* GRADES TAB */}
                {activeTab === "grades" && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontSize: 20, fontWeight: "normal", marginBottom: 5 }}>{t("Palgaastmete skaala","Job Grade Scale")}</h2>
              <p style={{ fontSize: 12, color: "#888", fontFamily: "sans-serif", marginBottom: 16 }}>
                {t("Vali skaala tüüp — see mõjutab kõigi hinnatud ametikohtade palgaastet.","Choose scale type — affects grade assignments for all evaluated jobs.")}
              </p>

              {/* Scale type toggle + params */}
              <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap", alignItems: "stretch" }}>
                {/* Linear option */}
                <div onClick={() => setScaleType("linear")}
                  style={{ padding: "12px 16px", background: scaleType === "linear" ? "#1c2b3a" : "#fff", border: scaleType === "linear" ? "2px solid #1c2b3a" : "1px solid #c8bfb0", borderRadius: 5, cursor: "pointer", minWidth: 200, flex: "1 1 200px" }}>
                  <div style={{ fontSize: 13, fontWeight: "600", color: scaleType === "linear" ? "#e8e0d4" : "#333", fontFamily: "sans-serif", marginBottom: 8 }}>{t("Lineaarne","Linear")}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <label style={{ fontSize: 10, color: scaleType === "linear" ? "#9aaa8a" : "#888", fontFamily: "sans-serif", whiteSpace: "nowrap" }}>{t("Astmeid","Grades")}</label>
                    <input type="range" min={3} max={10} step={1} value={linearNumGrades}
                      onClick={e => e.stopPropagation()}
                      onChange={e => { setScaleType("linear"); setLinearNumGrades(Number(e.target.value)); }}
                      style={{ flex: 1, accentColor: scaleType === "linear" ? "#9aaa8a" : "#1c2b3a" }} />
                    <span style={{ fontSize: 13, fontWeight: "700", color: scaleType === "linear" ? "#e8e0d4" : "#1c2b3a", fontFamily: "sans-serif", minWidth: 16, textAlign: "right" }}>{linearNumGrades}</span>
                  </div>
                  <div style={{ fontSize: 10, color: scaleType === "linear" ? "#9aaa8a" : "#aaa", fontFamily: "sans-serif", marginTop: 6 }}>
                    {t("Vahemiku laius","Band width")}: ~{Math.round(1000 / linearNumGrades)}p
                  </div>
                </div>

                {/* Geometric option */}
                <div onClick={() => setScaleType("geometric")}
                  style={{ padding: "12px 16px", background: scaleType === "geometric" ? "#1c2b3a" : "#fff", border: scaleType === "geometric" ? "2px solid #1c2b3a" : "1px solid #c8bfb0", borderRadius: 5, cursor: "pointer", minWidth: 200, flex: "1 1 200px" }}>
                  <div style={{ fontSize: 13, fontWeight: "600", color: scaleType === "geometric" ? "#e8e0d4" : "#333", fontFamily: "sans-serif", marginBottom: 8 }}>{t("Proportsionaalne","Proportional")}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <label style={{ fontSize: 10, color: scaleType === "geometric" ? "#9aaa8a" : "#888", fontFamily: "sans-serif", whiteSpace: "nowrap" }}>{t("Kordaja","Ratio")}</label>
                    <input type="range" min={1.1} max={2.0} step={0.05} value={geoRatio}
                      onClick={e => e.stopPropagation()}
                      onChange={e => { setScaleType("geometric"); setGeoRatio(Number(e.target.value)); }}
                      style={{ flex: 1, accentColor: scaleType === "geometric" ? "#9aaa8a" : "#1c2b3a" }} />
                    <span style={{ fontSize: 13, fontWeight: "700", color: scaleType === "geometric" ? "#e8e0d4" : "#1c2b3a", fontFamily: "sans-serif", minWidth: 28, textAlign: "right" }}>×{geoRatio.toFixed(2)}</span>
                  </div>
                  <div style={{ fontSize: 10, fontFamily: "sans-serif", marginTop: 6 }}>
                    {(() => {
                      const tg = computeGradeThresholds("geometric", 6, geoRatio);
                      const n = tg.length;
                      const pa1w = tg[0].max - tg[0].min + 1;
                      const lastW = tg[n-1].max - tg[n-1].min + 1;
                      const warn = n < 5;
                      return (<>
                        <span style={{ color: scaleType === "geometric" ? "#9aaa8a" : "#aaa" }}>
                          {`${t("Astmeid","Grades")}: ${n} · PA1 ${pa1w}p · PA${n} ${lastW}p`}
                        </span>
                        {warn && <span style={{ marginLeft: 8, color: "#b85c00", fontWeight: 600 }}>
                          ⚠ {t("alla 5 astme","fewer than 5 grades")}
                        </span>}
                      </>);
                    })()}
                  </div>
                </div>
              </div>

              {/* Side-by-side comparison */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
                {["linear","geometric"].map(type => {
                  const thresholds = computeGradeThresholds(type, linearNumGrades, geoRatio);
                  const isActive = scaleType === type;
                  return (
                    <div key={type} style={{ background: "#fff", border: `1px solid ${isActive ? "#1c2b3a" : "#e0d8ce"}`, borderRadius: 5, overflow: "hidden", opacity: isActive ? 1 : 0.55 }}>
                      <div style={{ padding: "8px 14px", background: isActive ? "#1c2b3a" : "#f5f0eb", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: 11, fontFamily: "sans-serif", fontWeight: "600", color: isActive ? "#9aaa8a" : "#888", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                          {type === "linear" ? t("Lineaarne","Linear") : t("Proportsionaalne","Proportional")}
                        </span>
                        {isActive && <span style={{ fontSize: 9, color: "#9aaa8a", fontFamily: "sans-serif" }}>● {t("aktiivne","active")}</span>}
                      </div>
                      <div style={{ padding: "8px 0" }}>
                        {thresholds.map((g, i) => {
                          const width = g.max - g.min + 1;
                          const pct = width / 10;
                          const gc = GRADE_COLORS[g.grade] || "#888";
                          return (
                            <div key={g.grade} style={{ display: "flex", alignItems: "center", gap: 10, padding: "5px 14px" }}>
                              <div style={{ width: 28, height: 22, borderRadius: 3, background: gc, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: "700", fontFamily: "sans-serif", flexShrink: 0 }}>{g.label}</div>
                              <div style={{ flex: 1 }}>
                                <div style={{ height: 6, background: "#ede8e0", borderRadius: 3, overflow: "hidden" }}>
                                  <div style={{ height: "100%", width: `${pct}%`, background: gc, borderRadius: 3 }} />
                                </div>
                              </div>
                              <div style={{ fontSize: 10, fontFamily: "sans-serif", color: "#666", width: 90, textAlign: "right" }}>{g.min}–{g.max}p <span style={{ color: "#aaa" }}>({width}p)</span></div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Impact on saved jobs */}
              {savedJobs.length > 0 && (
                <div style={{ background: "#fff", border: "1px solid #e0d8ce", borderRadius: 5, overflow: "hidden", marginBottom: 24 }}>
                  <div style={{ padding: "8px 14px", background: "#1c2b3a", color: "#9aaa8a", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.14em", fontFamily: "sans-serif" }}>
                    {t("Mõju hinnatud ametikohtadele","Impact on evaluated jobs")}
                  </div>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, fontFamily: "sans-serif" }}>
                    <thead>
                      <tr style={{ background: "#f5f0eb" }}>
                        <th style={{ padding: "7px 14px", textAlign: "left", color: "#666", fontWeight: "600", fontSize: 10 }}>{t("Ametikoht","Job")}</th>
                        <th style={{ padding: "7px 14px", textAlign: "center", color: "#666", fontWeight: "600", fontSize: 10 }}>{t("Punktid","Points")}</th>
                        <th style={{ padding: "7px 14px", textAlign: "center", color: "#666", fontWeight: "600", fontSize: 10 }}>{t("Lineaarne","Linear")}</th>
                        <th style={{ padding: "7px 14px", textAlign: "center", color: "#666", fontWeight: "600", fontSize: 10 }}>{t("Proports.","Proport.")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...savedJobs].sort((a,b) => b.totalPoints - a.totalPoints).map((job, i) => {
                        const linGrade = getGrade(job.totalPoints, computeGradeThresholds("linear", linearNumGrades, geoRatio));
                        const geoGrade = getGrade(job.totalPoints, computeGradeThresholds("geometric", linearNumGrades, geoRatio));
                        const differs = linGrade?.grade !== geoGrade?.grade;
                        return (
                          <tr key={job.id} style={{ borderBottom: "1px solid #ede8e0", background: i%2===0?"#fff":"#faf8f5" }}>
                            <td style={{ padding: "7px 14px", color: "#333" }}>{job.jobTitle || "—"}</td>
                            <td style={{ padding: "7px 14px", textAlign: "center", fontWeight: "bold", color: "#1c2b3a" }}>{job.totalPoints}</td>
                            {[linGrade, geoGrade].map((g, gi) => (
                              <td key={gi} style={{ padding: "7px 14px", textAlign: "center" }}>
                                <span style={{ display: "inline-block", padding: "2px 8px", background: GRADE_COLORS[g?.grade]||"#ccc", color: "#fff", borderRadius: 3, fontSize: 10, fontWeight: "600",
                                  outline: differs && ((scaleType==="linear"&&gi===0)||(scaleType==="geometric"&&gi===1)) ? "2px solid #1c2b3a" : "none",
                                  outlineOffset: 1 }}>{g?.label || "—"}</span>
                              </td>
                            ))}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {savedJobs.some(job => {
                    const l = getGrade(job.totalPoints, computeGradeThresholds("linear", linearNumGrades, geoRatio));
                    const g = getGrade(job.totalPoints, computeGradeThresholds("geometric", linearNumGrades, geoRatio));
                    return l?.grade !== g?.grade;
                  }) && (
                    <div style={{ padding: "8px 14px", background: "#fffbe6", borderTop: "1px solid #e8d88a", fontSize: 11, fontFamily: "sans-serif", color: "#7a6010" }}>
                      ⚠ {t("Mõned ametikohad saavad erineva palgaastme sõltuvalt valitud skaalast.","Some jobs receive a different grade depending on the chosen scale.")}
                    </div>
                  )}
                </div>
              )}

              {/* Future: data-driven grading note */}
              <div style={{ padding: "14px 18px", background: "#f5f0eb", border: "1px solid #e0d8ce", borderRadius: 5, fontSize: 12, fontFamily: "sans-serif", color: "#666", lineHeight: 1.6 }}>
                <div style={{ fontWeight: "600", color: "#1c2b3a", marginBottom: 4, fontSize: 13 }}>
                  💡 {t("Tulevikus: andmepõhised palgaklassid","Future: data-driven grade boundaries")}
                </div>
                {t(
                  "Praegu määratakse palgaastme piirid enne hindamist. Tõhusam lähenemine: hinda kõigepealt kõik ametikohad, seejärel lase süsteemil leida piirid, mis peegelda kõige paremini tegelikku punktijaotust — n-ö looduslikud katkestuskohad andmetes (natural breaks / Jenks optimisation). Nii tekivad palgaklassid organisatsiooni tegelikust struktuurist, mitte eeldatavast.",
                  "Currently grade boundaries are set before evaluation. A more accurate approach: first evaluate all jobs, then let the system find boundaries that best reflect the actual point distribution — so-called natural breaks (Jenks optimisation). This way grade classes emerge from the organisation's real structure, not assumptions."
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
