$(document).on("ready", function () {
  function openDawer() {
    $.ajax({
      url: "/cart?view=ajax",
      type: "GET",
    }).done(function (data) {
      $(".cart-drawer").append(data);
    });
  }
  // click cart icon
  $(".nav-shopping-cart").on("click", function (e) {
    e.preventDefault();
    openDawer();
  });

  //close drawer
  $(".close-cart-drawer").on("click", function (e) {
    e.preventDefault();
    $(".cart-ajax-wrapper").remove();
  });

  //close quickshop
  $(".close-quickshop").on("click", function (e) {
    e.preventDefault();
    $(".popup-modal").fadeOut(600);
  });

  //addtocart display cart drawer
  $(document).on("click", "#AddToCart", function (e) {
    e.preventDefault();
    var thisButton = $(this);
    $.ajax({
      type: "POST",
      url: "/cart/add.js",
      dataType: "json",
      data: thisButton.closest("form").serialize(),
      success: function () {
        openDawer();
        if ($(".popup-modal").length) {
          $(".popup-modal").fadeOut(800);
        }
      },
      error: function (e) {
        console.log(e);
      },
    });
  });

  //click plus to change quantity

  $(document).on("click", ".cart-quantitiy-plus", function (e) {
    e.preventDefault();
    var qty;
    var thisButton = $(this);
    var currentQantity = parseInt($(this).siblings("input").val());
    var newQantity = currentQantity + 1;
    $(this).siblings("input").val(newQantity);
    //we get the key
    var temp = $(this).siblings("input").attr("idk").replace("updates_", "");

    $.ajax({
      type: "POST",
      url: "/cart/change.js",
      dataType: "json",
      //data: thisButton.closest("form").serialize(),
      data: {
        quantity: newQantity,
        id: temp,
      },
      success: function (e) {
        console.log(e);
        var temp1 = thisButton
          .closest(".cart__row--table-large")
          .find(".cart-item-line-price");
        // temp1.text(e.items[0].original_line_price);
        var cartItemslength = e.items.length;
        for (i = 0; i < cartItemslength; i++) {
          if (e.items[i].key == temp) {
            temp1.html(
              BrendaShopify.formatMoney(e.items[i].original_line_price)
            );
          }
        }
        var subTotal = e.total_price;
        $(".cart-total-price").html(BrendaShopify.formatMoney(subTotal));
      },
      error: function (e) {
        console.log(e);
      },
    });
  });

  // minues quanitty
  $(document).on("click", ".cart-quantitiy-minus", function (e) {
    e.preventDefault();
    var thisButton = $(this);
    var currentQantity = parseInt($(this).siblings("input").val());
    var newQantity = currentQantity - 1;
    console.log(newQantity);
    $(this).siblings("input").val(newQantity);

    updateKey = $(this).siblings("input").attr("idk").replace("updates_", "");

    $.ajax({
      type: "POST",
      url: "/cart/change.js",
      dataType: "json",
      data: {
        quantity: newQantity,
        id: updateKey,
      },

      success: function (e) {
        temp2 = thisButton
          .closest(".cart__row--table-large")
          .find(".cart-item-line-price");
        cartItemslength = e.items.length;
        if (cartItemslength > 0) {
          for (i = 0; i < cartItemslength; i++) {
            if (e.items[i].key == updateKey) {
              temp2.html(
                BrendaShopify.formatMoney(e.items[i].original_line_price)
              );
            }
          }
        }

        var subTotal = e.total_price;
        $(".cart-total-price").html(BrendaShopify.formatMoney(subTotal));
      },
      error: function (e) {
        console.log(e);
      },
    });
  });
});

var BrendaShopify = BrendaShopify || {};
// ---------------------------------------------------------------------------
// Money format handler
// ---------------------------------------------------------------------------
BrendaShopify.money_format = "${{amount}}";
BrendaShopify.formatMoney = function (cents, format) {
  if (typeof cents == "string") {
    cents = cents.replace(".", "");
  }
  var value = "";
  var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
  var formatString = format || this.money_format;

  function defaultOption(opt, def) {
    return typeof opt == "undefined" ? def : opt;
  }

  function formatWithDelimiters(number, precision, thousands, decimal) {
    precision = defaultOption(precision, 2);
    thousands = defaultOption(thousands, ",");
    decimal = defaultOption(decimal, ".");

    if (isNaN(number) || number == null) {
      return 0;
    }

    number = (number / 100.0).toFixed(precision);

    var parts = number.split("."),
      dollars = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + thousands),
      cents = parts[1] ? decimal + parts[1] : "";

    return dollars + cents;
  }

  switch (formatString.match(placeholderRegex)[1]) {
    case "amount":
      value = formatWithDelimiters(cents, 2);
      break;
    case "amount_no_decimals":
      value = formatWithDelimiters(cents, 0);
      break;
    case "amount_with_comma_separator":
      value = formatWithDelimiters(cents, 2, ".", ",");
      break;
    case "amount_no_decimals_with_comma_separator":
      value = formatWithDelimiters(cents, 0, ".", ",");
      break;
  }

  return formatString.replace(placeholderRegex, value);
};
