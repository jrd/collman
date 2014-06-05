==========
API Movies
==========

Urls
====

- /list/movies/DEFAULT (GET)
- /get/movie/DEFAULT/ID (GET)
- /add/movie/DEFAULT (POST)

Json
====

- /list/movies/NAME

.. code:: js

  {
    name: NAME,
    totalSize: SIZE,
    data: [
      {
        id: ID,
        title: TITLE,
        origTitle: TITLE,
        rlzYear: YEAR,
        length: MINUTES,
        countries: [COUNTRY1, COUNTRY2],
        format: DVD|BRD|VHS|Custom,
        tags: [TAG1, TAG2],
        languages: [LANG1, LANG1],
        subtitles: [SUB1, SUB2],
        serie: SERIE,
        volume: 1+,
      }
    ]
  }

- /get/movie/NAME/ID

.. code:: js

  {
    id: ID,
    title: TITLE,
    origTitle: TITLE,
    rlzYear: YEAR,
    length: MINUTES,
    countries: [COUNTRY1, COUNTRY2],
    directors: [NAME1, NAME2],
    producers: [NAME1, NAME2],
    cast: [
      {
        actor: NAME1,
        character: CHARACTER1,
      },
      {
        actor: NAME2,
        character: CHARACTER2,
      }
    ],
    synopsys: SYNOPSYS,
    format: DVD|BRD|VHS|Custom,
    tags: [TAG1, TAG2],
    languages: [LANG1, LANG1],
    subtitles: [SUB1, SUB2],
    region: 1|2|3|4|5|6|A|B|C,
    serie: SERIE,
    volume: 1+,
    numberOfDisks: 1+,
  }

- /add/movie/NAME

.. code:: js

  {
    title: TITLE,
    origTitle: TITLE,
    rlzYear: YEAR,
    length: MINUTES,
    countries: [COUNTRY1, COUNTRY2],
    directors: [NAME1, NAME2],
    producers: [NAME1, NAME2],
    cast: [
      {
        actor: NAME1,
        character: CHARACTER1,
      },
      {
        actor: NAME2,
        character: CHARACTER2,
      }
    ],
    synopsys: SYNOPSYS,
    format: DVD|BRD|VHS|Custom,
    tags: [TAG1, TAG2],
    languages: [LANG1, LANG1],
    subtitles: [SUB1, SUB2],
    region: 1|2|3|4|5|6|A|B|C,
    serie: SERIE,
    volume: 1+,
    numberOfDisks: 1+,
  }
