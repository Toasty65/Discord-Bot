module.exports = {
	name: 'add',
	aliases: ['addition', 'aa', 'plus'],
	expectedArgs: '<num1> <num2>',
	permissionError: 'You need admin permissions to run this command',
	minArgs: 2,
	maxArgs: 2,
	guildOnly: true,
	execute: (message, args) => {
		const num1 = +parseInt(args[0]);
		const num2 = +parseInt(args[1]);

		if (!isNaN(num1) && !isNaN(num2)) {
			return message.reply(`The sum is ${num1 + num2}`);
		}

		message.reply('One of the specified parameters is not a number!');
	},
	permissions: 'ADMINISTRATOR',
	requiredRoles: '',
};