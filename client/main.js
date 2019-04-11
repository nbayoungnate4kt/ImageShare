import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session'

import './main.html';
import '../lib/collection.js';

Session.set('imgLimit', 3);

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
		imagesDB.insert({"title":imgTitle, "path":imgPath, "desc":imgDesc, "createdOn":new Date().getTime()});
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
		//convert to mins
		imgCreatedOn = Math.round((new Date() - imgCreatedOn)/60000);		
		var timeUnit = " mins";
		//greater than 60 mins then convert to hours
		if (imgCreatedOn > 60){
			imgCreatedOn=Math.round(imgCreatedOn/60);
			//hour or hours
			if (imgCreatedOn > 1){
				timeUnit = " hours";
			} else {
				timeUnit = " hour";
			}
		} else if (imgCreatedOn > 1440){
			imgCreatedOn=Math.round(imgCreatedOn/1440);
			if (imgCreatedOn > 1){
				timeUnit = " days";
			} else {
				timeUnit = " day";
			}
		}
		return imgCreatedOn + timeUnit;
	},
	allImages(){
		//Get time 15 seconds ago
		var prevTime = new Date() - 15000;
		var newResults = imagesDB.find({"createdOn":{$gte:prevTime}}).count();
		if (newResults > 0) {
			//if new images are found then sort by date first then ratings
			return imagesDB.find({}, {sort:{createdOn:-1, imgRate:-1}, limit:Session.get('imgLimit')});
		} else {
			//else sort by ratings then date
			return imagesDB.find({}, {sort:{imgRate:-1, createdOn:1}, limit:Session.get('imgLimit')});
		}
		
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
		imagesDB.update({_id:imgId}, {$set:{'imgRate':rating}});
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

lastScrollTop = 0;
$(window).scroll(function(event){
	if ($(window).scrollTop() + $(window). height() > $(document).height() - 100) {
		var scrollTop = $(this).scrollTop();
		if (scrollTop > lastScrollTop){
			console.log("we have arrived at the bottom of the page");
			Session.set('imgLimit', Session.get('imgLimit') + 3);
		}
		lastScrollTop = scrollTop;
		
	}
});