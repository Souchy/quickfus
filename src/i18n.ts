
// import { StatEnumEn, ItemTypeEn, ItemSlotEn } from './constants_en';
// import { StatEnumFr, ItemTypeFr, ItemSlotFr } from './constants_fr';

// import * as PropertiesReader from 'properties-reader';
// import PropertiesReader = require('properties-reader');

// import * as fs from 'fs';
// import * as path from 'path';

// import * as properties from 'properties';
// import properties = require("properties");

// import * as stats_fr from 'stats.properties';

export class i18n {

	// public static stats = new Map<string, string>();
	// public static itemType = new Map<string, string>();
	// public static itemSlot = new Map<string, string>();
	//
	// public constructor() {
	// 	let keysEn = Object.keys(StatEnumEn.inst);
	// 	for (let key in keysEn) {
	// 		i18n.stats[StatEnumEn.inst[key]] = StatEnumFr.inst[key];
	// 	}
	// }
	//
	// public static statByKey(key) {
	// 	return StatEnumFr.inst[key];
	// }
	// public static statByName(str) {
	// 	return this.stats[str];
	// }

	public static readProperties(clazz, bundle) {
		// properties("");
		// properties.parse("myprop = hello", { path: true }, function(error, obj) {
		// 	if (error) return console.error(error);
		//
		// 	console.log(obj);
		// 	//{ a: 1, b: 2 }
		// });

		// console.log("i18n file : " + file);
		// var bundle_fr = PropertiesReader(bundle + "_fr.properties");
		// var bundle_en = PropertiesReader(bundle + "_en.properties");

		// let keys = Object.keys(clazz);
		// for (let key in keys) {
		// 	let o = clazz[key];
		// 	o.key = key;
		// 	o.fr = bundle_fr.get(key);
		// 	o.en = bundle_en.get(key);
		// 	clazz.en_to_fr[o.en] = o.fr;
		// }
	}

}



export class EnumItemSlot {
	public static WEAPON = "Arme";
	public static HAT = "Chapeau";
	public static CAPE = "Cape";
	public static AMULET = "Amulette";
	public static RING = "Anneau";
	public static RING1 = "Anneau1";
	public static RING2 = "Anneau2";
	public static BELT = "Ceinture";
	public static BOOTS = "Bottes";
	public static PET = "Familier";
	public static DOFUS1 = "Dofus1";
	public static DOFUS2 = "Dofus2";
	public static DOFUS3 = "Dofus3";
	public static DOFUS4 = "Dofus4";
	public static DOFUS5 = "Dofus5";
	public static DOFUS6 = "Dofus6";
}

export class EnumItemType {
	public key: String;
	public fr: String;
	public en: String;

	public constructor() {
	}

	public static en_to_fr = {};

	// items
	public static HAT = new EnumItemType();
	public static CAPE = new EnumItemType();
	public static BACKPACK = new EnumItemType();
	public static AMULET = new EnumItemType();
	public static RING = new EnumItemType();
	public static BELT = new EnumItemType();
	public static BOOTS = new EnumItemType();
	// dofus
	public static DOFUS = new EnumItemType();
	public static TROPHY = new EnumItemType();
	public static PRYSMARADITE = new EnumItemType();
	// pets
	public static PET = new EnumItemType();
	public static PETSMOUNT = new EnumItemType();
	// mounts
	public static MOUNT = new EnumItemType();
	public static SEEMYOL = new EnumItemType();
	public static DRAGOTURKEY = new EnumItemType();
	public static RHINENEETLE = new EnumItemType();
	// weapons
	public static SWORD = new EnumItemType();
	public static HAMMER = new EnumItemType();
	public static SHOVEL = new EnumItemType();
	public static AXE = new EnumItemType();
	public static STAFF = new EnumItemType();
	public static DAGGER = new EnumItemType();
	public static BOW = new EnumItemType();
	public static WAND = new EnumItemType();
	public static SCYTHE = new EnumItemType();
	public static PICKAXE = new EnumItemType();
	public static MAGIC_WEAPON = new EnumItemType();
	public static TOOL = new EnumItemType();
}

