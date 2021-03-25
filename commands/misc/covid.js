const fetch = require('node-fetch');

const validateStateShortcuts = shortCut => {
	const validShortcuts = [
		{
			state: 'Baden-Württemberg',
			shortcut: 'BW',
		},

		{
			state: 'Nordrhein-Westfalen',
			shortcut: 'NRW',
		},

		{
			state: 'Sachsen-Anhalt',
			shortcut: 'SA',
		},

		{
			state: 'Schleswig-Holstein',
			shortcut: 'SH',
		},

		{
			state: 'Rheinland-Pfalz',
			shortcut: 'RP',
		},

		{
			state: 'Mecklenburg-Vorpommern',
			shortcut: 'MVP',
		},
	];

	for(const x of validShortcuts) {
		if(x.shortcut.toLowerCase() == shortCut.toLowerCase()) {
			return x.state;
		}
	}
	return null;
};

module.exports = {
	name: 'covid',
	expectedArgs: '<Bundesland>',
	minArgs: 1,
	maxArgs: 1,
	execute: async (messgae, args, Discord) => {
		try {
			let state = '';

			if(args[0]) {
				state = args[0].toString();

				if(state.length <= 3) {
					state = validateStateShortcuts(state);

					if(!state) {
						return messgae.channel.send(`"${args[0].toString()}" ist kein gültiges Bundesland!`);
					}
				}
			}

			const coronaIconUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Coronavirus_icon.svg/1024px-Coronavirus_icon.svg.png';
			const api = 'https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/Coronaf%C3%A4lle_in_den_Bundesl%C3%A4ndern/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json';

			await fetch(api)
				.then(res => res.json())
				.then(data => {
					const { features } = data;
					const results = features.filter(filter => filter.attributes.LAN_ew_GEN == state)[0].attributes;
					let { Fallzahl, Death, cases7_bl_per_100k,
						faelle_100000_EW, LAN_ew_GEN, Aktualisierung } = results;

					cases7_bl_per_100k = '~ ' + Intl.NumberFormat().format(Math.round(cases7_bl_per_100k));
					faelle_100000_EW = '~ ' + Intl.NumberFormat().format(Math.round(faelle_100000_EW));
					Fallzahl = '~ ' + Intl.NumberFormat().format(Math.round(Fallzahl));
					Death = '~ ' + Intl.NumberFormat().format(Math.round(Death));
					Aktualisierung = new Date(Aktualisierung);
					Aktualisierung = `${Aktualisierung.getDate()}.${Aktualisierung.getMonth()}.${Aktualisierung.getFullYear()}`;

					const covidEmbed = {
						color: 0xDC143C,
						title: LAN_ew_GEN,
						author: {
							name: 'COVID-19 Informationen',
							icon_url: coronaIconUrl,
						},

						thumbnail: {
							url: coronaIconUrl,
						},

						fields: [
							{
								name: 'Fallzahl insgesamt',
								value: Fallzahl,
								inline: true,
							},

							{
								name: 'Todesfälle insgesamt',
								value: Death,
								inline: true,
							},

							{
								name: 'Fälle der letzten 7 Tage/100000 EW',
								value: cases7_bl_per_100k,
								inline: true,
							},

							{
								name: 'Fälle / 100.000 EW',
								value: faelle_100000_EW,
								inline: true,
							},

							{
								name: 'Stand',
								value: Aktualisierung,
								inline: true,
							},
						],
						timestamp: new Date(),
					};

					messgae.channel.send({ embed: covidEmbed });
				})
				.catch(error => console.log('Error!' + error));

		}
		catch (error) {
			console.log('An error occured while executing the covid command: ' + error);
			messgae.channel.send('Leider ist ein Fehler aufgetreten :(');
		}
	},
};