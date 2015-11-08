(function ($) {
	'use strict';
	var FG = {
		_cachedResults: {
			categories: null,
			images: {}	
		},
		_elements: {
			$container: null,
			$preview: null
		},
		_cacheDOMLookups: function () {
			FG._elements.$container = $('.fg-container');
			FG._elements.$preview = $('.fg-preview');
		},
		_fetchCategories: function (callback) {
			$.get('/fancyGallery/categories', callback);
		},
		_fetchImages: function (categoryName, callback) {
			$.get('/fancyGallery/images/' + categoryName, callback);
		},
		_getCategories: function(callback) {
			if(!FG._cachedResults.categories) {
				FG._fetchCategories(function(categoriesHtml) {
					FG._cachedResults.categories = categoriesHtml;
					callback(categoriesHtml);
				});
			} else {
				callback(FG._cachedResults.categories);
			}
		},
		_getImages: function(categoryName, callback) {
			if(!FG._cachedResults.images[categoryName]) {
				FG._fetchImages(categoryName, function(picturesHtml) {
					FG._cachedResults.images[categoryName] = picturesHtml;
					callback(picturesHtml);
				});
			} else {
				callback(FG._cachedResults.images[categoryName]);
			}
		},
		_hidePreview: function() {
			var transitionTime = FG._elements.$preview.css('transitionDuration');
			var transitionTimeInMs = parseFloat(transitionTime.replace('s', '')) * 1000;
			FG._elements.$preview.css('opacity', '0');
			setTimeout(function() {
				FG._elements.$preview.css('display', 'none');
			}, transitionTimeInMs);
		},
		_initListeners: function () {
			$('body').on('click', '.fg-category', function (e) {
				e.preventDefault();
				var categoryName = $(this).data('categoryName');
				FG._switchToImages(categoryName);
			}).on('click', '.fg-backToCategories', function(e) {
				e.preventDefault();
				FG._getCategories(function(categoriesHtml) {
					FG._switchToCategories(categoriesHtml);
				});
			}).on('animationend webkitAnimationEnd oanimationend MSAnimationEnd', '.fg-image, .fg-backdrop, .fg-preview', function(e) {
				$(this).removeClass(e.originalEvent.animationName);
			}).on('click', '.fg-image', function(event) {
				event.preventDefault();
				FG._showPreview($(this).data('url'));
			}).on('click', '.fg-preview', function() {
				FG._hidePreview();
			});
		},
		_loadImages: function() {
			var $imageElements = $('.fg-image');
			$imageElements.each(function(index, element) {
				var $element = $(element); 
				FG._preloadImage($(element).data('thumbnailUrl'), function() {
					$element.children()
						.css('backgroundImage', 'url("' + this.src + '")')
						.addClass('flipInY');
				});
			});
		},
		_preloadImage: function(url, callback) {
			var virtualImage = new Image();
			virtualImage.onload = callback;
			virtualImage.src = url;
		},
		_setContent: function (html) {
			FG._elements.$container.html(html);
		},
		_showPreview: function(url) {
			FG._elements.$preview.css('background-image', '');
			FG._preloadImage(url, function() {
				FG._elements.$preview.css('background-image', 'url("' + this.src + '")');							
			});
			
			FG._elements.$preview.css('display', 'block');
				FG._elements.$preview.css('opacity', '1');
			
		},
		_switchToCategories: function() {
			FG._getCategories(function(categoriesHtml) {
				FG._setContent(categoriesHtml);
			});
		},
		_switchToImages: function(categoryName) {
			FG._getImages(categoryName, function (imagesHtml) {
				FG._setContent(imagesHtml);
				FG._loadImages();			
			});
		},
		init: function () {
			FG._cacheDOMLookups();
			FG._initListeners();

			FG._switchToCategories();
		}
	};

	window.FancyGallery = FG;
})(jQuery);