package github.souchy.ankama.jade;

import java.util.HashMap;
import java.util.Locale;
import java.util.Map;
import java.util.ResourceBundle;

public enum ItemTypes {
	
	// items
	HAT,
	CAPE,
	BACKPACK,
	AMULET,
	RING,
	BELT,
	BOOTS,
	SHIELD,
	// dofus
	DOFUS,
	TROPHY,
	PRYSMARADITE,
	// pets
	PET,
	PETSMOUNT,
	// mounts
	MOUNT,
	SEEMYOL,
	DRAGOTURKEY,
	RHINENEETLE,
	// weapons
	SWORD,
	HAMMER,
	SHOVEL,
	AXE,
	STAFF,
	DAGGER,
	BOW,
	WAND,
	SCYTHE,
	PICKAXE,
	MAGIC_WEAPON,
	TOOL,
	;

	public String key;
	public String en;
	public String fr;

	public static final Map<String, String> en_to_fr = new HashMap<>();
	static {
		String path = "itemTypes/itemTypes";
		ResourceBundle bundle_en = ResourceBundle.getBundle(path, Locale.ENGLISH);
		ResourceBundle bundle_fr = ResourceBundle.getBundle(path, Locale.FRENCH);
		for(var e : ItemTypes.values()) {
			e.key = e.name();
			e.en = bundle_en.getString(e.key);
			e.fr = bundle_fr.getString(e.key);
			en_to_fr.put(e.en, e.fr);
//			Log.info("itemtype " + e.en + " = " + e.fr);
		}
	}

	public static ItemTypes getKeyEnglish(String str) {
		for(var type : ItemTypes.values()) {
			if(type.en.contentEquals(str))
				return type;
		}
		return null;
	}
	
}
