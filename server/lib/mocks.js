exports.moviesCollection = {
  name: 'MyMovies',
  totalSize: 1,
  data: [{
    id: 1,
    title: "Evil Dead 3 : L'armée des ténèbres",
    origTitle: "Evil Dead 3: Army of the shadows",
    rlzYear: 2014,
    length: 120,
    countries: ['us', 'fr', 'it'],
    format: 'DVD',
    tags: ['Comedy', 'Horror'],
    languages: ['en_US', 'fr_FR'],
    subtitles: ['en_US', 'fr_FR'],
    serie: null,
    volume: 1
  }]
};
exports.movie = {
  id: 1,
  title: "Evil Dead 3 : L'armée des ténèbres",
  origTitle: "Evil Dead 3: Army of darkness",
  rlzYear: 2014,
  length: 120,
  countries: ['us', 'fr', 'it'],
  directors: ["Sam Raimi", "Ivan Raimi"],
  producers: ["Bruce Campbell", "Un autre type"],
  cast: [
    {
      actor: "Bruce Campbell",
      character: "Ash"
    },
    {
      actor: "Embeth Davidtz",
      character: "La nana"
    }
  ],
  synopsys: "Pris dans une spirale infernale, Ash se retrouve transporté par des forces démoniaques dans l'Angleterre des années 1300. Là, il renconre un peuple victime des attaques de démons volants. Mais pour lui, une seule chose compte : retourner à son époque. Pour y parvenir il doit mettre la main sur la Nécronomicon, le Livre des Morts. Armée d'une tronçonneuse greffée au poignet et d'un fusil à canon scié dans l'autre, Ash se met en quête du grimoire sacré. Mais les forces de l'ombre ne vont pas tarder à déferler sur sa route…",
  format: 'DVD',
  tags: ["Comedy", "Horror"],
  languages: ['en_US', 'fr_FR'],
  subtitles: ['en_US', 'fr_FR'],
  region: 2,
  serie: null,
  volume: 1,
  numberOfDisks: 1
};
