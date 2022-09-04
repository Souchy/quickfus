define('api',["require", "exports", "aurelia-http-client"], function (require, exports, aurelia_http_client_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var WebAPI = (function () {
        function WebAPI() {
            this.client = new aurelia_http_client_1.HttpClient();
        }
        WebAPI.prototype.getUrl = function () {
            return "http://" + location.hostname + ":9696";
        };
        WebAPI.prototype.findOne = function (collection, id) {
            var url = this.getUrl() + "/" + collection + "/" + id;
            return this.client.get(url);
        };
        WebAPI.prototype.aggregate = function (collection, pipeline) {
            var url = this.getUrl() + "/" + collection;
            var req = new aurelia_http_client_1.HttpRequestMessage("POST", url, pipeline);
            return this.client.send(req, []);
        };
        WebAPI.prototype.getSet = function (id) {
            return this.findOne("sets", id);
        };
        WebAPI.prototype.getItem = function (id) {
            return this.findOne("items", id);
        };
        WebAPI.prototype.findItems = function (itemfilters) {
            return null;
        };
        WebAPI.prototype.getItems = function (pipeline) {
            return this.aggregate("items", pipeline);
        };
        WebAPI.prototype.getSets = function (pipeline) {
            return this.aggregate("sets", pipeline);
        };
        WebAPI.prototype.hash = function (password, salt) {
            return password;
        };
        WebAPI.local = false;
        return WebAPI;
    }());
    exports.WebAPI = WebAPI;
});
;
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('app',["require", "exports", "aurelia-framework", "./api", "./db"], function (require, exports, aurelia_framework_1, api_1, db_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var App = (function () {
        function App(api) {
            this.api = api;
            this.body = "";
            console.log("app ctor");
            db_1.db.init(true);
        }
        App.prototype.configureRouter = function (config, router) {
            console.log("configure router");
            config.title = 'Quickfus';
            config.options.pushState = true;
            config.addPipelineStep('postcomplete', PostCompleteStep);
            config.map([
                { route: '', moduleId: "pages/build/build", name: 'index' },
                { route: 'build', moduleId: "pages/build/build", name: 'build' },
                { route: 'builds', moduleId: "pages/builds/builds", name: 'builds' },
                { route: 'items', moduleId: "pages/items/itemsearch", name: 'items' },
                { route: 'sets', moduleId: "pages/sets/setsearch", name: 'sets' }
            ]);
            config.mapUnknownRoutes(function (instruction) {
                return { route: 'unknownroute', name: 'unknownroute' };
            });
            this.router = router;
        };
        App = __decorate([
            aurelia_framework_1.inject(api_1.WebAPI),
            __metadata("design:paramtypes", [api_1.WebAPI])
        ], App);
        return App;
    }());
    exports.App = App;
    var PostCompleteStep = (function () {
        function PostCompleteStep() {
        }
        PostCompleteStep.prototype.run = function (instruction, next) {
            if (!instruction.config.settings.noScrollToTop) {
                window.scrollTo(0, 0);
            }
            return next();
        };
        return PostCompleteStep;
    }());
});
;
define('text!app.css',[],function(){return "/*\nbody {\n  background-color: #3d3d3d;\n  color: white;\n} */\n:root {\n  /* --bg0: #212121; */\n  --bg0: #121212;\n  /* level 0 dark */\n  --bg1: #212121;\n  /* level 1 dark */\n  --front0: rgba(255, 255, 255, 0.87);\n  /* #bdbdbd; /* text on background */\n  --front1: black;\n  /* text on accent */\n  --accent0: #BB86FC;\n  /* purple */\n  --accent1: #03DAC5;\n  /* teal */\n  --accent2: darkred;\n  /* #CF6679; /* red error */\n  --accent1a: rgba(3, 218, 197, 0.5);\n  /* teal with alpha */\n  --shadow: black;\n  --surface: #FFFFFF;\n  --onsurface: #121212;\n  --primarysurface: #3700B3;\n}\nbody {\n  /* background-image: url(\"/src/res/Tex_krakken.PNG\"); */\n  background-color: var(--bg0) !important;\n  color: var(--front0) !important;\n}\n#page-container {\n  position: relative;\n  min-height: 100vh;\n}\n#content-wrap {\n  padding-bottom: 2.5rem;\n  /* Footer height */\n}\n.sheet {\n  background: var(--bg1);\n  color: var(--front0);\n}\n.sheettip {\n  background: var(--bg1);\n  color: var(--front0);\n  opacity: 0.7;\n}\n.surface {\n  background: var(--surface);\n  color: var(--onsurface);\n}\n/* button */\n/* this button is accent>transparent and turns black>accent on hover */\n.btn0 {\n  color: var(--accent1);\n  background: var(--bg0);\n  border: 1px solid transparent;\n}\n.btn0:hover {\n  color: var(--front1);\n  background: var(--accent1);\n  border-color: var(--accent1);\n}\n/* this button is white>gray with an accent border */\n.btn1 {\n  color: var(--front0);\n  background: var(--bg1);\n  border: 1px solid var(--accent1);\n}\n.btnDelete {\n  color: var(--accent1);\n  background: var(--bg0);\n  border: 1px solid transparent;\n  width: 38px;\n  height: 30px;\n}\n.btnDelete:hover {\n  color: var(--front1);\n  background: var(--accent1);\n  border-color: var(--accent1);\n}\n.btnSearch {\n  color: var(--front0);\n  background: var(--bg1);\n  border: 1px solid var(--accent1);\n  width: 30%;\n  height: 40px;\n  margin: 0 auto;\n}\n.btnAdd {\n  color: var(--front0);\n  background: var(--bg1);\n  border: 1px solid var(--accent1);\n  margin: 0 auto;\n  width: 80%;\n  height: 40px;\n}\n/* Text input */\ninput[type=text] {\n  background: var(--bg1);\n  color: var(--front0);\n  border: 1px solid var(--accent1);\n}\n/* Number input */\ninput[type=number] {\n  width: 70px;\n  background: var(--bg1);\n  text-align: center;\n  color: var(--front0);\n  border: 1px solid var(--accent1);\n}\ninput[type=number]::-webkit-inner-spin-button,\ninput[type=number]::-webkit-outer-spin-button {\n  -webkit-appearance: none;\n  margin: 0;\n}\n";});;
define('text!app.html',[],function(){return "<template>\n  <require from=\"./app.less\"></require>\n  <require from=\"./components/header\"></require>\n  <require from=\"./components/footer\"></require>\n\n\n\n  <div id=\"page-container\">\n    <div id=\"content-wrap\">\n      <!-- header component -->\n      <header></header>\n      <!-- render the router view (aka whichever page selected by the url and routed by app.ts) -->\n      <router-view model.bind=\"data\"></router-view>\n    </div>\n    <!-- footer component -->\n    <footer></footer>\n  </div>\n\n</template>\n";});;
define('text!app.less',[],function(){return "/*\nbody {\n  background-color: #3d3d3d;\n  color: white;\n} */\n:root {\n  /* --bg0: #212121; */\n  --bg0: #121212; /* level 0 dark */\n  --bg1: #212121; /* level 1 dark */\n  --front0: rgba(255, 255, 255, 0.87); /* #bdbdbd; /* text on background */\n  --front1: black; /* text on accent */\n  --accent0: #BB86FC; /* purple */\n  --accent1: #03DAC5; /* teal */\n  --accent2: darkred; /* #CF6679; /* red error */\n  --accent1a: rgba(3, 218, 197, 0.5); /* teal with alpha */\n  --shadow: black;\n\n  --surface: #FFFFFF;\n  --onsurface: #121212;\n  --primarysurface: #3700B3;\n}\n\nbody {\n  /* background-image: url(\"/src/res/Tex_krakken.PNG\"); */\n  background-color: var(--bg0) !important;\n  color: var(--front0) !important;\n}\n\n#page-container {\n  position: relative;\n  min-height: 100vh;\n}\n#content-wrap {\n  padding-bottom: 2.5rem;    /* Footer height */\n}\n\n.sheet {\n  background: var(--bg1);\n  color: var(--front0);\n}\n.sheettip {\n  background: var(--bg1);\n  color: var(--front0);\n  opacity: 0.7;\n}\n.surface {\n  background: var(--surface);\n  color: var(--onsurface);\n}\n\n\n/* button */\n/* this button is accent>transparent and turns black>accent on hover */\n.btn0 {\n  color: var(--accent1);\n  background: var(--bg0);\n  border: 1px solid transparent;\n}\n.btn0:hover {\n  color: var(--front1);\n  background: var(--accent1);\n  border-color: var(--accent1);\n}\n/* this button is white>gray with an accent border */\n.btn1 {\n  color: var(--front0);\n  background: var(--bg1);\n  border: 1px solid var(--accent1);\n}\n.btnDelete {\n  color: var(--accent1);\n  background: var(--bg0);\n  border: 1px solid transparent;\n  width: 38px;\n  height: 30px;\n}\n.btnDelete:hover {\n  color: var(--front1);\n  background: var(--accent1);\n  border-color: var(--accent1);\n}\n.btnSearch {\n  color: var(--front0);\n  background: var(--bg1);\n  border: 1px solid var(--accent1);\n  width: 30%;\n  height: 40px;\n  margin: 0 auto;\n}\n.btnAdd {\n  color: var(--front0);\n  background: var(--bg1);\n  border: 1px solid var(--accent1);\n  margin: 0 auto;\n  width: 80%;\n  height: 40px;\n}\n\n/* Text input */\ninput[type=text] {\n  background: var(--bg1);\n  color: var(--front0);\n  border: 1px solid var(--accent1);\n}\n\n/* Number input */\ninput[type=number] {\n  width: 70px;\n  background: var(--bg1);\n  text-align: center;\n  color: var(--front0);\n  border: 1px solid var(--accent1);\n}\ninput[type=number]::-webkit-inner-spin-button,\ninput[type=number]::-webkit-outer-spin-button {\n  -webkit-appearance: none;\n  margin: 0;\n}\n";});;
define('components/footer',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var footer = (function () {
        function footer() {
        }
        return footer;
    }());
    exports.footer = footer;
});
;
define('text!components/footer.css',[],function(){return ".socials {\n  /* position: absolute; */\n  bottom: 4%;\n  /* text-align: center; */\n  /* transform: translate(-50%, -50%); */\n  /* width: 100%; */\n  /* align-content:center; */\n}\na {\n  display: inline-block;\n  padding: 5px;\n  color: black;\n  /* text-decoration: none; */\n}\nfooter {\n  position: absolute;\n  left: 0;\n  bottom: 0;\n  width: 100%;\n  text-align: center;\n}\n";});;
define('text!components/footer.html',[],function(){return "<template>\n  <require from=\"./footer.css\"></require>\n\n  <!-- <span class=\"socials\">\n    <a href=\"google.com\">Discord</a>\n    <a href=\"google.com\">Twitter</a>\n    <a href=\"google.com\">Reddit</a>\n  </span> -->\n\n  <span>\n    © 2020 Quickfus. Toutes les images sont la propriété d'Ankama.\n  </span>\n\n</template>\n";});;
define('components/header',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var header = (function () {
        function header() {
        }
        return header;
    }());
    exports.header = header;
});
;
define('text!components/header.css',[],function(){return "nav {\n  width: 100%;\n  height: 50px;\n  margin-bottom: 20px;\n  background-color: transparent;\n  border-bottom: 1px solid var(--accent1);\n  /* padding-left: 0px !important; */\n}\nnav li {\n  height: 50px;\n  padding-left: 10px;\n  padding-right: 10px;\n}\nnav li:hover {\n  color: var(--front1);\n  background-color: var(--accent1);\n  text-decoration: none;\n}\nnav li:hover a {\n  color: var(--front1);\n  background-color: var(--accent1);\n  text-decoration: none;\n}\nnav a {\n  height: 50px;\n  color: var(--accent1);\n  text-decoration: none;\n  padding: 12px !important;\n}\nnav a:visited {\n  color: var(--accent1);\n  text-decoration: none;\n  background-color: #555;\n}\n";});;
define('text!components/header.html',[],function(){return "<template>\n  <require from=\"./header.css\"></require>\n\n  <nav class=\"navbar navbar-expand-lg\">\n\n    <ul class=\"navbar-nav mr-auto\">\n      <li class=\"nav-item\">\n        <a class=\"nav-link\" href=\"/builds\">Builds</a>\n      </li>\n      <li class=\"nav-item\">\n        <a class=\"nav-link\" href=\"/build\">Build</a>\n      </li>\n      <li class=\"nav-item\">\n        <a class=\"nav-link\" href=\"/items\">Items</a>\n      </li>\n      <li class=\"nav-item\">\n        <a class=\"nav-link\" href=\"/sets\">Sets</a>\n      </li>\n    </ul>\n\n    <ul class=\"navbar-nav\">\n      <li class=\"nav-item\">\n        <a href=\"https://twitter.com/quickfus\">\n          <i class=\"fab fa-twitter\"></i>\n        </a>\n      </li>\n      <li class=\"nav-item\">\n        <a href=\"https://github.com/Souchy/quickfus\">\n          <i class=\"fab fa-github\"></i>\n        </a>\n      </li>\n    </ul>\n\n  </nav>\n\n</template>\n";});;
define('text!components/mason.css',[],function(){return "/* ---- grid ---- */\n.grid:after {\n  content: '';\n  display: block;\n  clear: both;\n}\n.grid-wrapper {\n  width: 100%;\n  height: 100%;\n  min-height: 1000px;\n}\n.grid {\n  margin: 0 auto;\n  /* min-width: 540;\n  min-height: 1000px; */\n}\n/* clearfix */\n/* .grid:after {\n  content: '';\n  display: block;\n  clear: both;\n} */\n/* ---- grid-item ---- */\n.grid-item {\n  float: left;\n  width: 260px;\n  /* min-height: 150px; */\n  /* padding: 5px; */\n  /* margin: 5px;  /* masonry does not respect left & right margins, so we need to use gutter : 10 instead */\n  margin-bottom: 10px;\n  /* and to add a margin-bottom for vertical gutter (this is respected by masonry) */\n}\n";});;
define('components/statmod',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ModFilter = (function () {
        function ModFilter() {
            this.activate = true;
        }
        return ModFilter;
    }());
    exports.ModFilter = ModFilter;
    var statmod = (function () {
        function statmod() {
            this.activate = true;
            this.boxCount = 2;
        }
        statmod.prototype.onModInputFocus = function (that, event, blockid, modid) {
            $(event.target).closest(".searchable").find("dl").show();
            $(event.target).closest(".searchable").find("dl section dd").show();
        };
        statmod.prototype.onModInputBlur = function (that, event, blockid, modid) {
            setTimeout(function () {
                $(event.target).closest(".searchable").find("dl").hide();
            }, 300);
        };
        statmod.prototype.oninput = function (that, event) {
        };
        statmod.prototype.onDDHover = function (that, event, blockid, modid, modname) {
            $(event.target).closest(".searchable").find("dl section dd.selected").removeClass("selected");
            $(event.target).addClass("selected");
        };
        statmod.prototype.onDDClick = function (that, event, blockid, modid, modname) {
            var ele = event.target;
            this.modsref[modid].name = modname;
            var input = $(ele).closest(".searchable").find("input");
            input.blur();
        };
        return statmod;
    }());
    exports.statmod = statmod;
});
;
define('text!components/statmod.html',[],function(){return "<template>\n\n  <div name=\"modsearch\" class=\"searchable\">\n    <input name=\"modsearchinput\" type=\"text\" autocomplete=\"off\" placeholder=\"+Add Stat Mod\" value.bind=\"name\" onkeyup.call=\"filterFunction2($this,$event)\" onchange.call=\"oninput($this, $event)\" onfocus.call=\"onModInputFocus($this, $event, i, j)\"\n      onblur.call=\"onModInputBlur($this, $event, i, j)\">\n    <dl name=\"modsearchlist\" class=\"modlist\">\n      <section repeat.for=\"[section, mods] of modsSections\">\n        <dt>${section}</dt>\n        <dd repeat.for=\"modname of mods\" onmouseover.call=\"onDDHover($this, $event, i, j, modname)\" onclick.call=\"onDDClick($this, $event, i, j, modname)\">${modname}</dd>\n      </section>\n    </dl>\n  </div>\n\n</template>";});;
define('db',["require", "exports", "./i18n"], function (require, exports, i18n_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var db = (function () {
        function db() {
            db.init(true);
        }
        db.init = function (force) {
            i18n_1.i18n.readProperties(i18n_1.EnumStat, "./src/res/i18n/stats/stats");
            i18n_1.i18n.readProperties(i18n_1.EnumWeaponStat, "./src/res/i18n/weaponStats/weaponStats");
            i18n_1.i18n.readProperties(i18n_1.EnumItemType, "./src/res/i18n/itemTypes/itemTypes");
        };
        db.translateStat = function (str) {
            return "";
        };
        db.getImgUrl = function (item) {
            if (item == null)
                return "";
            var name = item.imgUrl;
            var type = i18n_1.EnumItemType.findKeyFrench(item.type);
            return "./src/res/items/" + type + "/" + name;
        };
        db.getStatColor = function (name) {
            switch (name) {
                case "PA": return "color: gold;";
                case "PM": return "color: #03fc3d;";
                case "Vitalité": return "color: #e1c699;";
                case "% Résistance Neutre":
                    return "color: gray;";
                case "% Résistance Terre":
                case "Force":
                    return "color: #965948;";
                case "% Résistance Feu":
                case "Intelligence":
                    return "color: #c42b00;";
                case "% Résistance Eau":
                case "Chance":
                    return "color: #34bdeb;";
                case "% Résistance Air":
                case "Agilité":
                    return "color: #0d9403;";
                case "Puissance":
                    return "color: purple;";
                default: return "";
            }
        };
        db.getStatNames = function () {
            var sections = new Map();
            sections.set("", ["Vie", "Initiative", "PA", "PM", "Portée", "Invocations", "% Critique"]);
            sections.set("Caractéristiques primaires", ["Vitalité", "Sagesse", "Force", "Intelligence", "Chance", "Agilité", "Puissance"]);
            sections.set("Dommages", [
                "Dommages", "Dommages neutre", "Dommages Terre", "Dommages Feu", "Dommages Eau", "Dommages Air",
                "Dommages aux pièges", "Puissance aux pièges",
                "Dommages Critiques", "Dommages de poussée",
                "% Dommages distance", "% Dommages mêlée", "% Dommages aux sorts", "% Dommages d'armes"
            ]);
            sections.set("Caractéristiques secondaires", ["Prospection", "Tacle", "Fuite", "Retrait PA", "Retrait PM", "Esquive PA", "Esquive PM", "Soins"]);
            sections.set("Résistances", [
                "% Résistance Neutre", "% Résistance Terre", "% Résistance Feu", "% Résistance Eau", "% Résistance Air",
                "Résistance Neutre", "Résistance Terre", "Résistance Feu", "Résistance Eau", "Résistance Air",
                "Résistance Critiques", "Résistance Poussée",
                "% Résistance distance", "% Résistance mêlée"
            ]);
            return sections;
        };
        db.getElementsStats = function () {
            return ["Force", "Intelligence", "Chance", "Agilité"];
        };
        db.getElementsNames = function () {
            return ["Neutre", "Terre", "Feu", "Eau", "Air"];
        };
        db.getStatByElement = function (ele) {
            if (ele == "Neutre")
                return "Force";
            return this.getElementsStats()[this.getElementsNames().indexOf(ele) - 1];
        };
        db.getBaseStatNames = function () {
            return ["Vitalité", "Sagesse", "Force", "Intelligence", "Chance", "Agilité"];
        };
        db.getCombatStatsNames = function () {
            return [
                "Tacle", "Esquive PA", "Esquive PM", "Résistance Critiques", "Résistance Poussée",
            ];
        };
        db.getSlotNames = function () {
            return [
                'Amulette', 'Bouclier', 'Anneau1', 'Ceinture', 'Bottes',
                'Chapeau', 'Arme', 'Anneau2', 'Cape', 'Familier',
                'Dofus1', 'Dofus2', 'Dofus3', 'Dofus4', 'Dofus5', 'Dofus6',
            ];
        };
        db.getItemsTypes = function () {
            return ["Amulette", "Anneau", "Chapeau", "Cape", "Sac à dos", "Ceinture", "Bottes", "Bouclier", "Dofus", "Trophée", "Prysmaradite"];
        };
        db.getWeaponsTypes = function () {
            return ["Épée", "Marteau", "Pelle", "Hache", "Bâton", "Dague", "Arc", "Baguette", "Faux", "Pioche", "Arme magique", "Outil"];
        };
        db.getPetTypes = function () {
            return ["Familier", "Montilier", "Montures"];
        };
        db.getWeaponCharacteristics = function () {
            return ["PA", "Portée", "CC"];
        };
        db.getSpellCharacteristics = function () {
            return ["PA", "Portée", "CC", "LoS"];
        };
        db.getIconStyle = function (mod) {
            if (!mod)
                return "";
            if (mod == "")
                return "";
            if (mod == "PA")
                return db.sprite(97, 243);
            if (mod == "PM")
                return db.sprite(97, 52);
            if (mod.toLowerCase().includes("portée"))
                return db.sprite(97, 128);
            if (mod.toLowerCase().includes("initiative"))
                return db.sprite(97, 205);
            if (mod.toLowerCase().includes("invocation"))
                return db.sprite(97, 507);
            if (mod.toLowerCase().includes("% critique"))
                return db.sprite(97, 589);
            if (mod.toLowerCase().includes("prospection"))
                return db.sprite(97, 279);
            if (mod.toLowerCase().includes("vie"))
                return db.sprite(97, 919);
            if (mod.toLowerCase().includes("vitalité"))
                return db.sprite(97, 319);
            if (mod.toLowerCase().includes("sagesse"))
                return db.sprite(97, 358);
            if (mod.toLowerCase().includes("neutre"))
                return db.sprite(95, 15);
            if (mod.toLowerCase().includes("force") || mod.toLowerCase().includes("terre"))
                return db.sprite(97, 432);
            if (mod.toLowerCase().includes("intelligence") || mod.toLowerCase().includes("feu"))
                return db.sprite(97, 394);
            if (mod.toLowerCase().includes("chance") || mod.toLowerCase().includes("eau"))
                return db.sprite(97, 89);
            if (mod.toLowerCase().includes("agilité") || mod.toLowerCase().includes("air"))
                return db.sprite(97, 167);
            if (mod == "Puissance")
                return db.sprite(97, 1108);
            if (mod.toLowerCase().includes("tacle"))
                return db.sprite(97, 545);
            if (mod.toLowerCase().includes("fuite"))
                return db.sprite(97, 469);
            if (mod.toLowerCase().includes("résistance poussée"))
                return db.sprite(97, 832);
            if (mod.toLowerCase().includes("résistance critique"))
                return db.sprite(97, 1200);
            if (mod.toLowerCase().includes("esquive pm"))
                return db.sprite(97, 1016);
            if (mod.toLowerCase().includes("esquive pa"))
                return db.sprite(97, 1064);
            if (mod.toLowerCase().includes("retrait pa"))
                return db.sprite(97, 1340);
            if (mod.toLowerCase().includes("retrait pm"))
                return db.sprite(97, 1340);
            if (mod.toLowerCase().includes("soin"))
                return db.sprite(97, 966);
            if (mod.toLowerCase().includes("pv rendus"))
                return db.sprite(97, 966);
            if (mod == "Dommages")
                return db.sprite(97, 1156);
            if (mod == "Dommages Poussée")
                return db.sprite(97, 872);
            if (mod == "Dommages Critiques")
                return db.sprite(97, 1248);
            if (mod == "Puissance aux pièges")
                return db.sprite(97, 672);
            if (mod == "Dommages aux pièges")
                return db.sprite(97, 712);
            return "";
        };
        db.sprite = function (x, y) {
            return "display: inline-block; width: 22px; height: 22px; background-image: url('./src/res/icons.png'); background-position: -" + x + "px; background-position-y: -" + y + "px; zoom: 1.0; vertical-align: middle;";
        };
        return db;
    }());
    exports.db = db;
});
;
define('environment',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {
        debug: true,
        testing: true
    };
});
;
define('fs',[],function(){});;
define('i18n',["require", "exports", "aurelia-fetch-client", "java-properties"], function (require, exports, aurelia_fetch_client_1, javaprop) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var i18n = (function () {
        function i18n() {
        }
        i18n.readProperties = function (clazz, bundle) {
            var path = bundle + "_fr.properties";
            i18n.client.fetch(path)
                .then(function (response) { return response.text(); })
                .then(function (data) {
                var me = i18n.makePropertiesFile(data);
                clazz["props"] = me;
                var keys = Object.keys(clazz);
                for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                    var key = keys_1[_i];
                    var o = clazz[key];
                    if (!o)
                        continue;
                    o.key = key;
                    o.fr = me.get(key);
                }
                return true;
            });
        };
        i18n.makePropertiesFile = function (data) {
            var me = new javaprop.PropertiesFile();
            var items = data.split(/\r?\n/);
            for (var i = 0; i < items.length; i++) {
                var line = items[i];
                while (line.substring(line.length - 1) === '\\') {
                    line = line.slice(0, -1);
                    var nextLine = items[i + 1];
                    line = line + nextLine.trim();
                    i++;
                }
                me.makeKeys(line);
            }
            return me;
        };
        i18n.client = new aurelia_fetch_client_1.HttpClient();
        return i18n;
    }());
    exports.i18n = i18n;
    var EnumItemSlot = (function () {
        function EnumItemSlot() {
        }
        EnumItemSlot.WEAPON = "Arme";
        EnumItemSlot.HAT = "Chapeau";
        EnumItemSlot.CAPE = "Cape";
        EnumItemSlot.AMULET = "Amulette";
        EnumItemSlot.RING = "Anneau";
        EnumItemSlot.RING1 = "Anneau1";
        EnumItemSlot.RING2 = "Anneau2";
        EnumItemSlot.BELT = "Ceinture";
        EnumItemSlot.BOOTS = "Bottes";
        EnumItemSlot.PET = "Familier";
        EnumItemSlot.DOFUS1 = "Dofus1";
        EnumItemSlot.DOFUS2 = "Dofus2";
        EnumItemSlot.DOFUS3 = "Dofus3";
        EnumItemSlot.DOFUS4 = "Dofus4";
        EnumItemSlot.DOFUS5 = "Dofus5";
        EnumItemSlot.DOFUS6 = "Dofus6";
        return EnumItemSlot;
    }());
    exports.EnumItemSlot = EnumItemSlot;
    var EnumItemType = (function () {
        function EnumItemType() {
            EnumItemType.values.push(this);
        }
        EnumItemType.findKeyFrench = function (french) {
            for (var _i = 0, _a = EnumItemType.values; _i < _a.length; _i++) {
                var i = _a[_i];
                if (!i.fr)
                    continue;
                if (i.fr == french) {
                    return i.key;
                }
            }
            console.log("null key for french: " + french);
            return null;
        };
        EnumItemType.en_to_fr = {};
        EnumItemType.values = [];
        EnumItemType.HAT = new EnumItemType();
        EnumItemType.CAPE = new EnumItemType();
        EnumItemType.BACKPACK = new EnumItemType();
        EnumItemType.AMULET = new EnumItemType();
        EnumItemType.RING = new EnumItemType();
        EnumItemType.BELT = new EnumItemType();
        EnumItemType.BOOTS = new EnumItemType();
        EnumItemType.SHIELD = new EnumItemType();
        EnumItemType.DOFUS = new EnumItemType();
        EnumItemType.TROPHY = new EnumItemType();
        EnumItemType.PRYSMARADITE = new EnumItemType();
        EnumItemType.PET = new EnumItemType();
        EnumItemType.PETSMOUNT = new EnumItemType();
        EnumItemType.MOUNT = new EnumItemType();
        EnumItemType.SEEMYOL = new EnumItemType();
        EnumItemType.DRAGOTURKEY = new EnumItemType();
        EnumItemType.RHINENEETLE = new EnumItemType();
        EnumItemType.SWORD = new EnumItemType();
        EnumItemType.HAMMER = new EnumItemType();
        EnumItemType.SHOVEL = new EnumItemType();
        EnumItemType.AXE = new EnumItemType();
        EnumItemType.STAFF = new EnumItemType();
        EnumItemType.DAGGER = new EnumItemType();
        EnumItemType.BOW = new EnumItemType();
        EnumItemType.WAND = new EnumItemType();
        EnumItemType.SCYTHE = new EnumItemType();
        EnumItemType.PICKAXE = new EnumItemType();
        EnumItemType.MAGIC_WEAPON = new EnumItemType();
        EnumItemType.TOOL = new EnumItemType();
        return EnumItemType;
    }());
    exports.EnumItemType = EnumItemType;
    var EnumWeaponStat = (function () {
        function EnumWeaponStat() {
            EnumWeaponStat.values.push(this);
        }
        EnumWeaponStat.findKeyFrench = function (french) {
            for (var _i = 0, _a = EnumWeaponStat.values; _i < _a.length; _i++) {
                var i = _a[_i];
                if (!i.fr)
                    continue;
                if (i.fr == french) {
                    return i.key;
                }
            }
            console.log("null key for french: " + french);
            return null;
        };
        EnumWeaponStat.en_to_fr = {};
        EnumWeaponStat.values = [];
        EnumWeaponStat.USES_PER_TURN = new EnumWeaponStat();
        EnumWeaponStat.RANGE_MIN = new EnumWeaponStat();
        EnumWeaponStat.RANGE_MAX = new EnumWeaponStat();
        EnumWeaponStat.COST = new EnumWeaponStat();
        EnumWeaponStat.DMG_CRITICAL = new EnumWeaponStat();
        EnumWeaponStat.CRITICAL = new EnumWeaponStat();
        EnumWeaponStat.AP = new EnumWeaponStat();
        EnumWeaponStat.MP = new EnumWeaponStat();
        EnumWeaponStat.DMG_NEUTRAL = new EnumWeaponStat();
        EnumWeaponStat.DMG_FIRE = new EnumWeaponStat();
        EnumWeaponStat.DMG_EARTH = new EnumWeaponStat();
        EnumWeaponStat.DMG_WATER = new EnumWeaponStat();
        EnumWeaponStat.DMG_AIR = new EnumWeaponStat();
        EnumWeaponStat.STEAL_NEUTRAL = new EnumWeaponStat();
        EnumWeaponStat.STEAL_FIRE = new EnumWeaponStat();
        EnumWeaponStat.STEAL_EARTH = new EnumWeaponStat();
        EnumWeaponStat.STEAL_WATER = new EnumWeaponStat();
        EnumWeaponStat.STEAL_AIR = new EnumWeaponStat();
        EnumWeaponStat.HEAL = new EnumWeaponStat();
        return EnumWeaponStat;
    }());
    exports.EnumWeaponStat = EnumWeaponStat;
    var EnumStat = (function () {
        function EnumStat() {
            EnumStat.values.push(this);
        }
        EnumStat.findKeyFrench = function (french) {
            for (var _i = 0, _a = EnumStat.values; _i < _a.length; _i++) {
                var i = _a[_i];
                if (!i.fr)
                    continue;
                if (i.fr == french) {
                    return i.key;
                }
            }
            console.log("null key for french: " + french);
            return null;
        };
        EnumStat.getKeyIdFrench = function (french) {
            var id = 0;
            for (var _i = 0, _a = EnumStat.values; _i < _a.length; _i++) {
                var i = _a[_i];
                if (!i.fr)
                    continue;
                if (i.fr == french) {
                    return id;
                }
                id++;
            }
            console.log("null key for french: " + french);
            return null;
        };
        EnumStat.en_to_fr = {};
        EnumStat.values = [];
        EnumStat.LIFE = new EnumStat();
        EnumStat.AP = new EnumStat();
        EnumStat.MP = new EnumStat();
        EnumStat.RANGE = new EnumStat();
        EnumStat.INITIATIVE = new EnumStat();
        EnumStat.PROSPECTING = new EnumStat();
        EnumStat.CRITICAL = new EnumStat();
        EnumStat.SUMMONS = new EnumStat();
        EnumStat.LOCK = new EnumStat();
        EnumStat.DODGE = new EnumStat();
        EnumStat.AP_PARRY = new EnumStat();
        EnumStat.MP_PARRY = new EnumStat();
        EnumStat.AP_REDUCTION = new EnumStat();
        EnumStat.MP_REDUCTION = new EnumStat();
        EnumStat.HEALS = new EnumStat();
        EnumStat.PODS = new EnumStat();
        EnumStat.REFLECT = new EnumStat();
        EnumStat.VITALITY = new EnumStat();
        EnumStat.WISDOM = new EnumStat();
        EnumStat.INTELLIGENCE = new EnumStat();
        EnumStat.STRENGTH = new EnumStat();
        EnumStat.CHANCE = new EnumStat();
        EnumStat.AGILITY = new EnumStat();
        EnumStat.POWER = new EnumStat();
        EnumStat.DMG_PER_FINAL = new EnumStat();
        EnumStat.DMG_PER_SPELL = new EnumStat();
        EnumStat.DMG_PER_WEAPON = new EnumStat();
        EnumStat.DMG_PER_MELEE = new EnumStat();
        EnumStat.DMG_PER_RANGED = new EnumStat();
        EnumStat.DMG_PER_TRAP = new EnumStat();
        EnumStat.DMG = new EnumStat();
        EnumStat.DMG_NEUTRAL = new EnumStat();
        EnumStat.DMG_FIRE = new EnumStat();
        EnumStat.DMG_EARTH = new EnumStat();
        EnumStat.DMG_WATER = new EnumStat();
        EnumStat.DMG_AIR = new EnumStat();
        EnumStat.DMG_CRITICAL = new EnumStat();
        EnumStat.DMG_PUSHBACK = new EnumStat();
        EnumStat.DMG_TRAP = new EnumStat();
        EnumStat.RES_PER_FINAL = new EnumStat();
        EnumStat.RES_PER_SPELL = new EnumStat();
        EnumStat.RES_PER_WEAPON = new EnumStat();
        EnumStat.RES_PER_MELEE = new EnumStat();
        EnumStat.RES_PER_RANGED = new EnumStat();
        EnumStat.RES_PER_NEUTRAL = new EnumStat();
        EnumStat.RES_PER_FIRE = new EnumStat();
        EnumStat.RES_PER_EARTH = new EnumStat();
        EnumStat.RES_PER_WATER = new EnumStat();
        EnumStat.RES_PER_AIR = new EnumStat();
        EnumStat.RES_NEUTRAL = new EnumStat();
        EnumStat.RES_FIRE = new EnumStat();
        EnumStat.RES_EARTH = new EnumStat();
        EnumStat.RES_WATER = new EnumStat();
        EnumStat.RES_AIR = new EnumStat();
        return EnumStat;
    }());
    exports.EnumStat = EnumStat;
});
;
define('main',["require", "exports", "./environment"], function (require, exports, environment_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function configure(aurelia) {
        console.log("configure main1");
        aurelia.use
            .standardConfiguration()
            .feature('resources');
        aurelia.use.developmentLogging(environment_1.default.debug ? 'debug' : 'warn');
        if (environment_1.default.testing) {
            aurelia.use.plugin('aurelia-testing');
        }
        aurelia.start().then(function () { return aurelia.setRoot(); });
    }
    exports.configure = configure;
});
;
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define('pages/build/build',["require", "exports", "./../../i18n", "aurelia-framework", "../builds/builds", "../../db", "../../api", "aurelia-router", "hashkit"], function (require, exports, i18n_1, aurelia_framework_1, builds_1, db_1, api_1, aurelia_router_1, Hashkit) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var build = (function () {
        function build(getRouter) {
            this.getRouter = getRouter;
            this.sets = [];
            this.api = new api_1.WebAPI();
            build_1.inst = this;
        }
        build_1 = build;
        build.prototype.activate = function (params, routeConfig) {
            var data = params.data;
            this.clear(false);
            if (data != undefined && data != null) {
                this.importsmol(data);
            }
        };
        build.prototype.importsmol = function (data) {
            var _this = this;
            var split = data.split("-");
            var name = split[0];
            var scrolls = split.slice(1, 7).map(function (i) { return build_1.hash.decode(i); });
            var bases = split.slice(7, 13).map(function (i) { return build_1.hash.decode(i); });
            var exoCount = +split[13];
            var exos = split.slice(14, 14 + exoCount).map(function (i) { return build_1.hash.decode(i); });
            var items = split.slice(14 + exoCount).map(function (i) { return i; });
            console.log("parse url items: " + items);
            this.api.getItems([{ $match: {
                        "ankamaID": { "$in": items }
                    } }]).then(function (r) {
                _this.name = name;
                build_1.setName(_this.name);
                console.log("response content: " + r.response);
                r.content.forEach(function (i) {
                    console.log("parse url set item: " + i);
                    build_1.setItem(i, true);
                });
                build_1.setItems(_this.items);
                for (var e = 0; e < scrolls.length; e++) {
                    _this.scrolls.set(db_1.db.getBaseStatNames()[e], scrolls[e]);
                }
                build_1.setScrolls(_this.scrolls);
                for (var e = 0; e < bases.length; e++) {
                    _this.bases.set(db_1.db.getBaseStatNames()[e], bases[e]);
                }
                build_1.setBases(_this.bases);
                console.log("parse exos length: " + exos.length);
                for (var e = 0; e < exos.length; e += 2) {
                    var id = exos[e];
                    var val = exos[e + 1];
                    var key = i18n_1.EnumStat.values[id].fr;
                    console.log("parse exos: e=" + e + ", id=" + id + ", key=" + key + ", val=" + val);
                    _this.exos.set(key, val);
                }
                build_1.setExos(_this.exos);
                build_1.calcSets(_this.items);
            });
        };
        build.prototype.clear = function (force) {
            if (!localStorage.getItem("build.name") || force)
                build_1.setName("unnamed build");
            if (!localStorage.getItem("build.sets") || force)
                build_1.setSets([]);
            if (!localStorage.getItem("build.items") || force)
                build_1.setItems(new Map());
            if (!localStorage.getItem("build.scrolls") || force) {
                var scrolls = new Map();
                scrolls.set("Vitalité", 100);
                scrolls.set("Sagesse", 100);
                scrolls.set("Force", 100);
                scrolls.set("Intelligence", 100);
                scrolls.set("Chance", 100);
                scrolls.set("Agilité", 100);
                build_1.setScrolls(scrolls);
            }
            if (!localStorage.getItem("build.bases") || force) {
                var bases = new Map();
                bases.set("Vitalité", 0);
                bases.set("Sagesse", 0);
                bases.set("Force", 0);
                bases.set("Intelligence", 0);
                bases.set("Chance", 0);
                bases.set("Agilité", 0);
                build_1.setBases(bases);
            }
            if (!localStorage.getItem("build.exos") || force) {
                var exos = new Map();
                exos.set("PA", 1);
                exos.set("PM", 1);
                build_1.setExos(exos);
            }
            build_1.inst.name = build_1.getName();
            build_1.inst.stats = build_1.getStats();
            build_1.inst.sets = build_1.getSets();
            build_1.inst.items = build_1.getItems();
            build_1.inst.scrolls = build_1.getScrolls();
            build_1.inst.bases = build_1.getBases();
            build_1.inst.exos = build_1.getExos();
            this.reloadTotalStats();
        };
        build.prototype.save = function () {
            builds_1.builds.save(this);
        };
        build.prototype.export = function () {
            return JSON.stringify({
                "name": this.name,
                "items": Array.from(this.items.entries()),
                "stats": Array.from(this.stats.entries()),
                "scrolls": Array.from(this.scrolls.entries()),
                "bases": Array.from(this.bases.entries()),
                "exos": Array.from(this.exos.entries()),
                "sets": this.sets
            });
        };
        build.import = function (json) {
            if (json == null) {
                build_1.inst.clear(true);
                return;
            }
            var b = JSON.parse(json);
            var obj = {
                "name": b.name,
                "items": new Map(b.items),
                "stats": new Map(b.stats),
                "scrolls": new Map(b.scrolls),
                "bases": new Map(b.bases),
                "exos": new Map(b.exos),
                "sets": b.sets,
            };
            build_1.setName(obj.name);
            build_1.setSets(obj.sets);
            build_1.setItems(obj.items);
            build_1.setStats(obj.stats);
            build_1.setScrolls(obj.scrolls);
            build_1.setBases(obj.bases);
            build_1.setExos(obj.exos);
        };
        build.prototype.reloadTotalStats = function () {
            var _this = this;
            this.stats.clear();
            build_1.setStats(this.stats);
            build_1.addTotalStat("Vie", 1050);
            build_1.addTotalStat("PA", 6 + 1);
            build_1.addTotalStat("PM", 3);
            build_1.addTotalStat("Prospection", 100);
            this.items.forEach(function (v, k) {
                build_1.addItemStats(v);
            });
            this.scrolls.forEach(function (v, k) {
                build_1.addTotalStat(k, v);
            });
            this.bases.forEach(function (v, k) {
                build_1.addTotalStat(k, v);
            });
            this.exos.forEach(function (v, k) {
                build_1.addTotalStat(k, v);
            });
            this.sets.forEach(function (v, k) {
                build_1.addSet(v);
            });
            db_1.db.getElementsStats().forEach(function (s) {
                if (_this.stats.has(s)) {
                    build_1.addTotalStat("Initiative", _this.stats.get(s));
                }
            });
            if (this.stats.has("Vitalité")) {
                build_1.addTotalStat("Vie", this.stats.get("Vitalité"));
            }
            if (this.stats.has("Sagesse")) {
                var sa = this.stats.get("Sagesse");
                build_1.addTotalStat("Retrait PA", Math.floor(sa / 10));
                build_1.addTotalStat("Retrait PM", Math.floor(sa / 10));
                build_1.addTotalStat("Esquive PA", Math.floor(sa / 10));
                build_1.addTotalStat("Esquive PM", Math.floor(sa / 10));
            }
            if (this.stats.has("Agilité")) {
                var agi = this.stats.get("Agilité");
                build_1.addTotalStat("Fuite", Math.floor(agi / 10));
                build_1.addTotalStat("Tacle", Math.floor(agi / 10));
            }
            if (this.stats.has("Chance")) {
                var cha = this.stats.get("Chance");
                build_1.addTotalStat("Prospection", Math.floor(cha / 10));
            }
        };
        build.addSet = function (set) {
            if (set.bonus && set.bonus.stats) {
                set.bonus.stats.forEach(function (stat) {
                    if (stat.max) {
                        build_1.addTotalStat(stat.name, Number.parseInt(stat.max));
                    }
                    else {
                        build_1.addTotalStat(stat.name, Number.parseInt(stat.min));
                    }
                });
            }
        };
        build.addItemStats = function (item) {
            if (item.statistics) {
                item.statistics.forEach(function (stat) {
                    if (stat.max) {
                        build_1.addTotalStat(stat.name, stat.max);
                    }
                    else {
                        build_1.addTotalStat(stat.name, stat.min);
                    }
                });
            }
        };
        build.calcSets = function (items) {
            build_1.inst.sets = [];
            build_1.setSets(build_1.inst.sets);
            var setCounts = {};
            items.forEach(function (v, k) {
                if (v.setId > 0) {
                    if (!setCounts[v.setId])
                        setCounts[v.setId] = 1;
                    else
                        setCounts[v.setId] += 1;
                }
            });
            var setkeys = Object.keys(setCounts);
            setkeys.forEach(function (id) {
                if (setCounts[id] > 1) {
                    build_1.inst.api.getSet(id).then(function (response) {
                        var set = response.content;
                        build_1.inst.sets.push(set);
                        build_1.addSet(set);
                        build_1.setSets(build_1.inst.sets);
                        build_1.inst.reloadTotalStats();
                    });
                }
            });
        };
        build.setItem = function (item, reset) {
            var items = build_1.getItems();
            var slot = item.type;
            if (item.type == "Anneau") {
                slot = "Anneau" + build_1.nextRing;
                if (build_1.nextRing < 2) {
                    build_1.nextRing++;
                }
                else if (build_1.nextRing == 2) {
                    build_1.nextRing = 1;
                }
            }
            if (item.type == "Dofus" || item.type == "Trophée" || item.type == "Prysmaradite") {
                slot = "Dofus" + build_1.nextDofus;
                if (build_1.nextDofus < 6) {
                    build_1.nextDofus++;
                }
                else if (build_1.nextRing >= 6) {
                    build_1.nextDofus = 1;
                }
            }
            if (item.type == "Sac à dos") {
                slot = "Cape";
            }
            if (db_1.db.getWeaponsTypes().indexOf(item.type) != -1) {
                slot = "Arme";
            }
            if (db_1.db.getPetTypes().indexOf(item.type) != -1) {
                slot = "Familier";
            }
            console.log("build.setItem slot : " + slot + " (" + item.type + ")");
            if (db_1.db.getSlotNames().indexOf(slot) == -1) {
                console.log("build.setItem bad slot : " + slot);
                return;
            }
            if (!reset)
                build_1.removeItem(slot);
            if (item.statistics) {
                item.statistics.forEach(function (stat) {
                    if (stat.max) {
                        build_1.addTotalStat(stat.name, stat.max);
                    }
                    else {
                        build_1.addTotalStat(stat.name, stat.min);
                    }
                });
            }
            items.set(slot, item);
            build_1.setItems(items);
            if (!reset) {
                this.calcSets(items);
            }
            build_1.inst.save();
        };
        build.removeItem = function (slot) {
            var items = build_1.getItems();
            var item = items.get(slot);
            if (item == null)
                return;
            if (item.statistics) {
                item.statistics.forEach(function (stat) {
                    if (stat.max) {
                        build_1.addTotalStat(stat.name, -stat.max);
                    }
                    else {
                        build_1.addTotalStat(stat.name, -stat.min);
                    }
                });
            }
            items.delete(slot);
            build_1.setItems(items);
        };
        build.setBaseStat = function (name, value) {
            var bases = build_1.getBases();
            build_1.addTotalStat(name, value - (bases.get(name) || 0));
            bases.set(name, value);
            build_1.setBases(bases);
        };
        build.setScrollStat = function (name, value) {
            var scrolls = build_1.getScrolls();
            build_1.addTotalStat(name, value - (scrolls.get(name) || 0));
            scrolls.set(name, value);
            build_1.setScrolls(scrolls);
        };
        build.setExo = function (name, value) {
            var exos = build_1.getExos();
            build_1.addTotalStat(name, value - (exos.get(name) || 0));
            if (value == 0)
                exos.delete(name);
            else
                exos.set(name, value);
            build_1.setExos(exos);
        };
        build.addTotalStat = function (name, value) {
            var stats = build_1.getStats();
            var existing = 0;
            if (stats.has(name)) {
                existing = stats.get(name);
            }
            stats.set(name, existing + value);
            build_1.setStats(stats);
        };
        build.getItems = function () {
            return new Map(JSON.parse(localStorage.getItem("build.items")));
        };
        build.setItems = function (items) {
            if (build_1.inst)
                build_1.inst.items = items;
            localStorage.setItem("build.items", JSON.stringify(Array.from(items.entries())));
        };
        build.getStats = function () {
            return new Map(JSON.parse(localStorage.getItem("build.stats")));
        };
        build.setStats = function (stats) {
            if (build_1.inst)
                build_1.inst.stats = stats;
            localStorage.setItem("build.stats", JSON.stringify(Array.from(stats.entries())));
        };
        build.getBases = function () {
            return new Map(JSON.parse(localStorage.getItem("build.bases")));
        };
        build.setBases = function (bases) {
            if (build_1.inst)
                build_1.inst.bases = bases;
            localStorage.setItem("build.bases", JSON.stringify(Array.from(bases.entries())));
        };
        build.getScrolls = function () {
            return new Map(JSON.parse(localStorage.getItem("build.scrolls")));
        };
        build.setScrolls = function (scrolls) {
            if (build_1.inst)
                build_1.inst.scrolls = scrolls;
            localStorage.setItem("build.scrolls", JSON.stringify(Array.from(scrolls.entries())));
        };
        build.getExos = function () {
            return new Map(JSON.parse(localStorage.getItem("build.exos")));
        };
        build.setExos = function (exos) {
            if (build_1.inst)
                build_1.inst.exos = exos;
            localStorage.setItem("build.exos", JSON.stringify(Array.from(exos.entries())));
        };
        build.getName = function () {
            return localStorage.getItem("build.name");
        };
        build.setName = function (name) {
            if (build_1.inst)
                build_1.inst.name = name;
            localStorage.setItem("build.name", name);
        };
        build.getSets = function () {
            var sets = localStorage.getItem("build.sets");
            if (sets == "null" || sets == "undefined")
                return [];
            return JSON.parse(sets);
        };
        build.setSets = function (sets) {
            if (build_1.inst)
                build_1.inst.sets = sets;
            localStorage.setItem("build.sets", JSON.stringify(sets));
        };
        var build_1;
        build.nextRing = 1;
        build.nextDofus = 1;
        build.hash = new Hashkit();
        build = build_1 = __decorate([
            aurelia_framework_1.inject(aurelia_router_1.Router),
            __param(0, aurelia_framework_1.lazy(aurelia_router_1.Router)),
            __metadata("design:paramtypes", [Function])
        ], build);
        return build;
    }());
    exports.build = build;
});
;
define('text!pages/build/build.html',[],function(){return "<template>\n\n  <require from=\"./components/items\"></require>\n  <require from=\"./components/spells\"></require>\n  <require from=\"./components/sets\"></require>\n  <require from=\"./components/options\"></require>\n  <require from=\"./components/weapon\"></require>\n  <!-- <require from=\"./components/itemSlot\"></require> -->\n  <require from=\"./components/stats/totalstats\"></require>\n  <require from=\"./components/stats/combatstats\"></require>\n  <require from=\"./components/stats/basestats\"></require>\n  <require from=\"./components/stats/addedstats\"></require>\n\n  <div class=\"container\">\n    <div class=\"row\">\n\n      <!-- total stats -->\n      <totalstats class=\"col-3\" stats.bind=\"stats\"></totalstats>\n\n      <!-- center -->\n      <div class=\"col-6\">\n        <div class=\"container\">\n          <!-- items -->\n          <items class=\"row\" items.bind=\"items\"></items>\n          <!-- stats visibles en combat-->\n          <combatstats class=\"row\" stats.bind=\"stats\" style=\"margin-top: 20px; margin-left: 5px;\"></combatstats>\n          <!-- sets -->\n          <sets class=\"row\" sets.bind=\"sets\" style=\"margin-left: 5px;\"></sets>\n          <!-- weapon -->\n          <weapon class=\"row\" data.bind=\"$this\" style=\"margin-left: 5px;\"></weapon>\n          <!-- spells -->\n          <spells class=\"row\" style=\"margin-left: 5px;\"></spells>\n        </div>\n      </div>\n\n      <!-- right -->\n      <div class=\"col\">\n        <div class=\"\">\n          <!-- options -->\n          <div class=\"\">\n            <options build.bind=$this></options>\n          </div>\n          <!-- base stats & scrolls -->\n          <div class=\"\" style=\"margin-top: 20px;\">\n            <basestats class=\"\" stats.bind=\"bases\" scrolls.bind=\"scrolls\"></basestats>\n          </div>\n          <!-- exos -->\n          <div class=\"\" style=\"margin-top: 20px;\">\n            <addedstats class=\"\" stats.bind=\"exos\"></addedstats>\n          </div>\n        </div>\n      </div>\n\n    </div>\n  </div>\n\n</template>\n";});;
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('pages/build/components/itemSlot',["require", "exports", "aurelia-router", "aurelia-framework", "../../../db"], function (require, exports, aurelia_router_1, aurelia_framework_1, db_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ItemSlot = (function () {
        function ItemSlot(router) {
            this.router = router;
        }
        ItemSlot.prototype.onclick = function () {
            this.router.navigate("/items");
        };
        ItemSlot.prototype.attached = function () {
            var itemname = this.item ? this.item.name : "undefined";
        };
        Object.defineProperty(ItemSlot.prototype, "imgUrl", {
            get: function () {
                return db_1.db.getImgUrl(this.item);
            },
            enumerable: true,
            configurable: true
        });
        ItemSlot.prototype.test = function () {
            return "hi";
            ;
        };
        __decorate([
            aurelia_framework_1.bindable,
            __metadata("design:type", Object)
        ], ItemSlot.prototype, "item", void 0);
        __decorate([
            aurelia_framework_1.bindable,
            __metadata("design:type", Object)
        ], ItemSlot.prototype, "slotname", void 0);
        __decorate([
            aurelia_framework_1.computedFrom('item'),
            __metadata("design:type", String),
            __metadata("design:paramtypes", [])
        ], ItemSlot.prototype, "imgUrl", null);
        ItemSlot = __decorate([
            aurelia_framework_1.inject(aurelia_router_1.Router),
            __metadata("design:paramtypes", [aurelia_router_1.Router])
        ], ItemSlot);
        return ItemSlot;
    }());
    exports.ItemSlot = ItemSlot;
});
;
define('text!pages/build/components/itemSlot.css',[],function(){return ".itemSlot {\n  height: 80px;\n  width: 80px;\n  /* color: var(--front1); */\n  /* background-color: #555555; */\n  /* background-color: var(--accent1); */\n  border: 1px solid var(--accent1);\n  z-index: 0;\n}\n.itemSlot img {\n  height: 80px;\n  width: 80px;\n  z-index: 0;\n}\n.itemSlot:hover {\n  border: 1px solid var(--accent0);\n}\n.itemSlot itemsheet {\n  position: relative;\n  /* float: */\n  display: inline-block;\n  visibility: collapse;\n  width: 260px;\n  background-color: var(--bg0);\n  z-index: 94561239 !important;\n  pointer-events: none;\n  cursor: default;\n}\n.itemSlot:hover itemsheet {\n  /* display: flex; */\n  visibility: visible;\n  opacity: 95%;\n}\n";});;
define('text!pages/build/components/itemSlot.html',[],function(){return "<template>\n  <require from=\"./itemSlot.css\"></require>\n  <require from=\"../../items/itemsheet\"></require>\n\n\n  <div class=\"itemSlot\" style=\"margin: 0 auto;\" onclick.call=\"onclick()\">\n\n    <img if.bind=\"item\" src.bind=\"imgUrl\" alt=\"${slotname}\">\n    <div if.bind=\"item == null\" innerHTML.bind=\"slotname\"></div>\n\n    <!-- need a hover as well -->\n    <itemsheet if.bind=\"item\" data.bind=\"item\"></itemsheet>\n\n    <!-- need a click to search items -->\n\n  </div>\n</template>\n";});;
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('pages/build/components/items',["require", "exports", "aurelia-framework", "../../../db"], function (require, exports, aurelia_framework_1, db_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Items = (function () {
        function Items() {
            this.data = db_1.db.getSlotNames();
        }
        Items.prototype.attached = function () {
        };
        __decorate([
            aurelia_framework_1.bindable,
            __metadata("design:type", Map)
        ], Items.prototype, "items", void 0);
        return Items;
    }());
    exports.Items = Items;
});
;
define('text!pages/build/components/items.html',[],function(){return "<template>\n  <require from=\"./itemSlot\"></require>\n\n  <div class=\"col-sm\">\n    <!-- itemsSlots[0,6,5,1,9] -->\n    <item-slot repeat.for=\"i of 5\" style=\"margin-bottom: 2px;\" id=\"${data[i]}\" item.bind=\"items.get(data[i])\" slotname.bind=\"data[i]\"></item-slot>\n  </div>\n\n  <div class=\"col-sm\">\n    <!-- itemsSlots[4,7,5,2,3] -->\n    <item-slot repeat.for=\"i of 5\" style=\"margin-bottom: 2px;\" id=\"${data[i+5]}\" item.bind=\"items.get(data[i+5])\" slotname.bind=\"data[i+5]\"></item-slot>\n  </div>\n\n  <div class=\"col-sm\">\n    <!-- dofus[1,2,3,4,5,6] -->\n    <item-slot repeat.for=\"i of 6\" style=\"margin-bottom: 2px;\" id=\"${data[i+10]}\" item.bind=\"items.get(data[i+10])\" slotname.bind=\"data[i+10]\"></item-slot>\n  </div>\n\n</template>";});;
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('pages/build/components/options',["require", "exports", "./../../../i18n", "aurelia-framework", "../build", "../../../db"], function (require, exports, i18n_1, aurelia_framework_1, build_1, db_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var options = (function () {
        function options() {
        }
        options.prototype.bind = function () {
        };
        options.prototype.reset = function () {
            build_1.build.inst.clear(true);
        };
        options.prototype.save = function () {
            build_1.build.inst.save();
        };
        Object.defineProperty(options.prototype, "copyUrl", {
            get: function () {
                var _this = this;
                var data = { name: this.build.name, items: [], scrolls: [], bases: [], exos: [] };
                this.build.items.forEach(function (item, slot) {
                    data.items.push(item.ankamaID);
                });
                db_1.db.getBaseStatNames().forEach(function (e) {
                    data.bases.push(build_1.build.hash.encode(_this.build.bases.get(e) || 0));
                });
                db_1.db.getBaseStatNames().forEach(function (e) {
                    data.scrolls.push(build_1.build.hash.encode(_this.build.scrolls.get(e) || 0));
                });
                this.build.exos.forEach(function (val, key, map) {
                    var id = i18n_1.EnumStat.getKeyIdFrench(key);
                    data.exos.push(build_1.build.hash.encode(id));
                    data.exos.push(build_1.build.hash.encode(val));
                });
                var output = data.name + "-";
                output += data.scrolls.join("-") + "-";
                output += data.bases.join("-") + "-";
                output += data.exos.length + "-" + data.exos.join("-") + "-";
                output += data.items.join("-");
                output = "http://" + location.host + "/build?data=" + output;
                return output;
            },
            enumerable: true,
            configurable: true
        });
        options.prototype.export = function () {
            this.exportlink.value = this.copyUrl;
        };
        options.prototype.import = function () {
            var _this = this;
            var input = "decrypt(string)";
            navigator.clipboard.readText()
                .then(function (text) {
                console.log('Pasted content: ', text);
                _this.build.importsmol(text);
            })
                .catch(function (err) {
                console.error('Failed to read clipboard contents: ', err);
            });
        };
        __decorate([
            aurelia_framework_1.bindable,
            __metadata("design:type", build_1.build)
        ], options.prototype, "build", void 0);
        __decorate([
            aurelia_framework_1.computedFrom('build.name', 'build.items', 'build.scrolls', 'build.bases', 'build.exos'),
            __metadata("design:type", String),
            __metadata("design:paramtypes", [])
        ], options.prototype, "copyUrl", null);
        return options;
    }());
    exports.options = options;
});
;
define('text!pages/build/components/options.css',[],function(){return "options button {\n  width: 50%;\n  height: 30px;\n}\n";});;
define('text!pages/build/components/options.html',[],function(){return "<template>\n  <require from=\"./options.css\"></require>\n  <div>\n\n    <div class=\"d-flex\">\n      <!-- <button class=\" btn0\" onclick.call=\"import()\">Import</button> -->\n      <button class=\"btn0 mr-auto\" onclick.call=\"save()\">Save</button>\n      <button class=\"btn0\" onclick.call=\"reset()\">Reset</button>\n    </div>\n\n    <div class=\"d-flex\" style=\"flex-wrap: nowrap;\">\n      <!-- <button class=\"btn0\" onclick.call=\"export()\">Export</button> -->\n      <input class=\"mr-1\" type=\"text\" value.bind=\"copyUrl\" style=\"width: 100%; padding-left: 5px; height: 40px;\" ref=\"exportlink\">\n    </div>\n\n    <div class=\"d-flex\" style=\"flex-wrap: nowrap;\">\n      <input class=\"mr-1\" type=\"text\" value.bind=\"build.name\" style=\"width: 100%; padding-left: 5px; height: 40px;\">\n    </div>\n\n\n  </div>\n</template>\n";});;
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('pages/build/components/sets',["require", "exports", "aurelia-framework"], function (require, exports, aurelia_framework_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var sets = (function () {
        function sets() {
        }
        sets.prototype.attached = function () {
        };
        __decorate([
            aurelia_framework_1.bindable,
            __metadata("design:type", Array)
        ], sets.prototype, "sets", void 0);
        return sets;
    }());
    exports.sets = sets;
});
;
define('text!pages/build/components/sets.html',[],function(){return "<template>\n  <div>\n\n    <!-- <h2>Sets</h2> -->\n\n    <div repeat.for=\"set of sets\">\n      <h5>${set.name}</h5>\n      <div repeat.for=\"stat of set.bonus.stats\">\n        ${stat.min} ${stat.name}\n      </div>\n    </div>\n\n  </div>\n</template>";});;
define('pages/build/components/spells',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var spells = (function () {
        function spells() {
        }
        return spells;
    }());
    exports.spells = spells;
});
;
define('text!pages/build/components/spells.html',[],function(){return "<template>\n\n  <!-- <h2>Spells</h2> -->\n\n</template>";});;
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('pages/build/components/stats/addedstats',["require", "exports", "aurelia-framework", "../../../../db", "../../build"], function (require, exports, aurelia_framework_1, db_1, build_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var addedstats = (function () {
        function addedstats() {
            this.modsSections = db_1.db.getStatNames();
        }
        addedstats.prototype.onChangeExo = function (name) {
            console.log("onChangeExo stat : " + name + "=" + doc.valueAsNumber);
            var doc = document.getElementById("exostat-" + name);
            build_1.build.setExo(name, doc.valueAsNumber);
            build_1.build.inst.save();
        };
        addedstats.prototype.onModInputFocus = function (that, event, blockid, modid) {
            console.log("onFocusModInput [" + blockid + "," + modid + "] : " + that);
            $(event.target).closest(".searchable").find("dl").show();
            $(event.target).closest(".searchable").find("dl section dd").show();
        };
        addedstats.prototype.onModInputBlur = function (that, event, blockid, modid) {
            console.log("onModInputBlur [" + blockid + "," + modid + "] : " + that);
            setTimeout(function () {
                $(event.target).closest(".searchable").find("dl").hide();
            }, 300);
        };
        addedstats.prototype.oninput = function (that, event) {
            console.log("oninput : " + that + " - " + event.target);
            console.log("blocks : " + JSON.stringify(Array.from(this.stats.entries())));
        };
        addedstats.prototype.onDDHover = function (that, event, blockid, modid, modname) {
            console.log("onDDHover : " + JSON.stringify(Array.from(this.stats.entries())));
            $(event.target).closest(".searchable").find("dl section dd.selected").removeClass("selected");
            $(event.target).addClass("selected");
        };
        addedstats.prototype.onDDClick = function (that, event, oldname, modname) {
            console.log("onDDClick : " + event);
            var ele = event.target;
            if (oldname == "new") {
                this.stats.set(modname, 0);
            }
            else {
                var oldval = this.stats.get(oldname);
                this.stats.delete(oldname);
                this.stats.set(modname, oldval);
            }
            var input = $(ele).closest(".searchable").find("input");
            input.blur();
            console.log("blocks : " + JSON.stringify(Array.from(this.stats.entries())));
        };
        __decorate([
            aurelia_framework_1.bindable,
            __metadata("design:type", Map)
        ], addedstats.prototype, "stats", void 0);
        return addedstats;
    }());
    exports.addedstats = addedstats;
});
;
define('text!pages/build/components/stats/addedstats.html',[],function(){return "<template>\n  <!-- <require from=\"/src/pages/items/filter.less\"></require> -->\n  <require from=\"../../../items/filter.less\"></require>\n\n  <!-- <h6>Caractéristiques exotiques</h6> -->\n  <!-- <th>Caractéristiques exotiques</th> -->\n  <div style=\"font-weight: bold;\">Caractéristiques exotiques</div>\n\n  <ul style=\"list-style-type: none; padding-left: 0px;\">\n\n    <li class=\"d-flex\" repeat.for=\"[name, val] of stats\" style=\"flex-wrap: nowrap;\">\n      <!-- <input type=\"text\" value.bind=\"name\" disabled class=\"mr-2\" /> -->\n      <button class=\"btnDelete\" style=\"width: 30px;\" onclick.call=\"deleteExo(name)\">✕</button>\n\n      <div class=\"mr-auto mt-auto mb-auto\">${name}</div>\n      <!-- <input type=\"number\" value.bind=\"val\" /> -->\n\n      <!-- <input id=\"exostat-${name}\" type=\"number\" model.bind=\"stats.get(name)\" value=\"${stats.get(name)}\" onchange.call=\"onchange(name)\" /> -->\n      <input id=\"exostat-${name}\" type=\"number\" model.bind=\"val\" value=\"${val}\" onchange.call=\"onChangeExo(name)\" />\n    </li>\n\n\n\n    <!-- <li class=\"row\" repeat.for=\"[name, val] of stats\">\n      <div name=\"modsearch\" class=\"searchable\">\n        <input name=\"modsearchinput\" type=\"text\" autocomplete=\"off\" placeholder=\"+Add Stat Mod\" value.bind=\"name\" onkeyup.call=\"filterFunction2($this, $event)\" onchange.call=\"oninput($this, $event)\" onfocus.call=\"onModInputFocus($this, $event)\"\n          onblur.call=\"onModInputBlur($this, $event)\">\n        <dl name=\"modsearchlist\" class=\"modlist\">\n          <section repeat.for=\"[section, mods] of modsSections\">\n            <dt>${section}</dt>\n            <dd repeat.for=\"modname of mods\" onmouseover.call=\"onDDHover($this, $event, modname)\" onclick.call=\"onDDClick($this, $event, name, modname)\">${modname}</dd>\n          </section>\n        </dl>\n      </div>\n\n      <input id=\"exostat-${name}\" type=\"number\" value.bind=\"val\" />\n\n      <button class=\"btnDelete\" onclick.call=\"deleteExo(name)\">x</button>\n    </li> -->\n\n    <div name=\"modsearch\" class=\"searchable\">\n      <input name=\"modsearchinput\" type=\"text\" autocomplete=\"off\" placeholder=\"+Add Stat Mod\" onkeyup.call=\"filterFunction2($this, $event)\" onchange.call=\"oninput($this, $event)\" onfocus.call=\"onModInputFocus($this, $event)\"\n        onblur.call=\"onModInputBlur($this, $event)\">\n      <dl name=\"modsearchlist\" class=\"modlist\">\n        <section repeat.for=\"[section, mods] of modsSections\">\n          <dt>${section}</dt>\n          <dd repeat.for=\"modname of mods\" onmouseover.call=\"onDDHover($this, $event, modname)\" onclick.call=\"onDDClick($this, $event, 'new', modname)\">${modname}</dd>\n        </section>\n      </dl>\n    </div>\n    \n\n  </ul>\n\n  <!-- <button class=\"btnAdd\">Add Stat</button> -->\n\n</template>\n";});;
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('pages/build/components/stats/basestats',["require", "exports", "aurelia-framework", "../../build", "../../../../db"], function (require, exports, aurelia_framework_1, build_1, db_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var basestats = (function () {
        function basestats() {
            this.statnames = db_1.db.getBaseStatNames();
        }
        basestats.prototype.onChangeBase = function (name) {
            var doc = document.getElementById("basestat-" + name);
            build_1.build.setBaseStat(name, doc.valueAsNumber);
            build_1.build.inst.save();
        };
        basestats.prototype.onChangeScroll = function (name) {
            var doc = document.getElementById("scrollstat-" + name);
            build_1.build.setScrollStat(name, doc.valueAsNumber);
            build_1.build.inst.save();
        };
        __decorate([
            aurelia_framework_1.bindable,
            __metadata("design:type", Map)
        ], basestats.prototype, "stats", void 0);
        __decorate([
            aurelia_framework_1.bindable,
            __metadata("design:type", Map)
        ], basestats.prototype, "scrolls", void 0);
        return basestats;
    }());
    exports.basestats = basestats;
});
;
define('text!pages/build/components/stats/basestats.html',[],function(){return "<template>\n  <!-- <h2>Base Stats</h2> -->\n\n  <div style=\"font-weight: bold;\">Caractéristiques de base</div>\n\n  <ul style=\"list-style-type: none; padding-left: 0px;\">\n    <li class=\"d-flex\" repeat.for=\"name of statnames\">\n      <div class=\"mr-auto\" >${name}</div>\n      <!-- style=\"margin-left: 30px;\" -->\n\n      <input id=\"scrollstat-${name}\" type=\"number\" model.bind=\"scrolls.get(name)\" value=\"${scrolls.get(name)}\" onchange.call=\"onChangeScroll(name)\" />\n      <input id=\"basestat-${name}\" type=\"number\" model.bind=\"stats.get(name)\" value=\"${stats.get(name)}\" onchange.call=\"onChangeBase(name)\" />\n    </li>\n  </ul>\n\n</template>\n";});;
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('pages/build/components/stats/combatstats',["require", "exports", "aurelia-framework", "../../../../db"], function (require, exports, aurelia_framework_1, db_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var combatstats = (function () {
        function combatstats() {
        }
        Object.defineProperty(combatstats.prototype, "elements", {
            get: function () {
                return db_1.db.getElementsNames();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(combatstats.prototype, "combatkeys", {
            get: function () {
                return db_1.db.getCombatStatsNames();
            },
            enumerable: true,
            configurable: true
        });
        combatstats.prototype.getIcon = function (mod) {
            return db_1.db.getIconStyle(mod);
        };
        __decorate([
            aurelia_framework_1.bindable,
            __metadata("design:type", Map)
        ], combatstats.prototype, "stats", void 0);
        return combatstats;
    }());
    exports.combatstats = combatstats;
});
;
define('text!pages/build/components/stats/combatstats.css',[],function(){return "combatstats td {\n  /* text-align: right; */\n  /* padding-left: 15px !important; */\n  /* padding: 3px; */\n}\n";});;
define('text!pages/build/components/stats/combatstats.html',[],function(){return "<template>\n  <require from=\"./combatstats.css\"></require>\n\n  <div style=\"width: 100%;\">\n    <!-- <h2>Combat Stats</h2> -->\n\n    <table class=\"table table-sm table-borderless\" style=\"color: var(--front0);\">\n      <colgroup>\n        <col style=\"width: 16.6666%;\">\n        <col style=\"width: 16.6666%;\">\n        <col style=\"width: 16.6666%;\">\n        <col style=\"width: 16.6666%;\">\n        <col style=\"width: 16.6666%;\">\n        <col style=\"width: 16.6666%;\">\n      </colgroup>\n      <tbody>\n        <tr>\n          <td>\n            <span style.bind=\"getIcon('Vie')\"></span>\n            ${stats.get('Vie') || 0}\n          </td>\n          <td repeat.for=\"key of combatkeys\">\n            <span style.bind=\"getIcon(key)\"></span>\n            ${stats.get(key) || 0}\n          </td>\n        </tr>\n        <tr>\n          <td>\n            <span style.bind=\"getIcon('PA')\"></span>\n            ${stats.get('PA') || 0}\n          </td>\n          <td repeat.for=\"key of elements\">\n            <span style.bind=\"getIcon(key)\" style=\"margin-top: 7px;\"></span>\n            <span>${stats.get(\"Résistance \" + key) || 0}</span>\n          </td>\n        </tr>\n        <tr>\n          <td>\n            <span style.bind=\"getIcon('PM')\"></span>\n            ${stats.get('PM') || 0}\n          </td>\n          <td repeat.for=\"key of elements\">\n            <span style.bind=\"getIcon(key)\"></span>\n            ${stats.get(\"% Résistance \" + key) || 0}%\n          </td>\n        </tr>\n      </tbody>\n    </table>\n\n  </div>\n</template>\n";});;
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('pages/build/components/stats/totalstats',["require", "exports", "aurelia-framework", "../../../../db"], function (require, exports, aurelia_framework_1, db_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var totalstats = (function () {
        function totalstats() {
            this.sections = db_1.db.getStatNames();
        }
        totalstats.prototype.get = function (name) {
            if (this.stats.has(name))
                return this.stats.get(name);
            else
                return 0;
        };
        totalstats.prototype.getIcon = function (mod) {
            return db_1.db.getIconStyle(mod);
        };
        __decorate([
            aurelia_framework_1.bindable,
            __metadata("design:type", Map)
        ], totalstats.prototype, "stats", void 0);
        return totalstats;
    }());
    exports.totalstats = totalstats;
});
;
define('text!pages/build/components/stats/totalstats.css',[],function(){return "totalstats table {\n  background-color: var(--bg0) !important;\n}\n.table-dark.table-striped tbody tr:nth-of-type(odd) {\n  color: var(--accent1);\n  /* opacity: 0.05; */\n  /* background-color: rgba(1,255,255,.05) !important; */\n}\n";});;
define('text!pages/build/components/stats/totalstats.html',[],function(){return "<template>\n  <require from=\"./totalstats.css\"></require>\n\n  <!-- <h2>Total Stats</h2> -->\n\n  <table class=\"table table-sm table-striped table-borderless table-dark\" repeat.for=\"[section, mods] of sections\">\n    <thead>\n      <th>${section}</th>\n      <th></th>\n    </thead>\n    <tbody>\n      <tr repeat.for=\"name of mods\">\n        <td>\n          <span style.bind=\"getIcon(name)\"></span>\n          ${name}\n        </td>\n        <td style=\"text-align: right;\" innerHtml.bind=\"stats.get(name) || 0\"></td>\n        <!-- <td if.bind=\"stats\" style=\"text-align: right;\" innerHtml.bind=\"stats.get(name) || 0\"></td> -->\n        <!-- <td if.bind=\"stats == null\" style=\"text-align: right;\" innerHtml.bind=\"stats.get(name) || 0\"></td> -->\n      </tr>\n    </tbody>\n  </table>\n\n</template>\n";});;
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('pages/build/components/weapon',["require", "exports", "aurelia-framework", "../build", "../../../db"], function (require, exports, aurelia_framework_1, build_1, db_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var damage = (function () {
        function damage() {
            this.name = "";
            this.min = 0;
            this.max = 0;
            this.minCrit = 0;
            this.maxCrit = 0;
        }
        return damage;
    }());
    exports.damage = damage;
    var weapon = (function () {
        function weapon() {
        }
        weapon.prototype.attached = function () {
            this.item = this.data.items.get("Arme");
            if (this.hasWeapon)
                this.calculate();
        };
        Object.defineProperty(weapon.prototype, "hasWeapon", {
            get: function () {
                return this.data.items.has("Arme");
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(weapon.prototype, "characteristics", {
            get: function () {
                return db_1.db.getWeaponCharacteristics();
            },
            enumerable: true,
            configurable: true
        });
        weapon.prototype.getImgUrl = function () {
            return db_1.db.getImgUrl(this.item);
        };
        weapon.prototype.calculate = function () {
            var _this = this;
            this.damages = [];
            var stats = this.item.statistics;
            var mods = stats.filter(function (obj) {
                return obj.name.startsWith("(dommages ") || obj.name.startsWith("(vol ");
            });
            var dmgCrit = 0;
            var crit = 0;
            var cc = this.item.characteristics[2]["CC"] || "";
            if (cc) {
                var dmgcrit0 = cc.split("+")[1];
                dmgCrit = parseInt(dmgcrit0.substring(0, dmgcrit0.length - 1));
            }
            mods.forEach(function (mod) {
                var name = mod.name;
                var val = 0;
                var ele = "";
                var d = "";
                if (mod.name.includes("dommages Neutre")) {
                    ele = "Force";
                    d = "Neutre";
                }
                else if (mod.name.includes("dommages") || mod.name.includes("vol")) {
                    ele = name.split(" ")[1];
                    ele = ele.substr(0, ele.length - 1);
                    d = "Dommages " + ele;
                    ele = db_1.db.getStatByElement(ele);
                }
                else if (mod.name.includes("soin")) {
                }
                var dmg = new damage();
                dmg.min = _this.formula(mod.min, ele, d);
                dmg.max = _this.formula(mod.max, ele, d);
                dmg.name = mod.name;
                dmg.minCrit = _this.formula(mod.min + dmgCrit, ele, d);
                dmg.maxCrit = _this.formula(mod.max + dmgCrit, ele, d);
                _this.damages.push(dmg);
            });
            this.total = new damage();
            this.damages.forEach(function (d) {
                _this.total.min += d.min;
                _this.total.max += d.max;
                _this.total.minCrit += d.minCrit;
                _this.total.maxCrit += d.maxCrit;
            });
        };
        weapon.prototype.formula = function (base, ele, d) {
            var stat = this.data.stats.get(ele) || 0;
            var pui = this.data.stats.get("Puissance") || 0;
            var dom = this.data.stats.get(d) || 0;
            var dom2 = this.data.stats.get("Dommages") || 0;
            var weapondmg = this.data.stats.get("% Dommages d'armes") || 0;
            var dmg = base
                * ((100 + stat + pui) / 100)
                + (dom + dom2);
            dmg = dmg * ((100 + weapondmg) / 100);
            return Math.floor(dmg);
        };
        __decorate([
            aurelia_framework_1.bindable,
            __metadata("design:type", build_1.build)
        ], weapon.prototype, "data", void 0);
        return weapon;
    }());
    exports.weapon = weapon;
});
;
define('text!pages/build/components/weapon.html',[],function(){return "<template>\n  <div style=\"margin-top: 10px;\">\n    <!-- <h6></h6> -->\n    <div if.bind=\"hasWeapon\">\n      <!-- weapon info -->\n      <div class=\"title d-flex flex-nowrap\">\n        <!-- Name and level -->\n        <div class=\"title d-flex flex-nowrap mr-3\">\n          <img src=\"${getImgUrl()}\" width=\"60px\" height=\"60px\">\n          <!-- <div>\n            <span>${item.name}</span><br>\n            <span>${item.level}</span>\n          </div> -->\n        </div>\n        <!-- characteristics -->\n        <!-- <div>\n          <div>\n            <span>PA :</span>\n            <span>${item.characteristics[0][\"PA\"]}</span>\n          </div>\n          <div>\n            <span>Portée :</span>\n            <span>${item.characteristics[1][\"Portée\"]}</span>\n          </div>\n          <div>\n            <span>CC :</span>\n            <span>${item.characteristics[2][\"CC\"]}</span>\n          </div>\n        </div> -->\n      </div>\n\n      <!-- dmg -->\n      <div>\n        <div>Total : ${total.min} à ${total.max} (${total.minCrit} à ${total.maxCrit})</div>\n        <div repeat.for=\"dmg of damages\">${dmg.name} : ${dmg.min} à ${dmg.max} (${dmg.minCrit} à ${dmg.maxCrit})</div>\n      </div>\n    </div>\n\n\n  </div>\n</template>\n";});;
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('pages/builds/builds',["require", "exports", "aurelia-framework", "aurelia-router", "../build/build"], function (require, exports, aurelia_framework_1, aurelia_router_1, build_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var builds = (function () {
        function builds(router) {
            this.names = [];
            this.router = router;
            builds_1.inst = this;
            if (!localStorage.getItem("builds")) {
                localStorage.setItem("builds", JSON.stringify(this.names));
            }
            this.names = JSON.parse(localStorage.getItem("builds"));
        }
        builds_1 = builds;
        builds.prototype.newbuild = function () {
            if (!build_1.build.inst) {
                window.setTimeout(function () { return build_1.build.import(null); }, 300);
            }
            else {
                build_1.build.import(null);
            }
            this.router.navigate("/build");
        };
        builds.prototype.delete = function (name) {
            var names = this.names;
            var index = this.names.indexOf(name);
            if (index != -1) {
                names.splice(index, 1);
                localStorage.setItem("builds", JSON.stringify(names));
                localStorage.removeItem(name);
            }
        };
        builds.prototype.load = function (name) {
            if (this.names.indexOf(name) != -1) {
                var json = localStorage.getItem(name);
                build_1.build.import(json);
                this.router.navigate("/build");
            }
        };
        builds.save = function (build) {
            var names = [];
            if (builds_1.inst == null)
                names = JSON.parse(localStorage.getItem("builds"));
            names = JSON.parse(localStorage.getItem("builds"));
            if (names.indexOf(build.name) == -1) {
                names.push(build.name);
            }
            localStorage.setItem("builds", JSON.stringify(names));
            localStorage.setItem(build.name, build.export());
        };
        var builds_1;
        builds = builds_1 = __decorate([
            aurelia_framework_1.inject(aurelia_router_1.Router),
            __metadata("design:paramtypes", [aurelia_router_1.Router])
        ], builds);
        return builds;
    }());
    exports.builds = builds;
});
;
define('text!pages/builds/builds.css',[],function(){return "#buildscontainer {\n  width: 72%;\n  margin-left: 15%;\n}\n#buildsearch {\n  /* margin: 0 auto; */\n  /* margin-left: 15%; */\n  /* width: 70%; */\n  width: 100%;\n  margin-left: 1%;\n  margin-bottom: 1%;\n  height: 40px;\n}\n.builds {\n  --buildaccent: var(--accent1);\n  --buildaccenthover: var(--accent0);\n  width: 102%;\n  /* margin: 0 auto; */\n  /* margin-left: 14.5%; */\n  /* width: 71%; */\n  flex-wrap: wrap;\n}\n.builds .build {\n  /* width: 200px; */\n  width: 18%;\n  height: 100px;\n  margin: 1%;\n  /* margin: 5px; */\n  padding: 5px;\n  /* border: 1px solid transparent; */\n  border: 1px solid var(--buildaccent);\n  /* background: var(--accent1); */\n}\n.builds .build:hover {\n  border: 1px solid var(--accent0);\n}\n.builds .build:hover h3 {\n  color: var(--buildaccenthover);\n}\n.builds .build h3 {\n  cursor: pointer;\n  width: 100%;\n  color: var(--buildaccent);\n}\n.builds .build button {\n  width: 38px;\n  height: 30px;\n  background: var(--bg0);\n  border: 1px solid transparent;\n  color: var(--buildaccent);\n}\n.builds .build button:hover {\n  background: var(--buildaccent);\n  color: var(--bg0);\n}\n";});;
define('text!pages/builds/builds.html',[],function(){return "<template>\n  <require from=\"./builds.css\"></require>\n  <!-- view container -->\n  <div id=\"buildscontainer\">\n    <!-- search -->\n    <input id=\"buildsearch\" type=\"text\" value=\"\" placeholder=\"search...\" autofocus>\n    <!-- builds grid -->\n    <div class=\"builds d-flex\">\n      <!-- new build -->\n      <div class=\"build d-flex\">\n        <h3 class=\"\" onclick.call=\"newbuild()\">New Build</h3>\n      </div>\n      <!-- saved builds -->\n      <div class=\"build d-flex\" repeat.for=\"name of names\">\n        <h3 class=\"\" onclick.call=\"load(name)\">${name}</h3>\n        <button onclick.call=\"delete(name)\">X</button>\n      </div>\n    </div>\n  </div>\n\n</template>\n";});;
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('pages/items/filter',["require", "exports", "aurelia-framework", "./itemsearch", "../../db", "jquery"], function (require, exports, aurelia_framework_1, itemsearch_1, db_1, $) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var filter = (function () {
        function filter() {
            var _this = this;
            this.filterText = "";
            this.levelMin = 0;
            this.levelMax = 200;
            this.filterLevel = true;
            this.filterType = false;
            this.filterWeapon = false;
            this.handleKeyInput = function (event) {
                if (event.key == "Enter")
                    _this.search();
            };
            filter.inst = this;
            this.modsSections = new Map();
            this.modsSections.set("Pseudo", [
                "(Pseudo) # res",
                "(Pseudo) # res élémentaires",
                "(Pseudo) Total #% res",
                "(Pseudo) Total #% res élémentaires",
            ]);
            db_1.db.getStatNames().forEach(function (v, k) {
                _this.modsSections.set(k, v);
            });
            this.types = new Map();
            this.armes = new Map();
            db_1.db.getItemsTypes().concat(db_1.db.getPetTypes()).forEach(function (s) {
                _this.types.set(s, false);
            });
            db_1.db.getWeaponsTypes().forEach(function (s) {
                _this.armes.set(s, false);
            });
            this.styleChecked = {
                color: "var(--front1)",
                background: "var(--accent1)",
            };
            this.styleUnchecked = {
                color: "var(--front0)",
                background: "transparent",
            };
            this.blocks = [];
            this.addBlock();
            this.loadFilter();
            this.search();
        }
        filter.prototype.created = function (owningView, myView) {
        };
        filter.prototype.bind = function (bindingContext, overrideContext) {
        };
        filter.prototype.attached = function () {
            window.addEventListener('keypress', this.handleKeyInput, false);
        };
        filter.prototype.detached = function () {
            window.removeEventListener('keypress', this.handleKeyInput);
        };
        filter.prototype.unbind = function () {
        };
        filter.prototype.search = function () {
            itemsearch_1.itemsearch.inst.search(this);
            this.saveFilter();
        };
        filter.prototype.loadFilter = function () {
            var json = localStorage.getItem("filter");
            if (json) {
                var data = JSON.parse(json);
                this.filterLevel = data.filterLevel;
                this.filterText = data.filterText;
                this.levelMin = data.levelMin;
                this.levelMax = data.levelMax;
                this.types = new Map(data.types);
                this.armes = new Map(data.armes);
                this.filterLevel = data.filterLevel;
                this.filterType = data.filterType;
                this.filterWeapon = data.filterWeapon;
                this.blocks = data.blocks;
            }
        };
        filter.prototype.saveFilter = function () {
            var obj = {
                filterText: this.filterText,
                levelMin: this.levelMin,
                levelMax: this.levelMax,
                types: Array.from(this.types.entries()),
                armes: Array.from(this.armes.entries()),
                filterLevel: this.filterLevel,
                filterType: this.filterType,
                filterWeapon: this.filterWeapon,
                blocks: this.blocks
            };
            localStorage.setItem("filter", JSON.stringify(obj));
        };
        filter.prototype.setBlock = function (blockIndex, type, args) {
            this.blocks[blockIndex].type = type;
            this.blocks[blockIndex].min = args[0];
            this.blocks[blockIndex].max = args[1];
            this.blocks[blockIndex].activate = true;
            this.blocks[blockIndex].mods = [];
        };
        filter.prototype.deleteBlock = function (blockIndex) {
            this.blocks.splice(blockIndex, 1);
        };
        filter.prototype.setMod = function (blockIndex, mod, args) {
            var m = this.blocks[blockIndex].mods.find(function (e) { return e.name == mod; });
            if (!m) {
                m = new ModFilter();
                this.blocks[blockIndex].mods.push(m);
            }
            m.name = mod;
            if (args.length > 0)
                m.min = args[0];
            if (args.length > 1)
                m.max = args[1];
            m.activate = true;
        };
        filter.prototype.deleteMod = function (blockIndex, mod) {
            var m = this.blocks[blockIndex].mods.find(function (e) { return e.name == mod; });
            if (m) {
                var i = this.blocks[blockIndex].mods.indexOf(m);
                this.blocks[blockIndex].mods.splice(i, 1);
            }
        };
        filter.prototype.filterTypeClicked = function () {
            var _this = this;
            var activated = this.filterType;
            this.types.forEach(function (value, key) { return _this.types.set(key, !activated); });
        };
        filter.prototype.checkType = function (type) {
            var activated = this.types.get(type);
            this.types.set(type, !activated);
            this.filterType = this.hasValue(this.types, true);
        };
        filter.prototype.filterWeaponClicked = function () {
            var _this = this;
            var activated = this.filterWeapon;
            this.armes.forEach(function (value, key) { return _this.armes.set(key, !activated); });
        };
        filter.prototype.checkWeapon = function (arme) {
            this.armes.set(arme, !this.armes.get(arme));
            this.filterWeapon = this.hasValue(this.armes, true);
        };
        filter.prototype.hasValue = function (map, value) {
            for (var _i = 0, _a = Array.from(map.entries()); _i < _a.length; _i++) {
                var _b = _a[_i], key = _b[0], val = _b[1];
                if (val == value)
                    return true;
            }
            return false;
        };
        filter.prototype.myFunction = function () {
            document.getElementById("myDropdown").classList.toggle("show");
        };
        filter.prototype.filterFunction = function () {
            var input, filter, ul, li, a, i;
            input = document.getElementById("myInput");
            filter = input.value.toUpperCase();
            var div = document.getElementById("myDropdown");
            a = div.getElementsByTagName("a");
            for (i = 0; i < a.length; i++) {
                var txtValue = a[i].textContent || a[i].innerText;
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    a[i].style.display = "";
                }
                else {
                    a[i].style.display = "none";
                }
            }
        };
        filter.prototype.filterFunction2 = function (that, event) {
            var container, input, filter, li, input_val;
            container = $(event.target).closest("searchable");
            input = container.find("input");
            input_val = input.val() + "";
            if (input_val == "undefined")
                input_val = "";
            input_val = input_val.toUpperCase();
            if (["ArrowDown", "ArrowUp", "Enter"].indexOf(event.key) != -1) {
                this.keyControl(event, container);
            }
            else {
                li = container.find("dl dd");
                li.each(function (i, obj) {
                    if ($(this).text().toUpperCase().indexOf(input_val) > -1) {
                        $(this).show();
                    }
                    else {
                        $(this).hide();
                    }
                });
                container.find("dl dd").removeClass("selected");
                setTimeout(function () {
                    container.find("dl dd:visible").first().addClass("selected");
                }, 100);
            }
        };
        filter.prototype.keyControl = function (e, container) {
            if (e.key == "ArrowDown") {
                if (container.find("dl dd").hasClass("selected")) {
                    if (container.find("dl dd:visible").index(container.find("dl dd.selected")) + 1 < container.find("dl dd:visible").length) {
                        container.find("dl dd.selected").removeClass("selected").nextAll().not('[style*="display: none"]').first().addClass("selected");
                    }
                }
                else {
                    var dd = container.find("dl dd:first-child");
                    container.find("dl dd:first-child").addClass("selected");
                }
            }
            else if (e.key == "ArrowUp") {
                if (container.find("dl dd:visible").index(container.find("dl dd.selected")) > 0) {
                    container.find("dl dd.selected").removeClass("selected").prevAll().not('[style*="display: none"]').first().addClass("selected");
                }
            }
            else if (e.key == "Enter") {
                container.find("input").val(container.find("dl dd.selected").text()).blur();
                this.onSelect(container.find("dl dd.selected").text());
            }
            var selectedDD = container.find("dl dd.selected")[0];
            if (selectedDD) {
            }
        };
        filter.prototype.onSelect = function (val) {
        };
        filter.prototype.addBlock = function () {
            this.blocks.push({
                type: "$and",
                min: 0,
                max: 0,
                mods: [new ModFilter()],
                activate: true,
            });
        };
        filter.prototype.addStatMod = function (that, event, blockid) {
            this.blocks[blockid].mods.push(new ModFilter());
            var ele = event.target;
            $(ele.parentElement.children.item(1)).show();
        };
        filter.prototype.onModInputFocus = function (that, event, blockid, modid) {
            $(event.target).closest(".searchable").find("dl").show();
            $(event.target).closest(".searchable").find("dl section dd").show();
        };
        filter.prototype.onModInputBlur = function (that, event, blockid, modid) {
            setTimeout(function () {
                $(event.target).closest(".searchable").find("dl").hide();
            }, 300);
        };
        filter.prototype.oninput = function (that, event) {
        };
        filter.prototype.onDDHover = function (that, event, blockid, modid, modname) {
            $(event.target).closest(".searchable").find("dl section dd.selected").removeClass("selected");
            $(event.target).addClass("selected");
        };
        filter.prototype.onDDClick = function (that, event, blockid, modid, modname) {
            var ele = event.target;
            this.blocks[blockid].mods[modid].name = modname;
            var input = $(ele).closest(".searchable").find("input");
            input.blur();
        };
        __decorate([
            aurelia_framework_1.observable({ changeHandler: 'filterTypeChanged' }),
            __metadata("design:type", Boolean)
        ], filter.prototype, "filterType", void 0);
        __decorate([
            aurelia_framework_1.observable({ changeHandler: 'filterWeaponChanged' }),
            __metadata("design:type", Boolean)
        ], filter.prototype, "filterWeapon", void 0);
        return filter;
    }());
    exports.filter = filter;
    var BlockFilter = (function () {
        function BlockFilter() {
            this.type = "And";
            this.activate = true;
            this.mods = [];
        }
        return BlockFilter;
    }());
    exports.BlockFilter = BlockFilter;
    var ModFilter = (function () {
        function ModFilter() {
            this.activate = true;
        }
        return ModFilter;
    }());
    exports.ModFilter = ModFilter;
});
;
define('text!pages/items/filter.css',[],function(){return ".searchable {\n  width: 100%;\n  float: left;\n}\n.searchable input {\n  width: 100%;\n  -webkit-box-sizing: border-box;\n  /* Safari/Chrome, other WebKit */\n  -moz-box-sizing: border-box;\n  /* Firefox, other Gecko */\n  box-sizing: border-box;\n  /* Opera/IE 8+ */\n  display: block;\n  background-clip: padding-box;\n  border: 1px solid var(--accent1);\n  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;\n}\n.searchable dl {\n  width: 100%;\n  position: absolute;\n  display: none;\n  list-style-type: none;\n  border: 1px solid var(--accent1);\n  border-top: none;\n  max-height: 380px;\n  margin: 0;\n  overflow-y: scroll;\n  overflow-x: hidden;\n  padding: 0;\n  background-color: var(--bg0);\n  z-index: 3;\n}\n.searchable dl dt {\n  height: 25px;\n  color: var(--front0);\n  background-color: var(--bg1);\n  z-index: 4;\n}\n.searchable dl dd {\n  height: 25px;\n  cursor: pointer;\n  color: var(--front0);\n  background-color: var(--bg0);\n  z-index: 4;\n  margin: 0px;\n}\n.searchable dl dd.selected {\n  background-color: #e8e8e8;\n  color: #333;\n}\nfilter > div {\n  /* width: 1200px; */\n  /* height: 300px; */\n  /* background: white; */\n  /* border: 1px solid var(--accent1); */\n  max-width: 85% !important;\n}\n/* Search bar */\nfilter .search {\n  width: 100%;\n  height: 40px;\n  padding-left: 5px;\n}\n/* Toggle button */\nfilter .toggle {\n  border: 1px solid var(--accent1);\n  background: transparent;\n  margin-bottom: 4px;\n  margin-right: 4px;\n  padding: 2px;\n  cursor: pointer;\n  text-align: center;\n  min-width: 50px;\n  height: 35px;\n}\nfilter .toggle label {\n  cursor: pointer;\n  margin: 0px;\n}\n/* Checkbox input */\nfilter input[type=\"checkbox\"] {\n  appearance: none;\n  -webkit-appearance: none;\n  -moz-appearance: none;\n}\nfilter .checkbox {\n  width: 15px;\n  height: 15px;\n  background: var(--bg0);\n  border: 1px solid var(--accent1);\n  padding: 2px;\n}\nfilter .checkbox:checked {\n  background: var(--accent1);\n}\n/* title labels */\nfilter .title {\n  font-size: 25px;\n  font-weight: bold;\n  /* margin-left: 5px; */\n}\n/* block list */\nfilter .blocklist .block {\n  margin-bottom: 10px;\n}\nfilter .blocklist .block .blocktitle {\n  font-size: 20px;\n  color: var(--front0);\n  background: var(--bg0);\n  border-color: var(--bg0);\n  width: 100%;\n  /* margin-left: 5px; */\n  /* font-weight: bold; */\n}\nfilter .blocklist .block .blocktitle:focus {\n  border-color: var(--bg0) !important;\n}\nfilter .blocklist .block .mod {\n  margin-bottom: 10px;\n}\nfilter .blocklist .block .mod label {\n  background: var(--bg1);\n  width: 65%;\n  /* margin-left: 5px;\n  margin-right: 5px; */\n  margin-bottom: 0px /* background: var(--bg1); */ /* font-size: 20px; */ /* font-weight: bold; */;\n}\nfilter .btnAdd {\n  width: 100%;\n}\n/* left side */\n.leftside {\n  padding-left: 1px;\n}\n/* right side */\n.rightside {\n  padding-right: 1px;\n}\n";});;
define('text!pages/items/filter.html',[],function(){return "<template>\n  <require from=\"./filter.less\"></require>\n\n  <!-- <link href=\"https://cdn.jsdelivr.net/npm/select2@4.0.13/dist/css/select2.min.css\" rel=\"stylesheet\" />\n  <script src=\"https://cdn.jsdelivr.net/npm/select2@4.0.13/dist/js/select2.min.js\"></script> -->\n\n  <div class=\"container\">\n\n    <!-- Search -->\n    <div class=\"row\">\n      <input class=\"search\" type=\"text\" value.bind=\"filterText\" placeholder=\"search...\" focus=\"true\" />\n    </div>\n\n    <!-- tagify search box ? = search sur item names, panoplies, effets, types d'items (capecoiffe..).... -->\n    <!-- exemple tu clic sur [() Agilité ] et ça remplace le text par 2 box min/max à côté de l'icône d'agi -->\n\n    <div class=\"row\">\n      <!--Generic filters left side -->\n      <div class=\"leftside col\">\n\n        <!-- Level -->\n        <div class=\"d-flex align-items-center\">\n          <input class=\"checkbox mr-1\" type=\"checkbox\" id=\"level\" checked.bind=\"filterLevel\" />\n          <label class=\"title mr-auto\" for=\"level\">Level</label>\n          <input class=\"mr-2\" type=\"number\" value.bind=\"levelMin\" placeholder=\"min\" />\n          <input class=\"\" type=\"number\" value.bind=\"levelMax\" placeholder=\"max\" />\n        </div>\n\n        <!-- Types base -->\n        <input class=\"checkbox\" type=\"checkbox\" id=\"type\" checked.bind=\"filterType\" onclick.call=\"filterTypeClicked()\" />\n        <label class=\"title\" for=\"type\">Type</label>\n        <div class=\"d-flex flex-wrap\">\n          <div class=\"toggle\" repeat.for=\"[type, value] of types\" onclick.call=\"checkType(type)\" style.bind=\"value ? styleChecked : styleUnchecked\">\n            <!-- <input type=\"checkbox\" id=\"${type}\" value=\"type\" checked /> -->\n            <label for=\"${type}\" innerHTML.bind=\"type\"></label>\n          </div>\n        </div>\n\n        <!-- Types weapons -->\n        <input class=\"checkbox\" type=\"checkbox\" id=\"armes\" checked.bind=\"filterWeapon\" onclick.call=\"filterWeaponClicked()\" />\n        <label class=\"title\" for=\"armes\">Armes</label>\n        <div class=\"d-flex flex-wrap\">\n          <div class=\"toggle\" repeat.for=\"[arme, value] of armes\" onclick.call=\"checkWeapon(arme)\" style.bind=\"value ? styleChecked : styleUnchecked\">\n            <!-- <input type=\"checkbox\" id=\"${arme}\" value=\"arme\" checked /> -->\n            <label for=\"${arme}\" innerHTML.bind=\"arme\"></label>\n          </div>\n        </div>\n      </div>\n\n      <!-- Mods -->\n      <div class=\"rightside col\">\n        <!-- Mods -->\n        <input class=\"checkbox\" type=\"checkbox\" id=\"mods\" checked />\n        <label class=\"title\" for=\"mods\">Mods</label>\n        <div class=\"blocklist\" ref=\"blocklist\">\n          <!-- block list  -->\n          <div class=\"block\" repeat.for=\"i of blocks.length\" id.bind=\"i\">\n            <!-- block properties -->\n            <div class=\"d-flex align-items-center\">\n              <input class=\"checkbox mr-1\" type=\"checkbox\" id=\"${i}\" checked.bind=\"blocks[i].activate\" />\n              <select class=\"mr-auto blocktitle\" name=\"type\" value.bind=\"blocks[i].type\">\n                <option value=\"$and\">And</option>\n                <option value=\"$or\">Or</option>\n                <option value=\"$nor\">Not</option>\n                <option value=\"$sum\">Sum</option>\n              </select>\n              <!-- <label class=\"mr-auto blocktitle\" for=\"${i}\">${blocks[i].type}</label> -->\n              <button class=\"btnDelete\" onclick.call=\"deleteBlock(i)\">x</button>\n            </div>\n            <!-- mod list -->\n            <div class=\"mod d-flex align-items-center\" repeat.for=\"j of blocks[i].mods.length\" id.bind=\"j\">\n\n              <!-- checkbox -->\n              <input class=\"checkbox mr-1\" type=\"checkbox\" checked.bind=\"blocks[i].mods[j].activate\" />\n              <!-- mod select -->\n              <div name=\"modsearch\" class=\"searchable\">\n                <input name=\"modsearchinput\" type=\"text\" autocomplete=\"off\" placeholder=\"+Add Stat Mod\" onkeyup.call=\"filterFunction2($this,$event)\" value.bind=\"blocks[i].mods[j].name\" onchange.call=\"oninput($this, $event)\"\n                  onfocus.call=\"onModInputFocus($this, $event, i, j)\" onblur.call=\"onModInputBlur($this, $event, i, j)\">\n                <dl name=\"modsearchlist\" class=\"modlist\">\n                  <!-- automatically filled with mods -->\n                  <!-- <dt></dt> -->\n                  <!-- <dd></dd> -->\n                  <!-- <modlist title.bind=\"section\" mods.bind=\"modsSections.\"></modlist> -->\n                  <section repeat.for=\"[section, mods] of modsSections\">\n                    <dt>${section}</dt>\n                    <dd repeat.for=\"modname of mods\" onmouseover.call=\"onDDHover($this, $event, i, j, modname)\" onclick.call=\"onDDClick($this, $event, i, j, modname)\">${modname}</dd>\n                  </section>\n                </dl>\n              </div>\n              <!-- mod min/max -->\n              <input class=\"ml-2 mr-2\" type=\"number\" value.bind=\"blocks[i].mods[j].min\" placeholder=\"min\" />\n              <input class=\"mr-2\" type=\"number\" value.bind=\"blocks[i].mods[j].max\" placeholder=\"max\" />\n              <!-- mod delete -->\n              <button class=\"btnDelete\" onclick.call=\"deleteMod(i, blocks[i].mods[j].name)\">x</button>\n\n            </div>\n            <!-- create mod -->\n            <div>\n              <button class=\"btnAdd\" click.delegate=\"addStatMod($this, $event, i)\">+Add Stat Mod</button>\n              <div name=\"modsearch\" class=\"searchable\">\n                <dl name=\"modsearchlist\" class=\"modlist\">\n                  <section repeat.for=\"[section, mods] of modsSections\">\n                    <dt>${section}</dt>\n                    <dd repeat.for=\"modname of mods\" onmouseover.call=\"onDDHover($this, $event, i, j, modname)\" onclick.call=\"onDDClick($this, $event, i, j, modname)\">${modname}</dd>\n                  </section>\n                </dl>\n              </div>\n            </div> <!-- end of create mod -->\n          </div> <!-- end of block list -->\n\n          <!-- create block -->\n          <div class=\"block\">\n            <button class=\"btnAdd\" onclick.call=\"addBlock()\">+Add Stat Block</button>\n          </div>\n        </div>\n\n        <!--\n        <div>\n          <ul ref=\"modsearchlist\">\n            <li>Algeria</li>\n            <li>Bulgaria</li>\n            <li>Canada</li>\n            <li>Egypt</li>\n            <li>Fiji</li>\n            <li>India</li>\n            <li>Japan</li>\n            <li>Iran (Islamic Republic of)</li>\n            <li>Lao People's Democratic Republic</li>\n            <li>Micronesia (Federated States of)</li>\n            <li>Nicaragua</li>\n            <li>Senegal</li>\n            <li>Tajikistan</li>\n            <li>Yemen</li>\n          </ul>\n          <div>\n            <input list=\"brow\">\n            <datalist id=\"brow\">\n              <option value=\"Internet Explorer\">\n              <option value=\"Firefox\">\n              <option value=\"Chrome\">\n              <option value=\"Opera\">\n              <option value=\"Safari\">\n            </datalist>\n          </div>\n          <select class=\"js-example-basic-single\" name=\"state\">\n            <option value=\"AL\">Alabama</option>\n            <option value=\"WY\">Wyoming</option>\n          </select>\n        </div> -->\n\n      </div>\n    </div>\n\n    <!-- Search button -->\n    <div class=\"row\">\n      <button class=\"btnSearch\" onclick.call=\"search()\">Search</button>\n    </div>\n\n  </div>\n\n</template>\n";});;
define('text!pages/items/filter.less',[],function(){return ".searchable {\n  width: 100%;\n  // width: 300px;\n  float: left;\n  // margin: 0 15px;\n}\n\n.searchable input {\n    width: 100%;\n    // height: 40px;\n    // font-size: 18px;\n    // padding: 10px;\n    -webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */\n    -moz-box-sizing: border-box; /* Firefox, other Gecko */\n    box-sizing: border-box; /* Opera/IE 8+ */\n    display: block;\n    // font-weight: 400;\n    // line-height: 1.6;\n    // color: #495057;\n    // background-color: #fff;\n    background-clip: padding-box;\n    border: 1px solid  var(--accent1);\n    // border-radius: .25rem;\n    transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out;\n    // background: url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 5'%3E%3Cpath fill='%23343a40' d='M2 0L0 2h4zm0 5L0 3h4z'/%3E%3C/svg%3E\") no-repeat right .75rem center/8px 10px;\n}\n\n.searchable dl {\n  width: 100%;\n  // float:left;\n  position:absolute;\n  display: none;\n  list-style-type: none;\n  // background-color: #fff;\n  // border-radius: 0 0 5px 5px;\n  border: 1px solid var(--accent1);\n  border-top: none;\n  max-height: 380px;\n  margin: 0;\n  overflow-y: scroll;\n  overflow-x: hidden;\n  padding: 0;\n  background-color: var(--bg0);\n  z-index: 3;\n}\n\n.searchable dl dt {\n  // color: var(--accent1);\n  height: 25px;\n  // border-bottom: 1px solid #e1e1e1;\n  color: var(--front0);\n  background-color: var(--bg1);\n  z-index: 4;\n}\n.searchable dl dd {\n  height: 25px;\n  // padding: 7px 9px;\n  // border-bottom: 1px solid #e1e1e1;\n  cursor: pointer;\n  // color: #6e6e6e;\n  color: var(--front0);\n  background-color: var(--bg0);\n  z-index: 4;\n  margin: 0px;\n}\n\n.searchable dl dd.selected {\n    background-color: #e8e8e8;\n    color: #333;\n}\n\n\nfilter {\n\n}\n\nfilter>div {\n  /* width: 1200px; */\n  /* height: 300px; */\n  /* background: white; */\n  /* border: 1px solid var(--accent1); */\n  max-width: 85% !important;\n}\n\n/* Search bar */\nfilter .search {\n  width: 100%;\n  height: 40px;\n  padding-left: 5px;\n}\n\n\n/* Toggle button */\nfilter .toggle {\n  border: 1px solid var(--accent1);\n  background: transparent;\n  margin-bottom: 4px;\n  margin-right: 4px;\n  padding: 2px;\n  cursor: pointer;\n  text-align: center;\n  min-width: 50px;\n  height: 35px;\n}\nfilter .toggle label {\n  cursor: pointer;\n  margin: 0px;\n}\n\n/* Checkbox input */\nfilter input[type=\"checkbox\"] {\n  appearance: none;\n  -webkit-appearance: none;\n  -moz-appearance: none;\n}\nfilter .checkbox {\n  width: 15px;\n  height: 15px;\n  background: var(--bg0);\n  border: 1px solid var(--accent1);\n  padding: 2px;\n}\nfilter .checkbox:checked {\n  background: var(--accent1);\n}\n\n\n/* title labels */\nfilter .title {\n  font-size: 25px;\n  font-weight: bold;\n  /* margin-left: 5px; */\n}\n\n/* block list */\nfilter .blocklist {\n\n}\nfilter .blocklist .block {\n  margin-bottom: 10px;\n}\nfilter .blocklist .block .blocktitle {\n  font-size: 20px;\n  color: var(--front0);\n  background: var(--bg0);\n  border-color: var(--bg0);\n  width: 100%;\n  /* margin-left: 5px; */\n  /* font-weight: bold; */\n}\nfilter .blocklist .block .blocktitle:focus {\n  border-color: var(--bg0) !important;\n}\nfilter .blocklist .block .mod {\n  margin-bottom: 10px;\n}\nfilter .blocklist .block .mod label {\n  background: var(--bg1);\n  width: 65%;\n  /* margin-left: 5px;\n  margin-right: 5px; */\n  margin-bottom: 0px\n  /* background: var(--bg1); */\n  /* font-size: 20px; */\n  /* font-weight: bold; */\n}\n\nfilter .btnAdd {\n  width: 100%;\n}\n\n/* left side */\n.leftside {\n  padding-left: 1px;\n}\n/* right side */\n.rightside {\n  padding-right: 1px;\n}\n";});;
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('pages/items/itemsearch',["require", "exports", "aurelia-framework", "../../api", "../../util"], function (require, exports, aurelia_framework_1, api_1, util_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var itemsearch = (function () {
        function itemsearch(api) {
            var _this = this;
            this.api = api;
            this.loadedCount = 0;
            this.onLoadedSheet = null;
            this.attachedb = false;
            this.queriedb = false;
            itemsearch_1.inst = this;
            this.mason = new util_1.Mason();
            this.mason.obj = this;
            this.onLoadedSheet = util_1.util.debounce(function () {
                _this.mason.reloadMsnry();
            }, 100, false);
        }
        itemsearch_1 = itemsearch;
        itemsearch.prototype.search = function (filter) {
            var _this = this;
            var adds = { $addFields: {} };
            var mongofilter = { $and: [] };
            var types = { $or: [] };
            if (filter.filterLevel) {
                mongofilter.$and.push({ "level": { "$gte": parseInt(filter.levelMin + "") } });
                mongofilter.$and.push({ "level": { "$lte": parseInt(filter.levelMax + "") } });
            }
            if (filter.filterType) {
                filter.types.forEach(function (v, k) {
                    if (v)
                        types.$or.push({ "type": k });
                });
            }
            if (filter.filterWeapon) {
                filter.armes.forEach(function (v, k) {
                    if (v)
                        types.$or.push({ "type": k });
                });
            }
            if (filter.filterText && filter.filterText != "") {
                mongofilter.$and.push({
                    "$or": [
                        { "name.fr": { "$regex": util_1.util.caseAndAccentInsensitive(filter.filterText), "$options": "i" } },
                    ]
                });
            }
            if (filter.filterType || filter.filterWeapon) {
                mongofilter.$and.push(types);
            }
            var bi = 0;
            filter.blocks.forEach(function (block) {
                var _a;
                if (block.activate) {
                    if (block.type == "$sum") {
                        _this.filterSum(mongofilter, adds, bi, block);
                    }
                    else {
                        var arr = block.mods.filter(function (m) { return m.activate && m.name != undefined; }).map(function (m) {
                            if (m.name.includes("Pseudo"))
                                return _this.filterStatPseudo(m);
                            else
                                return _this.filterStat(m);
                        });
                        if (arr.length > 0) {
                            mongofilter.$and.push((_a = {},
                                _a[block.type] = arr,
                                _a));
                        }
                    }
                }
            });
            var pipeline = [];
            {
                pipeline.push({ $sort: { "level": -1, "ankamaID": -1 } });
                if (Object.keys(adds.$addFields).length > 0)
                    pipeline.push(adds);
                pipeline.push({ $match: mongofilter });
                pipeline.push({ $limit: 100 });
                pipeline.push({ $skip: 0 });
            }
            this.query(pipeline);
        };
        itemsearch.prototype.filterSum = function (mongofilter, adds, bi, block) {
            var _a;
            var blockid = block.mods.map(function (m) { return m.name; }).reduce(function (acc, m) { return acc + m; }) + bi;
            var conds = [];
            block.mods.forEach(function (m) {
                conds.push({
                    "$eq": [
                        "$$stat.name",
                        m.name
                    ]
                });
            });
            adds.$addFields[blockid] = {
                "$sum": {
                    "$map": {
                        "input": {
                            "$filter": {
                                "input": "$statistics",
                                "as": "stat",
                                "cond": {
                                    "$or": conds
                                }
                            }
                        },
                        "as": "stat",
                        "in": "$$stat.max"
                    }
                }
            };
            mongofilter.$and.push((_a = {},
                _a[blockid] = {
                    $gte: parseInt((block.mods[0].min || -100000) + ""),
                    $lte: parseInt((block.mods[0].max || 100000) + "")
                },
                _a));
        };
        itemsearch.prototype.filterStatPseudo = function (m) {
            var _a, _b;
            var min = parseInt(m.min + "");
            var max = parseInt(m.max + "");
            if (!m.min)
                min = -100000;
            var filter = {
                "$and": []
            };
            filter.$and.push((_a = {},
                _a["(Pseudo) statistics." + m.name] = {
                    "$gte": min
                },
                _a));
            if (m.max) {
                filter.$and.push((_b = {},
                    _b["(Pseudo) statistics." + m.name] = {
                        "$lte": max
                    },
                    _b));
            }
            return filter;
        };
        itemsearch.prototype.filterStat = function (m) {
            var min = parseInt(m.min + "");
            var max = parseInt(m.max + "");
            if (!m.min)
                min = -100000;
            var minfilter = {
                "name": m.name,
                "min": { "$gte": min }
            };
            var maxfilter = {
                "name": m.name
            };
            if (m.max) {
                minfilter["max"] = { "$lte": max };
                maxfilter["max"] = { "$lte": max, "$gte": min };
            }
            else {
                maxfilter["max"] = { "$gte": min };
            }
            var mm = {
                "statistics": {
                    "$elemMatch": {
                        "$or": [minfilter, maxfilter]
                    }
                }
            };
            return mm;
        };
        itemsearch.prototype.query = function (filter, msn) {
            var _this = this;
            this.loadedCount = 0;
            this.api.getItems(filter).then(function (response) {
                _this.mason.index = 0;
                _this.mason.data = [];
                _this.mason.fulldata = response.content;
                _this.mason.showMore(100);
                _this.queriedb = true;
                if (msn != false)
                    _this.mason.initMasonry();
            });
        };
        itemsearch.prototype.smartresize = function () {
            if (!this.grid)
                return;
            var containerWidth = this.grid.clientWidth;
            var colCount = Math.floor(containerWidth / 220);
            var colWidth = (containerWidth / colCount) - (20 * colCount);
            this.grid.children["css"]({ width: colWidth }, { queue: false });
        };
        itemsearch.prototype.created = function (owningView, myView) {
        };
        itemsearch.prototype.bind = function (bindingContext, overrideContext) {
        };
        itemsearch.prototype.attached = function () {
            this.attachedb = true;
        };
        itemsearch.prototype.detached = function () {
        };
        itemsearch.prototype.unbind = function () {
        };
        var itemsearch_1;
        __decorate([
            aurelia_framework_1.bindable,
            __metadata("design:type", Number)
        ], itemsearch.prototype, "loadedCount", void 0);
        itemsearch = itemsearch_1 = __decorate([
            aurelia_framework_1.inject(api_1.WebAPI),
            __metadata("design:paramtypes", [api_1.WebAPI])
        ], itemsearch);
        return itemsearch;
    }());
    exports.itemsearch = itemsearch;
});
;
define('text!pages/items/itemsearch.css',[],function(){return "* {\n  -webkit-box-sizing: border-box;\n  -moz-box-sizing: border-box;\n  box-sizing: border-box;\n}\n/* body { font-family: sans-serif; } */\n.itemsearch {\n  width: 80%;\n  /* max-width: 1350px; */\n  margin: 0 auto;\n}\n.itemsearch-title {\n  /* margin-left: 10%; */\n}\n";});;
define('text!pages/items/itemsearch.html',[],function(){return "<template>\n  <require from=\"./itemsheet\"></require>\n  <require from=\"./filter\"></require>\n  <require from=\"./itemsearch.css\"></require>\n  <require from=\"../../components/mason.css\"></require>\n\n\n  <div class=\"itemsearch\">\n\n    <!-- Filtres -->\n    <filter filter.bind=\"filter\"></filter>\n\n\n    <!-- <h2 class=\"itemsearch-title\" onclick.call=\"layout()\">Items (${data.length})</h2> -->\n\n    <!-- <button onclick.call=\"showMore()\">Show more</button>\n    <button onclick.call=\"reloadMsnry()\">Reload</button>\n    <button onclick.call=\"layout()\">Layout</button> -->\n\n    <p></p>\n\n    <div class=\"grid-wrapper\">\n      <!-- items -->\n      <!-- show grid only if data is available -->\n      <div class=\"grid\" ref=\"grid\" onchange.call=\"onchange()\">\n        <!-- <div class=\"grid-sizer\"></div> -->\n        <!-- <div class=\"grid-item\" repeat.for=\"item of data\" data.bind=\"item\" style=\"background: pink;\"></div> -->\n        <itemsheet class=\"grid-item\" repeat.for=\"item of mason.data\" data.bind=\"item\"></itemsheet>\n      </div>\n    </div>\n  </div>\n\n</template>\n";});;
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('pages/items/itemsheet',["require", "exports", "./../../i18n", "aurelia-framework", "../build/build", "../items/itemsearch", "aurelia-router", "../../db"], function (require, exports, i18n_1, aurelia_framework_1, build_1, itemsearch_1, aurelia_router_1, db_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var itemsheet = (function () {
        function itemsheet(router) {
            this.data = {};
            this.hidden = "hidden";
            this.router = router;
        }
        itemsheet.prototype.isntPseudo = function (effect) {
            var name = effect.name;
            return name.includes("(isntPseudo)");
        };
        itemsheet.prototype.test = function () {
            var _this = this;
            if (!build_1.build.inst) {
                window.setTimeout(function () { return build_1.build.setItem(_this.data); }, 300);
            }
            else {
                build_1.build.setItem(this.data);
            }
            this.router.navigate("/build");
        };
        itemsheet.prototype.getImgUrl = function () {
            return db_1.db.getImgUrl(this.data);
        };
        itemsheet.prototype.bind = function (bindingContext, overrideContext) {
            this.compiledConditions = this.getConditions();
            this.compiledWeaponStats = this.getWeaponStats();
        };
        itemsheet.prototype.attached = function () {
            if (this.data && this.data.statistics) {
                this.data.statistics.forEach(function (element) {
                    element.style = db_1.db.getStatColor(element.name);
                });
            }
            if (itemsearch_1.itemsearch.inst)
                itemsearch_1.itemsearch.inst.onLoadedSheet();
            this.hidden = "";
        };
        itemsheet.prototype.getIcon = function (mod) {
            var style = db_1.db.getIconStyle(mod);
            return style;
        };
        itemsheet.prototype.getConditions = function () {
            var root = this.data.conditions.conditions;
            var str = "";
            if (Object.keys(root).length > 0)
                str = this.writeConditionNode(root);
            str = str.substring(1, str.lastIndexOf(")"));
            return str;
        };
        itemsheet.prototype.writeConditionNode = function (n) {
            var str = "";
            if (n.and) {
                str += this.writeConditionArray(n.and, " et ");
            }
            else if (n.or) {
                str += this.writeConditionArray(n.or, " ou ");
            }
            else {
                str += i18n_1.EnumStat.props.get(n.stat) + " " + n.operator + " " + n.value;
            }
            return str;
        };
        itemsheet.prototype.writeConditionArray = function (nodes, separator) {
            var str = "";
            var first = true;
            for (var _i = 0, nodes_1 = nodes; _i < nodes_1.length; _i++) {
                var n = nodes_1[_i];
                if (first)
                    first = false;
                else
                    str += separator;
                str += this.writeConditionNode(n);
            }
            str = "(" + str + ")";
            return str;
        };
        itemsheet.prototype.getWeaponStats = function () {
            var stats = this.data.weaponStats;
            if (!stats)
                return;
            var str = "";
            var separator = " • ";
            var arr = new Array();
            arr.push(stats.apCost + " " + i18n_1.EnumStat.AP.fr);
            if (stats.minRange) {
                arr.push(stats.minRange + "-" + stats.maxRange + " " + i18n_1.EnumStat.RANGE.fr);
            }
            else {
                arr.push(stats.maxRange + " " + i18n_1.EnumStat.RANGE.fr);
            }
            arr.push(stats.baseCritChance + "" + i18n_1.EnumStat.CRITICAL.fr + " " + "(+" + stats.critBonusDamage + ")");
            arr.push(stats.usesPerTurn + " " + "par tour");
            str = arr.join(separator);
            return str;
        };
        __decorate([
            aurelia_framework_1.bindable,
            __metadata("design:type", Object)
        ], itemsheet.prototype, "data", void 0);
        itemsheet = __decorate([
            aurelia_framework_1.inject(aurelia_router_1.Router),
            __metadata("design:paramtypes", [aurelia_router_1.Router])
        ], itemsheet);
        return itemsheet;
    }());
    exports.itemsheet = itemsheet;
});
;
define('text!pages/items/itemsheet.css',[],function(){return "/* .alignleft {\n\tfloat: left;\n}\n.alignright {\n\tfloat: right;\n  } */\n/* class=\"itemsheet\"  */\n/* Maintenant on target l'élément \"itemsheet\" ! */\nitemsheet {\n  --sheetaccent: var(--accent1);\n  --sheetaccenthover: var(--accent0);\n  /* background: #1d3030; */\n  /* background: var(--bg1); */\n  cursor: pointer;\n  /* border: 1px solid var(--sheetaccent); */\n  border: 1px solid transparent;\n  /* box-shadow: 5px 5px 5px black; */\n}\n/* immediate child must fill the itemsheet size for clicks */\nitemsheet .itemsheet {\n  /* width: 100%;\n  height: 100%;\n  align-items: stretch; */\n  min-height: 150px;\n  background-repeat: no-repeat;\n  /* background-attachment: fixed; */\n  background-position: center;\n}\nitemsheet .itemsheet::after {\n  opacity: 0.5;\n}\nitemsheet .bgimg {\n  display: inline;\n  /* width: 100%; */\n  /* height: 100%; */\n  /* min-height: 150px; */\n  opacity: 0.5;\n  background-repeat: no-repeat;\n  /* background-attachment: fixed; */\n  background-position: center;\n}\nitemsheet img {\n  width: 55px;\n  height: 55px;\n  margin-right: 5px;\n}\nitemsheet .title {\n  padding: 5px;\n  /* background: var(--sheetaccent); */\n  color: var(--sheetaccent);\n  font-size: 1.1rem;\n}\nitemsheet:hover .title {\n  color: var(--sheetaccenthover);\n  /* background: var(--sheetaccenthover); */\n}\nitemsheet .statistics {\n  padding: 5px;\n}\nitemsheet .statistics ul {\n  list-style: none;\n  margin: 0px;\n  padding: 0px;\n}\nitemsheet .conditions {\n  border-top: 1px dashed var(--sheetaccent);\n  /* width: 90%;\n  margin: auto; */\n  opacity: 0.5;\n}\nitemsheet:hover .conditions {\n  /* border-top: 1px dashed var(--sheetaccenthover); */\n  border-color: var(--sheetaccenthover);\n}\nitemsheet .conditionsBlock {\n  /* margin-bottom: 5px; */\n}\nitemsheet .customStats {\n  border-top: 1px dashed var(--sheetaccent);\n  opacity: 0.5;\n}\nitemsheet:hover .customStats {\n  border-color: var(--sheetaccenthover);\n}\nitemsheet .weaponStatsSeparator {\n  border-bottom: 1px dashed var(--accent1);\n  opacity: 0.5;\n}\nitemsheet:hover .weaponStatsSeparator {\n  border-color: var(--sheetaccenthover);\n}\nitemsheet:hover {\n  border: 1px solid var(--sheetaccenthover);\n}\n/* .grid-item { width: 200px; } */\n.dotted-spaced {\n  background-image: linear-gradient(to right, #333 10%, rgba(255, 255, 255, 0) 0%);\n  background-position: top;\n  background-size: 10px 1px;\n  background-repeat: repeat-x;\n}\n";});;
define('text!pages/items/itemsheet.html',[],function(){return "<template>\n  <require from=\"./itemsheet.css\"></require>\n\n\n  <!-- englobing class div for css -->\n  <div class=\"itemsheet\" onclick.call=\"test()\" ${hidden}>\n    <!-- <img class=\"bgimg\" src=\"${getImgUrl()}\"> -->\n    <!-- <div class=\"bgimg\" style=\"background-image: url('${getImgUrl()}');\"></div> -->\n\n    <!-- style=\"background-image: '${data.imgUrl}';\" -->\n    <!-- put the image as background ? -->\n    <!-- Image and weapon stats -->\n    <div class=\"title d-flex flex-nowrap\">\n      <img src=\"${getImgUrl()}\">\n      <!-- Name and level -->\n      <div>\n        <span>${data.name.fr}</span><br>\n        <span>${data.level}</span>\n      </div>\n      <!-- ${data.description} -->\n    </div>\n\n\n    <!-- Effects -->\n    <div class=\"statistics\">\n      <!-- <ul if.bind=\"data.characteristics\" style=\"border-bottom: 1px dashed var(--accent1);\">\n        <div>\n          <span>PA</span>\n          <span>${data.characteristics[0][\"PA\"]}</span>\n        </div>\n        <div>\n          <span>Portée</span>\n          <span>${data.characteristics[1][\"Portée\"]}</span>\n        </div>\n        <div>\n          <span>CC</span>\n          <span>${data.characteristics[2][\"CC\"]}</span>\n        </div>\n      </ul> -->\n\n      <!-- weapon effects -->\n      <div if.bind=\"data.weaponStats\">\n        <!-- <div>${compiledWeaponStats}</div>\n        <div class=\"weaponStatsSeparator\">\n        </div> -->\n        <ul>\n          <li class=\"row\" repeat.for=\"effect of data.weaponStats.effects\" if=\"isntPseudo(effect)\">\n            <div class=\"container statistic\">\n              <span style.bind=\"getIcon(effect.name)\"></span>\n              ${effect.min}\n              ${effect.min == null ? \"\" : \"à\"}\n              ${effect.max}\n              <span>${effect.name}</span>\n            </div>\n          </li>\n          <!-- <div class=\"weaponStatsSeparator\"></div> -->\n        </ul>\n      </div>\n\n      <!-- normal effects -->\n      <ul>\n        <!-- 1 row for each effect -->\n        <li class=\"row\" repeat.for=\"effect of data.statistics\" if=\"isntPseudo(effect)\">\n          <!-- <compose view-model=\"./statistic\" model.bind=\"effect\"></compose> -->\n          <div class=\"container statistic\">\n            ${effect.min}\n            ${effect.min == null ? \"\" : \"à\"}\n            ${effect.max}\n            <span style.bind=\"effect.style\">${effect.name}</span>\n            <!-- ${effect} -->\n          </div>\n        </li>\n\n        <!-- custom effects (ex: jahash, crocobur...) -->\n        <li class=\"row\">\n          <div class=\"container statistic\" if.bind=\"data.customStats.fr\">\n            <!-- <div class=\"customStats\">\n            </div> -->\n            ${data.customStats.fr}\n          </div>\n        </li>\n      </ul>\n      \n      <!-- weapon effects -->\n      <div if.bind=\"data.weaponStats\">\n        <div class=\"weaponStatsSeparator\"></div>\n        <div style=\"opacity: 80%;\">${compiledWeaponStats}</div>\n      </div>\n    </div>\n\n    <div class=\"conditionsBlock\" if.bind=\"compiledConditions\">\n      <div class=\"conditions\"></div>\n      <div style=\"opacity: 80%;\">\n        ${compiledConditions}\n      </div>\n    </div>\n    <!-- Conditions -->\n    <!-- <div class=\"conditions\" if.bind=\"data.conditions\" style=\"border-top: 1px dashed var(--accent1);\">\n      <ul style=\"list-style: none; margin: 0px; padding: 0px;\">\n        <li repeat.for=\"cond of data.conditions\">\n          ${cond}\n        </li>\n      </ul>\n    </div> -->\n\n  </div>\n\n</template>\n";});;
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('pages/sets/setfilter',["require", "exports", "aurelia-framework", "./setsearch", "../../db", "jquery"], function (require, exports, aurelia_framework_1, setsearch_1, db_1, $) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var setfilter = (function () {
        function setfilter() {
            var _this = this;
            this.filterText = "";
            this.filterLevel = true;
            this.levelMin = 190;
            this.levelMax = 200;
            this.filterBonuses = false;
            this.filterTypeIn = false;
            this.filterTypeOut = false;
            this.handleKeyInput = function (event) {
                if (event.key == "Enter")
                    _this.search();
            };
            setfilter.inst = this;
            this.modsSections = new Map();
            this.modsSections.set("Pseudo", [
                "(Pseudo) # res",
                "(Pseudo) # res élémentaires",
                "(Pseudo) Total #% res",
                "(Pseudo) Total #% res élémentaires",
            ]);
            db_1.db.getStatNames().forEach(function (v, k) {
                _this.modsSections.set(k, v);
            });
            this.bonuses = new Map();
            this.typesIn = new Map();
            this.typesOut = new Map();
            this.bonuses.set("PA", false);
            this.bonuses.set("PM", false);
            this.bonuses.set("PO", false);
            var typess = db_1.db.getItemsTypes().concat(db_1.db.getPetTypes());
            typess.push("Arme");
            typess.forEach(function (s) {
                _this.typesIn.set(s, false);
                _this.typesOut.set(s, false);
            });
            this.styleChecked = {
                color: "var(--front1)",
                background: "var(--accent1)",
            };
            this.styleUnchecked = {
                color: "var(--front0)",
                background: "transparent",
            };
            this.blocks = [];
            this.addBlock();
            this.loadFilter();
            this.search();
        }
        setfilter.prototype.created = function (owningView, myView) {
        };
        setfilter.prototype.bind = function (bindingContext, overrideContext) {
        };
        setfilter.prototype.attached = function () {
            window.addEventListener('keypress', this.handleKeyInput, false);
        };
        setfilter.prototype.detached = function () {
            window.removeEventListener('keypress', this.handleKeyInput);
        };
        setfilter.prototype.unbind = function () {
        };
        setfilter.prototype.search = function () {
            setsearch_1.setsearch.inst.search(this);
            this.saveFilter();
        };
        setfilter.prototype.loadFilter = function () {
            var json = localStorage.getItem("setfilter");
            if (json) {
                var data = JSON.parse(json);
                this.filterLevel = data.filterLevel;
                this.filterText = data.filterText;
                this.levelMin = data.levelMin;
                this.levelMax = data.levelMax;
                this.typesIn = new Map(data.typesIn);
                this.typesOut = new Map(data.typesOut);
                this.filterLevel = data.filterLevel;
                this.filterBonuses = data.filterBonuses;
                this.filterTypeIn = data.filterTypeIn;
                this.filterTypeOut = data.filterTypeOut;
                this.blocks = data.blocks;
            }
        };
        setfilter.prototype.saveFilter = function () {
            var obj = {
                filterText: this.filterText,
                levelMin: this.levelMin,
                levelMax: this.levelMax,
                typesIn: Array.from(this.typesIn.entries()),
                typesOut: Array.from(this.typesOut.entries()),
                filterLevel: this.filterLevel,
                filterBonuses: this.filterBonuses,
                filterTypeIn: this.filterTypeIn,
                filterTypeOut: this.filterTypeOut,
                blocks: this.blocks
            };
            localStorage.setItem("setfilter", JSON.stringify(obj));
        };
        setfilter.prototype.setBlock = function (blockIndex, type, args) {
            this.blocks[blockIndex].type = type;
            this.blocks[blockIndex].min = args[0];
            this.blocks[blockIndex].max = args[1];
            this.blocks[blockIndex].activate = true;
            this.blocks[blockIndex].mods = [];
        };
        setfilter.prototype.deleteBlock = function (blockIndex) {
            this.blocks.splice(blockIndex, 1);
        };
        setfilter.prototype.setMod = function (blockIndex, mod, args) {
            var m = this.blocks[blockIndex].mods.find(function (e) { return e.name == mod; });
            if (!m) {
                m = new ModFilter();
                this.blocks[blockIndex].mods.push(m);
            }
            m.name = mod;
            if (args.length > 0)
                m.min = args[0];
            if (args.length > 1)
                m.max = args[1];
            m.activate = true;
        };
        setfilter.prototype.deleteMod = function (blockIndex, mod) {
            var m = this.blocks[blockIndex].mods.find(function (e) { return e.name == mod; });
            if (m) {
                var i = this.blocks[blockIndex].mods.indexOf(m);
                this.blocks[blockIndex].mods.splice(i, 1);
            }
        };
        setfilter.prototype.filterBonusesClicked = function () {
            var _this = this;
            var activated = this.filterBonuses;
            this.bonuses.forEach(function (value, key) { return _this.bonuses.set(key, !activated); });
        };
        setfilter.prototype.checkBonus = function (type) {
            var activated = this.bonuses.get(type);
            this.bonuses.set(type, !activated);
            this.filterBonuses = this.hasValue(this.bonuses, true);
        };
        setfilter.prototype.filterTypeInClicked = function () {
            var _this = this;
            var activated = this.filterTypeIn;
            this.typesIn.forEach(function (value, key) { return _this.typesIn.set(key, !activated); });
        };
        setfilter.prototype.checkTypeIn = function (type) {
            var activated = this.typesIn.get(type);
            this.typesIn.set(type, !activated);
            this.filterTypeIn = this.hasValue(this.typesIn, true);
        };
        setfilter.prototype.filterTypeOutClicked = function () {
            var _this = this;
            var activated = this.filterTypeOut;
            this.typesOut.forEach(function (value, key) { return _this.typesOut.set(key, !activated); });
        };
        setfilter.prototype.checkTypeOut = function (type) {
            this.typesOut.set(type, !this.typesOut.get(type));
            this.filterTypeOut = this.hasValue(this.typesOut, true);
        };
        setfilter.prototype.hasValue = function (map, value) {
            for (var _i = 0, _a = Array.from(map.entries()); _i < _a.length; _i++) {
                var _b = _a[_i], key = _b[0], val = _b[1];
                if (val == value)
                    return true;
            }
            return false;
        };
        setfilter.prototype.myFunction = function () {
            document.getElementById("myDropdown").classList.toggle("show");
        };
        setfilter.prototype.filterFunction = function () {
            var input, filter, ul, li, a, i;
            input = document.getElementById("myInput");
            filter = input.value.toUpperCase();
            var div = document.getElementById("myDropdown");
            a = div.getElementsByTagName("a");
            for (i = 0; i < a.length; i++) {
                var txtValue = a[i].textContent || a[i].innerText;
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    a[i].style.display = "";
                }
                else {
                    a[i].style.display = "none";
                }
            }
        };
        setfilter.prototype.filterFunction2 = function (that, event) {
            var container, input, filter, li, input_val;
            container = $(event.target).closest("searchable");
            input = container.find("input");
            input_val = input.val() + "";
            if (input_val == "undefined")
                input_val = "";
            input_val = input_val.toUpperCase();
            if (["ArrowDown", "ArrowUp", "Enter"].indexOf(event.key) != -1) {
                this.keyControl(event, container);
            }
            else {
                li = container.find("dl dd");
                li.each(function (i, obj) {
                    if ($(this).text().toUpperCase().indexOf(input_val) > -1) {
                        $(this).show();
                    }
                    else {
                        $(this).hide();
                    }
                });
                container.find("dl dd").removeClass("selected");
                setTimeout(function () {
                    container.find("dl dd:visible").first().addClass("selected");
                }, 100);
            }
        };
        setfilter.prototype.keyControl = function (e, container) {
            if (e.key == "ArrowDown") {
                if (container.find("dl dd").hasClass("selected")) {
                    if (container.find("dl dd:visible").index(container.find("dl dd.selected")) + 1 < container.find("dl dd:visible").length) {
                        container.find("dl dd.selected").removeClass("selected").nextAll().not('[style*="display: none"]').first().addClass("selected");
                    }
                }
                else {
                    var dd = container.find("dl dd:first-child");
                    container.find("dl dd:first-child").addClass("selected");
                }
            }
            else if (e.key == "ArrowUp") {
                if (container.find("dl dd:visible").index(container.find("dl dd.selected")) > 0) {
                    container.find("dl dd.selected").removeClass("selected").prevAll().not('[style*="display: none"]').first().addClass("selected");
                }
            }
            else if (e.key == "Enter") {
                container.find("input").val(container.find("dl dd.selected").text()).blur();
                this.onSelect(container.find("dl dd.selected").text());
            }
            var selectedDD = container.find("dl dd.selected")[0];
            if (selectedDD) {
            }
        };
        setfilter.prototype.onSelect = function (val) {
        };
        setfilter.prototype.addBlock = function () {
            this.blocks.push({
                type: "$and",
                min: 0,
                max: 0,
                mods: [new ModFilter()],
                activate: true,
            });
        };
        setfilter.prototype.addStatMod = function (that, event, blockid) {
            this.blocks[blockid].mods.push(new ModFilter());
            var ele = event.target;
            $(ele.parentElement.children.item(1)).show();
        };
        setfilter.prototype.onModInputFocus = function (that, event, blockid, modid) {
            $(event.target).closest(".searchable").find("dl").show();
            $(event.target).closest(".searchable").find("dl section dd").show();
        };
        setfilter.prototype.onModInputBlur = function (that, event, blockid, modid) {
            setTimeout(function () {
                $(event.target).closest(".searchable").find("dl").hide();
            }, 300);
        };
        setfilter.prototype.oninput = function (that, event) {
        };
        setfilter.prototype.onDDHover = function (that, event, blockid, modid, modname) {
            $(event.target).closest(".searchable").find("dl section dd.selected").removeClass("selected");
            $(event.target).addClass("selected");
        };
        setfilter.prototype.onDDClick = function (that, event, blockid, modid, modname) {
            var ele = event.target;
            this.blocks[blockid].mods[modid].name = modname;
            var input = $(ele).closest(".searchable").find("input");
            input.blur();
        };
        __decorate([
            aurelia_framework_1.observable({ changeHandler: 'filterTypeInChanged' }),
            __metadata("design:type", Boolean)
        ], setfilter.prototype, "filterTypeIn", void 0);
        __decorate([
            aurelia_framework_1.observable({ changeHandler: 'filterTypeOutChanged' }),
            __metadata("design:type", Boolean)
        ], setfilter.prototype, "filterTypeOut", void 0);
        return setfilter;
    }());
    exports.setfilter = setfilter;
    var BlockFilter = (function () {
        function BlockFilter() {
            this.type = "$and";
            this.activate = true;
            this.mods = [];
        }
        return BlockFilter;
    }());
    exports.BlockFilter = BlockFilter;
    var ModFilter = (function () {
        function ModFilter() {
            this.activate = true;
        }
        return ModFilter;
    }());
    exports.ModFilter = ModFilter;
});
;
define('text!pages/sets/setfilter.css',[],function(){return ".searchable {\n  width: 100%;\n  float: left;\n}\n.searchable input {\n  width: 100%;\n  -webkit-box-sizing: border-box;\n  /* Safari/Chrome, other WebKit */\n  -moz-box-sizing: border-box;\n  /* Firefox, other Gecko */\n  box-sizing: border-box;\n  /* Opera/IE 8+ */\n  display: block;\n  background-clip: padding-box;\n  border: 1px solid var(--accent1);\n  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;\n}\n.searchable dl {\n  width: 100%;\n  position: absolute;\n  display: none;\n  list-style-type: none;\n  border: 1px solid var(--accent1);\n  border-top: none;\n  max-height: 380px;\n  margin: 0;\n  overflow-y: scroll;\n  overflow-x: hidden;\n  padding: 0;\n  background-color: var(--bg0);\n  z-index: 3;\n}\n.searchable dl dt {\n  height: 25px;\n  color: var(--front0);\n  background-color: var(--bg1);\n  z-index: 4;\n}\n.searchable dl dd {\n  height: 25px;\n  cursor: pointer;\n  color: var(--front0);\n  background-color: var(--bg0);\n  z-index: 4;\n  margin: 0px;\n}\n.searchable dl dd.selected {\n  background-color: #e8e8e8;\n  color: #333;\n}\nsetfilter > div {\n  /* width: 1200px; */\n  /* height: 300px; */\n  /* background: white; */\n  /* border: 1px solid var(--accent1); */\n  max-width: 85% !important;\n}\n/* Search bar */\nsetfilter .search {\n  width: 100%;\n  height: 40px;\n  padding-left: 5px;\n}\n/* Toggle button */\nsetfilter .toggle {\n  border: 1px solid var(--accent1);\n  background: transparent;\n  margin-bottom: 4px;\n  margin-right: 4px;\n  padding: 2px;\n  cursor: pointer;\n  text-align: center;\n  min-width: 50px;\n  height: 35px;\n}\nsetfilter .toggle label {\n  cursor: pointer;\n  margin: 0px;\n}\n/* Checkbox input */\nsetfilter input[type=\"checkbox\"] {\n  appearance: none;\n  -webkit-appearance: none;\n  -moz-appearance: none;\n}\nsetfilter .checkbox {\n  width: 15px;\n  height: 15px;\n  background: var(--bg0);\n  border: 1px solid var(--accent1);\n  padding: 2px;\n}\nsetfilter .checkbox:checked {\n  background: var(--accent1);\n}\n/* title labels */\nsetfilter .title {\n  font-size: 25px;\n  font-weight: bold;\n  /* margin-left: 5px; */\n}\n/* block list */\nsetfilter .blocklist .block {\n  margin-bottom: 10px;\n}\nsetfilter .blocklist .block .blocktitle {\n  font-size: 20px;\n  color: var(--front0);\n  background: var(--bg0);\n  border-color: var(--bg0);\n  width: 100%;\n  /* margin-left: 5px; */\n  /* font-weight: bold; */\n}\nsetfilter .blocklist .block .blocktitle:focus {\n  border-color: var(--bg0) !important;\n}\nsetfilter .blocklist .block .mod {\n  margin-bottom: 10px;\n}\nsetfilter .blocklist .block .mod label {\n  background: var(--bg1);\n  width: 65%;\n  /* margin-left: 5px;\n  margin-right: 5px; */\n  margin-bottom: 0px /* background: var(--bg1); */ /* font-size: 20px; */ /* font-weight: bold; */;\n}\nsetfilter .btnAdd {\n  width: 100%;\n}\n/* left side */\n.leftside {\n  padding-left: 1px;\n}\n/* right side */\n.rightside {\n  padding-right: 1px;\n}\n";});;
define('text!pages/sets/setfilter.html',[],function(){return "<template>\n  <require from=\"./setfilter.less\"></require>\n\n  <!-- <link href=\"https://cdn.jsdelivr.net/npm/select2@4.0.13/dist/css/select2.min.css\" rel=\"stylesheet\" />\n  <script src=\"https://cdn.jsdelivr.net/npm/select2@4.0.13/dist/js/select2.min.js\"></script> -->\n\n  <div class=\"container\">\n\n    <!-- Search -->\n    <div class=\"row\">\n      <input class=\"search\" type=\"text\" value.bind=\"filterText\" placeholder=\"search...\" focus=\"true\" />\n    </div>\n\n    <!-- tagify search box ? = search sur item names, panoplies, effets, types d'items (capecoiffe..).... -->\n    <!-- exemple tu clic sur [() Agilité ] et ça remplace le text par 2 box min/max à côté de l'icône d'agi -->\n\n    <div class=\"row\">\n      <!--Generic filters left side -->\n      <div class=\"leftside col\">\n\n        <!-- Level -->\n        <div class=\"d-flex align-items-center\">\n          <input class=\"checkbox mr-1\" type=\"checkbox\" id=\"level\" checked.bind=\"filterLevel\" />\n          <label class=\"title mr-auto\" for=\"level\">Level</label>\n          <input class=\"mr-2\" type=\"number\" value.bind=\"levelMin\" placeholder=\"min\" />\n          <input class=\"\" type=\"number\" value.bind=\"levelMax\" placeholder=\"max\" />\n        </div>\n\n        <!-- Bonus majeurs -->\n        <input class=\"checkbox\" type=\"checkbox\" id=\"bonus\" checked.bind=\"filterBonuses\" onclick.call=\"filterBonusesClicked()\" />\n        <label class=\"title\" for=\"bonus\">Bonus</label>\n        <div class=\"d-flex flex-wrap\">\n          <div class=\"toggle\" repeat.for=\"[bonus, value] of bonuses\" onclick.call=\"checkBonus(bonus)\" style.bind=\"value ? styleChecked : styleUnchecked\">\n            <label for=\"${bonus}\" innerHTML.bind=\"bonus\"></label>\n          </div>\n        </div>\n\n        <!-- Types base -->\n        <input class=\"checkbox\" type=\"checkbox\" id=\"typeIn\" checked.bind=\"filterTypeIn\" onclick.call=\"filterTypeInClicked()\" />\n        <label class=\"title\" for=\"typeIn\">Type Inclu</label>\n        <div class=\"d-flex flex-wrap\">\n          <div class=\"toggle\" repeat.for=\"[type, value] of typesIn\" onclick.call=\"checkTypeIn(type)\" style.bind=\"value ? styleChecked : styleUnchecked\">\n            <label for=\"${type}\" innerHTML.bind=\"type\"></label>\n          </div>\n        </div>\n\n        <!-- Types exclus -->\n        <input class=\"checkbox\" type=\"checkbox\" id=\"typeOut\" checked.bind=\"filterTypeOut\" onclick.call=\"filterTypeOutClicked()\" />\n        <label class=\"title\" for=\"typeOut\">Type Exclu</label>\n        <div class=\"d-flex flex-wrap\">\n          <div class=\"toggle\" repeat.for=\"[type, value] of typesOut\" onclick.call=\"checkTypeOut(type)\" style.bind=\"value ? styleChecked : styleUnchecked\">\n            <label for=\"${type}\" innerHTML.bind=\"type\"></label>\n          </div>\n        </div>\n\n        <!-- Types weapons -->\n        <!-- <input class=\"checkbox\" type=\"checkbox\" id=\"armes\" checked.bind=\"filterWeapon\" onclick.call=\"filterWeaponClicked()\" />\n        <label class=\"title\" for=\"armes\">Armes</label>\n        <div class=\"d-flex flex-wrap\">\n          <div class=\"toggle\" repeat.for=\"[arme, value] of armes\" onclick.call=\"checkWeapon(arme)\" style.bind=\"value ? styleChecked : styleUnchecked\">\n            <label for=\"${arme}\" innerHTML.bind=\"arme\"></label>\n          </div>\n        </div> -->\n\n      </div>\n\n      <!-- Mods -->\n      <div class=\"rightside col\">\n        <!-- Mods -->\n        <input class=\"checkbox\" type=\"checkbox\" id=\"mods\" checked />\n        <label class=\"title\" for=\"mods\">Mods</label>\n        <div class=\"blocklist\" ref=\"blocklist\">\n          <!-- block list  -->\n          <div class=\"block\" repeat.for=\"i of blocks.length\" id.bind=\"i\">\n            <!-- block properties -->\n            <div class=\"d-flex align-items-center\">\n              <input class=\"checkbox mr-1\" type=\"checkbox\" id=\"${i}\" checked.bind=\"blocks[i].activate\" />\n              <select class=\"mr-auto blocktitle\" name=\"type\" value.bind=\"blocks[i].type\">\n                <option value=\"$and\">And</option>\n                <option value=\"$or\">Or</option>\n                <option value=\"$nor\">Not</option>\n                <option value=\"$sum\">Sum</option>\n              </select>\n              <!-- <label class=\"mr-auto blocktitle\" for=\"${i}\">${blocks[i].type}</label> -->\n              <button class=\"btnDelete\" onclick.call=\"deleteBlock(i)\">x</button>\n            </div>\n            <!-- mod list -->\n            <div class=\"mod d-flex align-items-center\" repeat.for=\"j of blocks[i].mods.length\" id.bind=\"j\">\n\n              <!-- checkbox -->\n              <input class=\"checkbox mr-1\" type=\"checkbox\" checked.bind=\"blocks[i].mods[j].activate\" />\n              <!-- mod select -->\n              <div name=\"modsearch\" class=\"searchable\">\n                <input name=\"modsearchinput\" type=\"text\" autocomplete=\"off\" placeholder=\"+Add Stat Mod\" onkeyup.call=\"filterFunction2($this,$event)\" value.bind=\"blocks[i].mods[j].name\" onchange.call=\"oninput($this, $event)\"\n                  onfocus.call=\"onModInputFocus($this, $event, i, j)\" onblur.call=\"onModInputBlur($this, $event, i, j)\">\n                <dl name=\"modsearchlist\" class=\"modlist\">\n                  <!-- automatically filled with mods -->\n                  <!-- <dt></dt> -->\n                  <!-- <dd></dd> -->\n                  <!-- <modlist title.bind=\"section\" mods.bind=\"modsSections.\"></modlist> -->\n                  <section repeat.for=\"[section, mods] of modsSections\">\n                    <dt>${section}</dt>\n                    <dd repeat.for=\"modname of mods\" onmouseover.call=\"onDDHover($this, $event, i, j, modname)\" onclick.call=\"onDDClick($this, $event, i, j, modname)\">${modname}</dd>\n                  </section>\n                </dl>\n              </div>\n              <!-- mod min/max -->\n              <input class=\"ml-2 mr-2\" type=\"number\" value.bind=\"blocks[i].mods[j].min\" placeholder=\"min\" />\n              <input class=\"mr-2\" type=\"number\" value.bind=\"blocks[i].mods[j].max\" placeholder=\"max\" />\n              <!-- mod delete -->\n              <button class=\"btnDelete\" onclick.call=\"deleteMod(i, blocks[i].mods[j].name)\">x</button>\n\n            </div>\n            <!-- create mod -->\n            <div>\n              <button class=\"btnAdd\" click.delegate=\"addStatMod($this, $event, i)\">+Add Stat Mod</button>\n              <div name=\"modsearch\" class=\"searchable\">\n                <dl name=\"modsearchlist\" class=\"modlist\">\n                  <section repeat.for=\"[section, mods] of modsSections\">\n                    <dt>${section}</dt>\n                    <dd repeat.for=\"modname of mods\" onmouseover.call=\"onDDHover($this, $event, i, j, modname)\" onclick.call=\"onDDClick($this, $event, i, j, modname)\">${modname}</dd>\n                  </section>\n                </dl>\n              </div>\n            </div> <!-- end of create mod -->\n          </div> <!-- end of block list -->\n\n          <!-- create block -->\n          <div class=\"block\">\n            <button class=\"btnAdd\" onclick.call=\"addBlock()\">+Add Stat Block</button>\n          </div>\n        </div>\n\n\n      </div>\n    </div>\n\n    <!-- Search button -->\n    <div class=\"row\">\n      <button class=\"btnSearch\" onclick.call=\"search()\">Search</button>\n    </div>\n\n  </div>\n\n</template>\n";});;
define('text!pages/sets/setfilter.less',[],function(){return ".searchable {\n  width: 100%;\n  // width: 300px;\n  float: left;\n  // margin: 0 15px;\n}\n\n.searchable input {\n    width: 100%;\n    // height: 40px;\n    // font-size: 18px;\n    // padding: 10px;\n    -webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */\n    -moz-box-sizing: border-box; /* Firefox, other Gecko */\n    box-sizing: border-box; /* Opera/IE 8+ */\n    display: block;\n    // font-weight: 400;\n    // line-height: 1.6;\n    // color: #495057;\n    // background-color: #fff;\n    background-clip: padding-box;\n    border: 1px solid  var(--accent1);\n    // border-radius: .25rem;\n    transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out;\n    // background: url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 5'%3E%3Cpath fill='%23343a40' d='M2 0L0 2h4zm0 5L0 3h4z'/%3E%3C/svg%3E\") no-repeat right .75rem center/8px 10px;\n}\n\n.searchable dl {\n  width: 100%;\n  // float:left;\n  position:absolute;\n  display: none;\n  list-style-type: none;\n  // background-color: #fff;\n  // border-radius: 0 0 5px 5px;\n  border: 1px solid var(--accent1);\n  border-top: none;\n  max-height: 380px;\n  margin: 0;\n  overflow-y: scroll;\n  overflow-x: hidden;\n  padding: 0;\n  background-color: var(--bg0);\n  z-index: 3;\n}\n\n.searchable dl dt {\n  // color: var(--accent1);\n  height: 25px;\n  // border-bottom: 1px solid #e1e1e1;\n  color: var(--front0);\n  background-color: var(--bg1);\n  z-index: 4;\n}\n.searchable dl dd {\n  height: 25px;\n  // padding: 7px 9px;\n  // border-bottom: 1px solid #e1e1e1;\n  cursor: pointer;\n  // color: #6e6e6e;\n  color: var(--front0);\n  background-color: var(--bg0);\n  z-index: 4;\n  margin: 0px;\n}\n\n.searchable dl dd.selected {\n    background-color: #e8e8e8;\n    color: #333;\n}\n\n\nsetfilter {\n\n}\n\nsetfilter>div {\n  /* width: 1200px; */\n  /* height: 300px; */\n  /* background: white; */\n  /* border: 1px solid var(--accent1); */\n  max-width: 85% !important;\n}\n\n/* Search bar */\nsetfilter .search {\n  width: 100%;\n  height: 40px;\n  padding-left: 5px;\n}\n\n\n/* Toggle button */\nsetfilter .toggle {\n  border: 1px solid var(--accent1);\n  background: transparent;\n  margin-bottom: 4px;\n  margin-right: 4px;\n  padding: 2px;\n  cursor: pointer;\n  text-align: center;\n  min-width: 50px;\n  height: 35px;\n}\nsetfilter .toggle label {\n  cursor: pointer;\n  margin: 0px;\n}\n\n/* Checkbox input */\nsetfilter input[type=\"checkbox\"] {\n  appearance: none;\n  -webkit-appearance: none;\n  -moz-appearance: none;\n}\nsetfilter .checkbox {\n  width: 15px;\n  height: 15px;\n  background: var(--bg0);\n  border: 1px solid var(--accent1);\n  padding: 2px;\n}\nsetfilter .checkbox:checked {\n  background: var(--accent1);\n}\n\n\n/* title labels */\nsetfilter .title {\n  font-size: 25px;\n  font-weight: bold;\n  /* margin-left: 5px; */\n}\n\n/* block list */\nsetfilter .blocklist {\n\n}\nsetfilter .blocklist .block {\n  margin-bottom: 10px;\n}\nsetfilter .blocklist .block .blocktitle {\n  font-size: 20px;\n  color: var(--front0);\n  background: var(--bg0);\n  border-color: var(--bg0);\n  width: 100%;\n  /* margin-left: 5px; */\n  /* font-weight: bold; */\n}\nsetfilter .blocklist .block .blocktitle:focus {\n  border-color: var(--bg0) !important;\n}\nsetfilter .blocklist .block .mod {\n  margin-bottom: 10px;\n}\nsetfilter .blocklist .block .mod label {\n  background: var(--bg1);\n  width: 65%;\n  /* margin-left: 5px;\n  margin-right: 5px; */\n  margin-bottom: 0px\n  /* background: var(--bg1); */\n  /* font-size: 20px; */\n  /* font-weight: bold; */\n}\n\nsetfilter .btnAdd {\n  width: 100%;\n}\n\n/* left side */\n.leftside {\n  padding-left: 1px;\n}\n/* right side */\n.rightside {\n  padding-right: 1px;\n}\n";});;
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('pages/sets/setsearch',["require", "exports", "aurelia-framework", "../../api", "../../util"], function (require, exports, aurelia_framework_1, api_1, util_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var setsearch = (function () {
        function setsearch(api) {
            var _this = this;
            this.api = api;
            this.loadedCount = 0;
            this.onLoadedSheet = null;
            this.attachedb = false;
            this.queriedb = false;
            setsearch_1.inst = this;
            this.mason = new util_1.Mason();
            this.mason.obj = this;
            this.onLoadedSheet = util_1.util.debounce(function () {
                _this.mason.reloadMsnry();
            }, 100, false);
        }
        setsearch_1 = setsearch;
        setsearch.prototype.search = function (filter) {
            var _this = this;
            var adds = { $addFields: {} };
            var mongofilter = { $and: [] };
            if (filter.filterLevel) {
                mongofilter.$and.push({ "items.level": { "$gte": parseInt(filter.levelMin + "") } });
                mongofilter.$and.push({ "items.level": { "$lte": parseInt(filter.levelMax + "") } });
            }
            if (filter.filterBonuses) {
                filter.bonuses.forEach(function (v, k) {
                    if (v)
                        mongofilter.$and.push({ "bonuses.0.name": k });
                });
            }
            if (filter.filterTypeIn) {
                filter.typesIn.forEach(function (v, k) {
                    if (v)
                        mongofilter.$and.push({ "items.type": k });
                });
            }
            if (filter.filterTypeOut) {
                filter.typesOut.forEach(function (v, k) {
                    if (v)
                        mongofilter.$and.push({ "items.type": { "$ne": k } });
                });
            }
            if (filter.filterText && filter.filterText != "") {
                mongofilter.$and.push({
                    "$or": [
                        { "name.fr": { "$regex": util_1.util.caseAndAccentInsensitive(filter.filterText), "$options": "i" } },
                    ]
                });
            }
            var bi = 0;
            filter.blocks.forEach(function (block) {
                var _a;
                if (block.activate) {
                    if (block.type == "$sum") {
                        _this.filterSum(mongofilter, adds, bi, block);
                    }
                    else {
                        var arr = block.mods.filter(function (m) { return m.activate && m.name != undefined; }).map(function (m) {
                            if (m.name.includes("Pseudo"))
                                return _this.filterStatPseudo(m);
                            else
                                return _this.filterStat(m);
                        });
                        if (arr.length > 0) {
                            mongofilter.$and.push((_a = {},
                                _a[block.type] = arr,
                                _a));
                        }
                    }
                }
                bi++;
            });
            var pipeline = [];
            {
                pipeline.push({ $sort: { "level": -1, "ankamaID": -1 } });
                if (Object.keys(adds.$addFields).length > 0)
                    pipeline.push(adds);
                pipeline.push({ $match: mongofilter });
                pipeline.push({ $limit: 100 });
                pipeline.push({ $skip: 0 });
            }
            this.query(pipeline);
        };
        setsearch.prototype.filterSum = function (mongofilter, adds, bi, block) {
            var _a;
            var blockid = block.mods.map(function (m) { return m.name; }).reduce(function (acc, m) { return acc + m; }) + bi;
            var conds = [];
            block.mods.forEach(function (m) {
                conds.push({
                    "$eq": [
                        "$$stat.name",
                        m.name
                    ]
                });
            });
            adds.$addFields[blockid] = {
                "$sum": {
                    "$map": {
                        "input": {
                            "$filter": {
                                "input": "$statistics",
                                "as": "stat",
                                "cond": {
                                    "$or": conds
                                }
                            }
                        },
                        "as": "stat",
                        "in": "$$stat.max"
                    }
                }
            };
            mongofilter.$and.push((_a = {},
                _a[blockid] = {
                    $gte: parseInt((block.mods[0].min || -100000) + ""),
                    $lte: parseInt((block.mods[0].max || 100000) + "")
                },
                _a));
        };
        setsearch.prototype.filterStatPseudo = function (m) {
            var _a, _b;
            var min = parseInt(m.min + "");
            var max = parseInt(m.max + "");
            if (!m.min)
                min = -100000;
            var filter = {
                "$and": []
            };
            filter.$and.push((_a = {},
                _a["(Pseudo) statistics." + m.name] = {
                    "$gte": min
                },
                _a));
            if (m.max) {
                filter.$and.push((_b = {},
                    _b["(Pseudo) statistics." + m.name] = {
                        "$lte": max
                    },
                    _b));
            }
            return filter;
        };
        setsearch.prototype.filterStat = function (m) {
            var min = parseInt(m.min + "");
            var max = parseInt(m.max + "");
            if (!m.min)
                min = -100000;
            if (!m.max)
                max = 100000;
            var maxfilter = {
                "name": m.name
            };
            if (m.max) {
                maxfilter["max"] = { "$lte": max, "$gte": min };
            }
            else {
                maxfilter["max"] = { "$gte": min };
            }
            var mm = {
                "statistics": {
                    "$elemMatch": maxfilter
                }
            };
            return mm;
        };
        setsearch.prototype.query = function (filter, msn) {
            var _this = this;
            this.loadedCount = 0;
            this.api.getSets(filter).then(function (response) {
                _this.mason.index = 0;
                _this.mason.data = [];
                _this.mason.fulldata = response.content;
                _this.mason.showMore(50);
                console.log("setsearch query : " + response.content.length);
                _this.queriedb = true;
                if (msn != false)
                    _this.mason.initMasonry();
            });
        };
        setsearch.prototype.created = function (owningView, myView) {
        };
        setsearch.prototype.bind = function (bindingContext, overrideContext) {
        };
        setsearch.prototype.attached = function () {
            this.attachedb = true;
        };
        setsearch.prototype.detached = function () {
        };
        setsearch.prototype.unbind = function () {
        };
        var setsearch_1;
        __decorate([
            aurelia_framework_1.bindable,
            __metadata("design:type", Number)
        ], setsearch.prototype, "loadedCount", void 0);
        setsearch = setsearch_1 = __decorate([
            aurelia_framework_1.inject(api_1.WebAPI),
            __metadata("design:paramtypes", [api_1.WebAPI])
        ], setsearch);
        return setsearch;
    }());
    exports.setsearch = setsearch;
});
;
define('text!pages/sets/setsearch.css',[],function(){return "* {\n  -webkit-box-sizing: border-box;\n  -moz-box-sizing: border-box;\n  box-sizing: border-box;\n}\n/* body { font-family: sans-serif; } */\n.setsearch {\n  width: 80%;\n  /* max-width: 1350px; */\n  margin: 0 auto;\n}\n.setsearch-title {\n  /* margin-left: 10%; */\n}\n/* ---- grid ---- */\n.grid:after {\n  content: '';\n  display: block;\n  clear: both;\n}\n.grid-wrapper {\n  width: 100%;\n  height: 100%;\n  min-height: 1000px;\n}\n.grid {\n  margin: 0 auto;\n  /* min-width: 540;\n  min-height: 1000px; */\n}\n/* clearfix */\n/* .grid:after {\n  content: '';\n  display: block;\n  clear: both;\n} */\n/* ---- grid-item ---- */\n.grid-item {\n  float: left;\n  width: 260px;\n  /* min-height: 150px; */\n  /* padding: 5px; */\n  /* margin: 5px;  /* masonry does not respect left & right margins, so we need to use gutter : 10 instead */\n  margin-bottom: 10px;\n  /* and to add a margin-bottom for vertical gutter (this is respected by masonry) */\n}\n";});;
define('text!pages/sets/setsearch.html',[],function(){return "<template>\n  <require from=\"./setsheet\"></require>\n  <require from=\"./setfilter\"></require>\n  <require from=\"./setsearch.css\"></require>\n  <require from=\"../../components/mason.css\"></require>\n\n\n  <div class=\"setsearch\">\n\n    <!-- Filtres -->\n    <setfilter filter.bind=\"filter\"></setfilter>\n    <!-- <filter filter.bind=\"filter\"></filter> -->\n\n    <p></p>\n\n    <div class=\"grid-wrapper\">\n      <!-- items -->\n      <!-- show grid only if data is available -->\n      <div class=\"grid\" ref=\"grid\" onchange.call=\"onchange()\">\n        <!-- <div class=\"grid-sizer\"></div> -->\n        <!-- <div class=\"grid-item\" repeat.for=\"item of data\" data.bind=\"item\" style=\"background: pink;\"></div> -->\n        <setsheet class=\"grid-item\" repeat.for=\"set of mason.data\" data.bind=\"set\"></setsheet>\n      </div>\n    </div>\n\n\n  </div>\n\n</template>\n";});;
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('pages/sets/setsheet',["require", "exports", "aurelia-framework", "../build/build", "../sets/setsearch", "aurelia-router", "../../db"], function (require, exports, aurelia_framework_1, build_1, setsearch_1, aurelia_router_1, db_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var setsheet = (function () {
        function setsheet(router) {
            this.data = {};
            this.hidden = "hidden";
            this.router = router;
        }
        setsheet.prototype.isntPseudo = function (effect) {
            var name = effect.name;
            return name.includes("(isntPseudo)");
        };
        setsheet.prototype.equip = function () {
            var _loop_1 = function (item) {
                if (!build_1.build.inst) {
                    window.setTimeout(function () { return build_1.build.setItem(item); }, 300);
                }
                else {
                    build_1.build.setItem(item);
                }
            };
            for (var _i = 0, _a = this.data.items; _i < _a.length; _i++) {
                var item = _a[_i];
                _loop_1(item);
            }
            this.router.navigate("/build");
        };
        setsheet.prototype.attached = function () {
            if (setsearch_1.setsearch.inst)
                setsearch_1.setsearch.inst.onLoadedSheet();
            this.hidden = "";
        };
        setsheet.prototype.getStatColor = function (stat) {
            return db_1.db.getStatColor(stat);
        };
        setsheet.prototype.hoverSet = function () {
            console.log("hover set");
        };
        setsheet.prototype.hoverItem = function () {
            console.log("hover item");
        };
        __decorate([
            aurelia_framework_1.bindable,
            __metadata("design:type", Object)
        ], setsheet.prototype, "data", void 0);
        setsheet = __decorate([
            aurelia_framework_1.inject(aurelia_router_1.Router),
            __metadata("design:paramtypes", [aurelia_router_1.Router])
        ], setsheet);
        return setsheet;
    }());
    exports.setsheet = setsheet;
});
;
define('text!pages/sets/setsheet.css',[],function(){return "setsheet {\n  --sheetaccent: var(--accent1);\n  --sheetaccenthover: var(--accent0);\n  /* background: #1d3030; */\n  /* background: var(--bg1); */\n  cursor: pointer;\n  /* border: 1px solid var(--sheetaccent); */\n  border: 1px solid transparent;\n  /* box-shadow: 5px 5px 5px black; */\n}\nsetsheet .statistics {\n  padding: 5px;\n}\nsetsheet .title {\n  padding: 5px;\n  /* background: var(--sheetaccent); */\n  color: var(--sheetaccent);\n  font-size: 1.1rem;\n}\nsetsheet:hover {\n  border: 1px solid var(--sheetaccenthover);\n}\nsetsheet:hover .title {\n  color: var(--sheetaccenthover);\n}\nsetsheet .items {\n  display: flex;\n}\nsetsheet .items .item {\n  width: 55px;\n  height: 55px;\n}\nsetsheet .items .item img {\n  width: 55px;\n  height: 55px;\n}\nsetsheet .items .item itemsheet {\n  /* Position the tooltip */\n  position: absolute;\n  visibility: collapse;\n  margin-left: -1px;\n  width: 260px;\n  background-color: var(--bg0);\n  pointer-events: none;\n  border: 1px solid var(--accent0);\n  z-index: 2;\n}\nsetsheet .items .item:hover itemsheet,\nsetsheet:hover .items .item:hover itemsheet {\n  visibility: visible;\n  opacity: 99%;\n}\nsetsheet .totalStats {\n  /* Position the tooltip */\n  position: absolute;\n  visibility: collapse;\n  padding-left: 5px;\n  margin-left: -1px;\n  width: 260px;\n  background-color: var(--bg0);\n  border: 1px solid var(--accent0);\n  border-top: none;\n  z-index: 1;\n}\nsetsheet:hover .totalStats {\n  visibility: visible;\n  opacity: 99%;\n}\n";});;
define('text!pages/sets/setsheet.html',[],function(){return "<template>\n  <require from=\"../build/components/itemSlot\"></require>\n  <require from=\"../items/itemsheet\"></require>\n  <require from=\"./setsheet.less\"></require>\n  <!-- <require from=\"/src/pages/items/itemsheet.css\"></require> -->\n\n\n  <!-- englobing class div for css -->\n  <div class=\"setsheet\" onclick.call=\"equip()\" onmouseover.call=\"hoverSet()\" ${hidden}>\n    <!-- <img class=\"bgimg\" src=\"${getImgUrl()}\"> -->\n    <!-- <div class=\"bgimg\" style=\"background-image: url('${getImgUrl()}');\"></div> -->\n\n    <!-- style=\"background-image: '${data.imgUrl}';\" -->\n    <!-- put the image as background ? -->\n    <!-- Image and weapon stats -->\n    <div class=\"title d-flex flex-nowrap\">\n      <!-- Name and level -->\n      <div>\n        <span>${data.name.fr}</span><br>\n      </div>\n      <!-- ${data.description} -->\n    </div>\n\n    <!-- items -->\n    <div class=\"items\">\n      <!-- <item-slot repeat.for=\"item of data.items\" style=\"margin-bottom: 2px;\" id=\"${data[i+10]}\" item.bind=\"item\"></item-slot> -->\n      <div class=\"item\" repeat.for=\"item of data.items\" onmouseover.call=\"hoverItem()\">\n        <img src=\"/src/res/items0/${item.imgUrl}\">\n        <itemsheet data.bind=\"item\"></itemsheet>\n      </div>\n      <!-- <div repeat.for=\"item of data.items\">\n        <img src=\"/src/res/items0/${item.imgUrl}\">\n      </div> -->\n    </div>\n\n    <!-- Effects -->\n    <div class=\"statistics\">\n      <ul style=\"padding: 0;\">\n        <!-- 1 row for each effect -->\n        <li class=\"row\" repeat.for=\"effect of data.bonuses[0]\" if=\"isntPseudo(effect)\">\n          <!-- <compose view-model=\"./statistic\" model.bind=\"effect\"></compose> -->\n          <div class=\"container statistic\">\n            ${effect.min}\n            ${effect.min == null ? \"\" : \"à\"}\n            ${effect.max}\n            <span style.bind=\"getStatColor(effect.name)\">${effect.name}</span>\n            <!-- ${effect} -->\n          </div>\n        </li>\n      </ul>\n    </div>\n\n    <!-- Effects totals -->\n    <div class=\"totalStats\">\n      <ul style=\"padding: 0;\">\n        <!-- 1 row for each effect -->\n        <li class=\"row\" repeat.for=\"effect of data.statistics\" if=\"isntPseudo(effect)\">\n          <!-- <compose view-model=\"./statistic\" model.bind=\"effect\"></compose> -->\n          <div class=\"container statistic\">\n            ${effect.min}\n            ${effect.min == null ? \"\" : \"à\"}\n            ${effect.max}\n            <span style.bind=\"getStatColor(effect.name)\">${effect.name}</span>\n            <!-- ${effect} -->\n          </div>\n        </li>\n      </ul>\n    </div>\n\n    <!-- Conditions -->\n    <!-- <div class=\"conditions\" if.bind=\"data.conditions\" style=\"border-top: 1px dashed var(--accent1);\">\n      <ul style=\"list-style: none; margin: 0px; padding: 0px;\">\n        <li repeat.for=\"cond of data.conditions\">\n          ${cond}\n        </li>\n      </ul>\n    </div> -->\n\n  </div>\n\n</template>\n";});;
define('text!pages/sets/setsheet.less',[],function(){return "setsheet {\n  --sheetaccent: var(--accent1);\n  --sheetaccenthover: var(--accent0);\n  /* background: #1d3030; */\n  /* background: var(--bg1); */\n  cursor: pointer;\n  /* border: 1px solid var(--sheetaccent); */\n  border: 1px solid transparent;\n  /* box-shadow: 5px 5px 5px black; */\n}\nsetsheet .statistics {\n  padding: 5px;\n}\nsetsheet .title {\n    padding: 5px;\n    /* background: var(--sheetaccent); */\n    color: var(--sheetaccent);\n    font-size: 1.1rem;\n}\n\n\nsetsheet:hover {\n  border: 1px solid var(--sheetaccenthover);\n}\nsetsheet:hover .title {\n  color: var(--sheetaccenthover);\n}\n\nsetsheet .items {\n  display: flex;\n}\nsetsheet .items .item {\n  width: 55px;\n  height: 55px;\n}\nsetsheet .items .item img {\n  width: 55px;\n  height: 55px;\n}\n\nsetsheet .items .item itemsheet  {\n  /* Position the tooltip */\n  position: absolute;\n  visibility: collapse;\n  margin-left: -1px;\n  // margin-top: -30px;\n  // display: inline-block;\n  width: 260px;\n  background-color: var(--bg0);\n  // color: #fff;\n  // text-align: center;\n  // border-radius: 6px;\n  // padding: 5px 0;\n  pointer-events: none;\n  border: 1px solid var(--accent0);\n  z-index: 2;\n}\nsetsheet .items .item:hover itemsheet,\nsetsheet:hover .items .item:hover itemsheet {\n  visibility: visible;\n  opacity: 99%;\n}\n\n\nsetsheet .totalStats {\n  /* Position the tooltip */\n  position: absolute;\n  visibility: collapse;\n  padding-left: 5px;\n  // display: none;\n  margin-left: -1px;\n  // margin-top: -30px;\n  // display: inline-block;\n  width: 260px;\n  background-color: var(--bg0);\n  // color: #fff;\n  // text-align: center;\n  // border-radius: 6px;\n  // padding: 5px 0;\n  border: 1px solid var(--accent0);\n  border-top: none;\n  z-index: 1;\n}\nsetsheet:hover .totalStats {\n  // display: block;\n  visibility: visible;\n  opacity: 99%;\n}\n\nsetsheet .setsheet>.statistics {\n}\n//  setsheet:hover .setsheet > .statistics {\n//    display: none;\n// }\n";});;
define('resources/index',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function configure(config) {
    }
    exports.configure = configure;
});
;
define('text!test.json',[],function(){return "{\n  \"hello\": \"hi\"\n}\n";});
define('test.json',['text!test.json'],function(m){return JSON.parse(m);});
define('json!test.json',['test.json'],function(m){return m;});
;
define('util',["require", "exports", "masonry-layout"], function (require, exports, Masonry) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Mason = (function () {
        function Mason() {
            this.fulldata = [];
            this.index = 0;
            this.data = [];
            console.log("mason ctor");
        }
        Mason.prototype.showMore = function (count) {
            var numPerPage = 50;
            if (count)
                numPerPage = count;
            for (var j = 0; j < numPerPage; j++) {
                if (this.index >= this.fulldata.length)
                    return;
                this.data.push(this.fulldata[this.index]);
                this.index++;
            }
        };
        Mason.prototype.loadedCountChanged = function () {
            this.reloadMsnry();
        };
        Mason.prototype.reloadMsnry = function () {
            if (this.msnry) {
                this.msnry.reloadItems();
                this.msnry.layout();
            }
        };
        Mason.prototype.layout = function () {
            if (this.msnry) {
                this.msnry.layout();
            }
        };
        Mason.prototype.initMasonry = function () {
            console.log("mason init");
            if (!this.obj.grid)
                return;
            if (this.msnry)
                this.msnry.destroy();
            if (!this.obj.attachedb || !this.obj.queriedb)
                return;
            var ref = this;
            this.msnry = new Masonry(this.obj.grid, {
                itemSelector: '.grid-item',
                columnWidth: '.grid-item',
                gutter: 10,
                fitWidth: true,
            });
            function onLayout(items) {
                var gridlength = ref.obj.grid ? ref.obj.grid.children.length : 0;
                var datalength = ref.data ? ref.data.length : 0;
            }
            function onLayoutOnce(items) {
            }
            this.msnry.on('layoutComplete', onLayout);
            this.msnry.once('onLayoutOnce', onLayout);
            this.msnry.layout();
        };
        return Mason;
    }());
    exports.Mason = Mason;
    var util = (function () {
        function util() {
        }
        util.caseAndAccentInsensitive = function (text) {
            var accentMap = (function (letters) {
                var map = {};
                while (letters.length > 0) {
                    var letter = "[" + letters.shift() + "]", chars = letter.split('');
                    while (chars.length > 0) {
                        map[chars.shift()] = letter;
                    }
                }
                return map;
            })([
                'aàáâãäå',
                'cç',
                'eèéêë',
                'iìíîï',
                'nñ',
                'oòóôõöø',
                'sß',
                'uùúûü',
                'yÿ'
            ]);
            var f = function (text) {
                var textFold = '';
                if (!text)
                    return textFold;
                text = text.toLowerCase();
                for (var idx = 0; idx < text.length; idx++) {
                    var charAt = text.charAt(idx);
                    textFold += accentMap[charAt] || charAt;
                }
                return "(?i)" + textFold;
            };
            return f(text);
        };
        util.debounce = function (func, wait, immediate) {
            var timeout;
            return function () {
                var context = this, args = arguments;
                var callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(function () {
                    timeout = null;
                    if (!immediate) {
                        func.apply(context, args);
                    }
                }, wait);
                if (callNow)
                    func.apply(context, args);
            };
        };
        return util;
    }());
    exports.util = util;
});
;
define('resources',['resources/index'],function(m){return m;});
//# sourceMappingURL=app-bundle.js.map