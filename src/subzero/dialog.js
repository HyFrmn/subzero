define([
	'sge',
	'./behaviour'
	], function(sge, Behaviour){
		var Dialog = {dialogs: {}};
		Dialog.load = function(data){
			for (var prop in data) {
		      // important check that this is objects own property 
		      // not from prototype prop inherited
		      if(data.hasOwnProperty(prop)){
		        Dialog.dialogs[prop] = data[prop];
		      }
		   }

		}
		return Dialog;
	}
)