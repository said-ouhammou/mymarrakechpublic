export const activities = [
    {
      id: "1",
      image: "/images/1.jpeg",
      title: "Balade à dos de chameau",
      location: "Agafay",
      rating: 4.7,
      duration: "1h30 de balade",
      originalPrice: 40,
      price: {
        adult : 30,
        enfant:20
      },
      transportIncluded: true,
      description: `Explorez le désert d'Agafay à dos de chameau et découvrez des paysages spectaculaires dans une ambiance traditionnelle. Une activité paisible et dépaysante.`,
      schedule: [{
        day : "lundi",
        hours : "10:00 - 20:00"
    }
      ],
      paymentMethods: ["Carte bancaire", "Espèces", "Virement bancaire"]
    },
    {
      id: "2",
      image: "/images/2.jpeg",
      title: "Dîner spectacle traditionnel",
      location: "Marrakech",
      rating: 4.8,
      duration: "3h avec dîner inclus",
      originalPrice: 60,
      price: {
        adult : 30,
        enfant:20
      },
      transportIncluded: true,
      description: `Vivez une soirée inoubliable avec un dîner marocain accompagné de musique et danses traditionnelles. Une immersion culturelle garantie.`,
      schedule: [{
        day : "lundi",
        hours : "10:00 - 20:00"
    }
      ],
      paymentMethods: ["Carte bancaire", "Espèces"]
    },
    {
      id: "3",
      image: "/images/3.jpeg",
      title: "Quad à la Palmeraie",
      location: "Palmeraie",
      rating: 4.9,
      duration: "2h de balade privée",
      originalPrice: 50,
      price: {
        adult : 30,
        enfant:20
      },
      transportIncluded: true,
      description: `Partez à l'aventure en quad à travers les sentiers de la Palmeraie. Sensations fortes et paysages contrastés au programme.`,
      schedule: [{
        day : "lundi",
        hours : "10:00 - 20:00"
    }
      ],
      paymentMethods: ["Carte bancaire", "Espèces", "Virement bancaire"]
    },
    {
      id: "4",
      image: "/images/4.jpeg",
      title: "Excursion dans les montagnes de l'Atlas",
      location: "Imlil",
      rating: 5.0,
      duration: "Journée complète",
      originalPrice: 80,
      price: {
        adult : 30,
        enfant:20
      },
      transportIncluded: true,
      description: `Découvrez les montagnes de l'Atlas lors d'une excursion enrichissante avec guide local. Randonnées, culture berbère et paysages époustouflants.`,
      schedule: [
        {
            day : "lundi",
            hours : "10:00 - 20:00"
        }
      ],
      paymentMethods: ["Carte bancaire", "Espèces"]
    },
    {
      id: "5",
      image: "/images/5.jpeg",
      title: "Visite guidée de la Médina",
      location: "Marrakech",
      rating: 4.6,
      duration: "3h de visite à pied",
      originalPrice: 30,
      price: {
        adult : 30,
        enfant:20
      },
      transportIncluded: false,
      description: `Accompagné d’un guide passionné, parcourez les ruelles historiques de la Médina et découvrez les secrets du patrimoine marrakchi.`,
      schedule: [
        {
            day : "lundi",
            hours : "10:00 - 20:00"
        }
      ],
      paymentMethods: ["Espèces", "Carte bancaire"]
    },
    {
      id: "6",
      image: "/images/6.jpeg",
      title: "Cours de cuisine marocaine",
      location: "Marrakech",
      rating: 4.9,
      duration: "4h avec repas inclus",
      originalPrice: 55,
      price: {
        adult : 30,
        enfant:20
      },
      transportIncluded: false,
      description: `Apprenez à préparer les plats emblématiques marocains dans une ambiance conviviale, puis dégustez votre repas sur place.`,
      schedule: [
        {
            day : "lundi",
            hours : "10:00 - 20:00"
        }
      ],
      paymentMethods: ["Carte bancaire", "Espèces"]
    },
    {
      id: "7",
      image: "/images/7.jpeg",
      title: "Balade en montgolfière",
      location: "Campagne de Marrakech",
      rating: 4.9,
      duration: "1h de vol + petit déjeuner",
      originalPrice: 200,
      price: {
        adult : 30,
        enfant:20
      },
      transportIncluded: true,
      description: `Survolez Marrakech et ses alentours au lever du soleil. Une expérience magique suivie d’un petit-déjeuner traditionnel.`,
      schedule: [
        {
            day : "lundi",
            hours : "10:00 - 20:00"
        }
      ],
      paymentMethods: ["Carte bancaire"]
    },
    {
      id: "8",
      image: "/images/8.jpeg",
      title: "Détente au hammam traditionnel",
      location: "Médina",
      rating: 4.5,
      duration: "1h30 de soins",
      originalPrice: 45,
      price: {
        adult : 30,
        enfant:20
      },
      transportIncluded: false,
      description: `Profitez de soins traditionnels marocains dans un hammam authentique, pour un moment de bien-être et de relaxation.`,
      schedule: [
        {
            day : "lundi",
            hours : "10:00 - 20:00"
        }
      ],
      paymentMethods: ["Espèces", "Carte bancaire"]
    },
    {
      id: "9",
      image: "/images/9.jpeg",
      title: "Soirée dans un riad privé",
      location: "Kasbah",
      rating: 4.8,
      duration: "Soirée avec dîner",
      originalPrice: 70,
      price: {
        adult : 30,
        enfant:20
      },
      transportIncluded: true,
      description: `Une soirée exclusive dans un riad somptueux avec dîner marocain, musique live et ambiance orientale.`,
      schedule: [
        {
            day : "lundi",
            hours : "10:00 - 20:00"
        }
      ],
      paymentMethods: ["Carte bancaire", "Espèces"]
    },
    {
      id: "10",
      image: "/images/10.jpeg",
      title: "Visite des jardins Majorelle",
      location: "Guéliz",
      rating: 4.7,
      duration: "2h de visite libre",
      originalPrice: 25,
      price: {
        adult : 30,
        enfant:20
      },
      transportIncluded: false,
      description: `Explorez les magnifiques jardins Majorelle à votre rythme. Un lieu emblématique mêlant art, botanique et culture.`,
      schedule: [
        {
            day : "lundi",
            hours : "10:00 - 20:00"
        }
      ],
      paymentMethods: ["Carte bancaire"]
    },
    {
      id: "11",
      image: "/images/11.jpeg",
      title: "Trekking dans le désert",
      location: "Zagora",
      rating: 4.9,
      duration: "2 jours avec nuit en bivouac",
      originalPrice: 150,
      price: {
        adult : 30,
        enfant:20
      },
      transportIncluded: true,
      description: `Partez pour une aventure de 2 jours dans le désert avec une nuit en bivouac sous les étoiles. Déconnexion totale garantie.`,
      schedule: [
        {
            day : "lundi",
            hours : "10:00 - 20:00"
        }
      ],
      paymentMethods: ["Carte bancaire", "Espèces", "Virement bancaire"]
    },
    {
      id: "12",
      image: "/images/12.jpeg",
      title: "Duo Traditionnel au hammam",
      location: "RIAD HAMDANE - Palmeraie, Marrakech",
      rating: 4.9,
      duration: "1h30 avec massage pour deux",
      originalPrice: 90,
      price: {
        adult : 30,
        enfant:20
      },
      transportIncluded: false,
      description: `Profitez d'un moment de détente en duo dans un cadre authentique. Cette expérience vous permet de découvrir les traditions marocaines dans un environnement relaxant et luxueux.
  
  Le Duo Traditionnel comprend un accès au hammam traditionnel suivi d'un massage relaxant pour deux personnes. Vous pourrez profiter des bienfaits des produits naturels marocains et vous détendre dans un cadre exceptionnel.
  
  Cette activité est proposée par RIAD HAMDANE, un partenaire de confiance qui collabore avec l'agence My Marrakech pour vous offrir des expériences authentiques.`,
      schedule: [
        {
            day : "lundi",
            hours : "10:00 - 20:00"
        }
      ],
      paymentMethods: ["Carte bancaire", "Espèces", "Chèque", "Virement bancaire"]
    }
  ];
  