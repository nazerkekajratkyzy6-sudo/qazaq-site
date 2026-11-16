import type { Source } from './types'

export const SOURCES: Source[] = [
  // ───── Алғашқы (тарихи) материалдар ─────
  {
    id: 'qazaq-1913-7', kind: 'primary', author: 'Автор көрсетілмеген (редакция)',
    title: '«Қазақ» газеті, № 7, 1913 (бірінші бет)', year: '1913',
    publisher: 'Орынбор, «Азамат» серіктестігі',
    note: 'Бұл сайтта көрсетілген сурет — жіберілген скриншот. Нақты архив/кітапхана шифры және қолжетімді цифрлық көшірме нақтылануда. Нөмірі мен күні суреттегі жазудан оқылады және түпнұсқамен салыстырылуы тиіс.',
  },
  {
    id: 'qazaq-1913-42', kind: 'primary', author: 'Автор көрсетілмеген',
    title: '«Қазақ», 1913, № 42 — «Азамат» серіктігі туралы жарияланым', year: '1913',
    publisher: 'Орынбор', note: 'Жанама сілтеме: зерттеу мақаласынан алынды (Қарағанды университетінің хабаршысы). Түпнұсқа нөмір әлі ашылып тексерілмеген.',
  },
  {
    id: 'qazaq-1914-91', kind: 'primary', author: 'Автор көрсетілмеген',
    title: '«Қазақ», 1914, № 91 — «Бұл не?» (орысша атауы бойынша «Что это значит?»)', year: '1914',
    publisher: 'Орынбор', note: 'Жанама сілтеме: Ұлттық архив қызметкерлері туралы «Казахстанская правда» материалы. Қазақша атауы мен мәтіні түпнұсқадан тексерілуі тиіс.',
  },
  {
    id: 'qazaq-1914-1918-front', kind: 'primary', author: 'Автор көрсетілмеген',
    title: '«Қазақ» газетіндегі майданның қара жұмысына қазақтарды алу туралы мақалалар (1914–1918)', year: '1914–1918',
    publisher: 'Орынбор', note: 'Жанама сілтеме: Н. Нұрмұхамедтің мақаласы. Нақты мақала атаулары мен нөмірлері түпнұсқадан нақтыланады.',
  },
  // ───── Зерттеулер мен анықтамалар ─────
  {
    id: 'wiki-qazaq', kind: 'reference', author: 'Wikipedia авторлары', title: 'Qazaq (newspaper)', year: '—',
    publisher: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Qazaq_(newspaper)', accessed: '16.11.2026',
    note: 'Анықтамалық дереккөз; негізгі зерттеуде тікелей сілтеме ретінде тек қосымша тексеру үшін.',
  },
  {
    id: 'karsu-vestnik', kind: 'research', author: 'Авторлар ұжымы', title: 'Мақала атауы нақтылануда — «Қазақ» газеті (1913–1918) және «Азамат» серіктігі (Вестник Карагандинского университета, сер. «История. Философия»)', year: '—',
    publisher: 'Қарағанды университеті (Бөкетов атындағы)',
    url: 'https://history-philosophy-vestnik.buketov.edu.kz/index.php/history-philosophy-vestnik/article/download/587/517/1003', accessed: '16.11.2026',
    note: 'Басылымның 2 ақпан 1913 – 26 қыркүйек 1918 аралығында Орынборда «Каримов, Хусаинов и Ко» баспаханасында араб жазуымен басылғаны көрсетілген.',
  },
  {
    id: 'ibraeva', kind: 'research', author: 'Ибраева Э.Е., Дүйсенғазы С.М.', title: 'Мақала атауы нақтылануда (DOI: 10.51889/2020-3.1728-5461.23)', year: '2020',
    publisher: 'Абай атындағы ҚазҰПУ хабаршысы («Тарих және саяси-әлеуметтік ғылымдар» сериясы), № 3',
    url: 'https://bulletin-histsocpolit.kaznpu.kz/index.php/ped/article/download/267/263/519', accessed: '16.11.2026',
    note: 'Таралым 3000-нан 8000 данаға дейін; алғашқы жылдары аптасына бір рет, 1915 жылдан аптасына екі рет.',
  },
  {
    id: 'kazpravda-history', kind: 'research', author: 'Кира Иванова', title: 'Казахстанская журналистика: из века в век переходя', year: '—',
    publisher: 'Казахстанская правда', url: 'https://kazpravda.kz/n/kazahstanskaya-zhurnalistika-iz-veka-v-vek-perehodya/', accessed: '16.11.2026',
    note: 'Басылымның 2 ақпан 1913 ж. шыққаны, 1915 жылдан аптасына екі рет шыққаны, 2006 жылы қайта жарық көргені.',
  },
  {
    id: 'kazpravda-archive', kind: 'research', author: 'Игорь Прохоров', title: 'Периодическая печать – глаза, слух и язык народа', year: '—',
    publisher: 'Казахстанская правда', url: 'https://kazpravda.kz/n/periodicheskaya-pechat-glaza-sluh-i-yazyk-naroda/', accessed: '16.11.2026',
    note: 'Ұлттық архив қызметкерлерінің Орынбордағы құжаттары; 1914 № 91 туралы сілтеме.',
  },
  {
    id: 'kazpravda-day', kind: 'research', author: 'Г. Кунапия, Н. Буланова', title: 'Национальный день печати утвердили в Казахстане', year: '—',
    publisher: 'Kazpravda.kz', url: 'https://kazpravda.kz/n/2-fevralya-v-rk-stanet-natsionalnym-dnem-izdatelstva/', accessed: '16.11.2026',
    note: '2 ақпан — Ұлттық баспасөз күні; 1913 жылғы бірінші нөмір.',
  },
  {
    id: 'kazpravda-pages', kind: 'research', author: 'Автор көрсетілмеген', title: 'По страницам народной судьбы', year: '—',
    publisher: 'Казахстанская правда', url: 'https://kazpravda.kz/n/po-stranitsam-narodnoy-sudby/', accessed: '16.11.2026',
    note: 'Редакциялық кеңеске Алаш көшбасшылары кірді; газеттің таралу географиясы.',
  },
  {
    id: 'nurmukhamed-front', kind: 'research', author: 'Автор нақтылануда (Шымкент университеті)', title: '«Қазақ» газетіндегі майданның қара жұмысына қазақтарды алу жөніндегі мақалалардың тарихи маңыздылығы (1914–1918 жж.)', year: '—',
    publisher: 'Абай атындағы ҚазҰПУ хабаршысы', url: 'https://bulletin-histsocpolit.kaznpu.kz/index.php/ped/article/download/1420/609/3428', accessed: '16.11.2026',
  },
  {
    id: 'azamat-police', kind: 'research', author: 'Авторлар ұжымы', title: 'Полицейский надзор за деятельностью казахской интеллигенции и общественное меценатство в сфере издательства (1913–1917)', year: '—',
    publisher: 'Е.А. Бөкетов атындағы университет, «Тарих» журналы', url: 'https://ejh.buketov.edu.kz/jh/article/view/1996', accessed: '16.11.2026',
    note: '«Азамат» серіктестігі және газеттің шығуы.',
  },
  {
    id: 'momynova', kind: 'research', author: 'Момынова Б.Қ.', title: 'Газета «Қазақ» (1913–1918): орфографические особенности и пунктуация в процессе опробации письма усул-сотие (төте жазу)', year: '—',
    publisher: 'Әл-Фараби атындағы ҚазҰУ, «Филология» сериясы', url: 'https://philart.kaznu.kz/index.php/1-FIL/article/download/3980/2858/8343', accessed: '16.11.2026',
  },
  {
    id: 'wiki-baitursynuly', kind: 'reference', author: 'Wikipedia авторлары', title: 'Ahmet Baitursynuly', year: '—',
    publisher: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Ahmet_Baitursynuly', accessed: '16.11.2026',
    note: 'Туған жылы дереккөздерде 1872 және 1873 деп әртүрлі беріледі.',
  },
  {
    id: 'inform-dulatov', kind: 'reference', author: 'Inform.kz', title: 'Дулатов Миржакып', year: '—',
    publisher: 'Inform.kz', url: 'https://www.inform.kz/ru/dulatov-mirzhakyp_a230595', accessed: '16.11.2026',
  },
  {
    id: 'rasscrom-alash', kind: 'reference', author: 'Alash Orda жобасы', title: 'The Founding Fathers (Алаш Орда)', year: '—',
    publisher: 'rasscrom.github.io', url: 'https://rasscrom.github.io/alash-orda/story.html', accessed: '16.11.2026',
    note: 'Қосымша анықтамалық дереккөз; негізгі зерттеуде ғылыми еңбектермен ауыстыру ұсынылады.',
  },
  {
    id: 'mekebaev', kind: 'research', author: 'Мекебаев Т.Қ., Құмғанбаев Ж.Ж.', title: '«Қазақ» газетіндегі Әлихан Бөкейхановтың қызметі', year: '2016',
    publisher: 'Әл-Фараби атындағы ҚазҰУ хабаршысы (Тарих сериясы)', url: 'https://bulletin-history.kaznu.kz/index.php/1-history/article/download/694/524/1508', accessed: '16.11.2026',
  },
  {
    id: 'screenshots', kind: 'reference', author: 'Жоба авторы', title: 'Жіберілген скриншоттар (суреттер)', year: '2026',
    publisher: 'ALASH_QAZAQ_SITE_ARCHIVE.zip',
    note: 'Суреттердің түпнұсқа авторы, архиві және құқық иесі әзірге белгісіз — жариялау алдында нақтылау керек.',
  },
]

export const sourceById = (id: string) => SOURCES.find(s => s.id === id)
