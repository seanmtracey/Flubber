var Flubber = (function(){

	'use strict';

	var cnvs = undefined,
		ctx = undefined,
		cnvsWidth = undefined,
		cnvsHeight = undefined,
		previousFrame = undefined,
		frame = undefined,
		blobPixels = undefined,
		cB = 1;

	function detectBlobs(){

		frame = ctx.getImageData(0, 0, cnvsWidth, cnvsHeight);

		var a = 0,
			xPos = 0,
			yPos = 0,
			c = frame.data.length; 

		while(a < c){

			var lum = (0.2126 * frame.data[a]) + (0.7152 * frame.data[a + 1]) + (0.0722 * frame.data[a + 2]);

			if( (0.2126 * frame.data[a]) + (0.7152 * frame.data[a + 1]) + (0.0722 * frame.data[a + 2]) >= 127){
				frame.data[a] = frame.data[a + 1] = frame.data[a + 2] = 255;
			} else {
				frame.data[a] = frame.data[a + 1] = frame.data[a + 2] = 0;
			}

			a += 4;

		}

		//ctx.putImageData(frame,0,0);
		for (var x = 0; x < cnvsWidth; x++) {

		  for (var y = 0; y < cnvsHeight; y++) {

		    var pos = (x + y * cnvsWidth) * 4;
		    	
		    if(frame.data[pos] === 255){

		    	if(blobPixels[pos] === 0){

		    		var eB = 0;

		    		for(var xB = -1; xB < 2; xB += 1){

		    			if(eB === 0){
		    				for(var yB = -1; yB < 2; yB += 1){

			    				var bPos = ( (x + xB) + (y + yB) * cnvsWidth);

			    				if(blobPixels[bPos] !== 0 && eB === 0){
			    					eB = blobPixels[bPos];
			    					break;
			    				}

			    			}
			    				
		    			} else {
		    				break;
		    			} 

		    		}

		    		if(eB === 0){
						blobPixels[pos] = cB;
						cB += 1		    			
		    		} else {
		    			blobPixels[pos] = eB;
		    		}

		    	}

		    }

		  }

		}

		

		ctx.putImageData(frame,0,0);

	}

	function init(canvasElement){

		try{
			canvasElement.getContext('2d');
		} catch(err){
			console.error("Could not get 2D context for element. Are you sure you passed a <canvas> element?");
			return false;
		}

		cnvs = canvasElement;
		ctx = cnvs.getContext('2d');

		cnvsWidth = cnvs.width;
		cnvsHeight = cnvs.height;

		blobPixels = new Uint16Array(cnvsWidth * cnvsHeight);

		var img = new Image();

		img.src = "/assets/images/test.jpg";

		img.onload = function(){
			ctx.drawImage(img, 0, 0);
			detectBlobs();	
		}

		

	}

	return{
		init : init
	};

});