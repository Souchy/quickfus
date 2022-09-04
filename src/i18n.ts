import {HttpClient} from 'aurelia-fetch-client';
import * as javaprop from 'java-properties';

export class i18n {

  public static client: HttpClient = new HttpClient();

	public static readProperties(clazz, bundle) {
    // console.log("i18n ctor");
    let path = bundle + "_fr.properties";
    // console.log("check path: " + path);
                            // "./src/res/i18n/itemTypes/itemTypes");
    i18n.client.fetch(path) // "./src/res/i18n/itemTypes/itemTypes_fr.properties")
    .then(response => response.text())
    .then(data => {
      // console.log(data);
      // console.log("read properties " + bundle);
      let me = i18n.makePropertiesFile(data);
      clazz["props"] = me;

      let keys = Object.keys(clazz);
      for (let key of keys) {
        let o = clazz[key];
        if(!o) continue;
        o.key = key;
        o.fr = me.get(key);
        // o.fr = bundle_fr.get(key);
        // o.en = bundle_en.get(key);
        // clazz.en_to_fr[o.en] = o.fr;
        // console.log("key in clazz: " + key + " = " + o + " -> " + o.key + " = " + o.fr);
      }
      // console.log("set properties for " + bundle + ", in " + clazz);
      return true;
    });
	}

  private static makePropertiesFile(data): javaprop.PropertiesFile { //file) {
    var me = new javaprop.PropertiesFile();
    let items = data.split(/\r?\n/);
    for (let i = 0; i < items.length; i++) {
      let line = items[i];
      while (line.substring(line.length - 1) === '\\') {
        line = line.slice(0, -1);
        let nextLine = items[i + 1];
        line = line + nextLine.trim();
        i++;
      }
      me.makeKeys(line);
    }
    return me;
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
	public key: string;
	public fr: string;
	public en: string;

	public static en_to_fr = {};
  public static values: EnumItemType[] = [];
  public static props: javaprop.PropertiesFile;

	public constructor() {
    EnumItemType.values.push(this);
    // console.log("ItemType ctor pushed to values " + this);
	}

  public static findKeyFrench(french: string) {
    for(let i of EnumItemType.values) {
      // let type = EnumItemType.values[i];
      // console.log("find key i="+i); // + ", type="+type);
      if(!i.fr) continue;
      if(i.fr == french) {
        return i.key;
      }
    }
    console.log("null key for french: " + french);
    return null;
  }

	// items
	public static HAT = new EnumItemType();
	public static CAPE = new EnumItemType();
	public static BACKPACK = new EnumItemType();
	public static AMULET = new EnumItemType();
	public static RING = new EnumItemType();
	public static BELT = new EnumItemType();
	public static BOOTS = new EnumItemType();
	public static SHIELD = new EnumItemType();
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
	public key: string;
	public fr: string;
	public en: string;

	public static en_to_fr = {};
  public static values: EnumWeaponStat[] = [];
  public static props: javaprop.PropertiesFile;

	public constructor() {
    EnumWeaponStat.values.push(this);
	}

  public static findKeyFrench(french: string) {
    for(let i of EnumWeaponStat.values) {
      // let type = EnumItemType.values[i];
      // console.log("find key i="+i); // + ", type="+type);
      if(!i.fr) continue;
      if(i.fr == french) {
        return i.key;
      }
    }
    console.log("null key for french: " + french);
    return null;
  }

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
  
	public static HEAL = new EnumWeaponStat();
}

export class EnumStat {
	public key: string;
	public fr: string;
	public en: string;

	public static en_to_fr = {};
  public static values: EnumStat[] = [];
  public static props: javaprop.PropertiesFile;

	public constructor() {
    EnumStat.values.push(this);
	}

  public static findKeyFrench(french: string) {
    for(let i of EnumStat.values) {
      // let type = EnumItemType.values[i];
      // console.log("find key i="+i); // + ", type="+type);
      if(!i.fr) continue;
      if(i.fr == french) {
        return i.key;
      }
    }
    console.log("null key for french: " + french);
    return null;
  }
  public static getKeyIdFrench(french: string) {
    let id = 0;
    for(let i of EnumStat.values) {
      if(!i.fr) continue;
      if(i.fr == french) {
        return id;
      }
      id++;
    }
    console.log("null key for french: " + french);
    return null;
  }

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
