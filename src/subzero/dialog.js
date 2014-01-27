define([
	'sge',
	'./behaviour'
	], function(sge, Behaviour){
		var Dialog = {dialogs: {}};
		Dialog.load = function(data){
			var dataDialog = data.dialog;
			for (var i = dataDialog.length - 1; i >= 0; i--) {
				Dialog.dialogs[dataDialog[i].name] = dataDialog[i];
			};

		}
		return Dialog;
	}
)