// Dataset trilingue delle festivita esoteriche (IT / EN / LA)
// tradition: 'wicca' | 'norse' | 'satanismo' | 'stregoneria' | 'druidismo' | 'ellenismo' | 'kemetismo' | 'vodou' | 'santeria' | 'slavismo' | 'thelema' | 'ermetismo'

export const TRADITIONS = {
  wicca: {
    color: "#5c8a4a",
    symbol: "\u26E4",
    label: { it: "Wicca \u00B7 Ruota dell'Anno", en: "Wicca \u00B7 Wheel of the Year", la: "Wicca \u00B7 Rota Anni" }
  },
  norse: {
    color: "#3f8aa8",
    symbol: "\u16DF",
    label: { it: "Paganesimo Norreno", en: "Norse Paganism", la: "Paganismus Nordicus" }
  },
  stregoneria: {
    color: "#9a5cbd",
    symbol: "\u263E",
    label: { it: "Stregoneria Tradizionale", en: "Traditional Witchcraft", la: "Veneficium Traditionale" }
  },
  satanismo: {
    color: "#d43f4f",
    symbol: "\u26E7",
    label: { it: "Satanismo (LaVeyano)", en: "Satanism (LaVeyan)", la: "Satanismus (Laveyanus)" }
  },
  druidismo: {
    color: "#2f6b35",
    symbol: "\u2618",
    label: { it: "Druidismo", en: "Druidry", la: "Druidismus" }
  },
  ellenismo: {
    color: "#8a7a3f",
    symbol: "\u2609",
    label: { it: "Ellenismo", en: "Hellenismos", la: "Hellenismus" }
  },
  kemetismo: {
    color: "#c9962c",
    symbol: "\u2625",
    label: { it: "Kemetismo", en: "Kemetism", la: "Kemetismus" }
  },
  vodou: {
    color: "#8a1f3d",
    symbol: "\u2629",
    label: { it: "Vodou Haitiano", en: "Haitian Vodou", la: "Vodou Haitianum" }
  },
  santeria: {
    color: "#2f7a6b",
    symbol: "\u269C",
    label: { it: "Santer\u00EDa / Regla de Ocha", en: "Santer\u00EDa / Regla de Ocha", la: "Santeria" }
  },
  slavismo: {
    color: "#a8542e",
    symbol: "\u2733",
    label: { it: "Fede Slava Nativa", en: "Slavic Native Faith", la: "Fides Slavica Nativa" }
  },
  thelema: {
    color: "#4a2f7a",
    symbol: "\u26B9",
    label: { it: "Thelema", en: "Thelema", la: "Thelema" }
  },
  ermetismo: {
    color: "#5f6b7a",
    symbol: "\u263F",
    label: { it: "Ermetismo", en: "Hermeticism", la: "Hermetismus" }
  },
  luna: {
    color: "#b9c4de",
    symbol: "\u25CF",
    label: { it: "Luna Piena", en: "Full Moon", la: "Luna Plena" }
  },
};

// Nomi popolari occidentali delle lune piene mensili (indice 0 = Gennaio)
export const MOON_NAMES = [
  { it: "Luna del Lupo", en: "Wolf Moon", la: "Luna Lupi" },
  { it: "Luna della Neve", en: "Snow Moon", la: "Luna Nivis" },
  { it: "Luna del Verme", en: "Worm Moon", la: "Luna Vermis" },
  { it: "Luna Rosa", en: "Pink Moon", la: "Luna Rosea" },
  { it: "Luna dei Fiori", en: "Flower Moon", la: "Luna Florum" },
  { it: "Luna delle Fragole", en: "Strawberry Moon", la: "Luna Fragorum" },
  { it: "Luna del Cervo", en: "Buck Moon", la: "Luna Cervi" },
  { it: "Luna dello Storione", en: "Sturgeon Moon", la: "Luna Acipenseris" },
  { it: "Luna del Raccolto", en: "Harvest Moon", la: "Luna Messis" },
  { it: "Luna del Cacciatore", en: "Hunter's Moon", la: "Luna Venatoris" },
  { it: "Luna del Castoro", en: "Beaver Moon", la: "Luna Castoris" },
  { it: "Luna Fredda", en: "Cold Moon", la: "Luna Frigida" },
];
const BLUE_MOON = { it: "Luna Blu", en: "Blue Moon", la: "Luna Caerulea" };

const MOON_DESC = {
  it: "Il plenilunio: il momento del mese in cui la luce lunare \u00E8 al massimo, tradizionalmente associato al culmine del potere magico, alla divinazione e alla ricarica di oggetti rituali.",
  en: "The full moon: the point in the month when moonlight is at its peak, traditionally associated with the height of magical power, divination and the recharging of ritual tools.",
  la: "Plenilunium: tempus mensis quo lumen lunare maximum est, potentiae magicae culmini, divinationi, et instrumentorum ritalium recreationi traditionaliter consociatum."
};

const MOON_CELEBRATION = {
  it: "Chi lavora con le rune o altri strumenti divinatori (tarocchi, cristalli, pendoli) li espone alla luce della luna dalla sera fino all'alba per \u2018ricaricarli\u2019; si accende una candela bianca o argentata, si versa un bicchiere d'acqua sotto la luna da bere il giorno dopo, e in gruppo si organizza spesso una cena o un piccolo rito all'aperto per onorare il plenilunio.",
  en: "Those who work with runes or other divinatory tools (tarot, crystals, pendulums) leave them under the moonlight from evening until dawn to 'recharge' them; a white or silver candle is lit, a glass of water is left under the moon to drink the next day, and groups often hold a supper or a small outdoor rite to honour the full moon.",
  la: "Qui runis vel aliis instrumentis divinatoriis (tarocchis, crystallis, pendulis) utuntur, ea sub lumine lunae a vespere usque ad auroram exponunt ut 'recreentur'; candela alba vel argentea accenditur, poculum aquae sub luna relinquitur postero die bibendum, et saepe in grege cena vel parvus ritus sub divo ad plenilunium honorandum agitur."
};

// Algoritmo astronomico approssimato (sintetizzato da Jean Meeus) per calcolare
// le lune piene di un dato anno solare, cos\u00EC che il calendario resti
// accurato di anno in anno senza dover aggiornare date fisse a mano.
export function getFullMoons(year) {
  const synodicMonth = 29.530588853; // giorni
  const knownFullMoonUTC = Date.UTC(2000, 0, 21, 4, 41); // plenilunio di riferimento noto
  const msPerDay = 86400000;
  const results = [];
  let k = Math.floor((Date.UTC(year, 0, 1) - knownFullMoonUTC) / (synodicMonth * msPerDay)) - 2;
  for (;;) {
    const t = new Date(knownFullMoonUTC + k * synodicMonth * msPerDay);
    if (t.getUTCFullYear() > year) break;
    if (t.getUTCFullYear() === year) results.push(t);
    k++;
  }
  return results;
}

// Genera le "festivit\u00E0" lunari (lune piene) per un dato anno, nello stesso
// formato usato da HOLIDAYS, cos\u00EC che il resto dell'app possa trattarle
// come qualunque altra ricorrenza.
export function getMoonHolidays(year) {
  const moons = getFullMoons(year);
  const seenInMonth = {};
  return moons.map((d, idx) => {
    const month = d.getUTCMonth(); // 0-indexed
    seenInMonth[month] = (seenInMonth[month] || 0) + 1;
    const isBlue = seenInMonth[month] === 2;
    const nameSet = isBlue ? BLUE_MOON : MOON_NAMES[month];
    return {
      id: `moon-${year}-${idx}`,
      month: month + 1,
      day: d.getUTCDate(),
      year: year,
      tradition: "luna",
      isMoon: true,
      name: nameSet,
      desc: MOON_DESC,
      celebration: MOON_CELEBRATION
    };
  });
}

