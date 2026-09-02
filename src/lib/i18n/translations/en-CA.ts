import type { Translations } from '../locales';

export const enCA: Translations = {
	appName: 'Tempo',
	nav: {
		home: 'Home',
		readClock: 'Read the Clock',
		matchClock: 'Match the Clock',
		setClock: 'Set the Clock',
		howLongUntil: 'How Long Until?',
		explore: 'Explore',
		leaveBy: 'Leave By',
		progress: 'Progress',
		settings: 'Settings'
	},
	game: {
		correct: 'Correct!',
		tryAgain: 'Try again!',
		submit: 'Check',
		next: 'Next',
		levelUp: 'Level up!',
		pickTheClock: 'Pick the matching clock',
		setTheClock: 'Set the clock to match',
		howManyMinutesUntil: 'How long until?'
	},
	explore: {
		title: 'Explore the Clock',
		speakButton: 'Say the time',
		nowButton: 'Show the time right now',
		hourBack: 'Back one hour',
		hourForward: 'Forward one hour'
	},
	leaveBy: {
		title: 'Leave By',
		noEvents: 'A grown-up can add routines in Settings.',
		timeToGo: 'Time to go!',
		overdueMessage: "That's okay — next time let's leave right on time."
	},
	progress: {
		title: 'My Progress',
		totalStars: 'Total stars',
		currentStreak: 'Day streak',
		longestStreak: 'Best streak',
		badgesEarned: 'Badges',
		level: 'Level'
	},
	settings: {
		title: 'Settings',
		holdToEnter: 'Press and hold to enter Settings',
		narration: 'Speak times out loud',
		soundEffects: 'Sound effects',
		difficultyOverride: 'Difficulty',
		difficultyAuto: 'Automatic',
		theme: 'Theme',
		themeDark: 'Dark',
		themeLight: 'Light',
		language: 'Language',
		routines: 'Routines',
		addRoutine: 'Add routine',
		resetProgress: 'Reset all progress',
		resetConfirm: 'This will erase all stars, badges, and levels. Are you sure?',
		routineLabel: 'Name',
		routineLeaveBy: 'Leave by',
		routineDays: 'Days',
		save: 'Save',
		cancel: 'Cancel',
		delete: 'Delete',
		installSection: 'Install App',
		installDescription: 'Install Tempo for a distraction-free, full-screen experience.',
		installButton: 'Install Tempo',
		installed: 'Installed on this device',
		installIosTitle: 'Install on iPhone & iPad',
		installIosStep1: 'Tap the Share button in the Safari toolbar',
		installIosStep2: "Scroll down and tap 'Add to Home Screen'",
		installIosStep3: "Tap 'Add' in the top right corner",
		installOtherTitle: 'Install in your browser',
		installOtherStep:
			"Open your browser menu (⋮) and choose 'Install Tempo' or 'Add to Home screen'.",
		closeModal: 'Got it'
	},
	levels: {
		wholeHour: 'Whole hours',
		halfHour: 'Half hours',
		quarterHour: 'Quarter hours',
		fiveMinute: 'Five minutes',
		anyMinute: 'Any minute'
	},
	days: {
		0: 'Sun',
		1: 'Mon',
		2: 'Tue',
		3: 'Wed',
		4: 'Thu',
		5: 'Fri',
		6: 'Sat'
	}
};
