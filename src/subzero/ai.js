define([
	'sge',
	'./behaviour'
	], function(sge, Behaviour){
		var AI = {blueprints: {}};
		AI.load = function(allData){
			var data = allData.ai;
			for (var prop in data) {
		      // important check that this is objects own property 
		      // not from prototype prop inherited
		      if(data.hasOwnProperty(prop)){
		        AI.blueprints[prop] = data[prop];
		      }
		   }

		}
		AI.has = function(typ){
			return (AI.blueprints[typ]!==undefined);
		}
		AI.Create = function(type, entity){
			var behaviourData = AI.blueprints[type];
			if (behaviourData==undefined){
				console.error('No Behavour Data for ' + type);
				return;
			}
			var behavoiurs = [];
			for (var i=0; i<behaviourData.objectives.length;i++){
				var bd = behaviourData.objectives[i];
				var n = Behaviour.Create(bd.behaviour, entity, bd);
				behavoiurs.push(n);
			}
			return behavoiurs;
		}

		return AI;
	}
)