export const HOLIDAYS = [
  {
    id: "plough", month: 1, day: 2, tradition: "norse",
    name: { it: "La Benedizione dell'Aratro", en: "Charming of the Plough", la: "Benedictio Aratri" },
    desc: {
      it: "Rito anglosassone di risveglio della terra: si benediva l'aratro invocando le divinita della fertilita, tra cui Freya, per un anno agricolo prospero.",
      en: "An Anglo-Saxon rite to awaken the land: the plough was blessed while invoking fertility deities, including Freya, for a fruitful farming year.",
      la: "Ritus Anglo-Saxonicus terrae excitandae: aratrum benedicebatur, numinibus fecunditatis \u2014 inter quas Freya \u2014 invocatis, ut annus frugifer esset."
    },
    celebration: {
      it: "Si decora l'aratro con nastri e si porta in processione per i campi o per casa; si prepara un pane rustico da condividere e si versa un po' di birra o idromele sulla terra come libagione a Freya.",
      en: "The plough is decorated with ribbons and carried in procession through the fields or around the house; a rustic bread is baked to share, and a little beer or mead is poured onto the earth as a libation to Freya.",
      la: "Aratrum vittis ornatur et per agros vel circa domum pompa fertur; panis rusticus coquitur ad communicandum, et paulum cerevisiae vel mulsi in terram Freyae libatur."
    }
  },
  {
    id: "befana", month: 1, day: 5, tradition: "stregoneria",
    name: { it: "La Notte della Befana", en: "Night of La Befana", la: "Nox Befanae" },
    desc: {
      it: "Retaggio pagano nel folklore italiano: una vecchia strega vola di casa in casa nella notte dell'Epifania, portando doni o carbone secondo i meriti dell'anno.",
      en: "A pagan survival within Italian folklore: an old witch flies from house to house on the eve of Epiphany, bringing gifts or coal according to the year's merits.",
      la: "Superstitio pagana in fabulis Italicis: anus venefica nocte Epiphaniae domum ad domum volat, dona vel carbonem pro anni meritis afferens."
    },
    celebration: {
      it: "Si lascia una calza vuota alla finestra o al camino la sera prima; si condivide una cena leggera con arance, mandarini e vin brulé, e si brucia un rametto di rosmarino per augurare fortuna all'anno nuovo.",
      en: "An empty stocking is left by the window or fireplace the night before; a light supper of oranges, clementines and mulled wine is shared, and a sprig of rosemary is burned to wish luck for the new year.",
      la: "Pera vacua ante fenestram vel focum nocte priore relinquitur; cena levis aurantiis, citreis, et vino calido communicatur, et ramulus rosmarini ad annum novum fortunandum uritur."
    }
  },
  {
    id: "thorrablot", month: 1, day: 19, tradition: "norse",
    name: { it: "\u00DEorrabl\u00F3t", en: "\u00DEorrabl\u00F3t", la: "\u00DEorrabl\u00F3tum" },
    desc: {
      it: "Festa d'inverno islandese in onore di \u00DEorri, personificazione del gelo: banchetto rituale con cibi tradizionali per propiziarsi la stagione fredda.",
      en: "An Icelandic winter feast honouring \u00DEorri, the personification of frost: a ritual banquet of traditional foods to placate the cold season.",
      la: "Islandica hiberna festivitas \u00DEorrio dicata, frigoris personificationi: convivium ritale cibis traditis, ut tempus frigidum placaretur."
    },
    celebration: {
      it: "Banchetto invernale islandese: si condividono piatti tradizionali (agnello affumicato, aringhe marinate, pane di segale) e si alza un corno di idromele in onore di Þorri e degli antenati.",
      en: "An Icelandic winter feast: traditional dishes are shared (smoked lamb, pickled herring, rye bread) and a horn of mead is raised in honour of Þorri and the ancestors.",
      la: "Islandicum convivium hibernum: cibi traditi communicantur (agnus fumatus, harengi conditi, panis secalinus) et cornu mulsi Þorrio maioribusque in honorem tollitur."
    }
  },
  {
    id: "imbolc", month: 2, day: 2, tradition: "wicca",
    name: { it: "Imbolc", en: "Imbolc", la: "Imbolcum" },
    desc: {
      it: "Sabbat minore dedicato a Brigid: celebra il primo risveglio della luce dopo l'inverno e la purificazione dei semi sotto la terra.",
      en: "A minor Sabbat honouring Brigid: it marks the first stirring of light after winter and the purification of seeds beneath the earth.",
      la: "Sabbatum minus Brigidae dicatum: primam lucis experrectionem post hiemem et seminum sub terra purgationem celebrat."
    },
    celebration: {
      it: "Si accendono candele bianche in ogni stanza per salutare il ritorno della luce, si prepara un pane o dei biscotti a forma di sole, e si purifica la casa con acqua e sale in onore di Brigid.",
      en: "White candles are lit in every room to welcome the returning light, sun-shaped bread or biscuits are baked, and the home is purified with water and salt in Brigid's honour.",
      la: "Candelae albae in omni cubiculo accenduntur ut reditus lucis salutetur, panis vel crustula solis forma coquuntur, et domus aqua et sale in Brigidae honorem purgatur."
    }
  },
  {
    id: "candelora", month: 2, day: 2, tradition: "stregoneria",
    name: { it: "Candelora", en: "Candlemas (Folk Rite)", la: "Candelora" },
    desc: {
      it: "Variante popolare e stregonesca di Imbolc: candele benedette in casa per allontanare gli spiriti dell'inverno e proteggere il focolare fino alla primavera.",
      en: "A folk-witchcraft variant of Imbolc: candles are blessed at home to drive away winter spirits and protect the hearth until spring.",
      la: "Popularis et veneficialis Imbolci varietas: candelae domi benedicuntur ut hiemis spiritus abigantur et focus usque ad ver tueatur."
    },
    celebration: {
      it: "Si benedicono in casa candele per l'anno intero, si accende un lume alla finestra al calar del sole e si condivide una cena a base di frittelle o crepes per augurare abbondanza.",
      en: "Candles for the whole year are blessed at home, a light is lit at the window at dusk, and a supper of fritters or crepes is shared to invoke abundance.",
      la: "Candelae totius anni domi benedicuntur, lumen ad fenestram sub crepusculo accenditur, et cena crustulis frictis vel crepis communicatur ut abundantia invocetur."
    }
  },
  {
    id: "vali", month: 2, day: 14, tradition: "norse",
    name: { it: "V\u00E1li's Bl\u00F3t", en: "V\u00E1li's Bl\u00F3t", la: "Bl\u00F3tum Valii" },
    desc: {
      it: "Bl\u00F3t in onore di V\u00E1li, figlio di Odino legato alla vendetta e alla rinascita rapida: si celebra il ritorno della luce.",
      en: "A bl\u00F3t honouring V\u00E1li, son of Odin, associated with vengeance and swift rebirth: it celebrates the returning light.",
      la: "Bl\u00F3tum Valio dicatum, Odini filio, ultioni et celeri renascentiae consecrato: reditum lucis celebrat."
    },
    celebration: {
      it: "Piccolo blót privato: si alza un corno di idromele o succo di mela a Váli e si accende una candela rossa per invocare protezione rapida e giustizia.",
      en: "A small private blót: a horn of mead or apple juice is raised to Váli, and a red candle is lit to invoke swift protection and justice.",
      la: "Parvum blótum privatum: cornu mulsi vel suci mali Valio tollitur, et candela rubra accenditur ut tutela celeris et iustitia invocentur."
    }
  },
  {
    id: "anthesteria", month: 2, day: 11, tradition: "ellenismo",
    name: { it: "Antesteria", en: "Anthesteria", la: "Anthesteria" },
    desc: {
      it: "Antica festa ateniese del vino nuovo in onore di Dioniso: si aprivano le giare, e si credeva che le anime dei morti vagassero libere per tre giorni.",
      en: "An ancient Athenian festival of the new wine honouring Dionysus: jars were opened, and the souls of the dead were believed to wander freely for three days.",
      la: "Antiqua Atheniensis festivitas vini novi Dionyso dicata: dolia aperiebantur, et animae mortuorum tribus diebus liberae vagari credebantur."
    },
    celebration: {
      it: "Si apre una giara di vino nuovo e se ne versa un poco in offerta a Dioniso; si lascia un piatto di cibo fuori casa per le anime vaganti e si evitano contatti prolungati fuori dalla porta la notte.",
      en: "A jar of new wine is opened and a little poured as an offering to Dionysus; a plate of food is left outside the house for the wandering souls, and lingering outside the door at night is avoided.",
      la: "Dolium vini novi aperitur et paulum Dionyso libatur; discus cibi extra domum animabus vagantibus relinquitur, et diu ante ianuam nocte manere vitatur."
    }
  },
  {
    id: "maslenitsa", month: 3, day: 1, tradition: "slavismo",
    name: { it: "Maslenitsa", en: "Maslenitsa", la: "Maslenitsa" },
    desc: {
      it: "Festa slava di fine inverno in onore del sole: si bruciava un fantoccio di paglia e si mangiavano blini rotondi come simboli solari.",
      en: "A Slavic festival marking winter's end in honour of the sun: a straw effigy was burned and round blini were eaten as solar symbols.",
      la: "Slavica festivitas hiemis finis, soli dicata: effigies stramentea cremabatur et blini rotundi tamquam signa solaria edebantur."
    },
    celebration: {
      it: "Si cucinano blini rotondi e dorati come simboli del sole, si organizzano giochi all'aperto e si conclude la settimana bruciando un fantoccio di paglia per congedare l'inverno.",
      en: "Round, golden blini are cooked as sun symbols, outdoor games are held, and the week closes with the burning of a straw effigy to bid farewell to winter.",
      la: "Blini rotundi et aurei ut solis signa coquuntur, ludi sub divo aguntur, et hebdomas effigie straminea cremata ad hiemem dimittendam clauditur."
    }
  },
  {
    id: "fama-fraternitatis", month: 3, day: 9, tradition: "ermetismo",
    name: { it: "Anniversario della Fama Fraternitatis", en: "Anniversary of the Fama Fraternitatis", la: "Anniversarium Famae Fraternitatis" },
    desc: {
      it: "Data convenzionale scelta per commemorare la pubblicazione nel 1614 del manifesto rosacrociano che rivelo al mondo la leggendaria fratellanza di Christian Rosenkreuz.",
      en: "A conventional date chosen to commemorate the 1614 publication of the Rosicrucian manifesto that revealed the legendary brotherhood of Christian Rosenkreuz to the world.",
      la: "Dies conventionalis ad commemorandam anno 1614 editionem manifesti Rosicruciani electus, quod legendariam fraternitatem Christiani Rosenkreuz mundo patefecit."
    },
    celebration: {
      it: "Serata di lettura e studio: si rilegge un brano dei manifesti rosacrociani o di testi alchemici, accompagnata da una candela e da un'infusione di erbe come il rosmarino, simbolo di memoria e chiarezza.",
      en: "An evening of reading and study: a passage from the Rosicrucian manifestos or alchemical texts is re-read by candlelight, accompanied by an herbal infusion such as rosemary, a symbol of memory and clarity.",
      la: "Vespera lectionis et studii: locus manifestorum Rosicrucianorum vel textuum alchemicorum ad lucem candelae relegitur, cum infusione herbarum, ut rosmarini, memoriae et claritatis signo."
    }
  },
  {
    id: "ostara", month: 3, day: 20, tradition: "wicca",
    name: { it: "Ostara", en: "Ostara", la: "Ostara" },
    desc: {
      it: "Equinozio di primavera: equilibrio tra luce e buio, celebrazione della fertilita, delle uova e dei semi germinanti.",
      en: "The spring equinox: balance between light and dark, a celebration of fertility, eggs and sprouting seeds.",
      la: "Aequinoctium vernum: aequilibrium inter lucem et tenebras, fecunditatis, ovorum et seminum germinantium celebratio."
    },
    celebration: {
      it: "Si decorano uova sode con colori naturali, si pianta qualcosa in giardino o in vaso, e si prepara una cena leggera con verdure primaverili e pane a forma di lepre o di sole.",
      en: "Hard-boiled eggs are decorated with natural dyes, something is planted in the garden or a pot, and a light supper of spring vegetables and hare- or sun-shaped bread is prepared.",
      la: "Ova dura tinctis naturalibus ornantur, aliquid in horto vel vase seritur, et cena levis oleribus vernis panique leporis vel solis forma paratur."
    }
  },
  {
    id: "alban-eiler", month: 3, day: 20, tradition: "druidismo",
    name: { it: "Alban Eiler", en: "Alban Eiler", la: "Alban Eiler" },
    desc: {
      it: "Nome druidico dell'equinozio di primavera, 'Luce della Terra': equilibrio tra le forze del giorno e della notte celebrato con rami fioriti e canti all'alba.",
      en: "The Druidic name for the spring equinox, 'Light of the Earth': the balance between day and night is honoured with blossoming branches and songs at dawn.",
      la: "Nomen Druidicum aequinoctii verni, 'Lux Terrae': aequilibrium inter vires diei et noctis ramis florentibus et carminibus sub aurora celebratur."
    },
    celebration: {
      it: "Si compie una passeggiata all'alba per osservare l'equilibrio tra luce e ombra, si intrecciano rametti fioriti in una corona e si condivide pane e sidro con il gruppo o la famiglia.",
      en: "A dawn walk is taken to observe the balance of light and shadow, blossoming twigs are woven into a wreath, and bread and cider are shared with the group or family.",
      la: "Ambulatio sub aurora fit ad aequilibrium lucis et umbrae observandum, ramuli florentes in coronam nectuntur, et panis ac sicera cum grege vel familia communicantur."
    }
  },
  {
    id: "equinozio-dei", month: 3, day: 20, tradition: "thelema",
    name: { it: "Equinozio degli Dei", en: "Equinox of the Gods", la: "Aequinoctium Deorum" },
    desc: {
      it: "Ricorda la proclamazione di una nuova era spirituale annunciata da Aleister Crowley nel 1904, che segna l'inizio dell'Eone di Horus nel calendario thelemita.",
      en: "Commemorates the proclamation of a new spiritual era announced by Aleister Crowley in 1904, marking the start of the Aeon of Horus in the Thelemic calendar.",
      la: "Commemorat novae aetatis spiritalis proclamationem ab Aleister Crowley anno 1904 nuntiatam, initium Aeonis Hori in kalendario Thelemitico notans."
    },
    celebration: {
      it: "Si rilegge ad alta voce un capitolo del Libro della Legge e si compiono i saluti rituali all'alba, al mezzogiorno, al tramonto e a mezzanotte in onore dell'Eone di Horus.",
      en: "A chapter of The Book of the Law is read aloud, and the ritual salutations are performed at dawn, noon, sunset and midnight in honour of the Aeon of Horus.",
      la: "Caput Libri Legis alta voce relegitur, et salutationes ritales sub aurora, meridie, occasu et media nocte in honorem Aeonis Hori peraguntur."
    }
  },
  {
    id: "scrittura-legge", month: 4, day: 8, tradition: "thelema",
    name: { it: "Giorni della Scrittura della Legge", en: "Days of the Writing of the Law", la: "Dies Scriptionis Legis" },
    desc: {
      it: "Commemora i tre giorni del 1904 in cui Crowley dichiaro di aver ricevuto in dettatura 'Il Libro della Legge', testo fondante del Thelema.",
      en: "Commemorates the three days in 1904 during which Crowley claimed to have received 'The Book of the Law' by dictation, the founding text of Thelema.",
      la: "Commemorat tres dies anni 1904 quibus Crowley 'Librum Legis' dictatum accepisse professus est, textum Thelemae fundantem."
    },
    celebration: {
      it: "Nei tre giorni si rilegge un capitolo del Libro della Legge per giorno, si tiene un diario delle proprie riflessioni e si accende una candela dorata come atto di gratitudine.",
      en: "Over the three days, one chapter of The Book of the Law is read per day, a journal of personal reflections is kept, and a gold candle is lit as an act of gratitude.",
      la: "Tribus diebus unum caput Libri Legis per diem relegitur, ephemeris cogitationum servatur, et candela aurea gratiarum actionis causa accenditur."
    }
  },
  {
    id: "sumarmal", month: 4, day: 14, tradition: "norse",
    name: { it: "Sumarm\u00E1l \u2014 Primo Giorno d'Estate", en: "Sumarm\u00E1l \u2014 First Day of Summer", la: "Sumarm\u00E1l \u2014 Primus Dies Aestatis" },
    desc: {
      it: "Segna nel calendario islandese antico l'inizio della stagione estiva: si accendevano fuochi e si scambiavano doni tra vicini per propiziare mesi di luce e lavoro nei campi.",
      en: "Marks the start of summer in the old Icelandic calendar: bonfires were lit and gifts exchanged between neighbours to bless the coming months of light and fieldwork.",
      la: "In vetere kalendario Islandico initium aestatis notat: ignes accendebantur et dona inter vicinos mutabantur ut menses lucis et agri laboris propitii essent."
    },
    celebration: {
      it: "Si accendono falò all'aperto, si scambiano piccoli doni con vicini o amici e si condivide un pasto con i primi prodotti freschi della stagione.",
      en: "Bonfires are lit outdoors, small gifts are exchanged with neighbours or friends, and a meal featuring the season's first fresh produce is shared.",
      la: "Ignes sub divo accenduntur, dona parva cum vicinis vel amicis mutantur, et cena primis fructibus recentibus temporis communicatur."
    }
  },
  {
    id: "sigrblot", month: 4, day: 19, tradition: "norse",
    name: { it: "Sigrbl\u00F3t", en: "Sigrbl\u00F3t", la: "Sigrbl\u00F3tum" },
    desc: {
      it: "Bl\u00F3t norreno di inizio estate dedicato a Freyr e Odino, per garantire vittoria e prosperita nella stagione dei raccolti.",
      en: "A Norse bl\u00F3t marking the start of summer, dedicated to Freyr and Odin, invoked for victory and prosperity in the harvest season.",
      la: "Bl\u00F3tum Nordicum aestatis initio dicatum Freyro et Odino, ut victoria et prosperitas in messis tempore firmarentur."
    },
    celebration: {
      it: "Si alza un corno di idromele a Freyr e Odino chiedendo vittoria nell'anno che viene, e si condivide una cena con carne arrosto e pane di grano.",
      en: "A horn of mead is raised to Freyr and Odin, asking for victory in the coming year, and a supper of roasted meat and wheat bread is shared.",
      la: "Cornu mulsi Freyro et Odino tollitur, victoria anno venturo petita, et cena carne assa panique triticeo communicatur."
    }
  },
  {
    id: "valpurga-strega", month: 4, day: 30, tradition: "stregoneria",
    name: { it: "Notte di Valpurga", en: "Walpurgis Night", la: "Nox Valpurgis" },
    desc: {
      it: "Walpurgisnacht: secondo il folklore germanico e nordico, le streghe si radunano sui monti prima dell'arrivo di maggio.",
      en: "According to Germanic and Nordic folklore, witches gather upon the mountains on this night before May arrives.",
      la: "Secundum fabulas Germanicas et Nordicas, veneficae in montibus congregantur antequam Maius adveniat."
    },
    celebration: {
      it: "Si accende un falò all'aperto o una candela nera in casa, si preparano erbe protettive (aglio, iperico) appese alle porte, e si veglia fino a mezzanotte per salutare l'arrivo di maggio.",
      en: "A bonfire is lit outdoors or a black candle indoors, protective herbs (garlic, St. John's wort) are hung on doors, and a vigil is kept until midnight to greet May's arrival.",
      la: "Ignis sub divo vel candela nigra domi accenditur, herbae tutelares (allium, hyperici) ianuis suspenduntur, et usque ad mediam noctem vigilatur ut Maii adventus salutetur."
    }
  },
  {
    id: "valpurga-satan", month: 4, day: 30, tradition: "satanismo",
    name: { it: "Anno Uno Satanico", en: "Founding of the Church of Satan", la: "Annus Primus Satanicus" },
    desc: {
      it: "Una delle due Feste Superiori satanico-laveyane. Coincide con Valpurga e con la fondazione della Chiesa di Satana (1966).",
      en: "One of the two Satanic High Holidays. It coincides with Walpurgis Night and the founding of the Church of Satan in 1966.",
      la: "Altera e duabus Festis Superioribus Satanicis. Cum Nocte Valpurgis et Ecclesiae Satanae fundatione anno 1966 concurrit."
    },
    celebration: {
      it: "Festa Superiore laveyana: si organizza una cena o una riunione indulgente con chi si ama, si alza un calice in onore di sé stessi e della fondazione della Chiesa di Satana.",
      en: "A LaVeyan High Holiday: an indulgent supper or gathering is held with loved ones, and a glass is raised in honour of oneself and the founding of the Church of Satan.",
      la: "Altera e duabus Festis Superioribus Satanicis: cena vel conventus indulgens cum dilectis agitur, et poculum in honorem sui ipsius et fundationis Ecclesiae Satanae tollitur."
    }
  },
  {
    id: "beltane", month: 5, day: 1, tradition: "wicca",
    name: { it: "Beltane", en: "Beltane", la: "Beltanum" },
    desc: {
      it: "Sabbat maggiore che celebra l'unione tra il Dio e la Dea, la fertilita e la vita: fuochi rituali, danze e il Palo di Maggio.",
      en: "A major Sabbat celebrating the union of the God and Goddess, fertility and life: ritual fires, dancing and the Maypole.",
      la: "Sabbatum maius unionem Dei et Deae, fecunditatem et vitam celebrans: ignes ritales, saltationes, et hasta Maialis."
    },
    celebration: {
      it: "Si accendono due fuochi rituali da attraversare o tra cui passare per purificazione, si intreccia il Palo di Maggio con nastri colorati e si condivide un banchetto all'aperto con miele e frutti rossi.",
      en: "Two ritual fires are lit to walk between for purification, the Maypole is woven with colourful ribbons, and an outdoor feast of honey and red fruits is shared.",
      la: "Duo ignes ritales accenduntur inter quos ad purgationem transitur, hasta Maialis vittis coloratis nectitur, et convivium sub divo melle et fructibus rubris communicatur."
    }
  },
  {
    id: "tavola-smeraldo", month: 5, day: 6, tradition: "ermetismo",
    name: { it: "Giorno della Tavola di Smeraldo", en: "Emerald Tablet Day", la: "Dies Tabulae Smaragdinae" },
    desc: {
      it: "Data moderna dedicata al testo alchemico piu enigmatico e influente, la Tabula Smaragdina, riassunto nella formula 'come sopra, cosi sotto'.",
      en: "A modern date dedicated to the most enigmatic and influential alchemical text, the Emerald Tablet, summarized in the formula 'as above, so below'.",
      la: "Dies modernus dicatus textui alchemico maxime aenigmatico et gravi, Tabulae Smaragdinae, sententia 'sicut supra, sic infra' comprehenso."
    },
    celebration: {
      it: "Si rilegge la Tavola di Smeraldo ad alta voce, si medita sulla formula 'come sopra, così sotto' davanti a una candela verde, e si annota nel proprio diario alchemico una corrispondenza personale tra macrocosmo e microcosmo.",
      en: "The Emerald Tablet is read aloud, one meditates on 'as above, so below' before a green candle, and a personal correspondence between macrocosm and microcosm is noted in one's alchemical journal.",
      la: "Tabula Smaragdina alta voce relegitur, de sententia 'sicut supra, sic infra' ante candelam viridem meditatur, et correspondentia propria inter macrocosmum et microcosmum in ephemeride alchemica notatur."
    }
  },
  {
    id: "thargelia", month: 5, day: 7, tradition: "ellenismo",
    name: { it: "Targelie", en: "Thargelia", la: "Thargelia" },
    desc: {
      it: "Festa di purificazione dedicata ad Apollo e Artemide, con offerte delle primizie del raccolto e riti di espiazione per la citta.",
      en: "A purification festival dedicated to Apollo and Artemis, with offerings of the harvest's first fruits and rites of civic atonement.",
      la: "Festivitas purgationis Apollini et Dianae dicata, primitiis messis oblatis et ritibus expiationis civitatis."
    },
    celebration: {
      it: "Si offrono le prime spighe o frutti dell'anno su un piccolo altare ad Apollo e Artemide, e si prepara un pasto di purificazione con pane d'orzo e miele.",
      en: "The year's first grain or fruit is offered on a small altar to Apollo and Artemis, and a purifying meal of barley bread and honey is prepared.",
      la: "Primae spicae vel fructus anni in ara parva Apollini et Dianae offeruntur, et cena purgationis pane hordeaceo et melle paratur."
    }
  },
  {
    id: "litha", month: 6, day: 21, tradition: "wicca",
    name: { it: "Litha", en: "Litha", la: "Litha" },
    desc: {
      it: "Solstizio d'estate: apice della luce solare e dell'abbondanza, sabbat minore dedicato al sole al suo massimo splendore.",
      en: "The summer solstice: the peak of sunlight and abundance, a minor Sabbat honouring the sun at its brightest.",
      la: "Solstitium aestivum: culmen lucis solaris et abundantiae, sabbatum minus soli in maximo fulgore dicatum."
    },
    celebration: {
      it: "Si accende un grande falò al tramonto e lo si salta per fortuna, si intrecciano corone di fiori solari (calendula, girasole) e si condivide un banchetto all'aperto fino all'alba successiva.",
      en: "A great bonfire is lit at sunset and leapt over for luck, wreaths of sun-flowers (marigold, sunflower) are woven, and an outdoor feast is shared through to the following dawn.",
      la: "Magnus ignis sub occasu accenditur et ad fortunam transilitur, coronae florum solarium (calendulae, helianthi) nectuntur, et convivium sub divo usque ad auroram sequentem communicatur."
    }
  },
  {
    id: "alban-hefin", month: 6, day: 21, tradition: "druidismo",
    name: { it: "Alban Hefin", en: "Alban Hefin", la: "Alban Hefin" },
    desc: {
      it: "'Luce dell'Estate': solstizio celebrato dai druidi moderni con veglie all'alba presso cerchi di pietre, in onore del sole al suo apice.",
      en: "'Light of Summer': the solstice observed by modern Druids with dawn vigils at stone circles, honouring the sun at its height.",
      la: "'Lux Aestatis': solstitium a Druidibus modernis vigiliis sub aurora apud lapidum circulos celebratum, soli in culmine dicatum."
    },
    celebration: {
      it: "Veglia all'alba presso un cerchio di pietre o in un luogo naturale elevato, con offerte di fiori e acqua, seguita da una colazione condivisa al sorgere del sole.",
      en: "A dawn vigil at a stone circle or elevated natural place, with offerings of flowers and water, followed by a shared breakfast at sunrise.",
      la: "Vigilia sub aurora apud lapidum circulum vel locum naturalem editum, floribus et aqua oblatis, secuta ientaculo communicato sub ortu solis."
    }
  },
  {
    id: "solstizio-satan-estivo", month: 6, day: 21, tradition: "satanismo",
    name: { it: "Solstizio d'Estate (Satanico)", en: "Summer Solstice (Satanic)", la: "Solstitium Aestivum Satanicum" },
    desc: {
      it: "Giorno di celebrazione minore indicato ne 'La Bibbia di Satana': i mutamenti di stagione sono occasioni per rituali personali di indulgenza, non per devozione a un dio.",
      en: "A lesser celebration day listed in The Satanic Bible: seasonal turning points are occasions for personal, indulgent ritual rather than devotion to a god.",
      la: "Dies celebrationis minoris in 'Biblia Satanae' commemoratus: temporum mutationes occasiones sunt ritus personalis et indulgentiae, non devotionis erga deum."
    },
    celebration: {
      it: "Celebrazione personale e indulgente: si sceglie un piacere concesso a sé stessi (un pasto raffinato, un'uscita, un regalo) come rito di autoaffermazione, senza cerimonie collettive obbligate.",
      en: "A personal, indulgent celebration: a pleasure is granted to oneself (a fine meal, an outing, a gift) as a rite of self-affirmation, with no obligatory collective ceremony.",
      la: "Celebratio personalis et indulgens: voluptas sibi conceditur (cena lauta, excursio, donum) ut ritus sui ipsius affirmationis, sine caerimonia collectiva necessaria."
    }
  },
  {
    id: "san-giovanni", month: 6, day: 23, tradition: "stregoneria",
    name: { it: "Notte di San Giovanni", en: "St. John's Eve", la: "Nox Sancti Ioannis" },
    desc: {
      it: "Sopravvivenza pagana sul calendario cristiano: notte di erbe magiche, rugiada rituale e falo contro il malocchio.",
      en: "A pagan survival within the Christian calendar: a night of magical herbs, ritual dew and bonfires against the evil eye.",
      la: "Superstitio pagana in calendario Christiano: nox herbarum magicarum, roris ritalis, et ignium contra fascinum."
    },
    celebration: {
      it: "Si raccolgono erbe magiche (iperico, verbena, ruta) prima dell'alba bagnate di rugiada, si prepara l'olio o l'acqua di San Giovanni, e si accende un falò da saltare contro il malocchio.",
      en: "Magical herbs (St. John's wort, vervain, rue) are gathered before dawn while still dewy, St. John's oil or water is prepared, and a bonfire is lit to leap over against the evil eye.",
      la: "Herbae magicae (hyperici, verbenae, rutae) ante auroram rore madidae colliguntur, oleum vel aqua Sancti Ioannis paratur, et ignis accenditur ad transiliendum contra fascinum."
    }
  },
  {
    id: "kupala", month: 6, day: 24, tradition: "slavismo",
    name: { it: "Notte di Kupala", en: "Kupala Night", la: "Nox Kupalae" },
    desc: {
      it: "Notte del solstizio d'estate: fuochi rituali, corone di fiori sull'acqua e la leggendaria ricerca del fiore di felce che fiorisce una sola notte l'anno.",
      en: "The night of the summer solstice: ritual bonfires, flower wreaths set on the water, and the legendary search for the fern flower that blooms only once a year.",
      la: "Nox solstitii aestivi: ignes ritales, coronae florum in aqua positae, et legendaria quaestio floris filicis qui semel in anno florescit."
    },
    celebration: {
      it: "Si intrecciano corone di fiori da lasciare galleggiare sull'acqua di un fiume o lago, si salta il falò in coppia tenendosi per mano, e ci si avventura nel bosco a cercare (simbolicamente) il fiore di felce.",
      en: "Flower wreaths are woven to set afloat on a river or lake, the bonfire is leapt over in pairs holding hands, and one ventures into the forest to (symbolically) search for the fern flower.",
      la: "Coronae florum nectuntur ut in fluvio vel lacu innatent, ignis a paribus manibus iunctis transilitur, et in silvam itur ut flos filicis symbolice quaeratur."
    }
  },
  {
    id: "saut-deau", month: 7, day: 16, tradition: "vodou",
    name: { it: "Pellegrinaggio di Saut-d'Eau", en: "Saut-d'Eau Pilgrimage", la: "Peregrinatio Saut-d'Eau" },
    desc: {
      it: "Migliaia di fedeli si bagnano sotto una cascata sacra a Ezili Dant\u00F2, Iwa della protezione materna sincretizzata con la Vergine del Carmine.",
      en: "Thousands of the faithful bathe beneath a sacred waterfall dedicated to Ezili Dant\u00F2, the Iwa of maternal protection syncretized with Our Lady of Mount Carmel.",
      la: "Multa milia fidelium sub sacro cataracta Ezili Dant\u00F2 balneantur, Iwae tutelae maternae, cum Beata Virgine de Monte Carmelo syncretizatae."
    },
    celebration: {
      it: "Ci si bagna sotto un'acqua corrente (cascata, fiume o anche la doccia) offrendo fiori bianchi e azzurri a Ezili Dantò, e si accende una candela blu per la protezione materna.",
      en: "One bathes under running water (a waterfall, river, or even the shower), offering white and blue flowers to Ezili Dantò, and a blue candle is lit for maternal protection.",
      la: "Sub aqua currenti (cataracta, flumine, vel etiam lavacro) balneatur, floribus albis et caeruleis Ezili Dantò oblatis, et candela caerulea pro tutela materna accenditur."
    }
  },
  {
    id: "fet-ogou", month: 7, day: 25, tradition: "vodou",
    name: { it: "F\u00E8t Ogou", en: "F\u00E8t Ogou", la: "Festum Ogou" },
    desc: {
      it: "Festa dedicata a Ogou, Iwa guerriero del ferro e del fuoco, sincretizzato con San Giacomo: si onora la sua forza protettrice e il suo temperamento fiero.",
      en: "A festival honouring Ogou, the warrior Iwa of iron and fire, syncretized with St. James: his protective strength and fierce temper are honoured.",
      la: "Festivitas Ogou dicata, Iwae bellatori ferri et ignis, cum Sancto Iacobo syncretizato: eius vis tutelaris et animus ferox honorantur."
    },
    celebration: {
      it: "Si prepara un piatto piccante e speziato in suo onore, si indossa qualcosa di rosso, e si accende una candela rossa chiedendo forza e protezione.",
      en: "A spicy, fiery dish is prepared in his honour, something red is worn, and a red candle is lit asking for strength and protection.",
      la: "Cibus acer et conditus in eius honorem paratur, aliquid rubrum induitur, et candela rubra accenditur vis ac tutela petita."
    }
  },
  {
    id: "perun", month: 8, day: 2, tradition: "slavismo",
    name: { it: "Giorno di Perun", en: "Perun's Day", la: "Dies Peruni" },
    desc: {
      it: "Onora Perun, dio slavo del tuono e della guerra: si accendevano fuochi in altura e si offrivano sacrifici di grano per attirare la sua protezione.",
      en: "Honours Perun, the Slavic god of thunder and war: fires were lit on hilltops and grain offerings made to invoke his protection.",
      la: "Perunum honorat, deum Slavicum tonitrus et belli: ignes in collibus accendebantur et frumenti oblationes fiebant ut eius tutela invocaretur."
    },
    celebration: {
      it: "Si accende un fuoco su un'altura o in giardino, si offre pane e grano, e si versa un po' di birra sulla terra invocando protezione dai temporali.",
      en: "A fire is lit on high ground or in the garden, bread and grain are offered, and a little beer is poured on the earth invoking protection from storms.",
      la: "Ignis in colle vel horto accenditur, panis et frumentum offeruntur, et paulum cerevisiae in terram funditur tutela a tempestatibus invocata."
    }
  },
  {
    id: "wep-ronpet", month: 8, day: 3, tradition: "kemetismo",
    name: { it: "Wep Ronpet \u2014 Capodanno Egizio", en: "Wep Ronpet \u2014 Egyptian New Year", la: "Wep Ronpet \u2014 Annus Novus Aegyptius" },
    desc: {
      it: "Nell'antico Egitto coincideva con il levarsi eliaco di Sirio e la piena del Nilo: rinascita del mondo e nuovo ciclo agricolo sotto Ra.",
      en: "In ancient Egypt it coincided with the heliacal rising of Sirius and the Nile flood: the rebirth of the world and a new agricultural cycle under Ra.",
      la: "In antiquo Aegypto cum ortu heliaco Sirii et Nili inundatione concurrebat: mundi renascentia et novus cyclus agricolus sub Ra."
    },
    celebration: {
      it: "Si pulisce a fondo la casa per accogliere il nuovo ciclo, si prepara un pasto con pane, birra e datteri, e si versa un'offerta d'acqua in onore di Ra.",
      en: "The home is thoroughly cleaned to welcome the new cycle, a meal of bread, beer and dates is prepared, and a water offering is poured in honour of Ra.",
      la: "Domus penitus purgatur ut novus cyclus accipiatur, cena pane, cerevisia, et palmulis paratur, et oblatio aquae in honorem Ra funditur."
    }
  },
  {
    id: "ermete-trismegisto", month: 8, day: 3, tradition: "ermetismo",
    name: { it: "Festa di Ermete Trismegisto", en: "Feast of Hermes Trismegistus", la: "Festum Hermetis Trismegisti" },
    desc: {
      it: "Data simbolica moderna in cui i circoli ermetici onorano Ermete Trismegisto, autore leggendario del Corpus Hermeticum e patrono dell'alchimia e della magia.",
      en: "A modern symbolic date on which Hermetic circles honour Hermes Trismegistus, the legendary author of the Corpus Hermeticum and patron of alchemy and magic.",
      la: "Dies symbolicus modernus quo circuli Hermetici Hermetem Trismegistum honorant, Corporis Hermetici auctorem legendarium et alchimiae magiaeque patronum."
    },
    celebration: {
      it: "Si legge un passo del Corpus Hermeticum, si prepara un piccolo altare con specchio e candela dorata, e si scrive un proposito personale di trasformazione alchemica.",
      en: "A passage from the Corpus Hermeticum is read, a small altar with a mirror and gold candle is set, and a personal intention of alchemical transformation is written down.",
      la: "Locus Corporis Hermetici legitur, ara parva speculo et candela aurea instruitur, et propositum personale transformationis alchemicae scribitur."
    }
  },
  {
    id: "freyfaxi", month: 8, day: 1, tradition: "norse",
    name: { it: "Freyfaxi", en: "Freyfaxi", la: "Freyfaxi" },
    desc: {
      it: "Festa di ringraziamento norrena dedicata a Freyr, dio della fertilita: corse di cavalli e il primo grano mietuto.",
      en: "A Norse thanksgiving feast dedicated to Freyr, god of fertility: horse races and the first reaped grain.",
      la: "Norrena gratiarum actio Freyro, fecunditatis deo, dicata: certamina equorum et primae messis frumentum."
    },
    celebration: {
      it: "Si condivide il primo pane fatto con il grano appena raccolto, si organizzano piccole gare o giochi in cortile, e si alza un corno di idromele a Freyr.",
      en: "The first bread made from freshly harvested grain is shared, small races or games are held in the yard, and a horn of mead is raised to Freyr.",
      la: "Primus panis frumento recens messo confectus communicatur, parva certamina vel ludi in area aguntur, et cornu mulsi Freyro tollitur."
    }
  },
  {
    id: "lughnasadh", month: 8, day: 1, tradition: "wicca",
    name: { it: "Lughnasadh", en: "Lughnasadh", la: "Lughnasadum" },
    desc: {
      it: "Primo sabbat del raccolto: si onora il grano e il sacrificio del dio del grano. Pane rituale e mercati stagionali celtici.",
      en: "The first harvest Sabbat: honouring the grain and the sacrifice of the grain god, with ritual bread and Celtic seasonal markets.",
      la: "Primum messis sabbatum: frumentum et sacrificium dei frumenti honorantur, pane ritali et mercatibus Celticis temporariis."
    },
    celebration: {
      it: "Si prepara e si condivide pane rituale fatto in casa, si organizza un piccolo mercato o scambio con amici, e si intrecciano spighe di grano come amuleto per l'anno.",
      en: "Home-baked ritual bread is prepared and shared, a small market or exchange is held with friends, and wheat sheaves are woven as an amulet for the year.",
      la: "Panis ritalis domi coctus paratur et communicatur, parvum forum vel mutatio cum amicis agitur, et manipuli tritici in amuletum anni nectuntur."
    }
  },
  {
    id: "ecate", month: 8, day: 13, tradition: "stregoneria",
    name: { it: "Notte di Ecate", en: "Night of Hecate", la: "Nox Hecatae" },
    desc: {
      it: "Devozione moderna a Ecate, dea dei crocevia e della magia lunare: candele accese ai trivi in suo onore.",
      en: "A modern devotion to Hecate, goddess of crossroads and lunar magic: candles lit at crossroads in her honour.",
      la: "Moderna devotio Hecatae, deae compitorum et magiae lunaris: candelae in compitis eius honori accensae."
    },
    celebration: {
      it: "Si accendono tre candele nere a un trivio o crocevia (reale o simbolico in casa), e si lascia un'offerta di uova, pane o miele ai piedi di una porta di ingresso.",
      en: "Three black candles are lit at a crossroads (real or symbolic, at home), and an offering of eggs, bread or honey is left at the threshold of an entryway.",
      la: "Tres candelae nigrae in compito (vero vel symbolico domi) accenduntur, et oblatio ovorum, panis vel mellis ad limen ianuae relinquitur."
    }
  },
  {
    id: "panathenaia", month: 8, day: 15, tradition: "ellenismo",
    name: { it: "Panatenee", en: "Panathenaia", la: "Panathenaea" },
    desc: {
      it: "La maggiore festa di Atene in onore di Atena: processione solenne, giochi atletici e l'offerta di un nuovo peplo alla statua della dea.",
      en: "Athens' greatest festival, honouring Athena: a solemn procession, athletic games, and the offering of a new robe to the goddess's statue.",
      la: "Maxima Athenarum festivitas Minervae dicata: sollemnis pompa, ludi athletici, et novae vestis oblatio deae simulacro."
    },
    celebration: {
      it: "Si offre un panno o una piccola veste tessuta a mano su un altare ad Atena, e si organizza una gara amichevole (sportiva o intellettuale) in suo onore.",
      en: "A hand-woven cloth or small garment is offered on an altar to Athena, and a friendly contest (athletic or intellectual) is held in her honour.",
      la: "Pannus vel vestis parva manu texta in ara Minervae offertur, et certamen amicum (athleticum vel intellectuale) in eius honorem agitur."
    }
  },
  {
    id: "yemaya", month: 9, day: 7, tradition: "santeria",
    name: { it: "Festa di Yemay\u00E1", en: "Feast of Yemay\u00E1", la: "Festum Yemay\u00E1" },
    desc: {
      it: "Onora Yemay\u00E1, Orisha del mare e madre di tutti gli Orisha, sincretizzata con la Virgen de Regla: offerte di melone e fiori bianchi gettate nell'oceano.",
      en: "Honours Yemay\u00E1, Orisha of the sea and mother of all Orisha, syncretized with the Virgen de Regla: offerings of melon and white flowers are cast into the ocean.",
      la: "Yemay\u00E1 honorat, Orisham maris et matrem omnium Orisharum, cum Virgine de Regla syncretizatam: melonis et florum candidorum oblationes in oceanum iaciuntur."
    },
    celebration: {
      it: "Ci si reca sulla riva del mare (o si porta dell'acqua salata in casa) e si offrono meloni e fiori bianchi affidandoli alle onde, indossando blu e bianco in suo onore.",
      en: "One goes to the seashore (or brings salt water home) and offers melons and white flowers to the waves, wearing blue and white in her honour.",
      la: "Ad litus maris itur (vel aqua salsa domum affertur) et meloni floresque candidi undis committuntur, caeruleo et albo in eius honorem indutis."
    }
  },
  {
    id: "ochun", month: 9, day: 8, tradition: "santeria",
    name: { it: "D\u00EDa de la Caridad del Cobre (Och\u00FAn)", en: "D\u00EDa de la Caridad del Cobre (Och\u00FAn)", la: "Dies Caritatis del Cobre (Och\u00FAn)" },
    desc: {
      it: "Celebra Och\u00FAn, Orisha dell'amore e dei fiumi, sincretizzata con la Virgen de la Caridad del Cobre: miele e girasoli come offerte tradizionali.",
      en: "Celebrates Och\u00FAn, Orisha of love and rivers, syncretized with the Virgen de la Caridad del Cobre: honey and sunflowers are the traditional offerings.",
      la: "Och\u00FAn celebrat, Orisham amoris et fluminum, cum Virgine Caritatis del Cobre syncretizatam: mel et helianthos oblationes traditae."
    },
    celebration: {
      it: "Si offrono miele e girasoli su un piccolo altare dorato, si indossa qualcosa di giallo, e si prepara un dolce con zucca o miele in suo onore.",
      en: "Honey and sunflowers are offered on a small gilded altar, something yellow is worn, and a pumpkin or honey sweet is prepared in her honour.",
      la: "Mel et helianthi in ara parva deaurata offeruntur, aliquid flavum induitur, et dulce cucurbita vel melle in eius honorem paratur."
    }
  },
  {
    id: "mabon", month: 9, day: 21, tradition: "wicca",
    name: { it: "Mabon", en: "Mabon", la: "Mabon" },
    desc: {
      it: "Equinozio d'autunno: secondo sabbat del raccolto, gratitudine per l'abbondanza prima del buio crescente dell'inverno.",
      en: "The autumn equinox: the second harvest Sabbat, gratitude for abundance before winter's growing dark.",
      la: "Aequinoctium autumnale: secundum messis sabbatum, gratiarum actio pro copia ante tenebras hiemis crescentes."
    },
    celebration: {
      it: "Si prepara una cena del raccolto con verdure di stagione, mele e pane fatto in casa, si ringrazia ad alta voce per l'abbondanza dell'anno e si conservano semi per la primavera.",
      en: "A harvest supper of seasonal vegetables, apples and home-baked bread is prepared, gratitude for the year's abundance is spoken aloud, and seeds are saved for spring.",
      la: "Cena messis oleribus temporariis, malis, panique domi cocto paratur, gratiae pro anni copia voce dictae aguntur, et semina veri servantur."
    }
  },
  {
    id: "alban-elfed", month: 9, day: 21, tradition: "druidismo",
    name: { it: "Alban Elfed", en: "Alban Elfed", la: "Alban Elfed" },
    desc: {
      it: "'Luce dell'Acqua': equinozio d'autunno, tempo di gratitudine per il raccolto e di riflessione sull'equilibrio prima del declino della luce.",
      en: "'Light of the Water': the autumn equinox, a time of gratitude for the harvest and reflection on balance before the light wanes.",
      la: "'Lux Aquae': aequinoctium autumnale, tempus gratiarum pro messe et meditationis de aequilibrio ante lucis discessum."
    },
    celebration: {
      it: "Si compie una passeggiata di raccolta (foglie, ghiande, frutti selvatici) da portare a casa, e si medita sull'equilibrio tra ciò che si è ricevuto e ciò che si è dato durante l'anno.",
      en: "A gathering walk is taken (leaves, acorns, wild fruits) to bring home, and one reflects on the balance between what has been received and given through the year.",
      la: "Ambulatio collectionis fit (folia, glandes, fructus silvestres) domum ferenda, et de aequilibrio inter accepta et data per annum meditatur."
    }
  },
  {
    id: "vetrnaetr", month: 10, day: 14, tradition: "norse",
    name: { it: "Vetrn\u00E6tr \u2014 Notti d'Inverno", en: "Vetrn\u00E6tr \u2014 Winter Nights", la: "Vetrn\u00E6tr \u2014 Noctes Hibernae" },
    desc: {
      it: "Rito di passaggio alla stagione fredda, dedicato alle Disir, spiriti femminili ancestrali, e alla protezione della casa.",
      en: "A rite of passage into the cold season, dedicated to the Disir, ancestral female spirits, and to the protection of the home.",
      la: "Ritus transitus in tempus frigidum, Disis \u2014 spiritibus femininis maiorum \u2014 dicatus et domus tutelae."
    },
    celebration: {
      it: "Si prepara la casa per l'inverno (legna, provviste) e si lascia un piccolo piatto di cibo fuori dalla porta o su una mensola come offerta alle Dísir.",
      en: "The home is readied for winter (firewood, stores), and a small dish of food is left outside the door or on a shelf as an offering to the Dísir.",
      la: "Domus ad hiemem paratur (ligna, apparatus), et parvus discus cibi extra ianuam vel in pluteo ut oblatio Disis relinquitur."
    }
  },
  {
    id: "festa-profeta", month: 10, day: 12, tradition: "thelema",
    name: { it: "Festa per il Profeta e la sua Sposa", en: "Feast for the Prophet and his Bride", la: "Festum Prophetae et Sponsae" },
    desc: {
      it: "Celebra la nascita di Aleister Crowley (12 ottobre 1875), 'il Profeta' del Thelema, una delle otto feste stagionali indicate ne 'Il Libro della Legge'.",
      en: "Celebrates the birth of Aleister Crowley (12 October 1875), 'the Prophet' of Thelema, one of the eight seasonal feasts listed in The Book of the Law.",
      la: "Natalem Aleister Crowley celebrat (die 12 Octobris 1875), 'Prophetae' Thelemae, unum ex octo festis temporariis in Libro Legis commemoratis."
    },
    celebration: {
      it: "Si rilegge un passo scritto da Crowley, si accende una candela viola, e si alza un calice in onore del Profeta e della sua Sposa Scarlatta.",
      en: "A passage written by Crowley is read, a purple candle is lit, and a glass is raised in honour of the Prophet and his Scarlet Woman.",
      la: "Locus a Crowley scriptus relegitur, candela purpurea accenditur, et poculum in honorem Prophetae Sponsaeque Coccineae tollitur."
    }
  },
  {
    id: "alfablot", month: 10, day: 20, tradition: "norse",
    name: { it: "\u00C1lfabl\u00F3t", en: "\u00C1lfabl\u00F3t", la: "\u00C1lfabl\u00F3tum" },
    desc: {
      it: "Rito privato e domestico in onore degli elfi e degli antenati, celebrato in autunno porta a porta senza estranei presenti, a protezione della casa per l'inverno.",
      en: "A private, household rite honouring the elves and ancestors, held in autumn door to door with no outsiders present, to protect the home through winter.",
      la: "Ritus privatus ac domesticus, Alfis et maioribus dicatus, autumno ostiatim sine alienis celebratus, ut domus per hiemem tutaretur."
    },
    celebration: {
      it: "Rito privato senza estranei: si va di porta in porta della propria casa lasciando piccole offerte (pane, idromele) agli elfi e agli antenati, senza raccontarlo fuori dalla famiglia.",
      en: "A private rite with no outsiders: one goes door to door within one's own home leaving small offerings (bread, mead) to the elves and ancestors, kept within the family.",
      la: "Ritus privatus sine alienis: ostiatim intra domum propriam itur, oblationibus parvis (pane, mulso) Alfis maioribusque relictis, intra familiam servatis."
    }
  },
  {
    id: "samhain", month: 10, day: 31, tradition: "wicca",
    name: { it: "Samhain", en: "Samhain", la: "Samhain" },
    desc: {
      it: "Capodanno celtico e sabbat maggiore: il velo tra i mondi e sottile, si onorano gli antenati. Origine di Halloween.",
      en: "The Celtic New Year and a major Sabbat: the veil between worlds grows thin, and the ancestors are honoured. Origin of Halloween.",
      la: "Annus novus Celticus et sabbatum maius: velum inter mundos tenue fit, maiores honorantur. Origo festi Halloween."
    },
    celebration: {
      it: "Si allestisce un altare per gli antenati con foto e oggetti cari, si lascia un piatto vuoto a tavola per i defunti, e si organizza una cena silenziosa o una veglia con candele nere e arancioni.",
      en: "An ancestor altar is set with photos and cherished objects, an empty plate is left at the table for the dead, and a silent supper or vigil is held with black and orange candles.",
      la: "Ara maioribus instruitur imaginibus et rebus caris, discus vacuus mensae pro mortuis relinquitur, et cena tacita vel vigilia candelis nigris et fulvis agitur."
    }
  },
  {
    id: "notte-streghe", month: 10, day: 31, tradition: "stregoneria",
    name: { it: "Notte delle Streghe", en: "Witches' Night", la: "Nox Veneficarum" },
    desc: {
      it: "Notte per eccellenza della stregoneria popolare: divinazione, protezione e comunicazione con i morti, erede di Samhain.",
      en: "The witches' night par excellence in folk tradition: divination, protection and communion with the dead, heir to Samhain.",
      la: "Nox veneficarum popularis par excellentia: divinatio, tutela, et cum mortuis communicatio, Samhain heres."
    },
    celebration: {
      it: "Si pratica divinazione (tarocchi, specchio nero, fondi di caffè), si accende una candela per ogni antenato che si desidera onorare, e ci si protegge la casa con sale sulle soglie.",
      en: "Divination is practised (tarot, black mirror, coffee grounds), a candle is lit for each ancestor one wishes to honour, and the home is protected with salt at the thresholds.",
      la: "Divinatio exercetur (tarocchis, speculo nigro, faece cafeae), candela pro quoque maiore honorando accenditur, et domus sale in liminibus tuetur."
    }
  },
  {
    id: "halloween-satan", month: 10, day: 31, tradition: "satanismo",
    name: { it: "Halloween Satanico", en: "Satanic Halloween", la: "Halloween Satanicum" },
    desc: {
      it: "Seconda Festa Superiore laveyana: la notte piu importante dopo il proprio compleanno, trionfo dell'oscurita e dell'indulgenza.",
      en: "The second Satanic High Holiday: the most important night after one's own birthday, a triumph of darkness and indulgence.",
      la: "Secunda Festa Superior Laveyana: nox post proprium natalem gravissima, tenebrarum et indulgentiae triumphus."
    },
    celebration: {
      it: "Seconda Festa Superiore: si organizza una festa o cena indulgente con travestimenti e piaceri concessi, celebrando l'oscurità come parte accettata di sé senza sensi di colpa.",
      en: "The second High Holiday: an indulgent party or supper is held with costumes and permitted pleasures, celebrating darkness as an accepted part of oneself without guilt.",
      la: "Secunda Festa Superior: convivium vel cena indulgens cum vestibus fictis et voluptatibus concessis agitur, tenebris tamquam parte sui accepta sine culpa celebratis."
    }
  },
  {
    id: "fet-gede", month: 11, day: 2, tradition: "vodou",
    name: { it: "F\u00E8t Gede", en: "F\u00E8t Gede", la: "Festum Gede" },
    desc: {
      it: "Festa haitiana dei morti in onore degli Spiriti Gede, guardiani del cimitero: danze, rum al peperoncino e umorismo irriverente per onorare gli antenati.",
      en: "A Haitian festival of the dead honouring the Gede spirits, guardians of the cemetery: dancing, pepper-rum and irreverent humour to honour the ancestors.",
      la: "Haitiana mortuorum festivitas, Spiritibus Gede, coemeterii custodibus, dicata: saltationes, rhum piperatum, et iocus irreverens maiores honorantes."
    },
    celebration: {
      it: "Si prepara un piatto piccante con rum al peperoncino, si indossano viola e nero, e si racconta agli antenati con umorismo e affetto le storie della famiglia.",
      en: "A spicy dish with pepper-rum is prepared, purple and black are worn, and family stories are told to the ancestors with humour and affection.",
      la: "Cibus acer cum rhum piperato paratur, purpureum et nigrum induuntur, et fabulae familiae maioribus cum ioco et affectu narrantur."
    }
  },
  {
    id: "einherjar", month: 11, day: 11, tradition: "norse",
    name: { it: "Einherjar", en: "Einherjar", la: "Einherjar" },
    desc: {
      it: "Festa moderna asatru in onore dei caduti e degli antenati guerrieri, gli Einherjar del Valhalla.",
      en: "A modern Asatru feast honouring the fallen and warrior ancestors, the Einherjar of Valhalla.",
      la: "Moderna festivitas Asatru, occisis et maioribus bellatoribus dicata, Einherjis Valhallae."
    },
    celebration: {
      it: "Si alza un corno di idromele in onore dei caduti e degli antenati guerrieri, raccontandone a voce alta i nomi e le gesta se conosciuti.",
      en: "A horn of mead is raised in honour of the fallen and warrior ancestors, their names and deeds spoken aloud if known.",
      la: "Cornu mulsi in honorem occisorum et maiorum bellatorum tollitur, nominibus factisque, si nota sunt, voce dictis."
    }
  },
  {
    id: "opet", month: 11, day: 15, tradition: "kemetismo",
    name: { it: "Festival di Opet", en: "Opet Festival", la: "Festum Opet" },
    desc: {
      it: "Grande festa tebana in onore di Amon, Mut e Khonsu: le statue divine viaggiavano in processione fluviale da Karnak a Luxor.",
      en: "A great Theban festival honouring Amun, Mut and Khonsu: the divine statues travelled in river procession from Karnak to Luxor.",
      la: "Magna Thebana festivitas Ammoni, Mut et Khonso dicata: simulacra divina in pompa fluviali a Karnak ad Luxor ferebantur."
    },
    celebration: {
      it: "Si allestisce una piccola processione simbolica in casa portando una statuetta o immagine sacra da una stanza all'altra, e si condivide un pasto festivo con birra e pane.",
      en: "A small symbolic procession is held at home, carrying a statuette or sacred image from room to room, and a festive meal of beer and bread is shared.",
      la: "Parva pompa symbolica domi agitur, statuncula vel imagine sacra de cubiculo in cubiculum lata, et cena festiva cerevisia panique communicatur."
    }
  },
  {
    id: "mothernight", month: 12, day: 20, tradition: "norse",
    name: { it: "Notte della Madre", en: "Mother Night", la: "Nox Matris" },
    desc: {
      it: "Apre lo J\u00F3l: veglia della notte piu lunga in onore delle antenate prima della rinascita del sole.",
      en: "Opens Yule: a vigil on the longest night, honouring the foremothers before the sun's rebirth.",
      la: "I\u00F3lum aperit: vigilia noctis longissimae, maioribus feminis dicata ante solis renascentiam."
    },
    celebration: {
      it: "Si veglia fino a tardi con candele accese in onore delle antenate, si racconta la storia della propria famiglia materna, e si lascia una candela accesa tutta la notte.",
      en: "One keeps vigil late with lit candles in honour of the foremothers, tells the story of one's maternal family line, and leaves a candle burning through the night.",
      la: "Usque sero vigilatur candelis accensis in honorem maiorum feminarum, historia lineae maternae familiae narratur, et candela tota nocte ardens relinquitur."
    }
  },
  {
    id: "yule", month: 12, day: 21, tradition: "wicca",
    name: { it: "Yule", en: "Yule", la: "I\u00F3lum" },
    desc: {
      it: "Solstizio d'inverno: la notte piu lunga, rinascita del sole. Sabbat minore di luce e speranza nel cuore del buio.",
      en: "The winter solstice: the longest night, the sun's rebirth. A minor Sabbat of light and hope at the heart of darkness.",
      la: "Solstitium hibernum: nox longissima, solis renascentia. Sabbatum minus lucis et spei in tenebrarum corde."
    },
    celebration: {
      it: "Si accende un ceppo di legno decorato (Yule log) nel camino o simbolicamente con candele, si decora la casa con sempreverdi, e si condivide una cena festiva in famiglia augurando il ritorno della luce.",
      en: "A decorated Yule log is burned in the hearth or symbolically with candles, the home is decked with evergreens, and a festive family supper is shared, wishing for the light's return.",
      la: "Truncus Iolinus ornatus in foco vel candelis symbolice ardet, domus semperviridibus ornatur, et cena festiva in familia communicatur, reditu lucis exoptato."
    }
  },
  {
    id: "alban-arthan", month: 12, day: 21, tradition: "druidismo",
    name: { it: "Alban Arthan", en: "Alban Arthan", la: "Alban Arthan" },
    desc: {
      it: "'Luce d'Inverno': solstizio invernale druidico, veglia della notte piu lunga in attesa della rinascita del sole, spesso presso Stonehenge.",
      en: "'Light of Winter': the Druidic winter solstice, a vigil on the longest night awaiting the sun's rebirth, often held at Stonehenge.",
      la: "'Lux Hiemis': solstitium hibernum Druidicum, vigilia noctis longissimae solis renascentiam exspectans, saepe apud Stonehenge acta."
    },
    celebration: {
      it: "Veglia notturna, spesso presso un cerchio di pietre, in attesa dell'alba più lunga, seguita da un pasto condiviso al levar del sole con vischio e agrifoglio come decorazioni.",
      en: "A night vigil, often at a stone circle, awaiting the longest dawn, followed by a shared meal at sunrise with mistletoe and holly as decorations.",
      la: "Vigilia nocturna, saepe apud lapidum circulum, auroram longissimam exspectans, secuta cena communicata sub ortu solis viscoque et ilice ornata."
    }
  },
  {
    id: "solstizio-satan-invernale", month: 12, day: 21, tradition: "satanismo",
    name: { it: "Solstizio d'Inverno (Satanico)", en: "Winter Solstice (Satanic)", la: "Solstitium Hibernum Satanicum" },
    desc: {
      it: "Come il solstizio d'estate, e una delle quattro celebrazioni minori laveyane legate ai mutamenti stagionali, vissute come festa dell'individuo e non del cosmo.",
      en: "Like the summer solstice, one of the four minor LaVeyan celebrations tied to the changing seasons, marked as a feast of the self rather than the cosmos.",
      la: "Sicut solstitium aestivum, una e quattuor celebrationibus minoribus Laveyanis temporum mutationi iunctis, festum ipsius hominis, non mundi, habita."
    },
    celebration: {
      it: "Celebrazione minore personale: ci si concede un piacere scelto liberamente (un pasto raffinato, un regalo per sé) come atto di auto-indulgenza consapevole.",
      en: "A minor, personal celebration: one grants oneself a freely chosen pleasure (a fine meal, a gift to oneself) as an act of conscious self-indulgence.",
      la: "Celebratio minor personalis: voluptas libere electa sibi conceditur (cena lauta, donum sibi) ut actus indulgentiae sui conscius."
    }
  },
  {
    id: "babalu-aye", month: 12, day: 17, tradition: "santeria",
    name: { it: "D\u00EDa de Babal\u00FA-Ay\u00E9", en: "D\u00EDa de Babal\u00FA-Ay\u00E9", la: "Dies Babal\u00FA-Ay\u00E9" },
    desc: {
      it: "Onora Babal\u00FA-Ay\u00E9, Orisha delle malattie e della guarigione, sincretizzato con San Lazzaro: pellegrinaggi penitenziali e offerte per la salute.",
      en: "Honours Babal\u00FA-Ay\u00E9, Orisha of disease and healing, syncretized with St. Lazarus: penitential pilgrimages and offerings for health are made.",
      la: "Babal\u00FA-Ay\u00E9 honorat, Orisham morborum et sanationis, cum Sancto Lazaro syncretizatum: peregrinationes paenitentiales et oblationes pro salute fiunt."
    },
    celebration: {
      it: "Si compie un piccolo pellegrinaggio o cammino penitenziale (anche solo simbolico intorno a casa), si offrono grano e tabacco, e si accende una candela viola per la guarigione.",
      en: "A small pilgrimage or penitential walk is made (even symbolically around the home), grain and tobacco are offered, and a purple candle is lit for healing.",
      la: "Parva peregrinatio vel iter paenitentiale fit (vel symbolice circa domum), frumentum et tabacum offeruntur, et candela purpurea pro sanatione accenditur."
    }
  },
  {
    id: "khoiak", month: 12, day: 26, tradition: "kemetismo",
    name: { it: "Misteri di Khoiak", en: "Khoiak Mysteries", la: "Mysteria Khoiak" },
    desc: {
      it: "Rito misterico dedicato a Osiride: si modellavano figure di grano e fango a rappresentare la sua morte e rinascita, promessa di vita dopo la morte.",
      en: "A mystery rite dedicated to Osiris: figures of grain and mud were shaped to represent his death and rebirth, a promise of life after death.",
      la: "Ritus mysticus Osiridi dicatus: figurae frumenti et luti formabantur, mortem eius et renascentiam repraesentantes, vitae post mortem promissio."
    },
    celebration: {
      it: "Si modella una piccola figura di terra e semi di grano (o si pianta un vaso), la si annaffia nei giorni seguenti come rito di rinascita, in onore di Osiride.",
      en: "A small figure of earth and grain seeds is shaped (or a pot is planted), watered over the following days as a rite of rebirth, in honour of Osiris.",
      la: "Figura parva terrae et seminum tritici formatur (vel vas seritur), diebus sequentibus rigata ut ritus renascentiae, in honorem Osiridis."
    }
  },
];

// Festivita personale, senza data fissa nel calendario
export const PERSONAL_HOLIDAY = {
  tradition: "satanismo",
  name: { it: "Il proprio compleanno", en: "One's Own Birthday", la: "Dies Natalis Proprius" },
  desc: {
    it: "Nella Chiesa di Satana e la Festa Superiore piu importante dell'anno: l'individuo, non un dio, e il centro della propria celebrazione.",
    en: "In the Church of Satan this is the most important High Holiday of the year: the individual, not a god, is the centre of their own celebration.",
    la: "In Ecclesia Satanae haec est Festa Superior anni gravissima: non deus sed ipse homo sui celebrationis centrum est."
  },
  celebration: {
    it: "Ci si concede un giorno interamente dedicato a sé stessi: un pasto preferito, un regalo scelto personalmente, e nessun obbligo verso gli altri.",
    en: "A day devoted entirely to oneself is taken: a favourite meal, a personally chosen gift, and no obligations toward others.",
    la: "Dies sibi omnino dicatus sumitur: cena praedilecta, donum ipse electum, et nulla erga alios officia."
  }
};
