function CharaCtrl($scope){
	var img = new Image();
	img.src = "/art/sprites/male_a/simple_shirt.png";

	var base = new Image();
	base.src="/content/sprites/man_a.png";

	$scope.shirtMidtoneR=1;
	$scope.shirtMidtoneG=1;
	$scope.shirtMidtoneB=1;

	$scope.shirtLowlightR=1;
	$scope.shirtLowlightG=1;
	$scope.shirtLowlightB=1;

	$scope.updatePreview = function(){
		var canvas = document.getElementById("canvas");
		canvas.width = img.width;
		canvas.height = img.height;
		var preview = document.getElementById("preview");
		
		var buffer = document.createElement('canvas');
		buffer.width = canvas.width;
		buffer.height = canvas.height;

		var bufferCtx = buffer.getContext("2d");
		bufferCtx.drawImage(img, 0, 0);
		var imageData = bufferCtx.getImageData(0,0,img.width,img.height);
		
		var highlightR = imageData.data[0];
		var highlightG = imageData.data[1];
		var highlightB = imageData.data[2];

		var midtoneR = imageData.data[4];
		var midtoneG = imageData.data[5];
		var midtoneB = imageData.data[6];

		var lowlightR = imageData.data[8];
		var lowlightG = imageData.data[9];
		var lowlightB = imageData.data[10];

		console.log(midtoneR, midtoneG, midtoneB)
		console.log($scope.shirtMidtoneR,$scope.shirtMidtoneG,$scope.shirtMidtoneB)

		for (var i = 0; i < (img.width * img.height * 4); i+=4) {
			var r = imageData.data[i];
			var g = imageData.data[i+1];
			var b = imageData.data[i+2];
			var a = imageData.data[i+3];
			
			if (r==highlightR && g==highlightG && b==highlightB){

				imageData.data[i]= $scope.shirtHighlightR;
				imageData.data[i+1]= $scope.shirtHighlightG;
				imageData.data[i+2]= $scope.shirtHighlightB;
			}

			if (r==midtoneR && g==midtoneG && b==midtoneB){

				imageData.data[i]= $scope.shirtMidtoneR;
				imageData.data[i+1]= $scope.shirtMidtoneG;
				imageData.data[i+2]= $scope.shirtMidtoneB;
			}
			
			if (r==lowlightR && g==lowlightG && b==lowlightB){

				imageData.data[i]= $scope.shirtLowlightR;
				imageData.data[i+1]= $scope.shirtLowlightG;
				imageData.data[i+2]= $scope.shirtLowlightB;
			}
		}
		bufferCtx.putImageData(imageData, 0, 0);

		var ctx = canvas.getContext('2d');
		ctx.drawImage(base,0,0);
		ctx.drawImage(buffer,0,0);

		var output = canvas.toDataURL("image/png");
		preview.src =output;

  		$('#previewimg').html('<img src="' + output + '"/>');
	}


	var init = function(){
		setTimeout($scope.updatePreview, 250);
		shirtHighlightColorElem = document.getElementById('shirtHighlight');
		shirtHighlightColorElem.onchange = function(evt){
			var rgb = evt.target.color.rgb;
			$scope.shirtHighlightR = Math.round(rgb[0] * 255);
			$scope.shirtHighlightG = Math.round(rgb[1] * 255);
			$scope.shirtHighlightB = Math.round(rgb[2] * 255);
			$scope.$apply($scope.updatePreview());
		}

		var shirtColorMidtoneElem = document.getElementById('shirtMidtone');
		shirtColorMidtoneElem.onchange = function(evt){
			var rgb = evt.target.color.rgb;
			$scope.shirtMidtoneR = Math.round(rgb[0] * 255);
			$scope.shirtMidtoneG = Math.round(rgb[1] * 255);
			$scope.shirtMidtoneB = Math.round(rgb[2] * 255);
			$scope.$apply($scope.updatePreview());
		}

		var shirtColorLowlightElem = document.getElementById('shirtLowlight');
		shirtColorLowlightElem.onchange = function(evt){
			var rgb = evt.target.color.rgb;
			$scope.shirtLowlightR = Math.round(rgb[0] * 255);
			$scope.shirtLowlightG = Math.round(rgb[1] * 255);
			$scope.shirtLowlightB = Math.round(rgb[2] * 255);
			$scope.$apply($scope.updatePreview());
		}
	}
	init();
}