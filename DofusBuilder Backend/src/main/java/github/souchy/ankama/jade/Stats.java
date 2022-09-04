package github.souchy.ankama.jade;


import java.util.HashMap;
import java.util.Locale;
import java.util.Map;
import java.util.ResourceBundle;

import github.souchy.ankama.quickfus.Log;


public enum Stats {

	// -------------- Fight stats
	
	LIFE,

	// -------------- Other
	
	AP,
	MP,
	RANGE,
	INITIATIVE,
	PROSPECTING,
	CRITICAL,
	SUMMONS,
	LOCK,
	DODGE,
	AP_PARRY,
	MP_PARRY,
	AP_REDUCTION,
	MP_REDUCTION,
	HEALS,
	PODS,
	REFLECT,
	
	
	// -------------- Main / Dmg
	
	VITALITY,
	WISDOM,
	INTELLIGENCE,
	STRENGTH,
	CHANCE,
	AGILITY,
	POWER,

	DMG_PER_FINAL,
	DMG_PER_SPELL,
	DMG_PER_WEAPON,
	DMG_PER_MELEE,
	DMG_PER_RANGED,
	DMG_PER_TRAP,
	
	DMG,
	DMG_NEUTRAL,
	DMG_FIRE,
	DMG_EARTH,
	DMG_WATER,
	DMG_AIR,
	DMG_CRITICAL,
	DMG_PUSHBACK,
	DMG_TRAP,
	
	// -------------- Res

	RES_PER_FINAL,
	RES_PER_SPELL,
	RES_PER_WEAPON,
	RES_PER_MELEE,
	RES_PER_RANGED,

	RES_PER_NEUTRAL,
	RES_PER_FIRE,
	RES_PER_EARTH,
	RES_PER_WATER,
	RES_PER_AIR,

	RES_NEUTRAL,
	RES_FIRE,
	RES_EARTH,
	RES_WATER,
	RES_AIR,
	RES_CRITICAL,
	RES_PUSHBACK
	
	;
	
	public String key;
	public String en;
	public String fr;
	
	
	public static final Map<String, String> en_to_fr = new HashMap<>();
	static {
		String path = "stats/stats";
		ResourceBundle bundle_en = ResourceBundle.getBundle(path, Locale.ENGLISH);
		ResourceBundle bundle_fr = ResourceBundle.getBundle(path, Locale.FRENCH);
		for(var e : Stats.values()) {
			e.key = e.name();
			e.en = bundle_en.getString(e.key).toLowerCase();
			e.fr = bundle_fr.getString(e.key);
			en_to_fr.put(e.en, e.fr);
			// Log.info(e.toString());
		}
	}
	
	@Override
	public String toString() {
		return String.format("{ key: %s, en: %s, fr: %s }", key, en, fr);
	}
	
}
