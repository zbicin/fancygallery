(function ($) {
	var FG = {
		_cachedResults: {
			categories: null,
			images: {}	
		},
		_elements: {
			container: null
		},
		_cacheDOMLookups: function () {
			FG._elements.container = $(".fg-container");
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
				FG._fetchImages(categoryName, function (imagesHtml) {
					FG._setContent(imagesHtml);
				});
			}).on('click', '.fg-backToCategories', function(e) {
				e.preventDefault();
				FG._getCategories(function(categoriesHtml) {
					FG._setContent(categoriesHtml);
				});
			});
		},
		_setContent: function (html) {
			FG._elements.container.html(html);
		},
		init: function () {
			FG._cacheDOMLookups();
			FG._initListeners();

			FG._getCategories(function (categoriesHtml) {
				FG._setContent(categoriesHtml);
			});

		}
	};

	window.FancyGallery = FG;
})(jQuery);