import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';
import '../lib/collection.js';

Template.myJumbo.events({
	'click .js-addImg'(event){
		$("#addImgModal").modal("show");
	}
});

Template.addImg.events({
	'click .js-saveImg'(event){
		var imgTitle = $("#imgTitle").val();
		var imgPath = $("#imgPath").val();
		var imgDesc = $("#imgDesc").val();
		
		$("#imgTitle").val('');
		$("#imgPath").val('');
		$("#imgDesc").val('');
		$("#addImgPreview").attr('src','nba.jpg');
		$("#addImgModal").modal("hide");
		imagesDB.insert({"title":imgTitle, "path":imgPath, "desc":imgDesc, "createdOn":Date()});
	},
	'click .js-cancelAdd'(){
		$("#imgTitle").val('');
		$("#imgPath").val('');
		$("#imgDesc").val('');
		$("#addImgPreview").attr('src','nba.jpg');
		$("#addImgModal").modal("hide");
	},
	'input #imgPath'(event){
		var imgPath = $("#imgPath").val();
		$("#addImgPreview").attr('src', imgPath);
	}
});

Template.mainBody.helpers({
	imagesFound(){
		return imagesDB.find().count();
	},
	imageAge(){
		var imgCreatedOn = imagesDB.findOne({_id:this._id}).createdOn;
		imgCreatedOn = Math.round((new Date() - imgCreatedOn)/60000);
		var timeunit = "mins";
		if (imgCreatedOn > 60){
			imgCreatedOn=Math.round(imgCreatedOn/60);	
			timeunit = "hours";		
		} else if (imgCreatedOn > 1440){
			imgCreatedOn=Math.round(imgCreatedOn/1440);
			timeunit = "days";			
		}
		return imgCreatedOn + timeunit;

	},
	allImages(){
		var preTime = new Date() - 15000;
		var newResults = imagesDB.find({"createdOn":{$gte:prev}})
		if (newResults > 0){
			return imagesDB.find
		}
		return imgCreatedOn;
	}
});

Template.mainBody.events({
	'click .js-deleteImg'(){
		var imgId = this._id;
		$("#"+imgId).fadeOut('slow', function(){
			imagesDB.remove({_id:imgId});
		});
	},
	'click .js-editImage'(){
		var imgId = this._id;
		$('#ImgPreview').attr('src',imagesDB.findOne({_id:imgId}).path);
		$("#eimgTitle").val(imagesDB.findOne({_id:imgId}).title);
		$("#eimgPath").val(imagesDB.findOne({_id:imgId}).path);
		$("#eimgDesc").val(imagesDB.findOne({_id:imgId}).desc);
		$('#eId').val(imagesDB.findOne({_id:imgId})._id);
		$('#editImgModal').modal("show");
	},
	'click .js-rate'(event){
		var imgId = this.data_id;
		var rating = $(event.currentTarget).data('userrating');
		imagesDB.update({_id:imgId}, {$set:{'imgRate':rating}})
	}
});

Template.editImg.events({
	'click .js-updateImg'(){
		var eId = $('#eId').val();
		var imgTitle = $("#eimgTitle").val();
		var imgPath = $("#eimgPath").val();
		var imgDesc = $("#eimgDesc").val();
		imagesDB.update({_id:eId}, {$set:{"title":imgTitle, "path":imgPath, "desc":imgDesc}});
		$('#editImgModal').modal("hide");
	}
});