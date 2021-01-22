package github.souchy.ankama.dofusbuilder.backend.jade;

import java.util.HashMap;
import java.util.Locale;
import java.util.Map;
import java.util.ResourceBundle;

public enum WeaponStats {

	// properties
	USES_PER_TURN,
	RANGE_MIN,
	RANGE_MAX,
	COST,
	DMG_CRITICAL,
	CRITICAL,

	// effects
	AP,
	MP,
	
	DMG_NEUTRAL,
	DMG_FIRE,
	DMG_EARTH,
	DMG_WATER,
	DMG_AIR,
	
	STEAL_NEUTRAL,
	STEAL_FIRE,
	STEAL_EARTH,
	STEAL_WATER,
	STEAL_AIR,
	;

	public static final Map<String, String> en_to_fr = new HashMap<>();
	static {
		String path = "weaponStats/weaponStats";
		ResourceBundle bundle_en = ResourceBundle.getBundle(path, Locale.ENGLISH);
		ResourceBundle bundle_fr = ResourceBundle.getBundle(path, Locale.FRENCH);
		for(var e : Stats.values()) {
			e.key = e.name();
			e.en = bundle_en.getString(e.key);
			e.fr = bundle_fr.getString(e.key);
			en_to_fr.put(e.en, e.fr);
		}
	}
	
	
}
