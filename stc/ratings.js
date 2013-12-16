var state = null;
var id = document.location.pathname;

function showRatings(kind) {
    var table = $(kind + "-ratings");

    var header = new Element("tr");
    if (kind == "player") {
        header.insert(new Element("td").updateText("Rank"));
    }
    header.insert(new Element("td").updateText("Rating"));
    header.insert(new Element("td").updateText("Name"));
    header.insert(new Element("td").updateText("Games Played"));
    table.insert(header);

    var rank = 1;

    $H(state[kind + "s"]).sortBy(function (a) { return -a.value.score } ).each(function(elem) {
        var value = elem.value;
        var row = new Element("tr");
        if (kind == "player") {
            if (rank == 1 || rank % 10 == 0) {
                row.insert(new Element("td").updateText(rank));
            } else {
                row.insert(new Element("td"));
            }
            rank++;
        }
        row.insert(new Element("td").updateText(Math.floor(value.score)));
        if (kind == "player") {
            row.insert(new Element("td").update(
                new Element("a", {"href":"/player/" + value.username}).
                    updateText(value.username)));
        } else {
            row.insert(new Element("td").updateText(value.name));
        }
        row.insert(new Element("td").updateText(value.games));
        table.insert(row);
    });
}

function showLinks(id) {
    $(id + "-links").style.display = "block";
    $(id + "-show-link").style.display = "none";
}

function loadRatings() {
    new Ajax.Request("/data/ratings.json", {
        method:"get",
        onSuccess: function(transport){
            state = transport.responseText.evalJSON();
            try {
                showRatings("player");
                showRatings("faction");
                $("timestamp").innerHTML = "Last updated: " + state.timestamp;
            } catch (e) {
                handleException(e);
            };
        }
    });
}