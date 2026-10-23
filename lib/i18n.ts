export type Locale = "en" | "fr";

export const LOCALES: Locale[] = ["en", "fr"];

export const LOCALE_STORAGE_KEY = "ovg.locale";
export const LOCALE_COOKIE = "ovg.locale";

const en = {
  "nav.browse": "Browse",
  "nav.library": "Library",

  "footer.tagline": "OVG — Video Game Library",
  "footer.data": "Data via the RAWG Video Games Database",
  "footer.credit": "Built by Intelleet",

  "theme.light": "Light",
  "theme.dark": "Dark",
  "theme.switchToLight": "Switch to light mode",
  "theme.switchToDark": "Switch to dark mode",

  "lang.switchToEn": "Switch to English",
  "lang.switchToFr": "Switch to French",

  "home.title": "Browse Games",
  "home.subtitle": "Search, filter, and explore the world of video games.",
  "home.unableToLoad":
    "Unable to load games right now. Please try again later.",

  "search.placeholder": "Search games…",
  "search.aria": "Search games",
  "search.clear": "Clear search",

  "filter.sortAria": "Sort by",
  "sort.default": "Sort: Default",
  "sort.added": "Most Added",
  "sort.rating": "Top Rated",
  "sort.metacritic": "Metacritic",
  "sort.released": "Newest",
  "sort.name": "Name (A–Z)",

  "filter.platformAria": "Filter by platform",
  "platform.all": "Platform: All",
  "platform.pc": "PC",
  "platform.ps5": "PlayStation 5",
  "platform.ps4": "PlayStation 4",
  "platform.xboxOne": "Xbox One",
  "platform.xboxSeries": "Xbox Series S/X",
  "platform.switch": "Nintendo Switch",
  "platform.ios": "iOS",
  "platform.android": "Android",

  "filter.genreAria": "Filter by genre",
  "genre.all": "Genre: All",
  "genre.action": "Action",
  "genre.indie": "Indie",
  "genre.adventure": "Adventure",
  "genre.rpg": "RPG",
  "genre.strategy": "Strategy",
  "genre.shooter": "Shooter",
  "genre.casual": "Casual",
  "genre.simulation": "Simulation",
  "genre.puzzle": "Puzzle",
  "genre.arcade": "Arcade",
  "genre.racing": "Racing",
  "genre.sports": "Sports",

  "filter.metacriticAria": "Filter by Metacritic score",
  "metacriticFilter.any": "Metacritic: Any",

  "pagination.aria": "Pagination",
  "pagination.prev": "← Previous",
  "pagination.next": "Next →",
  "pagination.page": "Page {page}",

  "grid.empty": "No games found.",
  "browse.emptySearch": 'No games found for "{query}".',
  "browse.failedToLoad": "Failed to load games",

  "card.noCover": "No cover",

  "detail.back": "← Back to browse",
  "detail.about": "About",
  "detail.trailers": "Trailers",
  "detail.screenshots": "Screenshots",
  "detail.series": "More in the series",
  "detail.genres": "Genres",
  "detail.platforms": "Platforms",
  "detail.playtime": "Avg. Playtime",
  "detail.playtimeHours": "{hours} hours",
  "detail.developers": "Developers",
  "detail.stores": "Available at",
  "detail.tba": "TBA",
  "detail.noCover": "No cover available",
  "detail.videoFallback": "Your browser does not support embedded videos.",
  "detail.screenshotAlt": "{name} screenshot {index}",

  "error.title": "500",
  "error.message": "Something went wrong while loading this page.",
  "error.detailMessage":
    "We couldn't load this game's details. Please try again.",
  "error.retry": "Try again",

  "notFound.message": "This game doesn't exist or could not be found.",
  "notFound.back": "← Back to browse",

  "metacritic.acclaim": "Universal Acclaim",
  "metacritic.favorable": "Generally Favorable",
  "metacritic.mixed": "Mixed or Average",
  "metacritic.unfavorable": "Generally Unfavorable",

  "library.title": "My Library",
  "library.subtitle": "Your saved games, organized by status.",
  "library.all": "All",
  "library.statusAria": "Filter by status",
  "library.statusFor": "Status for {name}",
  "library.removeAria": "Remove {name} from library",
  "library.remove": "Remove",
  "library.empty": "Your library is empty.",
  "library.emptyBrowse": "Browse games to add some",
  "library.emptyStatus": "Nothing in this status yet.",

  "status.want": "Want to Play",
  "status.playing": "Playing",
  "status.completed": "Completed",
  "status.addLabel": "Add to Library…",
  "status.aria": "Library status",
} as const;

export type MessageKey = keyof typeof en;

