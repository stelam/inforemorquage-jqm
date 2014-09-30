PhotoMixins = {  
	/*
	*
	*/
    savePhotoToPersistent: function(tempPhotoUrl, callback) {  
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSys) {
			window.resolveLocalFileSystemURL(tempPhotoUrl, function(entry) {
				var d = new Date();
				var n = d.getTime();
				var e = ".jpg";
				var fileName = n + e;
				
				fileSys.root.getDirectory('info-remorquage', {create: true}, function(dir) {
				
					entry.copyTo(dir, fileName, function(movedEntry) {
						photoUrl = dir.toNativeURL() + "/" + fileName;

						callback(dir, fileName);

					}, function(error) { 
						alert('copyTo fail (' + error.code + '): ');
					});
				
				});
			});
		});
    },  

    secondProperty: 'foobar'  
};  