export class EnumWeaponStat {
	public key: String;
	public fr: String;
	public en: String;

	public constructor() {
	}

	public static en_to_fr = {};

	// properties
	public static USES_PER_TURN = new EnumWeaponStat();
	public static RANGE_MIN = new EnumWeaponStat();
	public static RANGE_MAX = new EnumWeaponStat();
	public static COST = new EnumWeaponStat();
	public static DMG_CRITICAL = new EnumWeaponStat();
	public static CRITICAL = new EnumWeaponStat();

	// effects
	public static AP = new EnumWeaponStat();
	public static MP = new EnumWeaponStat();

	public static DMG_NEUTRAL = new EnumWeaponStat();
	public static DMG_FIRE = new EnumWeaponStat();
	public static DMG_EARTH = new EnumWeaponStat();
	public static DMG_WATER = new EnumWeaponStat();
	public static DMG_AIR = new EnumWeaponStat();

	public static STEAL_NEUTRAL = new EnumWeaponStat();
	public static STEAL_FIRE = new EnumWeaponStat();
	public static STEAL_EARTH = new EnumWeaponStat();
	public static STEAL_WATER = new EnumWeaponStat();
	public static STEAL_AIR = new EnumWeaponStat();
}

export class EnumStat {
	public key: String;
	public fr: String;
	public en: String;

	public constructor() {
	}

	public static en_to_fr = {};


	public static LIFE = new EnumStat();

	public static AP = new EnumStat();
	public static MP = new EnumStat();
	public static RANGE = new EnumStat();
	public static INITIATIVE = new EnumStat();
	public static PROSPECTING = new EnumStat();
	public static CRITICAL = new EnumStat();
	public static SUMMONS = new EnumStat();
	public static LOCK = new EnumStat();
	public static DODGE = new EnumStat();
	public static AP_PARRY = new EnumStat();
	public static MP_PARRY = new EnumStat();
	public static AP_REDUCTION = new EnumStat();
	public static MP_REDUCTION = new EnumStat();
	public static HEALS = new EnumStat();
	public static PODS = new EnumStat();
	public static REFLECT = new EnumStat();

	public static VITALITY = new EnumStat();
	public static WISDOM = new EnumStat();
	public static INTELLIGENCE = new EnumStat();
	public static STRENGTH = new EnumStat();
	public static CHANCE = new EnumStat();
	public static AGILITY = new EnumStat();
	public static POWER = new EnumStat();

	public static DMG_PER_FINAL = new EnumStat();
	public static DMG_PER_SPELL = new EnumStat();
	public static DMG_PER_WEAPON = new EnumStat();
	public static DMG_PER_MELEE = new EnumStat();
	public static DMG_PER_RANGED = new EnumStat();
	public static DMG_PER_TRAP = new EnumStat();

	public static DMG = new EnumStat();
	public static DMG_NEUTRAL = new EnumStat();
	public static DMG_FIRE = new EnumStat();
	public static DMG_EARTH = new EnumStat();
	public static DMG_WATER = new EnumStat();
	public static DMG_AIR = new EnumStat();
	public static DMG_CRITICAL = new EnumStat();
	public static DMG_PUSHBACK = new EnumStat();
	public static DMG_TRAP = new EnumStat();


	public static RES_PER_FINAL = new EnumStat();
	public static RES_PER_SPELL = new EnumStat();
	public static RES_PER_WEAPON = new EnumStat();
	public static RES_PER_MELEE = new EnumStat();
	public static RES_PER_RANGED = new EnumStat();

	public static RES_PER_NEUTRAL = new EnumStat();
	public static RES_PER_FIRE = new EnumStat();
	public static RES_PER_EARTH = new EnumStat();
	public static RES_PER_WATER = new EnumStat();
	public static RES_PER_AIR = new EnumStat();

	public static RES_NEUTRAL = new EnumStat();
	public static RES_FIRE = new EnumStat();
	public static RES_EARTH = new EnumStat();
	public static RES_WATER = new EnumStat();
	public static RES_AIR = new EnumStat();

}