const fr: Record<MessageKey, string> = {
  "nav.browse": "Explorer",
  "nav.library": "Bibliothèque",

  "footer.tagline": "OVG — Bibliothèque de jeux vidéo",
  "footer.data": "Données via la base RAWG Video Games",
  "footer.credit": "Réalisé par Intelleet",

  "theme.light": "Clair",
  "theme.dark": "Sombre",
  "theme.switchToLight": "Passer en mode clair",
  "theme.switchToDark": "Passer en mode sombre",

  "lang.switchToEn": "Passer à l'anglais",
  "lang.switchToFr": "Passer au français",

  "home.title": "Explorer les jeux",
  "home.subtitle": "Recherchez, filtrez et explorez l'univers du jeu vidéo.",
  "home.unableToLoad":
    "Impossible de charger les jeux pour le moment. Veuillez réessayer plus tard.",

  "search.placeholder": "Rechercher des jeux…",
  "search.aria": "Rechercher des jeux",
  "search.clear": "Effacer la recherche",

  "filter.sortAria": "Trier par",
  "sort.default": "Tri : Par défaut",
  "sort.added": "Les plus ajoutés",
  "sort.rating": "Mieux notés",
  "sort.metacritic": "Metacritic",
  "sort.released": "Plus récents",
  "sort.name": "Nom (A–Z)",

  "filter.platformAria": "Filtrer par plateforme",
  "platform.all": "Plateforme : Toutes",
  "platform.pc": "PC",
  "platform.ps5": "PlayStation 5",
  "platform.ps4": "PlayStation 4",
  "platform.xboxOne": "Xbox One",
  "platform.xboxSeries": "Xbox Series S/X",
  "platform.switch": "Nintendo Switch",
  "platform.ios": "iOS",
  "platform.android": "Android",

  "filter.genreAria": "Filtrer par genre",
  "genre.all": "Genre : Tous",
  "genre.action": "Action",
  "genre.indie": "Indé",
  "genre.adventure": "Aventure",
  "genre.rpg": "JDR",
  "genre.strategy": "Stratégie",
  "genre.shooter": "Jeu de tir",
  "genre.casual": "Décontracté",
  "genre.simulation": "Simulation",
  "genre.puzzle": "Puzzle",
  "genre.arcade": "Arcade",
  "genre.racing": "Course",
  "genre.sports": "Sports",

  "filter.metacriticAria": "Filtrer par score Metacritic",
  "metacriticFilter.any": "Metacritic : Peu importe",

  "pagination.aria": "Pagination",
  "pagination.prev": "← Précédent",
  "pagination.next": "Suivant →",
  "pagination.page": "Page {page}",

  "grid.empty": "Aucun jeu trouvé.",
  "browse.emptySearch": "Aucun jeu trouvé pour « {query} ».",
  "browse.failedToLoad": "Échec du chargement des jeux",

  "card.noCover": "Pas de jaquette",

  "detail.back": "← Retour à l'exploration",
  "detail.about": "À propos",
  "detail.trailers": "Bandes-annonces",
  "detail.screenshots": "Captures d'écran",
  "detail.series": "Autres jeux de la série",
  "detail.genres": "Genres",
  "detail.platforms": "Plateformes",
  "detail.playtime": "Durée moyenne",
  "detail.playtimeHours": "{hours} heures",
  "detail.developers": "Développeurs",
  "detail.stores": "Disponible sur",
  "detail.tba": "À annoncer",
  "detail.noCover": "Aucune jaquette disponible",
  "detail.videoFallback":
    "Votre navigateur ne prend pas en charge les vidéos intégrées.",
  "detail.screenshotAlt": "Capture d'écran {index} de {name}",

  "error.title": "500",
  "error.message":
    "Une erreur s'est produite lors du chargement de cette page.",
  "error.detailMessage":
    "Nous n'avons pas pu charger les détails de ce jeu. Veuillez réessayer.",
  "error.retry": "Réessayer",

  "notFound.message": "Ce jeu n'existe pas ou n'a pas pu être trouvé.",
  "notFound.back": "← Retour à l'exploration",

  "metacritic.acclaim": "Acclamation universelle",
  "metacritic.favorable": "Généralement favorable",
  "metacritic.mixed": "Mitigé ou moyen",
  "metacritic.unfavorable": "Généralement défavorable",

  "library.title": "Ma bibliothèque",
  "library.subtitle": "Vos jeux enregistrés, classés par statut.",
  "library.all": "Tous",
  "library.statusAria": "Filtrer par statut",
  "library.statusFor": "Statut de {name}",
  "library.removeAria": "Retirer {name} de la bibliothèque",
  "library.remove": "Retirer",
  "library.empty": "Votre bibliothèque est vide.",
  "library.emptyBrowse": "Parcourez les jeux pour en ajouter",
  "library.emptyStatus": "Rien dans ce statut pour l'instant.",

  "status.want": "À jouer",
  "status.playing": "En cours",
  "status.completed": "Terminé",
  "status.addLabel": "Ajouter à la bibliothèque…",
  "status.aria": "Statut dans la bibliothèque",
};

export const messages: Record<Locale, Record<MessageKey, string>> = { en, fr };

export function isLocale(value: string | undefined | null): value is Locale {
  return value === "en" || value === "fr";
}

export function t(
  locale: Locale,
  key: MessageKey,
  vars?: Record<string, string | number>
): string {
  let text: string = messages[locale][key];
  if (vars) {
    for (const [name, value] of Object.entries(vars)) {
      text = text.replaceAll(`{${name}}`, String(value));
    }
  }
  return text;
}

export const rawgTermsFr: Record<string, string> = {
  Action: "Action",
  Indie: "Indé",
  Adventure: "Aventure",
  RPG: "JDR",
  Strategy: "Stratégie",
  Shooter: "Jeu de tir",
  Casual: "Décontracté",
  Simulation: "Simulation",
  Puzzle: "Puzzle",
  Arcade: "Arcade",
  Racing: "Course",
  Sports: "Sports",
  "Massively Multiplayer": "Multijoueur massif",
  Fighting: "Combat",
  Platformer: "Plateforme",
  "Board Games": "Jeux de société",
  "Card Game": "Jeu de cartes",
  Educational: "Éducatif",
  Family: "Familial",
  Musical: "Musical",
};

export function rawgTerm(locale: Locale, name: string): string {
  if (locale === "fr") {
    return rawgTermsFr[name] ?? name;
  }
  return name;
}
