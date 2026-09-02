import type { Translations } from '../locales';

export const frCA: Translations = {
	appName: 'Tempo',
	nav: {
		home: 'Accueil',
		readClock: "Lire l'heure",
		matchClock: "Trouver l'horloge",
		setClock: "Régler l'horloge",
		howLongUntil: 'Combien de temps ?',
		explore: 'Explorer',
		leaveBy: 'Heure de départ',
		progress: 'Mes progrès',
		settings: 'Paramètres'
	},
	game: {
		correct: 'Bravo !',
		tryAgain: 'Essaie encore !',
		submit: 'Valider',
		next: 'Continuer',
		levelUp: 'Niveau réussi !',
		pickTheClock: 'Trouve la bonne horloge',
		setTheClock: "Place les aiguilles à l'heure demandée",
		howManyMinutesUntil: 'Combien de minutes s’écoulent ?'
	},
	explore: {
		title: "Explorer l'horloge",
		speakButton: "Écouter l'heure",
		nowButton: 'Heure actuelle',
		hourBack: "Reculer d'une heure",
		hourForward: "Avancer d'une heure"
	},
	leaveBy: {
		title: 'Heure de départ',
		noEvents: 'Un parent peut ajouter des routines dans les Paramètres.',
		timeToGo: "C'est l'heure de partir !",
		overdueMessage: "Pas de souci — la prochaine fois, on partira à l'heure !"
	},
	progress: {
		title: 'Mes progrès',
		totalStars: 'Étoiles gagnées',
		currentStreak: 'Jours d’affilée',
		longestStreak: 'Meilleure série',
		badgesEarned: 'Mes badges',
		level: 'Niveau'
	},
	settings: {
		title: 'Paramètres',
		holdToEnter: 'Maintenir pour ouvrir',
		narration: "Énoncer l'heure à voix haute",
		soundEffects: 'Effets sonores',
		difficultyOverride: 'Niveau de difficulté',
		difficultyAuto: 'Automatique',
		theme: 'Thème',
		themeDark: 'Sombre',
		themeLight: 'Clair',
		language: 'Langue',
		routines: 'Routines de départ',
		addRoutine: 'Ajouter une routine',
		resetProgress: 'Réinitialiser les progrès',
		resetConfirm: 'Toutes les étoiles, séries et badges seront effacés. Confirmer ?',
		routineLabel: 'Nom de la routine',
		routineLeaveBy: 'Heure de départ',
		routineDays: 'Jours',
		save: 'Enregistrer',
		cancel: 'Annuler',
		delete: 'Supprimer',
		installSection: "Installer l'application",
		installDescription: 'Installez Tempo pour une expérience plein écran sans distraction.',
		installButton: 'Installer Tempo',
		installed: 'Installée sur cet appareil',
		installIosTitle: 'Installer sur iPhone et iPad',
		installIosStep1: 'Touchez le bouton Partager dans la barre Safari',
		installIosStep2: "Faites défiler et touchez « Sur l'écran d'accueil »",
		installIosStep3: 'Touchez « Ajouter » en haut à droite',
		installOtherTitle: 'Installer dans votre navigateur',
		installOtherStep:
			"Ouvrez le menu du navigateur (⋮) et choisissez « Installer Tempo » ou « Ajouter à l'écran d'accueil ».",
		closeModal: 'Compris'
	},
	levels: {
		wholeHour: 'Heures entières',
		halfHour: 'Demi-heures',
		quarterHour: 'Quarts d’heure',
		fiveMinute: 'Aux 5 minutes',
		anyMinute: 'Toutes les minutes'
	},
	days: {
		0: 'Dim',
		1: 'Lun',
		2: 'Mar',
		3: 'Mer',
		4: 'Jeu',
		5: 'Ven',
		6: 'Sam'
	}
};
