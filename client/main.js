import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';
import '../lib/collection.js';

Template.myJumbo.events({
	'click .js-addImg'(event){
		$("#addImgModal").modal("show");
	}
})

Template.addImg.events({
	'click .js-saveImg'(event, instance){
		var imgTitle = $("#imgTitle").val();
		var imgPath = $("#imgPath").val();
		var imgDesc = $("#imgDesc").val();

		$("#imgTitle").val('');
		$("#imgPath").val('');
		$("#imgDesc").val('');
		$("#addImgModal").modal("hide");
	},
	'change #imgPath'(event){
		var imgPath = $("#imgPath").val();
		$("#addImgPreview").attr('src', imgPath);
	}

});