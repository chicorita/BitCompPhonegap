$(document).ready(function(){
    const time_format_options = { year: 'numeric', month: 'short', day: 'numeric', timezone: 'Asia/Hong_Kong' }
    var price_form_data = new FormData();
    price_form_data.append("key", "06a628d478e20665f76d6047bcb9042f");

    var btc_to_usd = 9674.8;

    // Get News
    $.ajax({
        url: "news.json",
        type: "GET",
        success: function(result) {
            $.each(result["articles"], function(i, article) {
                var article_time = new Date(article["publishedAt"]).toLocaleString('en-US', time_format_options);
                var html = '<div class="single-blog-area d-flex align-items-start"><div class="blog-thumbnail"><img src="' + 
                            article["urlToImage"] + '" alt=""></div><div class="blog-content"><a href="' + article["url"] + 
                            '" class="post-title">' + article["title"] + '</a><div class="meta-data">' + 
                            article["source"]["name"] + '|' + article_time + '</div><p>' + 
                            article["description"] + '</p></div></div>';

                $("#blog-area").append(html);
            })
        }
    });

    // Get BTC price
    $.ajax({
        url: 'get_price.php',
        type: 'POST',
        data: price_form_data,
        processData: false,
        contentType: false,
        success: function(result) {
            $("input.price-in-usd").attr("placeholder", result["data"][0]["price"]);
            btc_to_usd = result["data"][0]["price"];

            $.each(result["data"], function(i, source) {
                var html = '<div class="single-price-table d-flex align-items-center justify-content-between"><div class="p-content d-flex align-items-center"><span>0' + 
                            (i+1) + '</span><img src="img/bg-img/bitcoin.png" alt=""><p>' + source["site"] + ' <span>BTC</span></p></div><div class="price"><p>$' + 
                            source["price"] + '</p></div></div>';

                $("#price-table").append(html);
            })

            $("#price-loading").remove();
                        
        },
        error: function(msg) {
            console.log(msg);
        }
    })

    $("#btc-1").change(function(e) {
        if ($("#btc-1").val().trim() !== "") {
            $("#usd-1").val(calBTCToUSD(1, parseInt($("#btc-1").val())));
        } else {
            $("#usd-1").val("");
        }
        
    })

    // $("#btc-2").change(function(e) {
    //     $("#usd-2").val(calBTCToUSD(1, parseInt($("#btc-2").val())));
    // })

    $("#usd-1").change(function(e) {
        if ($("#usd-1").val().trim() !== "") {
            $("#btc-1").val(calBTCToUSD(2, parseInt($("#usd-1").val())));
        } else {
            $("#btc-1").val("");
        }
    })

    // $("#usd-2").change(function(e) {
    //     $("#btc-2").val(calBTCToUSD(2, parseInt($("#usd-2").val())));
    // })

    function calBTCToUSD(mode, value) {
        if (mode === 1) {
            // value is BTC, convert to USD
            return value * btc_to_usd;
        } else {
            // value is USD, convert to BTC
            return Math.round((value / btc_to_usd + Number.EPSILON) * 10000000) / 10000000;
        }
    }

});
