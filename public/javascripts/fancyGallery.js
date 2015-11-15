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
		_getCategories: function (callback) {
			if (!FG._cachedResults.categories) {
				FG._fetchCategories(function (categoriesHtml) {
					FG._cachedResults.categories = categoriesHtml;
					callback(categoriesHtml);
				});
			} else {
				callback(FG._cachedResults.categories);
			}
		},
		_getImages: function (categoryName, callback) {
			if (!FG._cachedResults.images[categoryName]) {
				FG._fetchImages(categoryName, function (picturesHtml) {
					FG._cachedResults.images[categoryName] = picturesHtml;
					callback(picturesHtml);
				});
			} else {
				callback(FG._cachedResults.images[categoryName]);
			}
		},
		_hidePreview: function () {
			FG._elements.$preview.hide();
		},
		_initListeners: function () {
			$('body').on('click', '.fg-category', function (e) {
				e.preventDefault();
				var categoryName = $(this).data('categoryName');
				FG._switchToImages(categoryName);
			}).on('click', '.fg-backToCategories', function (e) {
				e.preventDefault();
				FG._getCategories(function (categoriesHtml) {
					FG._switchToCategories(categoriesHtml);
				});
			}).on('animationend webkitAnimationEnd oanimationend MSAnimationEnd', '.fg-image, .fg-backdrop, .fg-preview', function (e) {
				$(this).removeClass(e.originalEvent.animationName);
			}).on('click', '.fg-image', function (event) {
				event.preventDefault();
				FG._showPreview($(this).data('url'));
			}).on('click', '.fg-preview', function () {
				FG._hidePreview();
			});
		},
		_loadCategories: function () {
			var $categoriesElements = $('.fg-category');
			var delay = 200;

			$categoriesElements.each(function (index, element) {
				var $element = $(element);
				setTimeout(function () {
					$element.children()
						.addClass('fadeInDownSmall');
				}, delay * index);
			});
		},
		_loadImages: function () {
			var $imageElements = $('.fg-image');
			var delay = 200;
			var loadedImagesCount = 0;

			$imageElements.each(function (index, element) {
				var $element = $(element);
				FG._preloadImage($(element).data('url'), function () {
					var src = this.src;
					loadedImagesCount++;
					setTimeout(function () {
						loadedImagesCount--;
						$element.children()
							.css('backgroundImage', 'url("' + src + '")')
							.addClass('fadeInDownSmall');
					}, delay * loadedImagesCount);
				});
			});
		},
		_preloadImage: function (url, callback) {
			var virtualImage = new Image();
			virtualImage.onload = callback;
			virtualImage.src = url;
		},
		_setContent: function (html) {
			FG._elements.$container.html(html);
		},
		_showPreview: function (url) {
			FG._elements.$preview
				.css('background-image', 'url("' + url + '")')
				.show();

		},
		_switchToCategories: function () {
			FG._getCategories(function (categoriesHtml) {
				FG._tilesExit(function () {
					FG._setContent(categoriesHtml);
					FG._loadCategories();
				});
			});
		},
		_switchToImages: function (categoryName) {
			FG._getImages(categoryName, function (imagesHtml) {
				FG._tilesExit(function () {
					FG._setContent(imagesHtml);
					FG._loadImages();
				});
			});
		},
		_tilesEnter: function () {

		},
		_tilesExit: function (callback) {
			var $tilesInners = $('.fg-tile .fg-tile-inner');
			if ($tilesInners.length > 0) {
				var animationTime = $tilesInners.first().css('animationDuration');
				var animationTimeInMs = parseFloat(animationTime.replace('s', '')) * 1500;
				$tilesInners.addClass('fadeOutDownSmall');
				setTimeout(callback, animationTimeInMs);
			}
			else {
				callback();
			}
		},
		init: function () {
			FG._cacheDOMLookups();
			FG._initListeners();

			FG._switchToCategories();
		}
	};

	window.FancyGallery = FG;
})(jQuery);