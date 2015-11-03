(function ($) {
	var FG = {
		_cachedResults: {
			categories: null,
			images: {}	
		},
		_elements: {
			$container: null
		},
		_cacheDOMLookups: function () {
			FG._elements.$container = $(".fg-container");
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
			});
		},
		_loadImages: function() {
			var $imageElements = $('.fg-image');
			$imageElements.each(function(index, element) {
				var image = new Image();
				var $element = $(element); 
				image.onload = function() {
					$element.css('backgroundImage', 'url("' + this.src + '")');
				};
				image.src = $element.data('thumbnailUrl');
			});
		},
		_setContent: function (html) {
			FG._elements.$container.html(html);
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