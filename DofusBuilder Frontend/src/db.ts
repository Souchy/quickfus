
import { inject, PLATFORM } from 'aurelia-framework';
import { WebAPI } from 'api';
import { i18n, EnumStat, EnumWeaponStat, EnumItemType, EnumItemSlot } from './i18n';

export class db {

	public constructor() {
		db.init(true);
	}

	public static init(force?: boolean) {
		i18n.readProperties(EnumStat, "./src/res/i18n/stats/stats");
		i18n.readProperties(EnumWeaponStat, "./src/res/i18n/weaponStats/weaponStats");
		i18n.readProperties(EnumItemType, "./src/res/i18n/itemTypes/itemTypes");
	}

	public static translateStat(str): String {

		return "";
	}

	public static getImgUrl(item) {
		if (item == null) return "";
		let name = item.imgUrl;
    let type = EnumItemType.findKeyFrench(item.type);
    return "./src/res/items/" + type + "/" + name;
    // return "./src/res/items1/" + name;
	}

	public static getStatColor(name: string) {
		switch (name) {
			case "PA": return "color: gold;"
			case "PM": return "color: #03fc3d;"
			case "Vitalité": return "color: #e1c699;";
			// case "Vitalité": return "color: beige;";
			// case "Sagesse": return "color: purple;";
			case "% Résistance Neutre":
				return "color: gray;";
			case "% Résistance Terre":
			case "Force":
				return "color: #965948;"; // brown
			case "% Résistance Feu":
			case "Intelligence":
				return "color: #c42b00;" // red
			case "% Résistance Eau":
			case "Chance":
				return "color: #34bdeb;" // blue
			case "% Résistance Air":
			case "Agilité":
				return "color: #0d9403;" // green
			case "Puissance":
				return "color: purple;"; //
			default: return "";
		}
	}

	public static getStatNames() {
		// console.log("db getStatNames");
		// return new Map<string, string[]>(JSON.parse(localStorage.getItem("statsnames")));

		var sections = new Map<string, string[]>();
		sections.set("", ["Vie", "Initiative", "PA", "PM", "Portée", "Invocations", "% Critique"]);
		sections.set("Caractéristiques primaires", ["Vitalité", "Sagesse", "Force", "Intelligence", "Chance", "Agilité", "Puissance"]);
		sections.set("Dommages", [
			"Dommages", "Dommages neutre", "Dommages Terre", "Dommages Feu", "Dommages Eau", "Dommages Air",
			"Dommages aux pièges", "Puissance aux pièges",
			"Dommages Critiques", "Dommages de poussée",
			"% Dommages distance", "% Dommages mêlée", "% Dommages aux sorts", "% Dommages d'armes"
		]);
		sections.set("Caractéristiques secondaires", ["Prospection", "Tacle", "Fuite", "Retrait PA", "Retrait PM", "Esquive PA", "Esquive PM", "Soins"])
		sections.set("Résistances", [
			"% Résistance Neutre", "% Résistance Terre", "% Résistance Feu", "% Résistance Eau", "% Résistance Air",
			"Résistance Neutre", "Résistance Terre", "Résistance Feu", "Résistance Eau", "Résistance Air",
			"Résistance Critiques", "Résistance Poussée",
			"% Résistance distance", "% Résistance mêlée"
		]);
		return sections;
	}
  
	public static getElementsStats() {
		return ["Force", "Intelligence", "Chance", "Agilité"];
	}
	public static getElementsNames() {
		return ["Neutre", "Terre", "Feu", "Eau", "Air"];
	}
	public static getStatByElement(ele: string) {
		if (ele == "Neutre") return "Force";
		return this.getElementsStats()[this.getElementsNames().indexOf(ele) - 1];
	}
	public static getBaseStatNames() {
		return ["Vitalité", "Sagesse", "Force", "Intelligence", "Chance", "Agilité"];
	}
	public static getCombatStatsNames() {
		return [
			"Tacle", "Esquive PA", "Esquive PM", "Résistance Critiques", "Résistance Poussée",
      // les résistances sont fetched par les noms d'éléments
			// "Résistance Neutre", "Résistance Terre", "Résistance Feu", "Résistance Eau", "Résistance Air",
			// "% Résistance Neutre", "% Résistance Terre", "% Résistance Feu", "% Résistance Eau", "% Résistance Air",
		];
	}

