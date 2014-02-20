
// DEMO
// -------------------------------
// $(function(){
//     $('element').featuredPosts({
//         apiURL : '',
//         apiKey : '',
//         postNum : 4,
//         tagName : ''
//     });
// });

;(function ( $, window, document, undefined ) {

    var pluginName = "featuredPosts",
        defaults = {
            postNum : 4,            // # of posts
            tagName : 'featured',   // featured tag
            apiURL  : '',           // Tumblr URL (eg. http://blogname.tumblr.com)
            apiKey  : ''            // Tumblr API Key
        };

    function Plugin ( element, options ) {
        this.element = element;
        this.settings = $.extend( {}, defaults, options );
        this._defaults = defaults;
        this._name = pluginName;
        this.getData();
    }

    Plugin.prototype = {

        _posts : [],

        getData : function () {

            var me = this, jsonURL;

            // Get Tumblr API
            jsonURL = '//api.tumblr.com/v2/blog/' + me.settings.apiURL + '/posts?api_key=' +
                           me.settings.apiKey + '&tag=' + me.settings.tagName + '&callback=?';

            $.getJSON( jsonURL, function (data) {

                for ( i=0; i < data.response.posts.length; i++ ) {
                    me._posts.push(data.response.posts[i]);
                    if (i === me.settings.postNum - 1) {
                        break;
                    }
                }

                me.build();

            });

        },

        build : function () {

            var frame, data;

            frame = '';
            data  = this._posts;

            for ( i=0; i < data.length; i++ ) {

                var content = '',
                       type = data[i].type;

                // Debug
                // console.log(data[i]);

                content += '<li class="featured-' + type + '">';

                if (type !== 'link') {
                    content += '<a href="' + data[i].post_url + '">';
                } else {
                    content += '<a href="' + data[i].url + '">';
                }

                switch (type)
                {
                    // @todo
                    // -------
                    // Finish Answers
                    // Search for edge cases
                    // Cleanup
                    case 'photo':
                        if (data[i].photos.length > 1) {
                            content += '<ul class="featured-' + type + '-set">';
                            for ( j=0; j < data[i].photos.length; j++) {
                                content +=  '<li class="featured-' + type + '-set-photo">' +
                                                '<img src="' + data[i].photos[j].original_size.url + '" />' +
                                            '</li>';
                            }
                            content += '</ul>';
                        } else {
                            content += '<img src="' + data[i].photos[0].original_size.url + '" />';
                        }
                        content += '<div class="featured-' + type + '-caption">' + data[i].caption + '</div>';
                    break;
                    case 'quote':
                        content += '<div class="featured-' + type + '-text">' + data[i].text + '</div>';
                        content += '<div class="featured-' + type + '-source">' + data[i].source + '</div>';
                    break;
                    case 'link':
                        content += '<div class="featured-' + type + '-title">' + data[i].title + '</div>';
                        content += '<div class="featured-' + type + '-description">' + data[i].description + '</div>';
                    break;
                    case 'chat':
                        content += '<div class="featured-' + type + '-dialogue">';
                        for (j=0; j < data[i].dialogue.length; j++) {
                            content += '<p>';
                            content += '<strong>' + data[i].dialogue[j].name + '</strong>';
                            content += '<span>' + data[i].dialogue[j].phrase + '</span>';
                            content += '</p>';
                        }
                        content += '</div>';
                    break;
                    case 'audio':
                        content += data[i].embed;
                        content += '<div class="featured-' + type + '-caption">' + data[i].caption + '</div>';
                    break;
                    case 'video':
                        content += data[i].player[2].embed_code;
                        content += '<div class="featured-' + type + '-caption">' + data[i].caption + '</div>';
                    break;
                    // case 'answer':
                    // break;
                    default:
                        content += '<div class="featured-' + type +'-title">' + data[i].title + '</div>' +
                                   '<div class="featured-' + type +'-body">'  + data[i].body  + '</div>';
                    break;
                }

                content += '</a>';
                content += '</li>';

                frame += content;

            }

            $(this.element).prepend($('<ul/>').addClass('featured-list').append(frame));

        }

    };

    $.fn[ pluginName ] = function ( options ) {
        this.each(function() {
            if ( !$.data( this, "plugin_" + pluginName ) ) {
                $.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
            }
        });
        return this;
    };

})( jQuery, window, document );