	public static getSlotNames() {
		return [
			'Amulette', 'Bouclier', 'Anneau1', 'Ceinture', 'Bottes',
			'Chapeau', 'Arme', 'Anneau2', 'Cape', 'Familier',
			'Dofus1', 'Dofus2', 'Dofus3', 'Dofus4', 'Dofus5', 'Dofus6',
		];
	}
	public static getItemsTypes() {
		return ["Amulette", "Anneau", "Chapeau", "Cape", "Sac à dos", "Ceinture", "Bottes", "Bouclier", "Dofus", "Trophée", "Prysmaradite"]
	}
	public static getWeaponsTypes() {
		return ["Épée", "Marteau", "Pelle", "Hache", "Bâton", "Dague", "Arc", "Baguette", "Faux", "Pioche", "Arme magique", "Outil"]
	}
	public static getPetTypes() {
		return ["Familier", "Montilier", "Montures"]; // Montures inclu les dd, muldos et volkornes
	}
	public static getWeaponCharacteristics() {
		return ["PA", "Portée", "CC"];
	}
	public static getSpellCharacteristics() {
		return ["PA", "Portée", "CC", "LoS"];
	}

	public static getIconStyle(mod: string) {
    if(!mod) return "";
    if(mod == "") return "";
		if (mod == "PA") return db.sprite(97, 243);
		if (mod == "PM") return db.sprite(97, 52);
		if (mod.toLowerCase().includes("portée")) return db.sprite(97, 128);

		if (mod.toLowerCase().includes("initiative")) return db.sprite(97, 205);
		if (mod.toLowerCase().includes("invocation")) return db.sprite(97, 507);
		if (mod.toLowerCase().includes("% critique")) return db.sprite(97, 589);
		if (mod.toLowerCase().includes("prospection")) return db.sprite(97, 279);

		if (mod.toLowerCase().includes("vie")) return db.sprite(97, 919);
		if (mod.toLowerCase().includes("vitalité")) return db.sprite(97, 319);
		if (mod.toLowerCase().includes("sagesse")) return db.sprite(97, 358);

		if (mod.toLowerCase().includes("neutre")) return db.sprite(95, 15);
		if (mod.toLowerCase().includes("force") || mod.toLowerCase().includes("terre")) return db.sprite(97, 432);
		if (mod.toLowerCase().includes("intelligence") || mod.toLowerCase().includes("feu")) return db.sprite(97, 394);
		if (mod.toLowerCase().includes("chance") || mod.toLowerCase().includes("eau")) return db.sprite(97, 89);
		if (mod.toLowerCase().includes("agilité") || mod.toLowerCase().includes("air")) return db.sprite(97, 167);
		if (mod == "Puissance") return db.sprite(97, 1108);

		if (mod.toLowerCase().includes("tacle")) return db.sprite(97, 545);
		if (mod.toLowerCase().includes("fuite")) return db.sprite(97, 469);

		if (mod.toLowerCase().includes("résistance poussée")) return db.sprite(97, 832);
		if (mod.toLowerCase().includes("résistance critique")) return db.sprite(97, 1200);
		if (mod.toLowerCase().includes("esquive pm")) return db.sprite(97, 1016);
		if (mod.toLowerCase().includes("esquive pa")) return db.sprite(97, 1064);
		if (mod.toLowerCase().includes("retrait pa")) return db.sprite(97, 1340);
		if (mod.toLowerCase().includes("retrait pm")) return db.sprite(97, 1340);

		if (mod.toLowerCase().includes("soin")) return db.sprite(97, 966);
		if (mod.toLowerCase().includes("pv rendus")) return db.sprite(97, 966);
		if (mod == "Dommages") return db.sprite(97, 1156);
		if (mod == "Dommages Poussée") return db.sprite(97, 872);
		if (mod == "Dommages Critiques") return db.sprite(97, 1248);
		if (mod == "Puissance aux pièges") return db.sprite(97, 672);
		if (mod == "Dommages aux pièges") return db.sprite(97, 712);

		return "";
	}
	private static sprite(x: number, y: number) {
		return "display: inline-block; width: 22px; height: 22px; background-image: url('./src/res/icons.png'); background-position: -" + x + "px; background-position-y: -" + y + "px; zoom: 1.0; vertical-align: middle;"
	}


}
